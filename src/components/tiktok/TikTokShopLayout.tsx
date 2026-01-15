import { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  BarChart3, 
  Users, 
  Video, 
  DollarSign,
  ArrowLeft,
  Sparkles,
  Settings,
  RefreshCw,
  Search,
  Store,
  Radio,
  Megaphone,
  Eye,
  FileText,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TikTokShopLayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: '/tiktok/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/tiktok/products', label: 'Produtos', icon: Package },
  { path: '/tiktok/orders', label: 'Pedidos', icon: Store },
  { path: '/tiktok/financial', label: 'Financeiro', icon: DollarSign },
  { path: '/tiktok/market/products', label: 'Mercado', icon: BarChart3 },
  { path: '/tiktok/ai/scripts', label: 'IA', icon: Sparkles },
  { path: '/tiktok/settings', label: 'Config', icon: Settings },
];

export function TikTokShopLayout({ children }: TikTokShopLayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-lg">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <NavLink to="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </NavLink>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">TikTok Shop</h1>
                <p className="text-xs text-muted-foreground">MarketFlow Dashboard</p>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <NavLink key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                      "gap-2",
                      isActive && "bg-primary/10 text-primary"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden sticky top-16 z-40 w-full overflow-x-auto border-b bg-background/95 backdrop-blur">
        <nav className="flex items-center gap-1 p-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <NavLink key={item.path} to={item.path}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "gap-2 whitespace-nowrap",
                    isActive && "bg-primary/10 text-primary"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <main className="container py-6">
        {children}
      </main>
    </div>
  );
}
