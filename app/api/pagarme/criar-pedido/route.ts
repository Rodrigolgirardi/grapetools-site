// app/api/pagarme/criar-pedido/route.ts
// Cria um pedido no Pagar.me e retorna os dados de pagamento
// SEGURO: secret key nunca vai para o frontend

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { createClient } from '@/lib/supabase-server'
import { documentoValido } from '@/lib/documento'
import { getEstoqueMap, confirmarPedidoPago } from '@/lib/estoque'
import { composicaoDoSku } from '@/lib/data'
import { calcularPedidoServidor } from '@/lib/pricing'
import { buscarCupomAtivo } from '@/lib/cupom'

const PAGARME_API = 'https://api.pagar.me/core/v5'
const SECRET_KEY = process.env.PAGARME_SECRET_KEY!

interface ItemPedido {
  sku: string
  descricao: string
  quantidade: number
  preco_unitario: number // em reais
}

interface EnderecoPayload {
  rua: string
  numero: string
  complemento?: string
  bairro: string
  cidade: string
  estado: string
  cep: string
}

interface CriarPedidoPayload {
  pedido_id: string       // ID do pedido no Supabase
  total: number           // em reais
  forma_pagamento: 'pix' | 'boleto' | 'transferencia' | 'cartao'
  itens: ItemPedido[]
  cliente: {
    nome: string
    email: string
    documento: string     // CPF ou CNPJ (só números)
    telefone?: string
  }
  endereco: EnderecoPayload
  card_token?: string     // token do cartão (gerado no navegador, nunca o cartão cru)
  parcelas?: number       // número de parcelas (cartão de crédito)
  cupom?: string          // código do cupom (opcional) — validado no servidor
}

function toAmountCents(reais: number): number {
  return Math.round(reais * 100)
}

function cleanDoc(doc: string): string {
  return doc.replace(/\D/g, '')
}

function cleanPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  return digits.startsWith('55') ? digits : `55${digits}`
}

// Grava um patch no pedido com algumas tentativas. O client do Supabase NÃO lança
// em erro de banco (retorna { error }); então checamos e re-tentamos com um pequeno
// backoff. Retorna true se gravou, false se falhou em todas as tentativas.
async function atualizarPedidoComRetry(
  admin: ReturnType<typeof createAdminClient>,
  pedidoId: string,
  patch: Record<string, unknown>,
  tentativas = 3
): Promise<boolean> {
  for (let i = 0; i < tentativas; i++) {
    const { error } = await admin.from('pedidos').update(patch).eq('id', pedidoId)
    if (!error) return true
    console.error(`Falha ao atualizar pedido ${pedidoId} (tentativa ${i + 1}/${tentativas}):`, error.message)
    if (i < tentativas - 1) await new Promise((r) => setTimeout(r, 150 * (i + 1)))
  }
  return false
}

