import { useState } from "react";
import { WhatsAppLayout } from "@/components/whatsapp/WhatsAppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useWhatsAppScheduled,
  useCreateScheduled,
  useCancelScheduled,
  useDeleteScheduled,
} from "@/hooks/useWhatsAppScheduled";
import { useWhatsAppInstances } from "@/hooks/useWhatsAppInstances";
import {
  Calendar,
  Clock,
  Plus,
  Send,
  X,
  Trash2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function WhatsAppSchedule() {
  const { data: scheduled, isLoading } = useWhatsAppScheduled();
  const { data: instances } = useWhatsAppInstances();
  const createScheduled = useCreateScheduled();
  const cancelScheduled = useCancelScheduled();
  const deleteScheduled = useDeleteScheduled();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [newSchedule, setNewSchedule] = useState({
    phone: "",
    message: "",
    scheduledDate: "",
    scheduledTime: "",
    instanceId: "",
  });

  const connectedInstances = instances?.filter((i) => i.status === "connected") || [];

  const filteredScheduled = scheduled?.filter((s) => {
    if (filter === "all") return true;
    return s.status === filter;
  });

  const handleCreate = async () => {
    if (!newSchedule.phone || !newSchedule.message || !newSchedule.scheduledDate || !newSchedule.scheduledTime) {
      return;
    }

    const scheduledFor = new Date(`${newSchedule.scheduledDate}T${newSchedule.scheduledTime}`);

    await createScheduled.mutateAsync({
      phone: newSchedule.phone.replace(/\D/g, ""),
      message: newSchedule.message,
      scheduled_for: scheduledFor.toISOString(),
      instance_id: newSchedule.instanceId || null,
      contact_id: null,
      media_url: null,
      media_type: null,
    });

    setNewSchedule({
      phone: "",
      message: "",
      scheduledDate: "",
      scheduledTime: "",
      instanceId: "",
    });
    setDialogOpen(false);
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-amber-500/10 text-amber-600">Pendente</Badge>;
      case "sent":
        return <Badge variant="secondary" className="bg-green-500/10 text-green-600">Enviada</Badge>;
      case "cancelled":
        return <Badge variant="secondary" className="bg-gray-500/10 text-gray-600">Cancelada</Badge>;
      case "failed":
        return <Badge variant="secondary" className="bg-red-500/10 text-red-600">Falhou</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const pendingCount = scheduled?.filter((s) => s.status === "pending").length || 0;
  const sentCount = scheduled?.filter((s) => s.status === "sent").length || 0;

  return (
    <WhatsAppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Agendamento</h1>
            <p className="text-muted-foreground">
              Programe mensagens para envio automático
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-[hsl(var(--whatsapp))] hover:bg-[hsl(var(--whatsapp))]/90">
                <Plus className="h-4 w-4" />
                Agendar Mensagem
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Nova Mensagem Agendada</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Telefone</Label>
                    <Input
                      placeholder="5511999999999"
                      value={newSchedule.phone}
                      onChange={(e) =>
                        setNewSchedule({ ...newSchedule, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Instância</Label>
                    <Select
                      value={newSchedule.instanceId}
                      onValueChange={(v) =>
                        setNewSchedule({ ...newSchedule, instanceId: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {connectedInstances.map((instance) => (
                          <SelectItem key={instance.id} value={instance.id}>
                            {instance.instance_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Mensagem</Label>
                  <Textarea
                    placeholder="Digite sua mensagem..."
                    value={newSchedule.message}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, message: e.target.value })
                    }
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Data</Label>
                    <Input
                      type="date"
                      value={newSchedule.scheduledDate}
                      onChange={(e) =>
                        setNewSchedule({ ...newSchedule, scheduledDate: e.target.value })
                      }
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Horário</Label>
                    <Input
                      type="time"
                      value={newSchedule.scheduledTime}
                      onChange={(e) =>
                        setNewSchedule({ ...newSchedule, scheduledTime: e.target.value })
                      }
                    />
                  </div>
                </div>

                <Button
                  className="w-full bg-[hsl(var(--whatsapp))] hover:bg-[hsl(var(--whatsapp))]/90"
                  onClick={handleCreate}
                  disabled={createScheduled.isPending}
                >
                  {createScheduled.isPending ? "Agendando..." : "Agendar Mensagem"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
                  <Clock className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingCount}</p>
                  <p className="text-sm text-muted-foreground">Pendentes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{sentCount}</p>
                  <p className="text-sm text-muted-foreground">Enviadas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[hsl(var(--whatsapp)/0.1)]">
                  <Calendar className="h-6 w-6 text-[hsl(var(--whatsapp))]" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{scheduled?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Total Agendadas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Mensagens Agendadas</CardTitle>
              <Tabs value={filter} onValueChange={setFilter}>
                <TabsList>
                  <TabsTrigger value="all">Todas</TabsTrigger>
                  <TabsTrigger value="pending">Pendentes</TabsTrigger>
                  <TabsTrigger value="sent">Enviadas</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-20" />
                ))}
              </div>
            ) : filteredScheduled && filteredScheduled.length > 0 ? (
              <div className="space-y-3">
                {filteredScheduled.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between p-4 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--whatsapp)/0.1)]">
                        <Send className="h-5 w-5 text-[hsl(var(--whatsapp))]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{item.phone}</p>
                          {statusBadge(item.status)}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {item.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(item.scheduled_for), "dd/MM/yyyy 'às' HH:mm", {
                            locale: ptBR,
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {item.status === "pending" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => cancelScheduled.mutate(item.id)}
                          disabled={cancelScheduled.isPending}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteScheduled.mutate(item.id)}
                        disabled={deleteScheduled.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                <Calendar className="h-12 w-12 mb-4 opacity-20" />
                <p>Nenhuma mensagem agendada</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </WhatsAppLayout>
  );
}
