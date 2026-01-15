import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Agente {
  id: string;
  user_id: string;
  nome: string;
  plataforma: string;
  prompt_base: string;
  conhecimentos: Record<string, any> | null;
  ia_primaria: string | null;
  ia_secundaria: string | null;
  ativo: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export function useAgentes() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: agentes, isLoading, error } = useQuery({
    queryKey: ["agentes", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("agentes_especializados")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Agente[];
    },
    enabled: !!user?.id,
  });

  const updateAgente = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Agente> }) => {
      const { data, error } = await supabase
        .from("agentes_especializados")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .eq("user_id", user?.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agentes", user?.id] });
      toast.success("Agente atualizado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar agente: " + error.message);
    },
  });

  const deleteAgente = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("agentes_especializados")
        .delete()
        .eq("id", id)
        .eq("user_id", user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agentes", user?.id] });
      toast.success("Agente removido com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao remover agente: " + error.message);
    },
  });

  const toggleAgente = useMutation({
    mutationFn: async ({ id, ativo }: { id: string; ativo: boolean }) => {
      const { data, error } = await supabase
        .from("agentes_especializados")
        .update({ ativo, updated_at: new Date().toISOString() })
        .eq("id", id)
        .eq("user_id", user?.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["agentes", user?.id] });
      toast.success(`Agente ${data.ativo ? 'ativado' : 'desativado'}!`);
    },
    onError: (error) => {
      toast.error("Erro ao alterar status: " + error.message);
    },
  });

  return {
    agentes: agentes || [],
    isLoading,
    error,
    updateAgente,
    deleteAgente,
    toggleAgente,
  };
}
