# API do Site Grape Tools → integração com o Grape One

Documentação da API de leitura (modo **PULL**) que o Grape One usa para puxar
dados do site (pedidos, clientes, financeiro, produtos, estoque).

> **Base URL**
> - Produção: `https://grapetools.com.br`
> - Local (dev): `http://localhost:3000`

---

## Autenticação

Todas as rotas exigem o cabeçalho **`x-api-key`** com a chave secreta.

```
x-api-key: <ERP_API_KEY>
```

- A chave fica na variável de ambiente **`ERP_API_KEY`** do site (no `.env.local` em dev; no painel do host em produção).
- Sem o cabeçalho, ou com chave errada → **HTTP 401**.
- ⚠️ A chave é secreta: não publique em repositório público nem no frontend.

---

## 1. Pedidos — `GET /api/erp/orders`

Lista os pedidos do site.

### Filtros (query string, opcionais)

| Filtro       | Exemplo                  | Descrição                                              |
|--------------|--------------------------|--------------------------------------------------------|
| `desde`      | `?desde=2026-06-01`      | pedidos criados a partir desta data (ISO `YYYY-MM-DD`) |
| `pago`       | `?pago=true`             | `true` = só pagos · `false` = só não-pagos             |
| `pagamento`  | `?pagamento=pago`        | filtra por `pagamento_status` exato                    |
| `status`     | `?status=enviado`        | filtra por status de entrega                           |
| `limite`     | `?limite=50`             | máximo de pedidos (padrão 100, teto 500)               |

**Para faturamento real, use `?pago=true`** (só pedidos efetivamente pagos).

### Resposta

```json
{
  "source": "grape-tools-b2b",
  "integration": "erp.orders",
  "total_pedidos": 1,
  "data": [
    {
      "id": "4110f4f5-e47c-4dd6-a820-353971020961",
      "status": "pendente",
      "pagamento_status": "nao_pago",
      "pago": false,
      "pago_em": null,
      "total": 5.6,
      "forma_pagamento": "pix",
      "observacao": null,
      "criado_em": "2026-06-11T20:31:46.827609+00:00",
      "atualizado_em": "2026-06-11T20:31:46.827609+00:00",
      "pagarme_order_id": null,
      "cliente": {
        "nome": "Rodrigo Lamim Girardi",
        "email": "rodrigolgirardi@outlook.com",
        "cnpj": "496.007.148-60",
        "telefone": "(11) 93932-7880"
      },
      "itens": [
        {
          "sku": "CH.CONEC.DUP.TS",
          "descricao": "Conector Duplo Curto — Transparente",
          "quantidade": 5,
          "preco_unitario": 1.12,
          "subtotal": 5.6
        }
      ]
    }
  ]
}
```

### Campos

| Campo                | Tipo            | Descrição |
|----------------------|-----------------|-----------|
| `id`                 | string (UUID)   | ID único do pedido |
| `status`             | string          | Entrega: `pendente`, `confirmado`, `em_separacao`, `enviado`, `entregue`, `cancelado` |
| `pagamento_status`   | string          | Pagamento: `nao_pago`, `pago`, `estornado`, `falhou` |
| `pago`               | boolean         | Atalho — o pagamento foi confirmado? |
| `pago_em`            | string \| null  | Data/hora do pagamento (ISO 8601) ou `null` |
| `total`              | number          | Valor total do pedido (R$) |
| `forma_pagamento`    | string          | `pix`, `boleto` ou `transferencia` |
| `observacao`         | string \| null  | Observação do cliente |
| `criado_em`          | string          | Data de criação (ISO 8601, UTC) |
| `atualizado_em`      | string          | Última atualização (ISO 8601, UTC) |
| `pagarme_order_id`   | string \| null  | ID da cobrança no Pagar.me |
| `cliente`            | object \| null  | `{ nome, email, cnpj, telefone }` |
| `itens`              | array           | `{ sku, descricao, quantidade, preco_unitario, subtotal }` |

---

## 2. Clientes — `GET /api/erp/customers`

Lista os clientes com resumo de compras.

**Filtros:** `?busca=texto` (nome/email/CNPJ), `?limite=200` (teto 1000).

