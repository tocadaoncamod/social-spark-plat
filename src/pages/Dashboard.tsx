import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Target, 
  Plus, 
  Calendar,
  Facebook,
  Instagram,
  Youtube,
  ArrowUpRight,
  ArrowDownRight,
  MessageSquare,
  Send,
  Twitter,
  Zap,
  Bot,
  Cat,
  Sparkles
} from "lucide-react";

// 8 Main Apps
const platformApps = [
  {
    name: "TikTok Shop",
    href: "/tiktok/dashboard",
    icon: Zap,
    color: "text-white",
    bgColor: "bg-gradient-to-br from-[#00f2ea] to-[#ff0050]",
    description: "Gestão de Loja",
    stats: "12 pedidos hoje"
  },
  {
    name: "WhatsApp",
    href: "/whatsapp/dashboard",
    icon: MessageSquare,
    color: "text-white",
    bgColor: "bg-gradient-to-br from-[#25D366] to-[#128C7E]",
    description: "WA Sender Pro",
    stats: "1.2K contatos"
  },
  {
    name: "Facebook",
    href: "/facebook/automation",
    icon: Facebook,
    color: "text-white",
    bgColor: "bg-gradient-to-br from-[#1877F2] to-[#0a5dc2]",
    description: "Automação",
    stats: "8 grupos ativos"
  },
  {
    name: "Instagram",
    href: "/instagram",
    icon: Instagram,
    color: "text-white",
    bgColor: "bg-gradient-to-br from-[#E4405F] to-[#833AB4]",
    description: "Conteúdo",
    stats: "24K seguidores"
  },
  {
    name: "YouTube",
    href: "/youtube",
    icon: Youtube,
    color: "text-white",
    bgColor: "bg-gradient-to-br from-[#FF0000] to-[#cc0000]",
    description: "Vídeos",
    stats: "156K inscritos"
  },
  {
    name: "Telegram",
    href: "/telegram",
    icon: Send,
    color: "text-white",
    bgColor: "bg-gradient-to-br from-[#0088cc] to-[#006699]",
    description: "Mensagens",
    stats: "3 canais"
  },
  {
    name: "Twitter/X",
    href: "/twitter",
    icon: Twitter,
    color: "text-white",
    bgColor: "bg-gradient-to-br from-[#1DA1F2] to-[#0d8bd9]",
    description: "Social",
    stats: "8.5K seguidores"
  },
  {
    name: "Kwai",
    href: "/kwai",
    icon: Zap,
    color: "text-white",
    bgColor: "bg-gradient-to-br from-[#FF6B00] to-[#FF4500]",
    description: "Vídeos Curtos",
    stats: "45K views"
  },
];

// Advanced Tools
const advancedTools = [
  {
    name: "Toca da Onça",
    href: "/tocadaonca/dashboard",
    icon: Cat,
    color: "text-white",
    bgColor: "bg-gradient-to-br from-amber-600 to-orange-700",
    description: "Análise de Mercado TikTok",
    stats: "Inteligência Competitiva"
  },
  {
    name: "Agentes IA",
    href: "/agentes",
    icon: Bot,
    color: "text-white",
    bgColor: "bg-gradient-to-br from-purple-600 to-indigo-700",
    description: "Automação com IA",
    stats: "3 agentes ativos"
  },
];

const stats = [
  {
    title: "Total de Seguidores",
    value: "124.5K",
    change: "+12.5%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Posts Este Mês",
    value: "48",
    change: "+8.2%",
    trend: "up",
    icon: FileText,
  },
  {
    title: "Taxa de Engajamento",
    value: "4.6%",
    change: "-0.3%",
    trend: "down",
    icon: TrendingUp,
  },
  {
    title: "Campanhas Ativas",
    value: "12",
    change: "+2",
    trend: "up",
    icon: Target,
  },
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Central de gestão das suas 8 plataformas de marketing
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Agendar
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Publicação
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs mt-1">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-destructive mr-1" />
                )}
                <span className={stat.trend === "up" ? "text-green-500" : "text-destructive"}>
                  {stat.change}
                </span>
                <span className="text-muted-foreground ml-1">vs mês anterior</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 8 Platform Apps Grid */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Suas Plataformas</h2>
        </div>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {platformApps.map((app) => (
            <Link key={app.name} to={app.href}>
              <Card className="hover-lift cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] h-full">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${app.bgColor} shadow-lg`}>
                      <app.icon className={`h-6 w-6 ${app.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate">{app.name}</h3>
                      <p className="text-xs text-muted-foreground">{app.description}</p>
                      <p className="text-xs text-primary mt-1 font-medium">{app.stats}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Advanced Tools */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Bot className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Ferramentas Avançadas</h2>
        </div>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {advancedTools.map((tool) => (
            <Link key={tool.name} to={tool.href}>
              <Card className="hover-lift cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${tool.bgColor} shadow-lg`}>
                      <tool.icon className={`h-7 w-7 ${tool.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{tool.name}</h3>
                      <p className="text-sm text-muted-foreground">{tool.description}</p>
                      <p className="text-sm text-primary mt-1 font-medium">{tool.stats}</p>
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>Tarefas comuns para começar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link to="/whatsapp/send">
                <MessageSquare className="h-5 w-5 text-green-500" />
                <span className="text-sm">Enviar WhatsApp</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link to="/facebook/automation">
                <Facebook className="h-5 w-5 text-blue-600" />
                <span className="text-sm">Postar no Facebook</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link to="/tiktok/products">
                <Zap className="h-5 w-5 text-pink-500" />
                <span className="text-sm">Gerenciar TikTok</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link to="/tocadaonca/dashboard">
                <Cat className="h-5 w-5 text-amber-600" />
                <span className="text-sm">Análise de Mercado</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
