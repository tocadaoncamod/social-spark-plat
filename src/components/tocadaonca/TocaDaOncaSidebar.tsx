import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  PieChart, 
  Package, 
  Search, 
  Trophy, 
  Clock, 
  Store, 
  Video, 
  Megaphone, 
  Radio, 
  Sparkles, 
  Eye, 
  Users, 
  ChevronDown,
  ChevronRight,
  Settings,
  TrendingUp,
  Star,
  Play,
  ShoppingCart,
  MessageSquare,
  Bot,
  FileText,
  Bell,
  Leaf,
  Cat,
  Mail,
  Target,
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NavItem {
  name: string;
  href?: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
  children?: {
    name: string;
    href: string;
    icon?: React.ElementType;
  }[];
}

const navItems: NavItem[] = [
  { 
    name: "Painel de controle", 
    href: "/dashboard", 
    icon: LayoutDashboard 
  },
  { 
    name: "Panorama da categoria", 
    icon: PieChart,
    children: [
      { name: "Visão Geral", href: "/category/overview" },
      { name: "Análise por Nicho", href: "/category/niche" },
      { name: "Tendências", href: "/category/trends" },
    ]
  },
  { 
    name: "Produtos", 
    icon: Package,
    children: [
      { name: "Pesquisa de produtos", href: "/products/search", icon: Search },
      { name: "Ranking de vendas", href: "/products/ranking/sales", icon: Trophy },
      { name: "Ranking de novos produtos", href: "/products/ranking/new", icon: Star },
      { name: "Ranking de produtos populares", href: "/products/ranking/popular", icon: TrendingUp },
      { name: "Ranking de produtos em vídeo", href: "/products/ranking/video", icon: Play },
    ]
  },
  { 
    name: "Hora de publicação", 
    icon: Clock,
    children: [
      { name: "Heatmap", href: "/publishing/heatmap" },
      { name: "Análise de IA", href: "/publishing/ai-analysis" },
    ]
  },
  { 
    name: "Loja", 
    icon: Store,
    children: [
      { name: "Buscar lojas", href: "/stores/search" },
      { name: "Ranking de lojas", href: "/stores/ranking" },
      { name: "Análise de concorrentes", href: "/stores/competitors" },
    ]
  },
  { 
    name: "Vídeos e materiais", 
    icon: Video,
    children: [
      { name: "Galeria de vídeos", href: "/videos/gallery" },
      { name: "Tendências", href: "/videos/trends" },
      { name: "Performance", href: "/videos/performance" },
      { name: "Transcrição IA", href: "/videos/transcription" },
    ]
  },
  { 
    name: "Publicidade", 
    icon: Megaphone,
    badge: "NEW",
    badgeColor: "bg-tiktok text-white",
    children: [
      { name: "E-commerce Ads", href: "/ads/ecommerce", icon: ShoppingCart },
      { name: "Grass Planting", href: "/ads/grass-planting", icon: Leaf },
      { name: "Anunciantes", href: "/ads/advertisers", icon: Users },
    ]
  },
  { 
    name: "Transmissões ao vivo", 
    icon: Radio,
    children: [
      { name: "Ranking de lives", href: "/lives/ranking" },
      { name: "Performance", href: "/lives/performance" },
      { name: "Agendadas", href: "/lives/scheduled" },
    ]
  },
  { 
    name: "Ferramentas de IA", 
    icon: Sparkles,
    badge: "IA",
    badgeColor: "bg-primary text-white",
    children: [
      { name: "VOC - Voice of Customer", href: "/ai-tools/voc", icon: MessageSquare },
      { name: "Scripts de IA", href: "/ai-tools/scripts", icon: FileText },
      { name: "Geração de conteúdo", href: "/ai-tools/content", icon: Bot },
    ]
  },
  { 
    name: "Monitoramento de vídeo", 
    icon: Eye,
    children: [
      { name: "Tempo real", href: "/monitoring/realtime" },
      { name: "Alertas", href: "/monitoring/alerts", icon: Bell },
      { name: "Relatórios", href: "/monitoring/reports" },
    ]
  },
  { 
    name: "Criadores", 
    icon: Users,
    badge: "PRO",
    badgeColor: "bg-success text-white",
    children: [
      { name: "Ranking de influencers", href: "/influencers/ranking" },
      { name: "Análise de performance", href: "/influencers/performance" },
      { name: "Parcerias", href: "/influencers/partnerships" },
      { name: "Outreach em massa", href: "/influencers/outreach", icon: Mail },
      { name: "Exportar contatos", href: "/influencers/export", icon: Download },
    ]
  },
];

export function TocaDaOncaSidebar() {
  const location = useLocation();
  const [openItems, setOpenItems] = useState<string[]>(["Produtos"]);

  const toggleItem = (name: string) => {
    setOpenItems(prev => 
      prev.includes(name) 
        ? prev.filter(item => item !== name)
        : [...prev, name]
    );
  };

  const isActiveRoute = (href?: string, children?: NavItem["children"]) => {
    if (href) {
      return location.pathname === href;
    }
    if (children) {
      return children.some(child => location.pathname === child.href);
    }
    return false;
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-4 border-b border-sidebar-border shrink-0">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600">
          <Cat className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold text-sidebar-foreground">Toca da Onça</span>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = isActiveRoute(item.href, item.children);
            const isOpen = openItems.includes(item.name);

            if (item.children) {
              return (
                <Collapsible
                  key={item.name}
                  open={isOpen}
                  onOpenChange={() => toggleItem(item.name)}
                >
                  <CollapsibleTrigger asChild>
                    <button
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                      )}
                    >
                      <item.icon className={cn(
                        "h-5 w-5 shrink-0",
                        isActive && "text-amber-500"
                      )} />
                      <span className="flex-1 text-left truncate">{item.name}</span>
                      {item.badge && (
                        <Badge className={cn("text-[10px] px-1.5 py-0", item.badgeColor)}>
                          {item.badge}
                        </Badge>
                      )}
                      {isOpen ? (
                        <ChevronDown className="h-4 w-4 shrink-0" />
                      ) : (
                        <ChevronRight className="h-4 w-4 shrink-0" />
                      )}
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-6 pt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        to={child.href}
                        className={cn(
                          "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all duration-200",
                          location.pathname === child.href
                            ? "bg-sidebar-accent text-amber-500 font-medium"
                            : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                        )}
                      >
                        {child.icon && <child.icon className="h-4 w-4" />}
                        <span className="truncate">{child.name}</span>
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              );
            }

            return (
              <Link
                key={item.name}
                to={item.href!}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 shrink-0",
                  isActive && "text-amber-500"
                )} />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Settings at bottom */}
      <div className="border-t border-sidebar-border p-3 shrink-0">
        <Link
          to="/settings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
            location.pathname === "/settings"
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          )}
        >
          <Settings className="h-5 w-5" />
          Configurações
        </Link>
      </div>
    </aside>
  );
}
