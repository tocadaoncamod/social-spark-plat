import React, { useState } from 'react';
import { FastMossLayout } from '@/components/fastmoss/FastMossLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Wand2,
  Video,
  FileText,
  Zap,
  MessageSquare,
  Radio,
  Megaphone,
  Copy,
  Check,
  Loader2,
  Clock,
  Hash,
  Music,
  Target,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  Users,
  Sparkles,
  Play,
  RefreshCw,
} from 'lucide-react';
import { useAIScripts, ScriptRequest } from '@/hooks/useAIScripts';

const scriptTypes = [
  { id: 'video_script', name: 'Roteiro de Vídeo', icon: Video, description: 'Roteiros completos para vídeos virais' },
  { id: 'product_description', name: 'Descrição de Produto', icon: FileText, description: 'Textos que vendem para e-commerce' },
  { id: 'hooks', name: 'Ganchos Virais', icon: Zap, description: 'Aberturas que prendem atenção' },
  { id: 'captions', name: 'Legendas & Hashtags', icon: Hash, description: 'Descrições e tags otimizadas' },
  { id: 'live_script', name: 'Roteiro de Live', icon: Radio, description: 'Estrutura para lives de vendas' },
  { id: 'ad_copy', name: 'Copy de Anúncio', icon: Megaphone, description: 'Textos para ads que convertem' },
];

const toneOptions = [
  { value: 'envolvente e divertido', label: 'Divertido' },
  { value: 'profissional e confiável', label: 'Profissional' },
  { value: 'urgente e persuasivo', label: 'Urgente' },
  { value: 'empático e acolhedor', label: 'Empático' },
  { value: 'jovem e descolado', label: 'Jovem' },
  { value: 'luxuoso e exclusivo', label: 'Premium' },
];

const durationOptions = [
  { value: '15 segundos', label: '15s' },
  { value: '30 segundos', label: '30s' },
  { value: '60 segundos', label: '1min' },
  { value: '3 minutos', label: '3min' },
  { value: '30 minutos', label: '30min (Live)' },
  { value: '1 hora', label: '1h (Live)' },
];

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleCopy}>
      {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
};

