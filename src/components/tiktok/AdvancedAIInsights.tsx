import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { 
  Sparkles, TrendingUp, Target, BarChart3, Lightbulb, 
  Loader2, Search, Zap, DollarSign, Video, Users,
  ArrowUpRight, ArrowDownRight, Minus
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface CompetitorStrategy {
  title: string;
  description: string;
  impact_level: string;
}

interface MarketGap {
  opportunity: string;
  potential: string;
  difficulty: string;
}

interface PricingInsights {
  average_price_range: string;
  margin_opportunity: string;
  recommendation: string;
}

interface MarketingTactic {
  tactic: string;
  effectiveness: string;
  implementation_tip: string;
}

interface TrendingProduct {
  product_type: string;
  growth_rate: string;
  demand_level: string;
}

interface ConsumerBehavior {
  trend: string;
  description: string;
  actionable_insight: string;
}

interface ContentTrend {
  format: string;
  engagement_rate: string;
  best_practices: string;
}

interface Prediction {
  prediction: string;
  timeframe: string;
  confidence_level: string;
}

interface CompetitionData {
  competitor_strategies: CompetitorStrategy[];
  market_gaps: MarketGap[];
  pricing_insights: PricingInsights;
  marketing_tactics: MarketingTactic[];
}

interface TrendsData {
  trending_products: TrendingProduct[];
  consumer_behavior: ConsumerBehavior[];
  content_trends: ContentTrend[];
  predictions: Prediction[];
}

export function AdvancedAIInsights() {
  const [activeTab, setActiveTab] = useState("competition");
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [competitionData, setCompetitionData] = useState<CompetitionData | null>(null);
  const [trendsData, setTrendsData] = useState<TrendsData | null>(null);
  const { toast } = useToast();

  const analyzeCompetition = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('tiktok-ai-insights', {
        body: { action: 'competition_analysis', category }
      });

      if (error) throw error;
      setCompetitionData(data);
      toast({
        title: "Análise concluída!",
        description: "Dados de concorrência atualizados.",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erro na análise",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeTrends = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('tiktok-ai-insights', {
        body: { action: 'market_trends', category }
      });

      if (error) throw error;
      setTrendsData(data);
      toast({
        title: "Tendências atualizadas!",
        description: "Dados de mercado carregados.",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erro na análise",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getImpactColor = (level: string) => {
    const l = level.toLowerCase();
    if (l.includes('high') || l.includes('alto')) return "text-green-500";
    if (l.includes('medium') || l.includes('médio')) return "text-yellow-500";
    return "text-muted-foreground";
  };

  const getDifficultyBadge = (difficulty: string) => {
    const d = difficulty.toLowerCase();
    if (d.includes('easy') || d.includes('fácil') || d.includes('baixa')) 
      return <Badge variant="outline" className="bg-green-500/10 text-green-500">Fácil</Badge>;
    if (d.includes('hard') || d.includes('difícil') || d.includes('alta')) 
      return <Badge variant="outline" className="bg-red-500/10 text-red-500">Difícil</Badge>;
    return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">Média</Badge>;
  };

  const getGrowthIcon = (rate: string) => {
    const r = rate.toLowerCase();
    if (r.includes('high') || r.includes('alto') || r.includes('+')) 
      return <ArrowUpRight className="h-4 w-4 text-green-500" />;
    if (r.includes('low') || r.includes('baixo') || r.includes('-')) 
      return <ArrowDownRight className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Insights Avançados de IA
        </CardTitle>
        <div className="flex gap-2 mt-2">
          <Input
            placeholder="Categoria (opcional): ex. Beleza, Moda..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="max-w-xs"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="competition" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Concorrência
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Tendências
            </TabsTrigger>
          </TabsList>

          <TabsContent value="competition" className="space-y-4">
            <Button 
              onClick={analyzeCompetition} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Analisar Concorrência
            </Button>

            {competitionData && (
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-6">
                  {/* Estratégias dos Concorrentes */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" />
                      Estratégias dos Concorrentes
                    </h3>
                    <div className="space-y-2">
                      {competitionData.competitor_strategies?.map((strategy, i) => (
                        <div key={i} className="p-3 rounded-lg border bg-card">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-sm">{strategy.title}</h4>
                            <span className={cn("text-xs font-medium", getImpactColor(strategy.impact_level))}>
                              {strategy.impact_level}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{strategy.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Gaps de Mercado */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      Oportunidades de Mercado
                    </h3>
                    <div className="space-y-2">
                      {competitionData.market_gaps?.map((gap, i) => (
                        <div key={i} className="p-3 rounded-lg border bg-card">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-sm">{gap.opportunity}</h4>
                            {getDifficultyBadge(gap.difficulty)}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Potencial: {gap.potential}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Insights de Preço */}
                  {competitionData.pricing_insights && (
                    <div>
                      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        Insights de Precificação
                      </h3>
                      <div className="p-4 rounded-lg border bg-gradient-to-br from-green-500/5 to-transparent">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Faixa de Preço:</span>
                            <p className="font-medium">{competitionData.pricing_insights.average_price_range}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Oportunidade de Margem:</span>
                            <p className="font-medium">{competitionData.pricing_insights.margin_opportunity}</p>
                          </div>
                        </div>
                        <p className="text-sm mt-3 p-2 bg-primary/5 rounded">
                          💡 {competitionData.pricing_insights.recommendation}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Táticas de Marketing */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Video className="h-4 w-4 text-purple-500" />
                      Táticas de Marketing
                    </h3>
                    <div className="space-y-2">
                      {competitionData.marketing_tactics?.map((tactic, i) => (
                        <div key={i} className="p-3 rounded-lg border bg-card">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-sm">{tactic.tactic}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {tactic.effectiveness}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            💡 {tactic.implementation_tip}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            )}
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <Button 
              onClick={analyzeTrends} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <BarChart3 className="h-4 w-4 mr-2" />
              )}
              Analisar Tendências
            </Button>

            {trendsData && (
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-6">
                  {/* Produtos em Alta */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      Produtos em Alta
                    </h3>
                    <div className="space-y-2">
                      {trendsData.trending_products?.map((product, i) => (
                        <div key={i} className="p-3 rounded-lg border bg-card flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getGrowthIcon(product.growth_rate)}
                            <span className="font-medium text-sm">{product.product_type}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{product.growth_rate}</span>
                            <Badge variant="outline" className="text-xs">
                              {product.demand_level}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Comportamento do Consumidor */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      Comportamento do Consumidor
                    </h3>
                    <div className="space-y-2">
                      {trendsData.consumer_behavior?.map((behavior, i) => (
                        <div key={i} className="p-3 rounded-lg border bg-card">
                          <h4 className="font-medium text-sm">{behavior.trend}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{behavior.description}</p>
                          <p className="text-xs mt-2 p-2 bg-blue-500/5 rounded text-blue-600 dark:text-blue-400">
                            ✨ {behavior.actionable_insight}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tendências de Conteúdo */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Video className="h-4 w-4 text-purple-500" />
                      Tendências de Conteúdo
                    </h3>
                    <div className="space-y-2">
                      {trendsData.content_trends?.map((trend, i) => (
                        <div key={i} className="p-3 rounded-lg border bg-card">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-sm">{trend.format}</h4>
                            <Badge className="bg-purple-500/10 text-purple-500 text-xs">
                              {trend.engagement_rate}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{trend.best_practices}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Previsões */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Previsões de Mercado
                    </h3>
                    <div className="space-y-2">
                      {trendsData.predictions?.map((pred, i) => (
                        <div key={i} className="p-3 rounded-lg border bg-gradient-to-br from-primary/5 to-transparent">
                          <div className="flex items-start justify-between">
                            <p className="font-medium text-sm">{pred.prediction}</p>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">{pred.timeframe}</Badge>
                            <span className="text-xs text-muted-foreground">
                              Confiança: {pred.confidence_level}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}