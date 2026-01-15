import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface WhatsAppCampaign {
  id: string;
  user_id: string;
  instance_id: string | null;
  name: string;
  message_template: string;
  media_url: string | null;
  media_type: string | null;
  status: string;
  total_contacts: number;
  sent_count: number;
  delivered_count: number;
  failed_count: number;
  delay_min_seconds: number;
  delay_max_seconds: number;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CampaignContact {
  id: string;
  campaign_id: string;
  contact_id: string | null;
  phone: string;
  name: string | null;
  variables: Record<string, string>;
  status: string;
  error_message: string | null;
  sent_at: string | null;
  created_at: string;
}

export function useWhatsAppCampaigns() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["whatsapp-campaigns"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("whatsapp_campaigns")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as WhatsAppCampaign[];
    },
    enabled: !!user,
  });
}

export function useCampaignContacts(campaignId: string | null) {
  return useQuery({
    queryKey: ["whatsapp-campaign-contacts", campaignId],
    queryFn: async () => {
      if (!campaignId) return [];

      const { data, error } = await supabase
        .from("whatsapp_campaign_contacts")
        .select("*")
        .eq("campaign_id", campaignId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as CampaignContact[];
    },
    enabled: !!campaignId,
  });
}

export function useCreateCampaign() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (campaign: Partial<WhatsAppCampaign>) => {
      const { data, error } = await supabase
        .from("whatsapp_campaigns")
        .insert({
          name: campaign.name || "Nova Campanha",
          message_template: campaign.message_template || "",
          instance_id: campaign.instance_id,
          media_url: campaign.media_url,
          media_type: campaign.media_type,
          delay_min_seconds: campaign.delay_min_seconds,
          delay_max_seconds: campaign.delay_max_seconds,
          user_id: user?.id!,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp-campaigns"] });
      toast({ title: "Campanha criada", description: "Campanha criada com sucesso" });
    },
    onError: (error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<WhatsAppCampaign> & { id: string }) => {
      const { data, error } = await supabase
        .from("whatsapp_campaigns")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp-campaigns"] });
    },
    onError: (error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("whatsapp_campaigns").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp-campaigns"] });
      toast({ title: "Excluída", description: "Campanha excluída com sucesso" });
    },
    onError: (error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });
}

export function useAddCampaignContacts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      campaignId,
      contacts,
    }: {
      campaignId: string;
      contacts: Array<{ phone: string; name?: string; variables?: Record<string, string> }>;
    }) => {
      const contactsToInsert = contacts.map((c) => ({
        campaign_id: campaignId,
        phone: c.phone,
        name: c.name || null,
        variables: c.variables || {},
      }));

      const { error } = await supabase.from("whatsapp_campaign_contacts").insert(contactsToInsert);

      if (error) throw error;

      // Update total contacts count
      await supabase
        .from("whatsapp_campaigns")
        .update({ total_contacts: contacts.length })
        .eq("id", campaignId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp-campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["whatsapp-campaign-contacts"] });
    },
  });
}

export function useStartCampaign() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (campaignId: string) => {
      // Get campaign details
      const { data: campaign, error: campaignError } = await supabase
        .from("whatsapp_campaigns")
        .select("*")
        .eq("id", campaignId)
        .single();

      if (campaignError) throw campaignError;

      // Get contacts
      const { data: contacts, error: contactsError } = await supabase
        .from("whatsapp_campaign_contacts")
        .select("*")
        .eq("campaign_id", campaignId)
        .eq("status", "pending");

      if (contactsError) throw contactsError;

      if (!contacts || contacts.length === 0) {
        throw new Error("Nenhum contato pendente na campanha");
      }

      // Call sender edge function
      const { data, error } = await supabase.functions.invoke("whatsapp-sender", {
        body: {
          action: "bulk",
          campaignId,
          instanceId: campaign.instance_id,
          contacts: contacts.map((c) => ({
            phone: c.phone,
            name: c.name,
            variables: c.variables,
          })),
          message: campaign.message_template,
          mediaUrl: campaign.media_url,
          mediaType: campaign.media_type,
          delayMin: campaign.delay_min_seconds,
          delayMax: campaign.delay_max_seconds,
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp-campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["whatsapp-campaign-contacts"] });
      toast({
        title: "Campanha concluída",
        description: `Enviadas: ${data.sent}, Falhas: ${data.failed}`,
      });
    },
    onError: (error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });
}
