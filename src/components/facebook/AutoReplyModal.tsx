import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Loader2, 
  Bot, 
  Sparkles, 
  MessageSquare, 
  Send,
  RefreshCw,
  Brain,
  TrendingUp,
  Lightbulb,
  CheckCircle2,
  Clock,
  Zap
} from "lucide-react";
import { 
  useFacebookRespostas, 
  useProcessAutoReplies, 
  useGenerateAIReply,
  useAnalyzeConversations,
  useResponderMensagem
} from "@/hooks/useFacebookAutomation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

interface AutoReplyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ConversationAnalysis {
  patterns: string[];
  commonQuestions: string[];
  suggestedResponses: { trigger: string; response: string }[];
  conversionTips: string[];
  sentimentOverview: string;
}

export function AutoReplyModal({ open, onOpenChange }: AutoReplyModalProps) {
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [customReply, setCustomReply] = useState("");
  const [generatedReply, setGeneratedReply] = useState<{ resposta: string; intent: string } | null>(null);
  const [analysis, setAnalysis] = useState<ConversationAnalysis | null>(null);

  const { data: respostas, isLoading: loadingRespostas } = useFacebookRespostas();
  const processAutoReplies = useProcessAutoReplies();
  const generateAIReply = useGenerateAIReply();
  const analyzeConversations = useAnalyzeConversations();
  const responderMensagem = useResponderMensagem();

  const pendingMessages = respostas?.filter(r => !r.respondido) || [];
  const answeredMessages = respostas?.filter(r => r.respondido) || [];

  const handleProcessAll = async () => {
    await processAutoReplies.mutateAsync();
  };

  const handleGenerateReply = async (messageId: string) => {
    setSelectedMessage(messageId);
    const result = await generateAIReply.mutateAsync({ messageId });
    if (result?.success) {
      setGeneratedReply({ resposta: result.resposta, intent: result.intent });
      setCustomReply(result.resposta);
    }
  };

  const handleSendReply = async (messageId: string) => {
    if (!customReply.trim()) {
      toast.error("Digite uma resposta");
      return;
    }
    await responderMensagem.mutateAsync({ id: messageId, resposta: customReply });
    setSelectedMessage(null);
    setCustomReply("");
    setGeneratedReply(null);
  };

  const handleAnalyze = async () => {
    const result = await analyzeConversations.mutateAsync();
    if (result?.success && result.analysis) {
      setAnalysis(result.analysis);
      toast.success("Análise concluída!");
    }
  };

  const getIntentBadge = (intent: string) => {
    const intents: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      interesse_compra: { variant: "default", label: "🛒 Interesse" },
      duvida_preco: { variant: "secondary", label: "💰 Preço" },
      duvida_produto: { variant: "outline", label: "❓ Produto" },
      negociacao: { variant: "destructive", label: "🤝 Negociação" },
      duvida_entrega: { variant: "secondary", label: "📦 Entrega" },
      outros: { variant: "outline", label: "💬 Outros" },
    };
    const config = intents[intent] || intents.outros;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-500">
              <Bot className="h-4 w-4 text-white" />
            </div>
            Respostas Automáticas com IA
          </DialogTitle>
          <DialogDescription>
            A IA analisa o contexto de cada conversa e gera respostas personalizadas para maximizar conversões
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          <Button 
            onClick={handleProcessAll} 
            disabled={processAutoReplies.isPending || pendingMessages.length === 0}
            className="bg-gradient-to-r from-purple-600 to-blue-500"
          >
            {processAutoReplies.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Responder Todas ({pendingMessages.length})
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleAnalyze}
            disabled={analyzeConversations.isPending}
          >
            {analyzeConversations.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Brain className="h-4 w-4 mr-2" />
            )}
            Analisar Conversas
          </Button>
        </div>

        <Tabs defaultValue="pending" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending" className="gap-1">
              <Clock className="h-4 w-4" />
              Pendentes ({pendingMessages.length})
            </TabsTrigger>
            <TabsTrigger value="answered" className="gap-1">
              <CheckCircle2 className="h-4 w-4" />
              Respondidas ({answeredMessages.length})
            </TabsTrigger>
            <TabsTrigger value="insights" className="gap-1">
              <Lightbulb className="h-4 w-4" />
              Insights IA
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 mt-4">
            {/* Pendentes */}
            <TabsContent value="pending" className="mt-0 space-y-4">
              {loadingRespostas ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : pendingMessages.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <p>Todas as mensagens foram respondidas!</p>
                  </CardContent>
                </Card>
              ) : (
                pendingMessages.map((msg) => (
                  <Card key={msg.id} className={selectedMessage === msg.id ? "ring-2 ring-purple-500" : ""}>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{msg.remetente_nome || "Cliente"}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(msg.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                          </p>
                        </div>
                        <Badge variant="secondary">Pendente</Badge>
                      </div>
                      
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-sm">{msg.mensagem_recebida}</p>
                      </div>

                      {selectedMessage === msg.id && generatedReply && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-purple-500" />
                            <span className="text-sm font-medium">Resposta gerada pela IA</span>
                            {getIntentBadge(generatedReply.intent)}
                          </div>
                          <Textarea
                            value={customReply}
                            onChange={(e) => setCustomReply(e.target.value)}
                            placeholder="Edite a resposta se necessário..."
                            rows={3}
                          />
                        </div>
                      )}

                      <div className="flex gap-2">
                        {selectedMessage === msg.id ? (
                          <>
                            <Button 
                              size="sm" 
                              onClick={() => handleSendReply(msg.id)}
                              disabled={responderMensagem.isPending}
                              className="bg-green-500 hover:bg-green-600"
                            >
                              {responderMensagem.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <Send className="h-4 w-4 mr-1" />
                                  Enviar
                                </>
                              )}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleGenerateReply(msg.id)}
                              disabled={generateAIReply.isPending}
                            >
                              <RefreshCw className={`h-4 w-4 mr-1 ${generateAIReply.isPending ? 'animate-spin' : ''}`} />
                              Regenerar
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => {
                                setSelectedMessage(null);
                                setGeneratedReply(null);
                                setCustomReply("");
                              }}
                            >
                              Cancelar
                            </Button>
                          </>
                        ) : (
                          <Button 
                            size="sm" 
                            onClick={() => handleGenerateReply(msg.id)}
                            disabled={generateAIReply.isPending}
                            className="bg-purple-500 hover:bg-purple-600"
                          >
                            {generateAIReply.isPending && selectedMessage === msg.id ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <Sparkles className="h-4 w-4 mr-1" />
                            )}
                            Gerar Resposta IA
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Respondidas */}
            <TabsContent value="answered" className="mt-0 space-y-4">
              {answeredMessages.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma mensagem respondida ainda</p>
                  </CardContent>
                </Card>
              ) : (
                answeredMessages.slice(0, 20).map((msg) => (
                  <Card key={msg.id}>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{msg.remetente_nome || "Cliente"}</p>
                          <p className="text-xs text-muted-foreground">
                            Respondido em {format(new Date(msg.respondido_em!), "dd/MM HH:mm", { locale: ptBR })}
                          </p>
                        </div>
                        <Badge variant="default" className="bg-green-500">Respondido</Badge>
                      </div>
                      
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-sm">{msg.mensagem_recebida}</p>
                      </div>
                      
                      <div className="bg-purple-500/10 rounded-lg p-3 ml-4 border-l-2 border-purple-500">
                        <p className="text-sm">{msg.resposta_enviada}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Insights */}
            <TabsContent value="insights" className="mt-0 space-y-4">
              {!analysis ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <Brain className="h-12 w-12 mx-auto mb-4 text-purple-500" />
                    <p className="text-muted-foreground mb-4">
                      Clique em "Analisar Conversas" para obter insights da IA
                    </p>
                    <Button onClick={handleAnalyze} disabled={analyzeConversations.isPending}>
                      {analyzeConversations.isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Brain className="h-4 w-4 mr-2" />
                      )}
                      Analisar Agora
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Sentiment Overview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Visão Geral do Sentimento
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{analysis.sentimentOverview}</p>
                    </CardContent>
                  </Card>

                  {/* Padrões */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">📊 Padrões Identificados</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {analysis.patterns.map((pattern, i) => (
                          <Badge key={i} variant="outline">{pattern}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Perguntas Comuns */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">❓ Perguntas Mais Comuns</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysis.commonQuestions.map((q, i) => (
                          <li key={i} className="text-sm flex items-start gap-2">
                            <span className="text-muted-foreground">{i + 1}.</span>
                            {q}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Respostas Sugeridas */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">💡 Respostas Sugeridas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {analysis.suggestedResponses.map((sr, i) => (
                        <div key={i} className="border rounded-lg p-3">
                          <p className="text-xs font-medium text-purple-500 mb-1">
                            Quando cliente disser: "{sr.trigger}"
                          </p>
                          <p className="text-sm">{sr.response}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Dicas de Conversão */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">🎯 Dicas para Aumentar Conversão</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysis.conversionTips.map((tip, i) => (
                          <li key={i} className="text-sm flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
