import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Youtube,
  Instagram,
  Facebook,
  MessageCircle,
  Music2,
  Linkedin,
  Send,
  Rocket,
  Brain,
  Zap,
  Target,
  Users,
  TrendingUp
} from "lucide-react";

const PLATFORMS = [
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'text-red-500', bgColor: 'bg-red-500/10' },
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-500', bgColor: 'bg-pink-500/10' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-600', bgColor: 'bg-blue-600/10' },
  { id: 'tiktok', name: 'TikTok', icon: Music2, color: 'text-foreground', bgColor: 'bg-muted' },
  { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: 'text-green-500', bgColor: 'bg-green-500/10' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700', bgColor: 'bg-blue-700/10' },
  { id: 'telegram', name: 'Telegram', icon: Send, color: 'text-sky-500', bgColor: 'bg-sky-500/10' },
];

const BUSINESS_TYPES = [
  { id: 'moda', name: 'Moda / Roupas e Acessórios', icon: '👗' },
  { id: 'ecommerce', name: 'E-commerce / Loja Online', icon: '🛒' },
  { id: 'servicos', name: 'Prestação de Serviços', icon: '🔧' },
  { id: 'infoprodutos', name: 'Infoprodutos / Cursos', icon: '📚' },
  { id: 'saas', name: 'SaaS / Software', icon: '💻' },
  { id: 'consultoria', name: 'Consultoria', icon: '💼' },
  { id: 'alimentacao', name: 'Alimentação / Restaurante', icon: '🍕' },
  { id: 'saude', name: 'Saúde / Bem-estar', icon: '🏥' },
  { id: 'educacao', name: 'Educação', icon: '🎓' },
  { id: 'imobiliario', name: 'Imobiliário', icon: '🏠' },
  { id: 'outro', name: 'Outro', icon: '✨' },
];

interface AnalysisResult {
  nicho: string;
  publicoAlvo: string;
  tonalidade: string;
  palavrasChave: string[];
  agentes: {
    plataforma: string;
    nome: string;
    icon: string;
    status: string;
  }[];
  conteudos: Record<string, string>;
}

