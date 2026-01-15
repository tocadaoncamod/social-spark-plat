import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface ChatbotConfig {
  id: string;
  user_id: string;
  instance_id: string | null;
  is_active: boolean;
  system_prompt: string;
  welcome_message: string | null;
  fallback_message: string;
  working_hours_start: string | null;
  working_hours_end: string | null;
  working_days: number[];
  excluded_contacts: string[] | null;
  auto_classify_leads: boolean;
  created_at: string;
  updated_at: string;
}

export function useChatbotConfig(instanceId?: string | null) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["whatsapp-chatbot-config", instanceId],
    queryFn: async () => {
      let query = supabase.from("whatsapp_chatbot_config").select("*");

      if (instanceId) {
        query = query.eq("instance_id", instanceId);
      }

      const { data, error } = await query.maybeSingle();

      if (error) throw error;
      return data as ChatbotConfig | null;
    },
    enabled: !!user,
  });
}

export function useUpsertChatbotConfig() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (config: Partial<ChatbotConfig>) => {
      // Check if config exists
      const { data: existing } = await supabase
        .from("whatsapp_chatbot_config")
        .select("id")
        .eq("user_id", user?.id)
        .eq("instance_id", config.instance_id || null)
        .maybeSingle();

      if (existing) {
        const { data, error } = await supabase
          .from("whatsapp_chatbot_config")
          .update(config)
          .eq("id", existing.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from("whatsapp_chatbot_config")
          .insert({
            ...config,
            user_id: user?.id,
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp-chatbot-config"] });
      toast({ title: "Configuração salva", description: "Chatbot configurado com sucesso" });
    },
    onError: (error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });
}

export function useToggleChatbot() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { data, error } = await supabase
        .from("whatsapp_chatbot_config")
        .update({ is_active: isActive })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp-chatbot-config"] });
      toast({
        title: data.is_active ? "Chatbot ativado" : "Chatbot desativado",
        description: data.is_active
          ? "O chatbot está respondendo automaticamente"
          : "O chatbot está pausado",
      });
    },
    onError: (error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });
}
