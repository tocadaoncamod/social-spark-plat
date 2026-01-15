import { useState } from "react";
import { WhatsAppLayout } from "@/components/whatsapp/WhatsAppLayout";
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
import { Label } from "@/components/ui/label";
import {
  useWhatsAppContacts,
  useCreateWhatsAppContact,
  useDeleteWhatsAppContact,
} from "@/hooks/useWhatsAppContacts";
import { useWhatsAppInstances, useFetchContacts } from "@/hooks/useWhatsAppInstances";
import {
  Users,
  Plus,
  Search,
  Download,
  Trash2,
  Phone,
  RefreshCw,
  Upload,
} from "lucide-react";

export default function WhatsAppContacts() {
  const { data: contacts, isLoading } = useWhatsAppContacts();
  const { data: instances } = useWhatsAppInstances();
  const createContact = useCreateWhatsAppContact();
  const deleteContact = useDeleteWhatsAppContact();
  const fetchContacts = useFetchContacts();

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newPhone, setNewPhone] = useState("");
  const [newName, setNewName] = useState("");

  const connectedInstances = instances?.filter((i) => i.status === "connected") || [];

  const filteredContacts = contacts?.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  const handleCreate = async () => {
    if (!newPhone) return;
    await createContact.mutateAsync({
      phone: newPhone.replace(/\D/g, ""),
      name: newName || null,
    });
    setNewPhone("");
    setNewName("");
    setDialogOpen(false);
  };

  const handleExportCSV = () => {
    if (!contacts) return;
    const csv = [
      "telefone,nome,origem,grupo,tags",
      ...contacts.map(
        (c) =>
          `${c.phone},${c.name || ""},${c.source || "manual"},${c.group_name || ""},${c.tags?.join(";") || ""}`
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contatos-whatsapp.csv";
    a.click();
  };

  const sourceBadgeColor = (source: string) => {
    switch (source) {
      case "whatsapp":
        return "bg-[hsl(var(--whatsapp)/0.1)] text-[hsl(var(--whatsapp))]";
      case "group":
        return "bg-purple-500/10 text-purple-500";
      case "chat":
        return "bg-blue-500/10 text-blue-500";
      default:
        return "";
    }
  };

  return (
    <WhatsAppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Contatos</h1>
            <p className="text-muted-foreground">
              Gerencie sua lista de contatos do WhatsApp
            </p>
          </div>
          <div className="flex items-center gap-2">
            {connectedInstances.length > 0 && (
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => fetchContacts.mutate(connectedInstances[0].id)}
                disabled={fetchContacts.isPending}
              >
                <RefreshCw
                  className={`h-4 w-4 ${fetchContacts.isPending ? "animate-spin" : ""}`}
                />
                Sincronizar
              </Button>
            )}
            <Button variant="outline" className="gap-2" onClick={handleExportCSV}>
              <Download className="h-4 w-4" />
              Exportar CSV
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-[hsl(var(--whatsapp))] hover:bg-[hsl(var(--whatsapp))]/90">
                  <Plus className="h-4 w-4" />
                  Adicionar Contato
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Contato</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Telefone</Label>
                    <Input
                      placeholder="5511999999999"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nome (opcional)</Label>
                    <Input
                      placeholder="Nome do contato"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                    />
                  </div>
                  <Button
                    className="w-full bg-[hsl(var(--whatsapp))] hover:bg-[hsl(var(--whatsapp))]/90"
                    onClick={handleCreate}
                    disabled={!newPhone || createContact.isPending}
                  >
                    {createContact.isPending ? "Salvando..." : "Salvar Contato"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[hsl(var(--whatsapp)/0.1)]">
                  <Users className="h-6 w-6 text-[hsl(var(--whatsapp))]" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{contacts?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Total de Contatos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10">
                  <Users className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {contacts?.filter((c) => c.source === "group").length || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">De Grupos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                  <Phone className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {contacts?.filter((c) => c.is_valid).length || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Válidos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10">
                  <Upload className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {contacts?.filter((c) => c.source === "import").length || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Importados</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Lista de Contatos</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar contatos..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12" />
                ))}
              </div>
            ) : filteredContacts && filteredContacts.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Origem</TableHead>
                    <TableHead>Grupo</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead className="w-16"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium">
                        {contact.name || "—"}
                      </TableCell>
                      <TableCell>{contact.phone}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={sourceBadgeColor(contact.source || "manual")}
                        >
                          {contact.source || "manual"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {contact.group_name || "—"}
                      </TableCell>
                      <TableCell>
                        {contact.tags && contact.tags.length > 0 ? (
                          <div className="flex gap-1">
                            {contact.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {contact.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{contact.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteContact.mutate(contact.id)}
                          disabled={deleteContact.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                <Users className="h-12 w-12 mb-4 opacity-20" />
                <p>Nenhum contato encontrado</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </WhatsAppLayout>
  );
}
