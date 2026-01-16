import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Wallet, Globe, ShieldCheck, Coins } from "lucide-react";

export function TONPaymentCard() {
    return (
        <Card className="border-blue-500/30 bg-blue-500/5">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-600 text-white">
                            <Wallet className="h-6 w-6" />
                        </div>
                        <div>
                            <CardTitle>Pagamentos TON Blockchain (Elite)</CardTitle>
                            <CardDescription>Estratégia Russa de Web3 para pagamentos globais sem fronteiras.</CardDescription>
                        </div>
                    </div>
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30">
                        Russia Style
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="p-4 rounded-xl border bg-card space-y-3">
                        <div className="flex items-center gap-2">
                            <Coins className="h-4 w-4 text-yellow-600" />
                            <h4 className="font-semibold text-sm">Status da Carteira</h4>
                        </div>
                        <div className="text-xs text-muted-foreground bg-muted p-2 rounded break-all font-mono">
                            EQB... (Nenhuma carteira conectada)
                        </div>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2">
                            Conectar TON Wallet
                        </Button>
                    </div>

                    <div className="p-4 rounded-xl border bg-card space-y-3">
                        <div className="flex items-center gap-2 text-green-600">
                            <ShieldCheck className="h-4 w-4" />
                            <h4 className="font-semibold text-sm">Segurança & Automação</h4>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Configure saques automáticos de comissões via TON para sua carteira fria.
                        </p>
                        <div className="flex items-center gap-2">
                            <Input placeholder="Frequência (Dias)" type="number" className="h-8 text-xs" />
                            <Button size="sm" variant="outline">Ativar</Button>
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-xl border border-dashed border-primary/40 bg-primary/5 flex items-start gap-4">
                    <Globe className="h-8 w-8 text-primary opacity-50 flex-shrink-0" />
                    <div>
                        <h4 className="text-sm font-semibold">Mercado Global</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Utilize a infraestrutura do Telegram para receber pagamentos de clientes em qualquer lugar do mundo, contornando limitações bancárias tradicionais. Ideal para vendas de Info-produtos e Acesso a comunidades VIP.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
