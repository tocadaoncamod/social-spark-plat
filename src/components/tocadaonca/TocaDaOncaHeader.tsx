import { useState } from "react";
import { Search, Bell, Globe, User, LogOut, ChevronDown, Crown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export function TocaDaOncaHeader() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center justify-between px-6">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Pesquisar produtos, lojas, influenciadores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 h-10 w-full bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-amber-500"
            />
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Pro Banner */}
          <Button variant="ghost" className="hidden lg:flex gap-2 text-amber-500 hover:text-amber-600">
            <Crown className="h-4 w-4" />
            <span className="text-sm font-medium">Upgrade Pro</span>
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[10px]">-50%</Badge>
          </Button>

          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                <Globe className="h-4 w-4" />
                <span className="hidden md:inline">Português</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <span className="mr-2">🇧🇷</span> Português
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span className="mr-2">🇺🇸</span> English
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span className="mr-2">🇪🇸</span> Español
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-amber-500 text-[10px] font-medium text-white flex items-center justify-center">
              3
            </span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 pl-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white text-sm">
                    {user?.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user?.user_metadata?.name || "Usuário"}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                <User className="mr-2 h-4 w-4" />
                Minha conta
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
