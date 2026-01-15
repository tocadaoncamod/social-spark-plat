import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface WhatsAppScheduled {
  id: string;
  user_id: string;
  instance_id: string | null;
  contact_id: string | null;
  phone: string;
  message: string;
  media_url: string | null;
  media_type: string | null;
  scheduled_for: string;
  status: string;
  error_message: string | null;
  sent_at: string | null;
  created_at: string;
  contact?: {
    name: string | null;
    phone: string;
  };
}

export function useWhatsAppScheduled(status?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["whatsapp-scheduled", status],
    queryFn: async () => {
      let query = supabase
        .from("whatsapp_scheduled")
        .select(`
          *,
          contact:whatsapp_contacts(name, phone)
        `)
        .order("scheduled_for", { ascending: true });

      if (status && status !== "all") {
        query = query.eq("status", status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as WhatsAppScheduled[];
    },
    enabled: !!user,
  });
}

export function useCreateScheduled() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (scheduled: Omit<WhatsAppScheduled, "id" | "user_id" | "status" | "error_message" | "sent_at" | "created_at">) => {
      const { data, error } = await supabase
        .from("whatsapp_scheduled")
        .insert({
          ...scheduled,
          user_id: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp-scheduled"] });
      toast({ title: "Agendada", description: "Mensagem agendada com sucesso" });
    },
    onError: (error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });
}

export function useCancelScheduled() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("whatsapp_scheduled")
        .update({ status: "cancelled" })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp-scheduled"] });
      toast({ title: "Cancelada", description: "Mensagem cancelada" });
    },
    onError: (error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteScheduled() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("whatsapp_scheduled").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp-scheduled"] });
      toast({ title: "Excluída" });
    },
    onError: (error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });
}
