import { useState } from "react";
import { FastMossLayout } from "@/components/fastmoss/FastMossLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Users,
  Video,
  DollarSign,
  Heart,
  Mail,
  Instagram,
  ExternalLink,
  Crown,
  Medal,
  Award,
  RefreshCw,
  AlertCircle,
  UserX,
} from "lucide-react";
import { useInfluencersSearch } from "@/hooks/useInfluencersSearch";
import { Pagination } from "@/components/fastmoss/Pagination";
import { TikTokConnectionBanner } from "@/components/fastmoss/TikTokConnectionBanner";
import { useTikTokRealData } from "@/hooks/useTikTokRealData";

const tierConfig = {
  gold: { icon: Crown, color: "text-yellow-500", bg: "bg-yellow-500/10", label: "Gold" },
  silver: { icon: Medal, color: "text-gray-400", bg: "bg-gray-400/10", label: "Silver" },
  bronze: { icon: Award, color: "text-orange-600", bg: "bg-orange-600/10", label: "Bronze" },
};

const sortOptions = [
  { value: "followers_count", label: "Mais seguidores" },
  { value: "engagement_rate", label: "Maior engajamento" },
  { value: "total_sales", label: "Mais vendas" },
  { value: "commission_earned", label: "Maior comissão" },
  { value: "created_at", label: "Mais recentes" },
];

