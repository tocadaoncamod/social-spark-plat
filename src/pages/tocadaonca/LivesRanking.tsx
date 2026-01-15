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
  Radio, 
  Search, 
  Filter, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Eye,
  Play,
  Clock,
  Star,
  ExternalLink,
  ShoppingCart
} from "lucide-react";
import { useState } from "react";

// Mock data for lives ranking
const mockLives = [
  {
    id: "1",
    streamer: "@fashionista_br",
    avatar: "https://i.pravatar.cc/150?img=1",
    title: "Mega Promoção de Verão! Roupas a partir de R$19,90",
    category: "Moda",
    viewers: 15420,
    peakViewers: 23500,
    gmv: 125890,
    orders: 856,
    duration: "3h 45min",
    products: 45,
    conversionRate: 5.5,
    status: "live",
    followers: 1250000,
  },
  {
    id: "2",
    streamer: "@techdeals_oficial",
    avatar: "https://i.pravatar.cc/150?img=2",
    title: "Celulares e Acessórios com até 70% OFF",
    category: "Eletrônicos",
    viewers: 12350,
    peakViewers: 18900,
    gmv: 289450,
    orders: 423,
    duration: "2h 30min",
    products: 28,
    conversionRate: 3.4,
    status: "live",
    followers: 890000,
  },
  {
    id: "3",
    streamer: "@beleza_natural",
    avatar: "https://i.pravatar.cc/150?img=3",
    title: "Skincare Coreano - Novidades K-Beauty",
    category: "Beleza",
    viewers: 8920,
    peakViewers: 12400,
    gmv: 78650,
    orders: 612,
    duration: "4h 15min",
    products: 32,
    conversionRate: 6.8,
    status: "live",
    followers: 650000,
  },
  {
    id: "4",
    streamer: "@fitness_pro",
    avatar: "https://i.pravatar.cc/150?img=4",
    title: "Suplementos e Equipamentos Fitness",
    category: "Esporte",
    viewers: 6540,
    peakViewers: 9800,
    gmv: 56780,
    orders: 234,
    duration: "1h 50min",
    products: 18,
    conversionRate: 3.5,
    status: "ended",
    followers: 420000,
  },
  {
    id: "5",
    streamer: "@casa_decorada",
    avatar: "https://i.pravatar.cc/150?img=5",
    title: "Decoração e Organização para sua Casa",
    category: "Casa",
    viewers: 4890,
    peakViewers: 7200,
    gmv: 34560,
    orders: 189,
    duration: "2h 10min",
    products: 25,
    conversionRate: 3.8,
    status: "ended",
    followers: 320000,
  },
  {
    id: "6",
    streamer: "@kids_store",
    avatar: "https://i.pravatar.cc/150?img=6",
    title: "Roupas Infantis - Coleção Primavera",
    category: "Infantil",
    viewers: 3450,
    peakViewers: 5600,
    gmv: 28900,
    orders: 267,
    duration: "2h 30min",
    products: 42,
    conversionRate: 7.7,
    status: "ended",
    followers: 180000,
  },
];

const categories = [
  "Todas",
  "Moda",
  "Eletrônicos",
  "Beleza",
  "Esporte",
  "Casa",
  "Infantil",
  "Alimentos",
];

export default function LivesRanking() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const filteredLives = mockLives.filter((live) => {
    const matchesSearch =
      live.streamer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      live.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Todas" || live.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" || live.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPages = Math.ceil(filteredLives.length / itemsPerPage);

  // Stats summary
  const totalGMV = mockLives.reduce((acc, live) => acc + live.gmv, 0);
  const totalViewers = mockLives.reduce((acc, live) => acc + live.viewers, 0);
  const totalOrders = mockLives.reduce((acc, live) => acc + live.orders, 0);
  const livesNow = mockLives.filter((l) => l.status === "live").length;

  return (
    <TocaDaOncaLayout>
      <div className="space-y-6">
        <TikTokConnectionBanner />

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Radio className="h-6 w-6 text-red-500" />
              Ranking de Lives
            </h1>
            <p className="text-muted-foreground">
              Acompanhe as transmissões ao vivo com melhor performance
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <Radio className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ao Vivo Agora</p>
                  <p className="text-2xl font-bold text-foreground">{livesNow}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Eye className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Espectadores</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatNumber(totalViewers)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">GMV Total</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(totalGMV)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Pedidos</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatNumber(totalOrders)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por streamer ou título..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="live">Ao Vivo</SelectItem>
                  <SelectItem value="ended">Encerradas</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Últimas 24h</SelectItem>
                  <SelectItem value="7d">Últimos 7 dias</SelectItem>
                  <SelectItem value="30d">Últimos 30 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Lives Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Lives em Destaque
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Streamer</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Espectadores</TableHead>
                  <TableHead className="text-right">Pico</TableHead>
                  <TableHead className="text-right">GMV</TableHead>
                  <TableHead className="text-right">Pedidos</TableHead>
                  <TableHead className="text-right">Conversão</TableHead>
                  <TableHead className="text-center">Duração</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLives.map((live, index) => (
                  <TableRow key={live.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={live.avatar}
                            alt={live.streamer}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          {live.status === "live" && (
                            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-red-500 rounded-full border-2 border-background animate-pulse" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {live.streamer}
                          </p>
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {live.title}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{live.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      <div className="flex items-center justify-end gap-1">
                        <Eye className="h-3 w-3 text-muted-foreground" />
                        {formatNumber(live.viewers)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatNumber(live.peakViewers)}
                    </TableCell>
                    <TableCell className="text-right font-medium text-green-600">
                      {formatCurrency(live.gmv)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatNumber(live.orders)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={live.conversionRate > 5 ? "default" : "secondary"}
                        className={
                          live.conversionRate > 5
                            ? "bg-green-500/20 text-green-600"
                            : ""
                        }
                      >
                        {live.conversionRate}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {live.duration}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {live.status === "live" ? (
                        <Badge className="bg-red-500 text-white animate-pulse">
                          <Radio className="h-3 w-3 mr-1" />
                          AO VIVO
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Encerrada</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </TocaDaOncaLayout>
  );
}
