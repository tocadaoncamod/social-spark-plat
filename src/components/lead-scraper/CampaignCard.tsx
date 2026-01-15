import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  Trash2, 
  Download, 
  Eye,
  MapPin,
  Tag,
  Users,
  Clock
} from "lucide-react";
import { LeadScraperCampaign } from "@/hooks/useLeadScraper";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CampaignCardProps {
  campaign: LeadScraperCampaign;
  onView: (campaign: LeadScraperCampaign) => void;
  onStart: (campaign: LeadScraperCampaign) => void;
  onPause: (campaign: LeadScraperCampaign) => void;
  onDelete: (campaign: LeadScraperCampaign) => void;
  onExport: (campaign: LeadScraperCampaign) => void;
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Pendente", variant: "secondary" },
  running: { label: "Executando", variant: "default" },
  paused: { label: "Pausado", variant: "outline" },
  completed: { label: "Concluído", variant: "default" },
  failed: { label: "Falhou", variant: "destructive" },
};

const sourceLabels: Record<string, string> = {
  whatsapp_status: "WhatsApp Status",
  google_maps: "Google Maps",
  instagram: "Instagram",
};

export function CampaignCard({ 
  campaign, 
  onView, 
  onStart, 
  onPause, 
  onDelete,
  onExport 
}: CampaignCardProps) {
  const status = statusConfig[campaign.status] || statusConfig.pending;
  const progress = campaign.total_leads > 0 
    ? (campaign.unique_leads / campaign.total_leads) * 100 
    : 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{campaign.name}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>
                {formatDistanceToNow(new Date(campaign.created_at), { 
                  addSuffix: true, 
                  locale: ptBR 
                })}
              </span>
            </div>
          </div>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Keywords */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Tag className="h-3.5 w-3.5" />
            <span>Palavras-chave</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {campaign.keywords.slice(0, 5).map((keyword, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {keyword}
              </Badge>
            ))}
            {campaign.keywords.length > 5 && (
              <Badge variant="outline" className="text-xs">
                +{campaign.keywords.length - 5}
              </Badge>
            )}
          </div>
        </div>

        {/* Sources */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span>Fontes</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {campaign.sources.map((source, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {sourceLabels[source] || source}
              </Badge>
            ))}
          </div>
        </div>

        {/* Location */}
        {campaign.location && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{campaign.location}</span>
            <span className="text-muted-foreground">({campaign.radius_km}km)</span>
          </div>
        )}

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Leads encontrados</span>
            <span className="font-medium">
              {campaign.unique_leads} / {campaign.total_leads}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={() => onView(campaign)}>
            <Eye className="h-4 w-4 mr-1" />
            Ver Leads
          </Button>
          
          {campaign.status === "pending" && (
            <Button 
              size="sm" 
              className="bg-[hsl(var(--whatsapp))] hover:bg-[hsl(var(--whatsapp)/0.9)]"
              onClick={() => onStart(campaign)}
            >
              <Play className="h-4 w-4 mr-1" />
              Iniciar
            </Button>
          )}
          
          {campaign.status === "running" && (
            <Button variant="secondary" size="sm" onClick={() => onPause(campaign)}>
              <Pause className="h-4 w-4 mr-1" />
              Pausar
            </Button>
          )}
          
          {campaign.unique_leads > 0 && (
            <Button variant="outline" size="sm" onClick={() => onExport(campaign)}>
              <Download className="h-4 w-4 mr-1" />
              CSV
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-auto text-destructive hover:text-destructive"
            onClick={() => onDelete(campaign)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
