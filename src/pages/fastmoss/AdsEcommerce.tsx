import { useState } from "react";
import { FastMossLayout } from "@/components/fastmoss/FastMossLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Megaphone,
  DollarSign,
  Eye,
  MousePointer,
  TrendingUp,
  Play,
  ExternalLink,
  Target,
  BarChart3,
  Calendar,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const performanceData = [
  { date: "01/01", spend: 45000, impressions: 2500000, clicks: 125000, conversions: 4500 },
  { date: "02/01", spend: 52000, impressions: 2800000, clicks: 145000, conversions: 5200 },
  { date: "03/01", spend: 48000, impressions: 2600000, clicks: 132000, conversions: 4800 },
  { date: "04/01", spend: 61000, impressions: 3200000, clicks: 168000, conversions: 6100 },
  { date: "05/01", spend: 58000, impressions: 3000000, clicks: 155000, conversions: 5700 },
  { date: "06/01", spend: 65000, impressions: 3400000, clicks: 178000, conversions: 6500 },
  { date: "07/01", spend: 72000, impressions: 3800000, clicks: 195000, conversions: 7200 },
];

const mockAds = [
  {
    id: "1",
    title: "Cinta Modeladora - Oferta Especial",
    thumbnail: "https://via.placeholder.com/120x160",
    advertiser: "Verde Vida Grup",
    spend: 125000,
    impressions: 8500000,
    clicks: 425000,
    ctr: 5.0,
    conversions: 18500,
    cvr: 4.4,
    roas: 4.2,
    status: "active",
    duration: 15,
  },
  {
    id: "2",
    title: "Kit Skincare Coreano - Transforme sua pele",
    thumbnail: "https://via.placeholder.com/120x160",
    advertiser: "K-Beauty Brasil",
    spend: 98000,
    impressions: 6200000,
    clicks: 320000,
    ctr: 5.2,
    conversions: 12800,
    cvr: 4.0,
    roas: 3.8,
    status: "active",
    duration: 12,
  },
  {
    id: "3",
    title: "Fone TWS Pro - Som Perfeito",
    thumbnail: "https://via.placeholder.com/120x160",
    advertiser: "Tech Store BR",
    spend: 75000,
    impressions: 4500000,
    clicks: 225000,
    ctr: 5.0,
    conversions: 8900,
    cvr: 4.0,
    roas: 3.5,
    status: "paused",
    duration: 8,
  },
  {
    id: "4",
    title: "Luminária Gamer RGB - Setup Perfeito",
    thumbnail: "https://via.placeholder.com/120x160",
    advertiser: "Gamer House",
    spend: 45000,
    impressions: 2800000,
    clicks: 154000,
    ctr: 5.5,
    conversions: 6200,
    cvr: 4.0,
    roas: 4.1,
    status: "active",
    duration: 6,
  },
];

const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `R$ ${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `R$ ${(value / 1000).toFixed(0)}K`;
  }
  return `R$ ${value}`;
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

export default function AdsEcommerce() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <FastMossLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">E-commerce Ads</h1>
            <p className="text-muted-foreground">Análise de anúncios e campanhas do TikTok Shop</p>
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
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-tiktok/10">
                  <Megaphone className="h-5 w-5 text-tiktok" />
                </div>
                <div>
                  <p className="text-xl font-bold">12.5K</p>
                  <p className="text-xs text-muted-foreground">Anúncios Ativos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <DollarSign className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-xl font-bold">R$ 8.5M</p>
                  <p className="text-xs text-muted-foreground">Investimento</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <Eye className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-xl font-bold">450M</p>
                  <p className="text-xs text-muted-foreground">Impressões</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <MousePointer className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold">5.2%</p>
                  <p className="text-xs text-muted-foreground">CTR Médio</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <Target className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-xl font-bold">3.8x</p>
                  <p className="text-xs text-muted-foreground">ROAS Médio</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Performance de Anúncios</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="spend">
              <TabsList>
                <TabsTrigger value="spend">Investimento</TabsTrigger>
                <TabsTrigger value="impressions">Impressões</TabsTrigger>
                <TabsTrigger value="clicks">Cliques</TabsTrigger>
                <TabsTrigger value="conversions">Conversões</TabsTrigger>
              </TabsList>
              <TabsContent value="spend" className="mt-4">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--tiktok))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--tiktok))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" tickFormatter={(v) => `R$${v/1000}K`} />
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }} 
                    />
                    <Area
                      type="monotone"
                      dataKey="spend"
                      stroke="hsl(var(--tiktok))"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorSpend)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[300px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar anúncios..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="paused">Pausados</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="spend">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spend">Maior investimento</SelectItem>
                  <SelectItem value="impressions">Mais impressões</SelectItem>
                  <SelectItem value="ctr">Melhor CTR</SelectItem>
                  <SelectItem value="roas">Melhor ROAS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Ads Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {mockAds.map((ad) => (
            <Card key={ad.id} className="hover-lift cursor-pointer">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="relative w-24 h-32 rounded-lg bg-muted overflow-hidden shrink-0">
                    <img src={ad.thumbnail} alt={ad.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Play className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-medium line-clamp-1">{ad.title}</h3>
                        <p className="text-sm text-muted-foreground">{ad.advertiser}</p>
                      </div>
                      <Badge
                        className={
                          ad.status === "active"
                            ? "bg-success/10 text-success"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {ad.status === "active" ? "Ativo" : "Pausado"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Investimento</p>
                        <p className="font-semibold">{formatCurrency(ad.spend)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Impressões</p>
                        <p className="font-semibold">{formatNumber(ad.impressions)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Conversões</p>
                        <p className="font-semibold">{formatNumber(ad.conversions)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">CTR</p>
                        <p className="font-semibold text-success">{ad.ctr}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">CVR</p>
                        <p className="font-semibold text-primary">{ad.cvr}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">ROAS</p>
                        <p className="font-semibold text-tiktok">{ad.roas}x</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </FastMossLayout>
  );
}