const ANALYSIS_STEPS = [
  { icon: Brain, text: 'Analisando seu negócio com IA...', delay: 0 },
  { icon: Target, text: 'Identificando público-alvo ideal...', delay: 2000 },
  { icon: Users, text: 'Ativando agentes especializados...', delay: 4000 },
  { icon: Zap, text: 'Gerando prompts profissionais...', delay: 6000 },
  { icon: TrendingUp, text: 'Otimizando para cada plataforma...', delay: 8000 },
  { icon: Rocket, text: 'Finalizando configuração...', delay: 10000 },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [businessType, setBusinessType] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [productLink, setProductLink] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentAnalysisStep, setCurrentAnalysisStep] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setStep(3);
    setProgress(0);
    setCurrentAnalysisStep(0);

    // Simulate progress with analysis steps
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + 2;
      });
    }, 200);

    // Update analysis step text
    ANALYSIS_STEPS.forEach((_, index) => {
      setTimeout(() => {
        setCurrentAnalysisStep(index);
      }, ANALYSIS_STEPS[index].delay);
    });

    try {
      const { data, error } = await supabase.functions.invoke('onboarding-analyze', {
        body: {
          businessType,
          businessName,
          productLink,
          platforms: selectedPlatforms
        }
      });

      clearInterval(progressInterval);

      if (error) {
        throw error;
      }

      if (data.success) {
        setProgress(100);
        setAnalysisResult(data.configuracao);
        
        setTimeout(() => {
          setStep(4);
          setIsAnalyzing(false);
        }, 500);
        
        toast.success('Sistema configurado com sucesso!');
      } else {
        throw new Error(data.error || 'Erro na análise');
      }
    } catch (error: any) {
      clearInterval(progressInterval);
      console.error('Erro:', error);
      toast.error('Erro ao analisar: ' + error.message);
      setStep(2);
      setIsAnalyzing(false);
    }
  };

  const handleFinish = () => {
    navigate('/dashboard');
  };

  const renderStep1 = () => (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-primary to-purple-600 text-white mb-4">
          <Sparkles className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Social Spark AI
        </h1>
        <p className="text-muted-foreground text-lg">
          Sistema completo de IA para todas as plataformas
        </p>
      </div>

      <div className="space-y-4">
        <label className="block text-lg font-medium">Qual é o seu tipo de negócio?</label>
        <div className="grid grid-cols-2 gap-3">
          {BUSINESS_TYPES.map(type => (
            <button
              key={type.id}
              onClick={() => setBusinessType(type.id)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                businessType === type.id
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <span className="text-2xl mr-2">{type.icon}</span>
              <span className="font-medium">{type.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-lg font-medium">Nome do seu negócio (opcional)</label>
        <Input
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="Ex: Loja da Maria, Studio Fitness..."
          className="text-lg p-6"
        />
      </div>

      <Button
        onClick={() => setStep(2)}
        disabled={!businessType}
        className="w-full h-14 text-lg bg-gradient-to-r from-primary to-purple-600 hover:opacity-90"
      >
        Próximo
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Configuração 🎯</h2>
        <p className="text-muted-foreground">Personalize sua experiência</p>
      </div>

      <div className="space-y-4">
        <label className="block text-lg font-medium">Link do produto/serviço (opcional)</label>
        <Input
          value={productLink}
          onChange={(e) => setProductLink(e.target.value)}
          placeholder="https://seusite.com/produto"
          className="text-lg p-6"
        />
        <p className="text-sm text-muted-foreground">
          Cole o link do seu produto para análise automática com IA
        </p>
      </div>

      <div className="space-y-4">
        <label className="block text-lg font-medium">Selecione as plataformas</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {PLATFORMS.map(platform => {
            const Icon = platform.icon;
            const isSelected = selectedPlatforms.includes(platform.id);
            return (
              <button
                key={platform.id}
                onClick={() => handlePlatformToggle(platform.id)}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className={`p-3 rounded-full ${platform.bgColor}`}>
                  <Icon className={`h-6 w-6 ${platform.color}`} />
                </div>
                <span className="font-medium text-sm">{platform.name}</span>
                {isSelected && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => setStep(1)}
          className="flex-1 h-12"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <Button
          onClick={handleAnalyze}
          disabled={selectedPlatforms.length === 0}
          className="flex-1 h-12 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Configurar com IA
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => {
    const CurrentIcon = ANALYSIS_STEPS[currentAnalysisStep]?.icon || Brain;
    
    return (
      <div className="space-y-8 text-center py-8">
        <div className="relative">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-primary to-purple-600 text-white animate-pulse">
            <CurrentIcon className="h-12 w-12" />
          </div>
          <div className="absolute -inset-4 rounded-full border-4 border-primary/20 animate-spin" style={{ animationDuration: '3s' }} />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold">🤖 IA Trabalhando...</h2>
          <p className="text-muted-foreground text-lg">
            {ANALYSIS_STEPS[currentAnalysisStep]?.text || 'Processando...'}
          </p>
        </div>

        <div className="max-w-md mx-auto space-y-2">
          <Progress value={progress} className="h-3" />
          <p className="text-sm text-muted-foreground">{Math.round(progress)}% concluído</p>
        </div>

        <div className="space-y-3 text-left max-w-sm mx-auto">
          {ANALYSIS_STEPS.slice(0, currentAnalysisStep + 1).map((analysisStep, index) => (
            <div key={index} className="flex items-center gap-3 animate-fadeIn">
              <div className="p-1.5 rounded-full bg-green-500/10">
                <Check className="h-4 w-4 text-green-500" />
              </div>
              <span className="text-sm">{analysisStep.text.replace('...', '')}</span>
            </div>
          ))}
        </div>

        <p className="text-sm text-muted-foreground">
          Isso pode levar 30-60 segundos...
        </p>
      </div>
    );
  };

  const renderStep4 = () => (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <Check className="h-10 w-10" />
        </div>
        <h2 className="text-3xl font-bold">🎉 Sistema Configurado!</h2>
        <p className="text-muted-foreground text-lg">
          Todos os agentes especializados estão prontos
        </p>
      </div>

      {analysisResult && (
        <div className="space-y-6">
          {/* Business Summary */}
          <Card className="border-primary/20">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Análise do Negócio
              </h3>
              <div className="grid gap-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Nicho</span>
                  <Badge variant="secondary">{analysisResult.nicho}</Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Público-Alvo</span>
                  <span className="text-sm font-medium text-right max-w-[60%]">{analysisResult.publicoAlvo}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Tonalidade</span>
                  <Badge>{analysisResult.tonalidade}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agents */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Agentes Ativados
              </h3>
              <div className="grid gap-3">
                {analysisResult.agentes?.map((agente, index) => {
                  const platform = PLATFORMS.find(p => p.id === agente.plataforma);
                  const Icon = platform?.icon || MessageCircle;
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${platform?.bgColor || 'bg-primary/10'}`}>
                          <Icon className={`h-5 w-5 ${platform?.color || 'text-primary'}`} />
                        </div>
                        <div>
                          <p className="font-medium">{agente.nome}</p>
                          <p className="text-sm text-muted-foreground capitalize">{agente.plataforma}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        <Check className="h-3 w-3 mr-1" />
                        {agente.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Keywords */}
          {analysisResult.palavrasChave?.length > 0 && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Palavras-Chave Identificadas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.palavrasChave.map((keyword, index) => (
                    <Badge key={index} variant="secondary">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Button
        onClick={handleFinish}
        className="w-full h-14 text-lg bg-gradient-to-r from-primary to-purple-600 hover:opacity-90"
      >
        <Rocket className="mr-2 h-5 w-5" />
        Ir para Dashboard
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardContent className="p-8">
          {/* Progress Indicator */}
          {step < 4 && (
            <div className="flex items-center justify-center gap-2 mb-8">
              {[1, 2, 3].map(s => (
                <div
                  key={s}
                  className={`h-2 rounded-full transition-all ${
                    s === step
                      ? 'w-12 bg-primary'
                      : s < step
                      ? 'w-8 bg-primary/50'
                      : 'w-8 bg-muted'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Step Content */}
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </CardContent>
      </Card>
    </div>
  );
}
