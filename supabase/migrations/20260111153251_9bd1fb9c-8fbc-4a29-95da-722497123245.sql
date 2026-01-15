-- Tabela para armazenar configurações de lojas parceiras
CREATE TABLE public.lojas_parceiras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  nome VARCHAR(255) NOT NULL,
  url_base VARCHAR(500) NOT NULL,
  supabase_url VARCHAR(500),
  supabase_anon_key TEXT,
  tabela_produtos VARCHAR(100) DEFAULT 'products',
  mapeamento_campos JSONB DEFAULT '{
    "nome": "name",
    "descricao": "description",
    "preco": "sale_price",
    "precoOriginal": "original_price",
    "imagens": "images",
    "categoria": "category_name",
    "tamanhos": "sizes",
    "cores": "colors"
  }'::jsonb,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.lojas_parceiras ENABLE ROW LEVEL SECURITY;

-- Políticas RLS - usuários podem gerenciar suas próprias lojas
CREATE POLICY "Users can view their own partner stores" 
ON public.lojas_parceiras 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create their own partner stores" 
ON public.lojas_parceiras 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own partner stores" 
ON public.lojas_parceiras 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own partner stores" 
ON public.lojas_parceiras 
FOR DELETE 
USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_lojas_parceiras_updated_at
BEFORE UPDATE ON public.lojas_parceiras
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir Toca da Onça como loja padrão (sem user_id = disponível para todos)
INSERT INTO public.lojas_parceiras (
  nome, 
  url_base, 
  supabase_url, 
  supabase_anon_key,
  tabela_produtos,
  mapeamento_campos,
  user_id
) VALUES (
  'Toca da Onça Modas',
  'https://tocadaoncamodas.vercel.app',
  'https://bkdyqhxzpvrjsukbmgvu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrZHlxaHh6cHZyanN1a2JtZ3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3MTM3NjEsImV4cCI6MjA1MDI4OTc2MX0.YLQWMNnM2QEcC8xfyAaPBQY7DT-1xm7fHfnpgxMQ3TE',
  'products',
  '{
    "nome": "name",
    "descricao": "description", 
    "preco": "sale_price",
    "precoOriginal": "original_price",
    "imagens": "images",
    "categoria": "category_name",
    "tamanhos": "sizes",
    "cores": "colors",
    "precoAtacado": "wholesale_price"
  }'::jsonb,
  NULL
);