// app/api/pagarme/criar-pedido/route.ts
// Cria um pedido no Pagar.me e retorna os dados de pagamento
// SEGURO: secret key nunca vai para o frontend

import { NextRequest, NextResponse } from 'next/server'

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
  forma_pagamento: 'pix' | 'boleto' | 'transferencia'
  itens: ItemPedido[]
  cliente: {
    nome: string
    email: string
    documento: string     // CPF ou CNPJ (só números)
    telefone?: string
  }
  endereco: EnderecoPayload
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

export async function POST(request: NextRequest) {
  try {
    const body: CriarPedidoPayload = await request.json()
    const { pedido_id, total, forma_pagamento, itens, cliente, endereco } = body

    // Só processa Pix e Boleto por agora
    if (forma_pagamento === 'transferencia') {
      return NextResponse.json({
        tipo: 'transferencia',
        mensagem: 'Pedido recebido! Aguarde os dados de transferência por WhatsApp.',
      })
    }

    const docClean = cleanDoc(cliente.documento || '')
    const docType = docClean.length === 11 ? 'cpf' : 'cnpj'

    // Monta o body para a API do Pagar.me
    const pagarmeBody: Record<string, unknown> = {
      code: pedido_id.slice(0, 8).toUpperCase(),
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
      items: itens.map(item => ({
        code: item.sku,
        description: item.descricao.slice(0, 100),
        amount: toAmountCents(item.preco_unitario),
        quantity: item.quantidade,
      })),
      payments: [
        forma_pagamento === 'pix'
          ? {
              payment_method: 'pix',
              pix: {
                expires_in: 3600, // 1 hora
              },
              amount: toAmountCents(total),
            }
          : {
              payment_method: 'boleto',
              boleto: {
                instructions: 'Pagar até o vencimento. Após o vencimento, o pedido será cancelado.',
                due_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 dias
              },
              amount: toAmountCents(total),
            },
      ],
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
      },
      body: JSON.stringify(pagarmeBody),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Pagar.me error status:', response.status)
      console.error('Pagar.me error body:', JSON.stringify(data, null, 2))
      console.error('Pagar.me request body sent:', JSON.stringify(pagarmeBody, null, 2))
      const errMsg = data?.message || data?.errors?.[0]?.message || JSON.stringify(data)
      return NextResponse.json(
        { error: `Erro Pagar.me: ${errMsg}` },
        { status: 400 }
      )
    }

    // Extrai os dados de pagamento da resposta
    console.log('Pagar.me success response:', JSON.stringify(data, null, 2))
    const charge = data.charges?.[0]
    const lastTransaction = charge?.last_transaction
    console.log('charge:', JSON.stringify(charge, null, 2))
    console.log('lastTransaction:', JSON.stringify(lastTransaction, null, 2))

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
