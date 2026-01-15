import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Wifi, WifiOff, Loader2, Trash2, Users, MessageSquare, UsersRound, RefreshCw } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useFetchContacts, useFetchGroups, useInstanceStats } from "@/hooks/useWhatsAppInstances";

interface WhatsAppInstance {
  id: string;
  instance_name: string;
  phone_number: string | null;
  display_name: string | null;
  status: string;
  is_active: boolean | null;
}

interface InstanceStats {
  contacts: number;
  groups: number;
  chats: number;
}

interface InstanceCardProps {
  instance: WhatsAppInstance;
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
  onSetActive: (id: string) => void;
  onDelete?: (id: string) => void;
  isConnecting?: boolean;
  isDeleting?: boolean;
}

export function InstanceCard({ 
  instance, 
  onConnect, 
  onDisconnect, 
  onSetActive,
  onDelete,
  isConnecting,
  isDeleting
}: InstanceCardProps) {
  const [stats, setStats] = useState<InstanceStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const fetchContacts = useFetchContacts();
  const fetchGroups = useFetchGroups();
  const getStats = useInstanceStats();

  const statusConfig: Record<string, { variant: "default" | "destructive" | "secondary"; icon: typeof Wifi; label: string }> = {
    connected: { variant: 'default', icon: Wifi, label: 'Conectado' },
    disconnected: { variant: 'destructive', icon: WifiOff, label: 'Desconectado' },
    connecting: { variant: 'secondary', icon: Loader2, label: 'Conectando...' },
    qr_pending: { variant: 'secondary', icon: Loader2, label: 'Aguardando QR' }
  };

  const config = statusConfig[instance.status] || statusConfig.disconnected;
  const StatusIcon = config.icon;

  // Buscar estatísticas quando instância estiver conectada e ainda não tiver stats
  useEffect(() => {
    if (instance.status === 'connected' && !stats && !isLoadingStats) {
      handleRefreshStats();
    }
    
    // Reset se desconectar
    if (instance.status !== 'connected') {
      setStats(null);
    }
  }, [instance.status]);

  const handleRefreshStats = async () => {
    if (isLoadingStats) return;
    
    setIsLoadingStats(true);
    try {
      const data = await getStats.mutateAsync(instance.id);
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({ contacts: 0, groups: 0, chats: 0 });
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleSyncContacts = async () => {
    setIsSyncing(true);
    try {
      await fetchContacts.mutateAsync(instance.id);
      const data = await getStats.mutateAsync(instance.id);
      setStats(data);
    } catch (error) {
      console.error('Error syncing contacts:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSyncGroups = async () => {
    setIsSyncing(true);
    try {
      await fetchGroups.mutateAsync(instance.id);
      const data = await getStats.mutateAsync(instance.id);
      setStats(data);
    } catch (error) {
      console.error('Error syncing groups:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Card className={instance.is_active ? 'border-primary border-2' : ''}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-semibold">{instance.display_name || instance.instance_name}</h3>
              <p className="text-sm text-muted-foreground">
                {instance.phone_number || 'Sem número'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={config.variant}>
              <StatusIcon className={`h-3 w-3 mr-1 ${instance.status === 'connecting' ? 'animate-spin' : ''}`} />
              {config.label}
            </Badge>
            {onDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir Instância</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir a instância "{instance.display_name || instance.instance_name}"? 
                      Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => onDelete(instance.id)}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground">
          Instância: <code className="bg-muted px-1 py-0.5 rounded">{instance.instance_name}</code>
        </p>
        {instance.is_active && (
          <Badge variant="outline" className="border-primary text-primary">
            ⭐ Instância Ativa
          </Badge>
        )}

        {/* Stats Section - Only show when connected */}
        {instance.status === 'connected' && (
          <div className="pt-3 border-t">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Estatísticas da Instância</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={handleRefreshStats}
                disabled={isLoadingStats}
              >
                <RefreshCw className={`h-3 w-3 ${isLoadingStats ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            {isLoadingStats && !stats ? (
              <div className="flex flex-col items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="mt-2 text-sm text-muted-foreground">
                  {isSyncing ? 'Sincronizando contatos e grupos...' : 'Carregando estatísticas...'}
                </span>
              </div>
            ) : stats ? (
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-muted/50 rounded-lg p-2">
                  <Users className="h-4 w-4 mx-auto mb-1 text-blue-500" />
                  <p className="text-lg font-bold">{stats.contacts.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground">Contatos</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-2">
                  <UsersRound className="h-4 w-4 mx-auto mb-1 text-green-500" />
                  <p className="text-lg font-bold">{stats.groups.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground">Grupos</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-2">
                  <MessageSquare className="h-4 w-4 mx-auto mb-1 text-purple-500" />
                  <p className="text-lg font-bold">{stats.chats.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground">Chats</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-2">
                Clique em atualizar para ver as estatísticas
              </p>
            )}

            {/* Sync Buttons */}
            <div className="flex gap-2 mt-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 text-xs"
                onClick={handleSyncContacts}
                disabled={fetchContacts.isPending}
              >
                {fetchContacts.isPending ? (
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                ) : (
                  <Users className="h-3 w-3 mr-1" />
                )}
                Sincronizar Contatos
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 text-xs"
                onClick={handleSyncGroups}
                disabled={fetchGroups.isPending}
              >
                {fetchGroups.isPending ? (
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                ) : (
                  <UsersRound className="h-3 w-3 mr-1" />
                )}
                Sincronizar Grupos
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        {instance.status === 'connected' ? (
          <>
            {!instance.is_active && (
              <Button
                variant="outline"
                onClick={() => onSetActive(instance.id)}
                className="flex-1"
              >
                Ativar
              </Button>
            )}
            <Button
              variant="destructive"
              onClick={() => onDisconnect(instance.id)}
              className="flex-1"
            >
              Desconectar
            </Button>
          </>
        ) : (
          <Button 
            onClick={() => onConnect(instance.id)} 
            className="w-full"
            disabled={isConnecting}
          >
            {isConnecting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Conectando...
              </>
            ) : (
              'Conectar'
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}