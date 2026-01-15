import React, { useState } from 'react';
import { FastMossLayout } from '@/components/fastmoss/FastMossLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Brain,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Users,
  Target,
  Sparkles,
  RefreshCw,
  Download,
  Filter,
  Star,
  Lightbulb,
  BarChart3,
  PieChart,
  Loader2,
} from 'lucide-react';
import { useVOCAnalysis, Review, SentimentAnalysis } from '@/hooks/useVOCAnalysis';
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const COLORS = {
  positive: '#10B981',
  neutral: '#6B7280',
  negative: '#EF4444',
};

// Mock reviews for demo
const mockReviews: Review[] = [
  { id: '1', content: 'Produto excelente! Chegou rápido e a qualidade é incrível. Super recomendo!', rating: 5, date: '2024-01-15', author: 'Maria S.' },
  { id: '2', content: 'Bom produto, mas o envio demorou mais do que o esperado. Qualidade ok.', rating: 3, date: '2024-01-14', author: 'João P.' },
  { id: '3', content: 'Não gostei. Produto veio diferente da foto. Decepcionante.', rating: 1, date: '2024-01-13', author: 'Ana L.' },
  { id: '4', content: 'Adorei! Superou minhas expectativas. Vou comprar mais.', rating: 5, date: '2024-01-12', author: 'Carlos M.' },
  { id: '5', content: 'Produto ok pelo preço. Poderia ter melhor acabamento.', rating: 3, date: '2024-01-11', author: 'Paula R.' },
  { id: '6', content: 'Perfeito! Exatamente como descrito. Entrega super rápida!', rating: 5, date: '2024-01-10', author: 'Ricardo F.' },
  { id: '7', content: 'Produto quebrou depois de uma semana. Muito frágil.', rating: 2, date: '2024-01-09', author: 'Fernanda G.' },
  { id: '8', content: 'Ótimo custo-benefício. Uso diariamente e estou satisfeita.', rating: 4, date: '2024-01-08', author: 'Beatriz S.' },
];

const getSentimentColor = (sentiment: string) => {
  switch (sentiment.toLowerCase()) {
    case 'positivo':
    case 'muito_positivo':
      return 'text-success';
    case 'negativo':
    case 'muito_negativo':
      return 'text-danger';
    default:
      return 'text-muted-foreground';
  }
};

