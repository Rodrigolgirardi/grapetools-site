# Emissão de NF-e no GrapeOne via Focus NFe

Guia completo para emitir a **NF-e (modelo 55 — nota de produto)** de forma
**semi-automática** dentro do GrapeOne: o app mostra o pedido com tudo pronto,
você clica em **"Emitir NF"**, o GrapeOne chama a Focus NFe e recebe a nota
autorizada (PDF da DANFE + XML).

> Este código roda **no GrapeOne** (backend), não no site. O site já fez a parte
> dele (registrar a venda e disponibilizar os dados via a API PULL — ver
> `API-Grape-One.md`).

---

## 1. O fluxo em uma imagem

```
Venda no site  →  GrapeOne reconhece o pedido  →  você abre o pedido
   →  clica "Emitir NF"
   →  GrapeOne monta o JSON e faz POST na Focus NFe
   →  Focus processa e autoriza na SEFAZ (assíncrono)
   →  GrapeOne recebe o aviso (webhook) com a nota autorizada
   →  guarda PDF (DANFE) + XML, marca o pedido como "NF emitida"
   →  (opcional) manda a chave da NF pro Melhor Envio gerar a etiqueta
```

A emissão é **assíncrona**: você envia e em segundos recebe o resultado por
**webhook** (recomendado) ou consultando o status.

---

## 2. ⚠️ ANTES do código: a "receita fiscal" do contador

A Focus **transmite** a nota, mas **quem define os impostos é o seu contador**.
Peça a ele estes valores (uma vez só; depois fica fixo na configuração):

| Item | O que é | Exemplo |
|---|---|---|
| **Regime tributário** | Simples Nacional, Lucro Presumido... | Simples Nacional (`1`) |
| **CSOSN** (ou CST) | Situação tributária do ICMS | `102` (Simples, sem crédito) |
| **CFOP venda no MESMO estado** | Código da operação | `5102` |
| **CFOP venda para OUTRO estado** | Código da operação interestadual | `6102` |
| **Origem da mercadoria** | Nacional / importada | `0` (nacional) |
| **Natureza da operação** | Texto da nota | `Venda de mercadoria` |
| **PIS/COFINS** | CST de PIS/COFINS (se aplicável) | normalmente `49`/`99` no Simples |
| **CEST / ICMS-ST** | Se algum produto tem substituição tributária | perguntar por NCM |

> 💡 Vendas **B2B para outro estado** podem ter regras extras (DIFAL, ICMS-ST).
> Confirme com o contador se algum dos seus NCMs tem ST. O código abaixo já
> separa CFOP por "mesmo estado" vs "outro estado".

Você **já tem o NCM** de cada produto no catálogo do site — isso adianta muito.

---

## 3. Setup na Focus NFe (uma vez)

1. Crie a conta em **https://focusnfe.com.br** (tem ambiente de testes grátis —
   "homologação").
2. No painel, **cadastre a empresa** (CNPJ, Inscrição Estadual, endereço,
   regime tributário). Esses dados do **emitente** ficam salvos lá — você
   **não precisa reenviar** a cada nota.
3. **Faça upload do Certificado A1** (`.pfx`/`.p12`) e informe a senha.
4. Pegue os **dois tokens** (menu *Painel → Tokens*):
   - Token de **homologação** (testes — não vale como nota real)
   - Token de **produção** (emite nota de verdade)
5. Cadastre a **URL de webhook** (ver seção 6) para receber o status das notas.

### Ambientes / URLs

| Ambiente | Base URL |
|---|---|
| Testes (homologação) | `https://homologacao.focusnfe.com.br` |
| Produção | `https://api.focusnfe.com.br` |

### Autenticação

HTTP **Basic Auth**: o **token entra como usuário** e a **senha fica vazia**.

```
Authorization: Basic base64("<TOKEN>:")
```

---

## 4. Variáveis de ambiente (no GrapeOne / Railway)

```
FOCUS_NFE_TOKEN=seu_token_aqui
FOCUS_NFE_BASE_URL=https://homologacao.focusnfe.com.br   # troca p/ api.focusnfe.com.br no go-live
CNPJ_EMITENTE=00000000000000                              # seu CNPJ (só números)

# Receita fiscal (do contador) — facilita trocar sem mexer no código
FISCAL_NATUREZA_OPERACAO=Venda de mercadoria
FISCAL_REGIME_TRIBUTARIO=1        # 1 = Simples Nacional
FISCAL_CSOSN=102
FISCAL_CFOP_INTERNO=5102          # venda no mesmo estado (UF do emitente)
FISCAL_CFOP_INTERESTADUAL=6102    # venda para outro estado
FISCAL_ICMS_ORIGEM=0
UF_EMITENTE=SP                    # estado da sua empresa
```

