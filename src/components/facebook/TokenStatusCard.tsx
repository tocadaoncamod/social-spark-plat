import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Key,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Clock,
  Calendar,
  ExternalLink,
  Loader2,
  HelpCircle,
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  useFacebookTokenConfig,
  useTestFacebookConnection,
  useUpdateTokenExpiry,
  getDaysUntilExpiry,
} from "@/hooks/useFacebookTokenConfig";

export function TokenStatusCard() {
  const { data: tokenConfig, isLoading } = useFacebookTokenConfig();
  const testConnection = useTestFacebookConnection();
  const updateExpiry = useUpdateTokenExpiry();
  const [showRenewalGuide, setShowRenewalGuide] = useState(false);
  const [newExpiryDate, setNewExpiryDate] = useState("");

  const daysUntilExpiry = getDaysUntilExpiry(tokenConfig?.access_token_expires_at);
  
  const getStatusInfo = () => {
    if (!tokenConfig) {
      return {
        status: "unknown",
        color: "text-muted-foreground",
        bgColor: "bg-muted",
        icon: HelpCircle,
        label: "Não Verificado",
        description: "Clique em 'Testar Conexão' para verificar o status",
      };
    }

    if (daysUntilExpiry !== null && daysUntilExpiry <= 0) {
      return {
        status: "expired",
        color: "text-red-500",
        bgColor: "bg-red-500/10",
        icon: XCircle,
        label: "Expirado",
        description: "O token expirou. Renove imediatamente.",
      };
    }

    if (daysUntilExpiry !== null && daysUntilExpiry <= 7) {
      return {
        status: "critical",
        color: "text-red-500",
        bgColor: "bg-red-500/10",
        icon: AlertTriangle,
        label: "Crítico",
        description: `Expira em ${daysUntilExpiry} dia(s). Renove agora!`,
      };
    }

    if (daysUntilExpiry !== null && daysUntilExpiry <= 30) {
      return {
        status: "warning",
        color: "text-yellow-500",
        bgColor: "bg-yellow-500/10",
        icon: AlertTriangle,
        label: "Atenção",
        description: `Expira em ${daysUntilExpiry} dias. Planeje a renovação.`,
      };
    }

    return {
      status: "valid",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      icon: CheckCircle2,
      label: "Válido",
      description: daysUntilExpiry 
        ? `Expira em ${daysUntilExpiry} dias (${format(new Date(tokenConfig.access_token_expires_at!), "dd/MM/yyyy", { locale: ptBR })})`
        : "Conexão funcionando",
    };
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  const handleUpdateExpiry = () => {
    if (newExpiryDate) {
      updateExpiry.mutate(new Date(newExpiryDate).toISOString());
      setNewExpiryDate("");
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-2 ${statusInfo.status === 'valid' ? 'border-green-500/30' : statusInfo.status === 'warning' ? 'border-yellow-500/30' : statusInfo.status === 'expired' || statusInfo.status === 'critical' ? 'border-red-500/30' : 'border-muted'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${statusInfo.bgColor}`}>
              <Key className={`h-4 w-4 ${statusInfo.color}`} />
            </div>
            Status do Token Facebook
          </CardTitle>
          <Badge 
            variant={statusInfo.status === 'valid' ? 'default' : statusInfo.status === 'warning' ? 'secondary' : 'destructive'}
            className="gap-1"
          >
            <StatusIcon className="h-3 w-3" />
            {statusInfo.label}
          </Badge>
        </div>
        <CardDescription>{statusInfo.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Token Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Última Verificação
            </p>
            <p className="font-medium">
              {tokenConfig?.last_validated_at 
                ? format(new Date(tokenConfig.last_validated_at), "dd/MM/yyyy HH:mm", { locale: ptBR })
                : "Nunca verificado"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Expira em
            </p>
            <p className="font-medium">
              {tokenConfig?.access_token_expires_at 
                ? format(new Date(tokenConfig.access_token_expires_at), "dd/MM/yyyy", { locale: ptBR })
                : "Data desconhecida"}
            </p>
          </div>
        </div>

        {tokenConfig?.page_name && (
          <div className="text-sm bg-muted/50 rounded-lg p-3">
            <p className="text-muted-foreground">Página Conectada</p>
            <p className="font-medium">{tokenConfig.page_name}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => testConnection.mutate()}
            disabled={testConnection.isPending}
          >
            {testConnection.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Testar Conexão
          </Button>

          <Dialog open={showRenewalGuide} onOpenChange={setShowRenewalGuide}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <HelpCircle className="h-4 w-4 mr-2" />
                Como Renovar
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Como Renovar o Token do Facebook</DialogTitle>
                <DialogDescription>
                  Siga estes passos para renovar seu token de acesso
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Acesse o Graph API Explorer</p>
                      <a 
                        href="https://developers.facebook.com/tools/explorer/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline flex items-center gap-1"
                      >
                        Abrir Explorer <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Selecione seu App</p>
                      <p className="text-muted-foreground">Escolha o app "Toca da Onça" no dropdown</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Gere um Page Access Token</p>
                      <p className="text-muted-foreground">
                        Clique em "Get Token" → "Get Page Access Token" e selecione sua página
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold flex-shrink-0">
                      4
                    </div>
                    <div>
                      <p className="font-medium">Estenda o Token</p>
                      <a 
                        href="https://developers.facebook.com/tools/debug/accesstoken/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline flex items-center gap-1"
                      >
                        Access Token Debugger <ExternalLink className="h-3 w-3" />
                      </a>
                      <p className="text-muted-foreground">
                        Cole o token e clique em "Extend Access Token"
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold flex-shrink-0">
                      5
                    </div>
                    <div>
                      <p className="font-medium">Atualize o Secret</p>
                      <p className="text-muted-foreground">
                        Copie o novo token e atualize o secret FACEBOOK_ACCESS_TOKEN no backend
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Label>Atualizar data de expiração manualmente</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      type="date"
                      value={newExpiryDate}
                      onChange={(e) => setNewExpiryDate(e.target.value)}
                    />
                    <Button 
                      onClick={handleUpdateExpiry}
                      disabled={!newExpiryDate || updateExpiry.isPending}
                    >
                      {updateExpiry.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Salvar"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {(statusInfo.status === 'expired' || statusInfo.status === 'critical') && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setShowRenewalGuide(true)}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Renovar Agora
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
