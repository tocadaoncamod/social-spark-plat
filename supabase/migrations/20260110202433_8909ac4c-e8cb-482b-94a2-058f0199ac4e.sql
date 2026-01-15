-- Add new columns to whatsapp_instances table
ALTER TABLE public.whatsapp_instances 
ADD COLUMN IF NOT EXISTS display_name text,
ADD COLUMN IF NOT EXISTS api_key text,
ADD COLUMN IF NOT EXISTS evolution_url text DEFAULT 'https://evo.tocadaoncaroupa.com',
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS last_connected_at timestamp with time zone;

-- Add unique constraint on instance_name per user
CREATE UNIQUE INDEX IF NOT EXISTS whatsapp_instances_instance_name_user_id_idx 
ON public.whatsapp_instances (instance_name, user_id);