import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface WhatsAppInstance {
  id: string;
  user_id: string;
  instance_name: string;
  display_name: string | null;
  status: string;
  qr_code: string | null;
  phone_number: string | null;
  webhook_url: string | null;
  is_default: boolean | null;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface SyncResult {
  imported: number;
  updated: number;
  removed: number;
  total: number;
  instances: Array<{
    name: string;
    status: string;
    phone?: string;
    action: 'imported' | 'updated' | 'unchanged' | 'removed';
  }>;
}

export function useWhatsAppInstances() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["whatsapp-instances"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("whatsapp_instances")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as WhatsAppInstance[];
    },
    enabled: !!user,
  });
}

export function useCreateInstance() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (instanceName: string) => {
      const { data, error } = await supabase.functions.invoke("whatsapp-instance", {
        body: {
          action: "create",
          instanceName,
          userId: user?.id,
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp-instances"] });
      toast({ title: "Instância criada", description: "Escaneie o QR Code para conectar" });
    },
    onError: (error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });
}

export function useGetQRCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (instanceId: string) => {
      const { data, error } = await supabase.functions.invoke("whatsapp-instance", {
        body: { action: "qrcode", instanceId },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp-instances"] });
    },
  });
}

export function useCheckInstanceStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (instanceId: string) => {
      const { data, error } = await supabase.functions.invoke("whatsapp-instance", {
        body: { action: "status", instanceId },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp-instances"] });
    },
  });
}

export function useLogoutInstance() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (instanceId: string) => {
      const { data, error } = await supabase.functions.invoke("whatsapp-instance", {
        body: { action: "logout", instanceId },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp-instances"] });
      toast({ title: "Desconectado", description: "Instância desconectada com sucesso" });
    },
    onError: (error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteInstance() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (instanceId: string) => {
      const { data, error } = await supabase.functions.invoke("whatsapp-instance", {
        body: { action: "delete", instanceId },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp-instances"] });
      toast({ title: "Excluída", description: "Instância excluída com sucesso" });
    },
    onError: (error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });
}

export function useFetchContacts() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (instanceId: string) => {
      const { data, error } = await supabase.functions.invoke("whatsapp-instance", {
        body: { action: "fetchContacts", instanceId },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp-contacts"] });
      toast({ title: "Contatos importados", description: `${data.imported} contatos importados` });
    },
    onError: (error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });
}

export function useFetchGroups() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (instanceId: string) => {
      const { data, error } = await supabase.functions.invoke("whatsapp-instance", {
        body: { action: "fetchGroups", instanceId },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp-groups"] });
      toast({ title: "Grupos importados", description: `${data.groups} grupos encontrados` });
    },
    onError: (error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });
}

export function useExtractParticipants() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ instanceId, groupJid }: { instanceId: string; groupJid: string }) => {
      const { data, error } = await supabase.functions.invoke("whatsapp-instance", {
        body: { action: "extractParticipants", instanceId, groupJid },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp-contacts"] });
      toast({
        title: "Participantes extraídos",
        description: `${data.imported} de ${data.total} contatos importados`,
      });
    },
    onError: (error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });
}

export function useInstanceStats() {
  return useMutation({
    mutationFn: async (instanceId: string) => {
      const { data, error } = await supabase.functions.invoke("whatsapp-instance", {
        body: { action: "stats", instanceId },
      });

      if (error) throw error;
      return data as { contacts: number; groups: number; chats: number };
    },
  });
}

// New hook for bidirectional sync with Evolution API
export function useSyncWithEvolution() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("whatsapp-instance", {
        body: { action: "sync", userId: user?.id },
      });

      if (error) throw error;
      return data as SyncResult;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp-instances"] });
      
      const messages = [];
      if (data.imported > 0) messages.push(`${data.imported} importadas`);
      if (data.updated > 0) messages.push(`${data.updated} atualizadas`);
      if (data.removed > 0) messages.push(`${data.removed} removidas`);
      
      toast({ 
        title: "Sincronização concluída", 
        description: messages.length > 0 
          ? messages.join(", ") 
          : "Todas as instâncias já estão sincronizadas"
      });
    },
    onError: (error) => {
      toast({ title: "Erro na sincronização", description: error.message, variant: "destructive" });
    },
  });
}
