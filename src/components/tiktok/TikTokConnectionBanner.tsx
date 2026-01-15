import { useTikTokConnection } from "@/contexts/TikTokConnectionContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Settings, 
  Loader2,
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TikTokConnectionBannerProps {
  showSyncButton?: boolean;
  onSync?: () => void;
  isSyncing?: boolean;
  forceFullPage?: boolean;
}

export function TikTokConnectionBanner({ 
  showSyncButton = true, 
  onSync,
  isSyncing = false,
  forceFullPage = false
}: TikTokConnectionBannerProps) {
  const { isConnected, connectedApp, isLoading } = useTikTokConnection();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card className="border-muted">
        <CardContent className="flex items-center justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Verificando conexão...</span>
        </CardContent>
      </Card>
    );
  }

  if (!isConnected) {
    if (forceFullPage) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="p-6 rounded-full bg-warning/10 mb-6">
            <AlertTriangle className="h-16 w-16 text-warning" />
          </div>
          <h2 className="text-2xl font-bold mb-2">API TikTok Não Configurada</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Para acessar os dados de análise de mercado, você precisa configurar sua API do TikTok Developer.
          </p>
          <Button size="lg" onClick={() => navigate("/tiktok/settings")}>
            <Settings className="h-5 w-5 mr-2" />
            Configurar API do TikTok
          </Button>
        </div>
      );
    }

    return (
      <Card className="border-warning bg-warning/5">
        <CardContent className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-warning/10">
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="font-medium text-warning">API não conectada</p>
              <p className="text-sm text-muted-foreground">
                Configure sua API do TikTok para dados reais
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate("/tiktok/settings")}>
            <Settings className="h-4 w-4 mr-2" />
            Configurar
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-success/50 bg-success/5">
      <CardContent className="flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-success/10">
            <CheckCircle2 className="h-5 w-5 text-success" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-success">API Conectada</p>
              <Badge variant="outline" className="text-xs">
                {connectedApp?.app_name}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Mercado: {connectedApp?.market || "BR"} • Última sync: agora
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {showSyncButton && onSync && (
            <Button variant="outline" size="sm" onClick={onSync} disabled={isSyncing}>
              {isSyncing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Sincronizar
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => navigate("/tiktok/settings")}>
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
