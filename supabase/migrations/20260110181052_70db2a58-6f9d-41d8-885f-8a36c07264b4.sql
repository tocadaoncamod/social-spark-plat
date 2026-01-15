-- =============================================
-- WA SENDER PRO - DATABASE SCHEMA
-- =============================================

-- 1. WHATSAPP INSTANCES - Gerenciar múltiplas instâncias WhatsApp
CREATE TABLE public.whatsapp_instances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  instance_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected', 'connecting', 'qr_pending')),
  qr_code TEXT,
  phone_number TEXT,
  webhook_url TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. WHATSAPP MESSAGES - Histórico completo de mensagens
CREATE TABLE public.whatsapp_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  instance_id UUID REFERENCES public.whatsapp_instances(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES public.whatsapp_contacts(id) ON DELETE SET NULL,
  remote_jid TEXT,
  content TEXT,
  media_url TEXT,
  media_type TEXT,
  direction TEXT NOT NULL DEFAULT 'outbound' CHECK (direction IN ('inbound', 'outbound')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'read', 'failed')),
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  delivered_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. WHATSAPP CAMPAIGNS - Campanhas de envio em massa
CREATE TABLE public.whatsapp_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  instance_id UUID REFERENCES public.whatsapp_instances(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  message_template TEXT NOT NULL,
  media_url TEXT,
  media_type TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'running', 'paused', 'completed', 'cancelled')),
  total_contacts INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  delay_min_seconds INTEGER DEFAULT 2,
  delay_max_seconds INTEGER DEFAULT 5,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. CAMPAIGN CONTACTS - Contatos de cada campanha
CREATE TABLE public.whatsapp_campaign_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES public.whatsapp_campaigns(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.whatsapp_contacts(id) ON DELETE SET NULL,
  phone TEXT NOT NULL,
  name TEXT,
  variables JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'read', 'failed', 'skipped')),
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. WHATSAPP SCHEDULED - Mensagens agendadas
CREATE TABLE public.whatsapp_scheduled (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  instance_id UUID REFERENCES public.whatsapp_instances(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES public.whatsapp_contacts(id) ON DELETE SET NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  media_url TEXT,
  media_type TEXT,
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'cancelled', 'failed')),
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. WHATSAPP LEADS - Sistema de qualificação de leads
CREATE TABLE public.whatsapp_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES public.whatsapp_contacts(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  classification TEXT NOT NULL DEFAULT 'new' CHECK (classification IN ('hot', 'warm', 'cold', 'new', 'converted', 'lost')),
  keywords_matched TEXT[],
  last_interaction TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, contact_id)
);

-- 7. WHATSAPP GROUPS - Grupos extraídos
CREATE TABLE public.whatsapp_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  instance_id UUID REFERENCES public.whatsapp_instances(id) ON DELETE SET NULL,
  group_jid TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  participants_count INTEGER DEFAULT 0,
  is_admin BOOLEAN DEFAULT false,
  extracted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, group_jid)
);

-- 8. CHATBOT CONFIG - Configurações do chatbot IA
CREATE TABLE public.whatsapp_chatbot_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  instance_id UUID REFERENCES public.whatsapp_instances(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT false,
  system_prompt TEXT DEFAULT 'Você é um assistente virtual prestativo. Responda de forma cordial e objetiva.',
  welcome_message TEXT,
  fallback_message TEXT DEFAULT 'Desculpe, não entendi. Pode reformular?',
  working_hours_start TIME,
  working_hours_end TIME,
  working_days INTEGER[] DEFAULT ARRAY[1,2,3,4,5],
  excluded_contacts TEXT[],
  auto_classify_leads BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, instance_id)
);

-- 9. LEAD RULES - Regras de classificação de leads
CREATE TABLE public.whatsapp_lead_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  keywords TEXT[] NOT NULL,
  classification TEXT NOT NULL CHECK (classification IN ('hot', 'warm', 'cold', 'converted')),
  score_change INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =============================================
-- ALTERAÇÕES NA TABELA EXISTENTE
-- =============================================

-- Adicionar colunas à tabela whatsapp_contacts
ALTER TABLE public.whatsapp_contacts 
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'manual',
ADD COLUMN IF NOT EXISTS group_name TEXT,
ADD COLUMN IF NOT EXISTS is_valid BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS last_seen TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS profile_picture TEXT,
ADD COLUMN IF NOT EXISTS status_message TEXT;

-- =============================================
-- ENABLE RLS
-- =============================================

ALTER TABLE public.whatsapp_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_campaign_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_scheduled ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_chatbot_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_lead_rules ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES - INSTANCES
-- =============================================

CREATE POLICY "Users can view their own instances"
ON public.whatsapp_instances FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own instances"
ON public.whatsapp_instances FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own instances"
ON public.whatsapp_instances FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own instances"
ON public.whatsapp_instances FOR DELETE
USING (auth.uid() = user_id);

-- =============================================
-- RLS POLICIES - MESSAGES
-- =============================================

