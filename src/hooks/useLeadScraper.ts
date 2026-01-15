import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export interface AutoMessageConfig {
  messages: {
    atacadista: string;
    varejista: string;
    comprador: string;
  };
  mediaUrl?: string;
  mediaType?: string;
  delayMin: number;
  delayMax: number;
  sendToAll: boolean;
  selectedTypes: string[];
  // Scheduling
  isScheduled?: boolean;
  scheduledFor?: string;
  scheduledTime?: string;
}
export interface LeadScraperCampaign {
  id: string;
  user_id: string;
  instance_id: string | null;
  name: string;
  keywords: string[];
  sources: string[];
  location: string | null;
  radius_km: number;
  status: string;
  total_leads: number;
  unique_leads: number;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  metadata: Record<string, any> | null;
}

export interface LeadScraperLead {
  id: string;
  user_id: string;
  campaign_id: string;
  phone_number: string;
  name: string | null;
  business_name: string | null;
  bio: string | null;
  profile_picture_url: string | null;
  source: string;
  source_url: string | null;
  source_metadata: Record<string, any> | null;
  relevance_score: number;
  keywords_matched: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCampaignInput {
  name: string;
  keywords: string[];
  sources: string[];
  instance_id?: string | null;
  location?: string;
  radius_km?: number;
  categories?: string[];
  useAI?: boolean;
}

export function useLeadScraperCampaigns() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["lead-scraper-campaigns"],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("lead_scraper_campaigns")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as LeadScraperCampaign[];
    },
    enabled: !!user,
  });
}

export function useLeadScraperLeads(campaignId: string | null) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["lead-scraper-leads", campaignId],
    queryFn: async () => {
      if (!user || !campaignId) throw new Error("User not authenticated or campaign not selected");

      const { data, error } = await supabase
        .from("lead_scraper_leads")
        .select("*")
        .eq("campaign_id", campaignId)
        .order("relevance_score", { ascending: false });

      if (error) throw error;
      return data as LeadScraperLead[];
    },
    enabled: !!user && !!campaignId,
  });
}

