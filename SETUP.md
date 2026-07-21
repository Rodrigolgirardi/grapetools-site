# 💻 Rodar o site em um novo computador (notebook, PC novo…)

Guia pra deixar o site funcionando numa máquina nova **igual ao PC do escritório**.
Stack: **Next.js 15** + **React 19** + **Supabase** + **Pagar.me**. Requer **Node.js 22**.

> Já tem tudo instalado e só quer ligar? Pule pro passo 4.

---

## 1. Instalar os programas (uma vez só)

| Programa | Pra quê | Onde pegar |
|---|---|---|
| **Node.js 22 LTS** | roda o site (o projeto exige a versão `22.x`) | https://nodejs.org |
| **Git** | baixar/enviar o código | https://git-scm.com |
| **VS Code** | editar o código | https://code.visualstudio.com |
| **GitHub Desktop** (opcional) | baixar/enviar sem digitar comandos | https://desktop.github.com |

Confira a versão do Node depois de instalar (Prompt de Comando / PowerShell):

```
node -v      # tem que mostrar v22.x
```

---

## 2. Baixar o código

```
git clone https://github.com/Rodrigolgirardi/grapetools-site.git C:\Projetos\grapetools-site
```

Ou pelo **GitHub Desktop**: *File → Clone repository → grapetools-site*.

---

## 3. ⚠️ O arquivo de chaves `.env.local` (passo mais importante)

O site precisa de chaves secretas (Supabase, Pagar.me, admin…). Elas ficam num
arquivo **`.env.local`** que, **de propósito, NÃO vai pro Git** — então o
`git clone` **não traz** ele. Sem esse arquivo, o site abre mas login,
pagamento e `/admin` não funcionam.

**Como criar:**

1. Na pasta do projeto, copie o modelo `.env.example` para `.env.local`.
2. Preencha os valores reais. Pegue-os de:
   - a cópia guardada no seu **gerenciador de senhas** (recomendado no guia de saúde), **ou**
   - o `.env.local` do **PC do escritório** (copie por pendrive / Drive privado — **nunca** por WhatsApp/email aberto, e **nunca** suba pro Git).
3. Salve.

Os campos e onde achar cada chave estão comentados dentro do próprio `.env.example`.

---

## 4. Ligar o site

Na pasta do projeto:

```
npm install      # só na primeira vez — instala as dependências (uns minutos)
npm run dev      # liga o servidor local
```

Abra no navegador: **http://localhost:3000**

Do jeito fácil: **duplo-clique no `dev.bat`** (funciona em qualquer pasta).

> O `iniciar-dev.bat` tem o caminho `C:\Projetos\grapetools-site` fixo lá dentro.
> Se você clonar em outro lugar, use o `dev.bat` (ele se acha sozinho) ou edite esse caminho.

---

## 5. Enviar suas mudanças (publicar)

Depois de editar e testar no localhost:

```
git add -A
git commit -m "descrição do que mudou"
git push
```

Ou o botão **Push** no GitHub Desktop. O deploy (Vercel/Netlify) publica sozinho.

> Na primeira vez que enviar, o GitHub vai pedir login da sua conta.

---

## Comandos do dia a dia

| Quero… | Comando |
|---|---|
| Ligar o site pra trabalhar | `npm run dev` (ou `dev.bat`) |
| Testar como fica em produção | `npm run build` e depois `npm run start` |
| Ver se tem erro de código | `npm run typecheck` |
| Rodar os testes | `npm test` |
| Ver pacotes desatualizados | `npm outdated` |

---

## Problemas comuns

- **Mudei o `.env.local` e nada mudou** → reinicie o servidor (feche e abra o `dev.bat`). Variáveis só recarregam ao reiniciar.
- **Erro `__webpack_modules__ is not a function`** → cache do Next corrompido: pare o servidor, apague a pasta `.next` e rode `npm run dev` de novo. (Não rode `npm run build` com o `dev` aberto ao mesmo tempo.)
- **Node na versão errada** → o projeto exige a `22.x`. Rode `node -v` pra conferir.

Mais detalhes de operação em [`docs/Saude-do-Site.md`](docs/Saude-do-Site.md).
