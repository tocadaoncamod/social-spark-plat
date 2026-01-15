import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ScriptRequest {
  action: string;
  productName?: string;
  productDescription?: string;
  targetAudience?: string;
  tone?: string;
  duration?: string;
  platform?: string;
  scriptType?: string;
  keywords?: string[];
  language?: string;
  customPrompt?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: ScriptRequest = await req.json();
    const { 
      action, 
      productName, 
      productDescription, 
      targetAudience = "jovens 18-35 anos",
      tone = "envolvente e divertido",
      duration = "30 segundos",
      platform = "TikTok",
      scriptType,
      keywords = [],
      language = "português brasileiro",
      customPrompt
    } = body;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    switch (action) {
      case "video_script":
        systemPrompt = `Você é um roteirista viral especializado em ${platform}. 
        Crie roteiros que capturam atenção nos primeiros 3 segundos e mantêm o engajamento.
        Use técnicas de storytelling, ganchos emocionais e CTAs poderosos.
        Sempre responda em ${language}.`;
        
        userPrompt = `Crie um roteiro de vídeo para ${platform} sobre o produto "${productName}".

Descrição do produto: ${productDescription}
Público-alvo: ${targetAudience}
Tom: ${tone}
Duração: ${duration}
Palavras-chave: ${keywords.join(', ') || 'não especificadas'}

Gere o roteiro em JSON:
{
  "hook": "string (gancho inicial de 3 segundos para prender atenção)",
  "opening": "string (abertura que apresenta o problema/desejo)",
  "body": [
    {
      "timestamp": "string (ex: 0:05-0:10)",
      "visual": "string (descrição do que aparece na tela)",
      "narration": "string (texto falado/legenda)",
      "action": "string (ação do apresentador)"
    }
  ],
  "climax": "string (momento de revelação/transformação)",
  "cta": "string (chamada para ação final)",
  "closing": "string (encerramento memorável)",
  "hashtags": ["string"],
  "caption": "string (descrição para postar)",
  "best_posting_time": "string (melhor horário sugerido)",
  "music_suggestion": "string (estilo de música recomendado)",
  "estimated_duration": "string"
}`;
        break;

      case "product_description":
        systemPrompt = `Você é um copywriter especializado em e-commerce e ${platform} Shop.
        Crie descrições que vendem, usando gatilhos mentais e técnicas de persuasão.
        Sempre responda em ${language}.`;
        
        userPrompt = `Crie descrições de produto para "${productName}".

Descrição base: ${productDescription}
Público-alvo: ${targetAudience}
Tom: ${tone}

Gere em JSON:
{
  "short_description": "string (até 100 caracteres, para feed)",
  "medium_description": "string (até 300 caracteres, para cards)",
  "long_description": "string (completa, para página do produto)",
  "bullet_points": ["string (benefícios principais)"],
  "emotional_hooks": ["string (ganchos emocionais)"],
  "urgency_phrases": ["string (frases de urgência)"],
  "social_proof_suggestions": ["string (sugestões de prova social)"],
  "seo_keywords": ["string"],
  "title_variations": ["string (3 variações de título)"]
}`;
        break;

      case "hooks":
        systemPrompt = `Você é especialista em criar ganchos virais para ${platform}.
        Seus ganchos fazem as pessoas pararem de scrollar e assistirem até o final.
        Use curiosidade, polêmica controlada, promessas específicas e padrões de interrupção.
        Sempre responda em ${language}.`;
        
        userPrompt = `Crie ganchos virais para vídeos sobre "${productName}".

Contexto: ${productDescription}
Público: ${targetAudience}
Tom: ${tone}

Gere em JSON:
{
  "curiosity_hooks": [
    {
      "text": "string",
      "why_works": "string",
      "best_for": "string"
    }
  ],
  "controversy_hooks": [
    {
      "text": "string",
      "why_works": "string",
      "risk_level": "baixo" | "médio" | "alto"
    }
  ],
  "story_hooks": [
    {
      "text": "string",
      "emotion": "string"
    }
  ],
  "question_hooks": ["string"],
  "challenge_hooks": ["string"],
  "transformation_hooks": ["string"],
  "fear_of_missing_out_hooks": ["string"]
}`;
        break;

      case "captions":
        systemPrompt = `Você é especialista em criar legendas e descrições para ${platform}.
        Suas legendas aumentam o engajamento, incentivam comentários e compartilhamentos.
        Sempre responda em ${language}.`;
        
        userPrompt = `Crie legendas para posts sobre "${productName}".

Contexto: ${productDescription}
Público: ${targetAudience}
Tom: ${tone}

Gere em JSON:
{
  "captions": [
    {
      "text": "string",
      "style": "string (ex: storytelling, lista, pergunta)",
      "engagement_trigger": "string",
      "cta": "string"
    }
  ],
  "hashtag_sets": [
    {
      "focus": "string (ex: alcance, nicho, trending)",
      "hashtags": ["string"]
    }
  ],
  "emoji_combinations": ["string"],
  "call_to_action_variations": ["string"]
}`;
        break;

      case "live_script":
        systemPrompt = `Você é especialista em roteiros para lives de vendas no ${platform}.
        Crie estruturas que mantêm a audiência engajada e convertem em vendas.
        Sempre responda em ${language}.`;
        
        userPrompt = `Crie um roteiro de live para vender "${productName}".

Produto: ${productDescription}
Público: ${targetAudience}
Duração estimada: ${duration}

Gere em JSON:
{
  "pre_live": {
    "checklist": ["string"],
    "teaser_posts": ["string"]
  },
  "opening": {
    "duration": "string",
    "script": "string",
    "engagement_action": "string"
  },
  "segments": [
    {
      "name": "string",
      "duration": "string",
      "objective": "string",
      "talking_points": ["string"],
      "engagement_prompts": ["string"]
    }
  ],
  "product_demo": {
    "key_features_order": ["string"],
    "objection_handlers": [
      {
        "objection": "string",
        "response": "string"
      }
    ]
  },
  "flash_sale_moments": [
    {
      "trigger": "string",
      "announcement": "string",
      "urgency_builder": "string"
    }
  ],
  "closing": {
    "final_cta": "string",
    "last_chance_offer": "string",
    "next_live_teaser": "string"
  },
  "engagement_games": [
    {
      "name": "string",
      "rules": "string",
      "prize": "string"
    }
  ]
}`;
        break;

      case "ad_copy":
        systemPrompt = `Você é um especialista em copywriting para anúncios de ${platform}.
        Crie copies que convertem, seguindo as melhores práticas de ads.
        Sempre responda em ${language}.`;
        
        userPrompt = `Crie copies de anúncio para "${productName}".

Produto: ${productDescription}
Público: ${targetAudience}
Tom: ${tone}

Gere em JSON:
{
  "primary_texts": [
    {
      "text": "string",
      "angle": "string (ex: benefício, problema, social proof)",
      "length": "curto" | "médio" | "longo"
    }
  ],
  "headlines": ["string"],
  "descriptions": ["string"],
  "cta_buttons": ["string"],
  "ad_variations": [
    {
      "name": "string",
      "primary_text": "string",
      "headline": "string",
      "description": "string",
      "target_emotion": "string"
    }
  ],
  "a_b_test_suggestions": [
    {
      "element": "string",
      "variation_a": "string",
      "variation_b": "string",
      "hypothesis": "string"
    }
  ]
}`;
        break;

      case "comment_responses":
        systemPrompt = `Você é especialista em engajamento e atendimento no ${platform}.
        Crie respostas que aumentam a conexão com seguidores e incentivam mais interação.
        Sempre responda em ${language}.`;
        
        userPrompt = `Crie templates de resposta para comentários sobre "${productName}".

Contexto: ${productDescription}
Tom: ${tone}

Gere em JSON:
{
  "positive_responses": [
    {
      "trigger": "string (tipo de comentário positivo)",
      "responses": ["string"],
      "follow_up_question": "string"
    }
  ],
  "question_responses": [
    {
      "common_question": "string",
      "answer": "string",
      "upsell_opportunity": "string"
    }
  ],
  "objection_responses": [
    {
      "objection": "string",
      "response": "string",
      "proof_to_share": "string"
    }
  ],
  "hater_responses": [
    {
      "type": "string",
      "response": "string",
      "tone": "string"
    }
  ],
  "engagement_starters": ["string"]
}`;
        break;

      case "custom":
        systemPrompt = `Você é um assistente de criação de conteúdo para ${platform}.
        Siga as instruções do usuário e gere conteúdo criativo e eficaz.
        Sempre responda em ${language} e formate a resposta em JSON quando possível.`;
        
        userPrompt = customPrompt || "Gere sugestões de conteúdo criativo.";
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
        temperature: 0.8,
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
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw_content: content };

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("AI Scripts Error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
