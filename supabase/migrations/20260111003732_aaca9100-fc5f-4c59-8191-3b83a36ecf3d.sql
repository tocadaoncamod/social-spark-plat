-- Migration: Agentes Especializados
CREATE TABLE public.agentes_especializados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  nome VARCHAR(100) NOT NULL,
  plataforma VARCHAR(50) NOT NULL,
  prompt_base TEXT NOT NULL,
  conhecimentos JSONB DEFAULT '{}'::jsonb,
  ia_primaria VARCHAR(50) DEFAULT 'gemini',
  ia_secundaria VARCHAR(50),
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for agentes_especializados
ALTER TABLE public.agentes_especializados ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own agents"
  ON public.agentes_especializados FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own agents"
  ON public.agentes_especializados FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own agents"
  ON public.agentes_especializados FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own agents"
  ON public.agentes_especializados FOR DELETE
  USING (auth.uid() = user_id);

-- Índices
CREATE INDEX idx_agentes_user_id ON public.agentes_especializados(user_id);
CREATE INDEX idx_agentes_plataforma ON public.agentes_especializados(plataforma);

-- Migration: Tarefas Multi-Plataforma
CREATE TABLE public.tarefas_multiplataforma (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  descricao TEXT NOT NULL,
  plataformas TEXT[] NOT NULL DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'processando',
  resultados JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- RLS for tarefas_multiplataforma
ALTER TABLE public.tarefas_multiplataforma ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tasks"
  ON public.tarefas_multiplataforma FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tasks"
  ON public.tarefas_multiplataforma FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
  ON public.tarefas_multiplataforma FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
  ON public.tarefas_multiplataforma FOR DELETE
  USING (auth.uid() = user_id);

-- Índices
CREATE INDEX idx_tarefas_user_id ON public.tarefas_multiplataforma(user_id);
CREATE INDEX idx_tarefas_status ON public.tarefas_multiplataforma(status);

-- Trigger para updated_at
CREATE TRIGGER update_agentes_updated_at
  BEFORE UPDATE ON public.agentes_especializados
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();