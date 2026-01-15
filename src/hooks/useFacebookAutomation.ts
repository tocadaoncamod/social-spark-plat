import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface FacebookGrupo {
  id: string;
  user_id: string;
  grupo_id: string;
  nome: string;
  descricao?: string;
  membros: number;
  status: string;
  regras?: Record<string, unknown>;
  requisitos_entrada?: Record<string, unknown>;
  permite_vendas: boolean;
  ultimo_post?: string;
  proximo_post?: string;
  created_at: string;
  updated_at: string;
}

export interface FacebookPostGrupo {
  id: string;
  user_id: string;
  grupo_id: string;
  produto_id?: string;
  post_id?: string;
  texto: string;
  imagem_url?: string;
  link?: string;
  status: string;
  agendado_para?: string;
  publicado_em?: string;
  created_at: string;
}

export interface FacebookMarketplaceProduto {
  id: string;
  user_id: string;
  produto_id?: string;
  listagem_id?: string;
  titulo: string;
  descricao: string;
  preco: number;
  categoria?: string;
  condicao: string;
  localizacao?: string;
  imagens?: string[];
  status: string;
  visualizacoes: number;
  mensagens: number;
  ultima_atualizacao?: string;
  created_at: string;
}

export interface FacebookRespostaAutomatica {
  id: string;
  user_id: string;
  conversa_id: string;
  remetente_id: string;
  remetente_nome?: string;
  mensagem_recebida: string;
  resposta_enviada?: string;
  contexto?: string;
  produto_id?: string;
  respondido: boolean;
  respondido_em?: string;
  created_at: string;
}

export interface FacebookStats {
  gruposAtivos: number;
  gruposPendentes: number;
  postsAgendados: number;
  postsPublicados: number;
  produtosMarketplace: number;
  mensagensRecebidas: number;
  mensagensRespondidas: number;
  visualizacoesTotal: number;
}

export interface ProdutoInfo {
  nome: string;
  preco: number;
  descricao: string;
  imagens: string[];
  categoria: string;
  link: string;
}

// Hook para estatísticas gerais
export function useFacebookStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["facebook-stats", user?.id],
    queryFn: async (): Promise<FacebookStats> => {
      if (!user) throw new Error("Usuário não autenticado");

      const [gruposRes, postsRes, marketplaceRes, respostasRes] = await Promise.all([
        supabase
          .from("facebook_grupos_automaticos")
          .select("status")
          .eq("user_id", user.id),
        supabase
          .from("facebook_posts_grupos")
          .select("status")
          .eq("user_id", user.id),
        supabase
          .from("facebook_marketplace_produtos")
          .select("status, visualizacoes")
          .eq("user_id", user.id),
        supabase
          .from("facebook_respostas_automaticas")
          .select("respondido")
          .eq("user_id", user.id),
      ]);

      const grupos = gruposRes.data || [];
      const posts = postsRes.data || [];
      const marketplace = marketplaceRes.data || [];
      const respostas = respostasRes.data || [];

      return {
        gruposAtivos: grupos.filter((g) => g.status === "ativo").length,
        gruposPendentes: grupos.filter((g) => g.status === "pendente").length,
        postsAgendados: posts.filter((p) => p.status === "agendado").length,
        postsPublicados: posts.filter((p) => p.status === "publicado").length,
        produtosMarketplace: marketplace.filter((m) => m.status === "ativo").length,
        mensagensRecebidas: respostas.length,
        mensagensRespondidas: respostas.filter((r) => r.respondido).length,
        visualizacoesTotal: marketplace.reduce((acc, m) => acc + (m.visualizacoes || 0), 0),
      };
    },
    enabled: !!user,
  });
}

// Hook para grupos automáticos
export function useFacebookGrupos() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["facebook-grupos", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("facebook_grupos_automaticos")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as FacebookGrupo[];
    },
    enabled: !!user,
  });
}

