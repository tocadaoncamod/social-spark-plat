import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTikTokConnection } from "@/contexts/TikTokConnectionContext";
import { toast } from "sonner";

// Hook for fetching real TikTok data via API
export function useTikTokRealData() {
  const { isConnected, appId } = useTikTokConnection();
  const queryClient = useQueryClient();

  const callAPI = async (action: string, params: Record<string, any> = {}) => {
    if (!appId) throw new Error("No TikTok app connected");
    
    const { data, error } = await supabase.functions.invoke("tiktok-shop-api", {
      body: { action, appId, ...params },
    });

    if (error) throw error;
    return data;
  };

  // Products from real API
  const useRealProducts = (page = 1, limit = 20) => {
    return useQuery({
      queryKey: ["tiktok-real-products", appId, page, limit],
      queryFn: () => callAPI("get_products", { page, limit }),
      enabled: isConnected && !!appId,
      staleTime: 1000 * 60 * 2, // 2 minutes
    });
  };

  // Orders from real API
  const useRealOrders = (status?: string, limit = 50) => {
    return useQuery({
      queryKey: ["tiktok-real-orders", appId, status, limit],
      queryFn: () => callAPI("get_orders", { status, limit }),
      enabled: isConnected && !!appId,
      staleTime: 1000 * 60 * 2,
    });
  };

  // Shop info from real API
  const useRealShopInfo = () => {
    return useQuery({
      queryKey: ["tiktok-real-shop-info", appId],
      queryFn: () => callAPI("get_shop_info"),
      enabled: isConnected && !!appId,
      staleTime: 1000 * 60 * 10, // 10 minutes
    });
  };

  // Categories from real API
  const useRealCategories = () => {
    return useQuery({
      queryKey: ["tiktok-real-categories", appId],
      queryFn: () => callAPI("get_categories"),
      enabled: isConnected && !!appId,
      staleTime: 1000 * 60 * 30, // 30 minutes
    });
  };

  // Finance overview from real API
  const useRealFinance = () => {
    return useQuery({
      queryKey: ["tiktok-real-finance", appId],
      queryFn: () => callAPI("get_finance_overview"),
      enabled: isConnected && !!appId,
      staleTime: 1000 * 60 * 5,
    });
  };

  // Affiliates/Creators from real API
  const useRealAffiliates = (limit = 50) => {
    return useQuery({
      queryKey: ["tiktok-real-affiliates", appId, limit],
      queryFn: () => callAPI("get_affiliates", { limit }),
      enabled: isConnected && !!appId,
      staleTime: 1000 * 60 * 5,
    });
  };

  // Videos from real API
  const useRealVideos = (limit = 50) => {
    return useQuery({
      queryKey: ["tiktok-real-videos", appId, limit],
      queryFn: () => callAPI("get_videos", { limit }),
      enabled: isConnected && !!appId,
      staleTime: 1000 * 60 * 2,
    });
  };

  // Sync products mutation
  const useSyncProducts = () => {
    return useMutation({
      mutationFn: async () => {
        return callAPI("sync_products");
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["tiktok-real-products"] });
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
      mutationFn: async () => {
        return callAPI("sync_orders");
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["tiktok-real-orders"] });
        queryClient.invalidateQueries({ queryKey: ["tiktok-sales"] });
        toast.success(`${data.synced} pedidos sincronizados!`);
      },
      onError: (error: Error) => {
        toast.error(`Erro na sincronização: ${error.message}`);
      },
    });
  };

  return {
    isConnected,
    appId,
    useRealProducts,
    useRealOrders,
    useRealShopInfo,
    useRealCategories,
    useRealFinance,
    useRealAffiliates,
    useRealVideos,
    useSyncProducts,
    useSyncOrders,
  };
}
