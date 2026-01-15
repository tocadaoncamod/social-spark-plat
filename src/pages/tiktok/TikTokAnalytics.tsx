import { useState } from "react";
import { TikTokShopLayout } from "@/components/tiktok/TikTokShopLayout";
import { StatsCard } from "@/components/tiktok/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTikTokSales, useTikTokProducts, useTikTokInfluencers } from "@/hooks/useTikTokData";
import { 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  Percent,
  Calendar,
  BarChart3
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const COLORS = ['hsl(var(--primary))', 'hsl(var(--destructive))', '#10b981', '#f59e0b', '#8b5cf6'];

type Period = '7d' | '30d' | '90d' | '1y';

export default function TikTokAnalytics() {
  const [period, setPeriod] = useState<Period>('30d');
  const { data: sales, isLoading: salesLoading } = useTikTokSales();
  const { data: products, isLoading: productsLoading } = useTikTokProducts();
  const { data: influencers, isLoading: influencersLoading } = useTikTokInfluencers();

  const isLoading = salesLoading || productsLoading || influencersLoading;

  // Calculate date range
  const getDateRange = () => {
    const end = new Date();
    const start = new Date();
    switch (period) {
      case '7d': start.setDate(end.getDate() - 7); break;
      case '30d': start.setDate(end.getDate() - 30); break;
      case '90d': start.setDate(end.getDate() - 90); break;
      case '1y': start.setFullYear(end.getFullYear() - 1); break;
    }
    return { start, end };
  };

  const { start } = getDateRange();
  
  const filteredSales = sales?.filter(s => new Date(s.sale_date) >= start) || [];

  // Calculate stats
  const totalRevenue = filteredSales.reduce((sum, s) => sum + Number(s.total_amount), 0);
  const totalOrders = filteredSales.length;
  const averageTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const conversionRate = 3.2; // Placeholder
  const totalInfluencerSales = filteredSales.filter(s => s.influencer_id).length;
  const influencerRate = totalOrders > 0 ? (totalInfluencerSales / totalOrders) * 100 : 0;

  // Sales by date for chart
  const salesByDate = filteredSales.reduce((acc, sale) => {
    const date = new Date(sale.sale_date).toLocaleDateString('pt-BR');
    acc[date] = (acc[date] || 0) + Number(sale.total_amount);
    return acc;
  }, {} as Record<string, number>);

  const salesChartData = Object.entries(salesByDate)
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => {
      const dateA = new Date(a.date.split('/').reverse().join('-'));
      const dateB = new Date(b.date.split('/').reverse().join('-'));
      return dateA.getTime() - dateB.getTime();
    });

  // Sales by category
  const salesByCategory = filteredSales.reduce((acc, sale) => {
    const category = sale.product?.category || 'Outros';
    acc[category] = (acc[category] || 0) + Number(sale.total_amount);
    return acc;
  }, {} as Record<string, number>);

  const categoryChartData = Object.entries(salesByCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Sales by region
  const salesByRegion = filteredSales.reduce((acc, sale) => {
    const region = sale.region || 'Não informado';
    acc[region] = (acc[region] || 0) + Number(sale.total_amount);
    return acc;
  }, {} as Record<string, number>);

  const regionChartData = Object.entries(salesByRegion)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Sales by status
  const statusCounts = filteredSales.reduce((acc, sale) => {
    acc[sale.status] = (acc[sale.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusChartData = Object.entries(statusCounts).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  return (
    <TikTokShopLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">
              Análise detalhada de vendas e performance
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div className="flex rounded-lg border bg-muted/50 p-1">
              {(['7d', '30d', '90d', '1y'] as Period[]).map((p) => (
                <Button
                  key={p}
                  variant={period === p ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setPeriod(p)}
                  className="px-3"
                >
                  {p === '7d' ? '7 dias' : p === '30d' ? '30 dias' : p === '90d' ? '90 dias' : '1 ano'}
                </Button>
              ))}
            </div>
          </div>
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
                title="Receita Total"
                value={formatCurrency(totalRevenue)}
                icon={<DollarSign className="h-6 w-6" />}
                trend={{ value: 15.2, isPositive: true }}
              />
              <StatsCard
                title="Total de Pedidos"
                value={totalOrders}
                icon={<ShoppingCart className="h-6 w-6" />}
                trend={{ value: 8.5, isPositive: true }}
              />
              <StatsCard
                title="Ticket Médio"
                value={formatCurrency(averageTicket)}
                icon={<TrendingUp className="h-6 w-6" />}
                trend={{ value: 3.2, isPositive: true }}
              />
              <StatsCard
                title="Taxa de Conversão"
                value={`${conversionRate.toFixed(1)}%`}
                subtitle={`${influencerRate.toFixed(1)}% via influenciadores`}
                icon={<Percent className="h-6 w-6" />}
              />
            </>
          )}
        </div>

        {/* Charts Row 1 */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Revenue Over Time */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Receita por Período
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[300px]" />
              ) : salesChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesChartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <YAxis 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      tickFormatter={(value) => `R$${value}`}
                    />
                    <Tooltip 
                      formatter={(value) => [formatCurrency(Number(value)), 'Receita']}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  Nenhuma venda no período selecionado
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Sales by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Vendas por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[280px]" />
              ) : categoryChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryChartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => formatCurrency(Number(value))}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[280px] text-muted-foreground">
                  Sem dados de categoria
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sales by Region */}
          <Card>
            <CardHeader>
              <CardTitle>Vendas por Região</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[280px]" />
              ) : regionChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={regionChartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      type="number"
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      tickFormatter={(value) => `R$${value}`}
                    />
                    <YAxis 
                      type="category"
                      dataKey="name"
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      width={100}
                    />
                    <Tooltip 
                      formatter={(value) => [formatCurrency(Number(value)), 'Vendas']}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[280px] text-muted-foreground">
                  Sem dados de região
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Status dos Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[200px]" />
            ) : statusChartData.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-5">
                {statusChartData.map((item, index) => (
                  <div 
                    key={item.name}
                    className="text-center p-4 rounded-lg bg-muted/50"
                  >
                    <div 
                      className="w-full h-2 rounded-full mb-3"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <p className="text-2xl font-bold">{item.value}</p>
                    <p className="text-sm text-muted-foreground">{item.name}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                Nenhum pedido no período
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TikTokShopLayout>
  );
}
