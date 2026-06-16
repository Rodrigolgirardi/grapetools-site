# 🩺 Guia de Saúde do Site — Grape Tools

Guia prático para operar o site com segurança sozinho.
Stack: **Next.js** (site) + **Supabase** (banco/login) + **Pagar.me** (pagamento), publicado na **Vercel/Netlify**.

---

## ✅ Rotina de checagem

### Toda semana (5 min)
- [ ] Abrir o site publicado e navegar: home → um produto → adicionar ao carrinho → checkout (sem finalizar). Tudo carrega?
- [ ] Conferir se chegaram **pedidos novos** (no Supabase ou no Grape One).
- [ ] Olhar se alguma **foto** sumiu em algum produto.

### Todo mês (15 min)
- [ ] Confirmar que os **pagamentos pagos** estão batendo (Pagar.me × pedidos marcados como `pago`).
- [ ] Fazer/baixar um **backup do banco** (ver seção Backups).
- [ ] Ver se há **atualizações de segurança** pendentes (ver seção Segurança).
- [ ] Conferir o **uso** no painel da Supabase e da Vercel (se está perto de algum limite do plano).

---

## 💾 Backups (o mais importante)

Se um dia algo der muito errado, backup é o que te salva. Você tem **3 coisas** pra proteger:

1. **Banco de dados (pedidos, clientes)** — o que mais importa
   - Supabase → projeto `mkfhrdhojfznpwgygfms` → **Database → Backups** (o plano pago faz diário automático).
   - Manual: **Table Editor** → cada tabela (`pedidos`, `pedido_itens`, `profiles`) → exportar CSV. Guarde num lugar seguro (Google Drive, etc.).

2. **Código do site**
   - Já está versionado no **Git**. Garanta que está enviado pro **GitHub** (não só no seu PC). Assim, se o computador queimar, o site não se perde.

3. **Fotos dos produtos e arquivos de configuração**
   - A pasta `public/products` (todas as fotos).
   - O arquivo **`.env.local`** (tem as chaves secretas). **Nunca** vai pro Git — guarde uma cópia num lugar seguro e privado (gerenciador de senhas).

> Regra de ouro: um backup que está só no mesmo PC do site **não é backup**. Tenha uma cópia em outro lugar.

---

## 📡 Monitoramento

- **Site fora do ar?** Crie um monitor grátis no **UptimeRobot** (uptimerobot.com) apontando pra `https://grapetools.com.br`. Ele te avisa por email se o site cair.
- **Erros / logs:** o painel da **Vercel/Netlify** mostra os logs e erros das páginas e da API.
- **Pagamentos:** o painel do **Pagar.me** mostra cada cobrança e seu status.

---

## 🔧 Problemas comuns e como resolver

### 1. "Subi uma foto e não aparece"
- O nome do arquivo precisa bater com o SKU. O site aceita **ponto OU hífen** (ex: `CH-FEC-MAGNET.png` ou `CH.FEC.MAGNET.png`) e `.png`/`.jpg`/`.jpeg`.
- Atualize a página com **Ctrl+Shift+R** (força recarregar).

### 2. Erro `__webpack_modules__... is not a function` (no localhost)
- É o cache do Next.js corrompido. Receita:
  1. Feche a janela do servidor (Ctrl+C)
  2. Apague a pasta `.next`: no PowerShell → `Remove-Item -Recurse -Force .next`
  3. Rode `npm run dev` de novo
- **Causa comum:** rodar `npm run build` com o `npm run dev` aberto ao mesmo tempo. Evite.

### 3. "Mudei uma chave/configuração e não fez efeito"
- Mexeu no **`.env.local`**? Precisa **reiniciar o servidor** (fechar e abrir o `dev.bat`). Variáveis de ambiente só recarregam ao reiniciar.

### 4. O site não publica / build falha
- Rode `npm run build` localmente e leia o erro. Geralmente é um erro de código apontado com arquivo e linha.
- Em produção, conferir se **todas as variáveis de ambiente** estão cadastradas no host (Supabase, Pagar.me, `ERP_API_KEY`, `ADMIN_EMAILS`, `PAGARME_WEBHOOK_SECRET`).

### 5. Pagamento não marca como "pago" automaticamente
- O **webhook do Pagar.me** precisa estar cadastrado em produção (não funciona em localhost). Ver a checklist de lançamento.

---

## 🔒 Segurança contínua

- **Chaves secretas** (`.env.local`): nunca compartilhe por canais públicos, nunca suba pro Git (já está protegido pelo `.gitignore`).
- **Quem é admin:** controlado pela variável `ADMIN_EMAILS`. Pra dar/remover acesso ao `/admin`, é só editar essa lista (e reiniciar/republicar).
- **Atualizações:** de tempos em tempos rode `npm outdated` pra ver pacotes desatualizados. Atualizações de segurança importam — se tiver dúvida, me chame antes de atualizar tudo de uma vez.
- **Cloudflare** (quando publicar): ativar o modo "Managed Challenge" pra proteção anti-bot equilibrada.

---

## 🚀 Comandos do dia a dia (PowerShell, na pasta do projeto)

| O que quero | Comando |
|-------------|---------|
| Ligar o site pra trabalhar (dev) | `npm run dev` (ou 2 cliques no `dev.bat`) |
| Testar a velocidade real (produção local) | `npm run build` depois `npm run start` |
| Limpar cache quebrado | `Remove-Item -Recurse -Force .next` |
| Ver pacotes desatualizados | `npm outdated` |

> Lembrete: **não** rode `build`/`start` com o `dev` aberto ao mesmo tempo (dá conflito de cache).

---

## 🆘 Quando pedir ajuda

Chame ajuda (a mim ou um dev) quando:
- O site cair e a receita de limpar cache não resolver.
- Um pagamento real der problema.
- For mexer em algo que não entende no banco ou nas chaves.
- For atualizar muitos pacotes de uma vez.

**Antes de pedir ajuda, anote:** o que você fez antes do problema, a mensagem de erro exata (print) e se acontece no localhost ou no site publicado. Isso acelera muito a solução.

---

*Você está operando um site próprio — com rotina simples e backup em dia, dá pra tocar com tranquilidade.*
