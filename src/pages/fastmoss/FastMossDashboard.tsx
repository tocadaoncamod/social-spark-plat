import { FastMossLayout } from "@/components/fastmoss/FastMossLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  Music,
  MessageCircle,
  Facebook,
  Instagram,
  Youtube,
  Send,
  Twitter,
  Zap,
  ArrowRight,
  Sparkles,
  Calendar,
  Users,
  DollarSign,
  BarChart3,
  Activity
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TikTokConnectionBanner } from "@/components/fastmoss/TikTokConnectionBanner";
import { useTikTokConnection } from "@/contexts/TikTokConnectionContext";
import { useTikTokRealData } from "@/hooks/useTikTokRealData";

// 8 Apps com métricas
const platformApps = [
  { 
    name: "TikTok Shop", 
    href: "/tiktok/dashboard", 
    icon: Music, 
    bgColor: "bg-black",
    metrics: { main: "45.0 mil", label: "Vendas", change: "+12.5%", trend: "up" },
    status: "active"
  },
  { 
    name: "WhatsApp", 
    href: "/whatsapp/dashboard", 
    icon: MessageCircle, 
    bgColor: "bg-[#25D366]",
    metrics: { main: "12.5K", label: "Mensagens", change: "+8.2%", trend: "up" },
    status: "active"
  },
  { 
    name: "Facebook", 
    href: "/facebook", 
    icon: Facebook, 
    bgColor: "bg-[#1877F2]",
    metrics: { main: "89.2K", label: "Alcance", change: "+15.3%", trend: "up" },
    status: "pending"
  },
  { 
    name: "Instagram", 
    href: "/instagram", 
    icon: Instagram, 
    bgColor: "bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]",
    metrics: { main: "156K", label: "Engajamento", change: "+22.1%", trend: "up" },
    status: "pending"
  },
  { 
    name: "YouTube", 
    href: "/youtube", 
    icon: Youtube, 
    bgColor: "bg-[#FF0000]",
    metrics: { main: "2.3M", label: "Visualizações", change: "+5.8%", trend: "up" },
    status: "pending"
  },
  { 
    name: "Telegram", 
    href: "/telegram", 
    icon: Send, 
    bgColor: "bg-[#0088CC]",
    metrics: { main: "45.2K", label: "Membros", change: "+3.2%", trend: "up" },
    status: "pending"
  },
  { 
    name: "Twitter/X", 
    href: "/twitter", 
    icon: Twitter, 
    bgColor: "bg-black",
    metrics: { main: "78.5K", label: "Impressões", change: "-2.1%", trend: "down" },
    status: "pending"
  },
  { 
    name: "Kwai", 
    href: "/kwai", 
    icon: Zap, 
    bgColor: "bg-[#FF6B00]",
    metrics: { main: "23.1K", label: "Vídeos", change: "+18.4%", trend: "up" },
    status: "pending"
  },
];

const overviewData = [
  { date: "Seg", total: 4200 },
  { date: "Ter", total: 3800 },
  { date: "Qua", total: 5100 },
  { date: "Qui", total: 4600 },
  { date: "Sex", total: 5800 },
  { date: "Sáb", total: 6200 },
  { date: "Dom", total: 5400 },
];

const overallStats = [
  { title: "Total Engajamento", value: "2.8M", change: "+12.5%", icon: Activity, color: "text-primary" },
  { title: "Alcance Total", value: "15.6M", change: "+8.3%", icon: Users, color: "text-success" },
  { title: "Receita Total", value: "R$ 1.2M", change: "+15.7%", icon: DollarSign, color: "text-warning" },
  { title: "Campanhas Ativas", value: "24", change: "+3", icon: BarChart3, color: "text-secondary" },
];

export default function FastMossDashboard() {
  const { isConnected, connectedApp } = useTikTokConnection();
  const { useSyncProducts, useSyncOrders } = useTikTokRealData();
  const syncProducts = useSyncProducts();
  const syncOrders = useSyncOrders();

  const handleSync = () => {
    syncProducts.mutate();
    syncOrders.mutate();
  };

  return (
    <FastMossLayout>
      <div className="space-y-6">
        {/* TikTok Connection Status Banner */}
        <TikTokConnectionBanner 
          showSyncButton={true} 
          onSync={handleSync}
          isSyncing={syncProducts.isPending || syncOrders.isPending}
        />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Painel de Controle</h1>
            <p className="text-muted-foreground">Visão geral de todas as plataformas</p>
          </div>
          <div className="flex items-center gap-3">
            <Select defaultValue="7d">
              <SelectTrigger className="w-[180px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="28d">Últimos 28 dias</SelectItem>
                <SelectItem value="90d">Últimos 90 dias</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-primary hover:bg-primary/90">
              <Sparkles className="h-4 w-4 mr-2" />
              Insights IA
            </Button>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {overallStats.map((stat) => (
            <Card key={stat.title} className="hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-muted">
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <Badge variant="outline" className="text-success border-success">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stat.change}
                  </Badge>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 8 Apps Grid */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Suas Plataformas</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {platformApps.map((app) => (
              <Link key={app.name} to={app.href}>
                <Card className="hover-lift cursor-pointer transition-all duration-300 hover:shadow-lg group">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${app.bgColor} transition-transform group-hover:scale-110`}>
                        <app.icon className="h-6 w-6 text-white" />
                      </div>
                      <Badge 
                        variant="outline" 
                        className={app.status === "active" ? "text-success border-success" : "text-muted-foreground border-muted"}
                      >
                        {app.status === "active" ? "Ativo" : "Configurar"}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{app.name}</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold">{app.metrics.main}</span>
                      <span className="text-sm text-muted-foreground">{app.metrics.label}</span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <Badge 
                        variant="secondary" 
                        className={app.metrics.trend === "up" ? "text-success bg-success/10" : "text-destructive bg-destructive/10"}
                      >
                        {app.metrics.trend === "up" ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                        {app.metrics.change}
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Chart + AI Insights */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Activity Chart */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Atividade Geral</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={overviewData}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }} 
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorTotal)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Insights IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                <p className="text-sm font-medium text-success">📈 TikTok Shop</p>
                <p className="text-xs text-muted-foreground mt-1">Vendas 12.5% acima da média. Continue investindo em vídeos curtos.</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm font-medium text-primary">💬 WhatsApp</p>
                <p className="text-xs text-muted-foreground mt-1">Taxa de resposta de 94%. Ative o chatbot IA para escalar atendimento.</p>
              </div>
              <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                <p className="text-sm font-medium text-warning">⚠️ Instagram</p>
                <p className="text-xs text-muted-foreground mt-1">Configure a integração para começar a monitorar métricas.</p>
              </div>
              <Button variant="outline" className="w-full mt-2">
                Ver Todos os Insights
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </FastMossLayout>
  );
}
