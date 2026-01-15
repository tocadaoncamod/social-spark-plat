import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { WhatsAppLayout } from '@/components/whatsapp/WhatsAppLayout';
import { InstanceCard } from '@/components/whatsapp/InstanceCard';
import { QRCodeModal } from '@/components/whatsapp/QRCodeModal';
import { useCreateInstance, useDeleteInstance, useGetQRCode, useLogoutInstance, useCheckInstanceStatus, useSyncWithEvolution } from '@/hooks/useWhatsAppInstances';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, RefreshCw, Smartphone, RefreshCcw, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WhatsAppInstance {
  id: string;
  instance_name: string;
  phone_number: string | null;
  display_name: string | null;
  status: string;
  is_active: boolean | null;
  api_key: string | null;
  evolution_url: string | null;
}

export default function WhatsAppInstances() {
  const { user } = useAuth();
  const [instances, setInstances] = useState<WhatsAppInstance[]>([]);
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newInstanceName, setNewInstanceName] = useState('');
  const [hasSynced, setHasSynced] = useState(false);
  const { toast } = useToast();
  
  const createInstance = useCreateInstance();
  const deleteInstance = useDeleteInstance();
  const getQRCode = useGetQRCode();
  const logoutInstance = useLogoutInstance();
  const checkStatus = useCheckInstanceStatus();
  const syncWithEvolution = useSyncWithEvolution();

  const fetchInstances = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('whatsapp_instances')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching instances:', error);
      toast({
        title: "Erro ao carregar instâncias",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setInstances(data || []);
    }
    setLoading(false);
  }, [user, toast]);

  // Auto-sync on first load
  useEffect(() => {
    if (user && !hasSynced) {
      setHasSynced(true);
      // Sync with Evolution API silently on first load
      syncWithEvolution.mutateAsync().then(() => {
        fetchInstances();
      }).catch((err) => {
        console.error('Auto-sync error:', err);
        fetchInstances();
      });
    }
  }, [user, hasSynced]);

  // Polling para verificar status quando aguardando conexão
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (showQRCode && selectedInstanceId) {
      interval = setInterval(async () => {
        try {
          const result = await checkStatus.mutateAsync(selectedInstanceId);
          if (result.status === 'connected') {
            setShowQRCode(false);
            setQrCode(null);
            setIsConnecting(false);
            fetchInstances();
            toast({
              title: "WhatsApp conectado!",
              description: "Instância conectada com sucesso.",
            });
          }
        } catch (error) {
          console.error('Error checking status:', error);
        }
      }, 3000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showQRCode, selectedInstanceId]);

  const handleSync = async () => {
    try {
      await syncWithEvolution.mutateAsync();
      await fetchInstances();
    } catch (error) {
      console.error('Sync error:', error);
    }
  };

  const handleCreateInstance = async () => {
    if (!newInstanceName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Digite um nome para a instância",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await createInstance.mutateAsync(newInstanceName);
      setNewInstanceName('');
      setDialogOpen(false);
      fetchInstances();
    } catch (error) {
      console.error('Error creating instance:', error);
    }
  };

  const handleConnect = async (instanceId: string) => {
    setSelectedInstanceId(instanceId);
    setIsConnecting(true);
    
    try {
      const result = await getQRCode.mutateAsync(instanceId);
      console.log('QR Code result:', result);
      
      if (result.qrCode) {
        // Remover prefixo duplicado se existir
        let qrCodeData = result.qrCode;
        if (qrCodeData.startsWith('data:image')) {
          // Já tem o prefixo, não adicionar novamente
          setQrCode(qrCodeData);
        } else {
          // Adicionar prefixo base64
          setQrCode(`data:image/png;base64,${qrCodeData}`);
        }
        setShowQRCode(true);
      } else if (result.status === 'connected') {
        toast({
          title: "Já conectado",
          description: "Esta instância já está conectada.",
        });
        fetchInstances();
      } else {
        toast({
          title: "Erro ao gerar QR Code",
          description: result.message || "Tente novamente",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error getting QR code:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o QR Code",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async (instanceId: string) => {
    setSelectedInstanceId(instanceId);
    try {
      await logoutInstance.mutateAsync(instanceId);
      fetchInstances();
    } catch (error) {
      console.error('Error disconnecting:', error);
    }
  };

  const handleDelete = async (instanceId: string) => {
    try {
      await deleteInstance.mutateAsync(instanceId);
      fetchInstances();
    } catch (error) {
      console.error('Error deleting instance:', error);
    }
  };

  const handleSetActive = async (instanceId: string) => {
    if (!user) return;
    
    // First, set all instances to inactive
    await supabase
      .from('whatsapp_instances')
      .update({ is_active: false })
      .eq('user_id', user.id);

    // Then set the selected one to active
    await supabase
      .from('whatsapp_instances')
      .update({ is_active: true })
      .eq('id', instanceId);

    toast({
      title: "Instância ativada",
      description: "Esta instância agora é a padrão para envio de mensagens.",
    });
    fetchInstances();
  };

  const handleCloseQRCode = () => {
    setShowQRCode(false);
    setQrCode(null);
    setIsConnecting(false);
    fetchInstances();
  };

  const selectedInstance = instances.find(i => i.id === selectedInstanceId);

  return (
    <WhatsAppLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Smartphone className="h-8 w-8 text-primary" />
              Instâncias WhatsApp
            </h1>
            <p className="text-muted-foreground">
              Gerencie suas conexões WhatsApp via Evolution API
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleSync} 
              disabled={syncWithEvolution.isPending || loading}
              className="gap-2"
            >
              {syncWithEvolution.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4" />
              )}
              Sincronizar com Evolution
            </Button>
            <Button variant="outline" onClick={fetchInstances} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Instância
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : instances.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <Smartphone className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              Nenhuma instância encontrada
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeira Instância
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {instances.map((instance) => (
              <InstanceCard
                key={instance.id}
                instance={instance}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
                onSetActive={handleSetActive}
                onDelete={handleDelete}
                isConnecting={selectedInstanceId === instance.id && isConnecting}
                isDeleting={deleteInstance.isPending}
              />
            ))}
          </div>
        )}

        {/* Modal Criar Nova Instância */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateInstance();
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Use apenas letras, números e hífens (sem espaços)
                </p>
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

        <QRCodeModal
          open={showQRCode}
          qrCode={qrCode}
          instanceName={selectedInstance?.display_name || selectedInstance?.instance_name || ''}
          onClose={handleCloseQRCode}
        />
      </div>
    </WhatsAppLayout>
  );
}