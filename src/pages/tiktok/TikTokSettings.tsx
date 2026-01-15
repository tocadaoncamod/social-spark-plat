import { useState } from "react";
import { TikTokShopLayout } from "@/components/tiktok/TikTokShopLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Settings, 
  Key, 
  Globe, 
  Shield, 
  CheckCircle2, 
  XCircle, 
  RefreshCw,
  ExternalLink,
  Copy,
  AlertTriangle,
  Zap,
  Lock,
  Unlock,
  BookOpen,
  ArrowRight,
  Link2
} from "lucide-react";
import { useTikTokApps, useTikTokAppConnection } from "@/hooks/useTikTokData";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function TikTokSettings() {
  const { data: apps, isLoading } = useTikTokApps();
  const { testConnection, refreshToken, isConnecting } = useTikTokAppConnection();
  const appsResult = useTikTokApps();
  
  const [formData, setFormData] = useState({
    appName: "",
    appId: "",
    appKey: "",
    appSecret: "",
    market: "BR"
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.appName || !formData.appId || !formData.appKey) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    try {
      await appsResult.createApp.mutateAsync({
        app_name: formData.appName,
        app_id: formData.appId,
        app_key: formData.appKey,
        app_secret: formData.appSecret || null,
        market: formData.market,
        status: "inactive",
        permissions_granted: 0,
      });
      toast.success("App TikTok registrado com sucesso!");
      setFormData({ appName: "", appId: "", appKey: "", appSecret: "", market: "BR" });
    } catch (error) {
      toast.error("Erro ao registrar app");
    }
  };
  
  const handleTestConnection = async (appId: string) => {
    try {
      await testConnection(appId);
      toast.success("Conexão testada com sucesso!");
    } catch (error) {
      toast.error("Erro ao testar conexão");
    }
  };
  
  const handleRefreshToken = async (appId: string) => {
    try {
      await refreshToken(appId);
      toast.success("Token atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar token");
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado para a área de transferência");
  };

  const startOAuthFlow = (appId: string, clientKey: string) => {
    const redirectUri = encodeURIComponent(`${window.location.origin}/tiktok/callback`);
    const state = appId; // Pass app ID to callback
    const scopes = "user.info.basic,video.list,video.upload";
    
    const authUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientKey}&response_type=code&scope=${scopes}&redirect_uri=${redirectUri}&state=${state}`;
    
    window.location.href = authUrl;
  };
  
  const connectedApp = apps?.find(app => app.status === "active");
  const isCreating = appsResult.createApp.isPending;

  return (
    <TikTokShopLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Configurações do TikTok Shop
          </h1>
          <p className="text-muted-foreground">
            Configure sua conexão com o TikTok Developer App
          </p>
        </div>

        {/* Connection Status Banner */}
        {connectedApp ? (
          <Alert className="border-success bg-success/10">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <AlertDescription className="text-success">
              <strong>Conectado!</strong> Seu app "{connectedApp.app_name}" está conectado e funcionando.
              Dados serão sincronizados automaticamente.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="border-warning bg-warning/10">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <AlertDescription className="text-warning">
              <strong>Não conectado.</strong> Configure seu TikTok Developer App para começar a usar dados reais.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="guide" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
            <TabsTrigger value="guide">📋 Guia</TabsTrigger>
            <TabsTrigger value="apps">Apps</TabsTrigger>
            <TabsTrigger value="api">API & Tokens</TabsTrigger>
            <TabsTrigger value="permissions">Permissões</TabsTrigger>
          </TabsList>

          {/* Guide Tab - NEW */}
          <TabsContent value="guide" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Guia de Configuração Passo a Passo
                </CardTitle>
                <CardDescription>
                  Siga estes 4 passos para conectar sua conta TikTok
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1 */}
                <div className="flex gap-4 p-4 rounded-lg border bg-card">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    1
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Acesse o TikTok Developer Portal</h4>
                    <p className="text-sm text-muted-foreground">
                      Faça login com sua conta TikTok Business ou Creator
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://developers.tiktok.com/" target="_blank" rel="noopener noreferrer">
                        Abrir Developer Portal
                        <ExternalLink className="h-3 w-3 ml-2" />
                      </a>
                    </Button>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4 p-4 rounded-lg border bg-card">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    2
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Crie um Novo App</h4>
                    <p className="text-sm text-muted-foreground">
                      Clique em "Manage Apps" → "Create an app" e preencha:
                    </p>
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                      <li><strong>App Name:</strong> Social Spark AI - Toca da Onça</li>
                      <li><strong>App Type:</strong> Web App (Third Party)</li>
                      <li><strong>Category:</strong> E-commerce / Social</li>
                    </ul>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4 p-4 rounded-lg border bg-card">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    3
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Configure as Permissões (Scopes)</h4>
                    <p className="text-sm text-muted-foreground">
                      Selecione as APIs necessárias:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-success/10 text-success border-success">
                        ✅ Login Kit
                      </Badge>
                      <Badge variant="outline" className="bg-success/10 text-success border-success">
                        ✅ Content Posting API
                      </Badge>
                      <Badge variant="outline" className="bg-success/10 text-success border-success">
                        ✅ Share Kit
                      </Badge>
                      <Badge variant="outline" className="bg-success/10 text-success border-success">
                        ✅ Video Kit
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-4 p-4 rounded-lg border bg-card">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    4
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold">Configure o Redirect URI</h4>
                    <p className="text-sm text-muted-foreground">
                      No seu app do TikTok, adicione esta URL em "OAuth Configuration":
                    </p>
                    <div className="flex gap-2">
                      <Input 
                        value={`${window.location.origin}/tiktok/callback`}
                        readOnly
                        className="font-mono text-sm bg-muted"
                      />
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => copyToClipboard(`${window.location.origin}/tiktok/callback`)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Step 5 - Credentials */}
                <div className="flex gap-4 p-4 rounded-lg border bg-primary/5 border-primary">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    5
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Copie as Credenciais</h4>
                    <p className="text-sm text-muted-foreground">
                      Após criar o app, copie as credenciais e cadastre na aba "Apps":
                    </p>
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                      <li><strong>Client Key</strong> → Cole em "App Key"</li>
                      <li><strong>Client Secret</strong> → Cole em "App Secret"</li>
                      <li><strong>App ID</strong> → Cole em "App ID"</li>
                    </ul>
                    <Button className="mt-2" onClick={() => {
                      const tabsList = document.querySelector('[data-state="active"][value="guide"]');
                      const appsTab = document.querySelector('[value="apps"]');
                      if (appsTab instanceof HTMLElement) appsTab.click();
                    }}>
                      Ir para Cadastro de Apps
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Quick Help */}
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    Problemas Comuns
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>Não vejo "Manage Apps":</strong> Acesse direto <a href="https://developers.tiktok.com/apps" target="_blank" className="text-primary hover:underline">developers.tiktok.com/apps</a></li>
                    <li>• <strong>Precisa de aprovação:</strong> Alguns escopos exigem verificação da conta</li>
                    <li>• <strong>Erro de redirect:</strong> Verifique se a URL está exatamente igual</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Apps Tab */}
          <TabsContent value="apps" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Add New App */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Adicionar TikTok App
                  </CardTitle>
                  <CardDescription>
                    Registre seu app do TikTok Developer Portal
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="appName">Nome do App *</Label>
                      <Input
                        id="appName"
                        placeholder="Meu TikTok Shop App"
                        value={formData.appName}
                        onChange={(e) => setFormData(prev => ({ ...prev, appName: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="appId">App ID *</Label>
                      <Input
                        id="appId"
                        placeholder="1234567890123456789"
                        value={formData.appId}
                        onChange={(e) => setFormData(prev => ({ ...prev, appId: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="appKey">App Key *</Label>
                      <Input
                        id="appKey"
                        placeholder="ak1234567890abcdef"
                        value={formData.appKey}
                        onChange={(e) => setFormData(prev => ({ ...prev, appKey: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="appSecret">App Secret (opcional)</Label>
                      <Input
                        id="appSecret"
                        type="password"
                        placeholder="••••••••••••••••"
                        value={formData.appSecret}
                        onChange={(e) => setFormData(prev => ({ ...prev, appSecret: e.target.value }))}
                      />
                      <p className="text-xs text-muted-foreground">
                        O App Secret é armazenado de forma segura e criptografada
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="market">Mercado</Label>
                      <Input
                        id="market"
                        value="Brasil (BR)"
                        disabled
                        className="bg-muted"
                      />
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isCreating}>
                      {isCreating ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Zap className="h-4 w-4 mr-2" />
                      )}
                      Registrar App
                    </Button>
                  </form>
                </CardContent>
                <CardFooter className="text-sm text-muted-foreground">
                  <a 
                    href="https://developers.tiktok.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    Criar app no TikTok Developer Portal
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </CardFooter>
              </Card>

              {/* Existing Apps */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Apps Registrados
                  </CardTitle>
                  <CardDescription>
                    Gerencie seus apps TikTok conectados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-3">
                      {[1, 2].map(i => (
                        <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
                      ))}
                    </div>
                  ) : apps && apps.length > 0 ? (
                    <div className="space-y-3">
                      {apps.map(app => (
                        <div 
                          key={app.id}
                          className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{app.app_name}</h4>
                                <Badge 
                                  variant={app.status === "active" ? "default" : "outline"}
                                  className={app.status === "active" ? "bg-success" : ""}
                                >
                                  {app.status === "active" ? (
                                    <><CheckCircle2 className="h-3 w-3 mr-1" /> Conectado</>
                                  ) : (
                                    <><XCircle className="h-3 w-3 mr-1" /> Desconectado</>
                                  )}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground font-mono">
                                ID: {app.app_id}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Mercado: {app.market || "BR"} • {app.permissions_granted || 0} permissões
                              </p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => copyToClipboard(app.app_id)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleTestConnection(app.id)}
                              disabled={isConnecting}
                            >
                              <RefreshCw className={`h-3 w-3 mr-1 ${isConnecting ? 'animate-spin' : ''}`} />
                              Testar
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleRefreshToken(app.id)}
                              disabled={isConnecting}
                            >
                              <Key className="h-3 w-3 mr-1" />
                              Renovar Token
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="p-4 rounded-full bg-muted mb-4">
                        <Key className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h4 className="font-medium mb-1">Nenhum app registrado</h4>
                      <p className="text-sm text-muted-foreground">
                        Adicione seu TikTok Developer App para começar
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* API & Tokens Tab */}
          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  OAuth & Access Tokens
                </CardTitle>
                <CardDescription>
                  Informações sobre autenticação e tokens de acesso
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {connectedApp ? (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="p-4 rounded-lg bg-muted/50">
                        <Label className="text-xs text-muted-foreground">Access Token Status</Label>
                        <div className="flex items-center gap-2 mt-1">
                          {connectedApp.access_token ? (
                            <>
                              <Unlock className="h-4 w-4 text-success" />
                              <span className="text-sm font-medium text-success">Ativo</span>
                            </>
                          ) : (
                            <>
                              <Lock className="h-4 w-4 text-destructive" />
                              <span className="text-sm font-medium text-destructive">Não configurado</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-muted/50">
                        <Label className="text-xs text-muted-foreground">Token Expira em</Label>
                        <p className="text-sm font-medium mt-1">
                          {connectedApp.token_expires_at 
                            ? new Date(connectedApp.token_expires_at).toLocaleDateString('pt-BR')
                            : "N/A"
                          }
                        </p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h4 className="font-medium">Callback URL (Redirect URI)</h4>
                      <div className="flex gap-2">
                        <Input 
                          value={`${window.location.origin}/tiktok/callback`}
                          readOnly
                          className="font-mono text-sm"
                        />
                        <Button 
                          variant="outline"
                          onClick={() => copyToClipboard(`${window.location.origin}/tiktok/callback`)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Configure esta URL no seu TikTok Developer App como Redirect URI
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Shield className="h-12 w-12 text-muted-foreground mb-4" />
                    <h4 className="font-medium mb-2">Nenhum app conectado</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Registre e conecte um TikTok App para ver informações de autenticação
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value="permissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Permissões do TikTok Shop API</CardTitle>
                <CardDescription>
                  Escopos necessários para integração completa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { scope: "product.read", name: "Leitura de Produtos", granted: true },
                    { scope: "product.write", name: "Escrita de Produtos", granted: true },
                    { scope: "order.read", name: "Leitura de Pedidos", granted: true },
                    { scope: "order.write", name: "Gestão de Pedidos", granted: false },
                    { scope: "shop.read", name: "Leitura de Loja", granted: true },
                    { scope: "shop.write", name: "Gestão de Loja", granted: false },
                    { scope: "affiliate.read", name: "Dados de Afiliados", granted: true },
                    { scope: "logistics.read", name: "Logística", granted: false },
                    { scope: "finance.read", name: "Dados Financeiros", granted: true },
                    { scope: "seller.read", name: "Dados do Vendedor", granted: true },
                  ].map(perm => (
                    <div 
                      key={perm.scope}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div>
                        <p className="text-sm font-medium">{perm.name}</p>
                        <code className="text-xs text-muted-foreground">{perm.scope}</code>
                      </div>
                      <Switch checked={perm.granted} disabled />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  As permissões são definidas no TikTok Developer Portal ao criar seu app
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TikTokShopLayout>
  );
}
