import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Agentes especializados configuration
const AGENTES_CONFIG: Record<string, { nome: string; icon: string; conhecimentos: Record<string, any> }> = {
  youtube: {
    nome: 'YouTube Expert',
    icon: '🎥',
    conhecimentos: {
      formatos: ['MP4', 'MOV', 'WebM'],
      resolucao: '1080p mínimo, 4K recomendado',
      seo: 'Títulos até 60 chars, descrição até 5000 chars',
      thumbnails: '1280x720px, máximo 2MB',
      algoritmo: 'Watch time, CTR, engajamento'
    }
  },
  instagram: {
    nome: 'Instagram Expert',
    icon: '📸',
    conhecimentos: {
      reels: '9:16, 1080x1920, 15-90 segundos',
      feed: '1:1 ou 4:5',
      stories: '9:16, 1080x1920',
      algoritmo: 'Engajamento primeiros 30min'
    }
  },
  facebook: {
    nome: 'Facebook Expert',
    icon: '👥',
    conhecimentos: {
      posts: 'Textos até 500 chars',
      videos: 'Nativos, legendados, 1-3 min',
      grupos: 'Engajamento orgânico alto'
    }
  },
  tiktok: {
    nome: 'TikTok Expert',
    icon: '🎵',
    conhecimentos: {
      videos: '9:16, 1080x1920, 15-180s',
      trends: 'Sons virais, hashtags',
      algoritmo: 'Watch time, replays, shares'
    }
  },
  whatsapp: {
    nome: 'WhatsApp Vendedor Master',
    icon: '💬',
    conhecimentos: {
      vendas: '20 livros de vendas integrados',
      tecnicas: ['SPIN Selling', 'Cialdini', 'Zig Ziglar'],
      deteccao: 'Humano vs Bot',
      fechamento: 'Técnicas avançadas'
    }
  },
  linkedin: {
    nome: 'LinkedIn Expert',
    icon: '💼',
    conhecimentos: {
      posts: 'Storytelling profissional',
      artigos: 'Thought leadership',
      networking: 'Social selling B2B'
    }
  },
  telegram: {
    nome: 'Telegram Expert',
    icon: '✈️',
    conhecimentos: {
      canais: 'Broadcasts ilimitados',
      grupos: 'Até 200.000 membros',
      bots: 'Automação avançada'
    }
  }
};

