import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LojaParceira {
  id: string;
  nome: string;
  url_base: string;
  supabase_url: string | null;
  supabase_anon_key: string | null;
  tabela_produtos: string;
  mapeamento_campos: Record<string, string>;
}

interface ProductData {
  nome: string;
  descricao: string;
  preco: number;
  precoOriginal?: number;
  precoAtacado?: number;
  imagens: string[];
  categoria?: string;
  tamanhos?: string[];
  cores?: string[];
  loja?: string;
  palavrasChave?: string[];
  condicao?: string;
}

interface GeneratedAd {
  titulo: string;
  descricao: string;
  palavrasChave: string[];
  hashtagsOtimizadas: string[];
  textoGrupo: string;
  textoMarketplace: string;
}

// Função para extrair product ID de uma URL
function extractProductId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    for (const part of pathParts) {
      if (uuidRegex.test(part)) {
        return part;
      }
    }
    
    const lastPart = pathParts[pathParts.length - 1];
    if (lastPart && lastPart.length > 0) {
      return lastPart;
    }
    
    return null;
  } catch {
    return null;
  }
}

// Função para detectar loja parceira
function detectPartnerStore(url: string, lojas: LojaParceira[]): LojaParceira | null {
  if (!url) return null;
  
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    
    return lojas.find(loja => {
      try {
        const lojaUrl = new URL(loja.url_base);
        return hostname === lojaUrl.hostname || hostname.includes(lojaUrl.hostname.replace('www.', ''));
      } catch {
        return false;
      }
    }) || null;
  } catch {
    return null;
  }
}

// Função para buscar produto via API da loja parceira
async function fetchProductFromPartnerApi(
  loja: LojaParceira, 
  productId: string
): Promise<ProductData | null> {
  if (!loja.supabase_url || !loja.supabase_anon_key) {
    console.log('Loja sem configuração de API:', loja.nome);
    return null;
  }

  try {
    const apiUrl = `${loja.supabase_url}/rest/v1/${loja.tabela_produtos}?id=eq.${productId}&select=*`;
    
    console.log('Buscando produto via API:', apiUrl);
    
    const response = await fetch(apiUrl, {
      headers: {
        'apikey': loja.supabase_anon_key,
        'Authorization': `Bearer ${loja.supabase_anon_key}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('Erro na API da loja:', response.status, response.statusText);
      return null;
    }

    const products = await response.json();
    
    if (!products || products.length === 0) {
      console.log('Produto não encontrado na API');
      return null;
    }

    const product = products[0];
    const mapping = loja.mapeamento_campos || {};

    console.log('Produto encontrado:', JSON.stringify(product, null, 2));

    // Mapear campos usando o mapeamento da loja
    let imagens = product[mapping.imagens || 'images'] || product.images || [];
    
    // Garantir que imagens é um array
    if (typeof imagens === 'string') {
      try {
        imagens = JSON.parse(imagens);
      } catch {
        imagens = [imagens];
      }
    }

    const extractedData: ProductData = {
      nome: product[mapping.nome || 'name'] || product.name || '',
      descricao: product[mapping.descricao || 'description'] || product.description || '',
      preco: parseFloat(product[mapping.preco || 'sale_price'] || product.sale_price || product.price || 0),
      precoOriginal: parseFloat(product[mapping.precoOriginal || 'original_price'] || product.original_price || 0) || undefined,
      precoAtacado: parseFloat(product[mapping.precoAtacado || 'wholesale_price'] || product.wholesale_price || 0) || undefined,
      imagens: imagens,
      categoria: product[mapping.categoria || 'category_name'] || product.category_name || product.category || '',
      tamanhos: product[mapping.tamanhos || 'sizes'] || product.sizes || [],
      cores: product[mapping.cores || 'colors'] || product.colors || [],
      loja: loja.nome,
      condicao: 'Novo'
    };

    return extractedData;
  } catch (error) {
    console.error('Erro ao buscar produto via API:', error);
    return null;
  }
}

// Função para analisar link e extrair dados do produto
async function analyzeProductLink(
  productLink: string, 
  supabaseClient: any
): Promise<{ success: boolean; product?: ProductData; loja?: string; metodo?: string; error?: string }> {
  console.log('Analisando link:', productLink);

  // Buscar lojas parceiras do banco
  const { data: lojas, error: lojasError } = await supabaseClient
    .from('lojas_parceiras')
    .select('*')
    .eq('ativo', true);

  if (lojasError) {
    console.error('Erro ao buscar lojas parceiras:', lojasError);
  }

  const lojasPartner = (lojas || []) as LojaParceira[];
  console.log('Lojas parceiras encontradas:', lojasPartner.length);

  // Detectar se é uma loja parceira
  const loja = detectPartnerStore(productLink, lojasPartner);
  
  if (loja) {
    console.log('Loja parceira detectada:', loja.nome);
    
    const productId = extractProductId(productLink);
    
    if (productId) {
      console.log('Product ID extraído:', productId);
      
      const productData = await fetchProductFromPartnerApi(loja, productId);
      
      if (productData) {
        // Gerar palavras-chave baseadas nos dados
        productData.palavrasChave = [
          ...(productData.nome?.toLowerCase().split(' ') || []),
          ...(productData.categoria?.toLowerCase().split(' ') || []),
          'moda', 'roupa', 'atacado', 'varejo', 'pronta entrega', 'tendência',
          loja.nome.toLowerCase()
        ].filter(Boolean);
        
        return {
          success: true,
          product: productData,
          loja: loja.nome,
          metodo: 'api'
        };
      }
    }
  }

  // Fallback: tentar fazer scraping básico
  try {
    console.log('Tentando scraping do link...');
    
    const response = await fetch(productLink, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Erro ao acessar a página: ${response.status}`,
        loja: loja?.nome
      };
    }

    const html = await response.text();
    
    // Extrair dados básicos do HTML
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    const priceMatch = html.match(/R\$\s*[\d.,]+/);
    const imageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);

    if (titleMatch || descMatch) {
      return {
        success: true,
        product: {
          nome: titleMatch?.[1]?.trim() || '',
          descricao: descMatch?.[1] || '',
          preco: priceMatch ? parseFloat(priceMatch[0].replace('R$', '').replace('.', '').replace(',', '.').trim()) : 0,
          imagens: imageMatch?.[1] ? [imageMatch[1]] : [],
          palavrasChave: ['moda', 'roupa', 'atacado', 'varejo'],
          condicao: 'Novo'
        },
        loja: loja?.nome,
        metodo: 'scraping'
      };
    }

    return {
      success: false,
      error: 'Não foi possível extrair dados do link. A página pode ser uma SPA que carrega via JavaScript.',
      loja: loja?.nome
    };
  } catch (error: any) {
    console.error('Erro no scraping:', error);
    return {
      success: false,
      error: `Erro ao analisar link: ${error.message}`,
      loja: loja?.nome
    };
  }
}

