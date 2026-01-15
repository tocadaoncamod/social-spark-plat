import { TocaDaOncaLayout } from "@/components/tocadaonca/TocaDaOncaLayout";
import { TikTokConnectionBanner } from "@/components/tocadaonca/TikTokConnectionBanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Eye,
  Clock,
  ShoppingCart,
  Zap,
  Target,
  Play,
  PieChart,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RechartsPie,
  Pie,
  Cell,
} from "recharts";

// Mock data for performance analysis
const hourlyData = [
  { hour: "00:00", viewers: 1200, gmv: 5400, orders: 45 },
  { hour: "01:00", viewers: 800, gmv: 3200, orders: 28 },
  { hour: "02:00", viewers: 450, gmv: 1800, orders: 15 },
  { hour: "06:00", viewers: 2100, gmv: 8900, orders: 72 },
  { hour: "08:00", viewers: 5600, gmv: 24500, orders: 189 },
  { hour: "10:00", viewers: 8900, gmv: 42000, orders: 312 },
  { hour: "12:00", viewers: 12400, gmv: 58000, orders: 445 },
  { hour: "14:00", viewers: 15200, gmv: 72000, orders: 523 },
  { hour: "16:00", viewers: 18900, gmv: 89000, orders: 678 },
  { hour: "18:00", viewers: 23500, gmv: 112000, orders: 856 },
  { hour: "20:00", viewers: 28900, gmv: 145000, orders: 1089 },
  { hour: "22:00", viewers: 19800, gmv: 95000, orders: 712 },
];

const categoryPerformance = [
  { name: "Moda", value: 35, gmv: 2450000, color: "#FF6B9D" },
  { name: "Eletrônicos", value: 25, gmv: 1890000, color: "#4ECDC4" },
  { name: "Beleza", value: 20, gmv: 1560000, color: "#9B59B6" },
  { name: "Casa", value: 12, gmv: 890000, color: "#F39C12" },
  { name: "Outros", value: 8, gmv: 520000, color: "#95A5A6" },
];

const topStreamers = [
  {
    name: "@fashionista_br",
    avatar: "https://i.pravatar.cc/150?img=1",
    avgViewers: 18500,
    totalGMV: 1250000,
    totalLives: 45,
    avgConversion: 5.8,
    trend: "up",
    trendValue: 23,
  },
  {
    name: "@techdeals_oficial",
    avatar: "https://i.pravatar.cc/150?img=2",
    avgViewers: 14200,
    totalGMV: 980000,
    totalLives: 38,
    avgConversion: 4.2,
    trend: "up",
    trendValue: 15,
  },
  {
    name: "@beleza_natural",
    avatar: "https://i.pravatar.cc/150?img=3",
    avgViewers: 11800,
    totalGMV: 720000,
    totalLives: 52,
    avgConversion: 6.5,
    trend: "down",
    trendValue: 8,
  },
  {
    name: "@fitness_pro",
    avatar: "https://i.pravatar.cc/150?img=4",
    avgViewers: 8900,
    totalGMV: 560000,
    totalLives: 28,
    avgConversion: 3.9,
    trend: "up",
    trendValue: 12,
  },
];

const conversionFunnel = [
  { stage: "Visualizações", value: 100000, percentage: 100 },
  { stage: "Cliques em Produtos", value: 35000, percentage: 35 },
  { stage: "Add to Cart", value: 12000, percentage: 12 },
  { stage: "Checkout", value: 6500, percentage: 6.5 },
  { stage: "Compra", value: 4200, percentage: 4.2 },
];

