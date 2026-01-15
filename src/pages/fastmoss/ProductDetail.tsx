import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FastMossLayout } from "@/components/fastmoss/FastMossLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  Star,
  ExternalLink,
  Copy,
  Heart,
  QrCode,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  DollarSign,
  Users,
  Video,
  Eye,
  Package,
  Sparkles,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  ChevronRight
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Mock data
const productData = {
  id: "1732585980145600354",
  name: "Short Cinta Modeladora 4 Barbatanas -Alta Compressão -Não Enrola - Zero Transparência - Empina Bumbum Plus Size",
  images: [
    "https://s.500fd.com/tt_product/198106c6333240a4a103ffc2aeddc19d~tplv-o3syd03w52-resize-jpeg:800:800.jpeg",
    "https://s.500fd.com/tt_product/190b646c24154f08a08b0bc18ffc7210~tplv-o3syd03w52-resize-jpeg:800:800.jpeg",
    "https://s.500fd.com/tt_product/4865036b84ca42ce9f95dde120083cb2~tplv-o3syd03w52-resize-jpeg:800:800.jpeg",
  ],
  price: 25.99,
  originalPrice: 60.00,
  rating: 4.8,
  reviews: 10000,
  category: ["Roupas femininas e roupas íntimas femininas", "Roupas íntimas femininas", "Cinta modeladora"],
  store: {
    name: "Verde Vida Grup",
    logo: "https://s.500fd.com/tt_shop/6d261973d92c4afc82bbf69d63fd4dc2~tplv-aphluv4xwc-resize-png:300:300.png",
    category: "Roupas femininas e roupas íntimas femininas",
  },
  stats: {
    rankBrasil: 88,
    rankCategory: 13,
    popularityProduct: 95,
    popularityIndex: 41,
    totalSales: 45000,
    gmv: 1100000,
    influencers: 467,
    videos: 967,
    stock: 9000,
    commission: 15,
    uploadDate: "2025-11-11",
  }
};

const salesTrendData = [
  { date: "12/13", vendas: 1200, gmv: 31200 },
  { date: "12/20", vendas: 1800, gmv: 46800 },
  { date: "12/27", vendas: 2400, gmv: 62400 },
  { date: "01/03", vendas: 2100, gmv: 54600 },
  { date: "01/10", vendas: 2800, gmv: 72800 },
];

const channelData = [
  { name: "Product card", value: 18, sales: 2388 },
  { name: "Shop account", value: 34, sales: 4718 },
  { name: "Parceiros de distribuição", value: 48, sales: 6642 },
];

const contentData = [
  { name: "Vídeo", value: 65, color: "hsl(var(--chart-1))" },
  { name: "Live", value: 25, color: "hsl(var(--chart-2))" },
  { name: "Shop", value: 10, color: "hsl(var(--chart-3))" },
];

const relatedVideos = [
  {
    id: 1,
    thumbnail: "https://via.placeholder.com/120x160",
    title: "Cinta modeladora que não marca!",
    influencer: "@mariasouza",
    views: 1250000,
    sales: 3420,
    gmv: 88920,
    date: "2024-01-08",
  },
  {
    id: 2,
    thumbnail: "https://via.placeholder.com/120x160",
    title: "Antes e depois da cinta modeladora",
    influencer: "@fitnessbrasil",
    views: 890000,
    sales: 2180,
    gmv: 56680,
    date: "2024-01-07",
  },
  {
    id: 3,
    thumbnail: "https://via.placeholder.com/120x160",
    title: "Review honesta - cinta modeladora",
    influencer: "@anabella",
    views: 650000,
    sales: 1560,
    gmv: 40560,
    date: "2024-01-06",
  },
];

const topInfluencers = [
  {
    name: "@mariasouza",
    avatar: "MS",
    followers: 2500000,
    sales: 3420,
    videos: 12,
    commission: "R$ 13.3K",
    conversion: 2.8,
  },
  {
    name: "@fitnessbrasil",
    avatar: "FB",
    followers: 1800000,
    sales: 2180,
    videos: 8,
    commission: "R$ 8.5K",
    conversion: 2.4,
  },
  {
    name: "@anabella",
    avatar: "AB",
    followers: 1200000,
    sales: 1560,
    videos: 6,
    commission: "R$ 6.1K",
    conversion: 2.1,
  },
];

