import { useTikTokConnection } from "@/contexts/TikTokConnectionContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  AlertCircle, 
  Settings, 
  RefreshCw, 
  Wifi, 
  WifiOff 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTikTokRealData } from "@/hooks/useTikTokRealData";

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
  const { isConnected, connectedApp, isLoading } = useTikTokConnection();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card className="border-muted/50 bg-muted/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-muted animate-pulse" />
            <span className="text-sm text-muted-foreground">
              Verificando conexão TikTok Shop...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isConnected && connectedApp) {
    return (
      <Card className="border-success/30 bg-success/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-full bg-success/20">
                <Wifi className="h-4 w-4 text-success" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-success">
                    API TikTok Shop Conectada
                  </span>
                  <Badge variant="outline" className="text-xs border-success/30 text-success">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Dados Reais
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  App: {connectedApp.app_name} • Mercado: {connectedApp.market || "BR"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {showSyncButton && onSync && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onSync}
                  disabled={isSyncing}
                  className="border-success/30 text-success hover:bg-success/10"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/tiktok/settings")}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-warning/30 bg-warning/5">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-full bg-warning/20">
              <WifiOff className="h-4 w-4 text-warning" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-warning">
                  API TikTok Shop Não Conectada
                </span>
                <Badge variant="outline" className="text-xs border-warning/30 text-warning">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Dados Simulados
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Conecte seu app TikTok para ver dados reais da sua loja
              </p>
            </div>
          </div>
          <Button 
            size="sm" 
            className="bg-tiktok hover:bg-tiktok/90"
            onClick={() => navigate("/tiktok/settings")}
          >
            <Settings className="h-4 w-4 mr-2" />
            Configurar API
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