// Hook para posts em grupos
export function useFacebookPosts() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["facebook-posts", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("facebook_posts_grupos")
        .select("*, facebook_grupos_automaticos(nome)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as (FacebookPostGrupo & { facebook_grupos_automaticos?: { nome: string } })[];
    },
    enabled: !!user,
  });
}

// Hook para produtos do Marketplace
export function useFacebookMarketplace() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["facebook-marketplace", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("facebook_marketplace_produtos")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as FacebookMarketplaceProduto[];
    },
    enabled: !!user,
  });
}

// Hook para respostas automáticas
export function useFacebookRespostas() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["facebook-respostas", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("facebook_respostas_automaticas")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as FacebookRespostaAutomatica[];
    },
    enabled: !!user,
  });
}

// Mutation para iniciar automação
export function useIniciarAutomacao() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (linkProduto: string) => {
      if (!user) throw new Error("Usuário não autenticado");

      // Chamar edge function para iniciar automação
      const response = await supabase.functions.invoke("facebook-automation", {
        body: { 
          action: "iniciar",
          linkProduto,
          userId: user.id 
        },
      });

      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: () => {
      toast.success("Automação iniciada! IA está trabalhando...");
      queryClient.invalidateQueries({ queryKey: ["facebook-stats"] });
      queryClient.invalidateQueries({ queryKey: ["facebook-grupos"] });
      queryClient.invalidateQueries({ queryKey: ["facebook-marketplace"] });
    },
    onError: (error: Error) => {
      toast.error(`Erro ao iniciar automação: ${error.message}`);
    },
  });
}

// Mutation para adicionar grupo manualmente
export function useAddFacebookGrupo() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (grupo: { grupo_id: string; nome: string; descricao?: string; membros?: number; status?: string; permite_vendas?: boolean }) => {
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("facebook_grupos_automaticos")
        .insert({
          grupo_id: grupo.grupo_id,
          nome: grupo.nome,
          descricao: grupo.descricao,
          membros: grupo.membros || 0,
          status: grupo.status || "pendente",
          permite_vendas: grupo.permite_vendas ?? true,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Grupo adicionado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["facebook-grupos"] });
      queryClient.invalidateQueries({ queryKey: ["facebook-stats"] });
    },
    onError: (error: Error) => {
      toast.error(`Erro ao adicionar grupo: ${error.message}`);
    },
  });
}

// Mutation para adicionar produto ao Marketplace
export function useAddMarketplaceProduto() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (produto: { titulo: string; descricao: string; preco: number; categoria?: string; condicao?: string; localizacao?: string; status?: string }) => {
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("facebook_marketplace_produtos")
        .insert({
          titulo: produto.titulo,
          descricao: produto.descricao,
          preco: produto.preco,
          categoria: produto.categoria,
          condicao: produto.condicao || "Novo",
          localizacao: produto.localizacao,
          status: produto.status || "ativo",
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Produto adicionado ao Marketplace!");
      queryClient.invalidateQueries({ queryKey: ["facebook-marketplace"] });
      queryClient.invalidateQueries({ queryKey: ["facebook-stats"] });
    },
    onError: (error: Error) => {
      toast.error(`Erro ao adicionar produto: ${error.message}`);
    },
  });
}

// Mutation para agendar post em grupo
export function useAgendarPostGrupo() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: { grupo_id: string; texto: string; imagem_url?: string; link?: string; status?: string; agendado_para?: string }) => {
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("facebook_posts_grupos")
        .insert({
          grupo_id: post.grupo_id,
          texto: post.texto,
          imagem_url: post.imagem_url,
          link: post.link,
          status: post.status || "agendado",
          agendado_para: post.agendado_para,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Post agendado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["facebook-posts"] });
      queryClient.invalidateQueries({ queryKey: ["facebook-stats"] });
    },
    onError: (error: Error) => {
      toast.error(`Erro ao agendar post: ${error.message}`);
    },
  });
}

