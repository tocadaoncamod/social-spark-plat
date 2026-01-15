import { TocaDaOncaLayout } from "@/components/tocadaonca/TocaDaOncaLayout";
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
  Activity,
  Package,
  Video,
  Store
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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TikTokConnectionBanner } from "@/components/tocadaonca/TikTokConnectionBanner";
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
  { date: "Seg", vendas: 4200, views: 12000 },
  { date: "Ter", vendas: 3800, views: 11500 },
  { date: "Qua", vendas: 5100, views: 15000 },
  { date: "Qui", vendas: 4600, views: 14200 },
  { date: "Sex", vendas: 5800, views: 18000 },
  { date: "Sáb", vendas: 6200, views: 22000 },
  { date: "Dom", vendas: 5400, views: 19000 },
];

const categoryData = [
  { name: "Moda", value: 35, color: "#f59e0b" },
  { name: "Beleza", value: 25, color: "#ec4899" },
  { name: "Eletrônicos", value: 20, color: "#3b82f6" },
  { name: "Casa", value: 12, color: "#22c55e" },
  { name: "Outros", value: 8, color: "#8b5cf6" },
];

const overallStats = [
  { title: "Produtos Analisados", value: "2.5M+", change: "+12.5%", icon: Package, color: "text-amber-500" },
  { title: "Influenciadores", value: "450K+", change: "+8.3%", icon: Users, color: "text-success" },
  { title: "GMV Monitorado", value: "R$ 15.6B", change: "+15.7%", icon: DollarSign, color: "text-warning" },
  { title: "Vídeos Analisados", value: "8.2M+", change: "+22%", icon: Video, color: "text-secondary" },
];

const topProducts = [
  { rank: 1, name: "Proteína Whey 1kg", sales: "12.5K", gmv: "R$ 856K", change: "+45%" },
  { rank: 2, name: "Fone Bluetooth Pro", sales: "9.8K", gmv: "R$ 392K", change: "+32%" },
  { rank: 3, name: "Kit Skincare 5 em 1", sales: "8.2K", gmv: "R$ 287K", change: "+28%" },
  { rank: 4, name: "Tênis Runner X", sales: "7.1K", gmv: "R$ 568K", change: "+22%" },
  { rank: 5, name: "Bolsa Transversal", sales: "6.5K", gmv: "R$ 195K", change: "+18%" },
];

const trendingVideos = [
  { title: "Review Completo do Produto...", views: "2.3M", likes: "156K", influencer: "@fashionista" },
  { title: "Como usar em 3 passos...", views: "1.8M", likes: "98K", influencer: "@beauty.tips" },
  { title: "Unboxing surpresa...", views: "1.5M", likes: "87K", influencer: "@tech.review" },
];

export default function TocaDaOncaDashboard() {
  const { isConnected, connectedApp } = useTikTokConnection();
  const { useSyncProducts, useSyncOrders } = useTikTokRealData();
  const syncProducts = useSyncProducts();
  const syncOrders = useSyncOrders();

  const handleSync = () => {
    syncProducts.mutate();
    syncOrders.mutate();
  };

  return (
    <TocaDaOncaLayout>
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
            <p className="text-muted-foreground">Análise de mercado e inteligência competitiva</p>
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
            <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
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

        {/* Top Products + Category Distribution */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Top Products */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">🔥 Top Produtos em Alta</CardTitle>
              <Link to="/products/ranking/sales">
                <Button variant="ghost" size="sm">
                  Ver ranking completo
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topProducts.map((product) => (
                  <div key={product.rank} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold text-sm">
                      {product.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.sales} vendas • {product.gmv}</p>
                    </div>
                    <Badge variant="secondary" className="text-success bg-success/10">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {product.change}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Distribuição por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {categoryData.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span>{cat.name}</span>
                    </div>
                    <span className="font-medium">{cat.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart + Trending Videos */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Activity Chart */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Tendência de Vendas</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={overviewData}>
                  <defs>
                    <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
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
                    dataKey="vendas"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorVendas)"
                    name="Vendas"
                  />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorViews)"
                    name="Visualizações"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Trending Videos */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Video className="h-5 w-5 text-amber-500" />
                Vídeos em Alta
              </CardTitle>
              <Link to="/videos/trends">
                <Button variant="ghost" size="sm">Ver todos</Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {trendingVideos.map((video, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                  <p className="text-sm font-medium truncate">{video.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{video.influencer}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span>👁 {video.views}</span>
                    <span>❤️ {video.likes}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
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

        {/* AI Insights */}
        <Card className="bg-gradient-to-r from-amber-500/10 to-orange-600/10 border-amber-500/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Insights da IA</h3>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="p-3 rounded-lg bg-background/80">
                    <p className="text-sm font-medium text-success">📈 Oportunidade</p>
                    <p className="text-xs text-muted-foreground mt-1">Categoria "Fitness" cresceu 45% esta semana. Considere adicionar produtos nesse nicho.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-background/80">
                    <p className="text-sm font-medium text-amber-500">🔥 Tendência</p>
                    <p className="text-xs text-muted-foreground mt-1">Vídeos com unboxing estão convertendo 3x mais que reviews tradicionais.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-background/80">
                    <p className="text-sm font-medium text-primary">💡 Sugestão</p>
                    <p className="text-xs text-muted-foreground mt-1">Melhor horário para publicar: 19h-21h. Taxa de engajamento 67% maior.</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TocaDaOncaLayout>
  );
}
