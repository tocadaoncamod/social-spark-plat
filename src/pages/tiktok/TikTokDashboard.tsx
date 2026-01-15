import { TikTokShopLayout } from "@/components/tiktok/TikTokShopLayout";
import { StatsCard } from "@/components/tiktok/StatsCard";
import { AIInsightsPanel } from "@/components/tiktok/AIInsightsPanel";
import { AdvancedAIInsights } from "@/components/tiktok/AdvancedAIInsights";
import { TikTokConnectionBanner } from "@/components/tiktok/TikTokConnectionBanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTikTokDashboardStats } from "@/hooks/useTikTokData";
import { useTikTokConnection } from "@/contexts/TikTokConnectionContext";
import { DollarSign, ShoppingCart, TrendingUp, Package, Users, Crown } from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { useState } from "react";
import { toast } from "sonner";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const tierColors = {
  bronze: "bg-amber-700/20 text-amber-700",
  silver: "bg-gray-400/20 text-gray-500",
  gold: "bg-yellow-500/20 text-yellow-600",
  platinum: "bg-purple-500/20 text-purple-600",
};

export default function TikTokDashboard() {
  const { data: stats, isLoading } = useTikTokDashboardStats();
  const { isConnected } = useTikTokConnection();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      // Simulate sync - in real implementation this would call the sync API
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("Dados sincronizados com sucesso!");
    } catch (error) {
      toast.error("Erro ao sincronizar dados");
    } finally {
      setIsSyncing(false);
    }
  };

  const chartData = stats?.salesByDate
    ? Object.entries(stats.salesByDate)
        .map(([date, value]) => ({ date, value }))
        .sort((a, b) => new Date(a.date.split('/').reverse().join('-')).getTime() - 
                       new Date(b.date.split('/').reverse().join('-')).getTime())
    : [];

  return (
    <TikTokShopLayout>
      <div className="space-y-6">
        {/* Connection Status Banner */}
        <TikTokConnectionBanner 
          showSyncButton={true}
          onSync={handleSync}
          isSyncing={isSyncing}
        />

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral do seu TikTok Shop - últimos 30 dias
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            <>
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </>
          ) : (
            <>
              <StatsCard
                title="Vendas Totais"
                value={formatCurrency(stats?.totalSales || 0)}
                icon={<DollarSign className="h-6 w-6" />}
                trend={{ value: 12.5, isPositive: true }}
              />
              <StatsCard
                title="Pedidos"
                value={stats?.totalOrders || 0}
                icon={<ShoppingCart className="h-6 w-6" />}
                trend={{ value: 8.3, isPositive: true }}
              />
              <StatsCard
                title="Ticket Médio"
                value={formatCurrency(stats?.averageTicket || 0)}
                icon={<TrendingUp className="h-6 w-6" />}
                trend={{ value: 3.2, isPositive: true }}
              />
              <StatsCard
                title="Produtos Ativos"
                value={stats?.activeProducts || 0}
                subtitle={`${stats?.activeInfluencers || 0} influenciadores`}
                icon={<Package className="h-6 w-6" />}
              />
            </>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Sales Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Vendas por Dia</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[300px]" />
              ) : chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="date" 
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      tickFormatter={(value) => `R$${value}`}
                    />
                    <Tooltip 
                      formatter={(value) => [formatCurrency(Number(value)), 'Vendas']}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  Nenhuma venda registrada nos últimos 30 dias
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Insights */}
          <AIInsightsPanel />
        </div>

        {/* Advanced AI Insights */}
        <AdvancedAIInsights />

        {/* Bottom Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Top 5 Produtos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12" />
                  ))}
                </div>
              ) : stats?.topProducts && stats.topProducts.length > 0 ? (
                <div className="space-y-3">
                  {stats.topProducts.map((item, index) => (
                    <div 
                      key={item.id} 
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {item.product?.name || 'Produto removido'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.product?.category || 'Sem categoria'}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold text-sm">
                        {formatCurrency(item.amount)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 text-muted-foreground">
                  Nenhum produto com vendas
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Influencers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Top 5 Influenciadores
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12" />
                  ))}
                </div>
              ) : stats?.topInfluencers && stats.topInfluencers.length > 0 ? (
                <div className="space-y-3">
                  {stats.topInfluencers.map((influencer, index) => (
                    <div 
                      key={influencer.id} 
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                          {index === 0 ? <Crown className="h-4 w-4" /> : index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            @{influencer.tiktok_username}
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={tierColors[influencer.tier]}>
                              {influencer.tier}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {influencer.followers_count.toLocaleString()} seguidores
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="font-semibold text-sm">
                        {formatCurrency(Number(influencer.total_sales))}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 text-muted-foreground">
                  Nenhum influenciador cadastrado
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </TikTokShopLayout>
  );
}
