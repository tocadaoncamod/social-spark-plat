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
  Users, 
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  Instagram,
  Star,
  TrendingUp,
  Eye
} from "lucide-react";
import { useTikTokConnection } from "@/contexts/TikTokConnectionContext";

const mockInfluencers = [
  { 
    rank: 1, 
    name: "Maria Beleza", 
    username: "@mariabeleza", 
    followers: 1250000, 
    engagement: 8.5, 
    category: "Beleza",
    tier: "Mega",
    sales: 520000,
    hasEmail: true,
    hasPhone: true,
    hasInstagram: true
  },
  { 
    rank: 2, 
    name: "Tech João", 
    username: "@techjoao", 
    followers: 850000, 
    engagement: 7.2, 
    category: "Tecnologia",
    tier: "Macro",
    sales: 380000,
    hasEmail: true,
    hasPhone: false,
    hasInstagram: true
  },
  { 
    rank: 3, 
    name: "Fit Carol", 
    username: "@fitcarol", 
    followers: 620000, 
    engagement: 9.1, 
    category: "Fitness",
    tier: "Macro",
    sales: 290000,
    hasEmail: true,
    hasPhone: true,
    hasInstagram: true
  },
  { 
    rank: 4, 
    name: "Casa & Lar", 
    username: "@casaelar", 
    followers: 480000, 
    engagement: 6.8, 
    category: "Casa",
    tier: "Macro",
    sales: 210000,
    hasEmail: false,
    hasPhone: false,
    hasInstagram: true
  },
  { 
    rank: 5, 
    name: "Fashion Lu", 
    username: "@fashionlu", 
    followers: 350000, 
    engagement: 7.5, 
    category: "Moda",
    tier: "Mid",
    sales: 180000,
    hasEmail: true,
    hasPhone: true,
    hasInstagram: true
  },
  { 
    rank: 6, 
    name: "Gamer Pro", 
    username: "@gamerpro", 
    followers: 290000, 
    engagement: 8.2, 
    category: "Games",
    tier: "Mid",
    sales: 145000,
    hasEmail: true,
    hasPhone: false,
    hasInstagram: false
  },
];

const tierColors = {
  Mega: "bg-gradient-to-r from-yellow-400 to-orange-500 text-white",
  Macro: "bg-gradient-to-r from-purple-400 to-pink-500 text-white",
  Mid: "bg-gradient-to-r from-blue-400 to-cyan-500 text-white",
  Micro: "bg-gradient-to-r from-green-400 to-emerald-500 text-white",
  Nano: "bg-muted text-muted-foreground",
};

export default function TikTokMarketInfluencers() {
  const { isConnected } = useTikTokConnection();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [tier, setTier] = useState("all");

  const filteredInfluencers = mockInfluencers.filter(inf => 
    (inf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     inf.username.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (category === "all" || inf.category === category) &&
    (tier === "all" || inf.tier === tier)
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
              <Users className="h-6 w-6" />
              Influenciadores do Mercado
            </h1>
            <p className="text-muted-foreground">
              Encontre e analise influenciadores do TikTok Shop
            </p>
          </div>

          <TikTokConnectionBanner showSyncButton onSync={() => {}} />

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-xs text-muted-foreground">Influenciadores Ativos</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">R$ 3.8M</div>
                <p className="text-xs text-muted-foreground">GMV Total (30d)</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">7.6%</div>
                <p className="text-xs text-muted-foreground">Engajamento Médio</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-success flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  23%
                </div>
                <p className="text-xs text-muted-foreground">Crescimento Mensal</p>
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
                    placeholder="Buscar influenciadores..." 
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
                    <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                    <SelectItem value="Fitness">Fitness</SelectItem>
                    <SelectItem value="Moda">Moda</SelectItem>
                    <SelectItem value="Casa">Casa</SelectItem>
                    <SelectItem value="Games">Games</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={tier} onValueChange={setTier}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Mega">Mega (1M+)</SelectItem>
                    <SelectItem value="Macro">Macro (100K-1M)</SelectItem>
                    <SelectItem value="Mid">Mid (50K-100K)</SelectItem>
                    <SelectItem value="Micro">Micro (10K-50K)</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Influencers Table */}
          <Card>
            <CardHeader>
              <CardTitle>Top Influenciadores por Vendas</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">Rank</TableHead>
                    <TableHead>Influenciador</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-right">Seguidores</TableHead>
                    <TableHead className="text-right">Engajamento</TableHead>
                    <TableHead className="text-right">Vendas</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInfluencers.map((inf) => (
                    <TableRow key={inf.rank}>
                      <TableCell>
                        <Badge variant={inf.rank <= 3 ? "default" : "outline"}>
                          #{inf.rank}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold">
                            {inf.name[0]}
                          </div>
                          <div>
                            <p className="font-medium">{inf.name}</p>
                            <p className="text-sm text-muted-foreground">{inf.username}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={tierColors[inf.tier as keyof typeof tierColors]}>
                          {inf.tier}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{inf.category}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {inf.followers >= 1000000 
                          ? `${(inf.followers / 1000000).toFixed(1)}M`
                          : `${(inf.followers / 1000).toFixed(0)}K`
                        }
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="flex items-center justify-end gap-1 text-success">
                          <Star className="h-3 w-3" />
                          {inf.engagement}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        R$ {(inf.sales / 1000).toFixed(0)}K
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {inf.hasEmail && (
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <Mail className="h-3 w-3" />
                            </Button>
                          )}
                          {inf.hasPhone && (
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <Phone className="h-3 w-3" />
                            </Button>
                          )}
                          {inf.hasInstagram && (
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <Instagram className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
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
