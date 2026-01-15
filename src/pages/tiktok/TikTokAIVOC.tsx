import { useState } from "react";
import { TikTokShopLayout } from "@/components/tiktok/TikTokShopLayout";
import { TikTokMarketSidebar } from "@/components/tiktok/TikTokMarketSidebar";
import { TikTokConnectionBanner } from "@/components/tiktok/TikTokConnectionBanner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  MessageSquare, 
  ThumbsUp,
  ThumbsDown,
  Meh,
  AlertTriangle,
  Lightbulb,
  Users,
  RefreshCw,
  Wand2,
  TrendingUp
} from "lucide-react";
import { useTikTokConnection } from "@/contexts/TikTokConnectionContext";
import { toast } from "sonner";

interface VOCAnalysisResult {
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  painPoints: string[];
  personas: { name: string; description: string; percentage: number }[];
  recommendations: string[];
  keywords: { word: string; count: number; sentiment: "positive" | "negative" | "neutral" }[];
}

const mockAnalysis: VOCAnalysisResult = {
  sentiment: {
    positive: 72,
    neutral: 18,
    negative: 10,
  },
  painPoints: [
    "Demora na entrega em algumas regiões",
    "Embalagem poderia ser mais resistente",
    "Falta de variedade de tamanhos",
    "Preço do frete considerado alto",
  ],
  personas: [
    { name: "Entusiasta de Skincare", description: "Mulher 25-35, busca produtos premium", percentage: 45 },
    { name: "Comprador Prático", description: "Homem 30-40, preza por praticidade", percentage: 30 },
    { name: "Iniciante Curioso", description: "Jovem 18-25, primeiro contato com skincare", percentage: 25 },
  ],
  recommendations: [
    "Investir em parcerias logísticas para reduzir tempo de entrega",
    "Melhorar material de embalagem para produtos frágeis",
    "Expandir grade de tamanhos nos produtos mais populares",
    "Criar promoções de frete grátis acima de determinado valor",
    "Desenvolver conteúdo educacional para iniciantes",
  ],
  keywords: [
    { word: "qualidade", count: 245, sentiment: "positive" },
    { word: "rápido", count: 189, sentiment: "positive" },
    { word: "amei", count: 167, sentiment: "positive" },
    { word: "demora", count: 78, sentiment: "negative" },
    { word: "caro", count: 56, sentiment: "negative" },
    { word: "ok", count: 45, sentiment: "neutral" },
  ],
};

export default function TikTokAIVOC() {
  const { isConnected } = useTikTokConnection();
  const [reviews, setReviews] = useState("");
  const [analysis, setAnalysis] = useState<VOCAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!reviews.trim()) {
      toast.error("Cole as avaliações primeiro!");
      return;
    }
    
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 2500));
    setAnalysis(mockAnalysis);
    setIsAnalyzing(false);
    toast.success("Análise VOC concluída!");
  };

  return (
    <TikTokShopLayout>
      <div className="flex">
        <TikTokMarketSidebar />
        <main className="flex-1 p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <MessageSquare className="h-6 w-6" />
              Análise VOC (Voice of Customer)
            </h1>
            <p className="text-muted-foreground">
              Analise avaliações e descubra insights dos clientes
            </p>
          </div>

          <TikTokConnectionBanner />

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle>Avaliações para Análise</CardTitle>
                <CardDescription>
                  Cole as avaliações dos clientes para análise com IA
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Avaliações (cole múltiplas, uma por linha)</Label>
                  <Textarea
                    placeholder={`Ex:
"Amei o produto! Chegou rápido e a qualidade é incrível."
"Bom produto, mas a entrega demorou um pouco."
"Não gostei, achei caro pelo que oferece."
...`}
                    value={reviews}
                    onChange={(e) => setReviews(e.target.value)}
                    rows={12}
                  />
                </div>

                <Button 
                  className="w-full" 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Wand2 className="h-4 w-4 mr-2" />
                  )}
                  {isAnalyzing ? "Analisando..." : "Analisar com IA"}
                </Button>
              </CardContent>
            </Card>

            {/* Results Section */}
            <div className="space-y-6">
              {analysis ? (
                <>
                  {/* Sentiment Analysis */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Análise de Sentimento</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <ThumbsUp className="h-5 w-5 text-success" />
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Positivo</span>
                              <span className="font-medium">{analysis.sentiment.positive}%</span>
                            </div>
                            <Progress value={analysis.sentiment.positive} className="h-2 bg-muted [&>div]:bg-success" />
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Meh className="h-5 w-5 text-muted-foreground" />
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Neutro</span>
                              <span className="font-medium">{analysis.sentiment.neutral}%</span>
                            </div>
                            <Progress value={analysis.sentiment.neutral} className="h-2" />
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <ThumbsDown className="h-5 w-5 text-destructive" />
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Negativo</span>
                              <span className="font-medium">{analysis.sentiment.negative}%</span>
                            </div>
                            <Progress value={analysis.sentiment.negative} className="h-2 bg-muted [&>div]:bg-destructive" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Pain Points */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-warning" />
                        Principais Problemas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysis.painPoints.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <span className="text-warning">•</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Personas */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Personas Identificadas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analysis.personas.map((persona, idx) => (
                          <div key={idx} className="p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium">{persona.name}</span>
                              <Badge variant="secondary">{persona.percentage}%</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{persona.description}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recommendations */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-warning" />
                        Recomendações da IA
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysis.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <TrendingUp className="h-4 w-4 text-success mt-0.5" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Keywords */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Palavras-chave Frequentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {analysis.keywords.map((kw, idx) => (
                          <Badge 
                            key={idx}
                            variant="outline"
                            className={
                              kw.sentiment === "positive" ? "border-success text-success" :
                              kw.sentiment === "negative" ? "border-destructive text-destructive" :
                              ""
                            }
                          >
                            {kw.word} ({kw.count})
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="h-full">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center h-full">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                    <h4 className="font-medium mb-2">Nenhuma análise realizada</h4>
                    <p className="text-sm text-muted-foreground">
                      Cole as avaliações e clique em "Analisar com IA"
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </TikTokShopLayout>
  );
}
