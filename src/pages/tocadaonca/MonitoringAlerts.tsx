import { TocaDaOncaLayout } from "@/components/tocadaonca/TocaDaOncaLayout";
import { TikTokConnectionBanner } from "@/components/tocadaonca/TikTokConnectionBanner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  Plus,
  TrendingUp,
  TrendingDown,
  Package,
  Store,
  Video,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Clock,
  Trash2,
  Edit2,
  Settings
} from "lucide-react";
import { useState } from "react";

const existingAlerts = [
  {
    id: 1,
    name: "Novo produto concorrente",
    type: "competitor_product",
    target: "TechStore",
    condition: "Novo produto adicionado",
    active: true,
    triggered: 3,
    lastTriggered: "Há 2 horas"
  },
  {
    id: 2,
    name: "Queda de preço significativa",
    type: "price_drop",
    target: "Categoria: Eletrônicos",
    condition: "Preço cai > 20%",
    active: true,
    triggered: 7,
    lastTriggered: "Há 30 min"
  },
  {
    id: 3,
    name: "Vídeo viral na categoria",
    type: "viral_video",
    target: "Categoria: Beleza",
    condition: "Views > 1M em 24h",
    active: true,
    triggered: 2,
    lastTriggered: "Ontem"
  },
  {
    id: 4,
    name: "Tendência emergente",
    type: "trend",
    target: "Todas categorias",
    condition: "Crescimento > 50% em 7d",
    active: false,
    triggered: 15,
    lastTriggered: "3 dias atrás"
  },
];

const recentNotifications = [
  {
    id: 1,
    title: "Novo produto detectado",
    message: "TechStore adicionou 'Fone Bluetooth Pro X' - R$ 199,90",
    type: "product",
    time: "Há 30 min",
    read: false
  },
  {
    id: 2,
    title: "Vídeo viral!",
    message: "@beauty_creator atingiu 2.5M views com review de skincare",
    type: "video",
    time: "Há 2 horas",
    read: false
  },
  {
    id: 3,
    title: "Queda de preço",
    message: "iPhone 15 Case - 35% de desconto na ConcorrenteShop",
    type: "price",
    time: "Há 4 horas",
    read: true
  },
  {
    id: 4,
    title: "Tendência: Alta",
    message: "Categoria 'Fitness' cresceu 67% esta semana",
    type: "trend",
    time: "Há 6 horas",
    read: true
  },
];

const alertTypes = [
  { value: "competitor_product", label: "Novo produto concorrente", icon: Package },
  { value: "price_drop", label: "Queda de preço", icon: DollarSign },
  { value: "viral_video", label: "Vídeo viral", icon: Video },
  { value: "store_change", label: "Mudança em loja", icon: Store },
  { value: "trend", label: "Tendência emergente", icon: TrendingUp },
];

export default function MonitoringAlerts() {
  const [showNewAlert, setShowNewAlert] = useState(false);

  return (
    <TocaDaOncaLayout>
      <div className="space-y-6">
        <TikTokConnectionBanner />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Bell className="h-6 w-6 text-amber-500" />
              <h1 className="text-2xl font-bold text-foreground">Alertas de Monitoramento</h1>
            </div>
            <p className="text-muted-foreground">Configure alertas para acompanhar concorrentes e tendências</p>
          </div>
          <Button 
            onClick={() => setShowNewAlert(true)}
            className="gap-2 bg-gradient-to-r from-amber-500 to-orange-600"
          >
            <Plus className="h-4 w-4" />
            Novo Alerta
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Bell className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-muted-foreground">Alertas ativos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">47</p>
                  <p className="text-xs text-muted-foreground">Disparados hoje</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Store className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">8</p>
                  <p className="text-xs text-muted-foreground">Lojas monitoradas</p>
                </div>
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
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-xs text-muted-foreground">Vídeos virais hoje</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Alerts List */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Seus Alertas</CardTitle>
              <CardDescription>Gerencie seus alertas de monitoramento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {existingAlerts.map((alert) => {
                const AlertIcon = alertTypes.find(t => t.value === alert.type)?.icon || Bell;
                return (
                  <div 
                    key={alert.id} 
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-amber-500/10">
                        <AlertIcon className="h-5 w-5 text-amber-500" />
                      </div>
                      <div>
                        <p className="font-medium">{alert.name}</p>
                        <p className="text-sm text-muted-foreground">{alert.target}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {alert.condition} • {alert.triggered} disparos • {alert.lastTriggered}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch checked={alert.active} />
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Recent Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Notificações Recentes</CardTitle>
                <Badge variant="outline">4 novas</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-3 rounded-lg transition-colors cursor-pointer ${
                    notification.read ? "bg-muted/30" : "bg-amber-500/10 border border-amber-500/20"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5" />
                    )}
                    <div className={notification.read ? "pl-5" : ""}>
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              <Button variant="ghost" className="w-full mt-2">
                Ver todas as notificações
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* New Alert Modal */}
        {showNewAlert && (
          <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-orange-600/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Criar Novo Alerta</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowNewAlert(false)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Nome do alerta</label>
                  <Input placeholder="Ex: Monitorar TechStore" />
                </div>
                <div>
                  <label className="text-sm font-medium">Tipo de alerta</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {alertTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon className="h-4 w-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Alvo</label>
                  <Input placeholder="Loja, categoria ou produto" />
                </div>
                <div>
                  <label className="text-sm font-medium">Condição</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Quando disparar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Novo item adicionado</SelectItem>
                      <SelectItem value="price_down">Preço diminui</SelectItem>
                      <SelectItem value="price_up">Preço aumenta</SelectItem>
                      <SelectItem value="viral">Se torna viral</SelectItem>
                      <SelectItem value="trend">Tendência detectada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowNewAlert(false)}>
                  Cancelar
                </Button>
                <Button className="bg-gradient-to-r from-amber-500 to-orange-600">
                  <Bell className="h-4 w-4 mr-2" />
                  Criar Alerta
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </TocaDaOncaLayout>
  );
}
