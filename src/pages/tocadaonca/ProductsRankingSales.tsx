import { TocaDaOncaLayout } from "@/components/tocadaonca/TocaDaOncaLayout";
import { TikTokConnectionBanner } from "@/components/tocadaonca/TikTokConnectionBanner";
import { Pagination } from "@/components/tocadaonca/Pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Download,
  ExternalLink,
  Eye,
  ShoppingCart,
  DollarSign,
  Star,
  Trophy
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

// Dados simulados de ranking
const mockProducts = Array.from({ length: 100 }, (_, i) => ({
  id: `prod-${i + 1}`,
  rank: i + 1,
  name: [
    "Proteína Whey Isolada 1kg",
    "Fone Bluetooth Premium",
    "Kit Skincare Completo",
    "Tênis Running Pro",
    "Bolsa Transversal Couro",
    "Smartwatch Fitness",
    "Perfume Importado",
    "Câmera de Segurança WiFi",
    "Ring Light Profissional",
    "Suplemento Multivitamínico"
  ][i % 10],
  image: `https://picsum.photos/seed/${i}/80/80`,
  category: ["Saúde", "Eletrônicos", "Beleza", "Moda", "Acessórios", "Tech", "Perfumaria", "Casa", "Foto/Vídeo", "Suplementos"][i % 10],
  sales7d: Math.floor(Math.random() * 15000) + 1000,
  gmv7d: Math.floor(Math.random() * 500000) + 50000,
  price: Math.floor(Math.random() * 300) + 50,
  rating: (Math.random() * 2 + 3).toFixed(1),
  reviews: Math.floor(Math.random() * 5000) + 100,
  change: Math.random() > 0.3 ? `+${Math.floor(Math.random() * 50) + 5}%` : `-${Math.floor(Math.random() * 20) + 1}%`,
  trend: Math.random() > 0.3 ? "up" : "down",
  store: ["TechStore", "FashionHub", "BeautyShop", "FitLife", "GadgetWorld"][i % 5],
  influencers: Math.floor(Math.random() * 50) + 5,
}));

export default function ProductsRankingSales() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("7d");

  const itemsPerPage = 20;
  const totalPages = Math.ceil(mockProducts.length / itemsPerPage);
  const paginatedProducts = mockProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  return (
    <TocaDaOncaLayout>
      <div className="space-y-6">
        <TikTokConnectionBanner />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-amber-500" />
              <h1 className="text-2xl font-bold text-foreground">Ranking de Vendas</h1>
            </div>
            <p className="text-muted-foreground">Top produtos por volume de vendas no TikTok Shop</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <ShoppingCart className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">2.5M+</p>
                  <p className="text-xs text-muted-foreground">Produtos analisados</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <DollarSign className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">R$ 15.6B</p>
                  <p className="text-xs text-muted-foreground">GMV total 7 dias</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">+23%</p>
                  <p className="text-xs text-muted-foreground">Crescimento médio</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <Star className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">4.5</p>
                  <p className="text-xs text-muted-foreground">Avaliação média</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar produtos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas categorias</SelectItem>
                  <SelectItem value="saude">Saúde</SelectItem>
                  <SelectItem value="eletronicos">Eletrônicos</SelectItem>
                  <SelectItem value="beleza">Beleza</SelectItem>
                  <SelectItem value="moda">Moda</SelectItem>
                  <SelectItem value="casa">Casa</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">Últimas 24h</SelectItem>
                  <SelectItem value="7d">7 dias</SelectItem>
                  <SelectItem value="30d">30 dias</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Vendas (7d)</TableHead>
                  <TableHead className="text-right">GMV (7d)</TableHead>
                  <TableHead className="text-right">Preço</TableHead>
                  <TableHead className="text-right">Avaliação</TableHead>
                  <TableHead className="text-right">Variação</TableHead>
                  <TableHead className="w-20">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProducts.map((product) => (
                  <TableRow key={product.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                        product.rank <= 3 
                          ? "bg-gradient-to-br from-amber-500 to-orange-600 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {product.rank}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium truncate max-w-[200px]">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.store}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{product.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatNumber(product.sales7d)}
                    </TableCell>
                    <TableCell className="text-right font-medium text-success">
                      {formatCurrency(product.gmv7d)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(product.price)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        <span>{product.rating}</span>
                        <span className="text-muted-foreground">({formatNumber(product.reviews)})</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge 
                        variant="secondary" 
                        className={product.trend === "up" ? "text-success bg-success/10" : "text-destructive bg-destructive/10"}
                      >
                        {product.trend === "up" ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                        {product.change}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Link to={`/products/detail/${product.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={mockProducts.length}
              itemsPerPage={itemsPerPage}
            />
          </CardContent>
        </Card>
      </div>
    </TocaDaOncaLayout>
  );
}
