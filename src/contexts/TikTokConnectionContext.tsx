import React, { createContext, useContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface TikTokApp {
  id: string;
  app_id: string;
  app_key: string;
  app_name: string;
  app_secret: string | null;
  access_token: string | null;
  refresh_token: string | null;
  token_expires_at: string | null;
  status: string;
  market: string | null;
  permissions_granted: number | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface TikTokConnectionContextType {
  isConnected: boolean;
  connectedApp: TikTokApp | null;
  isLoading: boolean;
  error: Error | null;
  appId: string | null;
  refetch: () => void;
}

const TikTokConnectionContext = createContext<TikTokConnectionContextType | undefined>(undefined);

export function TikTokConnectionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["tiktok-connected-app", user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("tiktok_apps")
        .select("*")
        .eq("user_id", user.id)
        .in("status", ["active", "connected", "inactive"])
        .order("created_at", { ascending: false })
        .maybeSingle();

      if (error) throw error;
      return data as TikTokApp | null;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const value: TikTokConnectionContextType = {
    isConnected: !!data && (data.status === "active" || data.status === "connected"),
    connectedApp: data || null,
    isLoading,
    error: error as Error | null,
    appId: data?.id || null,
    refetch,
  };

  return (
    <TikTokConnectionContext.Provider value={value}>
      {children}
    </TikTokConnectionContext.Provider>
  );
}

export function useTikTokConnection() {
  const context = useContext(TikTokConnectionContext);
  if (context === undefined) {
    throw new Error("useTikTokConnection must be used within a TikTokConnectionProvider");
  }
  return context;
}
