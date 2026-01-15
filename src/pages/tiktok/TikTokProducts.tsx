import { useState } from "react";
import { TikTokShopLayout } from "@/components/tiktok/TikTokShopLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTikTokProducts, TikTokProduct } from "@/hooks/useTikTokData";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Package, Edit, Trash2, Percent, Loader2 } from "lucide-react";

const statusColors = {
  active: "bg-green-500/10 text-green-500",
  inactive: "bg-gray-500/10 text-gray-500",
  out_of_stock: "bg-red-500/10 text-red-500",
  pending: "bg-yellow-500/10 text-yellow-500",
};

const statusLabels = {
  active: "Ativo",
  inactive: "Inativo",
  out_of_stock: "Sem estoque",
  pending: "Pendente",
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export default function TikTokProducts() {
  const { data: products, isLoading, createProduct, updateProduct, deleteProduct } = useTikTokProducts();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<TikTokProduct | null>(null);
  const { toast } = useToast();

  const filteredProducts = products?.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const productData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      compare_at_price: formData.get('compare_at_price') ? Number(formData.get('compare_at_price')) : undefined,
      stock_quantity: Number(formData.get('stock_quantity')),
      sku: formData.get('sku') as string,
      category: formData.get('category') as string,
      image_url: formData.get('image_url') as string,
      status: (formData.get('status') as TikTokProduct['status']) || 'active',
      promotion_active: formData.get('promotion_active') === 'on',
      promotion_discount: formData.get('promotion_discount') ? Number(formData.get('promotion_discount')) : undefined,
    };

    try {
      if (editingProduct) {
        await updateProduct.mutateAsync({ id: editingProduct.id, ...productData });
        toast({ title: "Produto atualizado com sucesso!" });
      } else {
        await createProduct.mutateAsync(productData);
        toast({ title: "Produto criado com sucesso!" });
      }
      setIsDialogOpen(false);
      setEditingProduct(null);
    } catch (error) {
      toast({
        title: "Erro ao salvar produto",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    
    try {
      await deleteProduct.mutateAsync(id);
      toast({ title: "Produto excluído com sucesso!" });
    } catch (error) {
      toast({
        title: "Erro ao excluir produto",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (product: TikTokProduct) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  return (
    <TikTokShopLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Produtos</h1>
            <p className="text-muted-foreground">
              Gerencie seu catálogo de produtos do TikTok Shop
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) setEditingProduct(null);
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Produto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? "Editar Produto" : "Novo Produto"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome do Produto *</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      required 
                      defaultValue={editingProduct?.name}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input 
                      id="sku" 
                      name="sku"
                      defaultValue={editingProduct?.sku || ''}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea 
                    id="description" 
                    name="description"
                    rows={3}
                    defaultValue={editingProduct?.description || ''}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="price">Preço *</Label>
                    <Input 
                      id="price" 
                      name="price" 
                      type="number" 
                      step="0.01"
                      required
                      defaultValue={editingProduct?.price}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="compare_at_price">Preço Comparativo</Label>
                    <Input 
                      id="compare_at_price" 
                      name="compare_at_price" 
                      type="number" 
                      step="0.01"
                      defaultValue={editingProduct?.compare_at_price || ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock_quantity">Estoque *</Label>
                    <Input 
                      id="stock_quantity" 
                      name="stock_quantity" 
                      type="number"
                      required
                      defaultValue={editingProduct?.stock_quantity || 0}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Input 
                      id="category" 
                      name="category"
                      defaultValue={editingProduct?.category || ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue={editingProduct?.status || 'active'}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                        <SelectItem value="out_of_stock">Sem estoque</SelectItem>
                        <SelectItem value="pending">Pendente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image_url">URL da Imagem</Label>
                  <Input 
                    id="image_url" 
                    name="image_url"
                    type="url"
                    defaultValue={editingProduct?.image_url || ''}
                  />
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Percent className="h-4 w-4" />
                    Promoção
                  </h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="promotion_active" 
                        name="promotion_active"
                        defaultChecked={editingProduct?.promotion_active}
                        className="h-4 w-4 rounded border-input"
                      />
                      <Label htmlFor="promotion_active">Promoção ativa</Label>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="promotion_discount">Desconto (%)</Label>
                      <Input 
                        id="promotion_discount" 
                        name="promotion_discount" 
                        type="number"
                        step="0.01"
                        max="100"
                        defaultValue={editingProduct?.promotion_discount || ''}
                      />
                    </div>
                  </div>
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
                    disabled={createProduct.isPending || updateProduct.isPending}
                  >
                    {(createProduct.isPending || updateProduct.isPending) && (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    )}
                    {editingProduct ? "Salvar" : "Criar Produto"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou SKU..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
                  <SelectItem value="out_of_stock">Sem estoque</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Catálogo ({filteredProducts?.length || 0} produtos)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : filteredProducts && filteredProducts.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Estoque</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Promoção</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {product.image_url ? (
                              <img 
                                src={product.image_url} 
                                alt={product.name}
                                className="h-10 w-10 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                                <Package className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {product.category || 'Sem categoria'}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {product.sku || '-'}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{formatCurrency(Number(product.price))}</p>
                            {product.compare_at_price && (
                              <p className="text-xs text-muted-foreground line-through">
                                {formatCurrency(Number(product.compare_at_price))}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={product.stock_quantity <= 5 ? "text-red-500 font-medium" : ""}>
                            {product.stock_quantity}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[product.status]}>
                            {statusLabels[product.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {product.promotion_active ? (
                            <Badge variant="outline" className="bg-green-500/10 text-green-500">
                              -{product.promotion_discount}%
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(product.id)}
                              disabled={deleteProduct.isPending}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="font-medium">Nenhum produto encontrado</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {search || statusFilter !== "all" 
                    ? "Tente ajustar os filtros de busca"
                    : "Comece adicionando seu primeiro produto"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TikTokShopLayout>
  );
}
