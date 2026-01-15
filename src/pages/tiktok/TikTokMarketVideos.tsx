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
  Video, 
  Search,
  Filter,
  Play,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  TrendingUp,
  Sparkles,
  FileText
} from "lucide-react";
import { useTikTokConnection } from "@/contexts/TikTokConnectionContext";

const mockVideos = [
  { 
    id: 1, 
    thumbnail: "/placeholder.svg", 
    title: "3 truques de skincare que NINGUÉM te conta!", 
    creator: "@mariabeleza",
    views: 2500000,
    likes: 185000,
    comments: 12000,
    shares: 45000,
    category: "Beleza",
    duration: "0:45",
    trending: true
  },
  { 
    id: 2, 
    thumbnail: "/placeholder.svg", 
    title: "Esse gadget mudou minha vida! Review completo", 
    creator: "@techjoao",
    views: 1800000,
    likes: 142000,
    comments: 8500,
    shares: 32000,
    category: "Tech",
    duration: "1:20",
    trending: true
  },
  { 
    id: 3, 
    thumbnail: "/placeholder.svg", 
    title: "Treino de 10 min que QUEIMA gordura", 
    creator: "@fitcarol",
    views: 950000,
    likes: 89000,
    comments: 5200,
    shares: 18000,
    category: "Fitness",
    duration: "0:58",
    trending: false
  },
  { 
    id: 4, 
    thumbnail: "/placeholder.svg", 
    title: "Organização que vai mudar sua cozinha", 
    creator: "@casaelar",
    views: 720000,
    likes: 65000,
    comments: 3800,
    shares: 12000,
    category: "Casa",
    duration: "0:35",
    trending: false
  },
  { 
    id: 5, 
    thumbnail: "/placeholder.svg", 
    title: "Look do dia gastando MENOS de R$100", 
    creator: "@fashionlu",
    views: 580000,
    likes: 52000,
    comments: 2900,
    shares: 9500,
    category: "Moda",
    duration: "0:42",
    trending: true
  },
  { 
    id: 6, 
    thumbnail: "/placeholder.svg", 
    title: "Unboxing do novo iPhone - Vale a pena?", 
    creator: "@techmaster",
    views: 450000,
    likes: 38000,
    comments: 4200,
    shares: 7800,
    category: "Tech",
    duration: "2:15",
    trending: false
  },
];

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
  return num.toString();
}

export default function TikTokMarketVideos() {
  const { isConnected } = useTikTokConnection();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("views");

  const filteredVideos = mockVideos
    .filter(video => 
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (category === "all" || video.category === category)
    )
    .sort((a, b) => {
      if (sortBy === "views") return b.views - a.views;
      if (sortBy === "likes") return b.likes - a.likes;
      if (sortBy === "comments") return b.comments - a.comments;
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
              <Video className="h-6 w-6" />
              Galeria de Vídeos
            </h1>
            <p className="text-muted-foreground">
              Vídeos virais e tendências do TikTok Shop
            </p>
          </div>

          <TikTokConnectionBanner showSyncButton onSync={() => {}} />

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">12.4K</div>
                <p className="text-xs text-muted-foreground">Vídeos Analisados</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">8.5M</div>
                <p className="text-xs text-muted-foreground">Views Totais (7d)</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">6.2%</div>
                <p className="text-xs text-muted-foreground">Taxa Engajamento</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-success flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  32
                </div>
                <p className="text-xs text-muted-foreground">Vídeos Trending</p>
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
                    placeholder="Buscar vídeos..." 
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="Beleza">Beleza</SelectItem>
                    <SelectItem value="Tech">Tech</SelectItem>
                    <SelectItem value="Fitness">Fitness</SelectItem>
                    <SelectItem value="Moda">Moda</SelectItem>
                    <SelectItem value="Casa">Casa</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Ordenar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="views">Mais Views</SelectItem>
                    <SelectItem value="likes">Mais Likes</SelectItem>
                    <SelectItem value="comments">Mais Comentários</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Videos Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredVideos.map((video) => (
              <Card key={video.id} className="overflow-hidden group">
                <div className="aspect-[9/16] bg-muted relative">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button size="lg" variant="secondary" className="gap-2">
                      <Play className="h-5 w-5" />
                      Assistir
                    </Button>
                  </div>
                  <Badge className="absolute top-2 left-2">{video.category}</Badge>
                  {video.trending && (
                    <Badge className="absolute top-2 right-2 bg-gradient-to-r from-pink-500 to-orange-500">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium line-clamp-2 mb-2">{video.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{video.creator}</p>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {formatNumber(video.views)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {formatNumber(video.likes)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      {formatNumber(video.comments)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Share2 className="h-3 w-3" />
                      {formatNumber(video.shares)}
                    </span>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <FileText className="h-4 w-4 mr-1" />
                      Transcrever
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Sparkles className="h-4 w-4 mr-1" />
                      Gerar Script
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </TikTokShopLayout>
  );
}
