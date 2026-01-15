import { useState } from "react";
import { FastMossLayout } from "@/components/fastmoss/FastMossLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Users, 
  ShoppingBag, 
  MessageSquare, 
  Rocket, 
  CheckCircle2, 
  Clock,
  Eye,
  TrendingUp,
  Loader2,
  Plus,
  Trash2,
  Send,
  ExternalLink,
  Calendar,
  Sparkles,
  Zap,
  FileText,
  Key
} from "lucide-react";
import { 
  useFacebookStats, 
  useFacebookGrupos, 
  useFacebookMarketplace, 
  useFacebookRespostas,
  useFacebookPosts,
  useIniciarAutomacao,
  useDeleteFacebookGrupo,
  useDeleteMarketplaceProduto,
  useProcessAutoReplies
} from "@/hooks/useFacebookAutomation";
import { AddGrupoModal } from "@/components/facebook/AddGrupoModal";
import { AddMarketplaceModal } from "@/components/facebook/AddMarketplaceModal";
import { SchedulePostModal } from "@/components/facebook/SchedulePostModal";
import { CreateAdModal } from "@/components/facebook/CreateAdModal";
import { AutoReplyModal } from "@/components/facebook/AutoReplyModal";
import { ResponseTemplatesModal } from "@/components/facebook/ResponseTemplatesModal";
import { TokenStatusCard } from "@/components/facebook/TokenStatusCard";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function FacebookAutomation() {
  const [linkProduto, setLinkProduto] = useState("");
  const [showAddGrupo, setShowAddGrupo] = useState(false);
  const [showAddMarketplace, setShowAddMarketplace] = useState(false);
  const [showSchedulePost, setShowSchedulePost] = useState(false);
  const [showCreateAd, setShowCreateAd] = useState(false);
  const [showAutoReply, setShowAutoReply] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  const { data: stats, isLoading: loadingStats } = useFacebookStats();
  const { data: grupos, isLoading: loadingGrupos } = useFacebookGrupos();
  const { data: marketplace, isLoading: loadingMarketplace } = useFacebookMarketplace();
  const { data: respostas, isLoading: loadingRespostas } = useFacebookRespostas();
  const { data: posts, isLoading: loadingPosts } = useFacebookPosts();
  
  const iniciarAutomacao = useIniciarAutomacao();
  const deleteGrupo = useDeleteFacebookGrupo();
  const deleteMarketplace = useDeleteMarketplaceProduto();
  const processAutoReplies = useProcessAutoReplies();

  const pendingReplies = respostas?.filter(r => !r.respondido).length || 0;

  const handleIniciar = () => {
    if (!linkProduto.trim()) {
      return;
    }
    iniciarAutomacao.mutate(linkProduto);
    setLinkProduto("");
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      pendente: { variant: "secondary", label: "Pendente" },
      aprovado: { variant: "outline", label: "Aprovado" },
      ativo: { variant: "default", label: "Ativo" },
      rejeitado: { variant: "destructive", label: "Rejeitado" },
      agendado: { variant: "secondary", label: "Agendado" },
      publicado: { variant: "default", label: "Publicado" },
      erro: { variant: "destructive", label: "Erro" },
      pausado: { variant: "outline", label: "Pausado" },
      vendido: { variant: "default", label: "Vendido" },
    };
    
    const config = statusConfig[status] || { variant: "secondary" as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <FastMossLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1877F2]">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Facebook Ultra Automatizado</h1>
            <p className="text-muted-foreground">Sistema 100% automatizado para Facebook</p>
          </div>
        </div>

        {/* Token Status Card */}
        <TokenStatusCard />

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats?.gruposAtivos || 0}</p>
                  <p className="text-xs text-muted-foreground">Grupos Ativos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                  <ShoppingBag className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats?.produtosMarketplace || 0}</p>
                  <p className="text-xs text-muted-foreground">Produtos Marketplace</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all"
            onClick={() => setShowAutoReply(true)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                  <MessageSquare className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats?.mensagensRespondidas || 0}</p>
                  <p className="text-xs text-muted-foreground">Mensagens Respondidas</p>
                  {pendingReplies > 0 && (
                    <Badge variant="destructive" className="text-xs mt-1">
                      {pendingReplies} pendentes
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:ring-2 hover:ring-teal-500 transition-all"
            onClick={() => setShowTemplates(true)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/10">
                  <FileText className="h-5 w-5 text-teal-500" />
                </div>
                <div>
                  <p className="text-sm font-bold">Templates</p>
                  <p className="text-xs text-muted-foreground">Respostas Prontas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                  <Eye className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats?.visualizacoesTotal || 0}</p>
                  <p className="text-xs text-muted-foreground">Visualizações Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Card de Criar Anúncio com IA */}
        <Card className="border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-[#1877F2]/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              Criar Anúncio com IA
            </CardTitle>
            <CardDescription>
              Cole o link do produto e a IA criará anúncios otimizados com palavras-chave, hashtags e textos para Marketplace e Grupos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setShowCreateAd(true)}
              className="w-full bg-gradient-to-r from-purple-600 to-[#1877F2] hover:from-purple-700 hover:to-[#1877F2]/90"
              size="lg"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Criar Anúncio Otimizado
            </Button>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: Eye, label: "Extrai imagens do link" },
                { icon: TrendingUp, label: "Palavras-chave SEO" },
                { icon: ShoppingBag, label: "Publica no Marketplace" },
                { icon: Users, label: "Agenda nos grupos" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-2">
                  <item.icon className="h-4 w-4 text-purple-500 flex-shrink-0" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Card de Iniciar Automação Rápida */}
        <Card className="border-2 border-[#1877F2]/20 bg-gradient-to-br from-[#1877F2]/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-[#1877F2]" />
              Automação Rápida
            </CardTitle>
            <CardDescription>
              Inicie a automação rápida com um link de produto.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Input
                value={linkProduto}
                onChange={(e) => setLinkProduto(e.target.value)}
                placeholder="https://minhaloja.com/produto"
                className="flex-1"
              />
              <Button 
                onClick={handleIniciar} 
                disabled={iniciarAutomacao.isPending || !linkProduto.trim()}
                className="bg-[#1877F2] hover:bg-[#1877F2]/90"
              >
                {iniciarAutomacao.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Iniciando...
                  </>
                ) : (
                  <>
                    <Rocket className="h-4 w-4 mr-2" />
                    Iniciar
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs para Grupos, Marketplace, Respostas */}
        <Tabs defaultValue="grupos" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="grupos" className="gap-2">
              <Users className="h-4 w-4" />
              Grupos ({grupos?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="posts" className="gap-2">
              <Send className="h-4 w-4" />
              Posts ({posts?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="gap-2">
              <ShoppingBag className="h-4 w-4" />
              Marketplace ({marketplace?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="respostas" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Respostas ({respostas?.filter(r => !r.respondido).length || 0})
            </TabsTrigger>
          </TabsList>

          {/* Tab Grupos */}
          <TabsContent value="grupos" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Grupos Automáticos</h3>
              <Button onClick={() => setShowAddGrupo(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Grupo
              </Button>
            </div>

            {loadingGrupos ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : grupos?.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  Nenhum grupo cadastrado. Inicie a automação ou adicione grupos manualmente.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {grupos?.map((grupo) => (
                  <Card key={grupo.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{grupo.nome}</h4>
                            {getStatusBadge(grupo.status)}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {grupo.descricao || "Sem descrição"}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {grupo.membros.toLocaleString()} membros
                            </span>
                            {grupo.ultimo_post && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Último post: {format(new Date(grupo.ultimo_post), "dd/MM/yyyy", { locale: ptBR })}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => deleteGrupo.mutate(grupo.id)}
                          disabled={deleteGrupo.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab Posts */}
          <TabsContent value="posts" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Posts em Grupos</h3>
              <Button onClick={() => setShowSchedulePost(true)} size="sm" className="bg-[#1877F2] hover:bg-[#1877F2]/90">
                <Calendar className="h-4 w-4 mr-2" />
                Agendar Post
              </Button>
            </div>

            {loadingPosts ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : posts?.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  Nenhum post agendado ou publicado.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {posts?.map((post) => (
                  <Card key={post.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {post.facebook_grupos_automaticos?.nome || "Grupo Desconhecido"}
                            </span>
                            {getStatusBadge(post.status)}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {post.texto}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            {post.agendado_para && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Agendado: {format(new Date(post.agendado_para), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                              </span>
                            )}
                            {post.publicado_em && (
                              <span className="flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3 text-green-500" />
                                Publicado: {format(new Date(post.publicado_em), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                              </span>
                            )}
                          </div>
                        </div>
                        {post.link && (
                          <Button variant="ghost" size="icon" asChild>
                            <a href={post.link} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab Marketplace */}
          <TabsContent value="marketplace" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Produtos no Marketplace</h3>
              <Button onClick={() => setShowAddMarketplace(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Produto
              </Button>
            </div>

            {loadingMarketplace ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : marketplace?.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  Nenhum produto no Marketplace. Inicie a automação ou adicione produtos manualmente.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {marketplace?.map((produto) => (
                  <Card key={produto.id}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium line-clamp-1">{produto.titulo}</h4>
                            <p className="text-lg font-bold text-green-600">
                              R$ {produto.preco.toFixed(2)}
                            </p>
                          </div>
                          {getStatusBadge(produto.status)}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {produto.descricao}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {produto.visualizacoes} visualizações
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {produto.mensagens} mensagens
                          </span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full text-destructive"
                          onClick={() => deleteMarketplace.mutate(produto.id)}
                          disabled={deleteMarketplace.isPending}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remover
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab Respostas */}
          <TabsContent value="respostas" className="space-y-4">
            <h3 className="text-lg font-semibold">Respostas Automáticas</h3>

            {loadingRespostas ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : respostas?.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  Nenhuma mensagem recebida ainda.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {respostas?.map((resposta) => (
                  <Card key={resposta.id} className={resposta.respondido ? "opacity-60" : ""}>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {resposta.remetente_nome || "Usuário"}
                            </span>
                            <Badge variant="outline">{resposta.contexto || "Geral"}</Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(resposta.created_at), "dd/MM HH:mm", { locale: ptBR })}
                          </span>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-sm">{resposta.mensagem_recebida}</p>
                        </div>
                        {resposta.resposta_enviada && (
                          <div className="bg-[#1877F2]/10 rounded-lg p-3 ml-4">
                            <p className="text-sm">
                              <span className="text-[#1877F2] font-medium">Resposta:</span>{" "}
                              {resposta.resposta_enviada}
                            </p>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          {resposta.respondido ? (
                            <span className="text-xs text-green-600 flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Respondido em {format(new Date(resposta.respondido_em!), "dd/MM HH:mm", { locale: ptBR })}
                            </span>
                          ) : (
                            <Badge variant="secondary">Aguardando resposta automática</Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <AddGrupoModal open={showAddGrupo} onOpenChange={setShowAddGrupo} />
      <AddMarketplaceModal open={showAddMarketplace} onOpenChange={setShowAddMarketplace} />
      <SchedulePostModal open={showSchedulePost} onOpenChange={setShowSchedulePost} />
      <CreateAdModal open={showCreateAd} onOpenChange={setShowCreateAd} />
      <AutoReplyModal open={showAutoReply} onOpenChange={setShowAutoReply} />
      <ResponseTemplatesModal isOpen={showTemplates} onClose={() => setShowTemplates(false)} />
    </FastMossLayout>
  );
}
