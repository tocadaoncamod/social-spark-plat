import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Mic, Target, Zap } from "lucide-react";
import { toast } from "sonner";

interface ElitePrompt {
    id: string;
    name: string;
    description: string;
    strategy: string;
    icon: any;
    prompt: string;
    color: string;
}

const elitePrompts: ElitePrompt[] = [
    {
        id: "usa-voice-sales",
        name: "Vendedor de Voz (EUA Style)",
        description: "Inspirado em scripts de High Ticket Sales da Florida. Focado em converter dúvidas em vendas via áudios persuasivos.",
        strategy: "USA - Conversão Extrema",
        icon: Mic,
        color: "from-blue-600 to-red-600",
        prompt: "Aja como um Vendedor de Alta Performance dos EUA (estilo Grant Cardone/Jordan Belfort). Sua comunicação deve ser amigável, confiante e focada no fechamento. Use gatilhos de reciprocidade e autoridade. IMPORTANTE: Sempre que possível, sugira enviar um ÁUDIO para explicar melhor (use a tag [VOICE_MODE]). Seu objetivo é levar o cliente ao checkout no menor tempo possível."
    },
    {
        id: "china-growth",
        name: "Growth Hacker (Social Commerce)",
        description: "Táticas de volume e viralização das agências de Live Commerce da China. Focado em grupos e promoções rápidas.",
        strategy: "China - Escala Viral",
        icon: Zap,
        color: "from-red-600 to-yellow-600",
        prompt: "Você é um gestor de Social Commerce em Guangzhou. Sua missão é criar senso de urgência absurdo. Use 'Flash Sales', 'Estoque Limitado' e incentive o compartilhamento. Seja extremamente ágil e use muitos emojis para criar conexão visual rápida. Foco em volume de vendas direto no WhatsApp."
    },
    {
        id: "russia-retention",
        name: "Especialista em Retenção (TON Style)",
        description: "Automação agressiva e retenção via funis complexos. Inspirado nas operações de afiliados russos (Telegram/TON).",
        strategy: "Russia - Retenção & LTV",
        icon: Target,
        color: "from-gray-700 to-blue-900",
        prompt: "Você é um arquiteto de funis de retenção. Trate cada lead como um ativo valioso. Use lógica condicional para responder. Se o cliente desanimar, ofereça um bônus imediato. Trabalhe com upsell constante e integração de ecossistema. Foco em transformar o cliente em um comprador recorrente."
    }
];

interface WhatsAppEliteLibraryProps {
    onInstall: (prompt: string) => void;
}

export function WhatsAppEliteLibrary({ onInstall }: WhatsAppEliteLibraryProps) {
    const handleInstall = (item: ElitePrompt) => {
        onInstall(item.prompt);
        toast.success(`${item.name} instalado! Não esqueça de salvar.`);
    };

    return (
        <div className="grid gap-4 md:grid-cols-3 mb-8">
            {elitePrompts.map((item) => (
                <Card key={item.id} className="relative overflow-hidden group border-2 border-primary/20 hover:border-primary transition-all duration-300">
                    <div className={`absolute top-0 right-0 p-2 bg-gradient-to-br ${item.color} text-white rounded-bl-lg z-10 opacity-80 group-hover:opacity-100 transition-opacity`}>
                        <Sparkles className="h-4 w-4" />
                    </div>
                    <CardHeader className="pb-2">
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 rounded-lg bg-gradient-to-br ${item.color} text-white`}>
                                <item.icon className="h-5 w-5" />
                            </div>
                            <Badge variant="outline" className="text-[10px] uppercase tracking-wider">{item.strategy}</Badge>
                        </div>
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <CardDescription className="text-xs line-clamp-2">{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <Button
                            onClick={() => handleInstall(item)}
                            className="w-full gap-2 bg-card hover:bg-muted text-foreground border border-primary/30 group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                            variant="outline"
                        >
                            Instalar Módulo Elite
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
