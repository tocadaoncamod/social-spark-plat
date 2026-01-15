import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Hook for TikTok Shop API integration
export function useTikTokShopAPI() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Call TikTok Shop API via edge function
  const callAPI = async (action: string, appId: string, params: Record<string, any> = {}) => {
    const { data, error } = await supabase.functions.invoke("tiktok-shop-api", {
      body: { action, appId, ...params },
    });

    if (error) throw error;
    return data;
  };

  // Get connected TikTok app
  const useConnectedApp = () => {
    return useQuery({
      queryKey: ["tiktok-connected-app", user?.id],
      queryFn: async () => {
        if (!user) return null;
        const { data, error } = await supabase
          .from("tiktok_apps")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "connected")
          .single();

        if (error && error.code !== "PGRST116") throw error;
        return data;
      },
      enabled: !!user,
    });
  };

  // Test connection
  const useTestConnection = () => {
    return useMutation({
      mutationFn: async (appId: string) => {
        return callAPI("test_connection", appId);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["tiktok-apps"] });
        toast.success("Conexão validada com sucesso!");
      },
      onError: (error: Error) => {
        toast.error(`Erro na conexão: ${error.message}`);
      },
    });
  };

  // Get products from TikTok Shop
  const useProducts = (appId: string, page = 1, limit = 20) => {
    return useQuery({
      queryKey: ["tiktok-shop-products", appId, page, limit],
      queryFn: async () => {
        return callAPI("get_products", appId, { page, limit });
      },
      enabled: !!appId,
    });
  };

  // Get orders from TikTok Shop
  const useOrders = (appId: string, status?: string, limit = 20) => {
    return useQuery({
      queryKey: ["tiktok-shop-orders", appId, status, limit],
      queryFn: async () => {
        return callAPI("get_orders", appId, { status, limit });
      },
      enabled: !!appId,
    });
  };

  // Get shop info
  const useShopInfo = (appId: string) => {
    return useQuery({
      queryKey: ["tiktok-shop-info", appId],
      queryFn: async () => {
        return callAPI("get_shop_info", appId);
      },
      enabled: !!appId,
    });
  };

  // Get categories
  const useCategories = (appId: string) => {
    return useQuery({
      queryKey: ["tiktok-shop-categories", appId],
      queryFn: async () => {
        return callAPI("get_categories", appId);
      },
      enabled: !!appId,
    });
  };

  // Get financial overview
  const useFinanceOverview = (appId: string) => {
    return useQuery({
      queryKey: ["tiktok-shop-finance", appId],
      queryFn: async () => {
        return callAPI("get_finance_overview", appId);
      },
      enabled: !!appId,
    });
  };

  // Get affiliates/creators
  const useAffiliates = (appId: string, limit = 20) => {
    return useQuery({
      queryKey: ["tiktok-shop-affiliates", appId, limit],
      queryFn: async () => {
        return callAPI("get_affiliates", appId, { limit });
      },
      enabled: !!appId,
    });
  };

  // Get videos
  const useVideos = (appId: string, limit = 20) => {
    return useQuery({
      queryKey: ["tiktok-shop-videos", appId, limit],
      queryFn: async () => {
        return callAPI("get_videos", appId, { limit });
      },
      enabled: !!appId,
    });
  };

  // Sync products mutation
  const useSyncProducts = () => {
    return useMutation({
      mutationFn: async (appId: string) => {
        return callAPI("sync_products", appId);
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["tiktok-products"] });
        toast.success(`${data.synced} produtos sincronizados!`);
      },
      onError: (error: Error) => {
        toast.error(`Erro na sincronização: ${error.message}`);
      },
    });
  };

  // Sync orders mutation
  const useSyncOrders = () => {
    return useMutation({
      mutationFn: async (appId: string) => {
        return callAPI("sync_orders", appId);
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["tiktok-sales"] });
        toast.success(`${data.synced} pedidos sincronizados!`);
      },
      onError: (error: Error) => {
        toast.error(`Erro na sincronização: ${error.message}`);
      },
    });
  };

  return {
    useConnectedApp,
    useTestConnection,
    useProducts,
    useOrders,
    useShopInfo,
    useCategories,
    useFinanceOverview,
    useAffiliates,
    useVideos,
    useSyncProducts,
    useSyncOrders,
  };
}

// Hook for app connection management
export function useTikTokAppConnection() {
  const queryClient = useQueryClient();

  const testConnection = useMutation({
    mutationFn: async (appId: string) => {
      const { data, error } = await supabase.functions.invoke("tiktok-shop-api", {
        body: { action: "test_connection", appId },
      });
      if (error) throw error;
      
      // Update app status to connected
      await supabase
        .from("tiktok_apps")
        .update({ status: "connected" })
        .eq("id", appId);
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tiktok-apps"] });
    },
  });

  const refreshToken = useMutation({
    mutationFn: async (appId: string) => {
      // Token refresh logic would be implemented here
      // For now, just return success
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tiktok-apps"] });
    },
  });

  return {
    testConnection: testConnection.mutateAsync,
    refreshToken: refreshToken.mutateAsync,
    isConnecting: testConnection.isPending || refreshToken.isPending,
  };
}
