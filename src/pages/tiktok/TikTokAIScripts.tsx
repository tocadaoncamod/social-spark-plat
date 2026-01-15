import { useState } from "react";
import { TikTokShopLayout } from "@/components/tiktok/TikTokShopLayout";
import { TikTokMarketSidebar } from "@/components/tiktok/TikTokMarketSidebar";
import { TikTokConnectionBanner } from "@/components/tiktok/TikTokConnectionBanner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sparkles, 
  Video,
  MessageSquare,
  Zap,
  Copy,
  RefreshCw,
  Wand2,
  FileText,
  Radio
} from "lucide-react";
import { useTikTokConnection } from "@/contexts/TikTokConnectionContext";
import { toast } from "sonner";

const scriptTemplates = [
  { id: "video", icon: Video, label: "Script de Vídeo", description: "Roteiro completo para vídeos de produto" },
  { id: "hook", icon: Zap, label: "Hook Viral", description: "Ganchos para capturar atenção nos primeiros segundos" },
  { id: "description", icon: FileText, label: "Descrição de Produto", description: "Copy persuasiva para páginas de produto" },
  { id: "live", icon: Radio, label: "Roteiro de Live", description: "Script para transmissões ao vivo de vendas" },
];

const generatedExamples = {
  video: `🎬 ROTEIRO DE VÍDEO - Kit Skincare Vitamina C

[HOOK - 0:00-0:03]
"Sua pele NUNCA mais vai ser a mesma depois disso..."

[PROBLEMA - 0:03-0:08]
"Manchas, oleosidade, pele sem vida... Eu sofria com TUDO isso!"

[SOLUÇÃO - 0:08-0:18]
"Até descobrir esse Kit Skincare com Vitamina C pura! 
São 5 produtos que trabalham em sinergia para transformar sua pele em 7 dias."

[PROVA - 0:18-0:25]
*Mostrar antes/depois*
"Olha a diferença! Em apenas uma semana..."

[CTA - 0:25-0:30]
"Link na bio! E corre que o desconto de 40% acaba HOJE!"

📌 Duração: 30 segundos
📌 Tom: Entusiasta, autêntico
📌 Música sugerida: Trending upbeat`,
  hook: `🪝 5 HOOKS VIRAIS PARA SEU PRODUTO

1. "POV: Você descobriu o segredo que as influencers escondem..."

2. "Se você não está usando isso, está perdendo dinheiro 💸"

3. "Eu PRECISO te contar isso antes que acabe..."

4. "Esse produto deveria ser proibido de tão bom 🤯"

5. "Não compre [produto] antes de ver isso!"

💡 DICA: Combine emoção + curiosidade + urgência`,
  description: `📝 DESCRIÇÃO DE PRODUTO

✨ Kit Skincare Vitamina C 5 em 1 ✨

O segredo da pele perfeita que viralizou no TikTok! 

☑️ Vitamina C pura 20% - Clareamento visível
☑️ Sérum anti-idade - Reduz linhas finas
☑️ Hidratante facial - Pele macia 24h
☑️ Protetor solar - FPS 50 invisível
☑️ Máscara noturna - Renovação celular

⭐ +15.000 avaliações 5 estrelas
🚚 Frete grátis para todo Brasil
🔥 OFERTA: De R$189 por apenas R$99,90

⚡ ÚLTIMAS UNIDADES - Link na bio!`,
  live: `🔴 ROTEIRO DE LIVE - 1 HORA

[ABERTURA - 0:00-5:00]
"E aí, galera! Bem-vindos à live mais INCRÍVEL do TikTok Shop!"
"Quem chegou deixa o coração azul 💙"
"Hoje tem MEGA desconto em todo o estoque..."

[APRESENTAÇÃO - 5:00-15:00]
"Vou mostrar os 10 produtos mais vendidos..."
"Esse aqui é o QUERIDINHO de vocês..."
*Demonstrar cada produto*

[OFERTAS FLASH - 15:00-40:00]
"ATENÇÃO! Oferta relâmpago de 5 minutos!"
"Quem digitar 🔥 no chat ganha cupom extra!"
*Repetir a cada 10 minutos*

[ENCERRAMENTO - 40:00-60:00]
"Últimas unidades, galera!"
"Quem ainda não comprou, AGORA é a hora!"
"Até a próxima live! 💜"`,
};

export default function TikTokAIScripts() {
  const { isConnected } = useTikTokConnection();
  const [selectedTemplate, setSelectedTemplate] = useState("video");
  const [productInfo, setProductInfo] = useState("");
  const [tone, setTone] = useState("enthusiastic");
  const [generatedScript, setGeneratedScript] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!productInfo.trim()) {
      toast.error("Descreva seu produto primeiro!");
      return;
    }
    
    setIsGenerating(true);
    // Simulating AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setGeneratedScript(generatedExamples[selectedTemplate as keyof typeof generatedExamples]);
    setIsGenerating(false);
    toast.success("Script gerado com sucesso!");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedScript);
    toast.success("Copiado para a área de transferência!");
  };

  return (
    <TikTokShopLayout>
      <div className="flex">
        <TikTokMarketSidebar />
        <main className="flex-1 p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="h-6 w-6" />
              Scripts Virais com IA
            </h1>
            <p className="text-muted-foreground">
              Gere roteiros e copies otimizados para TikTok Shop
            </p>
          </div>

          <TikTokConnectionBanner />

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tipo de Conteúdo</CardTitle>
                  <CardDescription>Escolha o que deseja gerar</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {scriptTemplates.map((template) => {
                      const Icon = template.icon;
                      return (
                        <button
                          key={template.id}
                          onClick={() => setSelectedTemplate(template.id)}
                          className={`p-4 rounded-lg border text-left transition-all ${
                            selectedTemplate === template.id
                              ? "border-primary bg-primary/5"
                              : "border-muted hover:border-primary/50"
                          }`}
                        >
                          <Icon className={`h-5 w-5 mb-2 ${
                            selectedTemplate === template.id ? "text-primary" : "text-muted-foreground"
                          }`} />
                          <p className="font-medium text-sm">{template.label}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {template.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Informações do Produto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Descreva seu produto</Label>
                    <Textarea
                      placeholder="Ex: Kit skincare com vitamina C, 5 produtos, anti-idade, clareador, preço R$99,90..."
                      value={productInfo}
                      onChange={(e) => setProductInfo(e.target.value)}
                      rows={4}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Tom de voz</Label>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tom" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="enthusiastic">Entusiasta e Animado</SelectItem>
                        <SelectItem value="professional">Profissional e Confiável</SelectItem>
                        <SelectItem value="casual">Casual e Descontraído</SelectItem>
                        <SelectItem value="luxury">Luxuoso e Sofisticado</SelectItem>
                        <SelectItem value="urgency">Urgente e Escasso</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Wand2 className="h-4 w-4 mr-2" />
                    )}
                    {isGenerating ? "Gerando..." : "Gerar Script com IA"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Output Section */}
            <Card className="h-fit">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Script Gerado</CardTitle>
                  {generatedScript && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={copyToClipboard}>
                        <Copy className="h-4 w-4 mr-1" />
                        Copiar
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleGenerate}>
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Regenerar
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {generatedScript ? (
                  <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap">
                    {generatedScript}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
                    <h4 className="font-medium mb-2">Nenhum script gerado</h4>
                    <p className="text-sm text-muted-foreground">
                      Preencha as informações e clique em "Gerar Script"
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </TikTokShopLayout>
  );
}
