# Agenda

Agenda para clínicas e profissionais de saúde. O objetivo principal: **a secretária nunca consegue marcar dois pacientes no mesmo horário do mesmo profissional**, nem por engano, nem com duas pessoas clicando ao mesmo tempo.

> Nome provisório. Para trocar, edite `src/config/app.ts`.
> A versão antiga (MentaliQ, Express + MongoDB) está na branch `legacy`.

## Stack

- React 19 + Vite + TypeScript
- Tailwind CSS v4, componentes próprios no estilo shadcn/ui
- React Router, TanStack Query, React Hook Form + Zod
- Supabase (Postgres, Auth, RLS) rodando localmente com a Supabase CLI

## Como rodar

Pré-requisitos: Node 22+ e Docker Desktop aberto.

```bash
npm install
npm run db:start          # sobe o Supabase local (a primeira vez baixa as imagens)
npm run db:status         # mostra a URL e a publishable key
cp .env.example .env.local
# cole a URL e a publishable key no .env.local
npm run dev               # http://localhost:5173
```

E-mails do Supabase local (recuperar senha, confirmação) caem no Mailpit: `http://127.0.0.1:54324`.

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Checa tipos e gera a versão de produção |
| `npm run lint` | Lint com oxlint |
| `npm run db:start` / `db:stop` | Liga e desliga o Supabase local |

## Estrutura

```
src/
  app/              rotas
  components/       ui/ (botão, campo, alerta) e layout/ (menu, páginas base)
  config/           nome do app
  features/
    auth/           login, cadastro, recuperar e redefinir senha
    calendar/       agenda do dia
  lib/              cliente do Supabase e utilitários
supabase/           config e migrations do banco
docs/               uma nota por sprint
```

## Andamento

Veja `docs/` — cada sprint tem uma nota com o que foi feito e como testar.
