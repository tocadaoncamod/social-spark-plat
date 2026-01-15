import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Categorias de moda para classificação
const FASHION_CATEGORIES = {
  atacadista: {
    keywords: ["atacado", "atacadista", "revenda", "lojista", "revendedor", "pronta entrega", "grade", "pedido mínimo", "kit", "pacote", "fardo"],
    description: "Vendedores/Fornecedores de Atacado"
  },
  varejista: {
    keywords: ["varejo", "pronta entrega", "peça única", "disponível", "tam", "tamanho", "cor", "compre", "entrega", "pix", "parcela"],
    description: "Vendedores de Varejo"
  },
  comprador: {
    keywords: ["procuro", "quero", "alguém vende", "quem tem", "preciso", "onde encontro", "indica"],
    description: "Compradores Potenciais"
  },
  modaFeminina: {
    keywords: ["vestido", "saia", "blusa feminina", "calça feminina", "conjunto feminino", "macacão", "cropped", "body", "shorts feminino", "lingerie"],
    description: "Moda Feminina"
  },
  modaMasculina: {
    keywords: ["camisa masculina", "calça masculina", "bermuda", "camiseta", "polo", "blazer masculino", "terno", "cueca"],
    description: "Moda Masculina"
  },
  modaInfantil: {
    keywords: ["infantil", "bebê", "kids", "criança", "menino", "menina", "juvenil", "escolar", "conjuntinho"],
    description: "Moda Infantil"
  },
  acessorios: {
    keywords: ["bolsa", "carteira", "cinto", "relógio", "bijuteria", "óculos", "chapéu", "boné", "lenço", "echarpe", "mochila", "tiara", "laço"],
    description: "Acessórios"
  }
};

interface ScrapedStatus {
  phone: string;
  text: string;
  timestamp: number;
  hasMedia: boolean;
  mediaType?: string;
}

interface ClassifiedLead {
  phone_number: string;
  name: string | null;
  bio: string | null;
  source: string;
  source_metadata: {
    status_text: string;
    timestamp: number;
    categories: string[];
    business_type: string;
    ai_analysis?: string;
  };
  keywords_matched: string[];
  relevance_score: number;
  business_name: string | null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { instanceId, keywords, categories, useAI } = await req.json();

    // Get Evolution API credentials
    const evolutionUrl = Deno.env.get("EVOLUTION_API_URL");
    const evolutionApiKey = Deno.env.get("EVOLUTION_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!evolutionUrl || !evolutionApiKey) {
      throw new Error("Evolution API credentials not configured");
    }

    // Get instance info
    const supabase = createClient(supabaseUrl!, supabaseKey!);
    
    const { data: instance, error: instanceError } = await supabase
      .from("whatsapp_instances")
      .select("instance_name")
      .eq("id", instanceId)
      .single();

    if (instanceError || !instance) {
      throw new Error("Instance not found");
    }

    // Fetch statuses from Evolution API
    const statusResponse = await fetch(
      `${evolutionUrl}/chat/findStatusMessage/${instance.instance_name}`,
      {
        headers: {
          apikey: evolutionApiKey,
          "Content-Type": "application/json",
        },
      }
    );

    if (!statusResponse.ok) {
      const errorText = await statusResponse.text();
      console.error("Evolution API error:", errorText);
      throw new Error(`Failed to fetch statuses: ${statusResponse.status}`);
    }

    const statusData = await statusResponse.json();
    const statuses = statusData.status || statusData || [];

    console.log(`Fetched ${statuses.length} statuses`);

    // Extract and filter statuses
    const scrapedStatuses: ScrapedStatus[] = [];
    
    for (const status of statuses) {
      const text = extractStatusText(status);
      if (!text) continue;

      const phone = status.key?.remoteJid?.split("@")[0] || "";
      if (!phone) continue;

      scrapedStatuses.push({
        phone,
        text,
        timestamp: status.messageTimestamp || Date.now() / 1000,
        hasMedia: !!status.message?.imageMessage || !!status.message?.videoMessage,
        mediaType: status.message?.imageMessage ? "image" : status.message?.videoMessage ? "video" : undefined,
      });
    }

    console.log(`Extracted ${scrapedStatuses.length} statuses with text`);

    // Filter by keywords
    const allKeywords = [
      ...keywords,
      ...getKeywordsFromCategories(categories || []),
    ];

    const filteredStatuses = scrapedStatuses.filter((status) =>
      allKeywords.some((kw) => status.text.toLowerCase().includes(kw.toLowerCase()))
    );

    console.log(`Filtered to ${filteredStatuses.length} matching statuses`);

    // Classify leads
    let classifiedLeads: ClassifiedLead[] = filteredStatuses.map((status) => 
      classifyLead(status, allKeywords)
    );

    // Use AI for enhanced classification if enabled
    if (useAI && classifiedLeads.length > 0) {
      classifiedLeads = await enhanceWithAI(classifiedLeads);
    }

    // Sort by relevance
    classifiedLeads.sort((a, b) => b.relevance_score - a.relevance_score);

