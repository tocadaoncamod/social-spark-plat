import { TocaDaOncaLayout } from "@/components/tocadaonca/TocaDaOncaLayout";
import { TikTokConnectionBanner } from "@/components/tocadaonca/TikTokConnectionBanner";
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
  Calendar, 
  Search, 
  Bell, 
  BellRing,
  Clock, 
  Users,
  Store,
  ExternalLink,
  CalendarDays,
  Eye,
  Star,
  Filter,
  Plus
} from "lucide-react";
import { useState } from "react";
import { format, addDays, addHours } from "date-fns";
import { ptBR } from "date-fns/locale";

// Mock data for scheduled lives
const scheduledLives = [
  {
    id: "1",
    streamer: "@fashionista_br",
    avatar: "https://i.pravatar.cc/150?img=1",
    title: "Black Friday Antecipada - Descontos de até 80%",
    category: "Moda",
    scheduledFor: addHours(new Date(), 2),
    expectedViewers: 25000,
    followers: 1250000,
    products: 120,
    isCompetitor: true,
    notifyEnabled: true,
    platform: "TikTok Shop",
    previousLiveGMV: 145000,
  },
  {
    id: "2",
    streamer: "@techdeals_oficial",
    avatar: "https://i.pravatar.cc/150?img=2",
    title: "Lançamento iPhone 16 Pro - Unboxing + Promoção",
    category: "Eletrônicos",
    scheduledFor: addHours(new Date(), 5),
    expectedViewers: 35000,
    followers: 890000,
    products: 45,
    isCompetitor: true,
    notifyEnabled: false,
    platform: "TikTok Shop",
    previousLiveGMV: 289000,
  },
  {
    id: "3",
    streamer: "@beleza_natural",
    avatar: "https://i.pravatar.cc/150?img=3",
    title: "Rotina Skincare Noturna + Sorteio",
    category: "Beleza",
    scheduledFor: addDays(new Date(), 1),
    expectedViewers: 15000,
    followers: 650000,
    products: 28,
    isCompetitor: false,
    notifyEnabled: true,
    platform: "TikTok Shop",
    previousLiveGMV: 78000,
  },
  {
    id: "4",
    streamer: "@fitness_pro",
    avatar: "https://i.pravatar.cc/150?img=4",
    title: "Mega Queimão - Suplementos e Equipamentos",
    category: "Esporte",
    scheduledFor: addDays(new Date(), 1),
    expectedViewers: 12000,
    followers: 420000,
    products: 35,
    isCompetitor: true,
    notifyEnabled: false,
    platform: "TikTok Shop",
    previousLiveGMV: 56000,
  },
  {
    id: "5",
    streamer: "@casa_decorada",
    avatar: "https://i.pravatar.cc/150?img=5",
    title: "Decoração de Natal - Tendências 2024",
    category: "Casa",
    scheduledFor: addDays(new Date(), 2),
    expectedViewers: 8000,
    followers: 320000,
    products: 52,
    isCompetitor: false,
    notifyEnabled: true,
    platform: "TikTok Shop",
    previousLiveGMV: 34000,
  },
  {
    id: "6",
    streamer: "@kids_store",
    avatar: "https://i.pravatar.cc/150?img=6",
    title: "Volta às Aulas - Material Escolar Completo",
    category: "Infantil",
    scheduledFor: addDays(new Date(), 3),
    expectedViewers: 6500,
    followers: 180000,
    products: 68,
    isCompetitor: true,
    notifyEnabled: false,
    platform: "TikTok Shop",
    previousLiveGMV: 28000,
  },
  {
    id: "7",
    streamer: "@gourmet_chef",
    avatar: "https://i.pravatar.cc/150?img=7",
    title: "Kit Churrasco Premium + Receitas Especiais",
    category: "Alimentos",
    scheduledFor: addDays(new Date(), 4),
    expectedViewers: 9500,
    followers: 275000,
    products: 22,
    isCompetitor: false,
    notifyEnabled: true,
    platform: "TikTok Shop",
    previousLiveGMV: 42000,
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

export default function LivesScheduled() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [filterType, setFilterType] = useState("all");
  const [notifications, setNotifications] = useState<Record<string, boolean>>(
    scheduledLives.reduce((acc, live) => ({ ...acc, [live.id]: live.notifyEnabled }), {})
  );

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

  const toggleNotification = (id: string) => {
    setNotifications((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getTimeUntil = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours < 1) return `Em ${minutes} minutos`;
    if (hours < 24) return `Em ${hours}h ${minutes}m`;
    const days = Math.floor(hours / 24);
    return `Em ${days} dia${days > 1 ? "s" : ""}`;
  };

  const filteredLives = scheduledLives.filter((live) => {
    const matchesSearch =
      live.streamer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      live.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Todas" || live.category === selectedCategory;
    const matchesFilter =
      filterType === "all" ||
      (filterType === "competitors" && live.isCompetitor) ||
      (filterType === "notified" && notifications[live.id]);
    return matchesSearch && matchesCategory && matchesFilter;
  });

  // Group by date
  const groupedByDate = filteredLives.reduce((acc, live) => {
    const dateKey = format(live.scheduledFor, "yyyy-MM-dd");
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(live);
    return acc;
  }, {} as Record<string, typeof scheduledLives>);

  const todayLives = scheduledLives.filter(
    (l) => format(l.scheduledFor, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
  ).length;

  const competitorLives = scheduledLives.filter((l) => l.isCompetitor).length;
  const notifiedLives = Object.values(notifications).filter(Boolean).length;

  return (
    <TocaDaOncaLayout>
      <div className="space-y-6">
        <TikTokConnectionBanner />

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Calendar className="h-6 w-6 text-primary" />
              Lives Agendadas
            </h1>
            <p className="text-muted-foreground">
              Monitore as transmissões agendadas dos seus concorrentes
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Adicionar Monitoramento
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <CalendarDays className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Agendadas</p>
                  <p className="text-2xl font-bold text-foreground">
                    {scheduledLives.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Hoje</p>
                  <p className="text-2xl font-bold text-foreground">{todayLives}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <Store className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Concorrentes</p>
                  <p className="text-2xl font-bold text-foreground">
                    {competitorLives}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <BellRing className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Com Alerta</p>
                  <p className="text-2xl font-bold text-foreground">
                    {notifiedLives}
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
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filtrar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="competitors">Concorrentes</SelectItem>
                  <SelectItem value="notified">Com Alerta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Scheduled Lives by Date */}
        <div className="space-y-6">
          {Object.entries(groupedByDate).map(([dateKey, lives]) => (
            <div key={dateKey}>
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" />
                {format(new Date(dateKey), "EEEE, d 'de' MMMM", { locale: ptBR })}
                <Badge variant="secondary">{lives.length} lives</Badge>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lives.map((live) => (
                  <Card
                    key={live.id}
                    className="hover:shadow-lg transition-all duration-300 overflow-hidden group"
                  >
                    <CardContent className="p-0">
                      {/* Header with time */}
                      <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <span className="font-medium text-foreground">
                            {format(live.scheduledFor, "HH:mm")}
                          </span>
                        </div>
                        <Badge
                          variant={
                            getTimeUntil(live.scheduledFor).includes("minuto")
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {getTimeUntil(live.scheduledFor)}
                        </Badge>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-4">
                        {/* Streamer info */}
                        <div className="flex items-center gap-3">
                          <img
                            src={live.avatar}
                            alt={live.streamer}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-foreground truncate">
                                {live.streamer}
                              </p>
                              {live.isCompetitor && (
                                <Badge variant="outline" className="text-red-500 border-red-500/30">
                                  Concorrente
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {formatNumber(live.followers)} seguidores
                            </p>
                          </div>
                        </div>

                        {/* Title */}
                        <p className="text-sm text-foreground line-clamp-2">
                          {live.title}
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="bg-muted/50 rounded-lg p-2">
                            <p className="text-xs text-muted-foreground">
                              Expectativa
                            </p>
                            <p className="font-medium text-foreground">
                              {formatNumber(live.expectedViewers)}
                            </p>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-2">
                            <p className="text-xs text-muted-foreground">Produtos</p>
                            <p className="font-medium text-foreground">
                              {live.products}
                            </p>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-2">
                            <p className="text-xs text-muted-foreground">
                              Última Live
                            </p>
                            <p className="font-medium text-green-600">
                              {formatCurrency(live.previousLiveGMV)}
                            </p>
                          </div>
                        </div>

                        {/* Category & Actions */}
                        <div className="flex items-center justify-between pt-2">
                          <Badge variant="secondary">{live.category}</Badge>
                          <div className="flex items-center gap-2">
                            <Button
                              variant={notifications[live.id] ? "default" : "outline"}
                              size="sm"
                              onClick={() => toggleNotification(live.id)}
                              className="gap-1"
                            >
                              {notifications[live.id] ? (
                                <>
                                  <BellRing className="h-4 w-4" />
                                  Alertar
                                </>
                              ) : (
                                <>
                                  <Bell className="h-4 w-4" />
                                  Alertar
                                </>
                              )}
                            </Button>
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </TocaDaOncaLayout>
  );
}
