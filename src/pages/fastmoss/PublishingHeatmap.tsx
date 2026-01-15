import { FastMossLayout } from "@/components/fastmoss/FastMossLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  TrendingUp,
  Zap,
  Calendar,
  Info,
} from "lucide-react";

const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const hoursOfDay = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}h`);

// Generate mock heatmap data
const generateHeatmapData = () => {
  const data: { [key: string]: number } = {};
  daysOfWeek.forEach((day, dayIndex) => {
    hoursOfDay.forEach((hour, hourIndex) => {
      // Simulate higher engagement during evening hours and weekends
      let baseValue = Math.random() * 50;
      if (hourIndex >= 18 && hourIndex <= 22) baseValue += 30;
      if (hourIndex >= 12 && hourIndex <= 14) baseValue += 15;
      if (dayIndex === 0 || dayIndex === 6) baseValue += 20;
      data[`${day}-${hour}`] = Math.round(baseValue);
    });
  });
  return data;
};

const heatmapData = generateHeatmapData();

const getHeatColor = (value: number) => {
  if (value >= 80) return "bg-tiktok";
  if (value >= 60) return "bg-tiktok/80";
  if (value >= 40) return "bg-tiktok/60";
  if (value >= 20) return "bg-tiktok/40";
  return "bg-tiktok/20";
};

const bestTimes = [
  { day: "Sexta", time: "20:00 - 22:00", engagement: 95 },
  { day: "Sábado", time: "19:00 - 21:00", engagement: 92 },
  { day: "Domingo", time: "18:00 - 20:00", engagement: 88 },
  { day: "Quinta", time: "21:00 - 23:00", engagement: 85 },
];

const insights = [
  {
    title: "Melhor horário geral",
    value: "20:00 - 22:00",
    description: "Maior engajamento durante o horário nobre",
    icon: Clock,
  },
  {
    title: "Melhor dia da semana",
    value: "Sexta-feira",
    description: "Usuários mais ativos no final de semana",
    icon: Calendar,
  },
  {
    title: "Pico de engajamento",
    value: "+95%",
    description: "Sexta às 21h tem o maior índice",
    icon: Zap,
  },
  {
    title: "Horário a evitar",
    value: "04:00 - 06:00",
    description: "Menor atividade dos usuários",
    icon: TrendingUp,
  },
];

export default function PublishingHeatmap() {
  return (
    <FastMossLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Hora de Publicação</h1>
            <p className="text-muted-foreground">Análise dos melhores horários para publicar no TikTok</p>
          </div>
          <div className="flex items-center gap-3">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas categorias</SelectItem>
                <SelectItem value="moda">Moda</SelectItem>
                <SelectItem value="beleza">Beleza</SelectItem>
                <SelectItem value="tech">Tecnologia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Insights Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          {insights.map((insight) => (
            <Card key={insight.title}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-tiktok/10">
                    <insight.icon className="h-5 w-5 text-tiktok" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{insight.title}</p>
                    <p className="text-lg font-bold">{insight.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Heatmap */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Mapa de Calor de Engajamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Hours header */}
                <div className="flex gap-1 mb-1 ml-12">
                  {hoursOfDay.map((hour, i) => (
                    i % 2 === 0 && (
                      <div key={hour} className="w-8 text-center text-xs text-muted-foreground">
                        {hour}
                      </div>
                    )
                  ))}
                </div>
                
                {/* Heatmap grid */}
                {daysOfWeek.map((day) => (
                  <div key={day} className="flex gap-1 mb-1 items-center">
                    <div className="w-10 text-sm font-medium text-muted-foreground">{day}</div>
                    {hoursOfDay.map((hour) => {
                      const value = heatmapData[`${day}-${hour}`];
                      return (
                        <div
                          key={`${day}-${hour}`}
                          className={`w-4 h-6 rounded-sm ${getHeatColor(value)} cursor-pointer transition-all hover:scale-110`}
                          title={`${day} ${hour}: ${value}% engajamento`}
                        />
                      );
                    })}
                  </div>
                ))}

                {/* Legend */}
                <div className="flex items-center gap-4 mt-6 justify-center">
                  <span className="text-sm text-muted-foreground">Menor</span>
                  <div className="flex gap-1">
                    <div className="w-6 h-4 rounded bg-tiktok/20" />
                    <div className="w-6 h-4 rounded bg-tiktok/40" />
                    <div className="w-6 h-4 rounded bg-tiktok/60" />
                    <div className="w-6 h-4 rounded bg-tiktok/80" />
                    <div className="w-6 h-4 rounded bg-tiktok" />
                  </div>
                  <span className="text-sm text-muted-foreground">Maior engajamento</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Best Times */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Zap className="h-5 w-5 text-tiktok" />
              Melhores Horários para Publicar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {bestTimes.map((time, index) => (
                <div
                  key={time.day}
                  className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-tiktok text-white">#{index + 1}</Badge>
                    <span className="font-semibold">{time.day}</span>
                  </div>
                  <p className="text-lg font-bold text-tiktok">{time.time}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-tiktok rounded-full" 
                        style={{ width: `${time.engagement}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{time.engagement}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Info className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Dicas para Otimizar seus Posts</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Publique 15-30 minutos antes do horário de pico para maximizar o alcance inicial</li>
                  <li>• Evite publicar em horários de baixo engajamento (madrugada)</li>
                  <li>• Considere o fuso horário do seu público-alvo</li>
                  <li>• Teste diferentes horários e monitore os resultados</li>
                  <li>• Finais de semana tendem a ter maior engajamento para conteúdo de entretenimento</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </FastMossLayout>
  );
}
