import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface FacebookTokenConfig {
  id: string;
  user_id: string;
  page_id?: string;
  page_name?: string;
  access_token_expires_at?: string;
  last_validated_at?: string;
  token_status: 'valid' | 'expiring_soon' | 'expired' | 'unknown';
  permissions_granted?: string[];
  created_at: string;
  updated_at: string;
}

export interface TokenValidationResult {
  success: boolean;
  connection?: string;
  tokenType?: string;
  user?: { id: string; name: string };
  pages?: Array<{ id: string; name: string; category?: string }>;
  message?: string;
  error?: string;
}

// Calculate days until token expires
export function getDaysUntilExpiry(expiresAt?: string): number | null {
  if (!expiresAt) return null;
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diffTime = expiry.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Get token status based on days until expiry
export function getTokenStatusFromDays(days: number | null): 'valid' | 'expiring_soon' | 'expired' | 'unknown' {
  if (days === null) return 'unknown';
  if (days <= 0) return 'expired';
  if (days <= 30) return 'expiring_soon';
  return 'valid';
}

// Hook para buscar configuração do token
export function useFacebookTokenConfig() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["facebook-token-config", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("facebook_token_config")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data as FacebookTokenConfig | null;
    },
    enabled: !!user,
  });
}

// Hook para testar conexão com Facebook
export function useTestFacebookConnection() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<TokenValidationResult> => {
      const response = await supabase.functions.invoke("facebook-automation", {
        body: { action: "test_connection" },
      });

      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: async (data) => {
      if (!user) return;
      
      if (data.success) {
        // Update or create token config
        const tokenConfig = {
          user_id: user.id,
          page_id: data.pages?.[0]?.id || null,
          page_name: data.pages?.[0]?.name || data.user?.name || null,
          last_validated_at: new Date().toISOString(),
          token_status: 'valid' as const,
          // Token expira em Janeiro 2026 conforme informado
          access_token_expires_at: '2026-01-15T00:00:00Z',
        };

        const { error } = await supabase
          .from("facebook_token_config")
          .upsert(tokenConfig, { onConflict: 'user_id' });

        if (error) {
          console.error("Erro ao salvar config do token:", error);
        }

        queryClient.invalidateQueries({ queryKey: ["facebook-token-config"] });
        toast.success(`Conexão válida: ${data.message}`);
      } else {
        toast.error(`Erro na conexão: ${data.error}`);
      }
    },
    onError: (error: Error) => {
      toast.error(`Erro ao testar conexão: ${error.message}`);
    },
  });
}

// Hook para atualizar expiração do token
export function useUpdateTokenExpiry() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (expiresAt: string) => {
      if (!user) throw new Error("Usuário não autenticado");

      const daysUntil = getDaysUntilExpiry(expiresAt);
      const status = getTokenStatusFromDays(daysUntil);

      const { error } = await supabase
        .from("facebook_token_config")
        .upsert({
          user_id: user.id,
          access_token_expires_at: expiresAt,
          token_status: status,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facebook-token-config"] });
      toast.success("Data de expiração atualizada!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar: ${error.message}`);
    },
  });
}