// Função para gerar anúncio otimizado com IA
async function generateOptimizedAd(product: ProductData): Promise<{ success: boolean; ad?: GeneratedAd; error?: string }> {
  console.log("Gerando anúncio otimizado para:", product.nome);

  const prompt = `Você é um especialista em marketing digital e vendas no Facebook.
Crie um anúncio ULTRA OTIMIZADO para este produto que vai BOMBAR no Facebook Marketplace e Grupos.

PRODUTO:
- Nome: ${product.nome}
- Preço: R$ ${product.preco?.toFixed(2) || '0.00'}
${product.precoOriginal ? `- Preço Original: R$ ${product.precoOriginal.toFixed(2)} (DESCONTO!)` : ''}
${product.precoAtacado ? `- Preço Atacado: R$ ${product.precoAtacado.toFixed(2)}` : ''}
- Descrição: ${product.descricao}
- Categoria: ${product.categoria || 'Moda'}
- Condição: ${product.condicao || 'Novo'}
${product.tamanhos?.length ? `- Tamanhos: ${product.tamanhos.join(', ')}` : ''}
${product.cores?.length ? `- Cores: ${product.cores.join(', ')}` : ''}
${product.loja ? `- Loja: ${product.loja}` : ''}
- Palavras-chave existentes: ${product.palavrasChave?.join(', ') || 'moda, roupa'}

REGRAS IMPORTANTES:
1. O título deve ter NO MÁXIMO 100 caracteres e ser CHAMATIVO
2. Use emojis estratégicos (🔥🛒💰✨⚡️👗👚👔🎁) para chamar atenção
3. Crie URGÊNCIA e ESCASSEZ (últimas peças, promoção por tempo limitado)
4. O texto do grupo deve ser mais informal e engajador
5. O texto do marketplace deve ser mais profissional
6. Gere palavras-chave que as pessoas realmente buscam no Facebook
7. Hashtags devem ser relevantes para o nicho de moda/vendas

Retorne APENAS um JSON válido:
{
  "titulo": "título otimizado (max 100 chars)",
  "descricao": "descrição curta e vendedora",
  "palavrasChave": ["palavra1", "palavra2", "..." ],
  "hashtagsOtimizadas": ["#hashtag1", "#hashtag2", "..."],
  "textoGrupo": "texto completo para postar em grupos (com emojis, CTA forte, crie urgência)",
  "textoMarketplace": "texto para o marketplace (mais direto, profissional, com todas as informações)"
}`;

  try {
    const response = await fetch("https://api.lovable.dev/ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "Você é um especialista em marketing digital. Responda sempre em JSON válido sem markdown." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      throw new Error("Erro na API de IA");
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content || "";
    
    // Limpar possíveis marcadores de código
    let jsonStr = content
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Não foi possível gerar o anúncio");
    }

    const generatedAd = JSON.parse(jsonMatch[0]) as GeneratedAd;
    
    return { success: true, ad: generatedAd };
  } catch (error: any) {
    console.error("Erro ao gerar anúncio:", error);
    return { success: false, error: error.message };
  }
}

