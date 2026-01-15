import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, category } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (action === "generate") {
      systemPrompt = "Você é um analista de e-commerce especializado em TikTok Shop. Gere insights acionáveis sobre vendas, produtos e performance.";
      userPrompt = "Gere 3 insights de negócio para uma loja TikTok Shop no Brasil. Cada insight deve ter: título curto, conteúdo detalhado (1-2 frases), tipo (sales/product/influencer/content/alert), e prioridade (low/medium/high/critical). Responda em JSON: {insights: [{title, content, insight_type, priority}]}";
    } else if (action === "competition_analysis") {
      systemPrompt = "Você é um especialista em análise competitiva de e-commerce no TikTok Shop Brasil. Analise tendências de concorrentes e estratégias de mercado.";
      userPrompt = `Analise a concorrência no TikTok Shop Brasil${category ? ` para a categoria: ${category}` : ''}. Forneça:
1. 3 principais estratégias que concorrentes bem-sucedidos estão usando
2. Gaps de mercado que podem ser explorados
3. Precificação competitiva e posicionamento
4. Táticas de marketing que estão funcionando

Responda em JSON: {
  competitor_strategies: [{title, description, impact_level}],
  market_gaps: [{opportunity, potential, difficulty}],
  pricing_insights: {average_price_range, margin_opportunity, recommendation},
  marketing_tactics: [{tactic, effectiveness, implementation_tip}]
}`;
    } else if (action === "market_trends") {
      systemPrompt = "Você é um analista de tendências de mercado especializado em social commerce e TikTok Shop no Brasil.";
      userPrompt = `Analise as tendências de mercado atuais para TikTok Shop Brasil${category ? ` na categoria: ${category}` : ''}. Inclua:
1. Produtos em alta e categorias emergentes
2. Comportamento do consumidor brasileiro
3. Tendências de conteúdo que convertem
4. Previsões para os próximos meses

Responda em JSON: {
  trending_products: [{product_type, growth_rate, demand_level}],
  consumer_behavior: [{trend, description, actionable_insight}],
  content_trends: [{format, engagement_rate, best_practices}],
  predictions: [{prediction, timeframe, confidence_level}]
}`;
    } else if (action === "content_suggestions") {
      systemPrompt = "Você é um especialista em marketing de conteúdo para TikTok. Sugira ideias de vídeos virais para lojas.";
      userPrompt = "Sugira 5 ideias de conteúdo para uma loja TikTok Shop no Brasil vender mais. Responda em JSON: {suggestions: [string]}";
    } else if (action === "performance_optimization") {
      systemPrompt = "Você é um especialista em otimização de performance para lojas no TikTok Shop.";
      userPrompt = `Forneça recomendações de otimização para melhorar a performance de uma loja TikTok Shop Brasil. Analise:
1. Otimização de listagem de produtos
2. Estratégias de precificação dinâmica
3. Melhoria de taxa de conversão
4. Otimização de campanhas de ads

Responda em JSON: {
  listing_optimization: [{area, current_issue, recommendation, expected_impact}],
  pricing_strategies: [{strategy, when_to_use, expected_roi}],
  conversion_tips: [{tip, implementation, priority}],
  ads_optimization: [{metric, issue, solution, difficulty}]
}`;
    } else {
      throw new Error("Unknown action");
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
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
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
    console.error("Error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
