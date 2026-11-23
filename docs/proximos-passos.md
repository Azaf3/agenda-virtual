# Próximos passos

Objetivo da v1: **a secretária nunca consegue marcar dois pacientes no mesmo horário do mesmo profissional.** Tudo abaixo serve a isso.

## Antes de começar (5 minutos)

- [ ] Apagar as branches `legacy` e `v2` no GitHub (Branches → lixeira). A `main` já tem tudo.
- [ ] Instalar o Docker Desktop, se ainda não tiver (o Supabase local precisa dele).
- [ ] Clonar e rodar a sprint 0 seguindo o README; testar criar conta e entrar.

## Sprint 1 — Clínica, equipe e acesso

- Tabelas `clinics`, `clinic_members` (papel: dono, secretária, profissional) e `clinic_invites`.
- Regras de acesso (RLS): cada usuário só vê as clínicas das quais é membro; só o dono mexe na equipe.
- Depois do cadastro, tela "Criar sua clínica" (nome). Quem cria vira dono.
- Convite por e-mail sem servidor de e-mail: o dono cadastra o e-mail e o papel; quando essa pessoa cria conta ou entra com aquele e-mail, ela entra na clínica automaticamente (`accept_pending_invites()` chamada a cada login).
- Tela Configurações → Equipe: membros, convites pendentes, remover membro, nome da clínica.

**Pronto quando:** duas clínicas de teste não enxergam nada uma da outra (teste automatizado) e um convite aceito aparece na equipe.

## Sprint 2 — Profissionais e horários

- Tabelas `professionals` (nome, especialidade, duração da sessão, cor, ativo, login opcional) e `working_hours` (dia da semana, início, fim; várias faixas por dia pra ter intervalo de almoço).
- Trava no banco contra faixas de horário sobrepostas no mesmo dia.
- Tela Profissionais: cadastrar, editar o horário da semana, convidar o profissional pra ter login.
- Dono e secretária gerenciam; profissional só vê.

**Pronto quando:** profissional com seg–sex 8h–12h e 13h–18h, sessão de 50 min, salvo e reaberto igual.

## Sprint 3 — Marcar atendimento com a trava

- Tabelas `patients` (nome, telefone; telefone único por clínica) e `appointments` (profissional, paciente, início, fim, status).
- **A trava:** constraint de exclusão (`btree_gist`) que impede dois atendimentos não cancelados do mesmo profissional com horários sobrepostos. Se duas pessoas clicarem juntas, o banco aceita só a primeira.
- Funções: `available_slots(profissional, dia)` gera os horários livres a partir do horário de trabalho menos os ocupados; `book_appointment(...)` acha ou cria o paciente pelo telefone e marca, devolvendo `slot_taken` se o horário foi ocupado.
- Escrita em atendimentos só pelas funções (o navegador não insere direto).
- Agenda da secretária: escolhe profissional e dia, vê lista de horários (livres e ocupados), clica em um livre e marca com nome e telefone.

**Pronto quando:** teste prova que o segundo agendamento no mesmo horário é recusado, e a tela mostra "Esse horário acabou de ser ocupado".

## Sprint 4 — Remarcar, cancelar, veio/faltou, agenda do profissional

- Remarcar escolhendo outro horário livre (mesma trava).
- Cancelar libera o horário na hora.
- Marcar "veio" ou "faltou".
- Profissional logado vê só a própria agenda do dia.

**Pronto quando:** a secretária de uma clínica real usa por um dia sem marcar ninguém em cima de ninguém.

## Testes do banco

Rodar com Supabase local: arquivo SQL em `supabase/tests/` que loga como usuários diferentes e confere RLS e a trava de horário. Rodar a cada migration nova.