const AIScripts = () => {
  const [selectedType, setSelectedType] = useState('video_script');
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('jovens 18-35 anos');
  const [tone, setTone] = useState('envolvente e divertido');
  const [duration, setDuration] = useState('30 segundos');
  const [keywords, setKeywords] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');

  const {
    isLoading,
    videoScript,
    productDescription: prodDesc,
    hooks,
    captions,
    liveScript,
    adCopy,
    generateScript,
    clearResults,
  } = useAIScripts();

  const handleGenerate = async () => {
    if (!productName.trim()) {
      return;
    }

    const request: ScriptRequest = {
      action: selectedType,
      productName,
      productDescription,
      targetAudience,
      tone,
      duration,
      keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
      platform: 'TikTok',
      language: 'português brasileiro',
      customPrompt: selectedType === 'custom' ? customPrompt : undefined,
    };

    await generateScript(request);
  };

  const renderVideoScriptResult = () => {
    if (!videoScript) return null;

    return (
      <div className="space-y-6">
        {/* Hook */}
        <Card className="border-primary/50 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5 text-primary" />
              Gancho Inicial (3s)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start justify-between">
              <p className="text-lg font-medium">{videoScript.hook}</p>
              <CopyButton text={videoScript.hook} />
            </div>
          </CardContent>
        </Card>

        {/* Opening */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Play className="h-5 w-5" />
              Abertura
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start justify-between">
              <p>{videoScript.opening}</p>
              <CopyButton text={videoScript.opening} />
            </div>
          </CardContent>
        </Card>

        {/* Body - Timeline */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Video className="h-5 w-5" />
              Corpo do Vídeo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {videoScript.body.map((segment, i) => (
                <div key={i} className="p-4 rounded-lg border bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      {segment.timestamp}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Visual:</span>
                      <p className="font-medium">{segment.visual}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Narração:</span>
                      <p className="font-medium">{segment.narration}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Ação:</span>
                      <p className="font-medium">{segment.action}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Climax & CTA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-warning/50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-warning" />
                Clímax
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start justify-between">
                <p>{videoScript.climax}</p>
                <CopyButton text={videoScript.climax} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-success/50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-5 w-5 text-success" />
                Call to Action
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start justify-between">
                <p>{videoScript.cta}</p>
                <CopyButton text={videoScript.cta} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Meta Info */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Informações do Post</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-sm text-muted-foreground">Legenda sugerida:</span>
              <div className="flex items-start justify-between mt-1">
                <p className="text-sm">{videoScript.caption}</p>
                <CopyButton text={videoScript.caption} />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {videoScript.hashtags.map((tag, i) => (
                <Badge key={i} variant="secondary">#{tag}</Badge>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{videoScript.best_posting_time}</span>
              </div>
              <div className="flex items-center gap-2">
                <Music className="h-4 w-4 text-muted-foreground" />
                <span>{videoScript.music_suggestion}</span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4 text-muted-foreground" />
                <span>{videoScript.estimated_duration}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderHooksResult = () => {
    if (!hooks) return null;

    return (
      <div className="space-y-6">
        {/* Curiosity Hooks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              Ganchos de Curiosidade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {hooks.curiosity_hooks.map((hook, i) => (
                <div key={i} className="p-4 rounded-lg border">
                  <div className="flex items-start justify-between">
                    <p className="font-medium text-lg">"{hook.text}"</p>
                    <CopyButton text={hook.text} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    <strong>Por que funciona:</strong> {hook.why_works}
                  </p>
                  <Badge variant="outline" className="mt-2">{hook.best_for}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Controversy Hooks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Ganchos Polêmicos (Controlados)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {hooks.controversy_hooks.map((hook, i) => (
                <div key={i} className="p-4 rounded-lg border">
                  <div className="flex items-start justify-between">
                    <p className="font-medium">"{hook.text}"</p>
                    <CopyButton text={hook.text} />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={
                      hook.risk_level === 'alto' ? 'destructive' :
                      hook.risk_level === 'médio' ? 'default' : 'secondary'
                    }>
                      Risco: {hook.risk_level}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Other Hooks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ganchos de Pergunta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {hooks.question_hooks.map((hook, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded bg-muted/50">
                    <span>{hook}</span>
                    <CopyButton text={hook} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ganchos de Transformação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {hooks.transformation_hooks.map((hook, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded bg-muted/50">
                    <span>{hook}</span>
                    <CopyButton text={hook} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderProductDescResult = () => {
    if (!prodDesc) return null;

    return (
      <div className="space-y-6">
        {/* Descriptions */}
        <Card>
          <CardHeader>
            <CardTitle>Descrições do Produto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <Badge>Curta (Feed)</Badge>
                <CopyButton text={prodDesc.short_description} />
              </div>
              <p>{prodDesc.short_description}</p>
            </div>
            <div className="p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <Badge>Média (Cards)</Badge>
                <CopyButton text={prodDesc.medium_description} />
              </div>
              <p>{prodDesc.medium_description}</p>
            </div>
            <div className="p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <Badge>Completa</Badge>
                <CopyButton text={prodDesc.long_description} />
              </div>
              <p>{prodDesc.long_description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Bullet Points */}
        <Card>
          <CardHeader>
            <CardTitle>Benefícios Principais</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {prodDesc.bullet_points.map((point, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-success mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Hooks & Keywords */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ganchos Emocionais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {prodDesc.emotional_hooks.map((hook, i) => (
                  <Badge key={i} variant="outline" className="cursor-pointer">
                    {hook}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Palavras-Chave SEO</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {prodDesc.seo_keywords.map((kw, i) => (
                  <Badge key={i} variant="secondary">{kw}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Title Variations */}
        <Card>
          <CardHeader>
            <CardTitle>Variações de Título</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {prodDesc.title_variations.map((title, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="font-medium">{title}</span>
                  <CopyButton text={title} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderCaptionsResult = () => {
    if (!captions) return null;

    return (
      <div className="space-y-6">
        {/* Captions */}
        <Card>
          <CardHeader>
            <CardTitle>Legendas Geradas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {captions.captions.map((caption, i) => (
                <div key={i} className="p-4 rounded-lg border">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{caption.style}</Badge>
                        <Badge variant="secondary">{caption.engagement_trigger}</Badge>
                      </div>
                      <p className="whitespace-pre-wrap">{caption.text}</p>
                      <p className="text-sm text-primary mt-2 font-medium">{caption.cta}</p>
                    </div>
                    <CopyButton text={`${caption.text}\n\n${caption.cta}`} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hashtag Sets */}
        <Card>
          <CardHeader>
            <CardTitle>Conjuntos de Hashtags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {captions.hashtag_sets.map((set, i) => (
                <div key={i} className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <Badge>{set.focus}</Badge>
                    <CopyButton text={set.hashtags.map(h => `#${h}`).join(' ')} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {set.hashtags.map((tag, j) => (
                      <span key={j} className="text-primary">#{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderAdCopyResult = () => {
    if (!adCopy) return null;

    return (
      <div className="space-y-6">
        {/* Ad Variations */}
        <Card>
          <CardHeader>
            <CardTitle>Variações de Anúncio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {adCopy.ad_variations.map((ad, i) => (
                <div key={i} className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{ad.name}</h4>
                    <Badge variant="outline">{ad.target_emotion}</Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Headline:</span>
                      <p className="font-medium">{ad.headline}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Texto Principal:</span>
                      <p>{ad.primary_text}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Descrição:</span>
                      <p>{ad.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* A/B Test Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle>Sugestões de Teste A/B</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {adCopy.a_b_test_suggestions.map((test, i) => (
                <div key={i} className="p-4 rounded-lg bg-muted/30">
                  <h4 className="font-medium mb-2">{test.element}</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-2 rounded bg-background">
                      <Badge variant="outline" className="mb-1">Variação A</Badge>
                      <p>{test.variation_a}</p>
                    </div>
                    <div className="p-2 rounded bg-background">
                      <Badge variant="outline" className="mb-1">Variação B</Badge>
                      <p>{test.variation_b}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    <Lightbulb className="h-4 w-4 inline mr-1" />
                    {test.hypothesis}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderLiveScriptResult = () => {
    if (!liveScript) return null;

    return (
      <div className="space-y-6">
        {/* Pre-Live */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Preparação Pré-Live
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Checklist</h4>
              <ul className="space-y-1">
                {liveScript.pre_live.checklist.map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Posts de Teaser</h4>
              <div className="space-y-2">
                {liveScript.pre_live.teaser_posts.map((post, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded bg-muted/50">
                    <span className="text-sm">{post}</span>
                    <CopyButton text={post} />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Segments */}
        <Card>
          <CardHeader>
            <CardTitle>Segmentos da Live</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {liveScript.segments.map((segment, i) => (
                <div key={i} className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{segment.name}</h4>
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      {segment.duration}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{segment.objective}</p>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs text-muted-foreground">Pontos de Fala:</span>
                      <ul className="text-sm list-disc list-inside">
                        {segment.talking_points.map((point, j) => (
                          <li key={j}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Flash Sales */}
        <Card className="border-warning/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-warning" />
              Momentos de Flash Sale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {liveScript.flash_sale_moments.map((moment, i) => (
                <div key={i} className="p-4 rounded-lg bg-warning/5 border border-warning/20">
                  <p className="font-medium">{moment.trigger}</p>
                  <p className="text-sm mt-1">{moment.announcement}</p>
                  <p className="text-sm text-warning mt-1">{moment.urgency_builder}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderResults = () => {
    switch (selectedType) {
      case 'video_script':
        return renderVideoScriptResult();
      case 'hooks':
        return renderHooksResult();
      case 'product_description':
        return renderProductDescResult();
      case 'captions':
        return renderCaptionsResult();
      case 'ad_copy':
        return renderAdCopyResult();
      case 'live_script':
        return renderLiveScriptResult();
      default:
        return null;
    }
  };

  const hasResults = videoScript || prodDesc || hooks || captions || liveScript || adCopy;

  return (
    <FastMossLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Wand2 className="h-8 w-8 text-primary" />
              Scripts de IA
            </h1>
            <p className="text-muted-foreground mt-1">
              Geração automática de textos para TikTok com Gemini AI
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-1 space-y-4">
            {/* Script Type Selection */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Tipo de Script</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {scriptTypes.map((type) => (
                    <Button
                      key={type.id}
                      variant={selectedType === type.id ? 'default' : 'outline'}
                      className="h-auto py-3 flex flex-col items-center gap-1"
                      onClick={() => {
                        setSelectedType(type.id);
                        clearResults();
                      }}
                    >
                      <type.icon className="h-5 w-5" />
                      <span className="text-xs text-center">{type.name}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Product Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Informações do Produto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nome do Produto *</label>
                  <Input
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Ex: Fone Bluetooth Premium"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Descrição</label>
                  <Textarea
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    placeholder="Descreva o produto, benefícios, diferenciais..."
                    className="mt-1 min-h-[80px]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Público-Alvo</label>
                  <Input
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="Ex: jovens 18-35 anos"
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Tom</label>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {toneOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Duração</label>
                    <Select value={duration} onValueChange={setDuration}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {durationOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Palavras-Chave</label>
                  <Input
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="Separadas por vírgula"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <Button
              className="w-full"
              size="lg"
              onClick={handleGenerate}
              disabled={isLoading || !productName.trim()}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <Sparkles className="h-5 w-5 mr-2" />
              )}
              Gerar com IA
            </Button>

            {hasResults && (
              <Button
                variant="outline"
                className="w-full"
                onClick={clearResults}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Limpar Resultados
              </Button>
            )}
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Resultado Gerado
                </CardTitle>
                <CardDescription>
                  {scriptTypes.find(t => t.id === selectedType)?.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-64">
                      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                      <p className="text-muted-foreground">Gerando conteúdo com IA...</p>
                    </div>
                  ) : hasResults ? (
                    renderResults()
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                      <Wand2 className="h-16 w-16 text-muted-foreground/30 mb-4" />
                      <p className="text-muted-foreground">
                        Preencha as informações e clique em "Gerar com IA" para criar seu conteúdo
                      </p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </FastMossLayout>
  );
};

export default AIScripts;
