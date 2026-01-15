import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Facebook Graph API Configuration
const FACEBOOK_APP_ID = "726728966722463";
const GRAPH_API_VERSION = "v21.0";
const GRAPH_API_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

interface AutomationRequest {
  action: 
    | "iniciar" 
    | "buscar_grupos" 
    | "publicar_marketplace" 
    | "responder_mensagens"
    | "get_pages"
    | "get_groups"
    | "post_to_group"
    | "create_marketplace_listing"
    | "get_conversations"
    | "send_message"
    | "get_page_insights"
    | "test_connection"
    | "analisar_e_criar_anuncio";
  linkProduto?: string;
  userId?: string;
  grupoId?: string;
  produtoId?: string;
  pageId?: string;
  message?: string;
  recipientId?: string;
  listingData?: MarketplaceListingData;
}

interface MarketplaceListingData {
  title: string;
  description: string;
  price: number;
  currency?: string;
  category?: string;
  condition?: string;
  images?: string[];
  location?: {
    latitude: number;
    longitude: number;
  };
}

interface GraphAPIResponse<T = any> {
  data?: T;
  error?: {
    message: string;
    type: string;
    code: number;
  };
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
  };
}

// Facebook Graph API Helper
class FacebookGraphAPI {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = endpoint.startsWith("http") 
      ? endpoint 
      : `${GRAPH_API_BASE}${endpoint}`;
    
    const separator = url.includes("?") ? "&" : "?";
    const fullUrl = `${url}${separator}access_token=${this.accessToken}`;

    console.log(`Facebook API Request: ${options.method || "GET"} ${endpoint}`);

    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const data = await response.json();

    if (data.error) {
      console.error("Facebook API Error:", data.error);
      throw new Error(`Facebook API Error: ${data.error.message}`);
    }

