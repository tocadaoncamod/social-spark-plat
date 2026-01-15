import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Store, 
  ShoppingBag, 
  Users, 
  Send, 
  Sparkles,
  MessageCircle,
  Clock,
  Image as ImageIcon,
  AlertCircle,
  Calendar,
  Zap
} from "lucide-react";
import { LeadScraperLead } from "@/hooks/useLeadScraper";

interface AutoMessageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leads: LeadScraperLead[];
  onSend: (config: AutoMessageConfig) => void;
  onSchedule?: (config: AutoMessageConfig) => void;
  isLoading?: boolean;
  campaignId?: string;
}

export interface AutoMessageConfig {
  messages: {
    atacadista: string;
    varejista: string;
    comprador: string;
  };
  mediaUrl?: string;
  mediaType?: string;
  delayMin: number;
  delayMax: number;
  sendToAll: boolean;
  selectedTypes: string[];
  // Scheduling
  isScheduled?: boolean;
  scheduledFor?: string;
  scheduledTime?: string;
}

const defaultMessages = {
  atacadista: `Olá {nome}! 👋

Vi que você trabalha com *moda atacado* e gostaria de apresentar nossa coleção exclusiva!

🏭 *Somos fabricantes* com preços especiais para lojistas
📦 Pedido mínimo a partir de 6 peças
🚚 Enviamos para todo Brasil
💳 Pagamento facilitado

Posso enviar nosso catálogo completo? 📱`,

  varejista: `Oi {nome}! ✨

Percebi que você tem uma loja de moda incrível!

Temos *novidades fresquinhas* direto da fábrica:
👗 Moda feminina
👔 Moda masculina  
👶 Moda infantil
💎 Acessórios

🔥 *Condições especiais* para revendedores!

Quer conhecer nossa linha? Mando o catálogo! 📲`,

  comprador: `Olá {nome}! 💕

Vi seu interesse em *moda* e queria te mostrar nossas novidades!

✨ Peças exclusivas e estilosas
💰 Preços que cabem no bolso
🚚 Entrega rápida
🎁 Promoções especiais

Quer ver nosso catálogo? Te mando agora! 😊`,
};

const leadTypeConfig = {
  "Atacadista/Fornecedor": { 
    icon: Store, 
    color: "text-blue-500 bg-blue-100 dark:bg-blue-900", 
    key: "atacadista",
    label: "Atacadistas"
  },
  "Varejista": { 
    icon: ShoppingBag, 
    color: "text-green-500 bg-green-100 dark:bg-green-900", 
    key: "varejista",
    label: "Varejistas"
  },
  "Comprador Potencial": { 
    icon: Users, 
    color: "text-purple-500 bg-purple-100 dark:bg-purple-900", 
    key: "comprador",
    label: "Compradores"
  },
};