const vocInsights = {
  painPoints: [
    { text: "Tamanho incorreto", percentage: 35 },
    { text: "Demora na entrega", percentage: 25 },
    { text: "Material diferente da foto", percentage: 18 },
    { text: "Difícil de vestir", percentage: 12 },
  ],
  scenarios: [
    { text: "Uso diário para trabalho", percentage: 42 },
    { text: "Eventos e festas", percentage: 28 },
    { text: "Academia e exercícios", percentage: 18 },
    { text: "Pós-parto", percentage: 12 },
  ],
  sentiments: {
    positive: 78,
    neutral: 15,
    negative: 7,
  },
  pros: [
    "Alta compressão sem desconforto",
    "Não marca na roupa",
    "Empina o bumbum naturalmente",
    "Boa qualidade do material",
  ],
  cons: [
    "Tabela de tamanhos confusa",
    "Pode esquentar no verão",
    "Difícil de colocar sozinha",
  ],
};

const reviews = [
  {
    id: 1,
    user: "Maria S.",
    rating: 5,
    date: "2024-01-08",
    content: "Produto excelente! Alta compressão mas não aperta demais. Recomendo muito!",
    images: ["https://via.placeholder.com/80"],
    helpful: 45,
  },
  {
    id: 2,
    user: "Ana P.",
    rating: 4,
    date: "2024-01-07",
    content: "Boa qualidade, mas o tamanho veio um pouco menor do que esperava. Sugiro pedir um número maior.",
    images: [],
    helpful: 32,
  },
  {
    id: 3,
    user: "Juliana M.",
    rating: 5,
    date: "2024-01-06",
    content: "Perfeita para usar no dia a dia! Não marca na roupa e é muito confortável.",
    images: ["https://via.placeholder.com/80", "https://via.placeholder.com/80"],
    helpful: 28,
  },
];