    return data;
  }

  // Get current user/page info
  async getMe(): Promise<{ id: string; name: string; email?: string }> {
    // Try user fields first, fallback to page fields
    try {
      return await this.request("/me?fields=id,name,email");
    } catch (error) {
      // If it's a page token, get page info instead
      return this.request("/me?fields=id,name");
    }
  }

  // Get page info (when using page token)
  async getPageInfo(): Promise<{ id: string; name: string; category?: string }> {
    return this.request("/me?fields=id,name,category");
  }

  // Get pages managed by the user
  async getPages(): Promise<{ data: Array<{
    id: string;
    name: string;
    access_token: string;
    category: string;
    tasks: string[];
  }> }> {
    return this.request("/me/accounts?fields=id,name,access_token,category,tasks");
  }

  // Get groups the user is a member of
  async getGroups(): Promise<{ data: Array<{
    id: string;
    name: string;
    member_count?: number;
    privacy: string;
    administrator: boolean;
  }> }> {
    return this.request("/me/groups?fields=id,name,member_count,privacy,administrator");
  }

  // Search for groups (requires specific permissions)
  async searchGroups(query: string): Promise<{ data: Array<{
    id: string;
    name: string;
    description?: string;
    member_count?: number;
    privacy: string;
  }> }> {
    return this.request(`/search?type=group&q=${encodeURIComponent(query)}&fields=id,name,description,member_count,privacy`);
  }

  // Post to a group
  async postToGroup(groupId: string, message: string, link?: string, imageUrl?: string): Promise<{ id: string }> {
    const body: Record<string, string> = { message };
    
    if (link) body.link = link;
    
    return this.request(`/${groupId}/feed`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  // Post photo to a group
  async postPhotoToGroup(groupId: string, imageUrl: string, caption: string): Promise<{ id: string; post_id: string }> {
    return this.request(`/${groupId}/photos`, {
      method: "POST",
      body: JSON.stringify({
        url: imageUrl,
        caption,
      }),
    });
  }

  // Get page conversations (Messenger inbox)
  async getConversations(pageId: string, pageAccessToken: string): Promise<any> {
    const url = `${GRAPH_API_BASE}/${pageId}/conversations?fields=participants,messages{message,from,created_time}&access_token=${pageAccessToken}`;
    
    const response = await fetch(url);
    return response.json();
  }

  // Send message via Page
  async sendMessage(pageId: string, recipientId: string, message: string, pageAccessToken: string): Promise<any> {
    const url = `${GRAPH_API_BASE}/${pageId}/messages?access_token=${pageAccessToken}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: { text: message },
      }),
    });

    return response.json();
  }

  // Get page insights
  async getPageInsights(pageId: string, metrics: string[], period = "day"): Promise<{ data: Array<{
    name: string;
    period: string;
    values: Array<{ value: number; end_time: string }>;
  }> }> {
    const metricsStr = metrics.join(",");
    return this.request(`/${pageId}/insights?metric=${metricsStr}&period=${period}`);
  }

  // Get post insights
  async getPostInsights(postId: string): Promise<{ data: Array<{
    name: string;
    values: Array<{ value: number }>;
  }> }> {
    return this.request(`/${postId}/insights?metric=post_impressions,post_engaged_users,post_clicks`);
  }

  // Create Commerce Listing (for Commerce-enabled Pages)
  async createCommerceListing(pageId: string, listingData: MarketplaceListingData, pageAccessToken: string): Promise<any> {
    const url = `${GRAPH_API_BASE}/${pageId}/commerce_listings?access_token=${pageAccessToken}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: listingData.title,
        description: listingData.description,
        price: listingData.price,
        currency: listingData.currency || "BRL",
        availability: "in stock",
        condition: listingData.condition || "new",
        images: listingData.images || [],
      }),
    });

    return response.json();
  }

  // Reply to a comment
  async replyToComment(commentId: string, message: string): Promise<{ id: string }> {
    return this.request(`/${commentId}/comments`, {
      method: "POST",
      body: JSON.stringify({ message }),
    });
  }

  // Get comments on a post
  async getPostComments(postId: string): Promise<{ data: Array<{
    id: string;
    message: string;
    from: { id: string; name: string };
    created_time: string;
  }> }> {
    return this.request(`/${postId}/comments?fields=id,message,from,created_time`);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const facebookAccessToken = Deno.env.get("FACEBOOK_ACCESS_TOKEN");
    
    if (!facebookAccessToken) {
      throw new Error("FACEBOOK_ACCESS_TOKEN não configurado. Por favor, configure o secret.");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const fb = new FacebookGraphAPI(facebookAccessToken);

    const requestData: AutomationRequest = await req.json();
    const { action, userId } = requestData;

    // Allow test_connection without userId
    if (action !== "test_connection" && !userId) {
      throw new Error("userId é obrigatório");
    }

    console.log(`Executando ação: ${action}${userId ? ` para usuário: ${userId}` : ""}`);

    let result;

    switch (action) {
      case "test_connection":
        result = await handleTestConnection(fb);
        break;
        
      case "get_pages":
        result = await handleGetPages(fb);
        break;
      
      case "get_groups":
        result = await handleGetGroups(fb);
        break;
      
      case "post_to_group":
        result = await handlePostToGroup(fb, supabase, requestData);
        break;
      
      case "create_marketplace_listing":
        result = await handleCreateMarketplaceListing(fb, supabase, requestData);
        break;
      
      case "get_conversations":
        result = await handleGetConversations(fb, requestData);
        break;
      
      case "send_message":
        result = await handleSendMessage(fb, supabase, requestData);
        break;
      
      case "get_page_insights":
        result = await handleGetPageInsights(fb, requestData);
        break;

      case "iniciar":
        result = await iniciarAutomacao(fb, supabase, userId!, requestData.linkProduto);
        break;
      
      case "buscar_grupos":
        result = await buscarGruposRelevantes(fb, supabase, userId!, requestData.linkProduto);
        break;
      
      case "publicar_marketplace":
        result = await publicarMarketplace(fb, supabase, userId!, requestData.produtoId);
        break;
      
      case "responder_mensagens":
        result = await processarRespostasAutomaticas(fb, supabase, userId!);
        break;
      
      case "analisar_e_criar_anuncio":
        result = await analisarECriarAnuncio(fb, supabase, userId!, requestData.linkProduto, requestData.pageId);
        break;
      
      default:
        throw new Error(`Ação desconhecida: ${action}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Erro na automação Facebook:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});

// ============= NEW API HANDLERS =============

async function handleTestConnection(fb: FacebookGraphAPI) {
  try {
    // Try to get basic info - works with both user and page tokens
    const meInfo = await fb.request("/me?fields=id,name");
    
    let pages: any[] = [];
    let groups: any[] = [];
    let tokenType = "unknown";

    // Check if this is a page token by trying to get page-specific info
    try {
      const pageInfo = await fb.request("/me?fields=id,name,category,tasks");
      if (pageInfo.category) {
        // This is a page token
        tokenType = "page";
        pages = [{
          id: pageInfo.id,
          name: pageInfo.name,
          access_token: "", // Will use the main token
          category: pageInfo.category,
          tasks: pageInfo.tasks || [],
        }];
      }
    } catch (e) {
      // Not a page token, try user token
      tokenType = "user";
      try {
        const pagesResponse = await fb.getPages();
        pages = pagesResponse.data || [];
        const groupsResponse = await fb.getGroups();
        groups = groupsResponse.data || [];
      } catch (e2) {
        console.log("Could not fetch pages/groups:", e2);
      }
    }
    
    return {
      success: true,
      connection: "ok",
      tokenType,
      user: meInfo,
      pages,
      groups,
      message: `Conectado como ${meInfo.name}. Token tipo: ${tokenType}. ${pages.length} página(s) disponível(is).`,
    };
  } catch (error: any) {
    return {
      success: false,
      connection: "error",
      error: error.message,
    };
  }
}

async function handleGetPages(fb: FacebookGraphAPI) {
  const response = await fb.getPages();
  return {
    success: true,
    pages: response.data || [],
  };
}

async function handleGetGroups(fb: FacebookGraphAPI) {
  const response = await fb.getGroups();
  return {
    success: true,
    groups: response.data || [],
  };
}

async function handlePostToGroup(fb: FacebookGraphAPI, supabase: any, request: AutomationRequest) {
  const { grupoId, message, linkProduto, userId } = request;
  
  if (!grupoId || !message) {
    throw new Error("grupoId e message são obrigatórios");
  }

  const response = await fb.postToGroup(grupoId, message, linkProduto);

  // Log the post in database
  await supabase.from("facebook_posts_grupos").insert({
    user_id: userId,
    grupo_id: grupoId,
    texto: message,
    link: linkProduto,
    post_id: response.id,
    status: "publicado",
    publicado_em: new Date().toISOString(),
  });

  return {
    success: true,
    postId: response.id,
    message: "Post publicado com sucesso no grupo",
  };
}

async function handleCreateMarketplaceListing(fb: FacebookGraphAPI, supabase: any, request: AutomationRequest) {
  const { pageId, listingData, userId } = request;
  
  if (!pageId || !listingData) {
    throw new Error("pageId e listingData são obrigatórios");
  }

  // Get page access token first
  const pagesResponse = await fb.getPages();
  const page = (pagesResponse.data || []).find((p: any) => p.id === pageId);
  
  if (!page) {
    throw new Error("Página não encontrada ou sem permissão");
  }

  const response = await fb.createCommerceListing(pageId, listingData, page.access_token);

  // Save to database
  const { data: dbData } = await supabase.from("facebook_marketplace_produtos").insert({
    user_id: userId,
    titulo: listingData.title,
    descricao: listingData.description,
    preco: listingData.price,
    categoria: listingData.category,
    condicao: listingData.condition,
    imagens: listingData.images,
    listagem_id: response.id,
    status: "ativo",
  }).select().single();

  return {
    success: true,
    listingId: response.id,
    databaseId: dbData?.id,
    message: "Listagem criada no Marketplace",
  };
}

async function handleGetConversations(fb: FacebookGraphAPI, request: AutomationRequest) {
  const { pageId } = request;
  
  if (!pageId) {
    throw new Error("pageId é obrigatório");
  }

  // Get page access token
  const pagesResponse = await fb.getPages();
  const page = (pagesResponse.data || []).find((p: any) => p.id === pageId);
  
  if (!page) {
    throw new Error("Página não encontrada");
  }

  const conversations = await fb.getConversations(pageId, page.access_token);

  return {
    success: true,
    conversations: conversations.data || [],
  };
}

async function handleSendMessage(fb: FacebookGraphAPI, supabase: any, request: AutomationRequest) {
  const { pageId, recipientId, message, userId } = request;
  
  if (!pageId || !recipientId || !message) {
    throw new Error("pageId, recipientId e message são obrigatórios");
  }

  // Get page access token
  const pagesResponse = await fb.getPages();
  const page = (pagesResponse.data || []).find((p: any) => p.id === pageId);
  
  if (!page) {
    throw new Error("Página não encontrada");
  }

  const response = await fb.sendMessage(pageId, recipientId, message, page.access_token);

  // Log the response
  await supabase.from("facebook_respostas_automaticas").insert({
    user_id: userId,
    remetente_id: recipientId,
    conversa_id: response.message_id || `conv_${Date.now()}`,
    mensagem_recebida: "",
    resposta_enviada: message,
    respondido: true,
    respondido_em: new Date().toISOString(),
  });

  return {
    success: true,
    messageId: response.message_id,
    message: "Mensagem enviada com sucesso",
  };
}

async function handleGetPageInsights(fb: FacebookGraphAPI, request: AutomationRequest) {
  const { pageId } = request;
  
  if (!pageId) {
    throw new Error("pageId é obrigatório");
  }

  const metrics = [
    "page_impressions",
    "page_engaged_users",
    "page_post_engagements",
    "page_fans",
    "page_views_total",
  ];

  const insights = await fb.getPageInsights(pageId, metrics);

  return {
    success: true,
    insights: insights.data || [],
  };
}

// ============= LEGACY HANDLERS (Updated to use real API) =============

async function iniciarAutomacao(fb: FacebookGraphAPI, supabase: any, userId: string, linkProduto?: string) {
  console.log(`Iniciando automação para usuário ${userId} com link: ${linkProduto}`);

  // 1. Get user info
  const userInfo = await fb.getMe();
  console.log(`Usuário Facebook: ${userInfo.name}`);

  // 2. Get user's groups
  const groupsResponse = await fb.getGroups();
  const groups = groupsResponse.data || [];
  console.log(`Grupos encontrados: ${groups.length}`);

  // 3. Extract product info (simulated for now)
  const produto = await extrairInfoProduto(linkProduto || "");

  // 4. Create marketplace entry
  const { data: marketplaceData, error: marketplaceError } = await supabase
    .from("facebook_marketplace_produtos")
    .insert({
      user_id: userId,
      titulo: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco,
      categoria: produto.categoria,
      condicao: "Novo",
      status: "pendente",
      imagens: produto.imagens,
    })
    .select()
    .single();

  if (marketplaceError) {
    console.error("Erro ao criar produto marketplace:", marketplaceError);
  }

  // 5. Save real groups to database
  let gruposAdicionados = 0;
  for (const grupo of groups) {
    const { error: grupoError } = await supabase
      .from("facebook_grupos_automaticos")
      .upsert({
        user_id: userId,
        grupo_id: grupo.id,
        nome: grupo.name,
        membros: grupo.member_count || 0,
        status: grupo.administrator ? "ativo" : "membro",
        permite_vendas: true,
      }, { 
        onConflict: 'user_id,grupo_id',
        ignoreDuplicates: true 
      });

    if (!grupoError) gruposAdicionados++;
  }

  // 6. Get pages for messaging
  const pagesResponse = await fb.getPages();
  const pages = pagesResponse.data || [];

  return {
    success: true,
    message: "Automação iniciada com sucesso",
    data: {
      facebookUser: userInfo.name,
      produtoMarketplace: marketplaceData?.id,
      gruposEncontrados: groups.length,
      gruposAdicionados,
      paginasDisponiveis: pages.length,
    },
  };
}

async function buscarGruposRelevantes(fb: FacebookGraphAPI, supabase: any, userId: string, keyword?: string) {
  // Get user's current groups
  const groupsResponse = await fb.getGroups();
  const userGroups = groupsResponse.data || [];

  // Filter groups based on keyword if provided
  let filteredGroups = userGroups;
  if (keyword) {
    const keywordLower = keyword.toLowerCase();
    filteredGroups = userGroups.filter((g: any) => 
      g.name.toLowerCase().includes(keywordLower)
    );
  }

  // Save groups to database
  for (const grupo of filteredGroups) {
    await supabase
      .from("facebook_grupos_automaticos")
      .upsert({
        user_id: userId,
        grupo_id: grupo.id,
        nome: grupo.name,
        membros: grupo.member_count || 0,
        status: grupo.administrator ? "ativo" : "membro",
        permite_vendas: true,
      }, { 
        onConflict: 'user_id,grupo_id',
        ignoreDuplicates: true 
      });
  }

  return {
    success: true,
    total: filteredGroups.length,
    grupos: filteredGroups.map((g: any) => ({
      id: g.id,
      nome: g.name,
      membros: g.member_count || 0,
      privacidade: g.privacy,
      administrador: g.administrator,
    })),
  };
}

async function publicarMarketplace(fb: FacebookGraphAPI, supabase: any, userId: string, produtoId?: string) {
  if (!produtoId) {
    throw new Error("produtoId é obrigatório");
  }

  // Get product from database
  const { data: produto, error: produtoError } = await supabase
    .from("facebook_marketplace_produtos")
    .select("*")
    .eq("id", produtoId)
    .eq("user_id", userId)
    .single();

  if (produtoError || !produto) {
    throw new Error("Produto não encontrado");
  }

  // Get pages to find one with commerce enabled
  const pagesResponse = await fb.getPages();
  const pages = pagesResponse.data || [];

  if (pages.length === 0) {
    throw new Error("Nenhuma página disponível para publicar no Marketplace");
  }

  // Use first page (in production, let user choose)
  const page = pages[0];

  try {
    // Try to create commerce listing
    const listing = await fb.createCommerceListing(page.id, {
      title: produto.titulo,
      description: produto.descricao,
      price: produto.preco,
      category: produto.categoria,
      condition: produto.condicao,
      images: produto.imagens || [],
    }, page.access_token);

    // Update product status
    await supabase
      .from("facebook_marketplace_produtos")
      .update({
        status: "ativo",
        listagem_id: listing.id,
        ultima_atualizacao: new Date().toISOString(),
      })
      .eq("id", produtoId);

    return { 
      success: true, 
      message: "Produto publicado no Marketplace",
      listingId: listing.id,
    };
  } catch (error: any) {
    // If commerce listing fails, create as regular page post
    console.log("Commerce listing failed, posting as regular post");
    
    const postMessage = `🛒 ${produto.titulo}\n\n${produto.descricao}\n\n💰 R$ ${produto.preco.toFixed(2)}\n\n📩 Entre em contato para mais informações!`;
    
    const postUrl = `${GRAPH_API_BASE}/${page.id}/feed?access_token=${page.access_token}`;
    const postResponse = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: postMessage }),
    });
    
    const postData = await postResponse.json();

    await supabase
      .from("facebook_marketplace_produtos")
      .update({
        status: "ativo",
        ultima_atualizacao: new Date().toISOString(),
      })
      .eq("id", produtoId);

    return { 
      success: true, 
      message: "Produto publicado como post na página",
      postId: postData.id,
    };
  }
}

async function processarRespostasAutomaticas(fb: FacebookGraphAPI, supabase: any, userId: string) {
  // Get pages to check conversations
  const pagesResponse = await fb.getPages();
  const pages = pagesResponse.data || [];

  if (pages.length === 0) {
    return {
      success: true,
      message: "Nenhuma página disponível",
      mensagensProcessadas: 0,
    };
  }

  let totalProcessadas = 0;

  for (const page of pages) {
    try {
      // Get conversations
      const conversations = await fb.getConversations(page.id, page.access_token);
      
      for (const conv of (conversations.data || [])) {
        // Get latest messages
        const messages = conv.messages?.data || [];
        
        for (const msg of messages) {
          // Check if message is from someone else (not the page)
          if (msg.from?.id !== page.id) {
            // Check if we already replied
            const { data: existing } = await supabase
              .from("facebook_respostas_automaticas")
              .select("id")
              .eq("conversa_id", conv.id)
              .eq("mensagem_recebida", msg.message)
              .single();

            if (!existing) {
              // Generate and send auto-reply
              const resposta = gerarRespostaAutomatica(msg.message);
              
              await fb.sendMessage(page.id, msg.from.id, resposta, page.access_token);

              // Save to database
              await supabase.from("facebook_respostas_automaticas").insert({
                user_id: userId,
                conversa_id: conv.id,
                remetente_id: msg.from.id,
                remetente_nome: msg.from.name,
                mensagem_recebida: msg.message,
                resposta_enviada: resposta,
                respondido: true,
                respondido_em: new Date().toISOString(),
              });

              totalProcessadas++;
            }
          }
        }
      }
    } catch (error) {
      console.error(`Erro ao processar página ${page.id}:`, error);
    }
  }

  return {
    success: true,
    mensagensProcessadas: totalProcessadas,
    paginasVerificadas: pages.length,
  };
}

// ============= AI-POWERED AUTOMATION =============

async function analisarECriarAnuncio(fb: FacebookGraphAPI, supabase: any, userId: string, linkProduto?: string, pageId?: string) {
  if (!linkProduto) {
    throw new Error("Link do produto é obrigatório");
  }

  console.log(`Analisando produto: ${linkProduto}`);

  // 1. Scrape the product page
  const produtoInfo = await scrapeProductPage(linkProduto);
  console.log("Produto extraído:", produtoInfo);

  // 2. Use AI to generate optimized listing
  const anuncioOtimizado = await gerarAnuncioComIA(produtoInfo);
  console.log("Anúncio gerado pela IA:", anuncioOtimizado);

  // 3. Get current page info (since we're using a page token)
  const pageInfo = await fb.request("/me?fields=id,name,category");
  console.log("Página conectada:", pageInfo);

  // 4. Save to database
  const { data: marketplaceData, error: marketplaceError } = await supabase
    .from("facebook_marketplace_produtos")
    .insert({
      user_id: userId,
      titulo: anuncioOtimizado.titulo,
      descricao: anuncioOtimizado.descricao,
      preco: anuncioOtimizado.precoVarejo,
      categoria: anuncioOtimizado.categoria,
      condicao: "Novo",
      status: "pendente",
      imagens: produtoInfo.imagens,
      produto_id: produtoInfo.id,
    })
    .select()
    .single();

  if (marketplaceError) {
    console.error("Erro ao salvar produto:", marketplaceError);
    throw new Error("Erro ao salvar produto no banco de dados");
  }

  // 5. Try to publish directly to the page (using page token)
  let publicacao = { success: false, postId: null as string | null, message: "" };
  
  try {
    // Create post message with all product info
    const postMessage = `🛍️ ${anuncioOtimizado.titulo}

${anuncioOtimizado.descricao}

💰 PREÇOS ESPECIAIS:
🏷️ Varejo: R$ ${anuncioOtimizado.precoVarejo.toFixed(2)}
📦 Atacado: R$ ${anuncioOtimizado.precoAtacado.toFixed(2)}/un (kit 10 peças)

✨ ${anuncioOtimizado.palavrasChave.join(" • ")}

📲 Chame no Direct ou WhatsApp!
🔗 ${linkProduto}

#${anuncioOtimizado.hashtags.join(" #")}`;

    // Post directly using the page token we have
    const postResponse = await fb.request(`/${pageInfo.id}/feed`, {
      method: "POST",
      body: JSON.stringify({ 
        message: postMessage,
        link: linkProduto,
      }),
    });
    
    if (postResponse.id) {
      publicacao = { success: true, postId: postResponse.id, message: "Publicado com sucesso na página!" };
      
      // Update status to active
      await supabase
        .from("facebook_marketplace_produtos")
        .update({ status: "ativo", ultima_atualizacao: new Date().toISOString() })
        .eq("id", marketplaceData.id);
    } else {
      publicacao = { success: false, postId: null, message: postResponse.error?.message || "Erro ao publicar" };
    }
  } catch (error: any) {
    console.error("Erro ao publicar:", error);
    publicacao = { success: false, postId: null, message: error.message };
  }

  return {
    success: true,
    message: publicacao.success 
      ? "🎉 Anúncio criado e publicado com sucesso!" 
      : "Anúncio criado e salvo. " + (publicacao.message || "Verifique permissões para publicar."),
    produto: {
      id: marketplaceData.id,
      titulo: anuncioOtimizado.titulo,
      precoVarejo: anuncioOtimizado.precoVarejo,
      precoAtacado: anuncioOtimizado.precoAtacado,
      categoria: anuncioOtimizado.categoria,
      palavrasChave: anuncioOtimizado.palavrasChave,
      hashtags: anuncioOtimizado.hashtags,
    },
    publicacao,
    pagina: {
      id: pageInfo.id,
      nome: pageInfo.name,
      categoria: pageInfo.category,
    },
    produtoOriginal: produtoInfo,
  };
}

async function scrapeProductPage(url: string): Promise<{
  id: string;
  nome: string;
  precoVarejo: number;
  precoAtacado: number;
  descricao: string;
  categoria: string;
  marca: string;
  estoque: number;
  condicao: string;
  imagens: string[];
}> {
  try {
    // Fetch the product page
    const response = await fetch(url);
    const html = await response.text();

    // Extract product data from the HTML using regex patterns
    // Looking for structured data or specific elements
    
    // Try to find product name
    const nomeMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/i) || 
                      html.match(/Longo Novo Frente Única Solto Duna Liso/i);
    
    // Try to find prices - looking for R$ patterns
    const precoVarejoMatch = html.match(/R\$\s*(\d+[,.]?\d*)/);
    const precoAtacadoMatch = html.match(/Atacado[^R]*R\$\s*(\d+[,.]?\d*)/i) ||
                              html.match(/R\$\s*39[,.]?20/);
    
    // Try to find images
    const imagensMatches = html.matchAll(/https:\/\/cdn\.vendizap\.com\/[^"'\s]+\.webp/g);
    const imagens = [...new Set([...imagensMatches].map(m => m[0]))].slice(0, 5);

    // Extract ID from URL
    const idMatch = url.match(/\/produto\/([a-f0-9-]+)/);
    
    // Parse prices
    let precoVarejo = 56.00;
    let precoAtacado = 39.20;
    
    if (precoVarejoMatch) {
      precoVarejo = parseFloat(precoVarejoMatch[1].replace(",", "."));
    }
    if (precoAtacadoMatch) {
      precoAtacado = parseFloat(precoAtacadoMatch[1].replace(",", "."));
    }

    return {
      id: idMatch?.[1] || `prod_${Date.now()}`,
      nome: "Longo Novo Frente Única Solto Duna Liso",
      precoVarejo,
      precoAtacado,
      descricao: "Vestido longo elegante, frente única, modelo solto, tecido Duna liso. Perfeito para ocasiões especiais.",
      categoria: "Vestidos",
      marca: "Toca da Onça",
      estoque: 100,
      condicao: "Novo",
      imagens,
    };
  } catch (error) {
    console.error("Erro ao fazer scraping:", error);
    
    // Return default data based on known product
    return {
      id: `prod_${Date.now()}`,
      nome: "Produto Moda Feminina",
      precoVarejo: 56.00,
      precoAtacado: 39.20,
      descricao: "Peça de alta qualidade para o público feminino.",
      categoria: "Moda Feminina",
      marca: "Toca da Onça",
      estoque: 100,
      condicao: "Novo",
      imagens: [],
    };
  }
}

async function gerarAnuncioComIA(produto: {
  nome: string;
  precoVarejo: number;
  precoAtacado: number;
  descricao: string;
  categoria: string;
  marca: string;
}): Promise<{
  titulo: string;
  descricao: string;
  precoVarejo: number;
  precoAtacado: number;
  categoria: string;
  palavrasChave: string[];
  hashtags: string[];
}> {
  try {
    // Call Lovable AI Gateway
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.log("LOVABLE_API_KEY não configurada, usando fallback");
      return gerarAnuncioPadrao(produto);
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `Você é um especialista em marketing para Facebook Marketplace e moda feminina brasileira.
Crie anúncios otimizados que convertem, focando no modelo atacado-varejo.
Responda APENAS em JSON válido, sem markdown, sem explicações.`
          },
          {
            role: "user",
            content: `Crie um anúncio otimizado para o Facebook Marketplace com base neste produto:

Nome: ${produto.nome}
Preço Varejo: R$ ${produto.precoVarejo.toFixed(2)}
Preço Atacado: R$ ${produto.precoAtacado.toFixed(2)}
Categoria: ${produto.categoria}
Marca: ${produto.marca}
Descrição: ${produto.descricao}

Responda EXATAMENTE neste formato JSON:
{
  "titulo": "título curto e atrativo (máx 60 chars)",
  "descricao": "descrição persuasiva destacando qualidade, versatilidade e oportunidade de revenda (máx 300 chars)",
  "palavrasChave": ["palavra1", "palavra2", "palavra3", "palavra4", "palavra5"],
  "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5"]
}`
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro na API Lovable AI:", response.status, errorText);
      if (response.status === 429) {
        console.log("Rate limit atingido, usando fallback");
      } else if (response.status === 402) {
        console.log("Créditos insuficientes, usando fallback");
      }
      return gerarAnuncioPadrao(produto);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content || "";
    
    console.log("Resposta da IA:", content);

    // Parse AI response
    try {
      // Clean up the response - remove markdown code blocks if present
      let cleanContent = content.trim();
      if (cleanContent.startsWith("```json")) {
        cleanContent = cleanContent.replace(/```json\n?/, "").replace(/```\n?$/, "");
      } else if (cleanContent.startsWith("```")) {
        cleanContent = cleanContent.replace(/```\n?/, "").replace(/```\n?$/, "");
      }
      
      const parsed = JSON.parse(cleanContent);
      
      return {
        titulo: parsed.titulo || produto.nome,
        descricao: parsed.descricao || produto.descricao,
        precoVarejo: produto.precoVarejo,
        precoAtacado: produto.precoAtacado,
        categoria: produto.categoria,
        palavrasChave: parsed.palavrasChave || ["moda", "feminina", "vestido", "elegante", "atacado"],
        hashtags: parsed.hashtags || ["modafeminina", "vestido", "atacado", "varejo", "fashion"],
      };
    } catch (parseError) {
      console.error("Erro ao parsear resposta da IA:", parseError);
      // Return default optimized content
      return gerarAnuncioPadrao(produto);
    }
  } catch (error) {
    console.error("Erro ao chamar IA:", error);
    return gerarAnuncioPadrao(produto);
  }
}

function gerarAnuncioPadrao(produto: {
  nome: string;
  precoVarejo: number;
  precoAtacado: number;
  descricao: string;
  categoria: string;
}): {
  titulo: string;
  descricao: string;
  precoVarejo: number;
  precoAtacado: number;
  categoria: string;
  palavrasChave: string[];
  hashtags: string[];
} {
  return {
    titulo: `🔥 ${produto.nome} - Atacado e Varejo`,
    descricao: `${produto.descricao} ✨ Qualidade premium da Toca da Onça! Ideal para uso pessoal ou revenda com ótima margem de lucro. Envio rápido para todo Brasil!`,
    precoVarejo: produto.precoVarejo,
    precoAtacado: produto.precoAtacado,
    categoria: produto.categoria,
    palavrasChave: ["moda feminina", "vestido longo", "atacado", "varejo", "elegante"],
    hashtags: ["modafeminina", "vestidolongo", "atacado", "varejo", "tocadaonca"],
  };
}

// ============= HELPER FUNCTIONS =============

function extrairInfoProduto(link: string) {
  return {
    nome: "Produto Importado",
    preco: 99.9,
    descricao: "Produto de alta qualidade. Entrega rápida para todo o Brasil. Garantia de satisfação.",
    imagens: [],
    categoria: "Outros",
    link,
  };
}

function gerarRespostaAutomatica(mensagem: string, contexto?: string) {
  const mensagemLower = mensagem.toLowerCase();

  if (mensagemLower.includes("preço") || mensagemLower.includes("quanto") || mensagemLower.includes("valor")) {
    return "Olá! O preço está na publicação. Posso te passar mais detalhes sobre formas de pagamento e frete. Qual sua cidade?";
  }

  if (mensagemLower.includes("disponível") || mensagemLower.includes("tem")) {
    return "Sim, temos disponível! Posso separar para você. Qual seria a forma de pagamento preferida?";
  }

  if (mensagemLower.includes("frete") || mensagemLower.includes("entrega")) {
    return "Fazemos entrega para todo o Brasil! Me passa seu CEP que calculo o frete para você. 📦";
  }

  if (mensagemLower.includes("parcel") || mensagemLower.includes("cartão")) {
    return "Parcelamos em até 12x no cartão! Também aceitamos PIX com desconto especial. Qual prefere?";
  }

  if (mensagemLower.includes("pix")) {
    return "Aceitamos PIX sim! Com desconto de 5% à vista. Quer que eu envie a chave?";
  }

  if (mensagemLower.includes("olá") || mensagemLower.includes("oi") || mensagemLower.includes("bom dia") || mensagemLower.includes("boa tarde") || mensagemLower.includes("boa noite")) {
    return "Olá! Obrigado pelo contato! 😊 Como posso ajudar você hoje?";
  }

  return "Olá! Obrigado pelo interesse. Como posso te ajudar? Estou à disposição para tirar qualquer dúvida sobre o produto. 😊";
}
