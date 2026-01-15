import { useState } from "react";
import { TikTokShopLayout } from "@/components/tiktok/TikTokShopLayout";
import { TikTokConnectionBanner } from "@/components/tiktok/TikTokConnectionBanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  ShoppingCart, 
  Search, 
  Filter,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Eye
} from "lucide-react";
import { useTikTokConnection } from "@/contexts/TikTokConnectionContext";

const mockOrders = [
  { id: "TK001234", customer: "Maria Silva", product: "Kit Skincare Vitamina C", quantity: 2, total: 189.90, status: "delivered", date: "2024-01-10" },
  { id: "TK001235", customer: "João Santos", product: "Sérum Facial Retinol", quantity: 1, total: 79.90, status: "shipped", date: "2024-01-10" },
  { id: "TK001236", customer: "Ana Oliveira", product: "Protetor Solar FPS50", quantity: 3, total: 149.70, status: "processing", date: "2024-01-09" },
  { id: "TK001237", customer: "Carlos Lima", product: "Hidratante Corporal", quantity: 1, total: 59.90, status: "pending", date: "2024-01-09" },
  { id: "TK001238", customer: "Julia Ferreira", product: "Kit Maquiagem Completo", quantity: 1, total: 299.90, status: "cancelled", date: "2024-01-08" },
];

const statusConfig = {
  delivered: { label: "Entregue", icon: CheckCircle2, color: "bg-success text-success-foreground" },
  shipped: { label: "Enviado", icon: Truck, color: "bg-blue-500 text-white" },
  processing: { label: "Processando", icon: Package, color: "bg-warning text-warning-foreground" },
  pending: { label: "Pendente", icon: Clock, color: "bg-muted text-muted-foreground" },
  cancelled: { label: "Cancelado", icon: XCircle, color: "bg-destructive text-destructive-foreground" },
};

export default function TikTokOrders() {
  const { isConnected } = useTikTokConnection();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = mockOrders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: mockOrders.length,
    pending: mockOrders.filter(o => o.status === "pending").length,
    processing: mockOrders.filter(o => o.status === "processing").length,
    shipped: mockOrders.filter(o => o.status === "shipped").length,
    delivered: mockOrders.filter(o => o.status === "delivered").length,
  };

  return (
    <TikTokShopLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            Pedidos
          </h1>
          <p className="text-muted-foreground">
            Gerencie todos os pedidos do TikTok Shop
          </p>
        </div>

        <TikTokConnectionBanner />

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Total Pedidos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-warning">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Pendentes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-orange-500">{stats.processing}</div>
              <p className="text-xs text-muted-foreground">Processando</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-blue-500">{stats.shipped}</div>
              <p className="text-xs text-muted-foreground">Enviados</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-success">{stats.delivered}</div>
              <p className="text-xs text-muted-foreground">Entregues</p>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Lista de Pedidos</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Buscar pedidos..." 
                    className="pl-9 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead className="text-center">Qtd</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const status = statusConfig[order.status as keyof typeof statusConfig];
                  const StatusIcon = status.icon;
                  
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono font-medium">{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{order.product}</TableCell>
                      <TableCell className="text-center">{order.quantity}</TableCell>
                      <TableCell className="text-right font-medium">
                        R$ {order.total.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={status.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(order.date).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </TikTokShopLayout>
  );
}
