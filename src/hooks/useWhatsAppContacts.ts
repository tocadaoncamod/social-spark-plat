import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type WhatsAppContact = Tables<"whatsapp_contacts">;
export type WhatsAppContactInsert = TablesInsert<"whatsapp_contacts">;
export type WhatsAppContactUpdate = TablesUpdate<"whatsapp_contacts">;

export function useWhatsAppContacts() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["whatsapp_contacts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("whatsapp_contacts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useCreateWhatsAppContact() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (contact: Omit<WhatsAppContactInsert, "user_id">) => {
      if (!user) throw new Error("Must be logged in");
      
      const { data, error } = await supabase
        .from("whatsapp_contacts")
        .insert({ ...contact, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp_contacts"] });
      toast.success("Contact added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add contact: " + error.message);
    },
  });
}

export function useUpdateWhatsAppContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: WhatsAppContactUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("whatsapp_contacts")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp_contacts"] });
      toast.success("Contact updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update contact: " + error.message);
    },
  });
}

export function useDeleteWhatsAppContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("whatsapp_contacts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp_contacts"] });
      toast.success("Contact deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete contact: " + error.message);
    },
  });
}