const getSentimentIcon = (trend: string) => {
  switch (trend) {
    case 'melhorando':
      return <TrendingUp className="h-4 w-4 text-success" />;
    case 'piorando':
      return <TrendingDown className="h-4 w-4 text-danger" />;
    default:
      return <Minus className="h-4 w-4 text-muted-foreground" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'alta':
      return 'bg-danger/10 text-danger border-danger/20';
    case 'média':
      return 'bg-warning/10 text-warning border-warning/20';
    default:
      return 'bg-success/10 text-success border-success/20';
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'crítico':
      return 'bg-danger text-danger-foreground';
    case 'moderado':
      return 'bg-warning text-warning-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const VOCAnalysis = () => {
  const [productName, setProductName] = useState('Produto Exemplo');
  const [productCategory, setProductCategory] = useState('Eletrônicos');
  const [customReviews, setCustomReviews] = useState('');
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  
  const {
    isLoading,
    sentimentAnalysis,
    trendAnalysis,
    comparisonAnalysis,
    analyzeSentiment,
    analyzeTrends,
    analyzeComparison,
  } = useVOCAnalysis();

  const handleAnalyze = async () => {
    await analyzeSentiment(reviews, productName, productCategory);
  };

  const handleAnalyzeTrends = async () => {
    await analyzeTrends(reviews, productName, productCategory);
  };

  const handleAnalyzeComparison = async () => {
    await analyzeComparison(reviews, productName, productCategory);
  };

  const addCustomReviews = () => {
    if (!customReviews.trim()) return;
    
    const newReviews = customReviews.split('\n').filter(r => r.trim()).map((content, i) => ({
      id: `custom-${Date.now()}-${i}`,
      content: content.trim(),
      rating: 3,
      date: new Date().toISOString().split('T')[0],
      author: 'Usuário',
    }));
    
    setReviews([...reviews, ...newReviews]);
    setCustomReviews('');
  };

  const sentimentDistributionData = sentimentAnalysis?.sentiment_distribution
    ? [
        { name: 'Positivo', value: sentimentAnalysis.sentiment_distribution.positive, color: COLORS.positive },
        { name: 'Neutro', value: sentimentAnalysis.sentiment_distribution.neutral, color: COLORS.neutral },
        { name: 'Negativo', value: sentimentAnalysis.sentiment_distribution.negative, color: COLORS.negative },
      ]
    : [];

  const wordCloudData = sentimentAnalysis?.word_cloud?.slice(0, 10) || [];

  return (
    <FastMossLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Brain className="h-8 w-8 text-primary" />
              VOC - Voice of Customer
            </h1>
            <p className="text-muted-foreground mt-1">
              Análise de sentimento com IA Gemini para insights automáticos
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Configuração da Análise
            </CardTitle>
            <CardDescription>
              Configure o produto e adicione reviews para análise
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Nome do Produto</label>
                <Input
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Ex: iPhone 15 Pro Max"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Categoria</label>
                <Input
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                  placeholder="Ex: Eletrônicos"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Adicionar Reviews (um por linha)</label>
              <Textarea
                value={customReviews}
                onChange={(e) => setCustomReviews(e.target.value)}
                placeholder="Cole reviews aqui, um por linha..."
                className="mt-1 min-h-[100px]"
              />
              <Button onClick={addCustomReviews} size="sm" variant="outline" className="mt-2">
                Adicionar Reviews
              </Button>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                {reviews.length} reviews carregados
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAnalyze} disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  Analisar Sentimento
                </Button>
                <Button onClick={handleAnalyzeTrends} variant="outline" disabled={isLoading}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Tendências
                </Button>
                <Button onClick={handleAnalyzeComparison} variant="outline" disabled={isLoading}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Comparativo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {sentimentAnalysis && (
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Resumo</TabsTrigger>
              <TabsTrigger value="pain-points">Dores</TabsTrigger>
              <TabsTrigger value="highlights">Destaques</TabsTrigger>
              <TabsTrigger value="scenarios">Cenários</TabsTrigger>
              <TabsTrigger value="personas">Personas</TabsTrigger>
              <TabsTrigger value="recommendations">Recomendações</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              {/* Summary Card */}
              <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/20 rounded-full">
                      <Brain className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Resumo Executivo</h3>
                      <p className="text-muted-foreground mt-1">
                        {sentimentAnalysis.summary}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Overall Sentiment */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Sentimento Geral
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold">
                          {sentimentAnalysis.overall_sentiment.score}%
                        </div>
                        <div className={`flex items-center gap-1 text-sm ${getSentimentColor(sentimentAnalysis.overall_sentiment.label)}`}>
                          {getSentimentIcon(sentimentAnalysis.overall_sentiment.trend)}
                          <span className="capitalize">
                            {sentimentAnalysis.overall_sentiment.label.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      <div className="w-16 h-16">
                        <Progress 
                          value={sentimentAnalysis.overall_sentiment.score} 
                          className="h-16 w-16 rounded-full"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Sentiment Distribution */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Distribuição de Sentimentos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={120}>
                      <RechartsPie>
                        <Pie
                          data={sentimentDistributionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={50}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {sentimentDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </RechartsPie>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Word Cloud Preview */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Palavras-Chave
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {wordCloudData.map((item, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className={`
                            ${item.sentiment === 'positivo' ? 'border-success text-success' : ''}
                            ${item.sentiment === 'negativo' ? 'border-danger text-danger' : ''}
                            ${item.sentiment === 'neutro' ? 'border-muted-foreground' : ''}
                          `}
                          style={{ fontSize: `${Math.min(14, 10 + item.count)}px` }}
                        >
                          {item.word} ({item.count})
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Pain Points Tab */}
            <TabsContent value="pain-points">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-danger" />
                    Pontos de Dor dos Clientes
                  </CardTitle>
                  <CardDescription>
                    Problemas identificados nos reviews que precisam de atenção
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sentimentAnalysis.pain_points.map((pain, i) => (
                      <div key={i} className="p-4 rounded-lg border bg-card">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <ThumbsDown className="h-4 w-4 text-danger" />
                              <h4 className="font-semibold">{pain.issue}</h4>
                            </div>
                            <blockquote className="mt-2 pl-4 border-l-2 border-muted text-muted-foreground italic">
                              "{pain.example_quote}"
                            </blockquote>
                          </div>
                          <div className="flex flex-col gap-2 items-end">
                            <Badge className={getSeverityColor(pain.severity)}>
                              {pain.severity}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Frequência: {pain.frequency}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Highlights Tab */}
            <TabsContent value="highlights">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ThumbsUp className="h-5 w-5 text-success" />
                    Destaques Positivos
                  </CardTitle>
                  <CardDescription>
                    O que os clientes mais elogiam sobre o produto
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sentimentAnalysis.positive_highlights.map((highlight, i) => (
                      <div key={i} className="p-4 rounded-lg border bg-success/5 border-success/20">
                        <div className="flex items-start gap-3">
                          <Star className="h-5 w-5 text-success mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-success">{highlight.aspect}</h4>
                            <blockquote className="mt-2 text-muted-foreground italic">
                              "{highlight.example_quote}"
                            </blockquote>
                            <span className="text-xs text-muted-foreground mt-2 block">
                              Frequência: {highlight.frequency}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Scenarios Tab */}
            <TabsContent value="scenarios">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Cenários de Uso
                  </CardTitle>
                  <CardDescription>
                    Como e quando os clientes utilizam o produto
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={sentimentAnalysis.usage_scenarios}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="scenario" />
                      <YAxis />
                      <Tooltip />
                      <Bar 
                        dataKey="frequency" 
                        fill="hsl(var(--primary))"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {sentimentAnalysis.usage_scenarios.map((scenario, i) => (
                      <div key={i} className="p-4 rounded-lg border">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{scenario.scenario}</span>
                          <Badge 
                            variant="outline"
                            className={
                              scenario.sentiment === 'positivo' ? 'border-success text-success' :
                              scenario.sentiment === 'negativo' ? 'border-danger text-danger' :
                              'border-muted-foreground'
                            }
                          >
                            {scenario.frequency}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Personas Tab */}
            <TabsContent value="personas">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sentimentAnalysis.customer_personas.map((persona, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        {persona.name}
                      </CardTitle>
                      <CardDescription>{persona.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Progress value={persona.percentage} className="flex-1" />
                          <span className="text-sm font-medium">{persona.percentage}%</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Principais Necessidades:</h4>
                          <div className="flex flex-wrap gap-2">
                            {persona.main_needs.map((need, j) => (
                              <Badge key={j} variant="secondary">{need}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Recommendations Tab */}
            <TabsContent value="recommendations">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-warning" />
                    Recomendações de Ação
                  </CardTitle>
                  <CardDescription>
                    Ações sugeridas pela IA para melhorar a experiência do cliente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sentimentAnalysis.recommendations.map((rec, i) => (
                      <div key={i} className={`p-4 rounded-lg border ${getPriorityColor(rec.priority)}`}>
                        <div className="flex items-start gap-3">
                          <Badge variant="outline" className={getPriorityColor(rec.priority)}>
                            {rec.priority}
                          </Badge>
                          <div>
                            <h4 className="font-semibold">{rec.action}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              <strong>Impacto esperado:</strong> {rec.expected_impact}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {/* Trend Analysis Results */}
        {trendAnalysis && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Análise de Tendências
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Tendências Emergentes</h4>
                  <div className="space-y-2">
                    {trendAnalysis.emerging_trends.map((trend, i) => (
                      <div key={i} className="p-3 rounded-lg border">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{trend.trend}</span>
                          <Badge variant={trend.direction === 'crescente' ? 'default' : 'secondary'}>
                            {trend.direction}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Solicitações de Features</h4>
                  <div className="space-y-2">
                    {trendAnalysis.feature_requests.map((feat, i) => (
                      <div key={i} className="p-3 rounded-lg border">
                        <div className="flex items-center justify-between">
                          <span>{feat.feature}</span>
                          <Badge variant="outline">{feat.demand_level}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reviews List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Reviews ({reviews.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-3">
                {reviews.map((review) => (
                  <div key={review.id} className="p-3 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{review.author}</span>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? 'text-warning fill-warning' : 'text-muted'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{review.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.content}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </FastMossLayout>
  );
};

export default VOCAnalysis;
