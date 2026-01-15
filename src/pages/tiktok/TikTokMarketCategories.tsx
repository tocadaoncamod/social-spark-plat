import { useState } from "react";
import { TikTokShopLayout } from "@/components/tiktok/TikTokShopLayout";
import { TikTokMarketSidebar } from "@/components/tiktok/TikTokMarketSidebar";
import { TikTokConnectionBanner } from "@/components/tiktok/TikTokConnectionBanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Package, 
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  ArrowRight
} from "lucide-react";
import { useTikTokConnection } from "@/contexts/TikTokConnectionContext";
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Legend } from "recharts";

const marketShareData = [
  { name: "Beleza", value: 28, color: "#FF6B9D" },
  { name: "Moda", value: 22, color: "#9B87F5" },
  { name: "Eletrônicos", value: 18, color: "#4ADE80" },
  { name: "Casa", value: 12, color: "#38BDF8" },
  { name: "Esportes", value: 10, color: "#FBBF24" },
  { name: "Outros", value: 10, color: "#94A3B8" },
];

const categoryGrowthData = [
  { month: "Jul", Beleza: 120, Moda: 95, Eletrônicos: 80, Casa: 65 },
  { month: "Ago", Beleza: 135, Moda: 102, Eletrônicos: 88, Casa: 72 },
  { month: "Set", Beleza: 148, Moda: 115, Eletrônicos: 95, Casa: 78 },
  { month: "Out", Beleza: 162, Moda: 128, Eletrônicos: 108, Casa: 85 },
  { month: "Nov", Beleza: 185, Moda: 145, Eletrônicos: 125, Casa: 98 },
  { month: "Dez", Beleza: 210, Moda: 168, Eletrônicos: 142, Casa: 115 },
];

const topProductsByCategory = [
  { category: "Beleza", product: "Kit Skincare Vitamina C", sales: 2500, growth: 45 },
  { category: "Moda", product: "Vestido Midi Floral", sales: 1800, growth: 32 },
  { category: "Eletrônicos", product: "Fone Bluetooth TWS", sales: 1500, growth: 28 },
  { category: "Casa", product: "Organizador Acrílico", sales: 1200, growth: 22 },
  { category: "Esportes", product: "Tênis Running Pro", sales: 980, growth: 18 },
];

const seasonalityData = [
  { month: "Jan", value: 75 },
  { month: "Fev", value: 68 },
  { month: "Mar", value: 82 },
  { month: "Abr", value: 78 },
  { month: "Mai", value: 95 },
  { month: "Jun", value: 110 },
  { month: "Jul", value: 88 },
  { month: "Ago", value: 92 },
  { month: "Set", value: 105 },
  { month: "Out", value: 125 },
  { month: "Nov", value: 180 },
  { month: "Dez", value: 220 },
];

export default function TikTokMarketCategories() {
  const { isConnected } = useTikTokConnection();
  const [period, setPeriod] = useState("6m");
  const [selectedCategory, setSelectedCategory] = useState("all");

  if (!isConnected) {
    return (
      <TikTokShopLayout>
        <div className="flex">
          <TikTokMarketSidebar />
          <main className="flex-1 p-6">
            <TikTokConnectionBanner forceFullPage />
          </main>
        </div>
      </TikTokShopLayout>
    );
  }

  return (
    <TikTokShopLayout>
      <div className="flex">
        <TikTokMarketSidebar />
        <main className="flex-1 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Package className="h-6 w-6" />
                Panorama de Categorias
              </h1>
              <p className="text-muted-foreground">
                Análise de mercado por categoria do TikTok Shop
              </p>
            </div>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">Último mês</SelectItem>
                <SelectItem value="3m">Últimos 3 meses</SelectItem>
                <SelectItem value="6m">Últimos 6 meses</SelectItem>
                <SelectItem value="1y">Último ano</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <TikTokConnectionBanner showSyncButton onSync={() => {}} />

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">15</div>
                <p className="text-xs text-muted-foreground">Categorias Principais</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">R$ 125M</div>
                <p className="text-xs text-muted-foreground">GMV Total</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-success flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  28%
                </div>
                <p className="text-xs text-muted-foreground">Crescimento YoY</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">Beleza</div>
                <p className="text-xs text-muted-foreground">Categoria Líder</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Market Share Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Market Share por Categoria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                      <Pie
                        data={marketShareData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {marketShareData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-2 mt-4 justify-center">
                  {marketShareData.map((item) => (
                    <Badge 
                      key={item.name} 
                      variant="outline"
                      style={{ borderColor: item.color, color: item.color }}
                    >
                      {item.name}: {item.value}%
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Growth Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Tendência de Crescimento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={categoryGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="Beleza" stroke="#FF6B9D" strokeWidth={2} />
                      <Line type="monotone" dataKey="Moda" stroke="#9B87F5" strokeWidth={2} />
                      <Line type="monotone" dataKey="Eletrônicos" stroke="#4ADE80" strokeWidth={2} />
                      <Line type="monotone" dataKey="Casa" stroke="#38BDF8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Top Products by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Top Produtos por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProductsByCategory.map((item, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{item.category}</Badge>
                        <span className="font-medium">{item.product}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          {item.sales.toLocaleString()} vendas
                        </span>
                        <span className="flex items-center gap-1 text-success text-sm">
                          <TrendingUp className="h-3 w-3" />
                          {item.growth}%
                        </span>
                        <Button variant="ghost" size="icon">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Seasonality */}
            <Card>
              <CardHeader>
                <CardTitle>Sazonalidade do Mercado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={seasonalityData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip />
                      <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  📈 Pico de vendas: Novembro-Dezembro (Black Friday e Natal)
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </TikTokShopLayout>
  );
}
