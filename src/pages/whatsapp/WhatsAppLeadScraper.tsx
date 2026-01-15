import { useState } from "react";
import { WhatsAppLayout } from "@/components/whatsapp/WhatsAppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  RefreshCw, 
  Download, 
  Search, 
  Users, 
  TrendingUp,
  Target,
  ArrowLeft,
  Sparkles,
  Play,
  Loader2,
  Send,
  Calendar,
  Clock,
  Trash2,
  XCircle
} from "lucide-react";
import { 
  useLeadScraperCampaigns, 
  useLeadScraperLeads,
  useCreateCampaign, 
  useUpdateCampaign,
  useDeleteCampaign,
  useExportLeads,
  useRunStatusScraper,
  useSendAutoMessages,
  useScheduleAutoMessages,
  useScheduledAutoMessages,
  useCancelScheduledMessage,
  useDeleteScheduledMessage,
  LeadScraperCampaign 
} from "@/hooks/useLeadScraper";
import { useWhatsAppInstances } from "@/hooks/useWhatsAppInstances";
import { CampaignCard } from "@/components/lead-scraper/CampaignCard";
import { NewCampaignModal } from "@/components/lead-scraper/NewCampaignModal";
import { LeadsTable } from "@/components/lead-scraper/LeadsTable";
import { AutoMessageModal, AutoMessageConfig } from "@/components/lead-scraper/AutoMessageModal";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function WhatsAppLeadScraper() {
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isAutoMessageOpen, setIsAutoMessageOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<LeadScraperCampaign | null>(null);
  const [campaignToDelete, setCampaignToDelete] = useState<LeadScraperCampaign | null>(null);
  const [activeTab, setActiveTab] = useState("campaigns");
  
  const { data: campaigns, isLoading, refetch } = useLeadScraperCampaigns();
  const { data: leads, isLoading: isLoadingLeads, refetch: refetchLeads } = useLeadScraperLeads(selectedCampaign?.id || null);
  const { data: instances } = useWhatsAppInstances();
  const { data: scheduledMessages, refetch: refetchScheduled } = useScheduledAutoMessages();
  const createCampaign = useCreateCampaign();
  const updateCampaign = useUpdateCampaign();
  const deleteCampaign = useDeleteCampaign();
  const runScraper = useRunStatusScraper();
  const sendAutoMessages = useSendAutoMessages();
  const scheduleAutoMessages = useScheduleAutoMessages();
  const cancelScheduled = useCancelScheduledMessage();
  const deleteScheduled = useDeleteScheduledMessage();
  const { exportToCSV } = useExportLeads(selectedCampaign?.id || null);

  // Get active instance
  const activeInstance = instances?.find(i => i.status === "connected") || instances?.[0];
  
  // Filter pending scheduled messages
  const pendingScheduled = scheduledMessages?.filter(s => s.status === "pending") || [];
  
  // Stats
  const totalCampaigns = campaigns?.length || 0;
  const totalLeads = campaigns?.reduce((sum, c) => sum + (c.unique_leads || 0), 0) || 0;
  const runningCampaigns = campaigns?.filter(c => c.status === "running").length || 0;

  const handleCreateCampaign = async (data: Parameters<typeof createCampaign.mutateAsync>[0]) => {
    const campaign = await createCampaign.mutateAsync(data);
    setIsNewModalOpen(false);
    
    // Auto-run if instance is selected
    if (data.instance_id) {
      toast({
        title: "Iniciando extração...",
        description: "Buscando status do WhatsApp com IA.",
      });
      
      try {
        await runScraper.mutateAsync({
          campaignId: campaign.id,
          instanceId: data.instance_id,
          keywords: data.keywords,
          categories: (data as any).categories,
          useAI: (data as any).useAI ?? true,
        });
        
        setSelectedCampaign(campaign);
        setActiveTab("leads");
      } catch (error) {
        console.error("Scraper error:", error);
      }
    }
  };

  const handleStartCampaign = async (campaign: LeadScraperCampaign) => {
    if (!campaign.instance_id) {
      toast({
        title: "Instância não selecionada",
        description: "Selecione uma instância WhatsApp para extrair.",
        variant: "destructive",
      });
      return;
    }

    await updateCampaign.mutateAsync({ 
      id: campaign.id, 
      status: "running",
      started_at: new Date().toISOString()
    });

    const metadata = campaign.metadata as any;

    runScraper.mutate({
      campaignId: campaign.id,
      instanceId: campaign.instance_id,
      keywords: campaign.keywords,
      categories: metadata?.categories,
      useAI: metadata?.useAI ?? true,
    });
  };

  const handlePauseCampaign = async (campaign: LeadScraperCampaign) => {
    await updateCampaign.mutateAsync({ 
      id: campaign.id, 
      status: "paused" 
    });
    toast({
      title: "Campanha pausada",
      description: "A extração foi pausada.",
    });
  };

  const handleDeleteCampaign = async () => {
    if (!campaignToDelete) return;
    await deleteCampaign.mutateAsync(campaignToDelete.id);
    setCampaignToDelete(null);
    if (selectedCampaign?.id === campaignToDelete.id) {
      setSelectedCampaign(null);
    }
  };

  const handleExportCampaign = (campaign: LeadScraperCampaign) => {
    setSelectedCampaign(campaign);
    setTimeout(() => exportToCSV(), 100);
  };

  const handleViewLeads = (campaign: LeadScraperCampaign) => {
    setSelectedCampaign(campaign);
    setActiveTab("leads");
  };

  const handleAutoMessage = async (config: AutoMessageConfig) => {
    if (!leads || leads.length === 0) {
      toast({
        title: "Nenhum lead disponível",
        description: "Extraia leads primeiro antes de enviar mensagens.",
        variant: "destructive",
      });
      return;
    }

    if (!activeInstance?.id) {
      toast({
        title: "Nenhuma instância conectada",
        description: "Conecte uma instância WhatsApp para enviar mensagens.",
        variant: "destructive",
      });
      return;
    }

    await sendAutoMessages.mutateAsync({
      leads,
      config,
      instanceId: activeInstance.id,
    });
    
    setIsAutoMessageOpen(false);
  };

  const handleScheduleMessage = async (config: AutoMessageConfig) => {
    if (!leads || leads.length === 0) {
      toast({
        title: "Nenhum lead disponível",
        description: "Extraia leads primeiro antes de agendar mensagens.",
        variant: "destructive",
      });
      return;
    }

    if (!activeInstance?.id) {
      toast({
        title: "Nenhuma instância conectada",
        description: "Conecte uma instância WhatsApp para agendar mensagens.",
        variant: "destructive",
      });
      return;
    }

    await scheduleAutoMessages.mutateAsync({
      leads,
      config,
      instanceId: activeInstance.id,
      campaignId: selectedCampaign?.id,
    });
    
    setIsAutoMessageOpen(false);
  };

  return (
    <WhatsAppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Search className="h-8 w-8 text-[hsl(var(--whatsapp))]" />
              Lead Scraper
              <Sparkles className="h-5 w-5 text-purple-500" />
            </h1>
            <p className="text-muted-foreground mt-1">
              Extraia leads de moda do WhatsApp Status com classificação por IA
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            <Button 
              className="bg-[hsl(var(--whatsapp))] hover:bg-[hsl(var(--whatsapp)/0.9)]"
              onClick={() => setIsNewModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Extração
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Campanhas</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCampaigns}</div>
              <p className="text-xs text-muted-foreground">
                {runningCampaigns} em execução
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLeads}</div>
              <p className="text-xs text-muted-foreground">
                Extraídos e classificados
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média/Campanha</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[hsl(var(--whatsapp))]">
                {totalCampaigns > 0 ? Math.round(totalLeads / totalCampaigns) : 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Leads por extração
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">IA Ativa</CardTitle>
              <Sparkles className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-500">ON</div>
              <p className="text-xs text-muted-foreground">
                Classificação automática
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
            <TabsTrigger value="leads" disabled={!selectedCampaign}>
              Leads {selectedCampaign && `(${selectedCampaign.name})`}
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="gap-2">
              <Calendar className="h-4 w-4" />
              Agendados
              {pendingScheduled.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-purple-500 text-white">
                  {pendingScheduled.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : campaigns?.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="relative">
                    <Search className="h-12 w-12 text-muted-foreground mb-4" />
                    <Sparkles className="h-5 w-5 text-purple-500 absolute -top-1 -right-1" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Extraia leads do WhatsApp Status</h3>
                  <p className="text-muted-foreground text-center mb-4 max-w-md">
                    Configure palavras-chave de moda e deixe a IA classificar automaticamente 
                    atacadistas, varejistas e compradores.
                  </p>
                  <Button 
                    className="bg-[hsl(var(--whatsapp))] hover:bg-[hsl(var(--whatsapp)/0.9)]"
                    onClick={() => setIsNewModalOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeira Extração
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {campaigns?.map((campaign) => (
                  <CampaignCard
                    key={campaign.id}
                    campaign={campaign}
                    onView={handleViewLeads}
                    onStart={handleStartCampaign}
                    onPause={handlePauseCampaign}
                    onDelete={setCampaignToDelete}
                    onExport={handleExportCampaign}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="leads" className="space-y-4">
            {selectedCampaign && (
              <>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      setSelectedCampaign(null);
                      setActiveTab("campaigns");
                    }}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar
                  </Button>
                  <div className="flex gap-2 flex-wrap">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        if (selectedCampaign.instance_id) {
                          const metadata = selectedCampaign.metadata as any;
                          runScraper.mutate({
                            campaignId: selectedCampaign.id,
                            instanceId: selectedCampaign.instance_id,
                            keywords: selectedCampaign.keywords,
                            categories: metadata?.categories,
                            useAI: metadata?.useAI ?? true,
                          });
                        }
                      }}
                      disabled={runScraper.isPending || !selectedCampaign.instance_id}
                    >
                      {runScraper.isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Play className="h-4 w-4 mr-2" />
                      )}
                      Re-extrair
                    </Button>
                    <Button variant="outline" onClick={exportToCSV}>
                      <Download className="h-4 w-4 mr-2" />
                      Exportar CSV
                    </Button>
                    <Button 
                      onClick={() => setIsAutoMessageOpen(true)}
                      disabled={!leads || leads.length === 0 || !activeInstance}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Enviar por Tipo
                    </Button>
                  </div>
                </div>

                {/* Campaign Info */}
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Keywords:</span>{" "}
                        <span className="font-medium">{selectedCampaign.keywords.join(", ")}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Leads:</span>{" "}
                        <span className="font-medium">{selectedCampaign.unique_leads || 0}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Status:</span>{" "}
                        <span className="font-medium capitalize">{selectedCampaign.status}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {isLoadingLeads || runScraper.isPending ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--whatsapp))] mb-4" />
                    <p className="text-muted-foreground">
                      {runScraper.isPending ? "Extraindo e classificando leads com IA..." : "Carregando leads..."}
                    </p>
                  </div>
                ) : (
                  <LeadsTable leads={leads || []} />
                )}
              </>
            )}
          </TabsContent>

          {/* Scheduled Messages Tab */}
          <TabsContent value="scheduled" className="space-y-4">
            {pendingScheduled.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhum envio agendado</h3>
                  <p className="text-muted-foreground text-center mb-4 max-w-md">
                    Agende o envio de mensagens para seus leads em horários de maior engajamento.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingScheduled.map((scheduled) => {
                  const scheduledDate = new Date(scheduled.scheduled_for);
                  const messages = scheduled.messages as any;
                  
                  return (
                    <Card key={scheduled.id} className="border-purple-500/20">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-purple-500" />
                              <span className="font-medium">{scheduled.name}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {scheduledDate.toLocaleDateString("pt-BR")} às {scheduledDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                              </span>
                              <span>{scheduled.total_leads} leads</span>
                              <span className="flex gap-1">
                                {(scheduled.lead_types as string[])?.map((type, i) => (
                                  <span key={i} className="px-2 py-0.5 bg-muted rounded text-xs capitalize">
                                    {type}
                                  </span>
                                ))}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => cancelScheduled.mutate(scheduled.id)}
                              disabled={cancelScheduled.isPending}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Cancelar
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteScheduled.mutate(scheduled.id)}
                              disabled={deleteScheduled.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* New Campaign Modal */}
      <NewCampaignModal
        open={isNewModalOpen}
        onOpenChange={setIsNewModalOpen}
        onSubmit={handleCreateCampaign}
        isLoading={createCampaign.isPending || runScraper.isPending}
      />

      {/* Auto Message Modal */}
      <AutoMessageModal
        open={isAutoMessageOpen}
        onOpenChange={setIsAutoMessageOpen}
        leads={leads || []}
        onSend={handleAutoMessage}
        onSchedule={handleScheduleMessage}
        isLoading={sendAutoMessages.isPending || scheduleAutoMessages.isPending}
        campaignId={selectedCampaign?.id}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={!!campaignToDelete} 
        onOpenChange={(open) => !open && setCampaignToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir campanha?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Todos os leads associados a esta campanha também serão excluídos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteCampaign}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </WhatsAppLayout>
  );
}
