import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  MessageSquare, 
  Plus, 
  Edit2, 
  Trash2, 
  DollarSign, 
  Truck, 
  CreditCard, 
  Package, 
  Clock, 
  ShieldCheck,
  Copy,
  Sparkles
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ResponseTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Template {
  id: string;
  name: string;
  category: string;
  template_text: string;
  variables: string[];
  is_active: boolean;
  usage_count: number;
}

const CATEGORIES = [
  { id: 'preco', label: 'Preço', icon: DollarSign, color: 'bg-green-500' },
  { id: 'entrega', label: 'Entrega', icon: Truck, color: 'bg-blue-500' },
  { id: 'parcelamento', label: 'Parcelamento', icon: CreditCard, color: 'bg-purple-500' },
  { id: 'disponibilidade', label: 'Disponibilidade', icon: Package, color: 'bg-orange-500' },
  { id: 'prazo', label: 'Prazo', icon: Clock, color: 'bg-yellow-500' },
  { id: 'garantia', label: 'Garantia', icon: ShieldCheck, color: 'bg-red-500' },
  { id: 'geral', label: 'Geral', icon: MessageSquare, color: 'bg-gray-500' }
];

const DEFAULT_TEMPLATES = [
  {
    category: 'preco',
    name: 'Informar Preço',
    template_text: 'Olá! 😊 O valor do {{produto}} é R$ {{preco}}. Posso ajudar com mais alguma informação?',
    variables: ['produto', 'preco']
  },
  {
    category: 'preco',
    name: 'Desconto Especial',
    template_text: 'Boa notícia! 🎉 Para você, temos um desconto especial de {{desconto}}% no {{produto}}. De R$ {{preco_original}} por apenas R$ {{preco_final}}!',
    variables: ['desconto', 'produto', 'preco_original', 'preco_final']
  },
  {
    category: 'entrega',
    name: 'Prazo de Entrega',
    template_text: 'Entregamos para {{cidade}} em {{prazo}} dias úteis! 🚚 O frete fica em R$ {{frete}}. Posso finalizar seu pedido?',
    variables: ['cidade', 'prazo', 'frete']
  },
  {
    category: 'entrega',
    name: 'Frete Grátis',
    template_text: 'Ótima notícia! 🎁 Para compras acima de R$ {{valor_minimo}}, o FRETE É GRÁTIS para todo o Brasil!',
    variables: ['valor_minimo']
  },
  {
    category: 'parcelamento',
    name: 'Parcelamento Cartão',
    template_text: 'Parcelamos em até {{parcelas}}x sem juros no cartão! 💳 Parcelas de R$ {{valor_parcela}}. Qual cartão você prefere?',
    variables: ['parcelas', 'valor_parcela']
  },
  {
    category: 'parcelamento',
    name: 'PIX com Desconto',
    template_text: 'No PIX, você ganha {{desconto}}% de desconto! 💰 O valor fica R$ {{valor_pix}}. Envio a chave PIX agora?',
    variables: ['desconto', 'valor_pix']
  },
  {
    category: 'disponibilidade',
    name: 'Em Estoque',
    template_text: 'Sim, temos o {{produto}} em estoque! ✅ Disponível nos tamanhos: {{tamanhos}}. Qual você gostaria?',
    variables: ['produto', 'tamanhos']
  },
  {
    category: 'disponibilidade',
    name: 'Sem Estoque',
    template_text: 'Infelizmente o {{produto}} está esgotado no momento 😔 Mas temos novidades chegando {{previsao}}! Quer que eu avise quando chegar?',
    variables: ['produto', 'previsao']
  },
  {
    category: 'garantia',
    name: 'Garantia do Produto',
    template_text: 'Todos os nossos produtos têm {{garantia}} de garantia! 🛡️ Caso tenha qualquer problema, é só entrar em contato.',
    variables: ['garantia']
  },
  {
    category: 'geral',
    name: 'Saudação Inicial',
    template_text: 'Olá {{nome}}! 👋 Seja bem-vindo(a) à {{loja}}! Em que posso ajudar você hoje?',
    variables: ['nome', 'loja']
  }
];

