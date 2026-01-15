import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  X, 
  Plus, 
  MessageCircle, 
  MapPin, 
  Instagram, 
  Sparkles,
  Shirt,
  User,
  Baby,
  ShoppingBag,
  Store,
  Users,
  Tag
} from "lucide-react";
import { useWhatsAppInstances } from "@/hooks/useWhatsAppInstances";
import { CreateCampaignInput } from "@/hooks/useLeadScraper";

interface NewCampaignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateCampaignInput) => void;
  isLoading?: boolean;
}

const availableSources = [
  { id: "whatsapp_status", label: "WhatsApp Status", icon: MessageCircle, description: "Extrair de status publicados" },
  { id: "google_maps", label: "Google Maps", icon: MapPin, description: "Empresas com WhatsApp" },
  { id: "instagram", label: "Instagram", icon: Instagram, description: "Perfis com WhatsApp na bio" },
];

// Fashion categories for filtering
const fashionCategories = [
  { 
    id: "atacadista", 
    label: "Atacadistas", 
    icon: Store, 
    description: "Vendedores/Fornecedores de atacado",
    color: "bg-blue-500"
  },
  { 
    id: "varejista", 
    label: "Varejistas", 
    icon: ShoppingBag, 
    description: "Lojas e vendedores de varejo",
    color: "bg-green-500"
  },
  { 
    id: "comprador", 
    label: "Compradores", 
    icon: Users, 
    description: "Pessoas procurando produtos",
    color: "bg-purple-500"
  },
  { 
    id: "modaFeminina", 
    label: "Moda Feminina", 
    icon: Shirt, 
    description: "Roupas e looks femininos",
    color: "bg-pink-500"
  },
  { 
    id: "modaMasculina", 
    label: "Moda Masculina", 
    icon: User, 
    description: "Roupas e looks masculinos",
    color: "bg-indigo-500"
  },
  { 
    id: "modaInfantil", 
    label: "Moda Infantil", 
    icon: Baby, 
    description: "Roupas para bebês e crianças",
    color: "bg-yellow-500"
  },
  { 
    id: "acessorios", 
    label: "Acessórios", 
    icon: Tag, 
    description: "Bolsas, bijuterias, etc.",
    color: "bg-orange-500"
  },
];

// Preset keyword suggestions
const keywordSuggestions = [
  "vestido", "blusa", "calça", "saia", "conjunto", "moda", "roupa",
  "atacado", "varejo", "pronta entrega", "disponível", "bolsa", "cinto"
];

