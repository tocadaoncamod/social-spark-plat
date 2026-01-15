import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface WhatsAppLead {
  id: string;
  user_id: string;
  contact_id: string;
  score: number;
  classification: string;
  keywords_matched: string[] | null;
  last_interaction: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  contact?: {
    id: string;
    name: string | null;
    phone: string;
    tags: string[] | null;
  };
}

export interface LeadRule {
  id: string;
  user_id: string;
  name: string;
  keywords: string[];
  classification: string;
  score_change: number;
  is_active: boolean;
  created_at: string;
}

export function useWhatsAppLeads(classification?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["whatsapp-leads", classification],
    queryFn: async () => {
      let query = supabase
        .from("whatsapp_leads")
        .select(`
          *,
          contact:whatsapp_contacts(id, name, phone, tags)
        `)
        .order("score", { ascending: false });

      if (classification && classification !== "all") {
        query = query.eq("classification", classification);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as WhatsAppLead[];
    },
    enabled: !!user,
  });
}

export function useLeadRules() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["whatsapp-lead-rules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("whatsapp_lead_rules")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as LeadRule[];
    },
    enabled: !!user,
  });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<WhatsAppLead> & { id: string }) => {
      const { data, error } = await supabase
        .from("whatsapp_leads")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp-leads"] });
      toast({ title: "Lead atualizado" });
    },
    onError: (error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });
}

export function useCreateLeadRule() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (rule: Omit<LeadRule, "id" | "user_id" | "created_at">) => {
      const { data, error } = await supabase
        .from("whatsapp_lead_rules")
        .insert({
          ...rule,
          user_id: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp-lead-rules"] });
      toast({ title: "Regra criada", description: "Regra de classificação criada com sucesso" });
    },
    onError: (error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateLeadRule() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<LeadRule> & { id: string }) => {
      const { data, error } = await supabase
        .from("whatsapp_lead_rules")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp-lead-rules"] });
      toast({ title: "Regra atualizada" });
    },
    onError: (error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteLeadRule() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("whatsapp_lead_rules").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp-lead-rules"] });
      toast({ title: "Regra excluída" });
    },
    onError: (error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });
}
