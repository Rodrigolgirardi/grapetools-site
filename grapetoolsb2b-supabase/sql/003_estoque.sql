-- ============================================================
-- GRAPE TOOLS B2B — Migração: ESTOQUE (fonte de verdade compartilhada)
-- Executar no: Supabase Dashboard → SQL Editor → New Query
-- Seguro rodar mais de uma vez (idempotente).
-- ============================================================
--
-- Estoque por SKU (variação). O GrapeOne é o "cérebro": grava as quantidades
-- aqui (via API ERP). O site LÊ (mostra disponibilidade) e DÁ BAIXA a cada
-- venda paga. Vendas em marketplace o GrapeOne também ajusta aqui.
--
-- Regra importante: SKU SEM linha nesta tabela = "não controlado" → o site
-- NÃO bloqueia nem dá baixa (vende normal). Assim dá pra ligar o controle de
-- estoque produto a produto, sem travar o que ainda não foi cadastrado.
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.estoque (
  sku           TEXT PRIMARY KEY,
  quantidade    INTEGER NOT NULL DEFAULT 0,
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.estoque ENABLE ROW LEVEL SECURITY;

-- Leitura pública: o site mostra disponibilidade para qualquer visitante.
DROP POLICY IF EXISTS estoque_select_publico ON public.estoque;
CREATE POLICY estoque_select_publico ON public.estoque
  FOR SELECT USING (true);

-- (Sem policy de INSERT/UPDATE/DELETE → só o service_role/servidor escreve.
--  Ou seja: GrapeOne via API ERP e o site na baixa da venda. Ninguém pelo navegador.)

-- Baixa atômica de estoque (evita corrida quando 2 vendas caem ao mesmo tempo).
-- Retorna a quantidade RESTANTE; retorna -1 se não havia estoque suficiente;
-- retorna NULL se o SKU não está cadastrado (não controlado).
CREATE OR REPLACE FUNCTION public.baixar_estoque(p_sku TEXT, p_qtd INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  existe   BOOLEAN;
  restante INTEGER;
BEGIN
  SELECT TRUE INTO existe FROM public.estoque WHERE sku = p_sku;
  IF existe IS NULL THEN
    RETURN NULL;  -- SKU não controlado
  END IF;

  UPDATE public.estoque
     SET quantidade = quantidade - p_qtd,
         atualizado_em = now()
   WHERE sku = p_sku AND quantidade >= p_qtd
   RETURNING quantidade INTO restante;

  IF NOT FOUND THEN
    RETURN -1;  -- sem estoque suficiente
  END IF;
  RETURN restante;
END;
$$;
