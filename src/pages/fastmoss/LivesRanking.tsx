import { useState } from "react";
import { FastMossLayout } from "@/components/fastmoss/FastMossLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Search,
  Radio,
  Users,
  DollarSign,
  ShoppingCart,
  Clock,
  TrendingUp,
  Eye,
  ExternalLink,
  Play,
  Calendar,
} from "lucide-react";
import { TikTokConnectionBanner } from "@/components/fastmoss/TikTokConnectionBanner";

const mockLives = [
  {
    id: "1",
    title: "Mega Promoção de Verão - Cintas Modeladoras",
    host: "@mariafitness",
    hostAvatar: "MF",
    status: "live",
    viewers: 45000,
    peakViewers: 78000,
    duration: "2h 45min",
    sales: 12500,
    gmv: 325000,
    products: 15,
    startedAt: "Ao vivo agora",
  },
  {
    id: "2",
    title: "Rotina Skincare ao vivo - Produtos Importados",
    host: "@beautykorean",
    hostAvatar: "BK",
    status: "live",
    viewers: 32000,
    peakViewers: 52000,
    duration: "1h 30min",
    sales: 8900,
    gmv: 245000,
    products: 12,
    startedAt: "Ao vivo agora",
  },
  {
    id: "3",
    title: "Unboxing de Tech - Os melhores gadgets de 2024",
    host: "@techreview",
    hostAvatar: "TR",
    status: "ended",
    viewers: 0,
    peakViewers: 65000,
    duration: "3h 15min",
    sales: 5600,
    gmv: 420000,
    products: 8,
    startedAt: "Terminou há 2h",
  },
  {
    id: "4",
    title: "Montando o Setup Gamer Perfeito",
    host: "@gamersetup",
    hostAvatar: "GS",
    status: "scheduled",
    viewers: 0,
    peakViewers: 0,
    duration: "-",
    sales: 0,
    gmv: 0,
    products: 20,
    startedAt: "Inicia em 2h",
  },
  {
    id: "5",
    title: "Treino + Dicas de produtos fitness",
    host: "@runnerlife",
    hostAvatar: "RL",
    status: "ended",
    viewers: 0,
    peakViewers: 35000,
    duration: "1h 45min",
    sales: 3200,
    gmv: 128000,
    products: 10,
    startedAt: "Terminou há 5h",
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

export default function LivesRanking() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <FastMossLayout>
      <div className="space-y-6">
        {/* TikTok Connection Status */}
        <TikTokConnectionBanner />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Transmissões ao Vivo</h1>
            <p className="text-muted-foreground">Ranking e análise de lives do TikTok Shop</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-destructive text-destructive-foreground animate-pulse">
              <Radio className="h-3 w-3 mr-1" />
              5 ao vivo agora
            </Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <Radio className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-xl font-bold">127</p>
                  <p className="text-xs text-muted-foreground">Lives Ativas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <Users className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-xl font-bold">1.2M</p>
                  <p className="text-xs text-muted-foreground">Viewers Totais</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-tiktok/10">
                  <ShoppingCart className="h-5 w-5 text-tiktok" />
                </div>
                <div>
                  <p className="text-xl font-bold">45.2K</p>
                  <p className="text-xs text-muted-foreground">Vendas Hoje</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold">R$ 2.8M</p>
                  <p className="text-xs text-muted-foreground">GMV Hoje</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[300px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar lives por título, host..."
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
                  <SelectItem value="live">Ao vivo</SelectItem>
                  <SelectItem value="scheduled">Agendadas</SelectItem>
                  <SelectItem value="ended">Finalizadas</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="viewers">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewers">Mais viewers</SelectItem>
                  <SelectItem value="sales">Mais vendas</SelectItem>
                  <SelectItem value="gmv">Maior GMV</SelectItem>
                  <SelectItem value="duration">Maior duração</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Lives Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Transmissão</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Viewers</TableHead>
                <TableHead className="text-center">Duração</TableHead>
                <TableHead className="text-right">Vendas</TableHead>
                <TableHead className="text-right">GMV</TableHead>
                <TableHead className="text-center">Produtos</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLives.map((live, index) => (
                <TableRow key={live.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-tiktok to-primary flex items-center justify-center text-white font-bold text-sm">
                          {live.hostAvatar}
                        </div>
                        {live.status === "live" && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-destructive rounded-full border-2 border-background animate-pulse" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium line-clamp-1 max-w-xs">{live.title}</p>
                        <p className="text-sm text-muted-foreground">{live.host}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className={
                        live.status === "live"
                          ? "bg-destructive text-destructive-foreground"
                          : live.status === "scheduled"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {live.status === "live" && <Radio className="h-3 w-3 mr-1" />}
                      {live.status === "scheduled" && <Calendar className="h-3 w-3 mr-1" />}
                      {live.status === "live" ? "Ao vivo" : live.status === "scheduled" ? "Agendada" : "Finalizada"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div>
                      <p className="font-medium">{live.status === "live" ? formatNumber(live.viewers) : "-"}</p>
                      <p className="text-xs text-muted-foreground">Pico: {formatNumber(live.peakViewers)}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{live.duration}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatNumber(live.sales)}
                  </TableCell>
                  <TableCell className="text-right font-medium text-tiktok">
                    {formatCurrency(live.gmv)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{live.products}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      {live.status === "live" ? (
                        <Play className="h-4 w-4 text-destructive" />
                      ) : (
                        <ExternalLink className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </FastMossLayout>
  );
}