// Mutation para responder mensagem
export function useResponderMensagem() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, resposta }: { id: string; resposta: string }) => {
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("facebook_respostas_automaticas")
        .update({
          resposta_enviada: resposta,
          respondido: true,
          respondido_em: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Mensagem respondida!");
      queryClient.invalidateQueries({ queryKey: ["facebook-respostas"] });
      queryClient.invalidateQueries({ queryKey: ["facebook-stats"] });
    },
    onError: (error: Error) => {
      toast.error(`Erro ao responder mensagem: ${error.message}`);
    },
  });
}

// Mutation para deletar grupo
export function useDeleteFacebookGrupo() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("Usuário não autenticado");

      const { error } = await supabase
        .from("facebook_grupos_automaticos")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Grupo removido!");
      queryClient.invalidateQueries({ queryKey: ["facebook-grupos"] });
      queryClient.invalidateQueries({ queryKey: ["facebook-stats"] });
    },
    onError: (error: Error) => {
      toast.error(`Erro ao remover grupo: ${error.message}`);
    },
  });
}

// Mutation para deletar produto do marketplace
export function useDeleteMarketplaceProduto() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("Usuário não autenticado");

      const { error } = await supabase
        .from("facebook_marketplace_produtos")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Produto removido do Marketplace!");
      queryClient.invalidateQueries({ queryKey: ["facebook-marketplace"] });
      queryClient.invalidateQueries({ queryKey: ["facebook-stats"] });
    },
    onError: (error: Error) => {
      toast.error(`Erro ao remover produto: ${error.message}`);
    },
  });
}

// Hook para processar respostas automáticas com IA
export function useProcessAutoReplies() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Usuário não autenticado");

      const response = await supabase.functions.invoke("facebook-auto-reply", {
        body: { 
          action: "process_pending",
          userId: user.id 
        },
      });

      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.processedCount > 0) {
        toast.success(`${data.processedCount} mensagens respondidas com IA!`);
      } else {
        toast.info("Nenhuma mensagem pendente para responder");
      }
      queryClient.invalidateQueries({ queryKey: ["facebook-respostas"] });
      queryClient.invalidateQueries({ queryKey: ["facebook-stats"] });
    },
    onError: (error: Error) => {
      if (error.message?.includes("429")) {
        toast.error("Rate limit atingido. Aguarde alguns segundos.");
      } else if (error.message?.includes("402")) {
        toast.error("Créditos insuficientes. Adicione créditos ao workspace.");
      } else {
        toast.error(`Erro ao processar respostas: ${error.message}`);
      }
    },
  });
}

// Hook para gerar resposta individual com IA
export function useGenerateAIReply() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ messageId, customPrompt }: { messageId: string; customPrompt?: string }) => {
      const response = await supabase.functions.invoke("facebook-auto-reply", {
        body: { 
          action: "generate_reply",
          messageId,
          customPrompt
        },
      });

      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facebook-respostas"] });
    },
    onError: (error: Error) => {
      if (error.message?.includes("429")) {
        toast.error("Rate limit atingido. Aguarde alguns segundos.");
      } else if (error.message?.includes("402")) {
        toast.error("Créditos insuficientes. Adicione créditos ao workspace.");
      } else {
        toast.error(`Erro ao gerar resposta: ${error.message}`);
      }
    },
  });
}

// Hook para análise de conversas
export function useAnalyzeConversations() {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Usuário não autenticado");

      const response = await supabase.functions.invoke("facebook-auto-reply", {
        body: { 
          action: "analyze_conversation",
          userId: user.id 
        },
      });

      if (response.error) throw response.error;
      return response.data;
    },
    onError: (error: Error) => {
      if (error.message?.includes("429")) {
        toast.error("Rate limit atingido. Aguarde alguns segundos.");
      } else if (error.message?.includes("402")) {
        toast.error("Créditos insuficientes. Adicione créditos ao workspace.");
      } else {
        toast.error(`Erro ao analisar conversas: ${error.message}`);
      }
    },
  });
}
