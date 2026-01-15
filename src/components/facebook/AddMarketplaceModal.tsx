import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAddMarketplaceProduto } from "@/hooks/useFacebookAutomation";
import { Loader2 } from "lucide-react";

interface AddMarketplaceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categorias = [
  "Roupas e Acessórios",
  "Eletrônicos",
  "Casa e Jardim",
  "Veículos",
  "Esportes",
  "Brinquedos",
  "Beleza",
  "Outros",
];

const condicoes = ["Novo", "Usado - Excelente", "Usado - Bom", "Usado - Razoável"];

export function AddMarketplaceModal({ open, onOpenChange }: AddMarketplaceModalProps) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [categoria, setCategoria] = useState("");
  const [condicao, setCondicao] = useState("Novo");
  const [localizacao, setLocalizacao] = useState("");

  const addProduto = useAddMarketplaceProduto();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await addProduto.mutateAsync({
      titulo,
      descricao,
      preco: parseFloat(preco) || 0,
      categoria,
      condicao,
      localizacao,
      status: "ativo",
    });

    // Reset form
    setTitulo("");
    setDescricao("");
    setPreco("");
    setCategoria("");
    setCondicao("Novo");
    setLocalizacao("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar ao Marketplace</DialogTitle>
          <DialogDescription>
            Adicione um produto ao Facebook Marketplace
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título *</Label>
            <Input
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Título do produto"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição *</Label>
            <Textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descrição detalhada do produto"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preco">Preço (R$) *</Label>
              <Input
                id="preco"
                type="number"
                step="0.01"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                placeholder="99.90"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Condição</Label>
              <Select value={condicao} onValueChange={setCondicao}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {condicoes.map((cond) => (
                    <SelectItem key={cond} value={cond}>
                      {cond}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select value={categoria} onValueChange={setCategoria}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="localizacao">Localização</Label>
            <Input
              id="localizacao"
              value={localizacao}
              onChange={(e) => setLocalizacao(e.target.value)}
              placeholder="Cidade, Estado"
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={addProduto.isPending}>
              {addProduto.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adicionando...
                </>
              ) : (
                "Adicionar Produto"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
