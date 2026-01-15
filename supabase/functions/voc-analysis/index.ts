import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Review {
  id: string;
  content: string;
  rating: number;
  date: string;
  author?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, reviews, productName, productCategory } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    switch (action) {
      case "sentiment_analysis":
        systemPrompt = `Você é um especialista em análise de sentimento e VOC (Voice of Customer) para e-commerce. 
        Analise reviews de clientes com precisão, identificando emoções, intenções e padrões de comportamento.
        Sempre responda em português brasileiro com insights acionáveis.`;
        
        userPrompt = `Analise os seguintes reviews do produto "${productName}" (categoria: ${productCategory}):

${reviews?.map((r: Review, i: number) => `Review ${i + 1} (${r.rating}★): "${r.content}"`).join('\n') || 'Nenhum review disponível'}

Gere uma análise VOC completa em JSON:
{
  "overall_sentiment": {
    "score": number (0-100),
    "label": "muito_negativo" | "negativo" | "neutro" | "positivo" | "muito_positivo",
    "trend": "melhorando" | "estável" | "piorando"
  },
  "sentiment_distribution": {
    "positive": number (%),
    "neutral": number (%),
    "negative": number (%)
  },
  "pain_points": [
    {
      "issue": "string",
      "frequency": "alta" | "média" | "baixa",
      "severity": "crítico" | "moderado" | "leve",
      "example_quote": "string"
    }
  ],
  "positive_highlights": [
    {
      "aspect": "string",
      "frequency": "alta" | "média" | "baixa",
      "example_quote": "string"
    }
  ],
  "usage_scenarios": [
    {
      "scenario": "string",
      "frequency": number (%),
      "sentiment": "positivo" | "neutro" | "negativo"
    }
  ],
  "customer_personas": [
    {
      "name": "string",
      "description": "string",
      "percentage": number,
      "main_needs": ["string"]
    }
  ],
  "recommendations": [
    {
      "priority": "alta" | "média" | "baixa",
      "action": "string",
      "expected_impact": "string"
    }
  ],
  "word_cloud": [
    {"word": "string", "count": number, "sentiment": "positivo" | "neutro" | "negativo"}
  ],
  "summary": "string (resumo executivo em 2-3 frases)"
}`;
        break;

      case "generate_response":
        systemPrompt = `Você é um especialista em atendimento ao cliente para e-commerce.
        Gere respostas profissionais, empáticas e personalizadas para reviews de clientes.
        As respostas devem ser em português brasileiro, curtas (2-3 frases) e acionáveis.`;
        
        userPrompt = `Gere uma resposta para este review do produto "${productName}":
Rating: ${reviews?.[0]?.rating}★
Review: "${reviews?.[0]?.content}"

Responda em JSON:
{
  "response": "string (resposta para o cliente)",
  "tone": "empático" | "profissional" | "apologético" | "agradecido",
  "follow_up_action": "string (ação interna sugerida)"
}`;
        break;

      case "trend_analysis":
        systemPrompt = `Você é um analista de tendências de mercado para e-commerce.
        Identifique padrões emergentes, mudanças de comportamento do consumidor e oportunidades.`;
        
        userPrompt = `Analise as tendências nos reviews do produto "${productName}" (categoria: ${productCategory}):

${reviews?.map((r: Review, i: number) => `[${r.date}] ${r.rating}★: "${r.content}"`).join('\n') || 'Nenhum review disponível'}

Identifique tendências em JSON:
{
  "emerging_trends": [
    {
      "trend": "string",
      "direction": "crescente" | "decrescente" | "estável",
      "first_mentioned": "string (data aproximada)",
      "impact": "alto" | "médio" | "baixo"
    }
  ],
  "seasonal_patterns": [
    {
      "pattern": "string",
      "period": "string",
      "recommendation": "string"
    }
  ],
  "competitor_mentions": [
    {
      "competitor": "string",
      "context": "positivo" | "negativo" | "comparativo",
      "frequency": number
    }
  ],
  "feature_requests": [
    {
      "feature": "string",
      "demand_level": "alto" | "médio" | "baixo",
      "potential_impact": "string"
    }
  ]
}`;
        break;

      case "comparison_analysis":
        systemPrompt = `Você é um analista comparativo de produtos para e-commerce.
        Compare o feedback do cliente com benchmarks do mercado e identifique vantagens competitivas.`;
        
        userPrompt = `Compare o produto "${productName}" (categoria: ${productCategory}) com base nos reviews:

${reviews?.map((r: Review, i: number) => `${r.rating}★: "${r.content}"`).join('\n') || 'Nenhum review disponível'}

Gere análise comparativa em JSON:
{
  "competitive_position": {
    "score": number (0-100),
    "market_position": "líder" | "desafiante" | "seguidor" | "nicho"
  },
  "strengths": ["string"],
  "weaknesses": ["string"],
  "opportunities": ["string"],
  "threats": ["string"],
  "unique_selling_points": ["string"],
  "improvement_priorities": [
    {
      "area": "string",
      "current_score": number (0-10),
      "target_score": number (0-10),
      "action": "string"
    }
  ]
}`;
        break;

      default:
        throw new Error(`Ação desconhecida: ${action}`);
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "{}";
    
    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("VOC Analysis Error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
