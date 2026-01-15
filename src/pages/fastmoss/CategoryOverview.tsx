import { FastMossLayout } from "@/components/fastmoss/FastMossLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Package,
  DollarSign,
  ShoppingCart,
  ArrowUpRight,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Treemap,
} from "recharts";
import { TikTokConnectionBanner } from "@/components/fastmoss/TikTokConnectionBanner";
import { useTikTokRealData } from "@/hooks/useTikTokRealData";

const categoryData = [
  { name: "Moda Feminina", value: 35000000, growth: 15.2, products: 45000, color: "hsl(var(--chart-1))" },
  { name: "Beleza & Cosméticos", value: 28000000, growth: 22.5, products: 32000, color: "hsl(var(--chart-2))" },
  { name: "Eletrônicos", value: 22000000, growth: 8.3, products: 18000, color: "hsl(var(--chart-3))" },
  { name: "Casa & Decoração", value: 15000000, growth: 18.7, products: 25000, color: "hsl(var(--chart-4))" },
  { name: "Esportes", value: 12000000, growth: 25.1, products: 15000, color: "hsl(var(--chart-5))" },
  { name: "Saúde & Bem-estar", value: 10000000, growth: 30.2, products: 12000, color: "hsl(var(--primary))" },
  { name: "Acessórios", value: 8000000, growth: 12.4, products: 28000, color: "hsl(var(--secondary))" },
  { name: "Pet Shop", value: 6000000, growth: 45.8, products: 8000, color: "hsl(var(--tiktok))" },
];

const subcategoryData = [
  { name: "Cintas modeladoras", category: "Moda Feminina", sales: 12500, growth: 35.2 },
  { name: "Skincare", category: "Beleza", sales: 11200, growth: 28.5 },
  { name: "Fones Bluetooth", category: "Eletrônicos", sales: 9800, growth: 15.3 },
  { name: "Leggings", category: "Moda Feminina", sales: 8500, growth: 22.1 },
  { name: "Maquiagem", category: "Beleza", sales: 7900, growth: 18.7 },
];

const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `R$ ${(value / 1000000).toFixed(1)}M`;
  }
  return `R$ ${(value / 1000).toFixed(0)}K`;
};

export default function CategoryOverview() {
  const { isConnected, useRealCategories } = useTikTokRealData();
  const realCategories = useRealCategories();

  return (
    <FastMossLayout>
      <div className="space-y-6">
        {/* TikTok Connection Status */}
        <TikTokConnectionBanner />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Panorama da Categoria</h1>
            <p className="text-muted-foreground">Análise completa das categorias do TikTok Shop</p>
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

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-tiktok/10">
                  <PieChartIcon className="h-6 w-6 text-tiktok" />
                </div>
                <div>
                  <p className="text-2xl font-bold">8</p>
                  <p className="text-sm text-muted-foreground">Categorias</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-success/10">
                  <DollarSign className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">R$ 136M</p>
                  <p className="text-sm text-muted-foreground">GMV Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">183K</p>
                  <p className="text-sm text-muted-foreground">Produtos Ativos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-secondary/10">
                  <TrendingUp className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">+18.5%</p>
                  <p className="text-sm text-muted-foreground">Crescimento</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Distribuição por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Growth */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Crescimento por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" unit="%" />
                  <YAxis dataKey="name" type="category" width={120} className="text-xs" />
                  <Tooltip formatter={(value: number) => `${value}%`} />
                  <Bar dataKey="growth" fill="hsl(var(--tiktok))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Category Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Ranking de Categorias</CardTitle>
            <Button variant="ghost" size="sm" className="text-tiktok">
              Ver detalhes <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categoryData.map((category, index) => (
                <div
                  key={category.name}
                  className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                >
                  <div className="text-lg font-bold text-muted-foreground w-8">#{index + 1}</div>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                  <div className="flex-1">
                    <p className="font-medium">{category.name}</p>
                    <p className="text-sm text-muted-foreground">{category.products.toLocaleString()} produtos</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(category.value)}</p>
                    <Badge className={category.growth > 20 ? "bg-success/10 text-success" : "bg-primary/10 text-primary"}>
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +{category.growth}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Subcategories */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Top Subcategorias em Alta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {subcategoryData.map((sub, index) => (
                <div key={sub.name} className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                  <Badge variant="outline" className="mb-2">{sub.category}</Badge>
                  <p className="font-medium">{sub.name}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-muted-foreground">{sub.sales.toLocaleString()} vendas</span>
                    <span className="text-sm text-success font-medium">+{sub.growth}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </FastMossLayout>
  );
}
