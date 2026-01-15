import { useTikTokConnection } from "@/contexts/TikTokConnectionContext";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, Loader2, RefreshCw, Settings, Cat } from "lucide-react";
import { Link } from "react-router-dom";

interface TikTokConnectionBannerProps {
  showSyncButton?: boolean;
  onSync?: () => void;
  isSyncing?: boolean;
}

export function TikTokConnectionBanner({ 
  showSyncButton = false, 
  onSync,
  isSyncing = false 
}: TikTokConnectionBannerProps) {
  const { isConnected, isLoading, connectedApp } = useTikTokConnection();

  if (isLoading) {
    return (
      <Alert className="bg-muted/50 border-muted">
        <Loader2 className="h-4 w-4 animate-spin" />
        <AlertDescription className="flex items-center justify-between">
          <span>Verificando conexão com TikTok...</span>
        </AlertDescription>
      </Alert>
    );
  }

  if (isConnected && connectedApp) {
    return (
      <Alert className="bg-success/10 border-success/30">
        <CheckCircle2 className="h-4 w-4 text-success" />
        <AlertDescription className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Cat className="h-4 w-4 text-amber-500" />
            <span className="text-success font-medium">
              Conectado ao TikTok: {connectedApp.app_name}
            </span>
            <span className="text-muted-foreground text-sm">
              ({connectedApp.market || 'BR'})
            </span>
          </div>
          {showSyncButton && onSync && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onSync}
              disabled={isSyncing}
              className="border-success/30 text-success hover:bg-success/10"
            >
              {isSyncing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Sincronizar Dados
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="bg-warning/10 border-warning/30">
      <AlertCircle className="h-4 w-4 text-warning" />
      <AlertDescription className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <Cat className="h-4 w-4 text-amber-500" />
          <span className="text-warning font-medium">
            TikTok não conectado
          </span>
          <span className="text-muted-foreground text-sm">
            - Conecte sua conta para ver dados reais
          </span>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          asChild
          className="border-warning/30 text-warning hover:bg-warning/10"
        >
          <Link to="/tiktok/settings">
            <Settings className="h-4 w-4 mr-2" />
            Configurar
          </Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
}
