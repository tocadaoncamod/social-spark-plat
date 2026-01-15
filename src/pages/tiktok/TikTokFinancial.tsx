import { useState } from "react";
import { TikTokShopLayout } from "@/components/tiktok/TikTokShopLayout";
import { StatsCard } from "@/components/tiktok/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
import { useTikTokFinancial, useTikTokSales, useTikTokInfluencers } from "@/hooks/useTikTokData";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const transactionTypeLabels = {
  sale: 'Venda',
  refund: 'Reembolso',
  commission: 'Comissão',
  fee: 'Taxa',
  payout: 'Saque',
};

const transactionTypeColors = {
  sale: "bg-green-500/10 text-green-500",
  refund: "bg-red-500/10 text-red-500",
  commission: "bg-purple-500/10 text-purple-500",
  fee: "bg-orange-500/10 text-orange-500",
  payout: "bg-blue-500/10 text-blue-500",
};

const statusColors = {
  pending: "bg-yellow-500/10 text-yellow-500",
  completed: "bg-green-500/10 text-green-500",
  failed: "bg-red-500/10 text-red-500",
  cancelled: "bg-gray-500/10 text-gray-500",
};

type Period = '7d' | '30d' | '90d' | '1y';

export default function TikTokFinancial() {
  const [period, setPeriod] = useState<Period>('30d');
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const { data: financial, isLoading: financialLoading } = useTikTokFinancial();
  const { data: sales, isLoading: salesLoading } = useTikTokSales();
  const { data: influencers, isLoading: influencersLoading } = useTikTokInfluencers();

  const isLoading = financialLoading || salesLoading || influencersLoading;

  // Calculate date range
  const getDateRange = () => {
    const end = new Date();
    const start = new Date();
    switch (period) {
      case '7d': start.setDate(end.getDate() - 7); break;
      case '30d': start.setDate(end.getDate() - 30); break;
      case '90d': start.setDate(end.getDate() - 90); break;
      case '1y': start.setFullYear(end.getFullYear() - 1); break;
    }
    return { start, end };
  };

  const { start } = getDateRange();
  
  const filteredFinancial = financial?.filter(t => {
    const matchesDate = new Date(t.transaction_date) >= start;
    const matchesType = typeFilter === "all" || t.transaction_type === typeFilter;
    return matchesDate && matchesType;
  }) || [];

  const filteredSales = sales?.filter(s => new Date(s.sale_date) >= start) || [];

  // Calculate stats
  const totalRevenue = filteredSales
    .filter(s => s.payment_status === 'paid')
    .reduce((sum, s) => sum + Number(s.total_amount), 0);

  const totalRefunds = filteredFinancial
    .filter(t => t.transaction_type === 'refund' && t.status === 'completed')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalCommissions = influencers?.reduce((sum, i) => sum + Number(i.commission_earned), 0) || 0;

  const pendingPayments = filteredSales
    .filter(s => s.payment_status === 'pending')
    .reduce((sum, s) => sum + Number(s.total_amount), 0);

  const netProfit = totalRevenue - totalRefunds - totalCommissions;

  // Revenue by date for chart
  const revenueByDate = filteredSales.reduce((acc, sale) => {
    const date = new Date(sale.sale_date).toLocaleDateString('pt-BR');
    if (sale.payment_status === 'paid') {
      acc[date] = (acc[date] || 0) + Number(sale.total_amount);
    }
    return acc;
  }, {} as Record<string, number>);

  const revenueChartData = Object.entries(revenueByDate)
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => {
      const dateA = new Date(a.date.split('/').reverse().join('-'));
      const dateB = new Date(b.date.split('/').reverse().join('-'));
      return dateA.getTime() - dateB.getTime();
    });

  return (
    <TikTokShopLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Financeiro</h1>
            <p className="text-muted-foreground">
              Controle de receitas, lucros e pagamentos
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div className="flex rounded-lg border bg-muted/50 p-1">
                {(['7d', '30d', '90d', '1y'] as Period[]).map((p) => (
                  <Button
                    key={p}
                    variant={period === p ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setPeriod(p)}
                    className="px-3"
                  >
                    {p === '7d' ? '7d' : p === '30d' ? '30d' : p === '90d' ? '90d' : '1a'}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {isLoading ? (
            <>
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </>
          ) : (
            <>
              <StatsCard
                title="Receita Bruta"
                value={formatCurrency(totalRevenue)}
                icon={<DollarSign className="h-6 w-6" />}
                trend={{ value: 12.5, isPositive: true }}
              />
              <StatsCard
                title="Lucro Líquido"
                value={formatCurrency(netProfit)}
                icon={<TrendingUp className="h-6 w-6" />}
                trend={{ value: 8.3, isPositive: netProfit > 0 }}
              />
              <StatsCard
                title="Reembolsos"
                value={formatCurrency(totalRefunds)}
                icon={<TrendingDown className="h-6 w-6" />}
                className={totalRefunds > 0 ? "border-red-500/20" : ""}
              />
              <StatsCard
                title="Comissões"
                value={formatCurrency(totalCommissions)}
                icon={<ArrowDownRight className="h-6 w-6" />}
              />
              <StatsCard
                title="Pendentes"
                value={formatCurrency(pendingPayments)}
                icon={<Clock className="h-6 w-6" />}
                className={pendingPayments > 0 ? "border-yellow-500/20" : ""}
              />
            </>
          )}
        </div>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpRight className="h-5 w-5 text-green-500" />
              Receita por Período
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px]" />
            ) : revenueChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    tickFormatter={(value) => `R$${value}`}
                  />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(Number(value)), 'Receita']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                Nenhuma receita no período selecionado
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Histórico de Transações</CardTitle>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="sale">Vendas</SelectItem>
                <SelectItem value="refund">Reembolsos</SelectItem>
                <SelectItem value="commission">Comissões</SelectItem>
                <SelectItem value="fee">Taxas</SelectItem>
                <SelectItem value="payout">Saques</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : filteredFinancial.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFinancial.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="text-muted-foreground">
                          {new Date(transaction.transaction_date).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <Badge className={transactionTypeColors[transaction.transaction_type]}>
                            {transactionTypeLabels[transaction.transaction_type]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {transaction.description || '-'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusColors[transaction.status]}>
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={
                            transaction.transaction_type === 'sale' || transaction.transaction_type === 'payout'
                              ? 'text-green-500'
                              : 'text-red-500'
                          }>
                            {transaction.transaction_type === 'sale' || transaction.transaction_type === 'payout'
                              ? '+'
                              : '-'}
                            {formatCurrency(Number(transaction.amount))}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <DollarSign className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="font-medium">Nenhuma transação encontrada</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {typeFilter !== "all" 
                    ? "Tente ajustar os filtros"
                    : "As transações aparecerão aqui"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumo de Vendas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vendas pagas</span>
                <span className="font-medium text-green-500">
                  {formatCurrency(totalRevenue)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pendentes</span>
                <span className="font-medium text-yellow-500">
                  {formatCurrency(pendingPayments)}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="font-medium">Total</span>
                <span className="font-bold">
                  {formatCurrency(totalRevenue + pendingPayments)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Deduções</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reembolsos</span>
                <span className="font-medium text-red-500">
                  -{formatCurrency(totalRefunds)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Comissões</span>
                <span className="font-medium text-purple-500">
                  -{formatCurrency(totalCommissions)}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="font-medium">Total</span>
                <span className="font-bold text-red-500">
                  -{formatCurrency(totalRefunds + totalCommissions)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-500/20 bg-green-500/5">
            <CardHeader>
              <CardTitle className="text-lg">Lucro Líquido</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-500">
                {formatCurrency(netProfit)}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Margem de lucro: {totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0}%
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </TikTokShopLayout>
  );
}
