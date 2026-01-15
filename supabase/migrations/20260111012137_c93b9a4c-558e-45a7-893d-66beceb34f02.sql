-- Create table for scheduled auto-message campaigns
CREATE TABLE public.scheduled_auto_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES public.lead_scraper_campaigns(id) ON DELETE SET NULL,
  instance_id UUID REFERENCES public.whatsapp_instances(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  lead_types TEXT[] NOT NULL DEFAULT ARRAY['atacadista', 'varejista', 'comprador'],
  messages JSONB NOT NULL,
  media_url TEXT,
  media_type TEXT,
  delay_min INTEGER NOT NULL DEFAULT 5,
  delay_max INTEGER NOT NULL DEFAULT 15,
  total_leads INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.scheduled_auto_messages ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own scheduled messages"
  ON public.scheduled_auto_messages
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own scheduled messages"
  ON public.scheduled_auto_messages
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scheduled messages"
  ON public.scheduled_auto_messages
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scheduled messages"
  ON public.scheduled_auto_messages
  FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_scheduled_auto_messages_updated_at
  BEFORE UPDATE ON public.scheduled_auto_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();