CREATE POLICY "Users can view their own whatsapp messages"
ON public.whatsapp_messages FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own whatsapp messages"
ON public.whatsapp_messages FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own whatsapp messages"
ON public.whatsapp_messages FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own whatsapp messages"
ON public.whatsapp_messages FOR DELETE
USING (auth.uid() = user_id);

-- =============================================
-- RLS POLICIES - CAMPAIGNS
-- =============================================

CREATE POLICY "Users can view their own campaigns"
ON public.whatsapp_campaigns FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own campaigns"
ON public.whatsapp_campaigns FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own campaigns"
ON public.whatsapp_campaigns FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own campaigns"
ON public.whatsapp_campaigns FOR DELETE
USING (auth.uid() = user_id);

-- =============================================
-- RLS POLICIES - CAMPAIGN CONTACTS
-- =============================================

CREATE POLICY "Users can view their campaign contacts"
ON public.whatsapp_campaign_contacts FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.whatsapp_campaigns 
  WHERE id = campaign_id AND user_id = auth.uid()
));

CREATE POLICY "Users can create their campaign contacts"
ON public.whatsapp_campaign_contacts FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.whatsapp_campaigns 
  WHERE id = campaign_id AND user_id = auth.uid()
));

CREATE POLICY "Users can update their campaign contacts"
ON public.whatsapp_campaign_contacts FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.whatsapp_campaigns 
  WHERE id = campaign_id AND user_id = auth.uid()
));

CREATE POLICY "Users can delete their campaign contacts"
ON public.whatsapp_campaign_contacts FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.whatsapp_campaigns 
  WHERE id = campaign_id AND user_id = auth.uid()
));

-- =============================================
-- RLS POLICIES - SCHEDULED
-- =============================================

CREATE POLICY "Users can view their own scheduled messages"
ON public.whatsapp_scheduled FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own scheduled messages"
ON public.whatsapp_scheduled FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scheduled messages"
ON public.whatsapp_scheduled FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scheduled messages"
ON public.whatsapp_scheduled FOR DELETE
USING (auth.uid() = user_id);

-- =============================================
-- RLS POLICIES - LEADS
-- =============================================

CREATE POLICY "Users can view their own leads"
ON public.whatsapp_leads FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own leads"
ON public.whatsapp_leads FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own leads"
ON public.whatsapp_leads FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own leads"
ON public.whatsapp_leads FOR DELETE
USING (auth.uid() = user_id);

-- =============================================
-- RLS POLICIES - GROUPS
-- =============================================

CREATE POLICY "Users can view their own groups"
ON public.whatsapp_groups FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own groups"
ON public.whatsapp_groups FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own groups"
ON public.whatsapp_groups FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own groups"
ON public.whatsapp_groups FOR DELETE
USING (auth.uid() = user_id);

-- =============================================
-- RLS POLICIES - CHATBOT CONFIG
-- =============================================

CREATE POLICY "Users can view their own chatbot config"
ON public.whatsapp_chatbot_config FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chatbot config"
ON public.whatsapp_chatbot_config FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chatbot config"
ON public.whatsapp_chatbot_config FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chatbot config"
ON public.whatsapp_chatbot_config FOR DELETE
USING (auth.uid() = user_id);

-- =============================================
-- RLS POLICIES - LEAD RULES
-- =============================================

CREATE POLICY "Users can view their own lead rules"
ON public.whatsapp_lead_rules FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own lead rules"
ON public.whatsapp_lead_rules FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lead rules"
ON public.whatsapp_lead_rules FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lead rules"
ON public.whatsapp_lead_rules FOR DELETE
USING (auth.uid() = user_id);

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================

CREATE TRIGGER update_whatsapp_instances_updated_at
BEFORE UPDATE ON public.whatsapp_instances
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_whatsapp_campaigns_updated_at
BEFORE UPDATE ON public.whatsapp_campaigns
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_whatsapp_leads_updated_at
BEFORE UPDATE ON public.whatsapp_leads
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_whatsapp_chatbot_config_updated_at
BEFORE UPDATE ON public.whatsapp_chatbot_config
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX idx_whatsapp_messages_user_id ON public.whatsapp_messages(user_id);
CREATE INDEX idx_whatsapp_messages_contact_id ON public.whatsapp_messages(contact_id);
CREATE INDEX idx_whatsapp_messages_sent_at ON public.whatsapp_messages(sent_at DESC);
CREATE INDEX idx_whatsapp_campaigns_status ON public.whatsapp_campaigns(status);
CREATE INDEX idx_whatsapp_scheduled_for ON public.whatsapp_scheduled(scheduled_for);
CREATE INDEX idx_whatsapp_scheduled_status ON public.whatsapp_scheduled(status);
CREATE INDEX idx_whatsapp_leads_classification ON public.whatsapp_leads(classification);
CREATE INDEX idx_whatsapp_campaign_contacts_status ON public.whatsapp_campaign_contacts(status);