---

## 5. Código — emitir, consultar e cancelar

Exemplo em **Node.js** (adapte à linguagem do GrapeOne — a lógica é idêntica).
Use o **ID do pedido como `ref`** — isso garante **idempotência** (não emite a
mesma nota duas vezes) e facilita consultar depois.

```js
// focus-nfe.js — cliente da Focus NFe para o GrapeOne

const BASE = process.env.FOCUS_NFE_BASE_URL
const TOKEN = process.env.FOCUS_NFE_TOKEN

function authHeader() {
  // token como usuário, senha vazia
  const basic = Buffer.from(`${TOKEN}:`).toString('base64')
  return `Basic ${basic}`
}

// Monta o corpo da NF-e a partir de um pedido do GrapeOne.
// `pedido` é o objeto que o GrapeOne já tem (cliente, endereço, itens...).
function montarNFe(pedido) {
  const cliente = pedido.cliente
  const docCliente = (cliente.documento || '').replace(/\D/g, '')
  const ehCNPJ = docCliente.length === 14

  // CFOP muda conforme a venda é no mesmo estado ou para outro
  const mesmoEstado = (pedido.endereco.estado || '').toUpperCase() === process.env.UF_EMITENTE
  const cfop = mesmoEstado ? process.env.FISCAL_CFOP_INTERNO : process.env.FISCAL_CFOP_INTERESTADUAL

  const items = pedido.itens.map((item, i) => ({
    numero_item: i + 1,
    codigo_produto: item.sku,
    descricao: item.descricao,
    cfop,
    unidade_comercial: 'UN',
    quantidade_comercial: item.quantidade,
    valor_unitario_comercial: item.preco_unitario,
    valor_bruto: round2(item.quantidade * item.preco_unitario),
    unidade_tributavel: 'UN',
    quantidade_tributavel: item.quantidade,
    valor_unitario_tributavel: item.preco_unitario,
    ncm: item.ncm,                                  // já vem do catálogo do site
    icms_origem: Number(process.env.FISCAL_ICMS_ORIGEM),
    icms_situacao_tributaria: process.env.FISCAL_CSOSN,  // CSOSN (Simples)
  }))

  const corpo = {
    natureza_operacao: process.env.FISCAL_NATUREZA_OPERACAO,
    data_emissao: pedido.data_emissao,             // ISO, ex: 2026-06-18T10:00:00-03:00
    tipo_documento: 1,                             // 1 = saída
    finalidade_emissao: 1,                         // 1 = normal
    cnpj_emitente: process.env.CNPJ_EMITENTE,      // resto do emitente vem do painel

    // Destinatário (o cliente)
    nome_destinatario: cliente.nome,
    telefone_destinatario: (cliente.telefone || '').replace(/\D/g, '') || undefined,
    logradouro_destinatario: pedido.endereco.rua,
    numero_destinatario: pedido.endereco.numero,
    complemento_destinatario: pedido.endereco.complemento || undefined,
    bairro_destinatario: pedido.endereco.bairro,
    municipio_destinatario: pedido.endereco.cidade,
    uf_destinatario: pedido.endereco.estado,
    cep_destinatario: (pedido.endereco.cep || '').replace(/\D/g, ''),
    indicador_inscricao_estadual_destinatario: 9,  // 9 = não contribuinte (ajuste se cliente tiver IE)

    valor_frete: pedido.frete || 0,
    modalidade_frete: pedido.frete > 0 ? 0 : 9,    // 0 = por conta do emitente, 9 = sem frete
    items,
  }

  if (ehCNPJ) corpo.cnpj_destinatario = docCliente
  else corpo.cpf_destinatario = docCliente

  return corpo
}

// 1) EMITIR — POST /v2/nfe?ref=<id do pedido>
async function emitirNFe(pedido) {
  const ref = pedido.id
  const resp = await fetch(`${BASE}/v2/nfe?ref=${encodeURIComponent(ref)}`, {
    method: 'POST',
    headers: { Authorization: authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(montarNFe(pedido)),
  })
  const data = await resp.json()
  // status típico inicial: "processando_autorizacao"
  // o resultado final chega pelo webhook (seção 6) ou consultando (abaixo)
  return { httpStatus: resp.status, ...data }
}

// 2) CONSULTAR — GET /v2/nfe/<ref>  (use se não quiser depender só do webhook)
async function consultarNFe(ref) {
  const resp = await fetch(`${BASE}/v2/nfe/${encodeURIComponent(ref)}`, {
    headers: { Authorization: authHeader() },
  })
  return resp.json()
  // quando "autorizado": vem caminho_danfe (PDF), caminho_xml_nota_fiscal, numero, serie, chave_nfe
}

// 3) CANCELAR — DELETE /v2/nfe/<ref>
async function cancelarNFe(ref, justificativa) {
  const resp = await fetch(`${BASE}/v2/nfe/${encodeURIComponent(ref)}`, {
    method: 'DELETE',
    headers: { Authorization: authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ justificativa }),  // mínimo 15 caracteres
  })
  return resp.json()
}

function round2(n) { return Math.round(n * 100) / 100 }

module.exports = { emitirNFe, consultarNFe, cancelarNFe }
```

