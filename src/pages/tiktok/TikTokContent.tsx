import { useState } from "react";
import { TikTokShopLayout } from "@/components/tiktok/TikTokShopLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTikTokContent, TikTokContent as ContentType } from "@/hooks/useTikTokData";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Plus, 
  Search, 
  Video,
  Radio,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Sparkles,
  Loader2,
  Play
} from "lucide-react";

const contentTypeIcons = {
  video: Video,
  livestream: Radio,
  story: Clock,
};

const statusColors = {
  draft: "bg-gray-500/10 text-gray-500",
  scheduled: "bg-blue-500/10 text-blue-500",
  published: "bg-green-500/10 text-green-500",
  archived: "bg-yellow-500/10 text-yellow-500",
};

const statusLabels = {
  draft: "Rascunho",
  scheduled: "Agendado",
  published: "Publicado",
  archived: "Arquivado",
};

const formatNumber = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};

export default function TikTokContentPage() {
  const { data: content, isLoading, createContent } = useTikTokContent();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const { toast } = useToast();

  const filteredContent = content?.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || item.content_type === typeFilter;
    return matchesSearch && matchesType;
  });

  const videoContent = filteredContent?.filter(c => c.content_type === 'video') || [];
  const livestreamContent = filteredContent?.filter(c => c.content_type === 'livestream') || [];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const contentData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      content_type: (formData.get('content_type') as ContentType['content_type']) || 'video',
      thumbnail_url: formData.get('thumbnail_url') as string,
      video_url: formData.get('video_url') as string,
      status: (formData.get('status') as ContentType['status']) || 'draft',
      views_count: 0,
      likes_count: 0,
      comments_count: 0,
      shares_count: 0,
    };

    try {
      await createContent.mutateAsync(contentData);
      toast({ title: "Conteúdo criado com sucesso!" });
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erro ao criar conteúdo",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const generateSuggestions = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('tiktok-ai-insights', {
        body: { action: 'content_suggestions' }
      });

      if (error) throw error;

      setAiSuggestions(data.suggestions || [
        "Vídeo mostrando bastidores da sua loja",
        "Tutorial de como usar seus produtos mais vendidos",
        "Responda dúvidas frequentes dos clientes",
        "Unboxing dos novos produtos",
        "Colaboração com um influenciador local"
      ]);

      toast({
        title: "Sugestões geradas!",
        description: "Confira as ideias de conteúdo da IA.",
      });
    } catch (error) {
      console.error('Error generating suggestions:', error);
      // Fallback suggestions
      setAiSuggestions([
        "Vídeo mostrando bastidores da sua loja",
        "Tutorial de como usar seus produtos mais vendidos",
        "Responda dúvidas frequentes dos clientes",
        "Unboxing dos novos produtos",
        "Colaboração com um influenciador local"
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <TikTokShopLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Conteúdo</h1>
            <p className="text-muted-foreground">
              Gerencie vídeos, lives e conteúdo do TikTok Shop
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={generateSuggestions}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Sugestões IA
            </Button>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Conteúdo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Novo Conteúdo</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título *</Label>
                    <Input 
                      id="title" 
                      name="title" 
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea 
                      id="description" 
                      name="description"
                      rows={3}
                    />
                  </div>

                  <div className="grid gap-4 grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="content_type">Tipo</Label>
                      <Select name="content_type" defaultValue="video">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="video">Vídeo</SelectItem>
                          <SelectItem value="livestream">Livestream</SelectItem>
                          <SelectItem value="story">Story</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select name="status" defaultValue="draft">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Rascunho</SelectItem>
                          <SelectItem value="scheduled">Agendado</SelectItem>
                          <SelectItem value="published">Publicado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="thumbnail_url">URL da Thumbnail</Label>
                    <Input 
                      id="thumbnail_url" 
                      name="thumbnail_url"
                      type="url"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="video_url">URL do Vídeo</Label>
                    <Input 
                      id="video_url" 
                      name="video_url"
                      type="url"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit"
                      disabled={createContent.isPending}
                    >
                      {createContent.isPending && (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      )}
                      Criar
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* AI Suggestions */}
        {aiSuggestions.length > 0 && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-5 w-5 text-primary" />
                Sugestões de Conteúdo da IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                {aiSuggestions.map((suggestion, index) => (
                  <div 
                    key={index}
                    className="p-3 rounded-lg bg-background border cursor-pointer hover:border-primary transition-colors"
                    onClick={() => {
                      setIsDialogOpen(true);
                    }}
                  >
                    <p className="text-sm">{suggestion}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por título..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="video">Vídeos</SelectItem>
                  <SelectItem value="livestream">Livestreams</SelectItem>
                  <SelectItem value="story">Stories</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="videos" className="space-y-4">
          <TabsList>
            <TabsTrigger value="videos" className="gap-2">
              <Video className="h-4 w-4" />
              Vídeos ({videoContent.length})
            </TabsTrigger>
            <TabsTrigger value="livestreams" className="gap-2">
              <Radio className="h-4 w-4" />
              Livestreams ({livestreamContent.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="videos">
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-64" />
                ))}
              </div>
            ) : videoContent.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {videoContent.map((item) => (
                  <ContentCard key={item.id} content={item} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Video className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="font-medium">Nenhum vídeo encontrado</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Comece criando seu primeiro vídeo
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="livestreams">
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-64" />
                ))}
              </div>
            ) : livestreamContent.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {livestreamContent.map((item) => (
                  <ContentCard key={item.id} content={item} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Radio className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="font-medium">Nenhuma livestream encontrada</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Agende sua primeira livestream
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </TikTokShopLayout>
  );
}

function ContentCard({ content }: { content: ContentType }) {
  const Icon = contentTypeIcons[content.content_type];
  
  return (
    <Card className="overflow-hidden hover-lift">
      <div className="relative aspect-video bg-muted">
        {content.thumbnail_url ? (
          <img 
            src={content.thumbnail_url} 
            alt={content.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-2 left-2 right-2">
          <Badge className={statusColors[content.status]}>
            {statusLabels[content.status]}
          </Badge>
        </div>
        {content.video_url && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-white/90 flex items-center justify-center">
              <Play className="h-5 w-5 text-foreground ml-0.5" />
            </div>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium truncate mb-2">{content.title}</h3>
        {content.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {content.description}
          </p>
        )}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <div className="flex items-center justify-center gap-1 text-muted-foreground">
              <Eye className="h-3 w-3" />
              <span className="text-xs font-medium">{formatNumber(content.views_count)}</span>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 text-muted-foreground">
              <Heart className="h-3 w-3" />
              <span className="text-xs font-medium">{formatNumber(content.likes_count)}</span>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 text-muted-foreground">
              <MessageCircle className="h-3 w-3" />
              <span className="text-xs font-medium">{formatNumber(content.comments_count)}</span>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 text-muted-foreground">
              <Share2 className="h-3 w-3" />
              <span className="text-xs font-medium">{formatNumber(content.shares_count)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
