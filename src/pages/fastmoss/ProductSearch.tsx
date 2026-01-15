import { useState } from "react";
import { FastMossLayout } from "@/components/fastmoss/FastMossLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
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
  TrendingDown,
  Star,
  ExternalLink,
  LayoutGrid,
  List,
  Sparkles,
  RefreshCw,
  Package,
  AlertCircle,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useProductsSearch } from "@/hooks/useProductsSearch";
import { Pagination } from "@/components/fastmoss/Pagination";
import { TikTokConnectionBanner } from "@/components/fastmoss/TikTokConnectionBanner";
import { useTikTokRealData } from "@/hooks/useTikTokRealData";

const categories = [
  { value: "all", label: "Todas as categorias" },
  { value: "Roupas femininas", label: "Roupas femininas" },
  { value: "Beleza", label: "Beleza" },
  { value: "Eletrônicos", label: "Eletrônicos" },
  { value: "Casa e Decoração", label: "Casa e Decoração" },
  { value: "Esportes", label: "Esportes" },
  { value: "Acessórios", label: "Acessórios" },
  { value: "Saúde", label: "Saúde" },
];

const sortOptions = [
  { value: "created_at", label: "Mais recentes" },
  { value: "price", label: "Preço" },
  { value: "stock_quantity", label: "Estoque" },
  { value: "name", label: "Nome" },
];

export default function ProductSearch() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [localSearch, setLocalSearch] = useState(searchParams.get("q") || "");
  const [showPromoOnly, setShowPromoOnly] = useState(false);

  const { isConnected, useSyncProducts } = useTikTokRealData();
  const syncProducts = useSyncProducts();

  const {
    products,
    totalCount,
    totalPages,
    currentPage,
    pageSize,
    filters,
    isLoading,
    error,
    updateFilters,
    resetFilters,
    goToPage,
    setPageSize,
    refetch,
  } = useProductsSearch();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleSearch = () => {
    updateFilters({ search: localSearch });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <FastMossLayout>
      <div className="space-y-6">
        {/* TikTok Connection Status */}
        <TikTokConnectionBanner 
          showSyncButton={true}
          onSync={() => syncProducts.mutate()}
          isSyncing={syncProducts.isPending}
        />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Pesquisa de Produtos</h1>
            <p className="text-muted-foreground">
              Encontre produtos em alta no TikTok Shop Brasil
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <Card className="w-72 shrink-0 h-fit sticky top-24">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Category */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Categoria</label>
                <Select
                  value={filters.category || "all"}
                  onValueChange={(value) => updateFilters({ category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Faixa de Preço</label>
                <Slider
                  value={[filters.minPrice, filters.maxPrice]}
                  onValueChange={([min, max]) =>
                    updateFilters({ minPrice: min, maxPrice: max })
                  }
                  max={1000}
                  step={10}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>R$ {filters.minPrice}</span>
                  <span>R$ {filters.maxPrice}</span>
                </div>
              </div>

              {/* Min Stock */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Estoque mínimo</label>
                <Select
                  value={filters.minStock.toString()}
                  onValueChange={(value) => updateFilters({ minStock: Number(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Sem mínimo</SelectItem>
                    <SelectItem value="10">10+ unidades</SelectItem>
                    <SelectItem value="50">50+ unidades</SelectItem>
                    <SelectItem value="100">100+ unidades</SelectItem>
                    <SelectItem value="500">500+ unidades</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={filters.status || "all"}
                  onValueChange={(value) => updateFilters({ status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Ativos</SelectItem>
                    <SelectItem value="inactive">Inativos</SelectItem>
                    <SelectItem value="out_of_stock">Sem estoque</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Additional filters */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Outros filtros</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="promo"
                      checked={showPromoOnly}
                      onCheckedChange={(checked) => setShowPromoOnly(!!checked)}
                    />
                    <label htmlFor="promo" className="text-sm">
                      Em promoção
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={resetFilters}
                >
                  Limpar
                </Button>
                <Button className="flex-1 bg-tiktok hover:bg-tiktok/90" onClick={handleSearch}>
                  Aplicar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="flex-1 space-y-4">
            {/* Search and Actions */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar produtos por nome, descrição, SKU..."
                      value={localSearch}
                      onChange={(e) => setLocalSearch(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="pl-10"
                    />
                  </div>
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value) => updateFilters({ sortBy: value })}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={filters.sortOrder}
                    onValueChange={(value: "asc" | "desc") =>
                      updateFilters({ sortOrder: value })
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">Decrescente</SelectItem>
                      <SelectItem value="asc">Crescente</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant={viewMode === "table" ? "secondary" : "ghost"}
                      size="icon"
                      onClick={() => setViewMode("table")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "grid" ? "secondary" : "ghost"}
                      size="icon"
                      onClick={() => setViewMode("grid")}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results Count */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{totalCount}</span> produtos
                encontrados
              </p>
              <Button variant="ghost" size="sm" className="text-tiktok">
                <Sparkles className="h-4 w-4 mr-1" />
                Análise IA
              </Button>
            </div>

            {/* Loading State */}
            {isLoading && (
              <Card>
                <div className="p-6 space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-lg" />
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
                    <p>Erro ao carregar produtos. Tente novamente.</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Empty State */}
            {!isLoading && !error && products.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum produto encontrado</h3>
                  <p className="text-muted-foreground mb-4">
                    Tente ajustar os filtros ou adicione produtos ao banco de dados.
                  </p>
                  <Button variant="outline" onClick={resetFilters}>
                    Limpar filtros
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Table View */}
            {!isLoading && !error && products.length > 0 && (
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Produto</TableHead>
                      <TableHead className="text-right">Preço</TableHead>
                      <TableHead className="text-right">Estoque</TableHead>
                      <TableHead className="text-center">Categoria</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Promoção</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product, index) => (
                      <TableRow
                        key={product.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => navigate(`/products/detail/${product.id}`)}
                      >
                        <TableCell className="font-medium text-muted-foreground">
                          {(currentPage - 1) * pageSize + index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                                <Package className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium line-clamp-1 max-w-xs">
                                {product.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                SKU: {product.sku || "N/A"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div>
                            <p className="font-semibold text-tiktok">
                              {formatCurrency(product.price)}
                            </p>
                            {product.compare_at_price && (
                              <p className="text-sm text-muted-foreground line-through">
                                {formatCurrency(product.compare_at_price)}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {product.stock_quantity}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{product.category || "Sem categoria"}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            className={
                              product.status === "active"
                                ? "bg-success/10 text-success"
                                : "bg-muted text-muted-foreground"
                            }
                          >
                            {product.status === "active" ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {product.promotion_active ? (
                            <Badge className="bg-tiktok/10 text-tiktok">
                              -{product.promotion_discount}%
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
            {!isLoading && !error && products.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalCount={totalCount}
                pageSize={pageSize}
                onPageChange={goToPage}
                onPageSizeChange={setPageSize}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </div>
    </FastMossLayout>
  );
}