const BUSINESS_TYPE_LABELS: Record<string, string> = {
  ecommerce: 'E-commerce / Loja Online',
  servicos: 'Prestação de Serviços',
  infoprodutos: 'Infoprodutos / Cursos',
  saas: 'SaaS / Software',
  consultoria: 'Consultoria',
  alimentacao: 'Alimentação / Restaurante',
  saude: 'Saúde / Bem-estar',
  educacao: 'Educação',
  imobiliario: 'Imobiliário',
  outro: 'Negócio Geral'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { businessType, businessName, productLink, platforms } = await req.json();

    if (!businessType || !platforms || platforms.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Tipo de negócio e plataformas são obrigatórios' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    let userId: string | null = null;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    // Get Lovable API Key for AI
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const businessTypeLabel = BUSINESS_TYPE_LABELS[businessType] || businessType;

    // Build the analysis prompt
    const systemPrompt = `Você é um especialista em marketing digital e análise de negócios. Analise o negócio fornecido e gere uma configuração completa para múltiplas plataformas de marketing.

Você DEVE responder APENAS com um objeto JSON válido, sem texto adicional antes ou depois. O JSON deve seguir exatamente esta estrutura:

{
  "nicho": "categoria específica do negócio",
  "publicoAlvo": "descrição detalhada do público-alvo ideal",
  "tonalidade": "tom de comunicação recomendado (ex: profissional, casual, inspirador)",
  "palavrasChave": ["palavra1", "palavra2", "palavra3", "palavra4", "palavra5"],
  "promptVendedor": "prompt completo para o vendedor WhatsApp com técnicas de vendas",
  "promptAtendimento": "prompt para atendimento ao cliente",
  "estrategias": {
    "youtube": "estratégia específica para YouTube",
    "instagram": "estratégia específica para Instagram",
    "facebook": "estratégia específica para Facebook",
    "tiktok": "estratégia específica para TikTok",
    "whatsapp": "estratégia específica para WhatsApp",
    "linkedin": "estratégia específica para LinkedIn",
    "telegram": "estratégia específica para Telegram"
  }
}`;

    const userPrompt = `Analise este negócio e gere a configuração de marketing:

TIPO DE NEGÓCIO: ${businessTypeLabel}
NOME DO NEGÓCIO: ${businessName || 'Não informado'}
LINK DO PRODUTO: ${productLink || 'Não informado'}
PLATAFORMAS SELECIONADAS: ${platforms.join(', ')}

Gere prompts profissionais e estratégias otimizadas para cada plataforma selecionada.
Para WhatsApp, inclua técnicas dos 20 principais livros de vendas (Dale Carnegie, SPIN Selling, Cialdini, Zig Ziglar, etc).`;

    // Call Lovable AI Gateway
    const aiResponse = await fetch('https://ai.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${lovableApiKey}`
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API Error:', errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content;

    if (!aiContent) {
      throw new Error('Empty response from AI');
    }

    // Parse AI response
    let analysisResult;
    try {
      // Clean the response (remove markdown code blocks if present)
      let cleanContent = aiContent.trim();
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.slice(7);
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith('```')) {
        cleanContent = cleanContent.slice(0, -3);
      }
      cleanContent = cleanContent.trim();

      analysisResult = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.log('Raw AI Content:', aiContent);
      
      // Fallback analysis
      analysisResult = {
        nicho: businessTypeLabel,
        publicoAlvo: 'Público interessado em ' + businessTypeLabel.toLowerCase(),
        tonalidade: 'Profissional e amigável',
        palavrasChave: [businessType, 'qualidade', 'confiança', 'resultado', 'sucesso'],
        promptVendedor: generateDefaultSellerPrompt(businessTypeLabel, businessName),
        promptAtendimento: generateDefaultServicePrompt(businessTypeLabel, businessName),
        estrategias: {}
      };
    }

    // Build agents list
    const agentes = platforms.map((plat: string) => {
      const config = AGENTES_CONFIG[plat];
      return {
        plataforma: plat,
        nome: config?.nome || `${plat} Expert`,
        icon: config?.icon || '🤖',
        status: 'Configurado'
      };
    });

    // Save to database if user is authenticated
    if (userId) {
      // Save specialized agents
      for (const plat of platforms) {
        const config = AGENTES_CONFIG[plat];
        const promptBase = generateAgentPrompt(plat, analysisResult, config);

        // Check if agent already exists
        const { data: existingAgent } = await supabase
          .from('agentes_especializados')
          .select('id')
          .eq('user_id', userId)
          .eq('plataforma', plat)
          .single();

        if (existingAgent) {
          await supabase.from('agentes_especializados').update({
            nome: config?.nome || `${plat} Expert`,
            prompt_base: promptBase,
            conhecimentos: config?.conhecimentos || {},
            ia_primaria: 'gemini',
            ativo: true,
            updated_at: new Date().toISOString()
          }).eq('id', existingAgent.id);
        } else {
          await supabase.from('agentes_especializados').insert({
            user_id: userId,
            nome: config?.nome || `${plat} Expert`,
            plataforma: plat,
            prompt_base: promptBase,
            conhecimentos: config?.conhecimentos || {},
            ia_primaria: 'gemini',
            ativo: true
          });
        }
      }

      // Save professional prompts
      const promptsToSave = [
        {
          name: 'Vendedor Master',
          category: 'whatsapp',
          prompt_template: analysisResult.promptVendedor || generateDefaultSellerPrompt(businessTypeLabel, businessName),
          description: `Vendedor IA para ${businessTypeLabel}`,
          icon: 'MessageCircle',
          is_default: false
        },
        {
          name: 'Atendimento',
          category: 'whatsapp',
          prompt_template: analysisResult.promptAtendimento || generateDefaultServicePrompt(businessTypeLabel, businessName),
          description: `Atendimento IA para ${businessTypeLabel}`,
          icon: 'HeadphonesIcon',
          is_default: false
        }
      ];

      for (const prompt of promptsToSave) {
        await supabase.from('professional_prompts').insert(prompt);
      }

      // Create multi-platform task
      await supabase.from('tarefas_multiplataforma').insert({
        user_id: userId,
        descricao: `Onboarding: Configuração inicial para ${businessTypeLabel}`,
        plataformas: platforms,
        status: 'concluido',
        resultados: {
          nicho: analysisResult.nicho,
          publicoAlvo: analysisResult.publicoAlvo,
          agentesAtivados: agentes.length
        },
        completed_at: new Date().toISOString()
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        configuracao: {
          nicho: analysisResult.nicho,
          publicoAlvo: analysisResult.publicoAlvo,
          tonalidade: analysisResult.tonalidade,
          palavrasChave: analysisResult.palavrasChave || [],
          agentes,
          conteudos: analysisResult.estrategias || {}
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in onboarding-analyze:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

function generateAgentPrompt(platform: string, analysis: any, config: any): string {
  const basePrompt = `Você é o AGENTE ${config?.nome?.toUpperCase() || platform.toUpperCase()} - Especialista em ${platform}.

📊 CONTEXTO DO NEGÓCIO:
- Nicho: ${analysis.nicho}
- Público-Alvo: ${analysis.publicoAlvo}
- Tonalidade: ${analysis.tonalidade}

🎓 SEU CONHECIMENTO ESPECIALIZADO:
${JSON.stringify(config?.conhecimentos || {}, null, 2)}

🎯 SUAS TAREFAS:
1. Criar conteúdo otimizado para ${platform}
2. Seguir as melhores práticas da plataforma
3. Maximizar engajamento e conversões
4. Adaptar mensagens ao público-alvo

Sempre seja criativo, relevante e focado em resultados.`;

  return basePrompt;
}

function generateDefaultSellerPrompt(businessType: string, businessName?: string): string {
  return `Você é o VENDEDOR MASTER - O melhor vendedor do mundo com conhecimento de 20 livros de vendas.

📊 CONTEXTO:
- Negócio: ${businessName || businessType}
- Tipo: ${businessType}

📚 LIVROS QUE VOCÊ DOMINA:
1. "Como Fazer Amigos e Influenciar Pessoas" - Dale Carnegie
2. "SPIN Selling" - Neil Rackham
3. "As Armas da Persuasão" - Robert Cialdini
4. "Vendas 101" - Zig Ziglar
5. "The Challenger Sale" - Matthew Dixon
6. "Pitch Anything" - Oren Klaff
7. "Never Split the Difference" - Chris Voss
8. "Influence" - Robert Cialdini
9. "To Sell Is Human" - Daniel Pink
10. "The Psychology of Selling" - Brian Tracy
11. "Gap Selling" - Keenan
12. "Fanatical Prospecting" - Jeb Blount
13. "The Little Red Book of Selling" - Jeffrey Gitomer
14. "Secrets of Closing the Sale" - Zig Ziglar
15. "Way of the Wolf" - Jordan Belfort
16. "Predictable Revenue" - Aaron Ross
17. "New Sales Simplified" - Mike Weinberg
18. "The Sales Acceleration Formula" - Mark Roberge
19. "Sell or Be Sold" - Grant Cardone
20. "Os Segredos da Mente Milionária" - T. Harv Eker

🧠 SUAS HABILIDADES:
- Detecção inteligente (humano vs bot)
- Pesquisa de leads em redes sociais
- Técnicas por fase de venda
- Fechamento maestria
- Gatilhos mentais avançados

⚡ GATILHOS MENTAIS:
- Escassez: "Últimas unidades..."
- Urgência: "Só até hoje..."
- Prova Social: "Mais de X clientes..."
- Autoridade: "Especialistas recomendam..."
- Reciprocidade: "Preparei algo especial..."

🎯 REGRAS:
- Nunca pareça robótico
- Use nome do cliente
- Crie conexão genuína
- Foque em resolver problemas
- Gere valor antes de vender`;
}

function generateDefaultServicePrompt(businessType: string, businessName?: string): string {
  return `Você é o assistente de atendimento de ${businessName || businessType}.

🎯 SEU OBJETIVO:
Fornecer atendimento excepcional, resolver dúvidas e garantir satisfação do cliente.

📋 DIRETRIZES:
- Seja cordial e profissional
- Responda de forma clara e objetiva
- Ofereça soluções proativas
- Encaminhe para vendas quando apropriado
- Colete feedback

💡 COMPORTAMENTO:
- Cumprimente pelo nome
- Demonstre empatia
- Resolva problemas rapidamente
- Agradeça a confiança
- Mantenha tom ${businessType.includes('formal') ? 'profissional' : 'amigável'}`;
}
