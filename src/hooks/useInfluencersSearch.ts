import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export interface InfluencerFilters {
  search: string;
  tier: string;
  status: string;
  minFollowers: number;
  maxFollowers: number;
  minEngagement: number;
  minSales: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export interface PaginationState {
  page: number;
  pageSize: number;
}

const defaultFilters: InfluencerFilters = {
  search: "",
  tier: "",
  status: "",
  minFollowers: 0,
  maxFollowers: 10000000,
  minEngagement: 0,
  minSales: 0,
  sortBy: "followers_count",
  sortOrder: "desc",
};

export function useInfluencersSearch() {
  const [filters, setFilters] = useState<InfluencerFilters>(defaultFilters);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["influencers-search", filters, pagination],
    queryFn: async () => {
      let query = supabase
        .from("tiktok_influencers")
        .select("*", { count: "exact" });

      // Apply filters
      if (filters.search) {
        query = query.or(
          `tiktok_username.ilike.%${filters.search}%,display_name.ilike.%${filters.search}%`
        );
      }

      if (filters.tier && filters.tier !== "all") {
        query = query.eq("tier", filters.tier);
      }

      if (filters.status && filters.status !== "all") {
        query = query.eq("status", filters.status);
      }

      if (filters.minFollowers > 0) {
        query = query.gte("followers_count", filters.minFollowers);
      }

      if (filters.maxFollowers < 10000000) {
        query = query.lte("followers_count", filters.maxFollowers);
      }

      if (filters.minEngagement > 0) {
        query = query.gte("engagement_rate", filters.minEngagement);
      }

      if (filters.minSales > 0) {
        query = query.gte("total_sales", filters.minSales);
      }

      // Apply sorting
      query = query.order(filters.sortBy, { ascending: filters.sortOrder === "asc" });

      // Apply pagination
      const from = (pagination.page - 1) * pagination.pageSize;
      const to = from + pagination.pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        influencers: data || [],
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / pagination.pageSize),
      };
    },
  });

  const updateFilters = (newFilters: Partial<InfluencerFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    setPagination({ page: 1, pageSize: 10 });
  };

  const goToPage = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const setPageSize = (pageSize: number) => {
    setPagination({ page: 1, pageSize });
  };

  return {
    influencers: data?.influencers || [],
    totalCount: data?.totalCount || 0,
    totalPages: data?.totalPages || 0,
    currentPage: pagination.page,
    pageSize: pagination.pageSize,
    filters,
    isLoading,
    error,
    updateFilters,
    resetFilters,
    goToPage,
    setPageSize,
    refetch,
  };
}