### Botão "Emitir NF" (rota no GrapeOne)

```js
// POST /pedidos/:id/emitir-nf   (chamado pelo botão na tela)
app.post('/pedidos/:id/emitir-nf', async (req, res) => {
  const pedido = await carregarPedido(req.params.id)   // já tem cliente, endereço, itens
  const r = await emitirNFe(pedido)

  if (r.httpStatus >= 400) {
    return res.status(400).json({ erro: r.mensagem || r.erros || 'Falha ao emitir' })
  }
  // guarda o ref/status; o webhook completa com PDF/XML quando autorizar
  await salvarStatusNF(pedido.id, { status: r.status })
  res.json({ ok: true, status: r.status })
})
```

---

## 6. Webhook — receber a nota autorizada automaticamente

Cadastre no painel da Focus uma URL do GrapeOne (ex.:
`https://SEU-APP.up.railway.app/webhooks/focus-nfe`). A Focus faz um **POST**
nessa URL quando a nota muda de status.

```js
// POST /webhooks/focus-nfe
app.post('/webhooks/focus-nfe', async (req, res) => {
  const { ref, status, caminho_danfe, caminho_xml_nota_fiscal, chave_nfe, numero } = req.body

  if (status === 'autorizado') {
    await salvarStatusNF(ref, {
      status: 'autorizado',
      numero,
      chave: chave_nfe,
      pdf_url: `${process.env.FOCUS_NFE_BASE_URL}${caminho_danfe}`,
      xml_url: `${process.env.FOCUS_NFE_BASE_URL}${caminho_xml_nota_fiscal}`,
    })
    // aqui você pode: enviar o PDF/XML ao cliente por e-mail,
    // e mandar a `chave_nfe` para o Melhor Envio gerar a etiqueta.
  } else if (status === 'erro_autorizacao') {
    await salvarStatusNF(ref, { status: 'erro', motivo: req.body.mensagem_sefaz })
  }

  res.sendStatus(200)  // sempre responda 200 pra Focus não reenviar
})
```

> Se você usar Cloudflare na frente do GrapeOne, **isente essa URL de webhook**
> de qualquer "Bot Fight Mode" — senão a Focus toma 403 (foi o que aconteceu com
> o webhook do Pagar.me no site, ver memória do projeto).

---

## 7. Ligando com o Melhor Envio (etiqueta de frete)

A NF e a etiqueta são passos **separados e nesta ordem**:

```
1. Emitir NF (Focus)  →  recebe `chave_nfe`
2. Criar envio no Melhor Envio passando a `chave_nfe` da nota
3. Gerar e imprimir a etiqueta
```

O Melhor Envio **não emite nota** — ele só precisa da **chave da NF-e** já
autorizada pra montar a etiqueta quando você envia como CNPJ. A Focus inclusive
tem integração direta com o Melhor Envio, então dá pra encadear tudo no mesmo
fluxo do GrapeOne.

---

## 8. Roteiro de testes (homologação primeiro!)

1. Use o **token de homologação** e `FOCUS_NFE_BASE_URL=https://homologacao...`.
2. Emita uma nota de teste com um pedido real do GrapeOne.
3. Confira no painel da Focus: status `autorizado`, baixe a DANFE de teste.
4. Ajuste CFOP/CSOSN com o contador até a nota sair limpa.
5. Só então troque para o **token de produção** + `api.focusnfe.com.br`.

> ⚠️ Notas de **homologação não têm valor fiscal** (saem com a frase "SEM VALOR
> FISCAL"). É o ambiente certo pra errar à vontade.
