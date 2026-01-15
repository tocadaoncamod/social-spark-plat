-- Facebook Automação Tables

-- 1. Grupos Automáticos
CREATE TABLE public.facebook_grupos_automaticos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  grupo_id VARCHAR(100) NOT NULL,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  membros INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pendente',
  regras JSONB DEFAULT '{}',
  requisitos_entrada JSONB DEFAULT '{}',
  permite_vendas BOOLEAN DEFAULT true,
  ultimo_post TIMESTAMP WITH TIME ZONE,
  proximo_post TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Posts em Grupos
CREATE TABLE public.facebook_posts_grupos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  grupo_id UUID REFERENCES public.facebook_grupos_automaticos(id) ON DELETE CASCADE,
  produto_id UUID,
  post_id VARCHAR(100),
  texto TEXT NOT NULL,
  imagem_url TEXT,
  link TEXT,
  status VARCHAR(50) DEFAULT 'agendado',
  agendado_para TIMESTAMP WITH TIME ZONE,
  publicado_em TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Marketplace Automático
CREATE TABLE public.facebook_marketplace_produtos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  produto_id UUID,
  listagem_id VARCHAR(100),
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  categoria VARCHAR(100),
  condicao VARCHAR(50) DEFAULT 'Novo',
  localizacao VARCHAR(255),
  imagens JSONB DEFAULT '[]',
  status VARCHAR(50) DEFAULT 'ativo',
  visualizacoes INTEGER DEFAULT 0,
  mensagens INTEGER DEFAULT 0,
  ultima_atualizacao TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Respostas Automáticas
CREATE TABLE public.facebook_respostas_automaticas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  conversa_id VARCHAR(100) NOT NULL,
  remetente_id VARCHAR(100) NOT NULL,
  remetente_nome VARCHAR(255),
  mensagem_recebida TEXT NOT NULL,
  resposta_enviada TEXT,
  contexto VARCHAR(50),
  produto_id UUID,
  respondido BOOLEAN DEFAULT false,
  respondido_em TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_fb_grupos_user_id ON public.facebook_grupos_automaticos(user_id);
CREATE INDEX idx_fb_grupos_status ON public.facebook_grupos_automaticos(status);
CREATE INDEX idx_fb_posts_grupo_id ON public.facebook_posts_grupos(grupo_id);
CREATE INDEX idx_fb_posts_status ON public.facebook_posts_grupos(status);
CREATE INDEX idx_fb_marketplace_user_id ON public.facebook_marketplace_produtos(user_id);
CREATE INDEX idx_fb_marketplace_status ON public.facebook_marketplace_produtos(status);
CREATE INDEX idx_fb_respostas_user_id ON public.facebook_respostas_automaticas(user_id);
CREATE INDEX idx_fb_respostas_respondido ON public.facebook_respostas_automaticas(respondido);

-- RLS (Row Level Security)
ALTER TABLE public.facebook_grupos_automaticos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facebook_posts_grupos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facebook_marketplace_produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facebook_respostas_automaticas ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para facebook_grupos_automaticos
CREATE POLICY "Users can view own facebook groups"
  ON public.facebook_grupos_automaticos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own facebook groups"
  ON public.facebook_grupos_automaticos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own facebook groups"
  ON public.facebook_grupos_automaticos FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own facebook groups"
  ON public.facebook_grupos_automaticos FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas RLS para facebook_posts_grupos
CREATE POLICY "Users can view own facebook posts"
  ON public.facebook_posts_grupos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own facebook posts"
  ON public.facebook_posts_grupos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own facebook posts"
  ON public.facebook_posts_grupos FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own facebook posts"
  ON public.facebook_posts_grupos FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas RLS para facebook_marketplace_produtos
CREATE POLICY "Users can view own marketplace products"
  ON public.facebook_marketplace_produtos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own marketplace products"
  ON public.facebook_marketplace_produtos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own marketplace products"
  ON public.facebook_marketplace_produtos FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own marketplace products"
  ON public.facebook_marketplace_produtos FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas RLS para facebook_respostas_automaticas
CREATE POLICY "Users can view own auto responses"
  ON public.facebook_respostas_automaticas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own auto responses"
  ON public.facebook_respostas_automaticas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own auto responses"
  ON public.facebook_respostas_automaticas FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own auto responses"
  ON public.facebook_respostas_automaticas FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger para updated_at
CREATE TRIGGER update_facebook_grupos_updated_at
  BEFORE UPDATE ON public.facebook_grupos_automaticos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();