```json
{
  "source": "grape-tools-b2b",
  "integration": "erp.customers",
  "total_clientes": 1,
  "data": [
    {
      "id": "33221ea6-...",
      "nome": "Rodrigo Lamim Girardi",
      "email": "rodrigolgirardi@outlook.com",
      "cnpj": "496.007.148-60",
      "telefone": "(11) 93932-7880",
      "endereco": { "cep": "04678-002", "rua": "...", "cidade": "São Paulo", "estado": "SP" },
      "cadastrado_em": "2026-06-10T14:12:08.638636+00:00",
      "compras": {
        "total_pedidos": 11,
        "total_pago": 0,
        "total_em_aberto": 327.78,
        "ultimo_pedido": "2026-06-11T20:31:46.827609+00:00"
      }
    }
  ]
}
```

---

## 3. Financeiro — `GET /api/erp/finance`

Resumo financeiro. Faturamento = **só pedidos pagos**.

**Filtros:** `?desde=2026-06-01`, `?ate=2026-06-30`.

```json
{
  "source": "grape-tools-b2b",
  "integration": "erp.finance",
  "periodo": { "desde": null, "ate": null },
  "resumo": {
    "faturamento_pago": 0,
    "valor_em_aberto": 327.78,
    "pedidos_pagos": 0,
    "pedidos_em_aberto": 11,
    "ticket_medio_pago": 0
  },
  "por_forma_pagamento": {},
  "por_mes": { "2026-06": { "pago": 0, "em_aberto": 327.78 } }
}
```

---

## 4. Produtos — `GET /api/erp/products`

Catálogo com variações e tabela de preço por quantidade.
**Filtros:** `?categoria=Abrasivos`, `?busca=disco`, `?limite=500`.

## 5. Estoque — `GET /api/erp/stock`

Uma linha por SKU. **Filtros:** `?baixo=true`, `?limite_baixo=10`.

## 6. Canais — `GET /api/erp/marketplace`

Status dos canais de venda (hoje só B2B integrado).

---

## Erros

| HTTP | Quando |
|------|--------|
| 401  | Cabeçalho `x-api-key` ausente ou inválido |
| 500  | Erro interno (ver corpo `{ "error": "..." }`) |

---

## Estratégia de sincronização recomendada

O Grape One deve **puxar periodicamente** (ex.: a cada 5–15 min):

```
GET /api/erp/orders?desde=<data-da-ultima-sincronizacao>
```

- Guarde a data/hora da última sincronização e use em `desde` na próxima.
- Para conciliação financeira, filtre `?pago=true`.
- Use o campo `id` para evitar duplicar pedidos já importados (upsert por `id`).

---

## Exemplo de consumo — Node.js

```js
// Node 18+ (fetch nativo)
const BASE = "https://grapetools.com.br";
const API_KEY = process.env.GRAPETOOLS_API_KEY; // guarde em variável de ambiente

async function listarPedidos({ desde, pago } = {}) {
  const params = new URLSearchParams();
  if (desde) params.set("desde", desde);
  if (pago != null) params.set("pago", String(pago));

  const res = await fetch(`${BASE}/api/erp/orders?${params}`, {
    headers: { "x-api-key": API_KEY },
  });

  if (!res.ok) {
    throw new Error(`Falha ao buscar pedidos: HTTP ${res.status}`);
  }
  const json = await res.json();
  return json.data; // array de pedidos
}

// Uso: pedidos pagos desde 1º de junho
const pedidos = await listarPedidos({ desde: "2026-06-01", pago: true });
for (const p of pedidos) {
  console.log(p.id, p.total, p.pagamento_status, p.itens.length, "itens");
}
```

---

## Exemplo de consumo — PHP

```php
<?php
$BASE    = "https://grapetools.com.br";
$API_KEY = getenv("GRAPETOOLS_API_KEY"); // guarde em variável de ambiente

function listarPedidos($desde = null, $pago = null) {
    global $BASE, $API_KEY;
    $params = [];
    if ($desde !== null) $params["desde"] = $desde;
    if ($pago  !== null) $params["pago"]  = $pago ? "true" : "false";
    $url = $BASE . "/api/erp/orders?" . http_build_query($params);

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER     => ["x-api-key: " . $API_KEY],
    ]);
    $body = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($code !== 200) {
        throw new Exception("Falha ao buscar pedidos: HTTP $code");
    }
    $json = json_decode($body, true);
    return $json["data"]; // array de pedidos
}

// Uso: pedidos pagos desde 1º de junho
$pedidos = listarPedidos("2026-06-01", true);
foreach ($pedidos as $p) {
    echo $p["id"] . " - R$ " . $p["total"] . " - " . $p["pagamento_status"] . "\n";
}
```

---

*Gerado para a integração Grape Tools (site) → Grape One (SaaS).*
