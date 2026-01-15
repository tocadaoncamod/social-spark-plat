import { useState } from "react";
import { FastMossLayout } from "@/components/fastmoss/FastMossLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAgentes, Agente } from "@/hooks/useAgentes";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Bot, 
  Edit, 
  Trash2, 
  Youtube, 
  Instagram, 
  Facebook, 
  MessageCircle, 
  Music2, 
  Send, 
  Linkedin,
  Sparkles,
  Settings2,
  Rocket,
  Save,
  X,
  PlayCircle,
  Loader2,
  User,
  Cpu
} from "lucide-react";

const platformIcons: Record<string, any> = {
  youtube: Youtube,
  instagram: Instagram,
  facebook: Facebook,
  whatsapp: MessageCircle,
  tiktok: Music2,
  telegram: Send,
  linkedin: Linkedin,
};

const platformColors: Record<string, string> = {
  youtube: "bg-red-500",
  instagram: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400",
  facebook: "bg-blue-600",
  whatsapp: "bg-green-500",
  tiktok: "bg-black",
  telegram: "bg-sky-500",
  linkedin: "bg-blue-700",
};

const platformNames: Record<string, string> = {
  youtube: "YouTube",
  instagram: "Instagram",
  facebook: "Facebook",
  whatsapp: "WhatsApp",
  tiktok: "TikTok",
  telegram: "Telegram",
  linkedin: "LinkedIn",
};

