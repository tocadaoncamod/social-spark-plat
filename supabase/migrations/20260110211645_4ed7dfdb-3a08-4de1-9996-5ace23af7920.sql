-- ============================================
-- TABELA: lead_scraper_campaigns
-- ============================================
CREATE TABLE public.lead_scraper_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    instance_id UUID REFERENCES public.whatsapp_instances(id),
    
    -- Configuração
    name VARCHAR(200) NOT NULL,
    keywords TEXT[] NOT NULL DEFAULT '{}',
    sources TEXT[] NOT NULL DEFAULT '{}',
    
    -- Filtros
    location VARCHAR(200),
    radius_km INTEGER DEFAULT 50,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending',
    total_leads INTEGER DEFAULT 0,
    unique_leads INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadados
    metadata JSONB DEFAULT '{}'::jsonb
);

-- ============================================
-- TABELA: lead_scraper_leads
-- ============================================
CREATE TABLE public.lead_scraper_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    campaign_id UUID REFERENCES public.lead_scraper_campaigns(id) ON DELETE CASCADE NOT NULL,
    
    -- Dados do lead
    phone_number VARCHAR(20) NOT NULL,
    name VARCHAR(200),
    business_name VARCHAR(200),
    bio TEXT,
    profile_picture_url TEXT,
    
    -- Fonte
    source VARCHAR(50) NOT NULL,
    source_url TEXT,
    source_metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Qualificação
    relevance_score DECIMAL(3,2) DEFAULT 0.50,
    keywords_matched TEXT[] DEFAULT '{}',
    
    -- Status
    status VARCHAR(20) DEFAULT 'new',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Unique constraint
    UNIQUE(campaign_id, phone_number)
);

-- ============================================
-- ÍNDICES
-- ============================================
CREATE INDEX idx_lead_campaigns_user ON public.lead_scraper_campaigns(user_id);
CREATE INDEX idx_lead_campaigns_status ON public.lead_scraper_campaigns(status);
CREATE INDEX idx_lead_leads_campaign ON public.lead_scraper_leads(campaign_id);
CREATE INDEX idx_lead_leads_phone ON public.lead_scraper_leads(phone_number);
CREATE INDEX idx_lead_leads_source ON public.lead_scraper_leads(source);

-- ============================================
-- HABILITAR RLS
-- ============================================
ALTER TABLE public.lead_scraper_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_scraper_leads ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS RLS - CAMPAIGNS
-- ============================================
CREATE POLICY "Users can view their own scraper campaigns" 
ON public.lead_scraper_campaigns FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scraper campaigns" 
ON public.lead_scraper_campaigns FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scraper campaigns" 
ON public.lead_scraper_campaigns FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scraper campaigns" 
ON public.lead_scraper_campaigns FOR DELETE 
USING (auth.uid() = user_id);

-- ============================================
-- POLÍTICAS RLS - LEADS
-- ============================================
CREATE POLICY "Users can view their own scraper leads" 
ON public.lead_scraper_leads FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scraper leads" 
ON public.lead_scraper_leads FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scraper leads" 
ON public.lead_scraper_leads FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scraper leads" 
ON public.lead_scraper_leads FOR DELETE 
USING (auth.uid() = user_id);

-- ============================================
-- TRIGGER PARA UPDATED_AT
-- ============================================
CREATE TRIGGER update_lead_scraper_leads_updated_at
BEFORE UPDATE ON public.lead_scraper_leads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();