-- ============================================================
-- GRAPE TOOLS B2B — Migração: flag estoque_baixado (baixa idempotente)
-- Executar no: Supabase Dashboard → SQL Editor → New Query
-- Seguro rodar mais de uma vez (idempotente).
-- ============================================================
--
-- Fecha a "baixa de estoque em dobro": a transição do pedido para "pago" passa a
-- reivindicar a baixa numa única operação atômica
--   UPDATE pedidos SET ..., estoque_baixado=true WHERE ... AND estoque_baixado=false
-- Só quem consegue virar a flag de false→true dá baixa. Entregas concorrentes do
-- webhook (order.paid + charge.paid + retries) e a corrida cartão-vs-webhook viram
-- no-op para o "perdedor" — baixa ocorre EXATAMENTE uma vez.
-- ------------------------------------------------------------

ALTER TABLE public.pedidos
  ADD COLUMN IF NOT EXISTS estoque_baixado BOOLEAN NOT NULL DEFAULT false;

-- Pedidos JÁ pagos antes desta migração já tiveram a baixa feita pelo fluxo antigo:
-- marca como baixado para uma reentrega de webhook não decrementar de novo.
UPDATE public.pedidos
   SET estoque_baixado = true
 WHERE pagamento_status = 'pago' AND estoque_baixado = false;
