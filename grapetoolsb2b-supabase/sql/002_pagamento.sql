-- ============================================================
-- GRAPE TOOLS B2B — Migração: status de PAGAMENTO
-- Executar no: Supabase Dashboard → SQL Editor → New Query
-- Seguro rodar mais de uma vez (idempotente).
-- ============================================================
--
-- Separa "pedido feito" de "pedido pago":
--   pedidos.status            -> andamento/entrega (pendente, enviado, ...)
--   pedidos.pagamento_status  -> pagamento (nao_pago, pago, estornado, falhou)
-- ------------------------------------------------------------

ALTER TABLE public.pedidos
  ADD COLUMN IF NOT EXISTS pagamento_status TEXT NOT NULL DEFAULT 'nao_pago',
  ADD COLUMN IF NOT EXISTS pago_em          TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS pagarme_order_id TEXT;

-- Só permite valores válidos em pagamento_status
ALTER TABLE public.pedidos
  DROP CONSTRAINT IF EXISTS pedidos_pagamento_status_check;
ALTER TABLE public.pedidos
  ADD CONSTRAINT pedidos_pagamento_status_check
  CHECK (pagamento_status IN ('nao_pago', 'pago', 'estornado', 'falhou'));

-- Índices para consultas rápidas (ex: "todos os pagos", buscar pelo id do Pagar.me)
CREATE INDEX IF NOT EXISTS idx_pedidos_pagamento_status ON public.pedidos(pagamento_status);
CREATE INDEX IF NOT EXISTS idx_pedidos_pagarme_order_id ON public.pedidos(pagarme_order_id);
