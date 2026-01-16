import { useState, useEffect } from "react";
import { WhatsAppLayout } from "@/components/whatsapp/WhatsAppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useChatbotConfig, useUpsertChatbotConfig, useToggleChatbot } from "@/hooks/useWhatsAppChatbot";
import { useWhatsAppInstances } from "@/hooks/useWhatsAppInstances";
import { PromptLibrary } from "@/components/whatsapp/PromptLibrary";
import { PromptPreview } from "@/components/whatsapp/PromptPreview";
import { useToast } from "@/hooks/use-toast";
import { WhatsAppEliteLibrary } from "@/components/whatsapp/WhatsAppEliteLibrary";
import {
  Bot,
  Sparkles,
  Clock,
  MessageSquare,
  Save,
  AlertCircle,
  Library,
  Mic,
  Volume2
} from "lucide-react";

interface ProfessionalPrompt {
  id: string;
  name: string;
  category: string;
  icon: string | null;
  description: string | null;
  prompt_template: string;
  variables: Record<string, string> | null;
}

export default function WhatsAppChatbot() {
  const { data: instances } = useWhatsAppInstances();
  const [selectedInstance, setSelectedInstance] = useState<string>("");
  const { data: config, isLoading } = useChatbotConfig(selectedInstance || undefined);
  const upsertConfig = useUpsertChatbotConfig();
  const toggleChatbot = useToggleChatbot();
  const { toast } = useToast();

  // Prompt Library states
  const [showLibrary, setShowLibrary] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<ProfessionalPrompt | null>(null);

  const [formData, setFormData] = useState({
    systemPrompt: "",
    welcomeMessage: "",
    fallbackMessage: "",
    workingHoursStart: "",
    workingHoursEnd: "",
    workingDays: [1, 2, 3, 4, 5],
    autoClassifyLeads: true,
  });

  const connectedInstances = instances?.filter((i) => i.status === "connected") || [];

  useEffect(() => {
    if (config) {
      setFormData({
        systemPrompt: config.system_prompt || "",
        welcomeMessage: config.welcome_message || "",
        fallbackMessage: config.fallback_message || "",
        workingHoursStart: config.working_hours_start || "",
        workingHoursEnd: config.working_hours_end || "",
        workingDays: config.working_days || [1, 2, 3, 4, 5],
        autoClassifyLeads: config.auto_classify_leads,
      });
    }
  }, [config]);

  const handleSave = async () => {
    await upsertConfig.mutateAsync({
      instance_id: selectedInstance || null,
      system_prompt: formData.systemPrompt,
      welcome_message: formData.welcomeMessage || null,
      fallback_message: formData.fallbackMessage,
      working_hours_start: formData.workingHoursStart || null,
      working_hours_end: formData.workingHoursEnd || null,
      working_days: formData.workingDays,
      auto_classify_leads: formData.autoClassifyLeads,
    });
  };

  const handleToggle = () => {
    if (config?.id) {
      toggleChatbot.mutate({ id: config.id, isActive: !config.is_active });
    }
  };

  // Prompt Library handlers
  const handleInstallPrompt = (prompt: ProfessionalPrompt) => {
    setSelectedPrompt(prompt);
    setShowLibrary(false);
  };

  const handleConfirmInstall = (variables: Record<string, string>) => {
    if (!selectedPrompt) return;

    // Render template with variables
    let renderedPrompt = selectedPrompt.prompt_template;
    Object.keys(variables).forEach(key => {
      const regex = new RegExp(`\\[${key}\\]`, 'g');
      renderedPrompt = renderedPrompt.replace(regex, variables[key] || `[${key}]`);
    });

    // Update system_prompt in form
    setFormData({ ...formData, systemPrompt: renderedPrompt });
    setSelectedPrompt(null);

    toast({
      title: "✅ Prompt instalado!",
      description: `${selectedPrompt.name} foi instalado com sucesso. Não esqueça de salvar!`,
    });
  };

  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  return (
    <WhatsAppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Chatbot com IA</h1>
            <p className="text-muted-foreground">
              Configure respostas automáticas usando Inteligência Artificial
            </p>
          </div>
          {config && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Badge variant={config.is_active ? "default" : "secondary"}>
                  {config.is_active ? "Ativo" : "Desativado"}
                </Badge>
              </div>
              <Switch
                checked={config.is_active}
                onCheckedChange={handleToggle}
                disabled={toggleChatbot.isPending}
              />
            </div>
          )}
        </div>

        {/* Instance Selector */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 space-y-2">
                <Label>Instância</Label>
                <Select value={selectedInstance || "global"} onValueChange={(val) => setSelectedInstance(val === "global" ? "" : val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma instância" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="global">Configuração Global</SelectItem>
                    {connectedInstances.map((instance) => (
                      <SelectItem key={instance.id} value={instance.id}>
                        {instance.instance_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Elite Agents Library */}
        <WhatsAppEliteLibrary onInstall={(prompt) => setFormData(prev => ({ ...prev, systemPrompt: prompt }))} />

        <div className="grid gap-6 lg:grid-cols-2">
          {/* AI Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Configuração da IA
              </CardTitle>
              <CardDescription>
                Personalize como a IA vai responder seus clientes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Prompt Library Button */}
              <Button
                onClick={() => setShowLibrary(true)}
                variant="outline"
                className="w-full gap-2 border-dashed border-2 hover:border-primary hover:bg-primary/5"
                type="button"
              >
                <Library className="h-4 w-4" />
                📚 Escolher Prompt Profissional
              </Button>

              <div className="space-y-2">
                <Label>Prompt do Sistema</Label>
                <Textarea
                  placeholder="Você é um assistente virtual da loja XYZ. Seja cordial e objetivo..."
                  value={formData.systemPrompt}
                  onChange={(e) =>
                    setFormData({ ...formData, systemPrompt: e.target.value })
                  }
                  rows={8}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Define a personalidade e comportamento da IA
                </p>
              </div>

              <div className="space-y-2">
                <Label>Mensagem de Boas-vindas (opcional)</Label>
                <Textarea
                  placeholder="Olá! 👋 Como posso ajudar você hoje?"
                  value={formData.welcomeMessage}
                  onChange={(e) =>
                    setFormData({ ...formData, welcomeMessage: e.target.value })
                  }
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Mensagem de Fallback</Label>
                <Input
                  placeholder="Desculpe, não entendi. Pode reformular?"
                  value={formData.fallbackMessage}
                  onChange={(e) =>
                    setFormData({ ...formData, fallbackMessage: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Enviada quando a IA não consegue responder
                </p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">Classificar Leads Automaticamente</p>
                  <p className="text-sm text-muted-foreground">
                    Identifica leads quentes baseado nas conversas
                  </p>
                </div>
                <Switch
                  checked={formData.autoClassifyLeads}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, autoClassifyLeads: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Voice IA Configuration (Elite) */}
          <Card className="border-primary/40 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5 text-primary" />
                Voz IA - ElevenLabs (Elite)
              </CardTitle>
              <CardDescription>
                Habilite o Agente de Voz para responder com áudios ultra-realistas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-primary/20">
                <div>
                  <p className="text-sm font-medium">Ativar Respostas por Áudio</p>
                  <p className="text-xs text-muted-foreground">A IA enviará um áudio após o texto.</p>
                </div>
                <Switch />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">ElevenLabs API Key</Label>
                <Input type="password" placeholder="Chave da API ElevenLabs" className="text-xs" />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Voice ID (Clone)</Label>
                <div className="flex gap-2">
                  <Input placeholder="ID da Voz Clonada" className="text-xs" />
                  <Button size="sm" variant="outline" className="h-8">
                    <Volume2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[10px] text-blue-600 leading-relaxed italic">
                💡 O Agente de Voz (EUA Style) funciona melhor com o prompt de "Vendedor de Voz Autônomo" instalado acima.
              </div>
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Horário de Funcionamento
              </CardTitle>
              <CardDescription>
                Defina quando o chatbot deve responder
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Início</Label>
                  <Input
                    type="time"
                    value={formData.workingHoursStart}
                    onChange={(e) =>
                      setFormData({ ...formData, workingHoursStart: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fim</Label>
                  <Input
                    type="time"
                    value={formData.workingHoursEnd}
                    onChange={(e) =>
                      setFormData({ ...formData, workingHoursEnd: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Dias de Funcionamento</Label>
                <div className="flex gap-2 flex-wrap">
                  {dayNames.map((day, index) => (
                    <Button
                      key={day}
                      variant={formData.workingDays.includes(index) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        const days = formData.workingDays.includes(index)
                          ? formData.workingDays.filter((d) => d !== index)
                          : [...formData.workingDays, index].sort();
                        setFormData({ ...formData, workingDays: days });
                      }}
                      className={
                        formData.workingDays.includes(index)
                          ? "bg-[hsl(var(--whatsapp))] hover:bg-[hsl(var(--whatsapp))]/90"
                          : ""
                      }
                    >
                      {day}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-600">IA Google Gemini</p>
                    <p className="text-xs text-muted-foreground">
                      O chatbot usa o modelo Gemini 3 Flash para respostas rápidas e inteligentes
                    </p>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <Card className="bg-muted/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Preview da Conversa
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-[#e5ddd5] dark:bg-[#0b141a] rounded-lg p-3 space-y-2">
                    {/* User message */}
                    <div className="bg-white dark:bg-[#202c33] rounded-lg p-2 max-w-[80%] shadow">
                      <p className="text-sm">Olá, vocês têm esse produto?</p>
                    </div>
                    {/* AI response */}
                    <div className="bg-[#dcf8c6] dark:bg-[#005c4b] rounded-lg p-2 max-w-[80%] ml-auto shadow">
                      <p className="text-sm">
                        {formData.systemPrompt
                          ? "Olá! 👋 Sim, temos esse produto disponível! Posso te ajudar com mais informações?"
                          : "Configure o prompt para ver o preview"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                As configurações serão aplicadas imediatamente após salvar
              </p>
              <Button
                className="gap-2 bg-[hsl(var(--whatsapp))] hover:bg-[hsl(var(--whatsapp))]/90"
                onClick={handleSave}
                disabled={upsertConfig.isPending}
              >
                <Save className="h-4 w-4" />
                {upsertConfig.isPending ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog da Biblioteca de Prompts */}
      <Dialog open={showLibrary} onOpenChange={setShowLibrary}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Library className="h-5 w-5" />
              Biblioteca de Prompts Profissionais
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[65vh] pr-2">
            <PromptLibrary onInstall={handleInstallPrompt} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de Preview/Instalação */}
      <PromptPreview
        prompt={selectedPrompt}
        open={!!selectedPrompt}
        onClose={() => setSelectedPrompt(null)}
        onConfirm={handleConfirmInstall}
      />
    </WhatsAppLayout>
  );
}
