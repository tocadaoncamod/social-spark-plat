-- Create table for response templates
CREATE TABLE public.facebook_response_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  template_text TEXT NOT NULL,
  variables JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.facebook_response_templates ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own templates" 
ON public.facebook_response_templates 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own templates" 
ON public.facebook_response_templates 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own templates" 
ON public.facebook_response_templates 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own templates" 
ON public.facebook_response_templates 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_facebook_response_templates_updated_at
BEFORE UPDATE ON public.facebook_response_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();