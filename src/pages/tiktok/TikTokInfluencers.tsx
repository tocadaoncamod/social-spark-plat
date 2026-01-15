import { useState } from "react";
import { TikTokShopLayout } from "@/components/tiktok/TikTokShopLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useTikTokInfluencers, TikTokInfluencer } from "@/hooks/useTikTokData";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Search, 
  Users, 
  Crown,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Loader2
} from "lucide-react";

const tierColors = {
  bronze: "bg-amber-700/20 text-amber-700 border-amber-700/30",
  silver: "bg-gray-400/20 text-gray-500 border-gray-400/30",
  gold: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
  platinum: "bg-purple-500/20 text-purple-600 border-purple-500/30",
};

const tierProgress = {
  bronze: 25,
  silver: 50,
  gold: 75,
  platinum: 100,
};

const statusColors = {
  active: "bg-green-500/10 text-green-500",
  inactive: "bg-gray-500/10 text-gray-500",
  pending: "bg-yellow-500/10 text-yellow-500",
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
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

export default function TikTokInfluencers() {
  const { data: influencers, isLoading, createInfluencer } = useTikTokInfluencers();
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const filteredInfluencers = influencers?.filter(influencer => {
    const matchesSearch = influencer.tiktok_username.toLowerCase().includes(search.toLowerCase()) ||
                         influencer.display_name?.toLowerCase().includes(search.toLowerCase());
    const matchesTier = tierFilter === "all" || influencer.tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  // Calculate totals
  const totalSales = influencers?.reduce((sum, i) => sum + Number(i.total_sales), 0) || 0;
  const totalCommission = influencers?.reduce((sum, i) => sum + Number(i.commission_earned), 0) || 0;
  const totalOrders = influencers?.reduce((sum, i) => sum + i.total_orders, 0) || 0;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const influencerData = {
      tiktok_username: formData.get('tiktok_username') as string,
      display_name: formData.get('display_name') as string,
      avatar_url: formData.get('avatar_url') as string,
      followers_count: Number(formData.get('followers_count')) || 0,
      engagement_rate: Number(formData.get('engagement_rate')) || 0,
      commission_rate: Number(formData.get('commission_rate')) || 5,
      status: (formData.get('status') as TikTokInfluencer['status']) || 'pending',
      tier: (formData.get('tier') as TikTokInfluencer['tier']) || 'bronze',
      total_sales: 0,
      total_orders: 0,
      commission_earned: 0,
    };

    try {
      await createInfluencer.mutateAsync(influencerData);
      toast({ title: "Influenciador adicionado com sucesso!" });
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erro ao adicionar influenciador",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  return (
    <TikTokShopLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Influenciadores</h1>
            <p className="text-muted-foreground">
              Gerencie seus parceiros e afiliados do TikTok Shop
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Influenciador
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Novo Influenciador</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tiktok_username">Username TikTok *</Label>
                  <Input 
                    id="tiktok_username" 
                    name="tiktok_username" 
                    placeholder="@username"
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="display_name">Nome de Exibição</Label>
                  <Input 
                    id="display_name" 
                    name="display_name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatar_url">URL do Avatar</Label>
                  <Input 
                    id="avatar_url" 
                    name="avatar_url"
                    type="url"
                  />
                </div>

                <div className="grid gap-4 grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="followers_count">Seguidores</Label>
                    <Input 
                      id="followers_count" 
                      name="followers_count" 
                      type="number"
                      defaultValue={0}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="engagement_rate">Engajamento (%)</Label>
                    <Input 
                      id="engagement_rate" 
                      name="engagement_rate" 
                      type="number"
                      step="0.01"
                      defaultValue={0}
                    />
                  </div>
                </div>

                <div className="grid gap-4 grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="commission_rate">Comissão (%)</Label>
                    <Input 
                      id="commission_rate" 
                      name="commission_rate" 
                      type="number"
                      step="0.01"
                      defaultValue={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tier">Tier</Label>
                    <Select name="tier" defaultValue="bronze">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bronze">Bronze</SelectItem>
                        <SelectItem value="silver">Prata</SelectItem>
                        <SelectItem value="gold">Ouro</SelectItem>
                        <SelectItem value="platinum">Platina</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" defaultValue="pending">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit"
                    disabled={createInfluencer.isPending}
                  >
                    {createInfluencer.isPending && (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    )}
                    Adicionar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-xl font-bold">{influencers?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <DollarSign className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Vendas Totais</p>
                  <p className="text-xl font-bold">{formatCurrency(totalSales)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Crown className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Comissões</p>
                  <p className="text-xl font-bold">{formatCurrency(totalCommission)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <ShoppingCart className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pedidos</p>
                  <p className="text-xl font-bold">{totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por username ou nome..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={tierFilter} onValueChange={setTierFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="bronze">Bronze</SelectItem>
                  <SelectItem value="silver">Prata</SelectItem>
                  <SelectItem value="gold">Ouro</SelectItem>
                  <SelectItem value="platinum">Platina</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Influencers Grid */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : filteredInfluencers && filteredInfluencers.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredInfluencers.map((influencer) => (
              <Card key={influencer.id} className="hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={influencer.avatar_url || ''} />
                        <AvatarFallback>
                          {influencer.tiktok_username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">@{influencer.tiktok_username}</p>
                        {influencer.display_name && (
                          <p className="text-sm text-muted-foreground">
                            {influencer.display_name}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge className={statusColors[influencer.status]}>
                      {influencer.status}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    {/* Tier Badge */}
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant="outline" 
                        className={`${tierColors[influencer.tier]} capitalize`}
                      >
                        <Crown className="h-3 w-3 mr-1" />
                        {influencer.tier}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {influencer.commission_rate}% comissão
                      </span>
                    </div>

                    {/* Tier Progress */}
                    <div className="space-y-1">
                      <Progress value={tierProgress[influencer.tier]} className="h-1.5" />
                      <p className="text-xs text-muted-foreground text-right">
                        Próximo tier: {influencer.tier === 'platinum' ? 'Máximo' : 
                          { bronze: 'Prata', silver: 'Ouro', gold: 'Platina' }[influencer.tier]}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="text-center p-2 rounded-lg bg-muted/50">
                        <p className="text-lg font-bold">
                          {formatNumber(influencer.followers_count)}
                        </p>
                        <p className="text-xs text-muted-foreground">Seguidores</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-muted/50">
                        <p className="text-lg font-bold">
                          {Number(influencer.engagement_rate).toFixed(1)}%
                        </p>
                        <p className="text-xs text-muted-foreground">Engajamento</p>
                      </div>
                    </div>

                    {/* Sales Info */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div>
                        <p className="text-sm font-medium">{formatCurrency(Number(influencer.total_sales))}</p>
                        <p className="text-xs text-muted-foreground">em vendas</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-500">
                          {formatCurrency(Number(influencer.commission_earned))}
                        </p>
                        <p className="text-xs text-muted-foreground">comissão</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-medium">Nenhum influenciador encontrado</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {search || tierFilter !== "all" 
                  ? "Tente ajustar os filtros de busca"
                  : "Comece adicionando seu primeiro influenciador"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </TikTokShopLayout>
  );
}