export default function LivesPerformance() {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [selectedMetric, setSelectedMetric] = useState("gmv");

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      notation: value >= 1000000 ? "compact" : "standard",
    }).format(value);
  };

  return (
    <TocaDaOncaLayout>
      <div className="space-y-6">
        <TikTokConnectionBanner />

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              Análise de Performance de Lives
            </h1>
            <p className="text-muted-foreground">
              Métricas detalhadas e insights sobre transmissões ao vivo
            </p>
          </div>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Últimas 24h</SelectItem>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="90d">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">GMV Total</p>
                  <p className="text-2xl font-bold text-foreground">R$ 7.3M</p>
                  <div className="flex items-center gap-1 text-green-500 text-xs mt-1">
                    <ArrowUp className="h-3 w-3" />
                    <span>+18.5% vs período anterior</span>
                  </div>
                </div>
                <DollarSign className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Espectadores Médios</p>
                  <p className="text-2xl font-bold text-foreground">15.2K</p>
                  <div className="flex items-center gap-1 text-green-500 text-xs mt-1">
                    <ArrowUp className="h-3 w-3" />
                    <span>+12.3% vs período anterior</span>
                  </div>
                </div>
                <Eye className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
                  <p className="text-2xl font-bold text-foreground">4.8%</p>
                  <div className="flex items-center gap-1 text-green-500 text-xs mt-1">
                    <ArrowUp className="h-3 w-3" />
                    <span>+0.5% vs período anterior</span>
                  </div>
                </div>
                <Target className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pedidos/Hora</p>
                  <p className="text-2xl font-bold text-foreground">89</p>
                  <div className="flex items-center gap-1 text-green-500 text-xs mt-1">
                    <ArrowUp className="h-3 w-3" />
                    <span>+22.1% vs período anterior</span>
                  </div>
                </div>
                <ShoppingCart className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-500/10 to-pink-500/5 border-pink-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Duração Média</p>
                  <p className="text-2xl font-bold text-foreground">2h 45m</p>
                  <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                    <ArrowDown className="h-3 w-3" />
                    <span>-5.2% vs período anterior</span>
                  </div>
                </div>
                <Clock className="h-8 w-8 text-pink-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Hourly Performance */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance por Horário
                </CardTitle>
                <Tabs value={selectedMetric} onValueChange={setSelectedMetric}>
                  <TabsList>
                    <TabsTrigger value="gmv">GMV</TabsTrigger>
                    <TabsTrigger value="viewers">Viewers</TabsTrigger>
                    <TabsTrigger value="orders">Pedidos</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={hourlyData}>
                  <defs>
                    <linearGradient id="colorGmv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="hour" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey={selectedMetric}
                    stroke="#F59E0B"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorGmv)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                GMV por Categoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <RechartsPie>
                  <Pie
                    data={categoryPerformance}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPie>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4">
                {categoryPerformance.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="text-sm">{cat.name}</span>
                    </div>
                    <span className="text-sm font-medium">
                      {formatCurrency(cat.gmv)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Streamers & Conversion Funnel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Streamers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Top Streamers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topStreamers.map((streamer, index) => (
                  <div
                    key={streamer.name}
                    className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <span className="text-lg font-bold text-muted-foreground w-6">
                      #{index + 1}
                    </span>
                    <img
                      src={streamer.avatar}
                      alt={streamer.name}
                      className="h-10 w-10 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{streamer.name}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{streamer.totalLives} lives</span>
                        <span>{formatNumber(streamer.avgViewers)} avg viewers</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">
                        {formatCurrency(streamer.totalGMV)}
                      </p>
                      <div
                        className={`flex items-center gap-1 text-xs ${
                          streamer.trend === "up" ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {streamer.trend === "up" ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        )}
                        <span>{streamer.trendValue}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Conversion Funnel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Funil de Conversão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversionFunnel.map((stage, index) => (
                  <div key={stage.stage}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-foreground">{stage.stage}</span>
                      <span className="text-muted-foreground">
                        {formatNumber(stage.value)} ({stage.percentage}%)
                      </span>
                    </div>
                    <div className="h-8 bg-muted rounded-lg overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg transition-all duration-500"
                        style={{ width: `${stage.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-amber-500" />
                  <span className="text-muted-foreground">
                    Taxa de conversão geral:{" "}
                    <span className="font-bold text-foreground">4.2%</span>
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TocaDaOncaLayout>
  );
}
