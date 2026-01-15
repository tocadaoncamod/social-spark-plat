import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAgendarPostGrupo, useFacebookGrupos } from "@/hooks/useFacebookAutomation";
import { Loader2, Clock, Zap, Calendar, Users, TrendingUp } from "lucide-react";
import { format, addDays, setHours, setMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SchedulePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Horários otimizados baseados em estudos de engajamento
const HORARIOS_OTIMIZADOS = [
  { hora: 9, minuto: 0, label: "09:00", engajamento: "alto", motivo: "Início do expediente" },
  { hora: 12, minuto: 30, label: "12:30", engajamento: "muito alto", motivo: "Horário de almoço" },
  { hora: 14, minuto: 0, label: "14:00", engajamento: "alto", motivo: "Volta do almoço" },
  { hora: 18, minuto: 0, label: "18:00", engajamento: "muito alto", motivo: "Fim do expediente" },
  { hora: 20, minuto: 0, label: "20:00", engajamento: "alto", motivo: "Horário nobre" },
  { hora: 21, minuto: 30, label: "21:30", engajamento: "muito alto", motivo: "Pico de uso" },
];

const DIAS_SEMANA = [
  { value: 0, label: "Dom", melhor: false },
  { value: 1, label: "Seg", melhor: true },
  { value: 2, label: "Ter", melhor: true },
  { value: 3, label: "Qua", melhor: true },
  { value: 4, label: "Qui", melhor: true },
  { value: 5, label: "Sex", melhor: true },
  { value: 6, label: "Sáb", melhor: false },
];

export function SchedulePostModal({ open, onOpenChange }: SchedulePostModalProps) {
  const [texto, setTexto] = useState("");
  const [imagemUrl, setImagemUrl] = useState("");
  const [link, setLink] = useState("");
  const [selectedGrupos, setSelectedGrupos] = useState<string[]>([]);
  const [scheduleType, setScheduleType] = useState<"otimizado" | "manual">("otimizado");
  const [selectedHorario, setSelectedHorario] = useState<number>(3); // 18:00 default
  const [selectedDias, setSelectedDias] = useState<number[]>([1, 2, 3, 4, 5]); // Seg-Sex
  const [customDate, setCustomDate] = useState("");
  const [customTime, setCustomTime] = useState("");

  const { data: grupos, isLoading: loadingGrupos } = useFacebookGrupos();
  const agendarPost = useAgendarPostGrupo();

  const gruposAtivos = grupos?.filter(g => g.status === "ativo" || g.status === "aprovado") || [];

  const toggleGrupo = (grupoId: string) => {
    setSelectedGrupos(prev => 
      prev.includes(grupoId) 
        ? prev.filter(id => id !== grupoId)
        : [...prev, grupoId]
    );
  };

  const toggleDia = (dia: number) => {
    setSelectedDias(prev =>
      prev.includes(dia)
        ? prev.filter(d => d !== dia)
        : [...prev, dia]
    );
  };

  const selectAllGrupos = () => {
    setSelectedGrupos(gruposAtivos.map(g => g.id));
  };

  const getEngajamentoBadge = (engajamento: string) => {
    if (engajamento === "muito alto") {
      return <Badge className="bg-green-500 text-white text-xs">🔥 Muito Alto</Badge>;
    }
    return <Badge variant="secondary" className="text-xs">⚡ Alto</Badge>;
  };

  const calcularProximosHorarios = () => {
    const horarios: Date[] = [];
    const horario = HORARIOS_OTIMIZADOS[selectedHorario];
    const hoje = new Date();
    
    for (let i = 0; i < 7; i++) {
      const dia = addDays(hoje, i);
      if (selectedDias.includes(dia.getDay())) {
        const dataHora = setMinutes(setHours(dia, horario.hora), horario.minuto);
        if (dataHora > hoje) {
          horarios.push(dataHora);
        }
      }
    }
    
    return horarios.slice(0, 5);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedGrupos.length === 0) {
      return;
    }

    const horarios = scheduleType === "otimizado" 
      ? calcularProximosHorarios()
      : [new Date(`${customDate}T${customTime}`)];

    // Agendar posts em cada grupo selecionado
    for (let i = 0; i < selectedGrupos.length; i++) {
      const grupoId = selectedGrupos[i];
      const horarioIndex = i % horarios.length;
      const agendadoPara = horarios[horarioIndex];

      await agendarPost.mutateAsync({
        grupo_id: grupoId,
        texto,
        imagem_url: imagemUrl || undefined,
        link: link || undefined,
        status: "agendado",
        agendado_para: agendadoPara.toISOString(),
      });
    }

    // Reset form
    setTexto("");
    setImagemUrl("");
    setLink("");
    setSelectedGrupos([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#1877F2]" />
            Agendar Posts nos Grupos
          </DialogTitle>
          <DialogDescription>
            Agende posts com horários otimizados para máximo engajamento
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col gap-4">
          {/* Conteúdo do Post */}
          <div className="space-y-3">
            <Label>Texto do Post *</Label>
            <Textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Digite o texto do seu post..."
              rows={3}
              required
            />
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">URL da Imagem</Label>
                <Input
                  value={imagemUrl}
                  onChange={(e) => setImagemUrl(e.target.value)}
                  placeholder="https://..."
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Link do Produto</Label>
                <Input
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://..."
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Seleção de Grupos */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Selecionar Grupos ({selectedGrupos.length})
              </Label>
              <Button type="button" variant="ghost" size="sm" onClick={selectAllGrupos}>
                Selecionar todos
              </Button>
            </div>
            
            <ScrollArea className="h-28 border rounded-lg p-2">
              {loadingGrupos ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              ) : gruposAtivos.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhum grupo ativo. Adicione grupos primeiro.
                </p>
              ) : (
                <div className="space-y-1">
                  {gruposAtivos.map((grupo) => (
                    <div key={grupo.id} className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedGrupos.includes(grupo.id)}
                        onCheckedChange={() => toggleGrupo(grupo.id)}
                      />
                      <span className="text-sm flex-1">{grupo.nome}</span>
                      <span className="text-xs text-muted-foreground">
                        {grupo.membros.toLocaleString()} membros
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Tipo de Agendamento */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Tipo de Agendamento
            </Label>
            
            <RadioGroup value={scheduleType} onValueChange={(v) => setScheduleType(v as "otimizado" | "manual")}>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="otimizado" id="otimizado" />
                  <Label htmlFor="otimizado" className="flex items-center gap-1 cursor-pointer">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    Horários Otimizados
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="manual" id="manual" />
                  <Label htmlFor="manual" className="cursor-pointer">Data/Hora Manual</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {scheduleType === "otimizado" ? (
            <div className="space-y-3">
              {/* Seleção de Dias */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Dias da Semana</Label>
                <div className="flex gap-1">
                  {DIAS_SEMANA.map((dia) => (
                    <Button
                      key={dia.value}
                      type="button"
                      size="sm"
                      variant={selectedDias.includes(dia.value) ? "default" : "outline"}
                      className={`w-10 h-8 ${dia.melhor && selectedDias.includes(dia.value) ? "bg-green-600 hover:bg-green-700" : ""}`}
                      onClick={() => toggleDia(dia.value)}
                    >
                      {dia.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Seleção de Horário */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Horário de Pico
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {HORARIOS_OTIMIZADOS.map((horario, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant={selectedHorario === index ? "default" : "outline"}
                      className={`h-auto py-2 flex flex-col gap-1 ${selectedHorario === index ? "bg-[#1877F2] hover:bg-[#1877F2]/90" : ""}`}
                      onClick={() => setSelectedHorario(index)}
                    >
                      <span className="font-bold">{horario.label}</span>
                      <span className="text-[10px] opacity-80">{horario.motivo}</span>
                      {getEngajamentoBadge(horario.engajamento)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Preview dos horários */}
              <div className="bg-muted/50 rounded-lg p-3">
                <Label className="text-xs text-muted-foreground">Próximos horários agendados:</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {calcularProximosHorarios().map((data, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {format(data, "EEE dd/MM HH:mm", { locale: ptBR })}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Data</Label>
                <Input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  required={scheduleType === "manual"}
                />
              </div>
              <div className="space-y-2">
                <Label>Hora</Label>
                <Input
                  type="time"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  required={scheduleType === "manual"}
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={agendarPost.isPending || selectedGrupos.length === 0 || !texto.trim()}
              className="bg-[#1877F2] hover:bg-[#1877F2]/90"
            >
              {agendarPost.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Agendando...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Agendar {selectedGrupos.length} Post(s)
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