export function ResponseTemplatesModal({ isOpen, onClose }: ResponseTemplatesModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  
  // Form state
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('geral');
  const [formText, setFormText] = useState('');
  const [formVariables, setFormVariables] = useState<string[]>([]);

  const { data: templates, isLoading } = useQuery({
    queryKey: ['facebook-response-templates'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('facebook_response_templates')
        .select('*')
        .eq('user_id', user.id)
        .order('usage_count', { ascending: false });

      if (error) throw error;
      return data as Template[];
    }
  });

  const createTemplateMutation = useMutation({
    mutationFn: async (template: Omit<Template, 'id' | 'usage_count'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('facebook_response_templates')
        .insert({
          user_id: user.id,
          name: template.name,
          category: template.category,
          template_text: template.template_text,
          variables: template.variables,
          is_active: template.is_active
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facebook-response-templates'] });
      toast({ title: "Template criado com sucesso!" });
      resetForm();
    },
    onError: (error) => {
      toast({ title: "Erro ao criar template", description: error.message, variant: "destructive" });
    }
  });

  const updateTemplateMutation = useMutation({
    mutationFn: async (template: Template) => {
      const { data, error } = await supabase
        .from('facebook_response_templates')
        .update({
          name: template.name,
          category: template.category,
          template_text: template.template_text,
          variables: template.variables,
          is_active: template.is_active
        })
        .eq('id', template.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facebook-response-templates'] });
      toast({ title: "Template atualizado!" });
      resetForm();
    },
    onError: (error) => {
      toast({ title: "Erro ao atualizar", description: error.message, variant: "destructive" });
    }
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('facebook_response_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facebook-response-templates'] });
      toast({ title: "Template excluído!" });
    },
    onError: (error) => {
      toast({ title: "Erro ao excluir", description: error.message, variant: "destructive" });
    }
  });

  const createDefaultTemplatesMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const templatesWithUser = DEFAULT_TEMPLATES.map(t => ({
        user_id: user.id,
        name: t.name,
        category: t.category,
        template_text: t.template_text,
        variables: t.variables,
        is_active: true
      }));

      const { error } = await supabase
        .from('facebook_response_templates')
        .insert(templatesWithUser);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facebook-response-templates'] });
      toast({ title: "Templates padrão criados!", description: `${DEFAULT_TEMPLATES.length} templates adicionados` });
    },
    onError: (error) => {
      toast({ title: "Erro ao criar templates", description: error.message, variant: "destructive" });
    }
  });

  const resetForm = () => {
    setFormName('');
    setFormCategory('geral');
    setFormText('');
    setFormVariables([]);
    setIsCreating(false);
    setEditingTemplate(null);
  };

  const extractVariables = (text: string): string[] => {
    const matches = text.match(/\{\{(\w+)\}\}/g);
    if (!matches) return [];
    return [...new Set(matches.map(m => m.replace(/\{\{|\}\}/g, '')))];
  };

  const handleTextChange = (text: string) => {
    setFormText(text);
    setFormVariables(extractVariables(text));
  };

  const handleSave = () => {
    if (!formName || !formText) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }

    const templateData = {
      name: formName,
      category: formCategory,
      template_text: formText,
      variables: formVariables,
      is_active: true
    };

    if (editingTemplate) {
      updateTemplateMutation.mutate({ ...templateData, id: editingTemplate.id, usage_count: editingTemplate.usage_count });
    } else {
      createTemplateMutation.mutate(templateData);
    }
  };

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    setFormName(template.name);
    setFormCategory(template.category);
    setFormText(template.template_text);
    setFormVariables(template.variables || []);
    setIsCreating(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado para a área de transferência!" });
  };

  const filteredTemplates = templates?.filter(t => 
    selectedCategory === 'all' || t.category === selectedCategory
  ) || [];

  const getCategoryInfo = (categoryId: string) => {
    return CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[CATEGORIES.length - 1];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Templates de Respostas
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="templates" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="templates">Meus Templates</TabsTrigger>
            <TabsTrigger value="criar">{editingTemplate ? 'Editar' : 'Criar'} Template</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-4">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <Badge 
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedCategory('all')}
              >
                Todos
              </Badge>
              {CATEGORIES.map(cat => (
                <Badge
                  key={cat.id}
                  variant={selectedCategory === cat.id ? 'default' : 'outline'}
                  className="cursor-pointer flex items-center gap-1"
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <cat.icon className="h-3 w-3" />
                  {cat.label}
                </Badge>
              ))}
            </div>

            {/* Templates List */}
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Carregando...</div>
            ) : filteredTemplates.length === 0 ? (
              <div className="text-center py-8 space-y-4">
                <p className="text-muted-foreground">Nenhum template encontrado</p>
                <Button onClick={() => createDefaultTemplatesMutation.mutate()} disabled={createDefaultTemplatesMutation.isPending}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  {createDefaultTemplatesMutation.isPending ? 'Criando...' : 'Criar Templates Padrão'}
                </Button>
              </div>
            ) : (
              <div className="grid gap-3">
                {filteredTemplates.map(template => {
                  const catInfo = getCategoryInfo(template.category);
                  return (
                    <Card key={template.id} className={!template.is_active ? 'opacity-50' : ''}>
                      <CardHeader className="py-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded ${catInfo.color}`}>
                              <catInfo.icon className="h-3 w-3 text-white" />
                            </div>
                            <CardTitle className="text-sm">{template.name}</CardTitle>
                            <Badge variant="outline" className="text-xs">
                              {catInfo.label}
                            </Badge>
                            {template.usage_count > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                Usado {template.usage_count}x
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(template.template_text)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(template)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => deleteTemplateMutation.mutate(template.id)}
                              disabled={deleteTemplateMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="py-2">
                        <p className="text-sm text-muted-foreground">{template.template_text}</p>
                        {template.variables && template.variables.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {template.variables.map((v: string) => (
                              <Badge key={v} variant="secondary" className="text-xs">
                                {`{{${v}}}`}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="criar" className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome do Template</Label>
                  <Input
                    placeholder="Ex: Informar preço do produto"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Select value={formCategory} onValueChange={setFormCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>
                          <div className="flex items-center gap-2">
                            <cat.icon className="h-4 w-4" />
                            {cat.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Texto do Template</Label>
                <Textarea
                  placeholder="Use {{variavel}} para criar campos personalizáveis. Ex: Olá {{nome}}, o preço é R$ {{preco}}"
                  value={formText}
                  onChange={(e) => handleTextChange(e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  Dica: Use {`{{nome_da_variavel}}`} para criar campos que serão preenchidos automaticamente
                </p>
              </div>

              {formVariables.length > 0 && (
                <div className="space-y-2">
                  <Label>Variáveis Detectadas</Label>
                  <div className="flex flex-wrap gap-2">
                    {formVariables.map(v => (
                      <Badge key={v} variant="secondary">
                        {`{{${v}}}`}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  onClick={handleSave} 
                  disabled={createTemplateMutation.isPending || updateTemplateMutation.isPending}
                >
                  {createTemplateMutation.isPending || updateTemplateMutation.isPending ? 'Salvando...' : (
                    editingTemplate ? 'Atualizar Template' : 'Criar Template'
                  )}
                </Button>
                {(isCreating || editingTemplate) && (
                  <Button variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
