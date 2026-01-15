import { useState } from "react";
import { TikTokShopLayout } from "@/components/tiktok/TikTokShopLayout";
import { TikTokMarketSidebar } from "@/components/tiktok/TikTokMarketSidebar";
import { TikTokConnectionBanner } from "@/components/tiktok/TikTokConnectionBanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Radio, 
  TrendingUp, 
  Users,
  Clock,
  DollarSign,
  Eye,
  Play,
  Search
} from "lucide-react";
import { useTikTokConnection } from "@/contexts/TikTokConnectionContext";

const mockLivesActive = [
  { id: 1, streamer: "BeautyQueen_BR", title: "Mega Promoção Skincare!", viewers: 12500, gmv: 45000, duration: "2h15m", products: 8, status: "live" },
  { id: 2, streamer: "TechMaster", title: "Unboxing Gadgets Novos", viewers: 8200, gmv: 28000, duration: "1h30m", products: 12, status: "live" },
  { id: 3, streamer: "FitLife_Coach", title: "Suplementos com Desconto", viewers: 5400, gmv: 18500, duration: "45m", products: 5, status: "live" },
];

const mockLivesRanking = [
  { rank: 1, streamer: "BeautyQueen_BR", totalGmv: 850000, avgViewers: 15000, livesCount: 45, conversion: 8.5 },
  { rank: 2, streamer: "FashionDiva", totalGmv: 720000, avgViewers: 12000, livesCount: 52, conversion: 7.2 },
  { rank: 3, streamer: "TechMaster", totalGmv: 650000, avgViewers: 9500, livesCount: 38, conversion: 6.8 },
  { rank: 4, streamer: "HomeDecor_Pro", totalGmv: 520000, avgViewers: 8000, livesCount: 62, conversion: 5.9 },
  { rank: 5, streamer: "SportsFan", totalGmv: 480000, avgViewers: 7200, livesCount: 41, conversion: 6.2 },
  { rank: 6, streamer: "FitLife_Coach", totalGmv: 420000, avgViewers: 6500, livesCount: 35, conversion: 7.8 },
];

export default function TikTokMarketLives() {
  const { isConnected } = useTikTokConnection();
  const [searchTerm, setSearchTerm] = useState("");
  const [period, setPeriod] = useState("7d");

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
              <Radio className="h-6 w-6" />
              Ranking de Lives
            </h1>
            <p className="text-muted-foreground">
              Monitoramento de transmissões ao vivo do TikTok Shop
            </p>
          </div>

          <TikTokConnectionBanner showSyncButton onSync={() => {}} />

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="border-red-500/30 bg-red-500/5">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-2xl font-bold">{mockLivesActive.length}</span>
                </div>
                <p className="text-xs text-muted-foreground">Lives Ativas Agora</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">26.1K</div>
                <p className="text-xs text-muted-foreground">Viewers Totais</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">R$ 91.5K</div>
                <p className="text-xs text-muted-foreground">GMV em Andamento</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-success flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  7.3%
                </div>
                <p className="text-xs text-muted-foreground">Conversão Média</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="live" className="space-y-4">
            <TabsList>
              <TabsTrigger value="live" className="gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                Ao Vivo
              </TabsTrigger>
              <TabsTrigger value="ranking">Ranking Geral</TabsTrigger>
            </TabsList>

            <TabsContent value="live" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Radio className="h-5 w-5 text-red-500" />
                    Lives em Andamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {mockLivesActive.map((live) => (
                      <div 
                        key={live.id}
                        className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                      >
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                            {live.streamer[0]}
                          </div>
                          <Badge className="absolute -bottom-1 -right-1 bg-red-500 text-white text-[10px] px-1">
                            LIVE
                          </Badge>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{live.streamer}</h3>
                            <Badge variant="outline" className="text-xs">
                              {live.products} produtos
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{live.title}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="flex items-center gap-1 text-red-500">
                              <Users className="h-3 w-3" />
                              {live.viewers.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              R$ {(live.gmv / 1000).toFixed(1)}K
                            </span>
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {live.duration}
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" className="gap-2">
                          <Play className="h-4 w-4" />
                          Assistir
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ranking" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Top Streamers por GMV</CardTitle>
                    <Select value={period} onValueChange={setPeriod}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Período" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7d">Últimos 7 dias</SelectItem>
                        <SelectItem value="30d">Últimos 30 dias</SelectItem>
                        <SelectItem value="90d">Últimos 90 dias</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[60px]">Rank</TableHead>
                        <TableHead>Streamer</TableHead>
                        <TableHead className="text-right">GMV Total</TableHead>
                        <TableHead className="text-right">Média Viewers</TableHead>
                        <TableHead className="text-right">Lives</TableHead>
                        <TableHead className="text-right">Conversão</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockLivesRanking.map((streamer) => (
                        <TableRow key={streamer.rank}>
                          <TableCell>
                            <Badge variant={streamer.rank <= 3 ? "default" : "outline"}>
                              #{streamer.rank}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                                {streamer.streamer[0]}
                              </div>
                              {streamer.streamer}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            R$ {(streamer.totalGmv / 1000).toFixed(0)}K
                          </TableCell>
                          <TableCell className="text-right">
                            {streamer.avgViewers.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            {streamer.livesCount}
                          </TableCell>
                          <TableCell className="text-right text-success">
                            {streamer.conversion}%
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
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </TikTokShopLayout>
  );
}
