interface StatusScraperConfig {
  instanceName: string;
  keywords: string[];
  apiKey: string;
  evolutionUrl: string;
}

interface ScrapedLead {
  phone_number: string;
  source: string;
  source_metadata: {
    caption?: string;
    timestamp?: number;
  };
  keywords_matched: string[];
  relevance_score: number;
}

export class WhatsAppStatusScraper {
  private config: StatusScraperConfig;

  constructor(config: StatusScraperConfig) {
    this.config = config;
  }

  async scrape(): Promise<ScrapedLead[]> {
    try {
      // 1. Buscar status via Evolution API
      const response = await fetch(
        `${this.config.evolutionUrl}/chat/findStatusMessage/${this.config.instanceName}`,
        { 
          headers: { 
            'apikey': this.config.apiKey,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const statuses = data.status || [];

      // 2. Filtrar por palavra-chave
      const filtered = statuses.filter((status: any) => {
        const text = (status.message?.conversation || status.message?.extendedTextMessage?.text || '').toLowerCase();
        return this.config.keywords.some(k => text.includes(k.toLowerCase()));
      });

      // 3. Extrair leads
      return filtered.map((status: any) => ({
        phone_number: status.key?.remoteJid?.split('@')[0] || '',
        source: 'whatsapp_status',
        source_metadata: {
          caption: status.message?.conversation || status.message?.extendedTextMessage?.text,
          timestamp: status.messageTimestamp
        },
        keywords_matched: this.getMatchedKeywords(
          status.message?.conversation || status.message?.extendedTextMessage?.text || ''
        ),
        relevance_score: this.calculateRelevance(status)
      })).filter((lead: ScrapedLead) => lead.phone_number);
    } catch (error) {
      console.error('Error scraping WhatsApp status:', error);
      return [];
    }
  }

  private getMatchedKeywords(text: string): string[] {
    return this.config.keywords.filter(k => 
      text.toLowerCase().includes(k.toLowerCase())
    );
  }

  private calculateRelevance(status: any): number {
    let score = 0.5;
    const text = status.message?.conversation || status.message?.extendedTextMessage?.text || '';
    const matched = this.getMatchedKeywords(text);
    score += matched.length * 0.1;
    
    const hoursSince = (Date.now() - (status.messageTimestamp || 0) * 1000) / 3600000;
    if (hoursSince < 24) score += 0.2;
    
    return Math.min(score, 1.0);
  }
}

export function createWhatsAppStatusScraper(config: StatusScraperConfig): WhatsAppStatusScraper {
  return new WhatsAppStatusScraper(config);
}
