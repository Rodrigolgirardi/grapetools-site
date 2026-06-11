-- ============================================================
-- GRAPE TOOLS B2B — Supabase Schema
-- Executar no: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. PROFILES
-- Criado automaticamente após cadastro via trigger
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome        TEXT,
  email       TEXT,
  cnpj        TEXT,
  telefone    TEXT,
  endereco    JSONB DEFAULT '{}'::jsonb,  -- { rua, numero, bairro, cidade, estado, cep }
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CARRINHOS (persistência por usuário)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.carrinhos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sku         TEXT NOT NULL,
  quantidade  INTEGER NOT NULL DEFAULT 1 CHECK (quantidade > 0),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, sku)   -- evita duplicatas do mesmo SKU
);

-- 3. PEDIDOS
-- ------------------------------------------------------------
CREATE TYPE pedido_status AS ENUM (
  'pendente',
  'confirmado',
  'em_separacao',
  'enviado',
  'entregue',
  'cancelado'
);

CREATE TABLE IF NOT EXISTS public.pedidos (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id),
  status          pedido_status NOT NULL DEFAULT 'pendente',
  total           NUMERIC(10,2) NOT NULL DEFAULT 0,
  observacao      TEXT,
  forma_pagamento TEXT,          -- 'pix', 'boleto', 'transferencia'
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ITENS DO PEDIDO
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pedido_itens (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id        UUID NOT NULL REFERENCES public.pedidos(id) ON DELETE CASCADE,
  sku              TEXT NOT NULL,
  descricao        TEXT,
  quantidade       INTEGER NOT NULL CHECK (quantidade > 0),
  preco_unitario   NUMERIC(10,2) NOT NULL,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ÍNDICES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_carrinhos_user_id    ON public.carrinhos(user_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_user_id      ON public.pedidos(user_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_status       ON public.pedidos(status);
CREATE INDEX IF NOT EXISTS idx_pedido_itens_pedido  ON public.pedido_itens(pedido_id);

-- ============================================================
-- RLS — Row Level Security
-- IMPORTANTE: sem isso, qualquer usuário lê dados de todos
-- ============================================================
ALTER TABLE public.profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carrinhos    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedido_itens ENABLE ROW LEVEL SECURITY;

-- Profiles: cada usuário só vê/edita o próprio perfil
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Carrinhos: CRUD só no próprio carrinho
CREATE POLICY "carrinhos_all_own" ON public.carrinhos
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Pedidos: usuário vê e cria apenas os próprios
CREATE POLICY "pedidos_select_own" ON public.pedidos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "pedidos_insert_own" ON public.pedidos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Itens do pedido: acesso via pedido do próprio usuário
CREATE POLICY "pedido_itens_select_own" ON public.pedido_itens
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.pedidos
      WHERE pedidos.id = pedido_itens.pedido_id
      AND pedidos.user_id = auth.uid()
    )
  );

CREATE POLICY "pedido_itens_insert_own" ON public.pedido_itens
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.pedidos
      WHERE pedidos.id = pedido_itens.pedido_id
      AND pedidos.user_id = auth.uid()
    )
  );

-- ============================================================
-- TRIGGER: cria profile automaticamente no cadastro
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.email
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Remove trigger existente antes de recriar (idempotente)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- TRIGGER: updated_at automático
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_carrinhos_updated_at
  BEFORE UPDATE ON public.carrinhos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_pedidos_updated_at
  BEFORE UPDATE ON public.pedidos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
