import { useState, useEffect } from "react";
import { FastMossLayout } from "@/components/fastmoss/FastMossLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  TrendingUp,
  TrendingDown,
  Bell,
  Plus,
  Search,
  Video,
  Heart,
  MessageCircle,
  Share2,
  RefreshCw,
  Zap,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TikTokConnectionBanner } from "@/components/fastmoss/TikTokConnectionBanner";

const realtimeData = [
  { time: "00:00", views: 12500, likes: 850, comments: 120 },
  { time: "00:05", views: 13200, likes: 920, comments: 135 },
  { time: "00:10", views: 14800, likes: 1050, comments: 152 },
  { time: "00:15", views: 16500, likes: 1180, comments: 178 },
  { time: "00:20", views: 18200, likes: 1320, comments: 195 },
  { time: "00:25", views: 19800, likes: 1450, comments: 215 },
  { time: "00:30", views: 21500, likes: 1580, comments: 238 },
];

const monitoredVideos = [
  {
    id: "1",
    title: "Cinta Modeladora - Review Completo",
    creator: "@mariafitness",
    views: 125000,
    viewsChange: 12500,
    likes: 8500,
    comments: 450,
    shares: 1200,
    status: "growing",
    alert: null,
  },
  {
    id: "2",
    title: "Skincare Coreano 7 Steps",
    creator: "@beautykorean",
    views: 89000,
    viewsChange: 8900,
    likes: 6200,
    comments: 320,
    shares: 890,
    status: "stable",
    alert: null,
  },
  {
    id: "3",
    title: "Fone TWS Pro - Vale a pena?",
    creator: "@techreview",
    views: 45000,
    viewsChange: -2100,
    likes: 3100,
    comments: 180,
    shares: 450,
    status: "declining",
    alert: "Queda de engajamento detectada",
  },
  {
    id: "4",
    title: "Setup Gamer Completo",
    creator: "@gamersetup",
    views: 67000,
    viewsChange: 15200,
    likes: 4800,
    comments: 280,
    shares: 720,
    status: "viral",
    alert: "Potencial viral detectado! 🔥",
  },
];

const alerts = [
  { id: "1", type: "success", message: "Vídeo 'Setup Gamer' atingiu 50K views!", time: "2 min atrás" },
  { id: "2", type: "warning", message: "Engajamento caindo em 'Fone TWS Pro'", time: "15 min atrás" },
  { id: "3", type: "info", message: "Novo comentário viral detectado", time: "32 min atrás" },
  { id: "4", type: "success", message: "Meta de 100K views atingida!", time: "1h atrás" },
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

export default function MonitoringRealtime() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdate(new Date());
    }, 1000);
  };

  return (
    <FastMossLayout>
      <div className="space-y-6">
        {/* TikTok Connection Status */}
        <TikTokConnectionBanner />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Monitoramento em Tempo Real</h1>
            <p className="text-muted-foreground">
              Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            <Button className="bg-tiktok hover:bg-tiktok/90">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Vídeo
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-tiktok/10">
                  <Eye className="h-5 w-5 text-tiktok" />
                </div>
                <div>
                  <p className="text-xl font-bold">326K</p>
                  <p className="text-xs text-muted-foreground">Views Totais</p>
                </div>
                <Badge className="ml-auto bg-success/10 text-success">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12.5%
                </Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <Heart className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-xl font-bold">22.6K</p>
                  <p className="text-xs text-muted-foreground">Likes</p>
                </div>
                <Badge className="ml-auto bg-success/10 text-success">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8.3%
                </Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <MessageCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold">1.2K</p>
                  <p className="text-xs text-muted-foreground">Comentários</p>
                </div>
                <Badge className="ml-auto bg-success/10 text-success">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +15.2%
                </Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <Video className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-xl font-bold">4</p>
                  <p className="text-xs text-muted-foreground">Monitorados</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Realtime Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Zap className="h-5 w-5 text-tiktok" />
                Performance em Tempo Real
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={realtimeData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="time" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }} 
                  />
                  <Line type="monotone" dataKey="views" stroke="hsl(var(--tiktok))" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="likes" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="comments" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Alertas Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border ${
                      alert.type === 'success' ? 'border-success/30 bg-success/5' :
                      alert.type === 'warning' ? 'border-warning/30 bg-warning/5' :
                      'border-primary/30 bg-primary/5'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {alert.type === 'success' && <CheckCircle className="h-4 w-4 text-success mt-0.5" />}
                      {alert.type === 'warning' && <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />}
                      {alert.type === 'info' && <Bell className="h-4 w-4 text-primary mt-0.5" />}
                      <div className="flex-1">
                        <p className="text-sm">{alert.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monitored Videos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Vídeos Monitorados</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar..." className="pl-10 h-9" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monitoredVideos.map((video) => (
                <div
                  key={video.id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="w-20 h-12 rounded-lg bg-muted flex items-center justify-center">
                    <Video className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{video.title}</p>
                      {video.status === 'viral' && (
                        <Badge className="bg-tiktok text-white">🔥 Viral</Badge>
                      )}
                      {video.status === 'declining' && (
                        <Badge variant="outline" className="text-warning border-warning">⚠️ Atenção</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{video.creator}</p>
                    {video.alert && (
                      <p className="text-xs text-tiktok mt-1">{video.alert}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{formatNumber(video.views)}</span>
                      </div>
                      <span className={`text-xs ${video.viewsChange > 0 ? 'text-success' : 'text-destructive'}`}>
                        {video.viewsChange > 0 ? '+' : ''}{formatNumber(video.viewsChange)}
                      </span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{formatNumber(video.likes)}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{formatNumber(video.comments)}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1">
                        <Share2 className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{formatNumber(video.shares)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </FastMossLayout>
  );
}
