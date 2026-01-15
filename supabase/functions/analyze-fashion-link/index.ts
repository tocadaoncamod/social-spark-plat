import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Limites de caracteres por plataforma
const PLATFORM_LIMITS: Record<string, any> = {
  instagram: {
    descricao: { max: 2200, recomendado: 150 },
    hashtags: { max: 30, recomendado: 20 },
  },
  tiktok: {
    descricao: { max: 2200, recomendado: 150 },
    hashtags: { max: 5, recomendado: 5 },
  },
  youtube: {
    titulo: { max: 100, recomendado: 60 },
    descricao: { max: 5000, recomendado: 300 },
    hashtags: { max: 15, recomendado: 10 },
  },
  facebook: {
    descricao: { max: 500, recomendado: 80 },
    hashtags: { max: 3, recomendado: 3 },
  },
  linkedin: {
    descricao: { max: 3000, recomendado: 1300 },
    hashtags: { max: 5, recomendado: 5 },
  },
  whatsapp: {
    descricao: { max: 500, recomendado: 300 },
    hashtags: { max: 0, recomendado: 0 },
  },
  telegram: {
    descricao: { max: 4096, recomendado: 500 },
    hashtags: { max: 5, recomendado: 5 },
  }
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, platforms, storeName, storeDescription } = await req.json();

    if (!url || !platforms || platforms.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'URL e plataformas são obrigatórios' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Get Lovable API Key
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Build platform-specific instructions
    const platformInstructions = platforms.map((p: string) => {
      const limits = PLATFORM_LIMITS[p] || {};
      return `
${p.toUpperCase()}:
- Descrição: máximo ${limits.descricao?.recomendado || 150} caracteres
- Hashtags: ${limits.hashtags?.recomendado || 5} hashtags relevantes de moda
${limits.titulo ? `- Título: máximo ${limits.titulo.recomendado} caracteres` : ''}`;
    }).join('\n');

    const systemPrompt = `Você é um especialista em MODA e MARKETING DIGITAL. Analise o link do produto fornecido e gere conteúdo otimizado para cada plataforma.

VOCÊ É EXPERT EM:
- Todas as categorias de moda: roupas, calçados, bolsas, acessórios, joias
- Tendências 2026: sustentabilidade, smart fabrics, oversized, cores vibrantes
- Linguagem de moda: lookdodia, statement piece, capsule wardrobe, must-have
- Marketing para Gen Z, Millennials, Gen X

ESPECIFICAÇÕES POR PLATAFORMA:
${platformInstructions}

Responda APENAS com um JSON válido seguindo esta estrutura exata:
{
  "productInfo": {
    "name": "nome do produto extraído",
    "category": "categoria de moda",
    "price": "preço se disponível",
    "description": "descrição curta do produto",
    "features": ["característica 1", "característica 2"]
  },
  "contents": {
    "NOME_PLATAFORMA": {
      "titulo": "título se aplicável (só para YouTube)",
      "descricao": "texto otimizado respeitando limite de caracteres",
      "hashtags": ["hashtag1", "hashtag2"],
      "cta": "call to action",
      "emojis": ["emoji1", "emoji2"]
    }
  }
}

REGRAS:
1. RESPEITE RIGOROSAMENTE os limites de caracteres
2. Use linguagem de moda autêntica
3. Adapte o tom para cada plataforma (TikTok casual, LinkedIn profissional)
4. Inclua CTAs que convertem
5. Use emojis relevantes de moda 👗👠👜✨💫`;

    const userPrompt = `Analise este link de produto de moda e gere conteúdo para publicação:

URL DO PRODUTO: ${url}
LOJA: ${storeName || 'Loja de Moda'}
${storeDescription ? `SOBRE A LOJA: ${storeDescription}` : ''}

PLATAFORMAS PARA GERAR CONTEÚDO: ${platforms.join(', ')}

Gere o conteúdo otimizado respeitando os limites de caracteres de cada plataforma.
Se não conseguir acessar o link, use o contexto da URL para inferir informações do produto.`;

    // Call Lovable AI Gateway
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${lovableApiKey}`
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
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
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: 'Limite de requisições excedido. Tente novamente em alguns segundos.' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 429 }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ success: false, error: 'Créditos insuficientes. Adicione créditos à sua conta.' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 402 }
        );
      }
      
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content;

    if (!aiContent) {
      throw new Error('Empty response from AI');
    }

    // Parse AI response
    let result;
    try {
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

      result = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.log('Raw AI Content:', aiContent);
      
    // Fallback content
      const fallbackContents: Record<string, any> = {};
      for (const platform of platforms) {
        fallbackContents[platform] = {
          descricao: `✨ Nova peça disponível! Confira em ${storeName || 'nossa loja'} 🛒`,
          hashtags: ['moda', 'fashion', 'lookdodia', 'outfit', 'style'],
          cta: 'Link na bio!',
          emojis: ['👗', '✨', '🛒']
        };
      }
      
      result = {
        productInfo: {
          name: 'Produto de Moda',
          category: 'Moda',
          description: 'Produto extraído do link'
        },
        contents: fallbackContents
      };
    }

    // Add character counts
    const contentsWithCounts: Record<string, any> = {};
    for (const [platform, content] of Object.entries(result.contents || {})) {
      const c = content as any;
      contentsWithCounts[platform] = {
        ...c,
        characterCount: {
          descricao: c.descricao?.length || 0,
          titulo: c.titulo?.length || 0,
          hashtags: (c.hashtags || []).join(' ').length,
          total: (c.descricao?.length || 0) + (c.titulo?.length || 0) + (c.hashtags || []).join(' ').length
        },
        limits: PLATFORM_LIMITS[platform] || {}
      };
    }

    return new Response(
      JSON.stringify({
        success: true,
        productInfo: result.productInfo,
        contents: contentsWithCounts,
        originalUrl: url
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in analyze-fashion-link:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
