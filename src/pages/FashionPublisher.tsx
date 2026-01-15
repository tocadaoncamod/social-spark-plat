import { useState } from "react";
import { FastMossLayout } from "@/components/fastmoss/FastMossLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Shirt,
  Link,
  Sparkles,
  Loader2,
  Youtube,
  Instagram,
  Facebook,
  MessageCircle,
  Music2,
  Send,
  Linkedin,
  Copy,
  Check,
  ExternalLink,
  Wand2,
  Share2,
  Eye,
  Hash,
  Type,
  AlertCircle
} from "lucide-react";

const platforms = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400' },
  { id: 'tiktok', name: 'TikTok', icon: Music2, color: 'bg-black' },
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'bg-red-500' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
  { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: 'bg-green-500' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700' },
  { id: 'telegram', name: 'Telegram', icon: Send, color: 'bg-sky-500' },
];

interface GeneratedContent {
  titulo?: string;
  descricao: string;
  hashtags: string[];
  cta: string;
  emojis: string[];
  characterCount: {
    descricao: number;
    titulo?: number;
    hashtags: number;
    total: number;
  };
  limits: {
    descricao?: { max: number; recomendado: number };
    titulo?: { max: number; recomendado: number };
    hashtags?: { max: number; recomendado: number };
  };
}

interface ProductInfo {
  name: string;
  category: string;
  price?: string;
  description?: string;
  features?: string[];
}

