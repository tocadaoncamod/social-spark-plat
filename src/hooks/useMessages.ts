import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type Message = Tables<"messages">;
export type MessageInsert = TablesInsert<"messages">;

export function useMessages(platform?: string, chatId?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["messages", platform, chatId],
    queryFn: async () => {
      let query = supabase.from("messages").select("*").order("sent_at", { ascending: true });
      
      if (platform) {
        query = query.eq("platform", platform);
      }
      if (chatId) {
        query = query.eq("chat_id", chatId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (message: Omit<MessageInsert, "user_id" | "direction">) => {
      if (!user) throw new Error("Must be logged in");
      
      const { data, error } = await supabase
        .from("messages")
        .insert({ ...message, user_id: user.id, direction: "outbound" })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast.success("Message sent");
    },
    onError: (error) => {
      toast.error("Failed to send message: " + error.message);
    },
  });
}

export function useDeleteMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("messages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
    onError: (error) => {
      toast.error("Failed to delete message: " + error.message);
    },
  });
}
