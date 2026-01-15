-- Create contact_lists table
CREATE TABLE public.contact_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name VARCHAR(200) NOT NULL,
  file_url TEXT,
  total_contacts INTEGER DEFAULT 0,
  valid_contacts INTEGER DEFAULT 0,
  invalid_contacts INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.contact_lists ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own contact lists"
ON public.contact_lists
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own contact lists"
ON public.contact_lists
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contact lists"
ON public.contact_lists
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own contact lists"
ON public.contact_lists
FOR DELETE
USING (auth.uid() = user_id);

-- Create storage bucket for contact list files
INSERT INTO storage.buckets (id, name, public)
VALUES ('contact-lists', 'contact-lists', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload their own contact list files"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'contact-lists' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own contact list files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'contact-lists' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own contact list files"
ON storage.objects
FOR DELETE
USING (bucket_id = 'contact-lists' AND auth.uid()::text = (storage.foldername(name))[1]);