export default function FashionPublisher() {
  const [productUrl, setProductUrl] = useState("");
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram', 'tiktok']);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  const [contents, setContents] = useState<Record<string, GeneratedContent>>({});
  const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('instagram');

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const analyzeLink = async () => {
    if (!productUrl.trim()) {
      toast.error("Cole o link do produto");
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast.error("Selecione pelo menos uma plataforma");
      return;
    }

    setIsAnalyzing(true);
    setProductInfo(null);
    setContents({});

    try {
      const { data, error } = await supabase.functions.invoke("analyze-fashion-link", {
        body: {
          url: productUrl,
          platforms: selectedPlatforms,
          storeName: storeName || 'Minha Loja',
          storeDescription
        }
      });

      if (error) throw error;

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      setProductInfo(data.productInfo);
      setContents(data.contents);
      setActiveTab(selectedPlatforms[0]);
      toast.success("Conteúdo gerado com sucesso!");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Erro ao analisar link. Tente novamente.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = async (platform: string) => {
    const content = contents[platform];
    if (!content) return;

    const fullText = [
      content.titulo,
      content.descricao,
      '',
      content.hashtags.map(h => `#${h}`).join(' ')
    ].filter(Boolean).join('\n');

    await navigator.clipboard.writeText(fullText);
    setCopiedPlatform(platform);
    toast.success(`Copiado para ${platform}!`);
    setTimeout(() => setCopiedPlatform(null), 2000);
  };

  const updateContent = (platform: string, field: keyof GeneratedContent, value: any) => {
    setContents(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [field]: value,
        characterCount: {
          ...prev[platform].characterCount,
          [field]: typeof value === 'string' ? value.length : prev[platform].characterCount[field as keyof typeof prev[typeof platform]['characterCount']]
        }
      }
    }));
  };

  const getCharacterStatus = (current: number, max: number, recommended: number) => {
    if (current > max) return { color: 'text-destructive', status: 'excedido' };
    if (current > recommended) return { color: 'text-yellow-500', status: 'alto' };
    return { color: 'text-green-500', status: 'ok' };
  };

  return (
    <FastMossLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Shirt className="h-8 w-8 text-primary" />
              Fashion Publisher
            </h1>
            <p className="text-muted-foreground mt-1">
              Cole o link do produto → IA gera conteúdo → Publique com 1 clique
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="h-5 w-5" />
                  Link do Produto
                </CardTitle>
                <CardDescription>
                  Cole o link do seu produto de moda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="url">URL do Produto</Label>
                  <Input
                    id="url"
                    placeholder="https://sualoja.com/produto/vestido-floral"
                    value={productUrl}
                    onChange={(e) => setProductUrl(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="store">Nome da Loja</Label>
                  <Input
                    id="store"
                    placeholder="Minha Boutique"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="desc">Descrição da Loja (opcional)</Label>
                  <Textarea
                    id="desc"
                    placeholder="Moda feminina sustentável para mulheres modernas..."
                    value={storeDescription}
                    onChange={(e) => setStoreDescription(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Platforms Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Plataformas
                </CardTitle>
                <CardDescription>
                  Selecione onde deseja publicar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {platforms.map((platform) => {
                    const Icon = platform.icon;
                    const isSelected = selectedPlatforms.includes(platform.id);
                    
                    return (
                      <div
                        key={platform.id}
                        onClick={() => togglePlatform(platform.id)}
                        className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:bg-muted/50'
                        }`}
                      >
                        <Checkbox checked={isSelected} />
                        <div className={`p-1.5 rounded ${platform.color}`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm font-medium">{platform.name}</span>
                      </div>
                    );
                  })}
                </div>

                <Button
                  className="w-full mt-4 gap-2"
                  size="lg"
                  onClick={analyzeLink}
                  disabled={isAnalyzing || !productUrl.trim() || selectedPlatforms.length === 0}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analisando com IA...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4" />
                      Gerar Conteúdo
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Product Info */}
            {productInfo && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Produto Detectado
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm text-muted-foreground">Nome:</span>
                    <p className="font-medium">{productInfo.name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Categoria:</span>
                    <Badge variant="outline" className="ml-2">{productInfo.category}</Badge>
                  </div>
                  {productInfo.price && (
                    <div>
                      <span className="text-sm text-muted-foreground">Preço:</span>
                      <p className="font-bold text-lg text-primary">{productInfo.price}</p>
                    </div>
                  )}
                  {productInfo.features && productInfo.features.length > 0 && (
                    <div>
                      <span className="text-sm text-muted-foreground">Características:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {productInfo.features.map((f, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{f}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Content Preview Section */}
          <div className="lg:col-span-2">
            {Object.keys(contents).length === 0 ? (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center py-16">
                  <Sparkles className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Pronto para criar conteúdo!</h3>
                  <p className="text-muted-foreground max-w-md">
                    Cole o link do seu produto de moda e a IA vai gerar automaticamente 
                    conteúdo otimizado para cada plataforma, respeitando os limites de caracteres.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Conteúdo Gerado
                  </CardTitle>
                  <CardDescription>
                    Edite se necessário e copie para publicar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-4 lg:grid-cols-7 mb-4">
                      {selectedPlatforms.map(platformId => {
                        const platform = platforms.find(p => p.id === platformId);
                        if (!platform) return null;
                        const Icon = platform.icon;
                        
                        return (
                          <TabsTrigger key={platformId} value={platformId} className="gap-1">
                            <Icon className="h-4 w-4" />
                            <span className="hidden sm:inline">{platform.name}</span>
                          </TabsTrigger>
                        );
                      })}
                    </TabsList>

                    {selectedPlatforms.map(platformId => {
                      const content = contents[platformId];
                      if (!content) return null;
                      
                      const descStatus = content.limits.descricao 
                        ? getCharacterStatus(content.characterCount.descricao, content.limits.descricao.max, content.limits.descricao.recomendado)
                        : { color: 'text-muted-foreground', status: 'ok' };

                      return (
                        <TabsContent key={platformId} value={platformId} className="space-y-4">
                          {/* Title (if applicable) */}
                          {content.titulo && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label className="flex items-center gap-2">
                                  <Type className="h-4 w-4" />
                                  Título
                                </Label>
                                <span className={`text-xs ${
                                  content.limits.titulo 
                                    ? getCharacterStatus(content.characterCount.titulo || 0, content.limits.titulo.max, content.limits.titulo.recomendado).color
                                    : 'text-muted-foreground'
                                }`}>
                                  {content.characterCount.titulo || 0}
                                  {content.limits.titulo && `/${content.limits.titulo.max}`}
                                </span>
                              </div>
                              <Input
                                value={content.titulo}
                                onChange={(e) => updateContent(platformId, 'titulo', e.target.value)}
                              />
                              {content.limits.titulo && content.characterCount.titulo && content.characterCount.titulo > content.limits.titulo.max && (
                                <p className="text-xs text-destructive flex items-center gap-1">
                                  <AlertCircle className="h-3 w-3" />
                                  Título excede o limite. Reduza {content.characterCount.titulo - content.limits.titulo.max} caracteres.
                                </p>
                              )}
                            </div>
                          )}

                          {/* Description */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="flex items-center gap-2">
                                <Type className="h-4 w-4" />
                                Descrição/Legenda
                              </Label>
                              <span className={`text-xs ${descStatus.color}`}>
                                {content.characterCount.descricao}
                                {content.limits.descricao && `/${content.limits.descricao.max}`}
                                {content.limits.descricao && ` (ideal: ${content.limits.descricao.recomendado})`}
                              </span>
                            </div>
                            <Textarea
                              value={content.descricao}
                              onChange={(e) => updateContent(platformId, 'descricao', e.target.value)}
                              className="min-h-[150px]"
                            />
                            {content.limits.descricao && (
                              <Progress 
                                value={(content.characterCount.descricao / content.limits.descricao.max) * 100} 
                                className={`h-1 ${
                                  content.characterCount.descricao > content.limits.descricao.max 
                                    ? '[&>div]:bg-destructive' 
                                    : content.characterCount.descricao > content.limits.descricao.recomendado 
                                      ? '[&>div]:bg-yellow-500' 
                                      : ''
                                }`}
                              />
                            )}
                          </div>

                          {/* Hashtags */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="flex items-center gap-2">
                                <Hash className="h-4 w-4" />
                                Hashtags
                              </Label>
                              <span className="text-xs text-muted-foreground">
                                {content.hashtags.length}
                                {content.limits.hashtags && `/${content.limits.hashtags.max}`}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg">
                              {content.hashtags.map((tag, i) => (
                                <Badge key={i} variant="secondary" className="text-sm">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* CTA */}
                          <div className="space-y-2">
                            <Label>Call to Action</Label>
                            <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg border border-primary/20">
                              <Sparkles className="h-4 w-4 text-primary" />
                              <span className="font-medium">{content.cta}</span>
                            </div>
                          </div>

                          {/* Emojis */}
                          {content.emojis && content.emojis.length > 0 && (
                            <div className="space-y-2">
                              <Label>Emojis Sugeridos</Label>
                              <div className="flex gap-2 text-2xl">
                                {content.emojis.map((emoji, i) => (
                                  <span key={i}>{emoji}</span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2 pt-4 border-t">
                            <Button
                              variant="default"
                              className="flex-1 gap-2"
                              onClick={() => copyToClipboard(platformId)}
                            >
                              {copiedPlatform === platformId ? (
                                <>
                                  <Check className="h-4 w-4" />
                                  Copiado!
                                </>
                              ) : (
                                <>
                                  <Copy className="h-4 w-4" />
                                  Copiar Tudo
                                </>
                              )}
                            </Button>
                            <Button variant="outline" className="gap-2">
                              <ExternalLink className="h-4 w-4" />
                              Abrir {platforms.find(p => p.id === platformId)?.name}
                            </Button>
                          </div>
                        </TabsContent>
                      );
                    })}
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </FastMossLayout>
  );
}
