-- ============================================
-- FASE 1: Habilitar RLS nas Tabelas
-- ============================================

-- RLS já está habilitado, mas garantindo
ALTER TABLE public.whatsapp_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_chatbot_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_prompts ENABLE ROW LEVEL SECURITY;

-- ============================================
-- FASE 2: Criar/Recriar Políticas de Acesso
-- ============================================

-- Remover políticas existentes para recriar (whatsapp_instances)
DROP POLICY IF EXISTS "Users can view their own instances" ON public.whatsapp_instances;
DROP POLICY IF EXISTS "Users can insert their own instances" ON public.whatsapp_instances;
DROP POLICY IF EXISTS "Users can update their own instances" ON public.whatsapp_instances;
DROP POLICY IF EXISTS "Users can delete their own instances" ON public.whatsapp_instances;

-- Política 1: Usuário pode VER apenas suas instâncias
CREATE POLICY "Users can view their own instances"
ON public.whatsapp_instances FOR SELECT
USING (auth.uid() = user_id);

-- Política 2: Usuário pode INSERIR apenas com seu user_id
CREATE POLICY "Users can insert their own instances"
ON public.whatsapp_instances FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Política 3: Usuário pode ATUALIZAR apenas suas instâncias
CREATE POLICY "Users can update their own instances"
ON public.whatsapp_instances FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Política 4: Usuário pode DELETAR apenas suas instâncias
CREATE POLICY "Users can delete their own instances"
ON public.whatsapp_instances FOR DELETE
USING (auth.uid() = user_id);

-- ============================================
-- POLÍTICAS RLS: whatsapp_chatbot_config
-- ============================================

-- Remover políticas existentes para recriar
DROP POLICY IF EXISTS "Users can view their own chatbot config" ON public.whatsapp_chatbot_config;
DROP POLICY IF EXISTS "Users can insert their own chatbot config" ON public.whatsapp_chatbot_config;
DROP POLICY IF EXISTS "Users can update their own chatbot config" ON public.whatsapp_chatbot_config;
DROP POLICY IF EXISTS "Users can delete their own chatbot config" ON public.whatsapp_chatbot_config;

-- Política 1: Usuário pode VER apenas suas configs
CREATE POLICY "Users can view their own chatbot config"
ON public.whatsapp_chatbot_config FOR SELECT
USING (auth.uid() = user_id);

-- Política 2: Usuário pode INSERIR apenas com seu user_id
CREATE POLICY "Users can insert their own chatbot config"
ON public.whatsapp_chatbot_config FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Política 3: Usuário pode ATUALIZAR apenas suas configs
CREATE POLICY "Users can update their own chatbot config"
ON public.whatsapp_chatbot_config FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Política 4: Usuário pode DELETAR apenas suas configs
CREATE POLICY "Users can delete their own chatbot config"
ON public.whatsapp_chatbot_config FOR DELETE
USING (auth.uid() = user_id);

-- ============================================
-- POLÍTICAS RLS: professional_prompts
-- ============================================

-- Remover política existente para recriar
DROP POLICY IF EXISTS "Anyone can read professional prompts" ON public.professional_prompts;

-- Prompts profissionais são PÚBLICOS (todos podem ver)
CREATE POLICY "Anyone can read professional prompts"
ON public.professional_prompts FOR SELECT
USING (true);

-- ============================================
-- FASE 3: Inserir Instâncias
-- ============================================
-- Como auth.uid() não funciona em migrations (sem contexto de usuário),
-- vamos atribuir as instâncias ao primeiro usuário existente no sistema

-- Primeiro, deletar instâncias antigas com esses nomes (se existirem)
DELETE FROM public.whatsapp_instances 
WHERE instance_name IN ('tocadaonca', 'loja-tocadaonca');

-- Inserir instância 1: tocadaonca (atribuída ao primeiro usuário)
INSERT INTO public.whatsapp_instances (
  user_id,
  instance_name,
  phone_number,
  display_name,
  api_key,
  evolution_url,
  status,
  is_active
) 
SELECT 
  id,
  'tocadaonca',
  '5512992058243',
  'Loja Toca da Onça Modas',
  'B92E3518C417-463B-B182-4C3650E5E6EC',
  'https://evo.tocadaoncaroupa.com',
  'connected',
  true
FROM public.profiles
ORDER BY created_at ASC
LIMIT 1;

-- Inserir instância 2: loja-tocadaonca (atribuída ao primeiro usuário)
INSERT INTO public.whatsapp_instances (
  user_id,
  instance_name,
  phone_number,
  display_name,
  api_key,
  evolution_url,
  status,
  is_active
) 
SELECT 
  id,
  'loja-tocadaonca',
  '5512991008498',
  'Loja Toca da Onça',
  '2B9512C5A3AC-40B6-9FB1-7E8AE33EA225',
  'https://evo.tocadaoncaroupa.com',
  'connected',
  false
FROM public.profiles
ORDER BY created_at ASC
LIMIT 1;