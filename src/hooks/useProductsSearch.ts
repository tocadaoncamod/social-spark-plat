import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export interface ProductFilters {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  minStock: number;
  status: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export interface PaginationState {
  page: number;
  pageSize: number;
}

const defaultFilters: ProductFilters = {
  search: "",
  category: "",
  minPrice: 0,
  maxPrice: 10000,
  minStock: 0,
  status: "",
  sortBy: "created_at",
  sortOrder: "desc",
};

export function useProductsSearch() {
  const [filters, setFilters] = useState<ProductFilters>(defaultFilters);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["products-search", filters, pagination],
    queryFn: async () => {
      let query = supabase
        .from("tiktok_products")
        .select("*", { count: "exact" });

      // Apply filters
      if (filters.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,sku.ilike.%${filters.search}%`
        );
      }

      if (filters.category && filters.category !== "all") {
        query = query.eq("category", filters.category);
      }

      if (filters.minPrice > 0) {
        query = query.gte("price", filters.minPrice);
      }

      if (filters.maxPrice < 10000) {
        query = query.lte("price", filters.maxPrice);
      }

      if (filters.minStock > 0) {
        query = query.gte("stock_quantity", filters.minStock);
      }

      if (filters.status && filters.status !== "all") {
        query = query.eq("status", filters.status);
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
        products: data || [],
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / pagination.pageSize),
      };
    },
  });

  const updateFilters = (newFilters: Partial<ProductFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page
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
    products: data?.products || [],
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