export default function ProductDetail() {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState("28d");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatNumber = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  return (
    <FastMossLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/products/search" className="hover:text-foreground">Pesquisa de produtos</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Detalhes do produto</span>
        </div>

        {/* Product Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-6">
              {/* Product Images */}
              <div className="space-y-3">
                <div className="relative w-72 h-72 rounded-xl overflow-hidden bg-muted">
                  <img
                    src={productData.images[selectedImage]}
                    alt={productData.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-3 left-3 bg-destructive text-white">
                    [Produto removido]
                  </Badge>
                </div>
                <div className="flex gap-2">
                  {productData.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === i ? "border-tiktok" : "border-transparent"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Math.floor(productData.rating)
                          ? "fill-warning text-warning"
                          : "text-muted"
                      }`}
                    />
                  ))}
                  <span className="ml-2 font-medium">{productData.rating}/5</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Número de comentários: <span className="text-foreground">{formatNumber(productData.reviews)}</span>
                </p>
              </div>

              {/* Product Info */}
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-xl font-bold leading-tight max-w-2xl">
                      {productData.name}
                    </h1>
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <img src="https://uscdn.fastmoss.com/fastMoss_Pc/regions/br.svg" alt="Brasil" className="h-4" />
                      {productData.category.join(" / ")}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Heart className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <QrCode className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <ExternalLink className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant="outline">SKU</Badge>
                  <Button variant="outline" size="sm" className="gap-2 text-primary">
                    <Sparkles className="h-4 w-4" />
                    Otimização de Títulos com IA
                  </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-4 pt-4">
                  <div className="text-center p-4 rounded-xl bg-tiktok/5 border border-tiktok/20">
                    <p className="text-3xl font-bold text-tiktok">{productData.stats.rankBrasil}</p>
                    <p className="text-sm text-muted-foreground mt-1">Ranking de Vendas no Brasil</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <p className="text-3xl font-bold text-primary">{productData.stats.rankCategory}</p>
                    <p className="text-sm text-muted-foreground mt-1">Ranking na Categoria</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-muted">
                    <p className="text-3xl font-bold">{productData.stats.popularityProduct}</p>
                    <p className="text-sm text-muted-foreground mt-1">Índice de popularidade do produto</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-muted">
                    <p className="text-3xl font-bold">{productData.stats.popularityIndex}</p>
                    <p className="text-sm text-muted-foreground mt-1">Índice de popularidade</p>
                  </div>
                </div>

                {/* Sales Stats */}
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-2xl font-bold">{formatNumber(productData.stats.totalSales)}</p>
                    <p className="text-sm text-muted-foreground">Vendas totais</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-tiktok">{formatCurrency(productData.stats.gmv)}</p>
                    <p className="text-sm text-muted-foreground">GMV total</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{productData.stats.influencers}</p>
                    <p className="text-sm text-muted-foreground">Número de influencers de vendas</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{productData.stats.videos}</p>
                    <p className="text-sm text-muted-foreground">Número de vídeos</p>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="flex items-center gap-6 pt-4 border-t text-sm">
                  <div>
                    <span className="text-muted-foreground">Data estimada de upload:</span>
                    <span className="ml-2 font-medium">{productData.stats.uploadDate} (GMT+8)</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Estoque:</span>
                    <span className="ml-2 font-medium">{formatNumber(productData.stats.stock)}+</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Preço:</span>
                    <span className="ml-2 font-semibold text-tiktok">{formatCurrency(productData.price)}</span>
                    <span className="ml-2 text-muted-foreground line-through">{formatCurrency(productData.originalPrice)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Taxa de comissão:</span>
                    <span className="ml-2 font-semibold text-success">{productData.stats.commission}%</span>
                  </div>
                </div>

                {/* Store Info */}
                <Link to={`/stores/detail/${productData.store.name}`} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                  <span className="text-sm text-muted-foreground">Detalhes da loja</span>
                  <img src={productData.store.logo} alt={productData.store.name} className="w-10 h-10 rounded-lg" />
                  <div>
                    <p className="font-medium">{productData.store.name}</p>
                    <p className="text-sm text-muted-foreground">{productData.store.category}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 ml-auto" />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="w-full justify-start h-12 p-1 bg-muted/50">
            <TabsTrigger value="overview" className="px-6">Resumo de dados</TabsTrigger>
            <TabsTrigger value="videos" className="px-6">Produtos relacionados com vídeos</TabsTrigger>
            <TabsTrigger value="lives" className="px-6">Produtos relacionados com transmissões ao vivo</TabsTrigger>
            <TabsTrigger value="influencers" className="px-6">Produtos relacionados com influencers</TabsTrigger>
            <TabsTrigger value="voc" className="px-6">
              VOC - Insight do consumidor
              <Badge className="ml-2 bg-tiktok text-white text-[10px]">NEW</Badge>
            </TabsTrigger>
            <TabsTrigger value="reviews" className="px-6">Comentários dos produtos</TabsTrigger>
            <TabsTrigger value="similar" className="px-6">Produtos semelhantes</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Period Selector */}
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">Resumo de dados</span>
              <div className="ml-auto flex gap-2">
                {["7d", "28d", "90d", "180d"].map((period) => (
                  <Button
                    key={period}
                    variant={selectedPeriod === period ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedPeriod(period)}
                    className={selectedPeriod === period ? "bg-tiktok hover:bg-tiktok/90" : ""}
                  >
                    Últimos {period.replace("d", " dias")}
                  </Button>
                ))}
              </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-6 gap-4">
              {[
                { label: "Vendas", value: "1.37M", subValue: "Média 2291" },
                { label: "GMV", value: "$23.58M", subValue: "Média $3.93M" },
                { label: "Influenciadores de vendas", value: "208" },
                { label: "Vídeos de vendas", value: "51" },
                { label: "Número de lives", value: "200" },
                { label: "Receita por vendas em vídeo", value: "$10.35M" },
              ].map((stat, i) => (
                <Card key={i}>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    {stat.subValue && (
                      <p className="text-xs text-muted-foreground">{stat.subValue}</p>
                    )}
                    <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Vendas / GMV</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={salesTrendData}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--tiktok))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--tiktok))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="date" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="vendas"
                        stroke="hsl(var(--tiktok))"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorSales)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Proporção de canais de transação</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {channelData.map((channel, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>{channel.name}</span>
                          <span className="font-medium">{channel.value}%</span>
                        </div>
                        <Progress value={channel.value} className="h-2" />
                        <p className="text-xs text-muted-foreground">{formatNumber(channel.sales)} vendas</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Vídeos relacionados ao produto</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vídeo</TableHead>
                      <TableHead>Influencer</TableHead>
                      <TableHead className="text-right">Views</TableHead>
                      <TableHead className="text-right">Vendas</TableHead>
                      <TableHead className="text-right">GMV</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {relatedVideos.map((video) => (
                      <TableRow key={video.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={video.thumbnail}
                              alt=""
                              className="w-16 h-20 rounded-lg object-cover"
                            />
                            <p className="font-medium line-clamp-2 max-w-xs">{video.title}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-primary">{video.influencer}</TableCell>
                        <TableCell className="text-right">{formatNumber(video.views)}</TableCell>
                        <TableCell className="text-right font-medium">{formatNumber(video.sales)}</TableCell>
                        <TableCell className="text-right text-success">{formatCurrency(video.gmv)}</TableCell>
                        <TableCell className="text-muted-foreground">{video.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Influencers Tab */}
          <TabsContent value="influencers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Influencers que promovem este produto</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Influencer</TableHead>
                      <TableHead className="text-right">Seguidores</TableHead>
                      <TableHead className="text-right">Vendas</TableHead>
                      <TableHead className="text-right">Vídeos</TableHead>
                      <TableHead className="text-right">Comissão</TableHead>
                      <TableHead className="text-right">Conversão</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topInfluencers.map((influencer) => (
                      <TableRow key={influencer.name} className="cursor-pointer hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-tiktok to-primary flex items-center justify-center text-white font-bold">
                              {influencer.avatar}
                            </div>
                            <span className="font-medium text-primary">{influencer.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{formatNumber(influencer.followers)}</TableCell>
                        <TableCell className="text-right font-medium">{formatNumber(influencer.sales)}</TableCell>
                        <TableCell className="text-right">{influencer.videos}</TableCell>
                        <TableCell className="text-right text-success">{influencer.commission}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline">{influencer.conversion}%</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* VOC Tab */}
          <TabsContent value="voc" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Pain Points */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-destructive" />
                    Pontos de Dor dos Consumidores
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {vocInsights.painPoints.map((point, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>{point.text}</span>
                        <span className="font-medium">{point.percentage}%</span>
                      </div>
                      <Progress value={point.percentage} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Scenarios */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-primary" />
                    Cenários de Uso
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {vocInsights.scenarios.map((scenario, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>{scenario.text}</span>
                        <span className="font-medium">{scenario.percentage}%</span>
                      </div>
                      <Progress value={scenario.percentage} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Sentiment Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Análise de Sentimento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-success" />
                        <span className="text-sm">Positivo</span>
                        <span className="ml-auto font-bold text-success">{vocInsights.sentiments.positive}%</span>
                      </div>
                      <Progress value={vocInsights.sentiments.positive} className="h-3 bg-muted" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                        <span className="text-sm">Neutro</span>
                        <span className="ml-auto font-bold">{vocInsights.sentiments.neutral}%</span>
                      </div>
                      <Progress value={vocInsights.sentiments.neutral} className="h-3 bg-muted" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-destructive" />
                        <span className="text-sm">Negativo</span>
                        <span className="ml-auto font-bold text-destructive">{vocInsights.sentiments.negative}%</span>
                      </div>
                      <Progress value={vocInsights.sentiments.negative} className="h-3 bg-muted" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pros and Cons */}
              <Card>
                <CardHeader>
                  <CardTitle>Prós e Contras</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium flex items-center gap-2 text-success mb-2">
                        <ThumbsUp className="h-4 w-4" />
                        Pontos Positivos
                      </h4>
                      <ul className="space-y-2">
                        {vocInsights.pros.map((pro, i) => (
                          <li key={i} className="text-sm flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-success" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium flex items-center gap-2 text-destructive mb-2">
                        <ThumbsDown className="h-4 w-4" />
                        Pontos Negativos
                      </h4>
                      <ul className="space-y-2">
                        {vocInsights.cons.map((con, i) => (
                          <li key={i} className="text-sm flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Comentários dos produtos</CardTitle>
                <Select defaultValue="recent">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Mais recentes</SelectItem>
                    <SelectItem value="helpful">Mais úteis</SelectItem>
                    <SelectItem value="positive">Positivos</SelectItem>
                    <SelectItem value="negative">Negativos</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="pb-6 border-b last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-medium">
                          {review.user.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{review.user}</p>
                          <p className="text-sm text-muted-foreground">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? "fill-warning text-warning"
                                : "text-muted"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm mb-3">{review.content}</p>
                    {review.images.length > 0 && (
                      <div className="flex gap-2 mb-3">
                        {review.images.map((img, i) => (
                          <img key={i} src={img} alt="" className="w-20 h-20 rounded-lg object-cover" />
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{review.helpful} pessoas acharam útil</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Similar Products Tab */}
          <TabsContent value="similar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Produtos Semelhantes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="group cursor-pointer">
                      <div className="aspect-square rounded-xl bg-muted mb-3 overflow-hidden">
                        <img
                          src="https://via.placeholder.com/200"
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <p className="font-medium line-clamp-2 text-sm mb-1">
                        Produto Similar {i} - Alta Qualidade
                      </p>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-semibold text-tiktok">R$ 29,90</span>
                        <span className="text-muted-foreground line-through">R$ 59,90</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span>{formatNumber(Math.floor(Math.random() * 50000))} vendas</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-warning text-warning" />
                          4.{Math.floor(Math.random() * 4) + 5}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </FastMossLayout>
  );
}
