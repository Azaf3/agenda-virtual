# AgendaMental — Funcionalidades e Status Atual

Este documento descreve as funcionalidades disponíveis e o status atual do sistema.

## Funcionalidades atuais (validadas)

- Autenticação (JWT): Login e registro de usuários com papel de `psychologist`.
- Rotas protegidas: acesso ao app após login (Dashboard, Pacientes, etc.).
- Gestão de Pacientes (sem login por paciente):
  - Listagem com busca por nome e contagem total.
  - Criação/edição de ficha sem senha (foco em dados clínicos do paciente).
  - Exclusão individual e seleção múltipla com exclusão em lote.
  - Atualização imediata na UI (otimista) e sincronização silenciosa com o servidor.
  - Isolamento por profissional: cada psicólogo vê apenas seus pacientes.

# Pronto e está funcionando

- Modelo `Patient` desacoplado de `User` (propriedade `psychologist`).
- Endpoints REST para pacientes sob `/api/patients` com soft delete (`isActive`).
- Controle de acesso: `protect` + `authorize('psychologist')` em todas as rotas de pacientes.
- Frontend integrado aos endpoints de pacientes, incluindo exclusão em lote.
- Interceptor Axios com injeção de token e redirecionamento em `401`.

## Endpoints principais

- Autenticação
  - `POST /api/auth/register` — registra usuário (psicólogo).
  - `POST /api/auth/login` — autentica e retorna token.
  - `GET /api/auth/me` — dados do usuário logado.

- Pacientes (todas privadas e restritas a `psychologist`)
  - `GET /api/patients` — lista pacientes do psicólogo logado.
  - `GET /api/patients/:id` — detalhes de um paciente.
  - `POST /api/patients` — cria paciente.
  - `PUT /api/patients/:id` — atualiza paciente.
  - `DELETE /api/patients/:id` — remove paciente (soft delete).
  - `POST /api/patients/bulk-delete` — remove vários pacientes (soft delete).

Observação: a tela de Agenda existe no código, mas ainda não está documentada como funcional. Esta documentação foca no módulo de Pacientes validado no ambiente de desenvolvimento.

## Como executar (Windows/Pwsh)

Backend (porta `5000`):

```powershell
cd "c:\Users\AZAFE\Desktop\Area de Trablho\agenda-virtual"
npm install
npm start
```

Frontend (porta padrão `5173`):

```powershell
cd "c:\Users\AZAFE\Desktop\Area de Trablho\agenda-virtual\frontend"
npm install
npm run dev
```

- API base usada no frontend: `http://localhost:5000/api`.
- A porta do Vite aparece no terminal ao iniciar (`5173` por padrão).

## Fluxo básico de uso

1) Registrar um usuário (psicólogo) e fazer login.
2) Acessar Pacientes, criar fichas (sem senha para pacientes).
3) Usar busca, editar dados, excluir individualmente.
4) Ativar seleção múltipla e usar exclusão em lote quando necessário.

Campos usuais nas fichas de pacientes (UI):
- Obrigatórios: Nome, Telefone.
- Opcionais: E-mail, Data de Nascimento, Contato de Emergência, Histórico/Notas.

Observação: no backend há soft delete; itens removidos não aparecem mais na listagem.

## Segurança

- JWT em todas as chamadas via interceptor Axios.
- Limpeza de token e redirecionamento automático em `401`.
- Isolamento por usuário: consultas sempre filtram pelo psicólogo logado.

## Em progresso / próximos passos

- “Selecionar todos / limpar seleção” na lista de pacientes.
- Visual detalhado da ficha com histórico agregado.
- Máscaras/validações adicionais (telefone, data, e-mail).
- Exportação de dados (CSV/PDF) e relatórios.
- Evolução da Agenda (tela já existe; integração funcional será documentada quando estabilizada).

## Dicas rápidas (troubleshooting)

- Se não carregar: verifique se o backend (5000) está ativo e o token válido.
- Em `401`: faça login novamente; o app limpa token e redireciona.
- Ao excluir em lote: confirme que os itens foram desmarcados após sucesso.

## FAQ

- Não vejo meus pacientes: verifique se o backend está rodando em `http://localhost:5000` e se o token está presente (faça login novamente se necessário).
- Recebo 401 ao navegar: o interceptor remove o token expirado e redireciona para `/login`; basta autenticar novamente.
- Criei um paciente e ele “sumiu”: confirme se havia texto no campo de busca; a tela limpa filtros após salvar, mas se a busca estiver ativa pode ocultar itens.
- Exclusão em lote não removeu todos: é soft delete por `isActive=false`; se algum já estava inativo, o `modifiedCount` pode ser menor que a seleção.
- Qual a URL base do frontend para a API? `http://localhost:5000/api` (configurada em `frontend/src/services/api.js`).
- Porta do Vite: normalmente `5173`; ao iniciar o dev server a porta aparece no terminal.

## Changelog (resumo)

- 2025-11-13: Documentação revisada (estado atual claro), inclusão de FAQ e Changelog.
- 2025-11-12: Exclusão em lote de pacientes e correção da ordem de rotas (`/bulk-delete` antes de `/:id`).
- 2025-11-12: UI otimista com sincronização silenciosa e limpeza de filtros após salvar na tela de Pacientes.
- 2025-11-11: Módulo de Pacientes desacoplado de Usuários, rotas `/api/patients` com soft delete e autorização por papel.
- 2025-11-10: Registro criando usuários como `psychologist` por padrão; acesso às rotas protegidas.

