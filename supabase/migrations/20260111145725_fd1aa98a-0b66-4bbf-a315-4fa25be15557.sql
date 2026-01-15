-- Create table for Facebook token configuration
CREATE TABLE public.facebook_token_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  page_id TEXT,
  page_name TEXT,
  access_token_expires_at TIMESTAMP WITH TIME ZONE,
  last_validated_at TIMESTAMP WITH TIME ZONE,
  token_status TEXT DEFAULT 'valid' CHECK (token_status IN ('valid', 'expiring_soon', 'expired', 'unknown')),
  permissions_granted TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.facebook_token_config ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own token config" 
ON public.facebook_token_config 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own token config" 
ON public.facebook_token_config 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own token config" 
ON public.facebook_token_config 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_facebook_token_config_updated_at
BEFORE UPDATE ON public.facebook_token_config
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();