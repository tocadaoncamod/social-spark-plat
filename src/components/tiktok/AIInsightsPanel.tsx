import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, AlertTriangle, TrendingUp, Package, Users, Video, RefreshCw, Loader2 } from "lucide-react";
import { useTikTokInsights, TikTokInsight } from "@/hooks/useTikTokData";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const insightIcons = {
  sales: TrendingUp,
  product: Package,
  influencer: Users,
  content: Video,
  alert: AlertTriangle,
};

const priorityColors = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-blue-500/10 text-blue-500",
  high: "bg-orange-500/10 text-orange-500",
  critical: "bg-red-500/10 text-red-500",
};

export function AIInsightsPanel() {
  const { data: insights, isLoading, refetch } = useTikTokInsights();
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateInsights = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('tiktok-ai-insights', {
        body: { action: 'generate' }
      });

      if (error) throw error;

      toast({
        title: "Insights gerados!",
        description: "Novos insights foram criados com base nos seus dados.",
      });
      
      refetch();
    } catch (error) {
      console.error('Error generating insights:', error);
      toast({
        title: "Erro ao gerar insights",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          Insights da IA
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={generateInsights}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          <span className="ml-2 hidden sm:inline">
            {isGenerating ? "Gerando..." : "Atualizar"}
          </span>
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : insights && insights.length > 0 ? (
            <div className="space-y-3">
              {insights.map((insight) => (
                <InsightItem key={insight.id} insight={insight} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Sparkles className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">
                Nenhum insight disponível.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Clique em "Atualizar" para gerar novos insights.
              </p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function InsightItem({ insight }: { insight: TikTokInsight }) {
  const Icon = insightIcons[insight.insight_type];
  
  return (
    <div className={cn(
      "p-3 rounded-lg border transition-colors",
      !insight.is_read && "bg-primary/5 border-primary/20"
    )}>
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-medium truncate">{insight.title}</h4>
            <Badge variant="outline" className={cn("text-xs", priorityColors[insight.priority])}>
              {insight.priority}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {insight.content}
          </p>
        </div>
      </div>
    </div>
  );
}
