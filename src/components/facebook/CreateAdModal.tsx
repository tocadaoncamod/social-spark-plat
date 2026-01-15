import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Loader2, 
  Sparkles, 
  Image as ImageIcon, 
  Tag, 
  Search, 
  Store,
  Share2,
  Eye,
  RefreshCw,
  Copy,
  Check,
  Zap,
  Target,
  TrendingUp,
  ShoppingBag,
  Users
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useFacebookGrupos } from "@/hooks/useFacebookAutomation";

interface CreateAdModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ProductData {
  nome: string;
  descricao: string;
  preco: number;
  precoOriginal?: number;
  imagens: string[];
  categoria: string;
  palavrasChave: string[];
  condicao: string;
  tamanhos?: string[];
  cores?: string[];
}

interface GeneratedAd {
  titulo: string;
  descricao: string;
  palavrasChave: string[];
  hashtagsOtimizadas: string[];
  textoGrupo: string;
  textoMarketplace: string;
}

export function CreateAdModal({ open, onOpenChange }: CreateAdModalProps) {
  const [linkProduto, setLinkProduto] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [generatedAd, setGeneratedAd] = useState<GeneratedAd | null>(null);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [publishToMarketplace, setPublishToMarketplace] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedPrice, setEditedPrice] = useState("");
  const [customKeywords, setCustomKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState("");

  const { data: grupos } = useFacebookGrupos();

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setLinkProduto("");
    setProductData(null);
    setGeneratedAd(null);
    setSelectedGroups([]);
    setPublishToMarketplace(true);
    setEditedTitle("");
    setEditedDescription("");
    setEditedPrice("");
    setCustomKeywords([]);
    setNewKeyword("");
  };

  const handleAnalyzeLink = async () => {
    if (!linkProduto.trim()) {
      toast.error("Insira um link do produto");
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("facebook-ad-creator", {
        body: { 
          action: "analyze", 
          linkProduto 
        },
      });

      if (error) throw error;

      if (data.success && data.product) {
        setProductData(data.product);
        setEditedTitle(data.product.nome);
        setEditedDescription(data.product.descricao);
        setEditedPrice(data.product.preco.toString());
        setCustomKeywords(data.product.palavrasChave || []);
        toast.success("Produto analisado com sucesso!");
      } else {
        throw new Error(data.error || "Erro ao analisar produto");
      }
    } catch (error: any) {
      console.error("Erro:", error);
      toast.error(error.message || "Erro ao analisar o link");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateAd = async () => {
    if (!productData) return;

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("facebook-ad-creator", {
        body: { 
          action: "generate",
          product: {
            ...productData,
            nome: editedTitle,
            descricao: editedDescription,
            preco: parseFloat(editedPrice),
            palavrasChave: customKeywords,
          }
        },
      });

      if (error) throw error;

      if (data.success && data.ad) {
        setGeneratedAd(data.ad);
        toast.success("Anúncio gerado com IA!");
      }
    } catch (error: any) {
      console.error("Erro:", error);
      toast.error("Erro ao gerar anúncio");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (!generatedAd || !productData) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Faça login para publicar");
      return;
    }

    setIsPublishing(true);
    try {
      const { data, error } = await supabase.functions.invoke("facebook-ad-creator", {
        body: { 
          action: "publish",
          userId: user.id,
          product: {
            ...productData,
            nome: editedTitle,
            descricao: editedDescription,
            preco: parseFloat(editedPrice),
            palavrasChave: [...customKeywords, ...generatedAd.palavrasChave],
          },
          ad: generatedAd,
          selectedGroups,
          publishToMarketplace,
        },
      });

      if (error) throw error;

      if (data.success) {
        toast.success(`Anúncio publicado! ${data.gruposAgendados || 0} grupos agendados`);
        onOpenChange(false);
      }
    } catch (error: any) {
      console.error("Erro:", error);
      toast.error("Erro ao publicar anúncio");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
    toast.success("Copiado!");
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !customKeywords.includes(newKeyword.trim())) {
      setCustomKeywords([...customKeywords, newKeyword.trim()]);
      setNewKeyword("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setCustomKeywords(customKeywords.filter((k) => k !== keyword));
  };

  const toggleGroup = (groupId: string) => {
    setSelectedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  const selectAllGroups = () => {
    if (grupos) {
      setSelectedGroups(grupos.map((g) => g.id));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#1877F2] to-purple-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            Criar Anúncio com IA
          </DialogTitle>
          <DialogDescription>
            Cole o link do produto e a IA criará anúncios otimizados para Facebook Marketplace e Grupos
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-6 pb-4">
            {/* Step 1: Link Input */}
            <Card className="border-2 border-dashed border-muted-foreground/25">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    1
                  </div>
                  <span className="font-medium">Cole o link do produto</span>
                </div>
                <div className="flex gap-2">
                  <Input
                    value={linkProduto}
                    onChange={(e) => setLinkProduto(e.target.value)}
                    placeholder="https://tocadaoncamodas.vercel.app/produto/..."
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleAnalyzeLink} 
                    disabled={isAnalyzing || !linkProduto.trim()}
                    className="bg-[#1877F2] hover:bg-[#1877F2]/90"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analisando...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Analisar
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Product Data */}
            {productData && (
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      2
                    </div>
                    <span className="font-medium">Dados do Produto (Edite se necessário)</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Images Preview */}
                    {productData.imagens && productData.imagens.length > 0 && (
                      <div className="md:col-span-2">
                        <Label className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                          <ImageIcon className="h-3 w-3" />
                          Imagens do Produto
                        </Label>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {productData.imagens.slice(0, 5).map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`Produto ${idx + 1}`}
                              className="w-20 h-20 object-cover rounded-lg border"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder.svg';
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>Título do Anúncio</Label>
                      <Input
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        placeholder="Nome do produto"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Preço (R$)</Label>
                      <Input
                        type="number"
                        value={editedPrice}
                        onChange={(e) => setEditedPrice(e.target.value)}
                        placeholder="0.00"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label>Descrição</Label>
                      <Textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        placeholder="Descrição detalhada do produto"
                        rows={3}
                      />
                    </div>

                    {/* Keywords */}
                    <div className="md:col-span-2 space-y-2">
                      <Label className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        Palavras-chave para Ranquear
                      </Label>
                      <div className="flex gap-2 flex-wrap mb-2">
                        {customKeywords.map((keyword, idx) => (
                          <Badge 
                            key={idx} 
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() => removeKeyword(keyword)}
                          >
                            {keyword} ×
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={newKeyword}
                          onChange={(e) => setNewKeyword(e.target.value)}
                          placeholder="Adicionar palavra-chave"
                          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
                        />
                        <Button variant="outline" onClick={addKeyword} type="button">
                          <Tag className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={handleGenerateAd} 
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-purple-600 to-[#1877F2]"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Gerando Anúncio com IA...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Gerar Anúncio Otimizado com IA
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Generated Ad Preview */}
            {generatedAd && (
              <Card className="border-2 border-green-500/30 bg-green-500/5">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white text-xs font-bold">
                        3
                      </div>
                      <span className="font-medium">Anúncio Gerado</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleGenerateAd}
                      disabled={isGenerating}
                    >
                      <RefreshCw className={`h-4 w-4 mr-1 ${isGenerating ? 'animate-spin' : ''}`} />
                      Regenerar
                    </Button>
                  </div>

                  <Tabs defaultValue="marketplace" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="marketplace" className="gap-1">
                        <Store className="h-4 w-4" />
                        Marketplace
                      </TabsTrigger>
                      <TabsTrigger value="grupos" className="gap-1">
                        <Users className="h-4 w-4" />
                        Grupos
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="marketplace" className="mt-4">
                      <div className="bg-background rounded-lg p-4 border space-y-3">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-lg">{generatedAd.titulo}</h4>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCopy(generatedAd.titulo, 'titulo')}
                          >
                            {copiedField === 'titulo' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                        <div className="flex justify-between items-start">
                          <p className="text-sm text-muted-foreground whitespace-pre-line">
                            {generatedAd.textoMarketplace}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCopy(generatedAd.textoMarketplace, 'marketplace')}
                          >
                            {copiedField === 'marketplace' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="grupos" className="mt-4">
                      <div className="bg-background rounded-lg p-4 border space-y-3">
                        <div className="flex justify-between items-start">
                          <p className="text-sm whitespace-pre-line">{generatedAd.textoGrupo}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCopy(generatedAd.textoGrupo, 'grupo')}
                          >
                            {copiedField === 'grupo' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* Keywords & Hashtags */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                        <Target className="h-3 w-3" />
                        Palavras-chave SEO
                      </Label>
                      <div className="flex gap-1 flex-wrap">
                        {generatedAd.palavrasChave.map((kw, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {kw}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                        <TrendingUp className="h-3 w-3" />
                        Hashtags Otimizadas
                      </Label>
                      <div className="flex gap-1 flex-wrap">
                        {generatedAd.hashtagsOtimizadas.map((ht, idx) => (
                          <Badge key={idx} className="text-xs bg-[#1877F2]">
                            {ht}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Publish Options */}
            {generatedAd && (
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      4
                    </div>
                    <span className="font-medium">Publicar</span>
                  </div>

                  {/* Marketplace Toggle */}
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5 text-[#1877F2]" />
                      <div>
                        <p className="font-medium">Facebook Marketplace</p>
                        <p className="text-xs text-muted-foreground">Publicar no Marketplace</p>
                      </div>
                    </div>
                    <Checkbox
                      checked={publishToMarketplace}
                      onCheckedChange={(checked) => setPublishToMarketplace(checked as boolean)}
                    />
                  </div>

                  {/* Groups Selection */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Selecionar Grupos ({selectedGroups.length})
                      </Label>
                      <Button variant="link" size="sm" onClick={selectAllGroups}>
                        Selecionar Todos
                      </Button>
                    </div>
                    <div className="max-h-40 overflow-y-auto space-y-2 border rounded-lg p-2">
                      {grupos && grupos.length > 0 ? (
                        grupos.map((grupo) => (
                          <div
                            key={grupo.id}
                            className="flex items-center justify-between p-2 hover:bg-muted/50 rounded cursor-pointer"
                            onClick={() => toggleGroup(grupo.id)}
                          >
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={selectedGroups.includes(grupo.id)}
                                onCheckedChange={() => toggleGroup(grupo.id)}
                              />
                              <span className="text-sm">{grupo.nome}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {grupo.membros.toLocaleString()} membros
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Nenhum grupo cadastrado. Adicione grupos primeiro.
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        {generatedAd && (
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handlePublish}
              disabled={isPublishing || (selectedGroups.length === 0 && !publishToMarketplace)}
              className="bg-gradient-to-r from-green-500 to-[#1877F2]"
            >
              {isPublishing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Publicando...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Publicar Anúncio
                </>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
