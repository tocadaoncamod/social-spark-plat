import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Facebook, 
  Instagram, 
  MessageCircle, 
  Youtube, 
  Music, 
  Send, 
  Settings,
  Zap,
  Twitter,
  Bot,
  Shirt,
  Cat
} from "lucide-react";
import { cn } from "@/lib/utils";

// 8 Apps principais com suas cores e rotas
const platformApps = [
  { 
    name: "TikTok Shop", 
    href: "/tiktok/dashboard", 
    icon: Music, 
    color: "text-white",
    bgColor: "bg-black",
    description: "Vendas e Afiliados"
  },
  { 
    name: "WhatsApp", 
    href: "/whatsapp/dashboard", 
    icon: MessageCircle, 
    color: "text-white",
    bgColor: "bg-[#25D366]",
    description: "Envio em Massa"
  },
  { 
    name: "Facebook", 
    href: "/facebook/automation", 
    icon: Facebook, 
    color: "text-white",
    bgColor: "bg-[#1877F2]",
    description: "Ultra Automatizado"
  },
  { 
    name: "Instagram", 
    href: "/instagram", 
    icon: Instagram, 
    color: "text-white",
    bgColor: "bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]",
    description: "Feed e Stories"
  },
  { 
    name: "YouTube", 
    href: "/youtube", 
    icon: Youtube, 
    color: "text-white",
    bgColor: "bg-[#FF0000]",
    description: "Vídeos e Lives"
  },
  { 
    name: "Telegram", 
    href: "/telegram", 
    icon: Send, 
    color: "text-white",
    bgColor: "bg-[#0088CC]",
    description: "Canais e Grupos"
  },
  { 
    name: "Twitter/X", 
    href: "/twitter", 
    icon: Twitter, 
    color: "text-white",
    bgColor: "bg-black",
    description: "Posts e Trends"
  },
  { 
    name: "Kwai", 
    href: "/kwai", 
    icon: Zap, 
    color: "text-black",
    bgColor: "bg-[#FF6B00]",
    description: "Vídeos Curtos"
  },
];

// App de Análise de Mercado (Toca da Onça)
const marketAnalysisApp = {
  name: "Toca da Onça",
  href: "/tocadaonca/dashboard",
  icon: Cat,
  color: "text-white",
  bgColor: "bg-gradient-to-br from-amber-600 to-orange-700",
  description: "Análise de Mercado"
};

export function Sidebar() {
  const location = useLocation();

  const isAppActive = (href: string) => {
    return location.pathname.startsWith(href.split('/').slice(0, 2).join('/'));
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 px-6 border-b border-sidebar-border">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-sidebar-foreground">FastMoss</span>
          <span className="ml-1 rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">Brasil</span>
        </div>

        {/* Dashboard Principal */}
        <div className="px-3 pt-4 pb-2 space-y-1">
          <Link
            to="/dashboard"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              location.pathname === "/dashboard"
                ? "bg-primary text-primary-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            )}
          >
            <Home className="h-5 w-5" />
            Painel de Controle
          </Link>
          <Link
            to="/agentes"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              location.pathname === "/agentes"
                ? "bg-primary text-primary-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            )}
          >
            <Bot className="h-5 w-5" />
            Agentes IA
          </Link>
          <Link
            to="/fashion-publisher"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              location.pathname === "/fashion-publisher"
                ? "bg-primary text-primary-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            )}
          >
            <Shirt className="h-5 w-5" />
            Fashion Publisher
          </Link>
        </div>

        {/* Plataformas Label */}
        <div className="px-6 py-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
            Plataformas
          </span>
        </div>

        {/* 8 Apps de Redes Sociais */}
        <nav className="flex-1 space-y-1 px-3 overflow-y-auto">
          {platformApps.map((app) => {
            const isActive = isAppActive(app.href);
            return (
              <Link
                key={app.name}
                to={app.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <div className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg transition-transform group-hover:scale-110",
                  app.bgColor
                )}>
                  <app.icon className={cn("h-4 w-4", app.color)} />
                </div>
                <div className="flex flex-col">
                  <span className={cn(isActive && "font-semibold")}>{app.name}</span>
                  <span className="text-[10px] text-sidebar-foreground/50">{app.description}</span>
                </div>
              </Link>
            );
          })}

          {/* Separador - Ferramentas Avançadas */}
          <div className="pt-4 pb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50 px-3">
              Ferramentas Avançadas
            </span>
          </div>

          {/* Toca da Onça - App de Análise de Mercado */}
          <Link
            to={marketAnalysisApp.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group",
              isAppActive(marketAnalysisApp.href)
                ? "bg-sidebar-accent text-sidebar-primary"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            )}
          >
            <div className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg transition-transform group-hover:scale-110",
              marketAnalysisApp.bgColor
            )}>
              <marketAnalysisApp.icon className={cn("h-4 w-4", marketAnalysisApp.color)} />
            </div>
            <div className="flex flex-col">
              <span className={cn(isAppActive(marketAnalysisApp.href) && "font-semibold")}>{marketAnalysisApp.name}</span>
              <span className="text-[10px] text-sidebar-foreground/50">{marketAnalysisApp.description}</span>
            </div>
          </Link>
        </nav>

        {/* Settings at bottom */}
        <div className="border-t border-sidebar-border p-3">
          <Link
            to="/settings"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              location.pathname === "/settings"
                ? "bg-sidebar-accent text-sidebar-primary"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            )}
          >
            <Settings className="h-5 w-5" />
            Configurações
          </Link>
        </div>
      </div>
    </aside>
  );
}