export async function POST(request: NextRequest) {
  try {
    // 0) Segurança: precisa estar logado
    const supabaseUser = await createClient()
    const { data: { user } } = await supabaseUser.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado. Faça login.' }, { status: 401 })
    }

    const body: CriarPedidoPayload = await request.json()
    // Obs.: `total` e `itens[].preco_unitario` do corpo NÃO são confiáveis — o preço
    // é recalculado no servidor (0f). Só usamos sku + quantidade do cliente.
    const { pedido_id, forma_pagamento, itens, cliente, endereco, card_token, parcelas, cupom: cupomCodigo } = body

    // 0b) Confere que o pedido existe E pertence a quem está logado
    //     (impede criar cobranças para pedidos de outras pessoas)
    const admin = createAdminClient()
    const { data: pedidoRow } = await admin
      .from('pedidos')
      .select('user_id, pagamento_status')
      .eq('id', pedido_id)
      .single()
    if (!pedidoRow || pedidoRow.user_id !== user.id) {
      return NextResponse.json({ error: 'Pedido inválido.' }, { status: 403 })
    }
    // Idempotência: não recobra um pedido já pago (evita cobrança dupla em retry).
    if (pedidoRow.pagamento_status === 'pago') {
      return NextResponse.json({ error: 'Este pedido já foi pago.' }, { status: 409 })
    }

    // 0c) Valida o documento (CPF/CNPJ real) antes de chamar o Pagar.me
    if (forma_pagamento !== 'transferencia' && !documentoValido(cliente?.documento || '')) {
      return NextResponse.json({ error: 'CPF ou CNPJ inválido.' }, { status: 400 })
    }

    // 0d) Cartão precisa do token (gerado no navegador)
    if (forma_pagamento === 'cartao' && !card_token) {
      return NextResponse.json({ error: 'Dados do cartão ausentes.' }, { status: 400 })
    }

    // Só processa Pix e Boleto por agora
    if (forma_pagamento === 'transferencia') {
      return NextResponse.json({
        tipo: 'transferencia',
        mensagem: 'Pedido recebido! Aguarde os dados de transferência por WhatsApp.',
      })
    }

    // 0e) Bloqueia venda acima do estoque (só SKUs controlados; os demais passam normal).
    //     Kits são expandidos em seus componentes (somando necessidades por SKU).
    const estoque = await getEstoqueMap()
    const necessidade: Record<string, number> = {}
    for (const it of itens || []) {
      const comp = composicaoDoSku(it.sku)
      if (comp) {
        for (const c of comp) necessidade[c.sku] = (necessidade[c.sku] || 0) + c.quantidade * it.quantidade
      } else {
        necessidade[it.sku] = (necessidade[it.sku] || 0) + it.quantidade
      }
    }
    const faltando = Object.entries(necessidade).some(
      ([sku, need]) => Object.prototype.hasOwnProperty.call(estoque, sku) && estoque[sku] < need
    )
    if (faltando) {
      return NextResponse.json(
        { error: 'Um item do seu pedido está sem estoque suficiente. Revise as quantidades.' },
        { status: 409 }
      )
    }

    // 0f-cupom) Se veio um cupom, valida no servidor (o cliente não forja desconto).
    //     Código inválido/inativo => barra (o cliente viu um desconto que não vale).
    let cupom = null
    if (cupomCodigo && String(cupomCodigo).trim()) {
      cupom = await buscarCupomAtivo(String(cupomCodigo))
      if (!cupom) {
        return NextResponse.json(
          { error: 'Cupom inválido ou expirado. Remova o cupom e tente de novo.' },
          { status: 400 }
        )
      }
    }

    // 0f) FONTE DE VERDADE DO PREÇO: recalcula preço/desconto/juros no servidor a
    //     partir do catálogo, IGNORANDO total/preço enviados pelo cliente
    //     (impede adulteração de preço — pagar R$0,01). O cliente só informa sku+qtd.
    //     O desconto do cupom SOMA com o desconto por valor do carrinho.
    const calc = calcularPedidoServidor(
      (itens || []).map((i) => ({ sku: i.sku, quantidade: i.quantidade })),
      {
        cartao: forma_pagamento === 'cartao',
        parcelas: parcelas && parcelas > 0 ? parcelas : 1,
        cupomPercent: cupom?.desconto_percent || 0,
      }
    )
    if (!calc.ok) {
      return NextResponse.json({ error: calc.erro || 'Itens do pedido inválidos.' }, { status: 400 })
    }

    // Comissão = % do cupom × total que o cliente pagou (decisão do dono). Só há
    // comissão se o cupom tem vendedor + % > 0. Conta de verdade só quando o pedido
    // for PAGO (o relatório no /admin filtra por pago).
    const comissaoValor =
      cupom && cupom.comissao_percent > 0 && cupom.vendedor
        ? Math.round(calc.total * cupom.comissao_percent) / 100
        : 0

    // Grava o total + os itens autoritativos ANTES de cobrar (o cliente só criou o
    // pedido; os itens são criados aqui). Se qualquer gravação falhar, ABORTA sem
    // cobrar — fecha o buraco de "pedido órfão" (cobrança de pedido sem itens).
    {
      // Só inclui os campos de cupom se um cupom foi usado — assim pedidos SEM cupom
      // não tocam as colunas novas (funciona mesmo se a migração 007 ainda não rodou).
      const pedidoPatch: Record<string, unknown> = { total: calc.total }
      if (cupom) {
        pedidoPatch.cupom_codigo = cupom.codigo
        pedidoPatch.cupom_desconto_percent = cupom.desconto_percent
        pedidoPatch.vendedor = cupom.vendedor || null
        pedidoPatch.comissao_percent = cupom.comissao_percent
        pedidoPatch.comissao_valor = comissaoValor
      }
      const { error: errTotal } = await admin
        .from('pedidos')
        .update(pedidoPatch)
        .eq('id', pedido_id)
      const { error: errDel } = await admin
        .from('pedido_itens')
        .delete()
        .eq('pedido_id', pedido_id)
      const { error: errIns } = await admin.from('pedido_itens').insert(
        calc.itens.map((it) => ({
          pedido_id,
          sku: it.sku,
          descricao: it.descricao,
          quantidade: it.quantidade,
          preco_unitario: it.preco_unitario,
        }))
      )
      if (errTotal || errDel || errIns) {
        console.error('Falha ao gravar pedido/itens (abortando antes de cobrar):', errTotal || errDel || errIns)
        return NextResponse.json(
          { error: 'Não foi possível registrar o pedido. Tente novamente.' },
          { status: 500 }
        )
      }
    }

    const docClean = cleanDoc(cliente.documento || '')
    const docType = docClean.length === 11 ? 'cpf' : 'cnpj'

    // Monta o pagamento conforme a forma escolhida
    let pagamento: Record<string, unknown>
    if (forma_pagamento === 'pix') {
      pagamento = {
        payment_method: 'pix',
        pix: { expires_in: 3600 }, // 1 hora
        amount: toAmountCents(calc.valorCobrar),
      }
    } else if (forma_pagamento === 'cartao') {
      pagamento = {
        payment_method: 'credit_card',
        credit_card: {
          installments: parcelas && parcelas > 0 ? parcelas : 1,
          statement_descriptor: 'GRAPETOOLS',
          card_token,
          card: {
            // Endereço de cobrança (exigido pelo Pagar.me no cartão)
            billing_address: {
              line_1: `${endereco.numero}, ${endereco.rua}`,
              zip_code: cleanDoc(endereco.cep),
              city: endereco.cidade,
              state: endereco.estado,
              country: 'BR',
            },
          },
        },
        amount: toAmountCents(calc.valorCobrar),
      }
    } else {
      pagamento = {
        payment_method: 'boleto',
        boleto: {
          instructions: 'Pagar até o vencimento. Após o vencimento, o pedido será cancelado.',
          due_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 dias
        },
        amount: toAmountCents(calc.valorCobrar),
      }
    }

    // Itens; se o total cobrado for maior que a soma (juros do parcelamento no
    // cartão), adiciona um item de "Juros" para o Pagar.me bater o valor.
    const itemsBody: Array<{ code: string; description: string; amount: number; quantity: number }> =
      calc.itens.map(item => ({
        code: item.sku,
        description: item.descricao.slice(0, 100),
        amount: toAmountCents(item.preco_unitario),
        quantity: item.quantidade,
      }))
    const somaItens = itemsBody.reduce((s, it) => s + it.amount * it.quantity, 0)
    const totalCents = toAmountCents(calc.valorCobrar)
    if (totalCents > somaItens) {
      itemsBody.push({
        code: 'JUROS',
        description: 'Juros do parcelamento',
        amount: totalCents - somaItens,
        quantity: 1,
      })
    }

    // Monta o body para a API do Pagar.me
    const pagarmeBody: Record<string, unknown> = {
      code: pedido_id.slice(0, 8).toUpperCase(),
      // Link bidirecional: mesmo que o banco perca o pagarme_order_id, dá pra
      // reconciliar lendo este pedido no Pagar.me (metadata guarda o nosso id).
      metadata: { pedido_id },
      customer: {
        name: cliente.nome,
        email: cliente.email,
        type: docType === 'cnpj' ? 'company' : 'individual',
        document: docClean,
        document_type: docType,
        phones: cliente.telefone ? {
          mobile_phone: {
            country_code: '55',
            area_code: cleanPhone(cliente.telefone).slice(2, 4),
            number: cleanPhone(cliente.telefone).slice(4),
          }
        } : undefined,
      },
      items: itemsBody,
      payments: [pagamento],
      shipping: {
        amount: 0,
        description: 'A combinar',
        address: {
          line_1: `${endereco.numero}, ${endereco.rua}`,
          line_2: endereco.complemento || '',
          zip_code: cleanDoc(endereco.cep),
          city: endereco.cidade,
          state: endereco.estado,
          country: 'BR',
        },
      },
    }

    // Chama a API do Pagar.me
    const response = await fetch(`${PAGARME_API}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${SECRET_KEY}:`).toString('base64')}`,
        // Idempotência: um retry com a mesma chave retorna a MESMA cobrança no
        // Pagar.me, em vez de criar uma segunda (evita cobrar o cliente 2x).
        'Idempotency-Key': pedido_id,
      },
      body: JSON.stringify(pagarmeBody),
    })

    const data = await response.json()

    if (!response.ok) {
      // Pagar.me v5 manda os erros detalhados em data.errors (objeto por campo)
      const detalhes = data?.errors && typeof data.errors === 'object'
        ? Object.entries(data.errors)
            .map(([campo, msgs]) => `${campo}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
            .join(' | ')
        : ''
      const errMsg = detalhes || data?.message || 'erro desconhecido'
      // Loga só o status e o motivo do erro — NUNCA o corpo (tem dados do cliente)
      console.error(`Pagar.me ${forma_pagamento} falhou (HTTP ${response.status}): ${errMsg}`)
      return NextResponse.json(
        { error: `Erro Pagar.me: ${errMsg}` },
        { status: 400 }
      )
    }

    // Vincula a cobrança do Pagar.me ao pedido — este é o ÚNICO elo que deixa o
    // webhook reconciliar um pagamento assíncrono (Pix/boleto). Gravamos com retry;
    // se ainda assim falhar, gritamos no log ([RECONCILIAR]) — o pedido tem
    // metadata.pedido_id no Pagar.me, então dá pra reconciliar manualmente/por cron.
    // Nunca perdemos a venda em silêncio.
    if (data?.id) {
      const salvou = await atualizarPedidoComRetry(admin, pedido_id, { pagarme_order_id: data.id })
      if (!salvou) {
        console.error(`[RECONCILIAR] Cobranca criada no Pagar.me mas NAO salvei pagarme_order_id. pedido=${pedido_id} pagarme_order=${data.id}`)
      }
    }

    // Extrai os dados de pagamento da resposta (sem logar — contém dados do cliente)
    const charge = data.charges?.[0]
    const lastTransaction = charge?.last_transaction

    if (forma_pagamento === 'cartao') {
      // Cartão é aprovado/recusado na hora
      if (data.status === 'paid') {
        // Confirma pago + baixa de forma atômica/idempotente (mesma fonte do cron).
        // Cartão FOI cobrado; mesmo se a gravação falhar, o webhook/cron reconcilia
        // depois via pagarme_order_id — por isso ainda retornamos sucesso abaixo (não
        // mandar o cliente pagar de novo). confirmarPedidoPago já loga [RECONCILIAR].
        await confirmarPedidoPago(pedido_id)
        return NextResponse.json({
          tipo: 'cartao',
          pagarme_order_id: data.id,
          status: 'paid',
          parcelas: parcelas && parcelas > 0 ? parcelas : 1,
        })
      }
      // Recusado
      const motivo =
        lastTransaction?.acquirer_message ||
        lastTransaction?.gateway_response?.errors?.[0]?.message ||
        'Pagamento não aprovado pela operadora do cartão'
      return NextResponse.json({ error: `Cartão recusado: ${motivo}` }, { status: 400 })
    }

    if (forma_pagamento === 'pix') {
      return NextResponse.json({
        tipo: 'pix',
        pagarme_order_id: data.id,
        qr_code: lastTransaction?.qr_code,
        qr_code_url: lastTransaction?.qr_code_url,
        expires_at: lastTransaction?.expires_at,
        status: data.status,
      })
    }

    if (forma_pagamento === 'boleto') {
      return NextResponse.json({
        tipo: 'boleto',
        pagarme_order_id: data.id,
        boleto_url: lastTransaction?.url,
        boleto_barcode: lastTransaction?.line,
        due_at: lastTransaction?.due_at,
        status: data.status,
      })
    }

  } catch (error) {
    console.error('Erro na API Pagar.me:', error)
    return NextResponse.json(
      { error: 'Erro interno. Tente novamente.' },
      { status: 500 }
    )
  }
}
