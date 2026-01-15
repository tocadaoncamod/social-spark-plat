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
import { Switch } from "@/components/ui/switch";
import { useAddFacebookGrupo } from "@/hooks/useFacebookAutomation";
import { Loader2 } from "lucide-react";

interface AddGrupoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddGrupoModal({ open, onOpenChange }: AddGrupoModalProps) {
  const [grupoId, setGrupoId] = useState("");
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [membros, setMembros] = useState("");
  const [permiteVendas, setPermiteVendas] = useState(true);

  const addGrupo = useAddFacebookGrupo();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await addGrupo.mutateAsync({
      grupo_id: grupoId,
      nome,
      descricao,
      membros: parseInt(membros) || 0,
      status: "pendente",
      permite_vendas: permiteVendas,
    });

    // Reset form
    setGrupoId("");
    setNome("");
    setDescricao("");
    setMembros("");
    setPermiteVendas(true);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Grupo</DialogTitle>
          <DialogDescription>
            Adicione um grupo do Facebook para automação
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="grupoId">ID do Grupo *</Label>
            <Input
              id="grupoId"
              value={grupoId}
              onChange={(e) => setGrupoId(e.target.value)}
              placeholder="Ex: 123456789"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Grupo *</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome do grupo"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descrição do grupo"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="membros">Número de Membros</Label>
            <Input
              id="membros"
              type="number"
              value={membros}
              onChange={(e) => setMembros(e.target.value)}
              placeholder="Ex: 50000"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="permiteVendas">Permite Vendas</Label>
            <Switch
              id="permiteVendas"
              checked={permiteVendas}
              onCheckedChange={setPermiteVendas}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={addGrupo.isPending}>
              {addGrupo.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adicionando...
                </>
              ) : (
                "Adicionar Grupo"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