export default function InfluencersRanking() {
  const [localSearch, setLocalSearch] = useState("");
  const { isConnected, useRealAffiliates } = useTikTokRealData();
  const realAffiliates = useRealAffiliates();

  const {
    influencers,
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
  } = useInfluencersSearch();

  const formatCurrency = (value: number | null) => {
    if (!value) return "R$ 0";
    if (value >= 1000000) {
      return `R$ ${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `R$ ${(value / 1000).toFixed(0)}K`;
    }
    return `R$ ${value}`;
  };

  const formatNumber = (value: number | null) => {
    if (!value) return "0";
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
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
        <TikTokConnectionBanner />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Ranking de Influencers</h1>
            <p className="text-muted-foreground">
              Encontre os melhores criadores para sua marca
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar Contatos
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-tiktok/10">
                  <Users className="h-5 w-5 text-tiktok" />
                </div>
                <div>
                  <p className="text-xl font-bold">{formatNumber(totalCount)}</p>
                  <p className="text-xs text-muted-foreground">Influencers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <Video className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-xl font-bold">
                    {formatNumber(
                      influencers.reduce((acc, i) => acc + (i.total_orders || 0), 0)
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Pedidos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold">
                    {formatCurrency(
                      influencers.reduce((acc, i) => acc + Number(i.total_sales || 0), 0)
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">Vendas Geradas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <Heart className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-xl font-bold">
                    {influencers.length > 0
                      ? (
                          influencers.reduce(
                            (acc, i) => acc + Number(i.engagement_rate || 0),
                            0
                          ) / influencers.length
                        ).toFixed(1)
                      : "0"}
                    %
                  </p>
                  <p className="text-xs text-muted-foreground">Eng. Médio</p>
                </div>
              </div>
            </CardContent>
          </Card>
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
              {/* Tier */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Tier</label>
                <Select
                  value={filters.tier || "all"}
                  onValueChange={(value) => updateFilters({ tier: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="gold">Gold</SelectItem>
                    <SelectItem value="silver">Silver</SelectItem>
                    <SelectItem value="bronze">Bronze</SelectItem>
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
                    <SelectItem value="pending">Pendentes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Min Followers */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Seguidores mínimos</label>
                <Select
                  value={filters.minFollowers.toString()}
                  onValueChange={(value) => updateFilters({ minFollowers: Number(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Sem mínimo</SelectItem>
                    <SelectItem value="1000">1K+</SelectItem>
                    <SelectItem value="10000">10K+</SelectItem>
                    <SelectItem value="100000">100K+</SelectItem>
                    <SelectItem value="1000000">1M+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Min Engagement */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Engajamento mínimo</label>
                <Select
                  value={filters.minEngagement.toString()}
                  onValueChange={(value) => updateFilters({ minEngagement: Number(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Sem mínimo</SelectItem>
                    <SelectItem value="1">1%+</SelectItem>
                    <SelectItem value="3">3%+</SelectItem>
                    <SelectItem value="5">5%+</SelectItem>
                    <SelectItem value="10">10%+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Min Sales */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Vendas mínimas</label>
                <Select
                  value={filters.minSales.toString()}
                  onValueChange={(value) => updateFilters({ minSales: Number(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Sem mínimo</SelectItem>
                    <SelectItem value="1000">R$ 1K+</SelectItem>
                    <SelectItem value="10000">R$ 10K+</SelectItem>
                    <SelectItem value="100000">R$ 100K+</SelectItem>
                    <SelectItem value="1000000">R$ 1M+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={resetFilters}>
                  Limpar
                </Button>
                <Button
                  className="flex-1 bg-tiktok hover:bg-tiktok/90"
                  onClick={handleSearch}
                >
                  Aplicar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="flex-1 space-y-4">
            {/* Search and Sort */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="relative flex-1 min-w-[300px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar influencers por nome, username..."
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
                  <Button onClick={handleSearch}>
                    <Search className="h-4 w-4 mr-2" />
                    Buscar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results Count */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{totalCount}</span> influencers
                encontrados
              </p>
            </div>

            {/* Loading State */}
            {isLoading && (
              <Card>
                <div className="p-6 space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
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
                    <p>Erro ao carregar influencers. Tente novamente.</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Empty State */}
            {!isLoading && !error && influencers.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <UserX className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Nenhum influencer encontrado
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Tente ajustar os filtros ou adicione influencers ao banco de dados.
                  </p>
                  <Button variant="outline" onClick={resetFilters}>
                    Limpar filtros
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Influencers Table */}
            {!isLoading && !error && influencers.length > 0 && (
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Influencer</TableHead>
                      <TableHead className="text-center">Tier</TableHead>
                      <TableHead className="text-right">Seguidores</TableHead>
                      <TableHead className="text-center">Engajamento</TableHead>
                      <TableHead className="text-right">Vendas</TableHead>
                      <TableHead className="text-right">Comissão</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Contato</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {influencers.map((influencer, index) => {
                      const tier = (influencer.tier as keyof typeof tierConfig) || "bronze";
                      const TierIcon = tierConfig[tier]?.icon || Award;
                      return (
                        <TableRow
                          key={influencer.id}
                          className="cursor-pointer hover:bg-muted/50"
                        >
                          <TableCell className="font-medium text-muted-foreground">
                            {(currentPage - 1) * pageSize + index + 1}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {influencer.avatar_url ? (
                                <img
                                  src={influencer.avatar_url}
                                  alt={influencer.display_name || influencer.tiktok_username}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-tiktok to-primary flex items-center justify-center text-white font-bold text-sm">
                                  {(
                                    influencer.display_name ||
                                    influencer.tiktok_username ||
                                    "?"
                                  )
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>
                              )}
                              <div>
                                <p className="font-medium">
                                  {influencer.display_name || influencer.tiktok_username}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  @{influencer.tiktok_username}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${
                                tierConfig[tier]?.bg || "bg-gray-100"
                              }`}
                            >
                              <TierIcon
                                className={`h-4 w-4 ${
                                  tierConfig[tier]?.color || "text-gray-500"
                                }`}
                              />
                              <span
                                className={`text-sm font-medium capitalize ${
                                  tierConfig[tier]?.color || "text-gray-500"
                                }`}
                              >
                                {tier}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatNumber(influencer.followers_count)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-success/10 text-success hover:bg-success/20">
                              {Number(influencer.engagement_rate || 0).toFixed(1)}%
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium text-tiktok">
                            {formatCurrency(Number(influencer.total_sales))}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(Number(influencer.commission_earned))}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              className={
                                influencer.status === "active"
                                  ? "bg-success/10 text-success"
                                  : "bg-muted text-muted-foreground"
                              }
                            >
                              {influencer.status === "active" ? "Ativo" : "Inativo"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Mail className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Instagram className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Card>
            )}

            {/* Pagination */}
            {!isLoading && !error && influencers.length > 0 && (
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
