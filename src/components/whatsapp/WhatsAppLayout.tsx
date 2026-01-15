import { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Send, 
  Users, 
  UsersRound, 
  Calendar, 
  Bot, 
  Target, 
  BarChart3,
  ArrowLeft,
  MessageCircle,
  Smartphone,
  Search,
  FileUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface WhatsAppLayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: '/whatsapp/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/whatsapp/instances', label: 'Instâncias', icon: Smartphone },
  { path: '/whatsapp/send', label: 'Enviar', icon: Send },
  { path: '/whatsapp/contacts', label: 'Contatos', icon: Users },
  { path: '/whatsapp/groups', label: 'Grupos', icon: UsersRound },
  { path: '/whatsapp/schedule', label: 'Agendar', icon: Calendar },
  { path: '/whatsapp/chatbot', label: 'Chatbot IA', icon: Bot },
  { path: '/whatsapp/leads', label: 'Leads', icon: Target },
  { path: '/whatsapp/lead-scraper', label: 'Scraper', icon: Search },
  { path: '/whatsapp/contact-lists', label: 'Listas', icon: FileUp },
  { path: '/whatsapp/reports', label: 'Relatórios', icon: BarChart3 },
];

export function WhatsAppLayout({ children }: WhatsAppLayoutProps) {
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
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[hsl(var(--whatsapp))] text-white">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">WA Sender Pro</h1>
                <p className="text-xs text-muted-foreground">Automação WhatsApp com IA</p>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
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
                      isActive && "bg-[hsl(var(--whatsapp)/0.1)] text-[hsl(var(--whatsapp))]"
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
      <div className="lg:hidden sticky top-16 z-40 w-full overflow-x-auto border-b bg-background/95 backdrop-blur">
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
                    isActive && "bg-[hsl(var(--whatsapp)/0.1)] text-[hsl(var(--whatsapp))]"
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
