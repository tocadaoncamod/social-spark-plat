import { useState } from "react";
import { WhatsAppLayout } from "@/components/whatsapp/WhatsAppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWhatsAppInstances } from "@/hooks/useWhatsAppInstances";
import { useWhatsAppContacts } from "@/hooks/useWhatsAppContacts";
import { useCreateCampaign, useAddCampaignContacts, useStartCampaign } from "@/hooks/useWhatsAppCampaigns";
import { useSendWhatsAppMessage } from "@/hooks/useWhatsAppMessages";
import { 
  Send, 
  Upload, 
  Users, 
  MessageSquare, 
  Image, 
  Video, 
  FileText,
  Clock,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function WhatsAppSend() {
  const { data: instances } = useWhatsAppInstances();
  const { data: contacts } = useWhatsAppContacts();
  const createCampaign = useCreateCampaign();
  const addContacts = useAddCampaignContacts();
  const startCampaign = useStartCampaign();
  const sendMessage = useSendWhatsAppMessage();
  const { toast } = useToast();

  const [selectedInstance, setSelectedInstance] = useState<string>("");
  const [message, setMessage] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<string>("");
  const [delayMin, setDelayMin] = useState(2);
  const [delayMax, setDelayMax] = useState(5);
  const [campaignName, setCampaignName] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [csvData, setCsvData] = useState<Array<{ phone: string; name?: string }>>([]);
  const [isSending, setIsSending] = useState(false);
  const [sendProgress, setSendProgress] = useState(0);

  // Single message
  const [singlePhone, setSinglePhone] = useState("");

  const connectedInstances = instances?.filter(i => i.status === 'connected') || [];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(Boolean);
      const parsed = lines.slice(1).map(line => {
        const [phone, name] = line.split(',').map(s => s?.trim());
        return { phone: phone?.replace(/\D/g, ''), name };
      }).filter(item => item.phone);
      
      setCsvData(parsed);
      toast({
        title: "Arquivo importado",
        description: `${parsed.length} contatos encontrados`,
      });
    };
    reader.readAsText(file);
  };

  const handleSendSingle = async () => {
    if (!selectedInstance || !singlePhone || !message) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }

    await sendMessage.mutateAsync({
      instanceId: selectedInstance,
      phone: singlePhone,
      message,
      mediaUrl: mediaUrl || undefined,
      mediaType: mediaType || undefined,
    });

    setSinglePhone("");
    setMessage("");
    setMediaUrl("");
    setMediaType("");
  };

  const handleStartCampaign = async () => {
    if (!selectedInstance || !message || !campaignName) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }

    const contactsToSend = csvData.length > 0 
      ? csvData 
      : selectedContacts.map(id => {
          const contact = contacts?.find(c => c.id === id);
          return { phone: contact?.phone || '', name: contact?.name || undefined };
        }).filter(c => c.phone);

    if (contactsToSend.length === 0) {
      toast({ title: "Selecione ou importe contatos", variant: "destructive" });
      return;
    }

    setIsSending(true);
    setSendProgress(0);

    try {
      // Create campaign
      const campaign = await createCampaign.mutateAsync({
        name: campaignName,
        instance_id: selectedInstance,
        message_template: message,
        media_url: mediaUrl || null,
        media_type: mediaType || null,
        delay_min_seconds: delayMin,
        delay_max_seconds: delayMax,
      });

      // Add contacts
      await addContacts.mutateAsync({
        campaignId: campaign.id,
        contacts: contactsToSend,
      });

      // Start campaign
      await startCampaign.mutateAsync(campaign.id);

      setCampaignName("");
      setMessage("");
      setMediaUrl("");
      setMediaType("");
      setCsvData([]);
      setSelectedContacts([]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSending(false);
      setSendProgress(100);
    }
  };

  const messagePreview = message
    .replace(/\{\{nome\}\}/gi, "João Silva")
    .replace(/\{\{empresa\}\}/gi, "Empresa XYZ");

  return (
    <WhatsAppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Enviar Mensagens</h1>
          <p className="text-muted-foreground">
            Envie mensagens individuais ou em massa com variáveis personalizadas
          </p>
        </div>

        {connectedInstances.length === 0 && (
          <Card className="border-warning bg-warning/5">
            <CardContent className="flex items-center gap-3 py-4">
              <AlertCircle className="h-5 w-5 text-warning" />
              <div>
                <p className="font-medium">Nenhuma instância conectada</p>
                <p className="text-sm text-muted-foreground">
                  Conecte uma instância WhatsApp para enviar mensagens
                </p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto" asChild>
                <a href="/whatsapp/dashboard">Conectar</a>
              </Button>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="single" className="space-y-6">
          <TabsList>
            <TabsTrigger value="single">Mensagem Individual</TabsTrigger>
            <TabsTrigger value="bulk">Envio em Massa</TabsTrigger>
          </TabsList>

          {/* Single Message */}
          <TabsContent value="single" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Configuração</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Instância</Label>
                    <Select value={selectedInstance} onValueChange={setSelectedInstance}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma instância" />
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

                  <div className="space-y-2">
                    <Label>Número do WhatsApp</Label>
                    <Input
                      placeholder="5511999999999"
                      value={singlePhone}
                      onChange={(e) => setSinglePhone(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Inclua o código do país (55 para Brasil)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Mensagem</Label>
                    <Textarea
                      placeholder="Digite sua mensagem..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>URL da Mídia (opcional)</Label>
                      <Input
                        placeholder="https://..."
                        value={mediaUrl}
                        onChange={(e) => setMediaUrl(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tipo de Mídia</Label>
                      <Select value={mediaType} onValueChange={setMediaType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="image">Imagem</SelectItem>
                          <SelectItem value="video">Vídeo</SelectItem>
                          <SelectItem value="audio">Áudio</SelectItem>
                          <SelectItem value="document">Documento</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button 
                    className="w-full gap-2 bg-[hsl(var(--whatsapp))] hover:bg-[hsl(var(--whatsapp))]/90"
                    onClick={handleSendSingle}
                    disabled={sendMessage.isPending || !selectedInstance || !singlePhone || !message}
                  >
                    <Send className="h-4 w-4" />
                    {sendMessage.isPending ? "Enviando..." : "Enviar Mensagem"}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-[#e5ddd5] dark:bg-[#0b141a] rounded-lg p-4 min-h-[300px]">
                    {message ? (
                      <div className="bg-[#dcf8c6] dark:bg-[#005c4b] rounded-lg p-3 max-w-[80%] ml-auto shadow">
                        <p className="text-sm text-foreground whitespace-pre-wrap">{messagePreview}</p>
                        <p className="text-[10px] text-muted-foreground text-right mt-1">
                          {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        Digite uma mensagem para ver o preview
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bulk Send */}
          <TabsContent value="bulk" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Campaign Config */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Configuração da Campanha</CardTitle>
                  <CardDescription>
                    Configure os detalhes do envio em massa
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nome da Campanha</Label>
                      <Input
                        placeholder="Ex: Black Friday 2024"
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Instância</Label>
                      <Select value={selectedInstance} onValueChange={setSelectedInstance}>
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
                      placeholder="Olá {{nome}}, temos uma oferta especial para você..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                    />
                    <p className="text-xs text-muted-foreground">
                      Use {"{{nome}}"} para inserir o nome do contato
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>URL da Mídia</Label>
                      <Input
                        placeholder="https://..."
                        value={mediaUrl}
                        onChange={(e) => setMediaUrl(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tipo</Label>
                      <Select value={mediaType} onValueChange={setMediaType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="image">Imagem</SelectItem>
                          <SelectItem value="video">Vídeo</SelectItem>
                          <SelectItem value="document">Documento</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Delay (segundos)</Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          value={delayMin}
                          onChange={(e) => setDelayMin(Number(e.target.value))}
                          min={1}
                          max={30}
                        />
                        <span className="flex items-center">-</span>
                        <Input
                          type="number"
                          value={delayMax}
                          onChange={(e) => setDelayMax(Number(e.target.value))}
                          min={1}
                          max={30}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contacts */}
              <Card>
                <CardHeader>
                  <CardTitle>Contatos</CardTitle>
                  <CardDescription>
                    Importe CSV ou selecione contatos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Arraste um CSV ou clique para upload
                    </p>
                    <Input
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="csv-upload"
                    />
                    <Label htmlFor="csv-upload" className="cursor-pointer">
                      <Button variant="outline" size="sm" asChild>
                        <span>Selecionar Arquivo</span>
                      </Button>
                    </Label>
                    <p className="text-xs text-muted-foreground mt-2">
                      Formato: telefone,nome
                    </p>
                  </div>

                  {csvData.length > 0 && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {csvData.length} contatos importados
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setCsvData([])}
                        >
                          Limpar
                        </Button>
                      </div>
                    </div>
                  )}

                  {csvData.length === 0 && contacts && contacts.length > 0 && (
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {contacts.slice(0, 10).map((contact) => (
                        <label 
                          key={contact.id}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedContacts.includes(contact.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedContacts([...selectedContacts, contact.id]);
                              } else {
                                setSelectedContacts(selectedContacts.filter(id => id !== contact.id));
                              }
                            }}
                            className="rounded"
                          />
                          <div>
                            <p className="text-sm font-medium">{contact.name || 'Sem nome'}</p>
                            <p className="text-xs text-muted-foreground">{contact.phone}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}

                  {selectedContacts.length > 0 && (
                    <Badge variant="secondary">
                      {selectedContacts.length} selecionados
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Send Button */}
            <Card>
              <CardContent className="pt-6">
                {isSending ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Enviando mensagens...</span>
                      <span className="text-sm text-muted-foreground">{sendProgress}%</span>
                    </div>
                    <Progress value={sendProgress} />
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {csvData.length > 0 
                        ? `${csvData.length} contatos do CSV`
                        : selectedContacts.length > 0
                          ? `${selectedContacts.length} contatos selecionados`
                          : 'Nenhum contato selecionado'}
                    </div>
                    <Button
                      className="gap-2 bg-[hsl(var(--whatsapp))] hover:bg-[hsl(var(--whatsapp))]/90"
                      onClick={handleStartCampaign}
                      disabled={
                        isSending || 
                        !selectedInstance || 
                        !message || 
                        !campaignName ||
                        (csvData.length === 0 && selectedContacts.length === 0)
                      }
                    >
                      <Send className="h-4 w-4" />
                      Iniciar Envio em Massa
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </WhatsAppLayout>
  );
}
