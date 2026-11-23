# Sprint 0 — Base do projeto e login

## O que foi feito

- Projeto novo do zero (React + Vite + TypeScript), substituindo o MentaliQ antigo.
- Tema: fundo cinza claro, cor da marca ameixa (`#4f3a66`), fonte Figtree. Tokens em `src/index.css`.
- Componentes base: botão (com estado de carregando), campo com rótulo e erro acessíveis, alerta de formulário.
- Autenticação com Supabase: entrar, criar conta, recuperar senha por e-mail e criar senha nova pelo link.
- Rotas protegidas: sem login, qualquer página manda pra `/entrar` e volta pra página original depois.
- Layout do sistema: menu lateral no computador e menu deslizante no celular, com nome do usuário e botão Sair.
- Agenda do dia: grade de 07h às 20h com navegação entre dias (ainda sem atendimentos).
- Manifest PWA (dá pra instalar pelo navegador).
- CI no GitHub Actions: lint e build a cada push.

## O que está funcionando

- Build e lint passando.
- Validação dos formulários em português, antes de chamar o servidor.
- Erros do Supabase traduzidos (senha errada, e-mail já cadastrado, sem conexão etc.).
- Layout responsivo testado em 1280px e 390px.

## O que depende de algo externo

- Login de verdade precisa do Supabase local rodando (`npm run db:start`, com Docker aberto).

## O que falta (próximas sprints)

- Sprint 1: clínica, equipe (secretária e profissionais) e regras de acesso no banco.
- Sprint 2: profissionais e horários de atendimento.
- Sprint 3: marcar atendimentos com a trava do banco contra horário duplo.

## Como testar

1. Siga o "Como rodar" do README.
2. Abra `http://localhost:5173` — deve cair em `/entrar`.
3. Clique em "Criar conta", tente enviar vazio e veja as mensagens de erro.
4. Crie uma conta válida — deve entrar direto na agenda.
5. Clique em "Sair" e entre de novo com a mesma senha; tente uma senha errada.
6. Em "Esqueci minha senha", peça o link, abra o e-mail no Mailpit (`http://127.0.0.1:54324`), clique e crie uma senha nova.
7. Diminua a janela para tamanho de celular e use o menu ☰.
