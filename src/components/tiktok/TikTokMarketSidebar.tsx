import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard,
  Package,
  Search,
  Radio,
  Users,
  Video,
  Store,
  BarChart3,
  Megaphone,
  Sparkles,
  MessageSquare,
  FileText,
  DollarSign,
  Settings,
  ShoppingCart
} from "lucide-react";

const sidebarSections = [
  {
    title: "Minha Loja",
    items: [
      { path: '/tiktok/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/tiktok/products', label: 'Produtos', icon: Package },
      { path: '/tiktok/orders', label: 'Pedidos', icon: ShoppingCart },
      { path: '/tiktok/financial', label: 'Financeiro', icon: DollarSign },
      { path: '/tiktok/settings', label: 'Configurações', icon: Settings },
    ]
  },
  {
    title: "Análise de Mercado",
    items: [
      { path: '/tiktok/market/products', label: 'Ranking de Produtos', icon: BarChart3 },
      { path: '/tiktok/market/search', label: 'Busca de Produtos', icon: Search },
      { path: '/tiktok/market/lives', label: 'Ranking de Lives', icon: Radio },
      { path: '/tiktok/market/influencers', label: 'Influenciadores', icon: Users },
      { path: '/tiktok/market/videos', label: 'Galeria de Vídeos', icon: Video },
      { path: '/tiktok/market/stores', label: 'Lojas Concorrentes', icon: Store },
      { path: '/tiktok/market/categories', label: 'Panorama Categorias', icon: Package },
    ]
  },
  {
    title: "Publicidade",
    items: [
      { path: '/tiktok/ads', label: 'Ads E-commerce', icon: Megaphone },
    ]
  },
  {
    title: "Ferramentas IA",
    items: [
      { path: '/tiktok/ai/scripts', label: 'Scripts Virais', icon: Sparkles },
      { path: '/tiktok/ai/voc', label: 'Análise VOC', icon: MessageSquare },
      { path: '/tiktok/ai/transcription', label: 'Transcrição Vídeos', icon: FileText },
    ]
  }
];

export function TikTokMarketSidebar() {
  const location = useLocation();

  return (
    <aside className="hidden lg:block w-64 border-r bg-card/50 min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-6">
        {sidebarSections.map((section) => (
          <div key={section.title}>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
              {section.title}
            </h3>
            <nav className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  );
}