export default function Agentes() {
  const navigate = useNavigate();
  const { agentes, isLoading, updateAgente, deleteAgente, toggleAgente } = useAgentes();
  const [editingAgente, setEditingAgente] = useState<Agente | null>(null);
  const [editForm, setEditForm] = useState({
    nome: "",
    prompt_base: "",
    ia_primaria: "gemini",
    ia_secundaria: "",
  });
  
  // Test agent state
  const [testingAgente, setTestingAgente] = useState<Agente | null>(null);
  const [testMessage, setTestMessage] = useState("");
  const [testResponse, setTestResponse] = useState("");
  const [isTesting, setIsTesting] = useState(false);

  const handleEdit = (agente: Agente) => {
    setEditingAgente(agente);
    setEditForm({
      nome: agente.nome,
      prompt_base: agente.prompt_base,
      ia_primaria: agente.ia_primaria || "gemini",
      ia_secundaria: agente.ia_secundaria || "",
    });
  };

  const handleSave = () => {
    if (!editingAgente) return;
    
    updateAgente.mutate({
      id: editingAgente.id,
      updates: {
        nome: editForm.nome,
        prompt_base: editForm.prompt_base,
        ia_primaria: editForm.ia_primaria,
        ia_secundaria: editForm.ia_secundaria || null,
      },
    });
    setEditingAgente(null);
  };

  const handleDelete = (id: string) => {
    deleteAgente.mutate(id);
  };

  const handleToggle = (id: string, currentStatus: boolean | null) => {
    toggleAgente.mutate({ id, ativo: !currentStatus });
  };

  const handleTest = (agente: Agente) => {
    setTestingAgente(agente);
    setTestMessage("");
    setTestResponse("");
  };

  const executeTest = async () => {
    if (!testingAgente || !testMessage.trim()) return;
    
    setIsTesting(true);
    setTestResponse("");
    
    try {
      const { data, error } = await supabase.functions.invoke("test-agent", {
        body: {
          prompt: testingAgente.prompt_base,
          message: testMessage,
          agentName: testingAgente.nome,
          platform: testingAgente.plataforma,
        },
      });

      if (error) throw error;
      
      if (data?.error) {
        toast.error(data.error);
        return;
      }
      
      setTestResponse(data.response);
    } catch (error) {
      console.error("Test error:", error);
      toast.error("Erro ao testar agente. Tente novamente.");
    } finally {
      setIsTesting(false);
    }
  };

  const activeAgentes = agentes.filter(a => a.ativo);
  const inactiveAgentes = agentes.filter(a => !a.ativo);

  return (
    <FastMossLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Bot className="h-8 w-8 text-primary" />
              Agentes Especializados
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie seus agentes de IA por plataforma
            </p>
          </div>
          <Button 
            onClick={() => navigate("/onboarding")}
            className="gap-2"
          >
            <Rocket className="h-4 w-4" />
            Configurar Novos Agentes
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{agentes.length}</p>
                  <p className="text-sm text-muted-foreground">Total de Agentes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-green-500/10">
                  <Sparkles className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeAgentes.length}</p>
                  <p className="text-sm text-muted-foreground">Agentes Ativos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-muted">
                  <Settings2 className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{inactiveAgentes.length}</p>
                  <p className="text-sm text-muted-foreground">Agentes Inativos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agentes Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : agentes.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bot className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum agente configurado</h3>
              <p className="text-muted-foreground text-center mb-4">
                Configure seus agentes especializados através do onboarding
              </p>
              <Button onClick={() => navigate("/onboarding")} className="gap-2">
                <Rocket className="h-4 w-4" />
                Iniciar Configuração
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agentes.map((agente) => {
              const Icon = platformIcons[agente.plataforma] || Bot;
              const bgColor = platformColors[agente.plataforma] || "bg-gray-500";
              const platformName = platformNames[agente.plataforma] || agente.plataforma;

              return (
                <Card key={agente.id} className={`transition-all duration-200 ${!agente.ativo ? 'opacity-60' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-lg ${bgColor}`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{agente.nome}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {platformName}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {agente.ia_primaria || "gemini"}
                            </Badge>
                          </CardDescription>
                        </div>
                      </div>
                      <Switch
                        checked={agente.ativo ?? false}
                        onCheckedChange={() => handleToggle(agente.id, agente.ativo)}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground line-clamp-3">
                        {agente.prompt_base.substring(0, 150)}...
                      </p>
                    </div>
                    
                    {agente.conhecimentos && Object.keys(agente.conhecimentos).length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {Object.keys(agente.conhecimentos).slice(0, 3).map((key) => (
                          <Badge key={key} variant="outline" className="text-xs">
                            {key}
                          </Badge>
                        ))}
                        {Object.keys(agente.conhecimentos).length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{Object.keys(agente.conhecimentos).length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="flex-1 gap-1"
                        onClick={() => handleTest(agente)}
                        disabled={!agente.ativo}
                      >
                        <PlayCircle className="h-3.5 w-3.5" />
                        Testar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1"
                        onClick={() => handleEdit(agente)}
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remover Agente</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja remover o agente "{agente.nome}"? 
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(agente.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Remover
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={!!editingAgente} onOpenChange={(open) => !open && setEditingAgente(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Editar Agente
              </DialogTitle>
              <DialogDescription>
                Personalize o prompt e configurações do seu agente
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Agente</Label>
                <Input
                  id="nome"
                  value={editForm.nome}
                  onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })}
                  placeholder="Ex: YouTube Expert"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>IA Primária</Label>
                  <Select 
                    value={editForm.ia_primaria} 
                    onValueChange={(value) => setEditForm({ ...editForm, ia_primaria: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gemini">Gemini 2.5 Pro</SelectItem>
                      <SelectItem value="gpt4">GPT-5</SelectItem>
                      <SelectItem value="gpt4-mini">GPT-5 Mini</SelectItem>
                      <SelectItem value="gemini-flash">Gemini Flash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>IA Secundária (Backup)</Label>
                  <Select 
                    value={editForm.ia_secundaria} 
                    onValueChange={(value) => setEditForm({ ...editForm, ia_secundaria: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Nenhuma</SelectItem>
                      <SelectItem value="gemini">Gemini 2.5 Pro</SelectItem>
                      <SelectItem value="gpt4">GPT-5</SelectItem>
                      <SelectItem value="gpt4-mini">GPT-5 Mini</SelectItem>
                      <SelectItem value="gemini-flash">Gemini Flash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt Base</Label>
                <Textarea
                  id="prompt"
                  value={editForm.prompt_base}
                  onChange={(e) => setEditForm({ ...editForm, prompt_base: e.target.value })}
                  placeholder="Digite o prompt do agente..."
                  className="min-h-[300px] font-mono text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingAgente(null)}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={updateAgente.isPending}>
                <Save className="h-4 w-4 mr-2" />
                {updateAgente.isPending ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Test Dialog */}
        <Dialog open={!!testingAgente} onOpenChange={(open) => !open && setTestingAgente(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <PlayCircle className="h-5 w-5 text-primary" />
                Testar Agente: {testingAgente?.nome}
              </DialogTitle>
              <DialogDescription>
                Envie uma mensagem de teste e veja a resposta do agente
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {/* Input Section */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Sua mensagem de teste
                </Label>
                <Textarea
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  placeholder={`Ex: Crie um post sobre moda feminina para ${testingAgente?.plataforma}...`}
                  className="min-h-[100px]"
                  disabled={isTesting}
                />
              </div>

              {/* Response Section */}
              {(testResponse || isTesting) && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Cpu className="h-4 w-4" />
                    Resposta do Agente
                  </Label>
                  <ScrollArea className="h-[300px] rounded-lg border bg-muted/30 p-4">
                    {isTesting ? (
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Gerando resposta...</span>
                      </div>
                    ) : (
                      <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">
                        {testResponse}
                      </div>
                    )}
                  </ScrollArea>
                </div>
              )}
            </div>

            <div className="flex justify-between gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setTestMessage("");
                  setTestResponse("");
                }}
                disabled={isTesting || (!testMessage && !testResponse)}
              >
                Limpar
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setTestingAgente(null)}>
                  Fechar
                </Button>
                <Button 
                  onClick={executeTest} 
                  disabled={isTesting || !testMessage.trim()}
                  className="gap-2"
                >
                  {isTesting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Testando...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Enviar Teste
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </FastMossLayout>
  );
}
