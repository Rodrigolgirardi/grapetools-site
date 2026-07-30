-- ============================================================
-- GRAPE TOOLS B2B — Migração: dados de frete/entrega no pedido
-- Executar no: Supabase Dashboard → SQL Editor → New Query
-- Seguro rodar mais de uma vez (idempotente).
-- ============================================================
--
-- Persistimos no PEDIDO tudo que a compra da etiqueta no Melhor Envio precisa,
-- congelado no momento da compra (o endereço do perfil pode mudar depois):
--   entrega_tipo        'entrega' | 'retirada'
--   endereco_entrega    { rua, numero, complemento, bairro, cidade, estado, cep }
--   frete_valor         o que o cliente pagou de frete (0 = grátis/retirada)
--   frete_servico_id    id do serviço no Melhor Envio (SEDEX=2, etc.)
--   frete_servico_nome  "Correios SEDEX", "Jadlog .Package"…
--   etiqueta_id         id do envio no Melhor Envio (depois de comprar a etiqueta)
--   etiqueta_url        link do PDF da etiqueta pra imprimir
-- O rastreio já existe (migração 006). Colunas herdam a RLS de pedidos.
-- ------------------------------------------------------------

ALTER TABLE public.pedidos
  ADD COLUMN IF NOT EXISTS entrega_tipo       TEXT,
  ADD COLUMN IF NOT EXISTS endereco_entrega   JSONB,
  ADD COLUMN IF NOT EXISTS frete_valor        NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS frete_servico_id   INTEGER,
  ADD COLUMN IF NOT EXISTS frete_servico_nome TEXT,
  ADD COLUMN IF NOT EXISTS etiqueta_id        TEXT,
  ADD COLUMN IF NOT EXISTS etiqueta_url       TEXT;
