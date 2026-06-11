# Grape Tools B2B — Supabase Integration Pack

## Arquivos neste pacote

```
/
├── middleware.ts                    ← Raiz do projeto (protege rotas)
├── lib/
│   └── supabase-server.ts          ← Cliente SSR para Server Components
├── hooks/
│   └── useAuth.ts                   ← Hook de auth para Client Components
├── components/
│   ├── AuthButton.tsx               ← Botão Entrar / menu logado
│   └── AuthButton.css               ← CSS do AuthButton
├── app/
│   └── cliente/
│       ├── page.tsx                 ← Página /cliente (área do usuário)
│       └── cliente.css              ← CSS da página /cliente
└── sql/
    └── 001_schema.sql               ← Tabelas + RLS + Triggers
```

---

## Passo a passo de instalação

### 1. SQL no Supabase

1. Acesse `https://supabase.com/dashboard/project/mkfhrdhojfznpwgygfms`
2. Menu lateral → **SQL Editor** → **New Query**
3. Cole o conteúdo de `sql/001_schema.sql` e clique **Run**
4. Deve aparecer "Success. No rows returned" (sem erros)

### 2. Google OAuth (opcional mas recomendado)

1. **Google Cloud Console**: `https://console.cloud.google.com`
   - Novo projeto ou projeto existente
   - APIs & Services → Credentials → Create OAuth 2.0 Client ID
   - Application type: **Web application**
   - Authorized redirect URI: `https://mkfhrdhojfznpwgygfms.supabase.co/auth/v1/callback`
   - Copie Client ID e Client Secret

2. **Supabase Dashboard**:
   - Authentication → Providers → Google → Enable
   - Cole Client ID e Secret
   - Save

3. **URL de redirecionamento local**: adicione também `http://localhost:3000` em
   Authentication → URL Configuration → Site URL

### 3. Copiar os arquivos

```bash
# Na raiz do grapetoolsb2b/
cp middleware.ts ./middleware.ts
cp lib/supabase-server.ts ./lib/supabase-server.ts
cp hooks/useAuth.ts ./hooks/useAuth.ts
cp components/AuthButton.tsx ./components/AuthButton.tsx
cp app/cliente/page.tsx ./app/cliente/page.tsx
```

### 4. Adicionar CSS ao globals.css

Copie o conteúdo de `components/AuthButton.css` e `app/cliente/cliente.css`
para o final do seu `app/globals.css`.

### 5. Integrar AuthButton no Header

```tsx
// No seu Header.tsx, substitua o botão estático de login:

// ANTES (estático):
<button className="headerLoginBtn">Entrar</button>

// DEPOIS (com auth real):
import AuthButton from '@/components/AuthButton'
// ...
<AuthButton />
```

---

## Como o fluxo funciona

```
Usuário acessa /cliente
       ↓
middleware.ts verifica sessão (cookie)
       ↓ sem sessão
Redireciona para /login?redirect=/cliente
       ↓ faz login
supabase.auth.signInWithPassword()
       ↓ sucesso
Redireciona para /cliente
       ↓
Profile carregado do banco
       ↓
Página exibida com dados do usuário
```

## Rotas protegidas pelo middleware

Edite `middleware.ts` para adicionar/remover:
```ts
const ROTAS_PROTEGIDAS = ['/cliente', '/carrinho/checkout', '/pedidos']
```

## Próximos passos

- [ ] Carrinho persistido no banco (`carrinhos` table já criada)
- [ ] Página `/pedidos` com histórico
- [ ] Checkout funcional conectado a `pedidos` + `pedido_itens`
- [ ] Página `/cliente/perfil` para editar dados (CNPJ, telefone, endereço)
- [ ] Hook `useCart` que usa Supabase quando logado, localStorage quando não
