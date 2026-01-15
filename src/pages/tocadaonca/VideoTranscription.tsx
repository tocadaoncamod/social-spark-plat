import { TocaDaOncaLayout } from "@/components/tocadaonca/TocaDaOncaLayout";
import { TikTokConnectionBanner } from "@/components/tocadaonca/TikTokConnectionBanner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Link as LinkIcon,
  Upload,
  Sparkles,
  Copy,
  Download,
  RefreshCw,
  Play,
  Clock,
  CheckCircle2,
  Wand2,
  FileVideo
} from "lucide-react";
import { useState } from "react";

const recentTranscriptions = [
  { 
    id: 1, 
    title: "Review Proteína Whey", 
    duration: "2:45", 
    status: "completed",
    date: "Hoje, 14:32"
  },
  { 
    id: 2, 
    title: "Unboxing iPhone 15", 
    duration: "5:12", 
    status: "completed",
    date: "Hoje, 10:15"
  },
  { 
    id: 3, 
    title: "Tutorial Maquiagem", 
    duration: "8:30", 
    status: "processing",
    date: "Hoje, 09:45"
  },
];

export default function VideoTranscription() {
  const [videoUrl, setVideoUrl] = useState("");
  const [transcription, setTranscription] = useState("");
  const [rewrittenScript, setRewrittenScript] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);

  const handleTranscribe = async () => {
    setIsTranscribing(true);
    // Simula transcrição
    setTimeout(() => {
      setTranscription(`Olá pessoal! Bem-vindos ao meu canal. Hoje vou mostrar para vocês esse produto incrível que recebi.

Primeiro, vamos olhar a embalagem. É bem premium, vocês podem ver a qualidade aqui.

O produto em si é fantástico. A qualidade é excepcional e o preço é muito acessível.

Se vocês gostaram, deixem o like e se inscrevam no canal. Link na bio!`);
      setIsTranscribing(false);
    }, 2000);
  };

  const handleRewrite = async () => {
    setIsRewriting(true);
    // Simula reescrita com IA
    setTimeout(() => {
      setRewrittenScript(`🎬 HOOK (0-3s):
"Esse produto mudou minha rotina completamente!"

📝 ROTEIRO OTIMIZADO:

[ABERTURA - 3-5s]
• Olá! Hoje trago algo especial que vocês pediram muito.

[UNBOXING - 5-15s]
• Olhem essa embalagem premium
• A apresentação já mostra a qualidade
• Detalhes que fazem diferença

[DEMONSTRAÇÃO - 15-40s]
• Vou mostrar como usar na prática
• [Destaque benefício 1]
• [Destaque benefício 2]
• Resultado após X dias de uso

[CTA - 40-60s]
• Link na bio com desconto exclusivo
• Comentem dúvidas abaixo
• Sigam para mais reviews

🎯 HASHTAGS SUGERIDAS:
#TikTokMadeMeBuyIt #Review #Viral`);
      setIsRewriting(false);
    }, 2000);
  };

  return (
    <TocaDaOncaLayout>
      <div className="space-y-6">
        <TikTokConnectionBanner />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-amber-500" />
              <h1 className="text-2xl font-bold text-foreground">Transcrição com IA</h1>
            </div>
            <p className="text-muted-foreground">Transcreva e reescreva roteiros de vídeos automaticamente</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <FileVideo className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">2.847</p>
                  <p className="text-xs text-muted-foreground">Vídeos transcritos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <Wand2 className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">1.523</p>
                  <p className="text-xs text-muted-foreground">Roteiros reescritos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">~15s</p>
                  <p className="text-xs text-muted-foreground">Tempo médio</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <CheckCircle2 className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">98.5%</p>
                  <p className="text-xs text-muted-foreground">Precisão</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Input Area */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Transcrever Vídeo</CardTitle>
              <CardDescription>Cole a URL do vídeo ou faça upload</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="url">
                <TabsList className="mb-4">
                  <TabsTrigger value="url" className="gap-2">
                    <LinkIcon className="h-4 w-4" />
                    URL do Vídeo
                  </TabsTrigger>
                  <TabsTrigger value="upload" className="gap-2">
                    <Upload className="h-4 w-4" />
                    Upload
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="url" className="space-y-4">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="https://www.tiktok.com/@usuario/video/..."
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleTranscribe}
                      disabled={!videoUrl || isTranscribing}
                      className="bg-gradient-to-r from-amber-500 to-orange-600"
                    >
                      {isTranscribing ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Play className="h-4 w-4 mr-2" />
                      )}
                      Transcrever
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="upload">
                  <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                    <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Arraste um vídeo ou clique para selecionar
                    </p>
                    <p className="text-xs text-muted-foreground">
                      MP4, MOV até 100MB
                    </p>
                    <Button variant="outline" className="mt-4">
                      Selecionar arquivo
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Transcription Result */}
              {transcription && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Transcrição</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Copy className="h-4 w-4 mr-2" />
                        Copiar
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
                      </Button>
                    </div>
                  </div>
                  <Textarea 
                    value={transcription}
                    onChange={(e) => setTranscription(e.target.value)}
                    rows={8}
                    className="font-mono text-sm"
                  />
                  <Button 
                    onClick={handleRewrite}
                    disabled={isRewriting}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600"
                  >
                    {isRewriting ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    Reescrever com IA
                  </Button>
                </div>
              )}

              {/* Rewritten Script */}
              {rewrittenScript && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      Roteiro Otimizado
                    </h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Copy className="h-4 w-4 mr-2" />
                        Copiar
                      </Button>
                    </div>
                  </div>
                  <Textarea 
                    value={rewrittenScript}
                    onChange={(e) => setRewrittenScript(e.target.value)}
                    rows={12}
                    className="font-mono text-sm bg-gradient-to-br from-amber-500/5 to-orange-600/5"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Transcriptions */}
          <Card>
            <CardHeader>
              <CardTitle>Transcrições Recentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentTranscriptions.map((item) => (
                <div 
                  key={item.id} 
                  className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.duration} • {item.date}
                      </p>
                    </div>
                    {item.status === "completed" ? (
                      <Badge className="bg-success/10 text-success border-success/20">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Pronto
                      </Badge>
                    ) : (
                      <Badge className="bg-warning/10 text-warning border-warning/20">
                        <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                        Processando
                      </Badge>
                    )}
                  </div>
                </div>
              ))}

              <Button variant="ghost" className="w-full mt-2">
                Ver todas as transcrições
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </TocaDaOncaLayout>
  );
}
