-- ============================================================
-- GRAPE TOOLS B2B — Migração: campos administrativos do pedido
-- Executar no: Supabase Dashboard → SQL Editor → New Query
-- Seguro rodar mais de uma vez (idempotente).
-- ============================================================
--
-- Suporta o menu "⋯" da aba Vendas do admin:
--   nota_admin     anotações internas sobre o pedido (só o admin vê)
--   cancel_motivo  motivo escolhido ao cancelar a venda
--   nf_numero      nº da NF-e informado manualmente (até a emissão automática)
-- ------------------------------------------------------------

ALTER TABLE public.pedidos
  ADD COLUMN IF NOT EXISTS nota_admin    TEXT,
  ADD COLUMN IF NOT EXISTS cancel_motivo TEXT,
  ADD COLUMN IF NOT EXISTS nf_numero     TEXT,
  -- nº de parcelas do cartão: a tarifa do Pagar.me muda por parcela, então o
  -- cálculo de margem da aba Vendas precisa saber em quantas vezes foi.
  ADD COLUMN IF NOT EXISTS parcelas      INTEGER;
