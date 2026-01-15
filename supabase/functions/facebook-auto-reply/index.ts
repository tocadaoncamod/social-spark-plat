import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Message {
  id: string;
  mensagem_recebida: string;
  remetente_nome?: string;
  contexto?: string;
  produto_id?: string;
}

interface ConversationContext {
  previousMessages: string[];
  productInfo?: {
    nome: string;
    preco: number;
    descricao: string;
    categoria: string;
  };
  customerName?: string;
  customerIntent?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    
    if (!lovableApiKey) {
      throw new Error("LOVABLE_API_KEY não configurada");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { action, userId, messageId, customPrompt } = await req.json();

    let result;

    switch (action) {
      case "process_pending":
        result = await processPendingMessages(supabase, userId, lovableApiKey);
        break;
      case "generate_reply":
        result = await generateSingleReply(supabase, messageId, lovableApiKey, customPrompt);
        break;
      case "analyze_conversation":
        result = await analyzeConversation(supabase, userId, lovableApiKey);
        break;
      default:
        throw new Error(`Ação desconhecida: ${action}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Erro no auto-reply:", error);
    
    // Handle rate limits
    if (error.message?.includes("429") || error.message?.includes("rate limit")) {
      return new Response(
        JSON.stringify({ success: false, error: "Rate limit atingido. Tente novamente em alguns segundos." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (error.message?.includes("402")) {
      return new Response(
        JSON.stringify({ success: false, error: "Créditos insuficientes. Adicione créditos ao workspace." }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function processPendingMessages(supabase: any, userId: string, apiKey: string) {
  console.log(`Processando mensagens pendentes para usuário ${userId}`);

  // Buscar mensagens não respondidas
  const { data: messages, error } = await supabase
    .from("facebook_respostas_automaticas")
    .select(`
      *,
      facebook_marketplace_produtos (
        titulo,
        descricao,
        preco,
        categoria
      )
    `)
    .eq("user_id", userId)
    .eq("respondido", false)
    .order("created_at", { ascending: true })
    .limit(10);

  if (error) throw error;

  let processedCount = 0;
  const results: { id: string; resposta: string; intent: string }[] = [];

  for (const message of messages || []) {
    try {
      // Buscar contexto da conversa (mensagens anteriores do mesmo remetente)
      const { data: previousMessages } = await supabase
        .from("facebook_respostas_automaticas")
        .select("mensagem_recebida, resposta_enviada")
        .eq("user_id", userId)
        .eq("remetente_id", message.remetente_id)
        .order("created_at", { ascending: false })
        .limit(5);

      const context: ConversationContext = {
        previousMessages: previousMessages?.map((m: any) => 
          `Cliente: ${m.mensagem_recebida}\nVocê: ${m.resposta_enviada || "(não respondido)"}`
        ) || [],
        customerName: message.remetente_nome,
        productInfo: message.facebook_marketplace_produtos ? {
          nome: message.facebook_marketplace_produtos.titulo,
          preco: message.facebook_marketplace_produtos.preco,
          descricao: message.facebook_marketplace_produtos.descricao,
          categoria: message.facebook_marketplace_produtos.categoria,
        } : undefined,
      };

      const { resposta, intent } = await generateAIResponse(
        message.mensagem_recebida,
        context,
        apiKey
      );

      // Atualizar no banco
      await supabase
        .from("facebook_respostas_automaticas")
        .update({
          resposta_enviada: resposta,
          respondido: true,
          respondido_em: new Date().toISOString(),
          contexto: JSON.stringify({ intent, analyzed: true }),
        })
        .eq("id", message.id);

      results.push({ id: message.id, resposta, intent });
      processedCount++;

      // Pequeno delay entre mensagens para evitar rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      console.error(`Erro ao processar mensagem ${message.id}:`, err);
    }
  }

  return {
    success: true,
    processedCount,
    totalPending: messages?.length || 0,
    results,
  };
}

async function generateSingleReply(supabase: any, messageId: string, apiKey: string, customPrompt?: string) {
  const { data: message, error } = await supabase
    .from("facebook_respostas_automaticas")
    .select(`
      *,
      facebook_marketplace_produtos (
        titulo,
        descricao,
        preco,
        categoria
      )
    `)
    .eq("id", messageId)
    .single();

  if (error) throw error;

  const context: ConversationContext = {
    previousMessages: [],
    customerName: message.remetente_nome,
    productInfo: message.facebook_marketplace_produtos ? {
      nome: message.facebook_marketplace_produtos.titulo,
      preco: message.facebook_marketplace_produtos.preco,
      descricao: message.facebook_marketplace_produtos.descricao,
      categoria: message.facebook_marketplace_produtos.categoria,
    } : undefined,
  };

  const { resposta, intent } = await generateAIResponse(
    message.mensagem_recebida,
    context,
    apiKey,
    customPrompt
  );

  return { success: true, resposta, intent, messageId };
}

async function analyzeConversation(supabase: any, userId: string, apiKey: string) {
  // Buscar todas as conversas recentes
  const { data: messages, error } = await supabase
    .from("facebook_respostas_automaticas")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw error;

  // Analisar padrões com IA
  const analysisPrompt = `Analise estas conversas de vendas no Facebook e forneça insights:

CONVERSAS:
${messages?.map((m: any) => `- Mensagem: "${m.mensagem_recebida}" | Resposta: "${m.resposta_enviada || 'Não respondida'}"`).join('\n')}

Retorne um JSON com:
{
  "patterns": ["padrão1", "padrão2"],
  "commonQuestions": ["pergunta1", "pergunta2"],
  "suggestedResponses": [{"trigger": "palavra-chave", "response": "resposta sugerida"}],
  "conversionTips": ["dica1", "dica2"],
  "sentimentOverview": "análise geral do sentimento dos clientes"
}`;

  const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [{ role: "user", content: analysisPrompt }],
      temperature: 0.3,
    }),
  });

  if (!aiResponse.ok) {
    const status = aiResponse.status;
    if (status === 429) throw new Error("429 Rate limit");
    if (status === 402) throw new Error("402 Payment required");
    throw new Error("Erro na API de IA");
  }

  const aiData = await aiResponse.json();
  const content = aiData.choices?.[0]?.message?.content || "";
  
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

  return { success: true, analysis, totalMessages: messages?.length || 0 };
}

async function generateAIResponse(
  message: string,
  context: ConversationContext,
  apiKey: string,
  customPrompt?: string
): Promise<{ resposta: string; intent: string }> {
  
  const systemPrompt = customPrompt || `Você é um vendedor profissional e amigável no Facebook Marketplace/Grupos.
Seu objetivo é responder mensagens de clientes interessados de forma:
- Natural e humana (não robótica)
- Educada e profissional
- Focada em conversão (fechar a venda)
- Rápida e objetiva

REGRAS IMPORTANTES:
1. Use emojis com moderação (1-2 por mensagem)
2. Nunca seja agressivo ou insistente
3. Sempre ofereça ajuda adicional
4. Crie senso de urgência sutil quando apropriado
5. Responda diretamente à pergunta do cliente
6. Se não souber algo, pergunte ao cliente
7. Sempre finalize convidando para a próxima ação

INFORMAÇÕES DO PRODUTO (se disponível):
${context.productInfo ? `
- Nome: ${context.productInfo.nome}
- Preço: R$ ${context.productInfo.preco?.toFixed(2)}
- Descrição: ${context.productInfo.descricao}
- Categoria: ${context.productInfo.categoria}
` : "Sem informações específicas do produto"}

CONTEXTO DA CONVERSA:
${context.previousMessages.length > 0 
  ? context.previousMessages.join('\n---\n')
  : "Primeira mensagem do cliente"}

NOME DO CLIENTE: ${context.customerName || "Cliente"}`;

  const userPrompt = `Mensagem do cliente: "${message}"

Responda de forma natural e persuasiva. Identifique também a intenção do cliente.

Retorne APENAS um JSON:
{
  "resposta": "sua resposta aqui",
  "intent": "interesse_compra|duvida_preco|duvida_produto|negociacao|duvida_entrega|outros"
}`;

  const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
    }),
  });

  if (!aiResponse.ok) {
    const status = aiResponse.status;
    if (status === 429) throw new Error("429 Rate limit");
    if (status === 402) throw new Error("402 Payment required");
    throw new Error("Erro na API de IA");
  }

  const aiData = await aiResponse.json();
  const content = aiData.choices?.[0]?.message?.content || "";
  
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    // Fallback se não conseguir extrair JSON
    return {
      resposta: content.replace(/```json|```/g, '').trim(),
      intent: "outros"
    };
  }

  const parsed = JSON.parse(jsonMatch[0]);
  return {
    resposta: parsed.resposta || content,
    intent: parsed.intent || "outros"
  };
}
