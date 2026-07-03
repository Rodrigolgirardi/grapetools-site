-- ============================================================
-- GRAPE TOOLS B2B — Migração: PRODUTOS PAUSADOS (pausa manual de venda)
-- Executar no: Supabase Dashboard → SQL Editor → New Query
-- Seguro rodar mais de uma vez (idempotente).
-- ============================================================
--
-- "Pausar" um SKU = deixá-lo indisponível para venda (mostra "Esgotado"), na mão,
-- INDEPENDENTE da quantidade. Fica numa tabela SEPARADA de propósito: assim a pausa
-- NÃO briga com o GrapeOne, que mexe só na tabela `estoque` (quantidade). O site
-- trata SKU pausado como esgotado; despausar volta ao normal (quantidade decide, ou
-- vende livre se não for controlado).
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.produtos_pausados (
  sku         TEXT PRIMARY KEY,
  pausado_em  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- REGRA DE OURO: RLS habilitada em toda tabela nova.
ALTER TABLE public.produtos_pausados ENABLE ROW LEVEL SECURITY;

-- Leitura pública: o site precisa saber o que está pausado pra mostrar "Esgotado".
DROP POLICY IF EXISTS produtos_pausados_select_publico ON public.produtos_pausados;
CREATE POLICY produtos_pausados_select_publico ON public.produtos_pausados
  FOR SELECT USING (true);

-- (Sem policy de INSERT/UPDATE/DELETE → só o service_role/servidor grava, via o
--  endpoint admin protegido. Ninguém pausa/despausa pelo navegador sem ser admin.)
