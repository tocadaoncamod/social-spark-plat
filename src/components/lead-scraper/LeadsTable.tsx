import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  MessageCircle, 
  User, 
  Building2, 
  Star,
  ExternalLink,
  Store,
  ShoppingBag,
  Users,
  Sparkles
} from "lucide-react";
import { LeadScraperLead } from "@/hooks/useLeadScraper";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LeadsTableProps {
  leads: LeadScraperLead[];
  onSendMessage?: (lead: LeadScraperLead) => void;
}

const sourceLabels: Record<string, { label: string; color: string }> = {
  whatsapp_status: { label: "Status", color: "bg-[hsl(var(--whatsapp))]" },
  google_maps: { label: "Maps", color: "bg-blue-500" },
  instagram: { label: "Instagram", color: "bg-[hsl(var(--instagram))]" },
};

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  new: { label: "Novo", variant: "default" },
  contacted: { label: "Contatado", variant: "secondary" },
  qualified: { label: "Qualificado", variant: "outline" },
  converted: { label: "Convertido", variant: "default" },
};

const businessTypeConfig: Record<string, { icon: typeof Store; color: string; label: string }> = {
  "Atacadista/Fornecedor": { icon: Store, color: "text-blue-500", label: "Atacadista" },
  "Varejista": { icon: ShoppingBag, color: "text-green-500", label: "Varejista" },
  "Comprador Potencial": { icon: Users, color: "text-purple-500", label: "Comprador" },
  "indefinido": { icon: User, color: "text-muted-foreground", label: "Indefinido" },
};

const categoryColors: Record<string, string> = {
  atacadista: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  varejista: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  comprador: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  modaFeminina: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
  modaMasculina: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
  modaInfantil: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  acessorios: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
};

const categoryLabels: Record<string, string> = {
  atacadista: "Atacado",
  varejista: "Varejo",
  comprador: "Comprador",
  modaFeminina: "Feminino",
  modaMasculina: "Masculino",
  modaInfantil: "Infantil",
  acessorios: "Acessórios",
};

export function LeadsTable({ leads, onSendMessage }: LeadsTableProps) {
  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 13) {
      return `+${cleaned.slice(0, 2)} (${cleaned.slice(2, 4)}) ${cleaned.slice(4, 9)}-${cleaned.slice(9)}`;
    }
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 0.8) return "text-green-500";
    if (score >= 0.6) return "text-yellow-500";
    return "text-muted-foreground";
  };

  const getRelevanceLabel = (score: number) => {
    if (score >= 0.8) return "Quente";
    if (score >= 0.6) return "Morno";
    return "Frio";
  };

  if (leads.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Nenhum lead encontrado ainda</p>
        <p className="text-sm text-muted-foreground mt-1">
          Inicie a campanha para começar a extrair leads
        </p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Lead</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Categorias</TableHead>
              <TableHead className="text-center">Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => {
              const source = sourceLabels[lead.source] || { label: lead.source, color: "bg-gray-500" };
              const status = statusLabels[lead.status] || statusLabels.new;
              const metadata = lead.source_metadata as any;
              const businessType = metadata?.business_type || "indefinido";
              const businessConfig = businessTypeConfig[businessType] || businessTypeConfig.indefinido;
              const categories = metadata?.categories || [];
              const aiAnalysis = metadata?.ai_analysis;
              const BusinessIcon = businessConfig.icon;
              
              return (
                <TableRow key={lead.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={lead.profile_picture_url || undefined} />
                        <AvatarFallback>
                          {lead.name?.[0]?.toUpperCase() || lead.phone_number.slice(-2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">
                          {lead.name || "Sem nome"}
                        </p>
                        {lead.bio && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p className="text-xs text-muted-foreground truncate max-w-[150px] cursor-help">
                                {lead.bio.slice(0, 50)}...
                              </p>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-[300px]">
                              <p className="text-xs">{lead.bio}</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="font-mono text-sm">
                    {formatPhone(lead.phone_number)}
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <BusinessIcon className={`h-4 w-4 ${businessConfig.color}`} />
                      <span className="text-sm">{businessConfig.label}</span>
                      {aiAnalysis && (
                        <Tooltip>
                          <TooltipTrigger>
                            <Sparkles className="h-3 w-3 text-purple-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs max-w-[200px]">{aiAnalysis}</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                      {categories.slice(0, 3).map((cat: string, i: number) => (
                        <Badge 
                          key={i} 
                          variant="outline" 
                          className={`text-xs ${categoryColors[cat] || ""}`}
                        >
                          {categoryLabels[cat] || cat}
                        </Badge>
                      ))}
                      {categories.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{categories.length - 3}
                        </Badge>
                      )}
                      {categories.length === 0 && lead.keywords_matched?.length > 0 && (
                        <>
                          {lead.keywords_matched.slice(0, 2).map((kw, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {kw}
                            </Badge>
                          ))}
                        </>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className={`flex items-center justify-center gap-1 ${getRelevanceColor(lead.relevance_score)}`}>
                          <Star className="h-4 w-4 fill-current" />
                          <span className="font-medium">
                            {Math.round(lead.relevance_score * 100)}%
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Lead {getRelevanceLabel(lead.relevance_score)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  
                  <TableCell>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {lead.source_url && (
                        <Button variant="ghost" size="icon" asChild>
                          <a href={lead.source_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {onSendMessage && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-[hsl(var(--whatsapp))]"
                          onClick={() => onSendMessage(lead)}
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
}
