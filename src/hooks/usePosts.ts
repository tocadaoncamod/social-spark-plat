import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { Tables, TablesInsert, TablesUpdate, Json } from "@/integrations/supabase/types";

export type Post = Tables<"posts">;
export type PostInsert = TablesInsert<"posts">;
export type PostUpdate = TablesUpdate<"posts">;

export function usePosts(platform?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["posts", platform],
    queryFn: async () => {
      let query = supabase.from("posts").select("*").order("created_at", { ascending: false });
      
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

export function useCreatePost() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (post: Omit<PostInsert, "user_id">) => {
      if (!user) throw new Error("Must be logged in");
      
      const { data, error } = await supabase
        .from("posts")
        .insert({ ...post, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create post: " + error.message);
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: PostUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("posts")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update post: " + error.message);
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete post: " + error.message);
    },
  });
}
