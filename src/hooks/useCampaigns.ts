import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Campaign = Tables<"campaigns">;
export type CampaignInsert = TablesInsert<"campaigns">;
export type CampaignUpdate = TablesUpdate<"campaigns">;

export function useCampaigns(platform?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["campaigns", platform],
    queryFn: async () => {
      let query = supabase.from("campaigns").select("*").order("created_at", { ascending: false });
      
      if (platform) {
        query = query.eq("platform", platform);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (campaign: Omit<CampaignInsert, "user_id">) => {
      if (!user) throw new Error("Must be logged in");
      
      const { data, error } = await supabase
        .from("campaigns")
        .insert({ ...campaign, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      toast.success("Campaign created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create campaign: " + error.message);
    },
  });
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: CampaignUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("campaigns")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      toast.success("Campaign updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update campaign: " + error.message);
    },
  });
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("campaigns").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      toast.success("Campaign deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete campaign: " + error.message);
    },
  });
}
