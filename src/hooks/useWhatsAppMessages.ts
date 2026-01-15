import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface WhatsAppMessage {
  id: string;
  user_id: string;
  instance_id: string | null;
  contact_id: string | null;
  remote_jid: string | null;
  content: string | null;
  media_url: string | null;
  media_type: string | null;
  direction: string;
  status: string;
  error_message: string | null;
  sent_at: string;
  delivered_at: string | null;
  read_at: string | null;
  created_at: string;
  contact?: {
    name: string | null;
    phone: string;
  };
}

export function useWhatsAppMessages(contactId?: string | null, limit = 50) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["whatsapp-messages", contactId, limit],
    queryFn: async () => {
      let query = supabase
        .from("whatsapp_messages")
        .select(`
          *,
          contact:whatsapp_contacts(name, phone)
        `)
        .order("sent_at", { ascending: false })
        .limit(limit);

      if (contactId) {
        query = query.eq("contact_id", contactId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as WhatsAppMessage[];
    },
    enabled: !!user,
  });
}

export function useWhatsAppMessageStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["whatsapp-message-stats"],
    queryFn: async () => {
      // Get today's date range
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();

      // Total sent today
      const { count: sentToday } = await supabase
        .from("whatsapp_messages")
        .select("*", { count: "exact", head: true })
        .eq("direction", "outbound")
        .gte("sent_at", todayISO);

      // Total received today
      const { count: receivedToday } = await supabase
        .from("whatsapp_messages")
        .select("*", { count: "exact", head: true })
        .eq("direction", "inbound")
        .gte("sent_at", todayISO);

      // Delivered rate (last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const { data: weekMessages } = await supabase
        .from("whatsapp_messages")
        .select("status")
        .eq("direction", "outbound")
        .gte("sent_at", weekAgo.toISOString());

      const totalSent = weekMessages?.length || 0;
      const delivered = weekMessages?.filter((m) => m.status === "delivered" || m.status === "read").length || 0;
      const deliveryRate = totalSent > 0 ? Math.round((delivered / totalSent) * 100) : 0;

      // Read rate
      const readCount = weekMessages?.filter((m) => m.status === "read").length || 0;
      const readRate = totalSent > 0 ? Math.round((readCount / totalSent) * 100) : 0;

      return {
        sentToday: sentToday || 0,
        receivedToday: receivedToday || 0,
        deliveryRate,
        readRate,
        totalWeek: totalSent,
      };
    },
    enabled: !!user,
  });
}

export function useSendWhatsAppMessage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      instanceId,
      phone,
      message,
      mediaUrl,
      mediaType,
    }: {
      instanceId: string;
      phone: string;
      message: string;
      mediaUrl?: string;
      mediaType?: string;
    }) => {
      const { data, error } = await supabase.functions.invoke("whatsapp-sender", {
        body: {
          action: "single",
          instanceId,
          phone,
          message,
          mediaUrl,
          mediaType,
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp-messages"] });
      queryClient.invalidateQueries({ queryKey: ["whatsapp-message-stats"] });
      toast({ title: "Mensagem enviada" });
    },
    onError: (error) => {
      toast({ title: "Erro ao enviar", description: error.message, variant: "destructive" });
    },
  });
}
