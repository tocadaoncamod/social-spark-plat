import { WhatsAppLayout } from "@/components/whatsapp/WhatsAppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useWhatsAppInstances, useCreateInstance, useCheckInstanceStatus, useGetQRCode } from "@/hooks/useWhatsAppInstances";
import { useWhatsAppMessageStats } from "@/hooks/useWhatsAppMessages";
import { useWhatsAppLeads } from "@/hooks/useWhatsAppLeads";
import { useWhatsAppCampaigns } from "@/hooks/useWhatsAppCampaigns";
import { 
  Send, 
  MessageCircle, 
  Users, 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  XCircle,
  QrCode,
  Plus,
  RefreshCw,
  Wifi,
  WifiOff,
  Smartphone
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export default function WhatsAppDashboard() {
  const { data: instances, isLoading: loadingInstances, refetch: refetchInstances } = useWhatsAppInstances();
  const { data: messageStats, isLoading: loadingStats } = useWhatsAppMessageStats();
  const { data: leads } = useWhatsAppLeads();
  const { data: campaigns } = useWhatsAppCampaigns();
  
  const createInstance = useCreateInstance();
  const checkStatus = useCheckInstanceStatus();
  const getQRCode = useGetQRCode();
  
  const [newInstanceName, setNewInstanceName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [selectedInstance, setSelectedInstance] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);

  const handleCreateInstance = async () => {
    if (!newInstanceName.trim()) return;
    await createInstance.mutateAsync(newInstanceName);
    setNewInstanceName("");
    setDialogOpen(false);
  };

  const handleShowQR = useCallback(async (instanceId: string) => {
    setSelectedInstance(instanceId);
    const result = await getQRCode.mutateAsync(instanceId);
    
    // Verificar se já tem o prefixo data:image para evitar duplicação
    let base64Data = result?.base64 || null;
    if (base64Data && !base64Data.startsWith('data:')) {
      base64Data = `data:image/png;base64,${base64Data}`;
    }
    
    setQrCode(base64Data);
    setQrDialogOpen(true);
    
    toast.info("Escaneie o QR Code com seu WhatsApp", {
      description: "Vá em Configurações > Aparelhos conectados > Conectar aparelho"
    });
  }, [getQRCode]);

  // Auto-refresh: verificar status a cada 5 segundos quando o modal QR está aberto
  useEffect(() => {
    if (!qrDialogOpen || !selectedInstance) return;

    const interval = setInterval(async () => {
      try {
        await checkStatus.mutateAsync(selectedInstance);
        const instance = instances?.find(i => i.id === selectedInstance);
        
        if (instance?.status === 'connected') {
          setQrDialogOpen(false);
          toast.success("WhatsApp conectado com sucesso!", {
            description: "Sua instância está pronta para uso"
          });
          refetchInstances();
        }
      } catch (error) {
        // Silenciar erros de verificação automática
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [qrDialogOpen, selectedInstance, checkStatus, instances, refetchInstances]);

  const connectedInstances = instances?.filter(i => i.status === 'connected').length || 0;
  const hotLeads = leads?.filter(l => l.classification === 'hot').length || 0;
  const activeCampaigns = campaigns?.filter(c => c.status === 'running').length || 0;

  return (
    <WhatsAppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Visão geral do seu WhatsApp Marketing
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-[hsl(var(--whatsapp))] hover:bg-[hsl(var(--whatsapp))]/90">
                <Plus className="h-4 w-4" />
                Nova Instância
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Instância</DialogTitle>
                <DialogDescription>
                  Crie uma nova conexão WhatsApp para enviar mensagens
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="instanceName">Nome da Instância</Label>
                  <Input
                    id="instanceName"
                    placeholder="ex: minha-loja"
                    value={newInstanceName}
                    onChange={(e) => setNewInstanceName(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleCreateInstance}
                  disabled={!newInstanceName.trim() || createInstance.isPending}
                  className="w-full bg-[hsl(var(--whatsapp))] hover:bg-[hsl(var(--whatsapp))]/90"
                >
                  {createInstance.isPending ? "Criando..." : "Criar Instância"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {loadingStats ? (
            <>
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </>
          ) : (
            <>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[hsl(var(--whatsapp)/0.1)]">
                      <Send className="h-6 w-6 text-[hsl(var(--whatsapp))]" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{messageStats?.sentToday || 0}</p>
                      <p className="text-sm text-muted-foreground">Enviadas Hoje</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                      <MessageCircle className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{messageStats?.receivedToday || 0}</p>
                      <p className="text-sm text-muted-foreground">Recebidas Hoje</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10">
                      <TrendingUp className="h-6 w-6 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{messageStats?.deliveryRate || 0}%</p>
                      <p className="text-sm text-muted-foreground">Taxa Entrega</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10">
                      <Target className="h-6 w-6 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{hotLeads}</p>
                      <p className="text-sm text-muted-foreground">Leads Quentes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Instances & Quick Stats */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Instances */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Instâncias WhatsApp
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingInstances ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-16" />
                  ))}
                </div>
              ) : instances && instances.length > 0 ? (
                <div className="space-y-3">
                  {instances.map((instance) => (
                    <div 
                      key={instance.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          instance.status === 'connected' 
                            ? 'bg-[hsl(var(--whatsapp)/0.1)]' 
                            : 'bg-muted'
                        }`}>
                          {instance.status === 'connected' ? (
                            <Wifi className="h-5 w-5 text-[hsl(var(--whatsapp))]" />
                          ) : (
                            <WifiOff className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{instance.instance_name}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant={instance.status === 'connected' ? 'default' : 'secondary'}>
                              {instance.status === 'connected' ? 'Conectado' : 
                               instance.status === 'qr_pending' ? 'Aguardando QR' :
                               instance.status === 'connecting' ? 'Conectando...' : 'Desconectado'}
                            </Badge>
                            {instance.phone_number && (
                              <span className="text-xs text-muted-foreground">
                                {instance.phone_number}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {instance.status !== 'connected' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleShowQR(instance.id)}
                            disabled={getQRCode.isPending}
                          >
                            <QrCode className="h-4 w-4 mr-1" />
                            QR Code
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => checkStatus.mutate(instance.id)}
                          disabled={checkStatus.isPending}
                        >
                          <RefreshCw className={`h-4 w-4 ${checkStatus.isPending ? 'animate-spin' : ''}`} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                  <Smartphone className="h-12 w-12 mb-4 opacity-20" />
                  <p>Nenhuma instância criada</p>
                  <p className="text-sm">Crie uma instância para começar</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2" asChild>
                <a href="/whatsapp/send">
                  <Send className="h-4 w-4" />
                  Enviar Mensagem em Massa
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" asChild>
                <a href="/whatsapp/contacts">
                  <Users className="h-4 w-4" />
                  Gerenciar Contatos
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" asChild>
                <a href="/whatsapp/chatbot">
                  <MessageCircle className="h-4 w-4" />
                  Configurar Chatbot IA
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" asChild>
                <a href="/whatsapp/leads">
                  <Target className="h-4 w-4" />
                  Ver Leads ({leads?.length || 0})
                </a>
              </Button>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Resumo</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Instâncias conectadas</span>
                    <span className="font-medium">{connectedInstances}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Campanhas ativas</span>
                    <span className="font-medium">{activeCampaigns}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mensagens (7 dias)</span>
                    <span className="font-medium">{messageStats?.totalWeek || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxa de leitura</span>
                    <span className="font-medium">{messageStats?.readRate || 0}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Campaigns */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Campanhas Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {campaigns && campaigns.length > 0 ? (
              <div className="space-y-3">
                {campaigns.slice(0, 5).map((campaign) => (
                  <div 
                    key={campaign.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                  >
                    <div>
                      <p className="font-medium">{campaign.name}</p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{campaign.total_contacts} contatos</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                          {campaign.sent_count} enviadas
                        </span>
                        {campaign.failed_count > 0 && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <XCircle className="h-3 w-3 text-red-500" />
                              {campaign.failed_count} falhas
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <Badge variant={
                      campaign.status === 'completed' ? 'default' :
                      campaign.status === 'running' ? 'secondary' :
                      'outline'
                    }>
                      {campaign.status === 'completed' ? 'Concluída' :
                       campaign.status === 'running' ? 'Em andamento' :
                       campaign.status === 'draft' ? 'Rascunho' : campaign.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                <Send className="h-8 w-8 mb-2 opacity-20" />
                <p>Nenhuma campanha criada</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* QR Code Dialog */}
      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Escanear QR Code</DialogTitle>
            <DialogDescription>
              Abra o WhatsApp no seu celular e escaneie o código
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4 space-y-4">
            {qrCode ? (
              <>
                <img 
                  src={qrCode} 
                  alt="QR Code" 
                  className="w-64 h-64 rounded-lg border"
                />
                <p className="text-sm text-muted-foreground text-center">
                  Verificando conexão automaticamente...
                </p>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <QrCode className="h-12 w-12 mb-4 opacity-20 animate-pulse" />
                <p>Carregando QR Code...</p>
              </div>
            )}
          </div>
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              onClick={() => selectedInstance && handleShowQR(selectedInstance)}
              disabled={getQRCode.isPending}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${getQRCode.isPending ? 'animate-spin' : ''}`} />
              Atualizar QR Code
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </WhatsAppLayout>
  );
}
