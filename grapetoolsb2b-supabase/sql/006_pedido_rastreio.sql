-- ============================================================
-- GRAPE TOOLS B2B — Migração: código de rastreio no pedido
-- Executar no: Supabase Dashboard → SQL Editor → New Query
-- Seguro rodar mais de uma vez (idempotente).
-- ============================================================
--
-- Guarda o código de rastreio (correios/transportadora) que o admin preenche ao
-- despachar. A coluna herda a RLS da tabela pedidos: o próprio cliente pode ler o
-- rastreio do pedido dele (útil para "Meus pedidos"); só o servidor/admin escreve.
-- O status do pedido (pendente → em_separacao → enviado → entregue) já existe na
-- coluna `status` (enum pedido_status), então aqui só falta o rastreio.
-- ------------------------------------------------------------

ALTER TABLE public.pedidos
  ADD COLUMN IF NOT EXISTS rastreio TEXT;