export function useCreateCampaign() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateCampaignInput) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("lead_scraper_campaigns")
        .insert({
          user_id: user.id,
          name: input.name,
          keywords: input.keywords,
          sources: input.sources,
          instance_id: input.instance_id || null,
          location: input.location || null,
          radius_km: input.radius_km || 50,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;
      return data as LeadScraperCampaign;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead-scraper-campaigns"] });
      toast({
        title: "Campanha criada",
        description: "A campanha foi criada com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar campanha",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<LeadScraperCampaign> & { id: string }) => {
      const { data, error } = await supabase
        .from("lead_scraper_campaigns")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as LeadScraperCampaign;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead-scraper-campaigns"] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar campanha",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("lead_scraper_campaigns")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead-scraper-campaigns"] });
      toast({
        title: "Campanha excluída",
        description: "A campanha foi excluída com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir campanha",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useInsertLeads() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ campaignId, leads }: { 
      campaignId: string; 
      leads: Omit<LeadScraperLead, 'id' | 'user_id' | 'campaign_id' | 'created_at' | 'updated_at'>[] 
    }) => {
      if (!user) throw new Error("User not authenticated");

      const leadsToInsert = leads.map(lead => ({
        ...lead,
        user_id: user.id,
        campaign_id: campaignId,
      }));

      const { data, error } = await supabase
        .from("lead_scraper_leads")
        .upsert(leadsToInsert, { 
          onConflict: 'campaign_id,phone_number',
          ignoreDuplicates: true 
        })
        .select();

      if (error) throw error;
      return data as LeadScraperLead[];
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["lead-scraper-leads", variables.campaignId] });
      queryClient.invalidateQueries({ queryKey: ["lead-scraper-campaigns"] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao inserir leads",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useExportLeads(campaignId: string | null) {
  const { data: leads } = useLeadScraperLeads(campaignId);

  const exportToCSV = () => {
    if (!leads || leads.length === 0) {
      toast({
        title: "Nenhum lead para exportar",
        description: "Não há leads nesta campanha.",
        variant: "destructive",
      });
      return;
    }

    const headers = ['Telefone', 'Nome', 'Empresa', 'Tipo', 'Categorias', 'Score', 'Keywords', 'Status'];
    const rows = leads.map(lead => {
      const metadata = lead.source_metadata as any;
      return [
        lead.phone_number,
        lead.name || '',
        lead.business_name || '',
        metadata?.business_type || '',
        (metadata?.categories || []).join('; '),
        lead.relevance_score.toString(),
        (lead.keywords_matched || []).join('; '),
        lead.status
      ];
    });

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `leads_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast({
      title: "Exportação concluída",
      description: `${leads.length} leads exportados para CSV.`,
    });
  };

  return { exportToCSV, leadsCount: leads?.length || 0 };
}

// Hook para executar a extração de status
export function useRunStatusScraper() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const insertLeads = useInsertLeads();

  return useMutation({
    mutationFn: async ({ 
      campaignId, 
      instanceId, 
      keywords, 
      categories,
      useAI 
    }: { 
      campaignId: string;
      instanceId: string;
      keywords: string[];
      categories?: string[];
      useAI?: boolean;
    }) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase.functions.invoke("status-scraper", {
        body: {
          instanceId,
          keywords,
          categories: categories || [],
          useAI: useAI ?? true,
        },
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error || "Extraction failed");

      // Insert leads into database
      if (data.leads && data.leads.length > 0) {
        await insertLeads.mutateAsync({
          campaignId,
          leads: data.leads,
        });

        // Update campaign stats
        await supabase
          .from("lead_scraper_campaigns")
          .update({
            total_leads: data.stats.matchingKeywords,
            unique_leads: data.leads.length,
            status: "completed",
            completed_at: new Date().toISOString(),
          })
          .eq("id", campaignId);
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lead-scraper-campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["lead-scraper-leads"] });
      toast({
        title: "Extração concluída!",
        description: `${data.leads?.length || 0} leads extraídos de ${data.stats?.totalStatuses || 0} status.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Erro na extração",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Hook para enviar mensagens automáticas baseadas no tipo de lead
export function useSendAutoMessages() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      leads, 
      config,
      instanceId 
    }: { 
      leads: LeadScraperLead[];
      config: AutoMessageConfig;
      instanceId: string;
    }) => {
      if (!user) throw new Error("User not authenticated");

      // Map business types to config keys
      const typeMapping: Record<string, string> = {
        "Atacadista/Fornecedor": "atacadista",
        "Varejista": "varejista",
        "Comprador Potencial": "comprador",
        "indefinido": "comprador",
      };

      // Filter leads by selected types
      const filteredLeads = leads.filter(lead => {
        const metadata = lead.source_metadata as any;
        const businessType = metadata?.business_type || "indefinido";
        const typeKey = typeMapping[businessType] || "comprador";
        return config.selectedTypes.includes(typeKey);
      });

      if (filteredLeads.length === 0) {
        throw new Error("Nenhum lead selecionado para envio");
      }

      // Prepare contacts with personalized messages
      const contacts = filteredLeads.map(lead => {
        const metadata = lead.source_metadata as any;
        const businessType = metadata?.business_type || "indefinido";
        const typeKey = typeMapping[businessType] || "comprador";
        const messageTemplate = config.messages[typeKey as keyof typeof config.messages];
        
        // Personalize message with lead name
        const personalizedMessage = messageTemplate.replace(
          /{nome}/g, 
          lead.name || "amigo(a)"
        );

        return {
          phone: lead.phone_number,
          name: lead.name || "",
          message: personalizedMessage,
        };
      });

      // Create campaign in database
      const { data: campaign, error: campaignError } = await supabase
        .from("whatsapp_campaigns")
        .insert({
          user_id: user.id,
          instance_id: instanceId,
          name: `Auto-envio Leads ${new Date().toLocaleDateString("pt-BR")}`,
          message_template: "Mensagem personalizada por tipo de lead",
          status: "pending",
          total_contacts: contacts.length,
          delay_min_seconds: config.delayMin,
          delay_max_seconds: config.delayMax,
          media_url: config.mediaUrl || null,
          media_type: config.mediaType || null,
        })
        .select()
        .single();

      if (campaignError) throw campaignError;

      // Insert campaign contacts
      const campaignContacts = contacts.map(c => ({
        campaign_id: campaign.id,
        phone: c.phone,
        name: c.name,
        status: "pending",
        variables: { message: c.message } as any,
      }));

      const { error: contactsError } = await supabase
        .from("whatsapp_campaign_contacts")
        .insert(campaignContacts);

      if (contactsError) throw contactsError;

      // Call the sender function
      const { data, error } = await supabase.functions.invoke("whatsapp-sender", {
        body: {
          action: "bulk",
          campaignId: campaign.id,
          instanceId,
          contacts: contacts.map(c => ({
            phone: c.phone,
            name: c.name,
            variables: {},
          })),
          messageTemplate: "{message}",
          useCustomMessage: true,
          customMessages: contacts.reduce((acc, c) => {
            acc[c.phone] = c.message;
            return acc;
          }, {} as Record<string, string>),
          mediaUrl: config.mediaUrl,
          mediaType: config.mediaType,
          delayMin: config.delayMin,
          delayMax: config.delayMax,
        },
      });

      if (error) throw error;

      // Update lead status to contacted
      const leadIds = filteredLeads.map(l => l.id);
      await supabase
        .from("lead_scraper_leads")
        .update({ status: "contacted" })
        .in("id", leadIds);

      return { campaign, sentCount: contacts.length };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lead-scraper-leads"] });
      queryClient.invalidateQueries({ queryKey: ["whatsapp-campaigns"] });
      toast({
        title: "Envio iniciado!",
        description: `${data.sentCount} mensagens personalizadas sendo enviadas.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao enviar mensagens",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Hook para agendar envio automático
export function useScheduleAutoMessages() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      leads, 
      config,
      instanceId,
      campaignId 
    }: { 
      leads: LeadScraperLead[];
      config: AutoMessageConfig;
      instanceId: string;
      campaignId?: string;
    }) => {
      if (!user) throw new Error("User not authenticated");

      if (!config.scheduledFor || !config.scheduledTime) {
        throw new Error("Data e horário são obrigatórios para agendamento");
      }

      // Map business types to config keys
      const typeMapping: Record<string, string> = {
        "Atacadista/Fornecedor": "atacadista",
        "Varejista": "varejista",
        "Comprador Potencial": "comprador",
        "indefinido": "comprador",
      };

      // Filter leads by selected types
      const filteredLeads = leads.filter(lead => {
        const metadata = lead.source_metadata as any;
        const businessType = metadata?.business_type || "indefinido";
        const typeKey = typeMapping[businessType] || "comprador";
        return config.selectedTypes.includes(typeKey);
      });

      if (filteredLeads.length === 0) {
        throw new Error("Nenhum lead selecionado para agendamento");
      }

      // Create scheduled datetime
      const scheduledFor = new Date(`${config.scheduledFor}T${config.scheduledTime}:00`);

      // Insert scheduled auto message
      const { data, error } = await supabase
        .from("scheduled_auto_messages")
        .insert({
          user_id: user.id,
          campaign_id: campaignId || null,
          instance_id: instanceId,
          name: `Agendamento ${scheduledFor.toLocaleDateString("pt-BR")} às ${config.scheduledTime}`,
          scheduled_for: scheduledFor.toISOString(),
          status: "pending",
          lead_types: config.selectedTypes,
          messages: config.messages,
          media_url: config.mediaUrl || null,
          media_type: config.mediaType || null,
          delay_min: config.delayMin,
          delay_max: config.delayMax,
          total_leads: filteredLeads.length,
        })
        .select()
        .single();

      if (error) throw error;
      return { scheduled: data, totalLeads: filteredLeads.length };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["scheduled-auto-messages"] });
      toast({
        title: "Agendamento criado!",
        description: `${data.totalLeads} mensagens serão enviadas no horário programado.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao agendar mensagens",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Hook para listar agendamentos
export function useScheduledAutoMessages() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["scheduled-auto-messages"],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("scheduled_auto_messages")
        .select("*")
        .order("scheduled_for", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

// Hook para cancelar agendamento
export function useCancelScheduledMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("scheduled_auto_messages")
        .update({ status: "cancelled" })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduled-auto-messages"] });
      toast({
        title: "Agendamento cancelado",
        description: "O envio programado foi cancelado.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao cancelar",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Hook para deletar agendamento
export function useDeleteScheduledMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("scheduled_auto_messages")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduled-auto-messages"] });
      toast({
        title: "Agendamento excluído",
        description: "O agendamento foi removido.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
