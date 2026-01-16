import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Globe, Zap, Music2, MessageSquare, ShoppingCart, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const ELITE_TEMPLATES = [
    {
        id: "china-viral-live",
        nome: "Agente Viralizador China (Humanos Digitais)",
        descricao: "Inspirado nas lives 24h da China. Especialista em scripts virais para TikTok e avatares realistas.",
        plataforma: "tiktok",
        icon: Music2,
        cor: "bg-black",
        prompt: `Atue como um Agente Viralizador de Social Commerce Chinês (referência: Douyin). 
Seu objetivo é criar roteiros de 15-30 segundos extremamente viciantes. 
ESTRUTURA DO ROTEIRO:
1. Gancho nos primeiros 2 segundos (Problema ou Curiosidade Extrema).
2. Demonstração visual rápida do produto.
3. Call to Action (CTA) agressivo com escassez.
Use ganchos como: 'Você não vai acreditar o que essa [produto] faz...' ou 'O segredo das blogueiras chinesas revelado'.`,
    },
    {
        id: "usa-autonomous-sales",
        nome: "Agente de Vendas Autônomo (USA Style)",
        descricao: "Focado em Agentic Checkout. Conduz o cliente da dúvida até o pagamento de forma autônoma.",
        plataforma: "whatsapp",
        icon: ShoppingCart,
        cor: "bg-blue-600",
        prompt: `Atue como um Agente de Vendas Autônomo de Alta Performance (padrão Silicon Valley). 
Sua missão é converter leads em clientes. 
REGRAS:
- Identifique a dor do cliente imediatamente.
- Use prova social e escassez.
- Facilite o checkout: 'Vou gerar seu link de desconto exclusivo agora'.
- Linguagem persuasiva, profissional e direta ao ponto.`,
    },
    {
        id: "russia-telegram-growth",
        nome: "Agente Growth Hacker (Rússia/Telegram)",
        descricao: "Especialista em funis de Telegram e monetização via Cripto/TON. Foca em escala massiva.",
        plataforma: "telegram",
        icon: TrendingUp,
        cor: "bg-sky-500",
        prompt: `Atue como um Agente de Growth Hacking de elite no Telegram (Referência: Ecossistema TON). 
Estratégia:
1. Criar funis de engajamento massivo usando bots.
2. Incentivar o compartilhamento (Member-get-member).
3. Converter audiência em pagadores recorrentes ou via Cripto.
Crie mensagens curtas, impactantes e com botões de ação claros.`,
    }
];

export function AgenteEliteLibrary() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const handleInstall = async (template: typeof ELITE_TEMPLATES[0]) => {
        if (!user) return;

        try {
            const { error } = await supabase.from("agentes_especializados").insert({
                user_id: user.id,
                nome: template.nome,
                plataforma: template.plataforma,
                prompt_base: template.prompt,
                ia_primaria: "gemini",
                ativo: true
            });

            if (error) throw error;

            toast.success(`${template.nome} instalado com sucesso!`);
            queryClient.invalidateQueries({ queryKey: ["agentes", user.id] });
        } catch (error: any) {
            toast.error("Erro ao instalar agente: " + error.message);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <Globe className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">Biblioteca de Agentes Elite (World Trends 2026)</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {ELITE_TEMPLATES.map((template) => (
                    <Card key={template.id} className="border-primary/20 hover:border-primary/50 transition-colors">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${template.cor}`}>
                                    <template.icon className="h-5 w-5 text-white" />
                                </div>
                                <CardTitle className="text-sm font-bold">{template.nome}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                {template.descricao}
                            </p>
                            <Button
                                variant="secondary"
                                size="sm"
                                className="w-full gap-2 text-xs font-semibold"
                                onClick={() => handleInstall(template)}
                            >
                                <Zap className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                Instalar Agente Elite
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
