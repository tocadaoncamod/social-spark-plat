import { useState } from "react";
import { TikTokShopLayout } from "@/components/tiktok/TikTokShopLayout";
import { TikTokMarketSidebar } from "@/components/tiktok/TikTokMarketSidebar";
import { TikTokConnectionBanner } from "@/components/tiktok/TikTokConnectionBanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  Search,
  Filter,
  Grid3X3,
  List,
  Star,
  ShoppingCart,
  TrendingUp,
  Eye
} from "lucide-react";
import { useTikTokConnection } from "@/contexts/TikTokConnectionContext";

const mockProducts = [
  { id: 1, name: "Kit Skincare Vitamina C", price: 89.90, sales: 2500, rating: 4.8, image: "/placeholder.svg", category: "Beleza" },
  { id: 2, name: "Fone Bluetooth TWS Pro", price: 149.90, sales: 1800, rating: 4.6, image: "/placeholder.svg", category: "Eletrônicos" },
  { id: 3, name: "Tênis Running Ultra", price: 199.90, sales: 950, rating: 4.7, image: "/placeholder.svg", category: "Esportes" },
  { id: 4, name: "Organizador Maquiagem", price: 49.90, sales: 3200, rating: 4.5, image: "/placeholder.svg", category: "Casa" },
  { id: 5, name: "Whey Protein 1kg", price: 129.90, sales: 520, rating: 4.9, image: "/placeholder.svg", category: "Suplementos" },
  { id: 6, name: "Smartwatch Fitness", price: 299.90, sales: 420, rating: 4.4, image: "/placeholder.svg", category: "Eletrônicos" },
  { id: 7, name: "Bolsa Couro Eco", price: 159.90, sales: 680, rating: 4.6, image: "/placeholder.svg", category: "Moda" },
  { id: 8, name: "Luminária LED Touch", price: 79.90, sales: 1100, rating: 4.7, image: "/placeholder.svg", category: "Casa" },
];

export default function TikTokMarketSearch() {
  const { isConnected } = useTikTokConnection();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("sales");

  const filteredProducts = mockProducts
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (category === "all" || product.category === category) &&
      product.price >= priceRange[0] && product.price <= priceRange[1]
    )
    .sort((a, b) => {
      if (sortBy === "sales") return b.sales - a.sales;
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

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
              <Search className="h-6 w-6" />
              Busca de Produtos
            </h1>
            <p className="text-muted-foreground">
              Pesquise e analise produtos do mercado TikTok Shop
            </p>
          </div>

          <TikTokConnectionBanner showSyncButton onSync={() => {}} />

          {/* Search and Filters */}
          <Card>
            <CardContent className="py-4 space-y-4">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Buscar produtos no mercado..." 
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button>
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-4 items-center">
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

                <div className="flex items-center gap-2 min-w-[200px]">
                  <span className="text-sm text-muted-foreground">Preço:</span>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={500}
                    step={10}
                    className="w-[150px]"
                  />
                  <span className="text-sm font-medium">
                    R${priceRange[0]}-{priceRange[1]}
                  </span>
                </div>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Ordenar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Mais Vendidos</SelectItem>
                    <SelectItem value="rating">Melhor Avaliação</SelectItem>
                    <SelectItem value="price_asc">Menor Preço</SelectItem>
                    <SelectItem value="price_desc">Maior Preço</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-1 ml-auto">
                  <Button 
                    variant={viewMode === "grid" ? "secondary" : "ghost"} 
                    size="icon"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={viewMode === "list" ? "secondary" : "ghost"} 
                    size="icon"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="text-sm text-muted-foreground">
            {filteredProducts.length} produtos encontrados
          </div>

          {viewMode === "grid" ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-muted relative">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-2 right-2">{product.category}</Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium line-clamp-2 mb-2">{product.name}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="h-4 w-4 fill-warning text-warning" />
                      <span className="text-sm font-medium">{product.rating}</span>
                      <span className="text-sm text-muted-foreground">
                        ({product.sales.toLocaleString()} vendas)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">
                        R$ {product.price.toFixed(2)}
                      </span>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                {filteredProducts.map((product, idx) => (
                  <div 
                    key={product.id}
                    className={`flex items-center gap-4 p-4 ${idx !== filteredProducts.length - 1 ? 'border-b' : ''}`}
                  >
                    <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{product.name}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <Badge variant="secondary">{product.category}</Badge>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-warning text-warning" />
                          {product.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <ShoppingCart className="h-3 w-3" />
                          {product.sales.toLocaleString()} vendas
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-primary">
                        R$ {product.price.toFixed(2)}
                      </span>
                    </div>
                    <Button variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Detalhes
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </TikTokShopLayout>
  );
}