    return new Response(
      JSON.stringify({
        success: true,
        leads: classifiedLeads,
        stats: {
          totalStatuses: statuses.length,
          extractedWithText: scrapedStatuses.length,
          matchingKeywords: filteredStatuses.length,
          uniqueLeads: classifiedLeads.length,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Status scraper error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function extractStatusText(status: any): string {
  return (
    status.message?.conversation ||
    status.message?.extendedTextMessage?.text ||
    status.message?.imageMessage?.caption ||
    status.message?.videoMessage?.caption ||
    ""
  );
}

function getKeywordsFromCategories(categoryIds: string[]): string[] {
  const keywords: string[] = [];
  for (const catId of categoryIds) {
    const category = FASHION_CATEGORIES[catId as keyof typeof FASHION_CATEGORIES];
    if (category) {
      keywords.push(...category.keywords);
    }
  }
  return keywords;
}

function classifyLead(status: ScrapedStatus, keywords: string[]): ClassifiedLead {
  const textLower = status.text.toLowerCase();
  
  // Find matched keywords
  const matchedKeywords = keywords.filter((kw) =>
    textLower.includes(kw.toLowerCase())
  );

  // Determine categories
  const categories: string[] = [];
  let businessType = "indefinido";

  for (const [catId, category] of Object.entries(FASHION_CATEGORIES)) {
    if (category.keywords.some((kw) => textLower.includes(kw.toLowerCase()))) {
      categories.push(catId);
      
      // Determine main business type
      if (catId === "atacadista") businessType = "Atacadista/Fornecedor";
      else if (catId === "varejista" && businessType === "indefinido") businessType = "Varejista";
      else if (catId === "comprador" && businessType === "indefinido") businessType = "Comprador Potencial";
    }
  }

  // Calculate relevance score
  let score = 0.3; // Base score
  score += Math.min(matchedKeywords.length * 0.1, 0.3); // Keywords match
  score += Math.min(categories.length * 0.1, 0.2); // Categories match
  if (status.hasMedia) score += 0.1; // Has media (more engaged seller)
  
  // Recency bonus
  const hoursSince = (Date.now() / 1000 - status.timestamp) / 3600;
  if (hoursSince < 6) score += 0.1;
  else if (hoursSince < 24) score += 0.05;

  return {
    phone_number: status.phone,
    name: null,
    bio: status.text.slice(0, 500),
    source: "whatsapp_status",
    source_metadata: {
      status_text: status.text,
      timestamp: status.timestamp,
      categories,
      business_type: businessType,
    },
    keywords_matched: matchedKeywords,
    relevance_score: Math.min(score, 1.0),
    business_name: null,
  };
}

async function enhanceWithAI(leads: ClassifiedLead[]): Promise<ClassifiedLead[]> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) return leads;

  // Process in batches of 10
  const batchSize = 10;
  const enhancedLeads: ClassifiedLead[] = [];

  for (let i = 0; i < leads.length; i += batchSize) {
    const batch = leads.slice(i, i + batchSize);
    
    const leadsInfo = batch.map((lead, idx) => 
      `${idx + 1}. "${lead.bio?.slice(0, 200) || ""}"`
    ).join("\n");

    try {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content: `Você é um especialista em classificar leads de moda. Analise os textos de status do WhatsApp e para cada um retorne um JSON com:
- tipo: "atacadista", "varejista", "comprador" ou "indefinido"
- interesse: nível de interesse comercial de 1-10
- categoria_principal: "feminino", "masculino", "infantil", "acessorios" ou "misto"
- observacao: uma frase curta sobre o potencial do lead

Responda APENAS com um array JSON, sem markdown.`,
            },
            {
              role: "user",
              content: `Classifique estes ${batch.length} leads de status do WhatsApp:\n\n${leadsInfo}`,
            },
          ],
          max_completion_tokens: 1000,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || "";
        
        try {
          // Try to parse JSON from response
          const jsonMatch = content.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            const aiResults = JSON.parse(jsonMatch[0]);
            
            for (let j = 0; j < batch.length; j++) {
              const aiResult = aiResults[j];
              if (aiResult) {
                batch[j].source_metadata.ai_analysis = aiResult.observacao;
                batch[j].source_metadata.business_type = 
                  aiResult.tipo === "atacadista" ? "Atacadista/Fornecedor" :
                  aiResult.tipo === "varejista" ? "Varejista" :
                  aiResult.tipo === "comprador" ? "Comprador Potencial" :
                  batch[j].source_metadata.business_type;
                
                // Adjust score based on AI interest level
                if (aiResult.interesse) {
                  batch[j].relevance_score = Math.min(
                    batch[j].relevance_score + (aiResult.interesse / 50),
                    1.0
                  );
                }
              }
            }
          }
        } catch (parseError) {
          console.error("Failed to parse AI response:", parseError);
        }
      }
    } catch (aiError) {
      console.error("AI enhancement error:", aiError);
    }

    enhancedLeads.push(...batch);
  }

  return enhancedLeads;
}
