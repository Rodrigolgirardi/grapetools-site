-- ============================================================
-- GRAPE TOOLS B2B — Migração: CUPONS + COMISSÃO de vendedor
-- Executar no: Supabase Dashboard → SQL Editor → New Query
-- Seguro rodar mais de uma vez (idempotente).
-- ============================================================
--
-- Cupom = desconto pro cliente (% na loja toda) + comissão pro vendedor dono do
-- cupom. Cupom da empresa (ex.: GRAPE5) tem comissão 0 e vendedor vazio.
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.cupons (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo            TEXT NOT NULL UNIQUE,          -- sempre MAIÚSCULO (ex.: AMANDA5)
  desconto_percent  NUMERIC(5,2) NOT NULL DEFAULT 0
                      CHECK (desconto_percent >= 0 AND desconto_percent <= 90),
  vendedor          TEXT,                          -- NULL/'' = cupom da empresa
  comissao_percent  NUMERIC(5,2) NOT NULL DEFAULT 0
                      CHECK (comissao_percent >= 0 AND comissao_percent <= 100),
  ativo             BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: SÓ o servidor (service_role / admin client) acessa. O cliente NUNCA lê a
-- tabela direto — a validação do cupom acontece no servidor. Sem policies =
-- nenhum usuário anon/authenticated enxerga; o service_role ignora o RLS.
ALTER TABLE public.cupons ENABLE ROW LEVEL SECURITY;

-- Colunas no pedido pra registrar o cupom usado e a comissão gerada.
-- Desnormalizado de propósito: o relatório fica simples e continua correto mesmo
-- se o cupom for editado/removido depois.
ALTER TABLE public.pedidos
  ADD COLUMN IF NOT EXISTS cupom_codigo           TEXT,
  ADD COLUMN IF NOT EXISTS cupom_desconto_percent NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS vendedor               TEXT,
  ADD COLUMN IF NOT EXISTS comissao_percent       NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS comissao_valor         NUMERIC(10,2);

CREATE INDEX IF NOT EXISTS idx_pedidos_vendedor ON public.pedidos(vendedor);
CREATE INDEX IF NOT EXISTS idx_pedidos_cupom    ON public.pedidos(cupom_codigo);