export function NewCampaignModal({ 
  open, 
  onOpenChange, 
  onSubmit,
  isLoading 
}: NewCampaignModalProps) {
  const { data: instances } = useWhatsAppInstances();
  const [name, setName] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [sources, setSources] = useState<string[]>(["whatsapp_status"]);
  const [categories, setCategories] = useState<string[]>([]);
  const [instanceId, setInstanceId] = useState<string>("");
  const [location, setLocation] = useState("");
  const [radiusKm, setRadiusKm] = useState(50);
  const [useAI, setUseAI] = useState(true);

  const handleAddKeyword = () => {
    const trimmed = keywordInput.trim().toLowerCase();
    if (trimmed && !keywords.includes(trimmed)) {
      setKeywords([...keywords, trimmed]);
      setKeywordInput("");
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const handleAddSuggestion = (suggestion: string) => {
    if (!keywords.includes(suggestion.toLowerCase())) {
      setKeywords([...keywords, suggestion.toLowerCase()]);
    }
  };

  const toggleSource = (sourceId: string) => {
    if (sources.includes(sourceId)) {
      setSources(sources.filter(s => s !== sourceId));
    } else {
      setSources([...sources, sourceId]);
    }
  };

  const toggleCategory = (categoryId: string) => {
    if (categories.includes(categoryId)) {
      setCategories(categories.filter(c => c !== categoryId));
    } else {
      setCategories([...categories, categoryId]);
    }
  };

  const handleSubmit = () => {
    if (!name.trim() || (keywords.length === 0 && categories.length === 0) || sources.length === 0) return;

    onSubmit({
      name: name.trim(),
      keywords,
      sources,
      instance_id: instanceId || null,
      location: location.trim() || undefined,
      radius_km: radiusKm,
      // @ts-ignore - Extended fields
      categories,
      useAI,
    });

    // Reset form
    setName("");
    setKeywords([]);
    setCategories([]);
    setSources(["whatsapp_status"]);
    setInstanceId("");
    setLocation("");
    setRadiusKm(50);
    setUseAI(true);
  };

  const isValid = name.trim() && (keywords.length > 0 || categories.length > 0) && sources.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[hsl(var(--whatsapp))]" />
            Nova Campanha de Extração
          </DialogTitle>
          <DialogDescription>
            Extraia leads de moda do WhatsApp Status com filtros inteligentes e classificação por IA.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Nome da campanha */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Campanha *</Label>
            <Input
              id="name"
              placeholder="Ex: Atacadistas Moda Feminina SP"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Instância WhatsApp */}
          <div className="space-y-2">
            <Label htmlFor="instance">Instância WhatsApp *</Label>
            <Select value={instanceId} onValueChange={setInstanceId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma instância conectada" />
              </SelectTrigger>
              <SelectContent>
                {instances?.filter(i => i.status === "connected").map((instance) => (
                  <SelectItem key={instance.id} value={instance.id}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      {instance.display_name || instance.instance_name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              A instância precisa estar conectada para extrair status
            </p>
          </div>

          {/* Categorias de Moda */}
          <div className="space-y-3">
            <Label>Categorias de Moda</Label>
            <p className="text-xs text-muted-foreground">
              Selecione as categorias para filtrar automaticamente os status relevantes
            </p>
            <div className="grid grid-cols-2 gap-2">
              {fashionCategories.map((category) => {
                const Icon = category.icon;
                const isSelected = categories.includes(category.id);
                
                return (
                  <div
                    key={category.id}
                    className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${
                      isSelected 
                        ? "border-[hsl(var(--whatsapp))] bg-[hsl(var(--whatsapp)/0.05)] shadow-sm" 
                        : "border-border hover:bg-muted/50"
                    }`}
                    onClick={() => toggleCategory(category.id)}
                  >
                    <Checkbox 
                      checked={isSelected}
                      onCheckedChange={() => toggleCategory(category.id)}
                    />
                    <div className={`p-1 rounded ${category.color}`}>
                      <Icon className="h-3 w-3 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-xs truncate">{category.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Palavras-chave customizadas */}
          <div className="space-y-2">
            <Label>Palavras-chave Adicionais</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Digite e pressione Enter"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button type="button" variant="outline" onClick={handleAddKeyword}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Sugestões */}
            <div className="flex flex-wrap gap-1">
              {keywordSuggestions.filter(s => !keywords.includes(s.toLowerCase())).slice(0, 8).map((suggestion) => (
                <Badge 
                  key={suggestion} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-muted text-xs"
                  onClick={() => handleAddSuggestion(suggestion)}
                >
                  + {suggestion}
                </Badge>
              ))}
            </div>

            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2 p-2 bg-muted/50 rounded-lg">
                {keywords.map((keyword) => (
                  <Badge key={keyword} variant="secondary" className="gap-1">
                    {keyword}
                    <button
                      type="button"
                      onClick={() => handleRemoveKeyword(keyword)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* IA Enhancement */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <div>
                <p className="font-medium text-sm">Classificação por IA</p>
                <p className="text-xs text-muted-foreground">
                  Identifica automaticamente atacadistas, varejistas e compradores
                </p>
              </div>
            </div>
            <Switch
              checked={useAI}
              onCheckedChange={setUseAI}
            />
          </div>

          {/* Fontes */}
          <div className="space-y-3">
            <Label>Fontes de Dados *</Label>
            <div className="space-y-2">
              {availableSources.map((source) => {
                const Icon = source.icon;
                const isSelected = sources.includes(source.id);
                const isDisabled = source.id !== "whatsapp_status"; // Only WhatsApp Status enabled for now
                
                return (
                  <div
                    key={source.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                      isDisabled 
                        ? "opacity-50 cursor-not-allowed" 
                        : isSelected 
                          ? "border-[hsl(var(--whatsapp))] bg-[hsl(var(--whatsapp)/0.05)] cursor-pointer" 
                          : "border-border hover:bg-muted/50 cursor-pointer"
                    }`}
                    onClick={() => !isDisabled && toggleSource(source.id)}
                  >
                    <Checkbox 
                      checked={isSelected}
                      onCheckedChange={() => !isDisabled && toggleSource(source.id)}
                      disabled={isDisabled}
                    />
                    <Icon className={`h-5 w-5 ${isSelected ? "text-[hsl(var(--whatsapp))]" : "text-muted-foreground"}`} />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{source.label}</p>
                      <p className="text-xs text-muted-foreground">{source.description}</p>
                    </div>
                    {isDisabled && (
                      <Badge variant="outline" className="text-xs">Em breve</Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Localização (para Google Maps) */}
          {sources.includes("google_maps") && (
            <div className="space-y-4 p-4 rounded-lg bg-muted/50">
              <div className="space-y-2">
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  placeholder="Ex: São Paulo, SP"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="radius">Raio de busca (km)</Label>
                <Input
                  id="radius"
                  type="number"
                  min={1}
                  max={500}
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(Number(e.target.value))}
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!isValid || isLoading || !instanceId}
            className="bg-[hsl(var(--whatsapp))] hover:bg-[hsl(var(--whatsapp)/0.9)]"
          >
            {isLoading ? "Criando..." : "Criar Campanha"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