export function AutoMessageModal({ 
  open, 
  onOpenChange, 
  leads,
  onSend,
  onSchedule,
  isLoading,
  campaignId 
}: AutoMessageModalProps) {
  const [messages, setMessages] = useState(defaultMessages);
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video" | "">("");
  const [delayRange, setDelayRange] = useState([5, 15]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["atacadista", "varejista", "comprador"]);
  const [activeTab, setActiveTab] = useState("atacadista");
  
  // Scheduling state
  const [sendMode, setSendMode] = useState<"now" | "scheduled">("now");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("10:00");
  
  // Preset times for better engagement
  const presetTimes = [
    { time: "09:00", label: "9h - Início do dia" },
    { time: "10:00", label: "10h - Maior engajamento" },
    { time: "14:00", label: "14h - Pós almoço" },
    { time: "18:00", label: "18h - Fim do expediente" },
    { time: "20:00", label: "20h - Horário nobre" },
  ];

  // Count leads by type
  const leadsByType = leads.reduce((acc, lead) => {
    const metadata = lead.source_metadata as any;
    const businessType = metadata?.business_type || "indefinido";
    const config = leadTypeConfig[businessType as keyof typeof leadTypeConfig];
    const key = config?.key || "comprador";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalSelected = selectedTypes.reduce((sum, type) => sum + (leadsByType[type] || 0), 0);

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleSend = () => {
    const config: AutoMessageConfig = {
      messages,
      mediaUrl: mediaUrl || undefined,
      mediaType: mediaType || undefined,
      delayMin: delayRange[0],
      delayMax: delayRange[1],
      sendToAll: selectedTypes.length === 3,
      selectedTypes,
      isScheduled: sendMode === "scheduled",
      scheduledFor: sendMode === "scheduled" ? scheduledDate : undefined,
      scheduledTime: sendMode === "scheduled" ? scheduledTime : undefined,
    };

    if (sendMode === "scheduled" && onSchedule) {
      onSchedule(config);
    } else {
      onSend(config);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Envio Automático por Tipo de Lead
          </DialogTitle>
          <DialogDescription>
            Personalize mensagens diferentes para atacadistas, varejistas e compradores
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Lead Type Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Selecionar tipos de leads</Label>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(leadTypeConfig).map(([type, config]) => {
                const Icon = config.icon;
                const count = leadsByType[config.key] || 0;
                const isSelected = selectedTypes.includes(config.key);
                
                return (
                  <button
                    key={config.key}
                    onClick={() => handleTypeToggle(config.key)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                      isSelected 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className={`p-2 rounded-full ${config.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-medium text-sm">{config.label}</span>
                    <Badge variant="secondary">{count} leads</Badge>
                  </button>
                );
              })}
            </div>
            <p className="text-sm text-muted-foreground">
              <MessageCircle className="h-4 w-4 inline mr-1" />
              {totalSelected} mensagens serão enviadas
            </p>
          </div>

          {/* Message Templates */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Mensagens personalizadas</Label>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="atacadista" className="gap-2">
                  <Store className="h-4 w-4" />
                  Atacado
                </TabsTrigger>
                <TabsTrigger value="varejista" className="gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Varejo
                </TabsTrigger>
                <TabsTrigger value="comprador" className="gap-2">
                  <Users className="h-4 w-4" />
                  Comprador
                </TabsTrigger>
              </TabsList>

              {(["atacadista", "varejista", "comprador"] as const).map((type) => (
                <TabsContent key={type} value={type} className="space-y-2">
                  <Textarea
                    value={messages[type]}
                    onChange={(e) => setMessages(prev => ({ ...prev, [type]: e.target.value }))}
                    rows={8}
                    placeholder={`Mensagem para ${type}...`}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use <code className="bg-muted px-1 rounded">{"{nome}"}</code> para inserir o nome do lead automaticamente
                  </p>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Media Attachment */}
          <div className="space-y-3">
            <Label className="text-base font-medium flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Mídia (opcional)
            </Label>
            <div className="grid grid-cols-4 gap-3">
              <Input
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="URL da imagem ou vídeo"
                className="col-span-3"
              />
              <select
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value as any)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Sem mídia</option>
                <option value="image">Imagem</option>
                <option value="video">Vídeo</option>
              </select>
            </div>
          </div>

          {/* Delay Settings */}
          <div className="space-y-3">
            <Label className="text-base font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Intervalo entre mensagens
            </Label>
            <div className="px-3">
              <Slider
                value={delayRange}
                onValueChange={setDelayRange}
                min={3}
                max={60}
                step={1}
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>{delayRange[0]}s mínimo</span>
                <span>{delayRange[1]}s máximo</span>
              </div>
            </div>
          </div>

          {/* Send Mode Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Quando enviar?</Label>
            <RadioGroup value={sendMode} onValueChange={(v) => setSendMode(v as "now" | "scheduled")}>
              <div className="grid grid-cols-2 gap-3">
                <label 
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    sendMode === "now" 
                      ? "border-[hsl(var(--whatsapp))] bg-[hsl(var(--whatsapp)/0.05)]" 
                      : "border-border hover:border-[hsl(var(--whatsapp)/0.5)]"
                  }`}
                >
                  <RadioGroupItem value="now" />
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-[hsl(var(--whatsapp))]" />
                    <div>
                      <p className="font-medium">Enviar agora</p>
                      <p className="text-xs text-muted-foreground">Início imediato</p>
                    </div>
                  </div>
                </label>
                <label 
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    sendMode === "scheduled" 
                      ? "border-purple-500 bg-purple-500/5" 
                      : "border-border hover:border-purple-500/50"
                  }`}
                >
                  <RadioGroupItem value="scheduled" />
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="font-medium">Agendar</p>
                      <p className="text-xs text-muted-foreground">Escolher horário</p>
                    </div>
                  </div>
                </label>
              </div>
            </RadioGroup>
          </div>

          {/* Scheduling Options */}
          {sendMode === "scheduled" && (
            <div className="space-y-4 p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data</Label>
                  <Input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    min={today}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Horário</Label>
                  <Input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm">Horários recomendados (maior engajamento)</Label>
                <div className="flex flex-wrap gap-2">
                  {presetTimes.map(({ time, label }) => (
                    <Button
                      key={time}
                      type="button"
                      variant={scheduledTime === time ? "default" : "outline"}
                      size="sm"
                      onClick={() => setScheduledTime(time)}
                      className={scheduledTime === time ? "bg-purple-500 hover:bg-purple-600" : ""}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Warning */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-yellow-600 dark:text-yellow-400">Importante</p>
              <p className="text-muted-foreground">
                Intervalos muito curtos podem resultar em bloqueio temporário do WhatsApp.
                Recomendamos mínimo de 5 segundos entre mensagens.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSend}
            disabled={
              isLoading || 
              totalSelected === 0 || 
              selectedTypes.length === 0 ||
              (sendMode === "scheduled" && !scheduledDate)
            }
            className={sendMode === "scheduled" 
              ? "bg-purple-500 hover:bg-purple-600" 
              : "bg-[hsl(var(--whatsapp))] hover:bg-[hsl(var(--whatsapp)/0.9)]"
            }
          >
            {isLoading ? (
              <>Processando...</>
            ) : sendMode === "scheduled" ? (
              <>
                <Calendar className="h-4 w-4 mr-2" />
                Agendar {totalSelected} Mensagens
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Enviar {totalSelected} Mensagens
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
