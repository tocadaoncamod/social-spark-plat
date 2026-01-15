import { TocaDaOncaLayout } from "@/components/tocadaonca/TocaDaOncaLayout";
import { TikTokConnectionBanner } from "@/components/tocadaonca/TikTokConnectionBanner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Mail,
  Send,
  Users,
  Download,
  Filter,
  Search,
  Instagram,
  Youtube,
  MessageCircle,
  Phone,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";
import { useState } from "react";

// Dados simulados de influenciadores
const mockInfluencers = Array.from({ length: 50 }, (_, i) => ({
  id: `inf-${i + 1}`,
  name: ["Ana Silva", "Pedro Costa", "Julia Santos", "Lucas Oliveira", "Maria Souza", "João Pereira", "Carla Lima", "Bruno Alves", "Fernanda Rocha", "Rafael Dias"][i % 10],
  username: `@${["beauty", "tech", "fitness", "fashion", "lifestyle", "food", "travel", "gaming", "diy", "music"][i % 10]}_creator${i}`,
  avatar: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
  followers: Math.floor(Math.random() * 500000) + 10000,
  engagement: (Math.random() * 8 + 2).toFixed(1),
  category: ["Beleza", "Tecnologia", "Fitness", "Moda", "Lifestyle", "Gastronomia", "Viagem", "Gaming", "DIY", "Música"][i % 10],
  email: `creator${i}@email.com`,
  whatsapp: `+55119${Math.floor(Math.random() * 90000000) + 10000000}`,
  instagram: `@creator_${i}`,
  youtube: Math.random() > 0.5 ? `Creator ${i}` : null,
  contacted: Math.random() > 0.7,
  replied: Math.random() > 0.8,
}));

const emailTemplates = [
  { id: 1, name: "Proposta de Parceria", subject: "Oportunidade de Parceria - [Sua Marca]" },
  { id: 2, name: "Convite para Afiliado", subject: "Convite Especial - Programa de Afiliados" },
  { id: 3, name: "Envio de Produto", subject: "Presente Especial para Você!" },
  { id: 4, name: "Colaboração em Live", subject: "Convite para Live Exclusiva" },
];

export default function InfluencersOutreach() {
  const [selectedInfluencers, setSelectedInfluencers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  const toggleInfluencer = (id: string) => {
    setSelectedInfluencers(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedInfluencers.length === mockInfluencers.length) {
      setSelectedInfluencers([]);
    } else {
      setSelectedInfluencers(mockInfluencers.map(i => i.id));
    }
  };

  return (
    <TocaDaOncaLayout>
      <div className="space-y-6">
        <TikTokConnectionBanner />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Mail className="h-6 w-6 text-amber-500" />
              <h1 className="text-2xl font-bold text-foreground">Outreach em Massa</h1>
            </div>
            <p className="text-muted-foreground">Envie emails e mensagens para criadores de conteúdo</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar Contatos
            </Button>
            <Button className="gap-2 bg-gradient-to-r from-amber-500 to-orange-600">
              <Send className="h-4 w-4" />
              Enviar ({selectedInfluencers.length})
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Users className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">450K+</p>
                  <p className="text-xs text-muted-foreground">Criadores disponíveis</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">3.000</p>
                  <p className="text-xs text-muted-foreground">Limite diário</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">1.247</p>
                  <p className="text-xs text-muted-foreground">Enviados hoje</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <MessageCircle className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">32%</p>
                  <p className="text-xs text-muted-foreground">Taxa de resposta</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Email Composer */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Compor Mensagem</CardTitle>
              <CardDescription>Configure o template para envio em massa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Template</label>
                <Select onValueChange={(value) => {
                  const template = emailTemplates.find(t => t.id.toString() === value);
                  if (template) setEmailSubject(template.subject);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um template" />
                  </SelectTrigger>
                  <SelectContent>
                    {emailTemplates.map(template => (
                      <SelectItem key={template.id} value={template.id.toString()}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Assunto</label>
                <Input 
                  placeholder="Assunto do email"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Mensagem</label>
                <Textarea 
                  placeholder="Olá {nome},

Gostaríamos de convidar você para uma parceria exclusiva..."
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  rows={8}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use {'{nome}'}, {'{username}'}, {'{seguidores}'} para personalizar
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Clock className="h-4 w-4 mr-2" />
                  Agendar
                </Button>
                <Button className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600">
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Agora
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Influencers List */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Selecionar Criadores</CardTitle>
                <Badge variant="outline">
                  {selectedInfluencers.length} selecionados
                </Badge>
              </div>
              
              {/* Filters */}
              <div className="flex flex-wrap gap-2 pt-2">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar criadores..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="beleza">Beleza</SelectItem>
                    <SelectItem value="tech">Tecnologia</SelectItem>
                    <SelectItem value="moda">Moda</SelectItem>
                    <SelectItem value="fitness">Fitness</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={selectedInfluencers.length === mockInfluencers.length}
                        onCheckedChange={toggleAll}
                      />
                    </TableHead>
                    <TableHead>Criador</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-right">Seguidores</TableHead>
                    <TableHead className="text-right">Engajamento</TableHead>
                    <TableHead>Contatos</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockInfluencers.slice(0, 15).map((influencer) => (
                    <TableRow key={influencer.id} className="hover:bg-muted/50">
                      <TableCell>
                        <Checkbox 
                          checked={selectedInfluencers.includes(influencer.id)}
                          onCheckedChange={() => toggleInfluencer(influencer.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={influencer.avatar} />
                            <AvatarFallback>{influencer.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{influencer.name}</p>
                            <p className="text-xs text-muted-foreground">{influencer.username}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{influencer.category}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatNumber(influencer.followers)}
                      </TableCell>
                      <TableCell className="text-right">
                        {influencer.engagement}%
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Mail className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Phone className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Instagram className="h-3 w-3" />
                          </Button>
                          {influencer.youtube && (
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <Youtube className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {influencer.replied ? (
                          <Badge className="bg-success/10 text-success border-success/20">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Respondeu
                          </Badge>
                        ) : influencer.contacted ? (
                          <Badge className="bg-warning/10 text-warning border-warning/20">
                            <Clock className="h-3 w-3 mr-1" />
                            Enviado
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Novo
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </TocaDaOncaLayout>
  );
}
