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
  Store, 
  Search,
  Star,
  Package,
  TrendingUp,
  TrendingDown,
  Eye,
  Bell,
  Download
} from "lucide-react";
import { useTikTokConnection } from "@/contexts/TikTokConnectionContext";

const mockStores = [
  { 
    rank: 1, 
    name: "Beauty Store BR", 
    category: "Beleza",
    products: 245, 
    gmv: 1250000, 
    rating: 4.9, 
    reviews: 15420,
    growth: 35.2,
    isMonitored: true
  },
  { 
    rank: 2, 
    name: "Tech Zone", 
    category: "Eletrônicos",
    products: 189, 
    gmv: 980000, 
    rating: 4.7, 
    reviews: 12350,
    growth: 28.5,
    isMonitored: true
  },
  { 
    rank: 3, 
    name: "Fashion House", 
    category: "Moda",
    products: 520, 
    gmv: 875000, 
    rating: 4.8, 
    reviews: 18900,
    growth: -5.3,
    isMonitored: false
  },
  { 
    rank: 4, 
    name: "Home Decor Plus", 
    category: "Casa",
    products: 312, 
    gmv: 720000, 
    rating: 4.6, 
    reviews: 9800,
    growth: 18.7,
    isMonitored: false
  },
  { 
    rank: 5, 
    name: "Sports World", 
    category: "Esportes",
    products: 178, 
    gmv: 650000, 
    rating: 4.5, 
    reviews: 7500,
    growth: 22.1,
    isMonitored: true
  },
  { 
    rank: 6, 
    name: "Nutri Shop", 
    category: "Suplementos",
    products: 89, 
    gmv: 480000, 
    rating: 4.9, 
    reviews: 6200,
    growth: 42.8,
    isMonitored: false
  },
];

export default function TikTokMarketStores() {
  const { isConnected } = useTikTokConnection();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");

  const filteredStores = mockStores.filter(store => 
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (category === "all" || store.category === category)
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
              <Store className="h-6 w-6" />
              Lojas Concorrentes
            </h1>
            <p className="text-muted-foreground">
              Monitore e analise lojas do TikTok Shop
            </p>
          </div>

          <TikTokConnectionBanner showSyncButton onSync={() => {}} />

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">2,847</div>
                <p className="text-xs text-muted-foreground">Lojas Ativas</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">R$ 45M</div>
                <p className="text-xs text-muted-foreground">GMV Total (30d)</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">4.6</div>
                <p className="text-xs text-muted-foreground">Avaliação Média</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Lojas Monitoradas</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="py-4">
              <div className="flex flex-wrap gap-4">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Buscar lojas..." 
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
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stores Table */}
          <Card>
            <CardHeader>
              <CardTitle>Ranking de Lojas por GMV</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">Rank</TableHead>
                    <TableHead>Loja</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-right">Produtos</TableHead>
                    <TableHead className="text-right">GMV (30d)</TableHead>
                    <TableHead className="text-right">Avaliação</TableHead>
                    <TableHead className="text-right">Crescimento</TableHead>
                    <TableHead className="text-center">Monitorar</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStores.map((store) => (
                    <TableRow key={store.rank}>
                      <TableCell>
                        <Badge variant={store.rank <= 3 ? "default" : "outline"}>
                          #{store.rank}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                            <Store className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{store.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {store.reviews.toLocaleString()} avaliações
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{store.category}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="flex items-center justify-end gap-1">
                          <Package className="h-3 w-3 text-muted-foreground" />
                          {store.products}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        R$ {(store.gmv / 1000000).toFixed(2)}M
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="flex items-center justify-end gap-1 text-warning">
                          <Star className="h-3 w-3 fill-warning" />
                          {store.rating}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={`flex items-center justify-end gap-1 ${
                          store.growth >= 0 ? 'text-success' : 'text-destructive'
                        }`}>
                          {store.growth >= 0 ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {Math.abs(store.growth)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button 
                          variant={store.isMonitored ? "default" : "outline"} 
                          size="sm"
                          className="gap-1"
                        >
                          <Bell className={`h-3 w-3 ${store.isMonitored ? 'fill-current' : ''}`} />
                          {store.isMonitored ? "Monitorando" : "Monitorar"}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
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
