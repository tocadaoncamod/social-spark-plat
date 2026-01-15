import { useState } from "react";
import { FastMossLayout } from "@/components/fastmoss/FastMossLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Filter,
  Download,
  TrendingUp,
  Star,
  ExternalLink,
  Store,
  Package,
  Users,
  ShoppingCart,
  RefreshCw,
  AlertCircle,
  StoreIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Pagination } from "@/components/fastmoss/Pagination";
import { TikTokConnectionBanner } from "@/components/fastmoss/TikTokConnectionBanner";

interface StoreFilters {
  search: string;
  category: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export default function StoresSearch() {
  const navigate = useNavigate();
  const [localSearch, setLocalSearch] = useState("");
  const [filters, setFilters] = useState<StoreFilters>({
    search: "",
    category: "",
    sortBy: "created_at",
    sortOrder: "desc",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  // Fetch products grouped by category as "stores" simulation
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["stores-search", filters, pagination],
    queryFn: async () => {
      let query = supabase
        .from("tiktok_products")
        .select("*", { count: "exact" });

      if (filters.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,category.ilike.%${filters.search}%`
        );
      }

      if (filters.category && filters.category !== "all") {
        query = query.eq("category", filters.category);
      }

      query = query.order(filters.sortBy, { ascending: filters.sortOrder === "asc" });

      const from = (pagination.page - 1) * pagination.pageSize;
      const to = from + pagination.pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      return {
        stores: data || [],
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / pagination.pageSize),
      };
    },
  });

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `R$ ${(value / 1000000).toFixed(1)}M`;
    }
    return `R$ ${(value / 1000).toFixed(0)}K`;
  };

  const formatNumber = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, search: localSearch }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const updateFilters = (newFilters: Partial<StoreFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      category: "",
      sortBy: "created_at",
      sortOrder: "desc",
    });
    setLocalSearch("");
    setPagination({ page: 1, pageSize: 10 });
  };

  const stores = data?.stores || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || 0;

  return (
    <FastMossLayout>
      <div className="space-y-6">
        {/* TikTok Connection Status */}
        <TikTokConnectionBanner />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Buscar Lojas</h1>
            <p className="text-muted-foreground">
              Encontre e analise lojas do TikTok Shop
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-tiktok/10">
                  <Store className="h-5 w-5 text-tiktok" />
                </div>
                <div>
                  <p className="text-xl font-bold">{formatNumber(totalCount)}</p>
                  <p className="text-xs text-muted-foreground">Produtos/Lojas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <ShoppingCart className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-xl font-bold">
                    {formatNumber(
                      stores.reduce((acc, s) => acc + (s.stock_quantity || 0), 0)
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">Estoque Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold">
                    {new Set(stores.map((s) => s.category)).size}
                  </p>
                  <p className="text-xs text-muted-foreground">Categorias</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <Users className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-xl font-bold">
                    {stores.filter((s) => s.status === "active").length}
                  </p>
                  <p className="text-xs text-muted-foreground">Ativos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[300px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar lojas por nome, categoria..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="pl-10"
                />
              </div>
              <Select
                value={filters.category || "all"}
                onValueChange={(value) => updateFilters({ category: value })}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas categorias</SelectItem>
                  <SelectItem value="Moda">Moda</SelectItem>
                  <SelectItem value="Beleza">Beleza</SelectItem>
                  <SelectItem value="Eletrônicos">Eletrônicos</SelectItem>
                  <SelectItem value="Casa">Casa</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filters.sortBy}
                onValueChange={(value) => updateFilters({ sortBy: value })}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Mais recentes</SelectItem>
                  <SelectItem value="price">Preço</SelectItem>
                  <SelectItem value="stock_quantity">Estoque</SelectItem>
                  <SelectItem value="name">Nome</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={resetFilters}>
                <Filter className="h-4 w-4 mr-2" />
                Limpar
              </Button>
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <Card>
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-destructive">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <p>Erro ao carregar lojas. Tente novamente.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!isLoading && !error && stores.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <StoreIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma loja encontrada</h3>
              <p className="text-muted-foreground mb-4">
                Tente ajustar os filtros ou adicione produtos ao banco de dados.
              </p>
              <Button variant="outline" onClick={resetFilters}>
                Limpar filtros
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {!isLoading && !error && stores.length > 0 && (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Loja/Produto</TableHead>
                  <TableHead className="text-center">Categoria</TableHead>
                  <TableHead className="text-right">Preço</TableHead>
                  <TableHead className="text-right">Estoque</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Promoção</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stores.map((store, index) => (
                  <TableRow
                    key={store.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/products/detail/${store.id}`)}
                  >
                    <TableCell className="font-medium text-muted-foreground">
                      {(pagination.page - 1) * pagination.pageSize + index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {store.image_url ? (
                          <img
                            src={store.image_url}
                            alt={store.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-tiktok to-primary flex items-center justify-center text-white font-bold text-sm">
                            {store.name.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-medium line-clamp-1">{store.name}</p>
                          <p className="text-sm text-muted-foreground">
                            SKU: {store.sku || "N/A"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{store.category || "Sem categoria"}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium text-tiktok">
                      {formatCurrency(store.price * 1000)}
                    </TableCell>
                    <TableCell className="text-right">{store.stock_quantity}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className={
                          store.status === "active"
                            ? "bg-success/10 text-success hover:bg-success/20"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {store.status === "active" ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {store.promotion_active ? (
                        <Badge className="bg-tiktok/10 text-tiktok">
                          <TrendingUp className="h-3 w-3 mr-1" />-
                          {store.promotion_discount}%
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}

        {/* Pagination */}
        {!isLoading && !error && stores.length > 0 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={pagination.pageSize}
            onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
            onPageSizeChange={(size) => setPagination({ page: 1, pageSize: size })}
            isLoading={isLoading}
          />
        )}
      </div>
    </FastMossLayout>
  );
}
