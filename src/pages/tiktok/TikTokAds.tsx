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
  Megaphone, 
  Search,
  Filter,
  TrendingUp,
  DollarSign,
  Eye,
  MousePointer,
  Target,
  Play,
  Download
} from "lucide-react";
import { useTikTokConnection } from "@/contexts/TikTokConnectionContext";

const mockAds = [
  { 
    id: 1, 
    thumbnail: "/placeholder.svg", 
    title: "Kit Skincare Completo - Oferta Especial!", 
    advertiser: "Beauty Store BR",
    spend: 15000,
    impressions: 850000,
    clicks: 42500,
    ctr: 5.0,
    roas: 4.2,
    conversions: 1250,
    category: "Beleza"
  },
  { 
    id: 2, 
    thumbnail: "/placeholder.svg", 
    title: "Fone Bluetooth - Qualidade Premium", 
    advertiser: "Tech Zone",
    spend: 12000,
    impressions: 720000,
    clicks: 36000,
    ctr: 5.0,
    roas: 3.8,
    conversions: 980,
    category: "Eletrônicos"
  },
  { 
    id: 3, 
    thumbnail: "/placeholder.svg", 
    title: "Vestido Verão - Tendência 2024", 
    advertiser: "Fashion House",
    spend: 8500,
    impressions: 580000,
    clicks: 29000,
    ctr: 5.0,
    roas: 3.5,
    conversions: 720,
    category: "Moda"
  },
  { 
    id: 4, 
    thumbnail: "/placeholder.svg", 
    title: "Organizador Multiuso - Casa Organizada", 
    advertiser: "Home Decor Plus",
    spend: 6200,
    impressions: 420000,
    clicks: 21000,
    ctr: 5.0,
    roas: 3.2,
    conversions: 520,
    category: "Casa"
  },
];

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export default function TikTokAds() {
  const { isConnected } = useTikTokConnection();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("roas");

  const filteredAds = mockAds
    .filter(ad => 
      ad.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (category === "all" || ad.category === category)
    )
    .sort((a, b) => {
      if (sortBy === "roas") return b.roas - a.roas;
      if (sortBy === "spend") return b.spend - a.spend;
      if (sortBy === "conversions") return b.conversions - a.conversions;
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
              <Megaphone className="h-6 w-6" />
              Ads E-commerce
            </h1>
            <p className="text-muted-foreground">
              Análise de anúncios do TikTok Shop
            </p>
          </div>

          <TikTokConnectionBanner showSyncButton onSync={() => {}} />

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-5">
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">R$ 41.7K</div>
                <p className="text-xs text-muted-foreground">Gasto Total (7d)</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">2.57M</div>
                <p className="text-xs text-muted-foreground">Impressões</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">128K</div>
                <p className="text-xs text-muted-foreground">Cliques</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-success">3.7x</div>
                <p className="text-xs text-muted-foreground">ROAS Médio</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">3.47K</div>
                <p className="text-xs text-muted-foreground">Conversões</p>
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
                    placeholder="Buscar anúncios..." 
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
                    <SelectItem value="Eletrônicos">Eletrônicos</SelectItem>
                    <SelectItem value="Moda">Moda</SelectItem>
                    <SelectItem value="Casa">Casa</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Ordenar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="roas">Melhor ROAS</SelectItem>
                    <SelectItem value="spend">Maior Gasto</SelectItem>
                    <SelectItem value="conversions">Mais Conversões</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Ads Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {filteredAds.map((ad) => (
              <Card key={ad.id} className="overflow-hidden">
                <div className="flex">
                  <div className="w-48 aspect-[9/16] bg-muted relative group">
                    <img 
                      src={ad.thumbnail} 
                      alt={ad.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button size="sm" variant="secondary">
                        <Play className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                    </div>
                    <Badge className="absolute top-2 left-2">{ad.category}</Badge>
                  </div>
                  <CardContent className="flex-1 p-4">
                    <h3 className="font-medium line-clamp-2 mb-2">{ad.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{ad.advertiser}</p>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">R$ {formatNumber(ad.spend)}</p>
                          <p className="text-xs text-muted-foreground">Gasto</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{formatNumber(ad.impressions)}</p>
                          <p className="text-xs text-muted-foreground">Impressões</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MousePointer className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{ad.ctr}%</p>
                          <p className="text-xs text-muted-foreground">CTR</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{ad.conversions}</p>
                          <p className="text-xs text-muted-foreground">Conversões</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-3 rounded-lg bg-success/10 border border-success/20">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-success font-medium">ROAS</span>
                        <span className="text-lg font-bold text-success flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          {ad.roas}x
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </TikTokShopLayout>
  );
}
