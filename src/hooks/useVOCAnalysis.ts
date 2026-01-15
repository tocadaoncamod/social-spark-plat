import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Review {
  id: string;
  content: string;
  rating: number;
  date: string;
  author?: string;
}

export interface SentimentAnalysis {
  overall_sentiment: {
    score: number;
    label: string;
    trend: string;
  };
  sentiment_distribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  pain_points: Array<{
    issue: string;
    frequency: string;
    severity: string;
    example_quote: string;
  }>;
  positive_highlights: Array<{
    aspect: string;
    frequency: string;
    example_quote: string;
  }>;
  usage_scenarios: Array<{
    scenario: string;
    frequency: number;
    sentiment: string;
  }>;
  customer_personas: Array<{
    name: string;
    description: string;
    percentage: number;
    main_needs: string[];
  }>;
  recommendations: Array<{
    priority: string;
    action: string;
    expected_impact: string;
  }>;
  word_cloud: Array<{
    word: string;
    count: number;
    sentiment: string;
  }>;
  summary: string;
}

export interface TrendAnalysis {
  emerging_trends: Array<{
    trend: string;
    direction: string;
    first_mentioned: string;
    impact: string;
  }>;
  seasonal_patterns: Array<{
    pattern: string;
    period: string;
    recommendation: string;
  }>;
  competitor_mentions: Array<{
    competitor: string;
    context: string;
    frequency: number;
  }>;
  feature_requests: Array<{
    feature: string;
    demand_level: string;
    potential_impact: string;
  }>;
}

export interface ComparisonAnalysis {
  competitive_position: {
    score: number;
    market_position: string;
  };
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  unique_selling_points: string[];
  improvement_priorities: Array<{
    area: string;
    current_score: number;
    target_score: number;
    action: string;
  }>;
}

export const useVOCAnalysis = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [sentimentAnalysis, setSentimentAnalysis] = useState<SentimentAnalysis | null>(null);
  const [trendAnalysis, setTrendAnalysis] = useState<TrendAnalysis | null>(null);
  const [comparisonAnalysis, setComparisonAnalysis] = useState<ComparisonAnalysis | null>(null);
  const { toast } = useToast();

  const analyzeSentiment = async (
    reviews: Review[],
    productName: string,
    productCategory: string
  ) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('voc-analysis', {
        body: {
          action: 'sentiment_analysis',
          reviews,
          productName,
          productCategory,
        },
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      setSentimentAnalysis(data);
      toast({
        title: 'Análise Concluída',
        description: 'Análise de sentimento gerada com sucesso!',
      });
      return data;
    } catch (error) {
      console.error('Sentiment analysis error:', error);
      toast({
        title: 'Erro na Análise',
        description: error instanceof Error ? error.message : 'Erro ao analisar sentimento',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeTrends = async (
    reviews: Review[],
    productName: string,
    productCategory: string
  ) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('voc-analysis', {
        body: {
          action: 'trend_analysis',
          reviews,
          productName,
          productCategory,
        },
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      setTrendAnalysis(data);
      return data;
    } catch (error) {
      console.error('Trend analysis error:', error);
      toast({
        title: 'Erro na Análise',
        description: error instanceof Error ? error.message : 'Erro ao analisar tendências',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeComparison = async (
    reviews: Review[],
    productName: string,
    productCategory: string
  ) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('voc-analysis', {
        body: {
          action: 'comparison_analysis',
          reviews,
          productName,
          productCategory,
        },
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      setComparisonAnalysis(data);
      return data;
    } catch (error) {
      console.error('Comparison analysis error:', error);
      toast({
        title: 'Erro na Análise',
        description: error instanceof Error ? error.message : 'Erro ao analisar comparação',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const generateResponse = async (
    review: Review,
    productName: string
  ) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('voc-analysis', {
        body: {
          action: 'generate_response',
          reviews: [review],
          productName,
        },
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      console.error('Response generation error:', error);
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao gerar resposta',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    sentimentAnalysis,
    trendAnalysis,
    comparisonAnalysis,
    analyzeSentiment,
    analyzeTrends,
    analyzeComparison,
    generateResponse,
  };
};
