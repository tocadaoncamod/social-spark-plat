import { WhatsAppLayout } from "@/components/whatsapp/WhatsAppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useWhatsAppMessageStats, useWhatsAppMessages } from "@/hooks/useWhatsAppMessages";
import { useWhatsAppLeads } from "@/hooks/useWhatsAppLeads";
import { useWhatsAppCampaigns } from "@/hooks/useWhatsAppCampaigns";
import {
  BarChart3,
  Send,
  MessageCircle,
  TrendingUp,
  Target,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

export default function WhatsAppReports() {
  const { data: stats, isLoading: loadingStats } = useWhatsAppMessageStats();
  const { data: messages } = useWhatsAppMessages(null, 100);
  const { data: leads } = useWhatsAppLeads();
  const { data: campaigns } = useWhatsAppCampaigns();

  // Process data for charts
  const leadsByClassification = [
    { name: "Quentes", value: leads?.filter((l) => l.classification === "hot").length || 0, color: "#ef4444" },
    { name: "Mornos", value: leads?.filter((l) => l.classification === "warm").length || 0, color: "#f97316" },
    { name: "Frios", value: leads?.filter((l) => l.classification === "cold").length || 0, color: "#3b82f6" },
    { name: "Novos", value: leads?.filter((l) => l.classification === "new").length || 0, color: "#6b7280" },
  ].filter((item) => item.value > 0);

  const campaignStats = campaigns?.map((c) => ({
    name: c.name.length > 15 ? c.name.slice(0, 15) + "..." : c.name,
    enviadas: c.sent_count,
    falhas: c.failed_count,
  })) || [];

  const messagesByStatus = [
    { name: "Enviadas", value: messages?.filter((m) => m.status === "sent").length || 0 },
    { name: "Entregues", value: messages?.filter((m) => m.status === "delivered").length || 0 },
    { name: "Lidas", value: messages?.filter((m) => m.status === "read").length || 0 },
    { name: "Falhas", value: messages?.filter((m) => m.status === "failed").length || 0 },
  ];

  return (
    <WhatsAppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Relatórios</h1>
          <p className="text-muted-foreground">
            Análise de desempenho do seu WhatsApp Marketing
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {loadingStats ? (
            <>
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </>
          ) : (
            <>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[hsl(var(--whatsapp)/0.1)]">
                      <Send className="h-6 w-6 text-[hsl(var(--whatsapp))]" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats?.totalWeek || 0}</p>
                      <p className="text-sm text-muted-foreground">Enviadas (7 dias)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                      <TrendingUp className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats?.deliveryRate || 0}%</p>
                      <p className="text-sm text-muted-foreground">Taxa de Entrega</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                      <MessageCircle className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats?.readRate || 0}%</p>
                      <p className="text-sm text-muted-foreground">Taxa de Leitura</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10">
                      <Target className="h-6 w-6 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{leads?.length || 0}</p>
                      <p className="text-sm text-muted-foreground">Total de Leads</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Message Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Status das Mensagens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={messagesByStatus}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--whatsapp))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Leads by Classification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Leads por Classificação
              </CardTitle>
            </CardHeader>
            <CardContent>
              {leadsByClassification.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={leadsByClassification}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {leadsByClassification.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                  Nenhum lead encontrado
                </div>
              )}
            </CardContent>
          </Card>

          {/* Campaign Performance */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Performance das Campanhas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {campaignStats.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={campaignStats}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="enviadas" fill="hsl(var(--whatsapp))" name="Enviadas" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="falhas" fill="#ef4444" name="Falhas" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  Nenhuma campanha encontrada
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Campaign Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo das Campanhas</CardTitle>
          </CardHeader>
          <CardContent>
            {campaigns && campaigns.length > 0 ? (
              <div className="space-y-3">
                {campaigns.slice(0, 5).map((campaign) => {
                  const successRate =
                    campaign.total_contacts > 0
                      ? Math.round((campaign.sent_count / campaign.total_contacts) * 100)
                      : 0;

                  return (
                    <div
                      key={campaign.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                    >
                      <div>
                        <p className="font-medium">{campaign.name}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {campaign.completed_at
                              ? new Date(campaign.completed_at).toLocaleDateString("pt-BR")
                              : "Em andamento"}
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            {campaign.sent_count}
                          </span>
                          <span className="flex items-center gap-1">
                            <XCircle className="h-3 w-3 text-red-500" />
                            {campaign.failed_count}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{successRate}%</p>
                        <p className="text-xs text-muted-foreground">Taxa de Sucesso</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                <Send className="h-8 w-8 mb-2 opacity-20" />
                <p>Nenhuma campanha encontrada</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </WhatsAppLayout>
  );
}
