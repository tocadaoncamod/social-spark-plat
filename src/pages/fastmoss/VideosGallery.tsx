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
  Search,
  Filter,
  Download,
  Play,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  TrendingUp,
  Video,
  Clock,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { TikTokConnectionBanner } from "@/components/fastmoss/TikTokConnectionBanner";
import { useTikTokRealData } from "@/hooks/useTikTokRealData";

const mockVideos = [
  {
    id: "1",
    thumbnail: "https://via.placeholder.com/320x180",
    title: "Testando a cinta modeladora mais vendida do TikTok!",
    creator: "@mariafitness",
    creatorAvatar: "MF",
    views: 2500000,
    likes: 185000,
    comments: 12500,
    shares: 45000,
    duration: "0:45",
    product: "Cinta Modeladora",
    sales: 12500,
    publishedAt: "2 dias atrás",
    trend: 125.5,
  },
  {
    id: "2",
    thumbnail: "https://via.placeholder.com/320x180",
    title: "Skincare coreano em 7 passos - Rotina completa",
    creator: "@beautykorean",
    creatorAvatar: "BK",
    views: 1800000,
    likes: 156000,
    comments: 8900,
    shares: 32000,
    duration: "1:20",
    product: "Kit Skincare",
    sales: 8900,
    publishedAt: "3 dias atrás",
    trend: 85.2,
  },
  {
    id: "3",
    thumbnail: "https://via.placeholder.com/320x180",
    title: "Review HONESTA do fone TWS Pro - Vale a pena?",
    creator: "@techreview",
    creatorAvatar: "TR",
    views: 1200000,
    likes: 98000,
    comments: 5600,
    shares: 18000,
    duration: "2:15",
    product: "Fone TWS Pro",
    sales: 5600,
    publishedAt: "1 semana atrás",
    trend: 45.8,
  },
  {
    id: "4",
    thumbnail: "https://via.placeholder.com/320x180",
    title: "Transformei meu quarto GAMER com essa luminária!",
    creator: "@gamersetup",
    creatorAvatar: "GS",
    views: 980000,
    likes: 87000,
    comments: 4200,
    shares: 15000,
    duration: "0:58",
    product: "Luminária LED RGB",
    sales: 4200,
    publishedAt: "5 dias atrás",
    trend: 78.3,
  },
  {
    id: "5",
    thumbnail: "https://via.placeholder.com/320x180",
    title: "Tênis ULTRA LEVE para corrida - Melhor custo benefício",
    creator: "@runnerlife",
    creatorAvatar: "RL",
    views: 750000,
    likes: 65000,
    comments: 3800,
    shares: 12000,
    duration: "1:05",
    product: "Tênis Running Pro",
    sales: 3200,
    publishedAt: "4 dias atrás",
    trend: 52.1,
  },
  {
    id: "6",
    thumbnail: "https://via.placeholder.com/320x180",
    title: "POV: Você descobriu o melhor produto para pet",
    creator: "@petlovers",
    creatorAvatar: "PL",
    views: 620000,
    likes: 58000,
    comments: 2900,
    shares: 9500,
    duration: "0:32",
    product: "Comedouro Automático",
    sales: 2100,
    publishedAt: "6 dias atrás",
    trend: 92.4,
  },
];

const formatNumber = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};

export default function VideosGallery() {
  const [searchQuery, setSearchQuery] = useState("");
  const { isConnected, useRealVideos } = useTikTokRealData();
  const realVideos = useRealVideos();

  return (
    <FastMossLayout>
      <div className="space-y-6">
        {/* TikTok Connection Status */}
        <TikTokConnectionBanner />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Galeria de Vídeos</h1>
            <p className="text-muted-foreground">Vídeos virais e materiais de sucesso no TikTok</p>
          </div>
          <Button className="bg-tiktok hover:bg-tiktok/90">
            <Sparkles className="h-4 w-4 mr-2" />
            Analisar com IA
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-tiktok/10">
                  <Video className="h-5 w-5 text-tiktok" />
                </div>
                <div>
                  <p className="text-xl font-bold">2.5M</p>
                  <p className="text-xs text-muted-foreground">Vídeos Analisados</p>
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
                  <p className="text-xl font-bold">45B</p>
                  <p className="text-xs text-muted-foreground">Views Totais</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Heart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold">3.2B</p>
                  <p className="text-xs text-muted-foreground">Likes Totais</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <TrendingUp className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-xl font-bold">12.5K</p>
                  <p className="text-xs text-muted-foreground">Virais Hoje</p>
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
                  placeholder="Buscar vídeos por título, criador, produto..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas categorias</SelectItem>
                  <SelectItem value="moda">Moda</SelectItem>
                  <SelectItem value="beleza">Beleza</SelectItem>
                  <SelectItem value="tech">Tecnologia</SelectItem>
                  <SelectItem value="fitness">Fitness</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="views">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="views">Mais visualizações</SelectItem>
                  <SelectItem value="likes">Mais likes</SelectItem>
                  <SelectItem value="sales">Mais vendas</SelectItem>
                  <SelectItem value="trend">Em alta</SelectItem>
                  <SelectItem value="recent">Mais recentes</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Videos Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockVideos.map((video) => (
            <Card key={video.id} className="overflow-hidden hover-lift cursor-pointer group">
              <div className="relative aspect-video bg-muted">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Play className="h-8 w-8 text-white fill-white" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {video.duration}
                </div>
                <Badge className="absolute top-2 left-2 bg-tiktok text-white">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{video.trend}%
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium line-clamp-2 mb-2">{video.title}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-tiktok to-primary flex items-center justify-center text-white text-xs font-bold">
                    {video.creatorAvatar}
                  </div>
                  <span className="text-sm text-muted-foreground">{video.creator}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{video.publishedAt}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {formatNumber(video.views)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    {formatNumber(video.likes)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    {formatNumber(video.comments)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Share2 className="h-4 w-4" />
                    {formatNumber(video.shares)}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">Produto</p>
                    <p className="text-sm font-medium">{video.product}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Vendas</p>
                    <p className="text-sm font-medium text-success">{formatNumber(video.sales)}</p>
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
