import { useState } from "react";
import { WhatsAppLayout } from "@/components/whatsapp/WhatsAppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useWhatsAppLeads,
  useLeadRules,
  useUpdateLead,
  useCreateLeadRule,
  useDeleteLeadRule,
} from "@/hooks/useWhatsAppLeads";
import {
  Target,
  Flame,
  Thermometer,
  Snowflake,
  Plus,
  Search,
  Trash2,
  Settings,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function WhatsAppLeads() {
  const [filter, setFilter] = useState("all");
  const { data: leads, isLoading } = useWhatsAppLeads(filter === "all" ? undefined : filter);
  const { data: rules } = useLeadRules();
  const updateLead = useUpdateLead();
  const createRule = useCreateLeadRule();
  const deleteRule = useDeleteLeadRule();

  const [search, setSearch] = useState("");
  const [rulesDialogOpen, setRulesDialogOpen] = useState(false);
  const [newRule, setNewRule] = useState({
    name: "",
    keywords: "",
    classification: "warm",
    scoreChange: 10,
  });

  const filteredLeads = leads?.filter(
    (l) =>
      l.contact?.name?.toLowerCase().includes(search.toLowerCase()) ||
      l.contact?.phone.includes(search)
  );

  const handleCreateRule = async () => {
    if (!newRule.name || !newRule.keywords) return;

    await createRule.mutateAsync({
      name: newRule.name,
      keywords: newRule.keywords.split(",").map((k) => k.trim()),
      classification: newRule.classification,
      score_change: newRule.scoreChange,
      is_active: true,
    });

    setNewRule({
      name: "",
      keywords: "",
      classification: "warm",
      scoreChange: 10,
    });
  };

  const classificationBadge = (classification: string) => {
    switch (classification) {
      case "hot":
        return (
          <Badge className="bg-red-500/10 text-red-600 gap-1">
            <Flame className="h-3 w-3" />
            Quente
          </Badge>
        );
      case "warm":
        return (
          <Badge className="bg-orange-500/10 text-orange-600 gap-1">
            <Thermometer className="h-3 w-3" />
            Morno
          </Badge>
        );
      case "cold":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 gap-1">
            <Snowflake className="h-3 w-3" />
            Frio
          </Badge>
        );
      case "converted":
        return (
          <Badge className="bg-green-500/10 text-green-600">
            Convertido
          </Badge>
        );
      case "lost":
        return (
          <Badge className="bg-gray-500/10 text-gray-600">
            Perdido
          </Badge>
        );
      default:
        return <Badge variant="outline">Novo</Badge>;
    }
  };

  const hotLeads = leads?.filter((l) => l.classification === "hot").length || 0;
  const warmLeads = leads?.filter((l) => l.classification === "warm").length || 0;
  const coldLeads = leads?.filter((l) => l.classification === "cold").length || 0;

  return (
    <WhatsAppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Leads</h1>
            <p className="text-muted-foreground">
              Qualifique e gerencie seus leads de WhatsApp
            </p>
          </div>
          <Dialog open={rulesDialogOpen} onOpenChange={setRulesDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Settings className="h-4 w-4" />
                Regras de Classificação
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Regras de Classificação</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* Existing Rules */}
                {rules && rules.length > 0 && (
                  <div className="space-y-2">
                    <Label>Regras Ativas</Label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {rules.map((rule) => (
                        <div
                          key={rule.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                        >
                          <div>
                            <p className="font-medium text-sm">{rule.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {rule.keywords.join(", ")} → {rule.classification}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteRule.mutate(rule.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Rule Form */}
                <div className="space-y-3 pt-4 border-t">
                  <Label>Nova Regra</Label>
                  <Input
                    placeholder="Nome da regra"
                    value={newRule.name}
                    onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  />
                  <Input
                    placeholder="Palavras-chave (separadas por vírgula)"
                    value={newRule.keywords}
                    onChange={(e) => setNewRule({ ...newRule, keywords: e.target.value })}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Select
                      value={newRule.classification}
                      onValueChange={(v) =>
                        setNewRule({ ...newRule, classification: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hot">Quente</SelectItem>
                        <SelectItem value="warm">Morno</SelectItem>
                        <SelectItem value="cold">Frio</SelectItem>
                        <SelectItem value="converted">Convertido</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      placeholder="Pontos"
                      value={newRule.scoreChange}
                      onChange={(e) =>
                        setNewRule({ ...newRule, scoreChange: Number(e.target.value) })
                      }
                    />
                  </div>
                  <Button
                    className="w-full bg-[hsl(var(--whatsapp))] hover:bg-[hsl(var(--whatsapp))]/90"
                    onClick={handleCreateRule}
                    disabled={createRule.isPending}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Regra
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[hsl(var(--whatsapp)/0.1)]">
                  <Target className="h-6 w-6 text-[hsl(var(--whatsapp))]" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{leads?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Total de Leads</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10">
                  <Flame className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{hotLeads}</p>
                  <p className="text-sm text-muted-foreground">Leads Quentes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10">
                  <Thermometer className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{warmLeads}</p>
                  <p className="text-sm text-muted-foreground">Leads Mornos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                  <Snowflake className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{coldLeads}</p>
                  <p className="text-sm text-muted-foreground">Leads Frios</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leads List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Lista de Leads</CardTitle>
              <div className="flex items-center gap-4">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar leads..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Tabs value={filter} onValueChange={setFilter}>
                  <TabsList>
                    <TabsTrigger value="all">Todos</TabsTrigger>
                    <TabsTrigger value="hot">Quentes</TabsTrigger>
                    <TabsTrigger value="warm">Mornos</TabsTrigger>
                    <TabsTrigger value="cold">Frios</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-20" />
                ))}
              </div>
            ) : filteredLeads && filteredLeads.length > 0 ? (
              <div className="space-y-3">
                {filteredLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--whatsapp)/0.1)]">
                        <span className="text-lg font-bold text-[hsl(var(--whatsapp))]">
                          {lead.score}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">
                            {lead.contact?.name || lead.contact?.phone || "—"}
                          </p>
                          {classificationBadge(lead.classification)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {lead.contact?.phone}
                        </p>
                        {lead.keywords_matched && lead.keywords_matched.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {lead.keywords_matched.slice(0, 3).map((kw) => (
                              <Badge key={kw} variant="outline" className="text-xs">
                                {kw}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        Última interação
                      </p>
                      <p className="text-sm">
                        {lead.last_interaction
                          ? format(new Date(lead.last_interaction), "dd/MM/yyyy HH:mm", {
                              locale: ptBR,
                            })
                          : "—"}
                      </p>
                      <Select
                        value={lead.classification}
                        onValueChange={(v) =>
                          updateLead.mutate({ id: lead.id, classification: v })
                        }
                      >
                        <SelectTrigger className="mt-2 w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hot">Quente</SelectItem>
                          <SelectItem value="warm">Morno</SelectItem>
                          <SelectItem value="cold">Frio</SelectItem>
                          <SelectItem value="converted">Convertido</SelectItem>
                          <SelectItem value="lost">Perdido</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                <Target className="h-12 w-12 mb-4 opacity-20" />
                <p>Nenhum lead encontrado</p>
                <p className="text-sm">Leads são criados automaticamente das conversas</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </WhatsAppLayout>
  );
}
