import { useState } from "react";
import { TikTokShopLayout } from "@/components/tiktok/TikTokShopLayout";
import { TikTokMarketSidebar } from "@/components/tiktok/TikTokMarketSidebar";
import { TikTokConnectionBanner } from "@/components/tiktok/TikTokConnectionBanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Search,
  Filter,
  Download,
  ExternalLink
} from "lucide-react";
import { useTikTokConnection } from "@/contexts/TikTokConnectionContext";

const mockProducts = [
  { rank: 1, name: "Kit Skincare Vitamina C 5 em 1", category: "Beleza", gmv: 125000, units: 2500, growth: 45.2, store: "Beauty Store BR" },
  { rank: 2, name: "Fone Bluetooth TWS Pro Max", category: "Eletrônicos", gmv: 98000, units: 1800, growth: 32.1, store: "Tech Zone" },
  { rank: 3, name: "Tênis Running Ultra Leve", category: "Esportes", gmv: 87000, units: 950, growth: -5.3, store: "Sports World" },
  { rank: 4, name: "Organizador Maquiagem Acrílico", category: "Casa", gmv: 76000, units: 3200, growth: 28.7, store: "Home Decor" },
  { rank: 5, name: "Whey Protein Isolado 1kg", category: "Suplementos", gmv: 65000, units: 520, growth: 15.4, store: "Nutri Shop" },
  { rank: 6, name: "Relógio Smartwatch Fitness", category: "Eletrônicos", gmv: 58000, units: 420, growth: 22.8, store: "Tech Zone" },
  { rank: 7, name: "Bolsa Feminina Couro Eco", category: "Moda", gmv: 52000, units: 680, growth: -2.1, store: "Fashion BR" },
  { rank: 8, name: "Luminária LED Mesa Touch", category: "Casa", gmv: 48000, units: 1100, growth: 18.5, store: "Home Decor" },
];

export default function TikTokMarketProducts() {
  const { isConnected } = useTikTokConnection();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [period, setPeriod] = useState("7d");

  const filteredProducts = mockProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (category === "all" || product.category === category)
  );

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
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              Ranking de Produtos
            </h1>
            <p className="text-muted-foreground">
              Produtos mais vendidos no TikTok Shop Brasil
            </p>
          </div>

          <TikTokConnectionBanner showSyncButton onSync={() => {}} />

          {/* Filters */}
          <Card>
            <CardContent className="py-4">
              <div className="flex flex-wrap gap-4">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Buscar produtos..." 
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas Categorias</SelectItem>
                    <SelectItem value="Beleza">Beleza</SelectItem>
                    <SelectItem value="Eletrônicos">Eletrônicos</SelectItem>
                    <SelectItem value="Moda">Moda</SelectItem>
                    <SelectItem value="Casa">Casa</SelectItem>
                    <SelectItem value="Esportes">Esportes</SelectItem>
                    <SelectItem value="Suplementos">Suplementos</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1d">Últimas 24h</SelectItem>
                    <SelectItem value="7d">Últimos 7 dias</SelectItem>
                    <SelectItem value="30d">Últimos 30 dias</SelectItem>
                    <SelectItem value="90d">Últimos 90 dias</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Summary Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">R$ 609K</div>
                <p className="text-xs text-muted-foreground">GMV Total (7d)</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">11.2K</div>
                <p className="text-xs text-muted-foreground">Unidades Vendidas</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-success flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  19.4%
                </div>
                <p className="text-xs text-muted-foreground">Crescimento Médio</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-xs text-muted-foreground">Produtos Ativos</p>
              </CardContent>
            </Card>
          </div>

          {/* Products Table */}
          <Card>
            <CardHeader>
              <CardTitle>Top Produtos por GMV</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">Rank</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-right">GMV</TableHead>
                    <TableHead className="text-right">Unidades</TableHead>
                    <TableHead className="text-right">Crescimento</TableHead>
                    <TableHead>Loja</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.rank}>
                      <TableCell>
                        <Badge variant={product.rank <= 3 ? "default" : "outline"}>
                          #{product.rank}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium max-w-[250px] truncate">
                        {product.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{product.category}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        R$ {(product.gmv / 1000).toFixed(0)}K
                      </TableCell>
                      <TableCell className="text-right">
                        {product.units.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={`flex items-center justify-end gap-1 ${
                          product.growth >= 0 ? 'text-success' : 'text-destructive'
                        }`}>
                          {product.growth >= 0 ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {Math.abs(product.growth)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {product.store}
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
            </CardContent>
          </Card>
        </main>
      </div>
    </TikTokShopLayout>
  );
}
