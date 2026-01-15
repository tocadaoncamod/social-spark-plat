import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ScriptRequest {
  action: string;
  productName?: string;
  productDescription?: string;
  targetAudience?: string;
  tone?: string;
  duration?: string;
  platform?: string;
  scriptType?: string;
  keywords?: string[];
  language?: string;
  customPrompt?: string;
}

export interface VideoScript {
  hook: string;
  opening: string;
  body: Array<{
    timestamp: string;
    visual: string;
    narration: string;
    action: string;
  }>;
  climax: string;
  cta: string;
  closing: string;
  hashtags: string[];
  caption: string;
  best_posting_time: string;
  music_suggestion: string;
  estimated_duration: string;
}

export interface ProductDescription {
  short_description: string;
  medium_description: string;
  long_description: string;
  bullet_points: string[];
  emotional_hooks: string[];
  urgency_phrases: string[];
  social_proof_suggestions: string[];
  seo_keywords: string[];
  title_variations: string[];
}

export interface Hooks {
  curiosity_hooks: Array<{
    text: string;
    why_works: string;
    best_for: string;
  }>;
  controversy_hooks: Array<{
    text: string;
    why_works: string;
    risk_level: string;
  }>;
  story_hooks: Array<{
    text: string;
    emotion: string;
  }>;
  question_hooks: string[];
  challenge_hooks: string[];
  transformation_hooks: string[];
  fear_of_missing_out_hooks: string[];
}

export interface Captions {
  captions: Array<{
    text: string;
    style: string;
    engagement_trigger: string;
    cta: string;
  }>;
  hashtag_sets: Array<{
    focus: string;
    hashtags: string[];
  }>;
  emoji_combinations: string[];
  call_to_action_variations: string[];
}

export interface LiveScript {
  pre_live: {
    checklist: string[];
    teaser_posts: string[];
  };
  opening: {
    duration: string;
    script: string;
    engagement_action: string;
  };
  segments: Array<{
    name: string;
    duration: string;
    objective: string;
    talking_points: string[];
    engagement_prompts: string[];
  }>;
  product_demo: {
    key_features_order: string[];
    objection_handlers: Array<{
      objection: string;
      response: string;
    }>;
  };
  flash_sale_moments: Array<{
    trigger: string;
    announcement: string;
    urgency_builder: string;
  }>;
  closing: {
    final_cta: string;
    last_chance_offer: string;
    next_live_teaser: string;
  };
  engagement_games: Array<{
    name: string;
    rules: string;
    prize: string;
  }>;
}

export interface AdCopy {
  primary_texts: Array<{
    text: string;
    angle: string;
    length: string;
  }>;
  headlines: string[];
  descriptions: string[];
  cta_buttons: string[];
  ad_variations: Array<{
    name: string;
    primary_text: string;
    headline: string;
    description: string;
    target_emotion: string;
  }>;
  a_b_test_suggestions: Array<{
    element: string;
    variation_a: string;
    variation_b: string;
    hypothesis: string;
  }>;
}

export const useAIScripts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [videoScript, setVideoScript] = useState<VideoScript | null>(null);
  const [productDescription, setProductDescription] = useState<ProductDescription | null>(null);
  const [hooks, setHooks] = useState<Hooks | null>(null);
  const [captions, setCaptions] = useState<Captions | null>(null);
  const [liveScript, setLiveScript] = useState<LiveScript | null>(null);
  const [adCopy, setAdCopy] = useState<AdCopy | null>(null);
  const [customResult, setCustomResult] = useState<any>(null);
  const { toast } = useToast();

  const generateScript = async (request: ScriptRequest) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-scripts', {
        body: request,
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      // Set the appropriate state based on action
      switch (request.action) {
        case 'video_script':
          setVideoScript(data);
          break;
        case 'product_description':
          setProductDescription(data);
          break;
        case 'hooks':
          setHooks(data);
          break;
        case 'captions':
          setCaptions(data);
          break;
        case 'live_script':
          setLiveScript(data);
          break;
        case 'ad_copy':
          setAdCopy(data);
          break;
        case 'custom':
          setCustomResult(data);
          break;
      }

      toast({
        title: 'Script Gerado!',
        description: 'Seu conteúdo foi criado com sucesso pela IA.',
      });

      return data;
    } catch (error) {
      console.error('AI Scripts error:', error);
      toast({
        title: 'Erro na Geração',
        description: error instanceof Error ? error.message : 'Erro ao gerar script',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setVideoScript(null);
    setProductDescription(null);
    setHooks(null);
    setCaptions(null);
    setLiveScript(null);
    setAdCopy(null);
    setCustomResult(null);
  };

  return {
    isLoading,
    videoScript,
    productDescription,
    hooks,
    captions,
    liveScript,
    adCopy,
    customResult,
    generateScript,
    clearResults,
  };
};