// Função para publicar anúncio
async function publishAd(
  userId: string,
  product: ProductData,
  ad: GeneratedAd,
  selectedGroups: string[],
  publishToMarketplace: boolean,
  supabaseClient: any
): Promise<{ success: boolean; marketplaceId?: string; gruposAgendados?: number; error?: string }> {
  
  let marketplaceId: string | undefined;
  let gruposAgendados = 0;

  try {
    // 1. Publicar no Marketplace se selecionado
    if (publishToMarketplace) {
      const { data: marketplaceData, error: marketplaceError } = await supabaseClient
        .from("facebook_marketplace_produtos")
        .insert({
          user_id: userId,
          titulo: ad.titulo,
          descricao: ad.textoMarketplace,
          preco: product.preco,
          categoria: product.categoria || 'Moda',
          condicao: product.condicao || 'Novo',
          status: "ativo",
          imagens: product.imagens,
        })
        .select()
        .single();

      if (marketplaceError) {
        console.error("Erro ao criar produto marketplace:", marketplaceError);
      } else {
        marketplaceId = marketplaceData?.id;
      }
    }

    // 2. Agendar posts nos grupos selecionados
    if (selectedGroups && selectedGroups.length > 0) {
      const horariosOtimizados = [
        { hora: 8, minuto: 30 },
        { hora: 12, minuto: 15 },
        { hora: 14, minuto: 0 },
        { hora: 18, minuto: 30 },
        { hora: 20, minuto: 0 },
        { hora: 21, minuto: 30 },
      ];

      for (let i = 0; i < selectedGroups.length; i++) {
        const grupoId = selectedGroups[i];
        const horario = horariosOtimizados[i % horariosOtimizados.length];
        
        const dataAgendamento = new Date();
        dataAgendamento.setHours(horario.hora, horario.minuto, 0, 0);
        
        if (dataAgendamento < new Date()) {
          dataAgendamento.setDate(dataAgendamento.getDate() + 1);
        }
        
        dataAgendamento.setDate(dataAgendamento.getDate() + Math.floor(i / horariosOtimizados.length));

        const { error: postError } = await supabaseClient
          .from("facebook_posts_grupos")
          .insert({
            user_id: userId,
            grupo_id: grupoId,
            texto: ad.textoGrupo,
            imagem_url: product.imagens?.[0],
            link: product.imagens?.[0],
            status: "agendado",
            agendado_para: dataAgendamento.toISOString(),
            produto_id: marketplaceId,
          });

        if (!postError) {
          gruposAgendados++;
        } else {
          console.error("Erro ao agendar post:", postError);
        }
      }
    }

    return {
      success: true,
      marketplaceId,
      gruposAgendados,
    };
  } catch (error: any) {
    console.error("Erro ao publicar:", error);
    return { success: false, error: error.message };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, linkProduto, productLink, product, ad, userId, selectedGroups, publishToMarketplace, productData, targetPlatforms } = await req.json();
    
    // Criar cliente Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    let result;

    switch (action) {
      case 'analyze': {
        // Analisar link e extrair dados do produto
        const link = productLink || linkProduto;
        if (!link) {
          return new Response(
            JSON.stringify({ success: false, error: 'Link do produto é obrigatório' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }

        result = await analyzeProductLink(link, supabaseClient);
        break;
      }

      case 'generate': {
        // Gerar conteúdo do anúncio com IA
        const productInfo = productData || product;
        if (!productInfo) {
          return new Response(
            JSON.stringify({ success: false, error: 'Dados do produto são obrigatórios' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }

        result = await generateOptimizedAd(productInfo);
        break;
      }

      case 'publish': {
        // Publicar anúncio
        if (!userId || !product || !ad) {
          return new Response(
            JSON.stringify({ success: false, error: 'userId, product e ad são obrigatórios' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }

        result = await publishAd(userId, product, ad, selectedGroups || [], publishToMarketplace || false, supabaseClient);
        break;
      }

      case 'list_stores': {
        // Listar lojas parceiras
        const { data: lojas, error } = await supabaseClient
          .from('lojas_parceiras')
          .select('id, nome, url_base, ativo')
          .eq('ativo', true)
          .order('nome');

        if (error) {
          return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }

        result = { success: true, data: lojas };
        break;
      }

      default:
        return new Response(
          JSON.stringify({ success: false, error: `Ação desconhecida: ${action}` }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Erro na edge function:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
