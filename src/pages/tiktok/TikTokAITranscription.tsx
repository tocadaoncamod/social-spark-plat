import { useState } from "react";
import { TikTokShopLayout } from "@/components/tiktok/TikTokShopLayout";
import { TikTokMarketSidebar } from "@/components/tiktok/TikTokMarketSidebar";
import { TikTokConnectionBanner } from "@/components/tiktok/TikTokConnectionBanner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Link,
  RefreshCw,
  Wand2,
  Copy,
  Sparkles,
  Clock,
  Play,
  CheckCircle2
} from "lucide-react";
import { useTikTokConnection } from "@/contexts/TikTokConnectionContext";
import { toast } from "sonner";

interface TranscriptionResult {
  originalText: string;
  optimizedText: string;
  timestamps: { time: string; text: string }[];
  hooks: string[];
  ctas: string[];
}

const mockTranscription: TranscriptionResult = {
  originalText: `Oi gente, tudo bem? Hoje eu vou mostrar pra vocês um produto que eu amei demais. É um kit de skincare com vitamina C que simplesmente transformou minha pele. Então olha só, são 5 produtos: um sérum, um hidratante, um protetor solar, uma máscara noturna e um tônico. Eu uso há 2 semanas e a diferença é absurda. Minha pele tá muito mais iluminada, as manchinhas tão clareando... Enfim, vou deixar o link aqui na bio pra vocês. E aproveitem porque tá com 40% de desconto só hoje!`,
  optimizedText: `🔥 ATENÇÃO: Esse produto vai TRANSFORMAR sua pele!

Gente, preciso contar uma coisa: encontrei O kit de skincare perfeito!

✨ 5 produtos com Vitamina C pura:
• Sérum potente
• Hidratante 24h
• Protetor Solar FPS50
• Máscara noturna renovadora
• Tônico equilibrante

📈 RESULTADO em 2 semanas:
→ Pele MUITO mais iluminada
→ Manchas visivelmente mais claras
→ Textura super macia

⚡ OFERTA IMPERDÍVEL: 40% OFF só HOJE!

👆 Link na bio - CORRE antes que acabe!`,
  timestamps: [
    { time: "0:00", text: "Oi gente, tudo bem?" },
    { time: "0:03", text: "Hoje eu vou mostrar pra vocês um produto que eu amei demais" },
    { time: "0:08", text: "É um kit de skincare com vitamina C" },
    { time: "0:12", text: "São 5 produtos: sérum, hidratante, protetor, máscara e tônico" },
    { time: "0:22", text: "Uso há 2 semanas e a diferença é absurda" },
    { time: "0:28", text: "Link na bio com 40% de desconto" },
  ],
  hooks: [
    "Esse produto vai TRANSFORMAR sua pele!",
    "Encontrei O segredo da pele perfeita...",
    "POV: Você descobriu o kit que as influencers usam",
  ],
  ctas: [
    "Link na bio - CORRE antes que acabe!",
    "Últimas unidades com 40% OFF!",
    "Comenta 'EU QUERO' que eu te mando o link!",
  ],
};

export default function TikTokAITranscription() {
  const { isConnected } = useTikTokConnection();
  const [videoUrl, setVideoUrl] = useState("");
  const [transcription, setTranscription] = useState<TranscriptionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTranscribe = async () => {
    if (!videoUrl.trim()) {
      toast.error("Cole o link do vídeo primeiro!");
      return;
    }
    
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setTranscription(mockTranscription);
    setIsProcessing(false);
    toast.success("Transcrição concluída!");
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado para a área de transferência!");
  };

  return (
    <TikTokShopLayout>
      <div className="flex">
        <TikTokMarketSidebar />
        <main className="flex-1 p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Transcrição de Vídeos
            </h1>
            <p className="text-muted-foreground">
              Transcreva vídeos do TikTok e gere versões otimizadas
            </p>
          </div>

          <TikTokConnectionBanner />

          {/* Input Card */}
          <Card>
            <CardHeader>
              <CardTitle>URL do Vídeo TikTok</CardTitle>
              <CardDescription>
                Cole o link de um vídeo do TikTok para transcrever
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="https://www.tiktok.com/@user/video/1234567890"
                    className="pl-9"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                  />
                </div>
                <Button onClick={handleTranscribe} disabled={isProcessing}>
                  {isProcessing ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Wand2 className="h-4 w-4 mr-2" />
                  )}
                  {isProcessing ? "Processando..." : "Transcrever"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {transcription ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Transcription Results */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Transcrição Original</CardTitle>
                      <Button variant="outline" size="sm" onClick={() => copyText(transcription.originalText)}>
                        <Copy className="h-4 w-4 mr-1" />
                        Copiar
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/50 rounded-lg p-4 text-sm">
                      {transcription.originalText}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Versão Otimizada
                      </CardTitle>
                      <Button variant="outline" size="sm" onClick={() => copyText(transcription.optimizedText)}>
                        <Copy className="h-4 w-4 mr-1" />
                        Copiar
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-sm whitespace-pre-wrap">
                      {transcription.optimizedText}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Analysis */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Timestamps
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {transcription.timestamps.map((ts, idx) => (
                        <div 
                          key={idx}
                          className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <Badge variant="outline" className="font-mono">
                            {ts.time}
                          </Badge>
                          <span className="text-sm">{ts.text}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Hooks Sugeridos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {transcription.hooks.map((hook, idx) => (
                        <div 
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                        >
                          <span className="text-sm font-medium">{hook}</span>
                          <Button variant="ghost" size="icon" onClick={() => copyText(hook)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">CTAs Sugeridos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {transcription.ctas.map((cta, idx) => (
                        <div 
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-lg bg-success/5 border border-success/20"
                        >
                          <span className="text-sm font-medium text-success">{cta}</span>
                          <Button variant="ghost" size="icon" onClick={() => copyText(cta)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <h4 className="text-lg font-medium mb-2">Nenhum vídeo transcrito</h4>
                <p className="text-muted-foreground max-w-md">
                  Cole o link de um vídeo do TikTok acima para transcrever o áudio e gerar uma versão otimizada para vendas
                </p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </TikTokShopLayout>
  );
}
