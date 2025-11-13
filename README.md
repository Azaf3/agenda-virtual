# AgendaMental

Uma plataforma completa para agendamento de consultas psicológicas e terapêuticas.

## Sobre

AgendaMental é uma API REST que conecta pacientes a psicólogos, facilitando o agendamento de consultas online ou presenciais. O sistema gerencia perfis de usuários, disponibilidade de profissionais, agendamentos e notificações automáticas.

## Tecnologias

- Node.js & Express
- MongoDB & Mongoose
- JWT (autenticação)
- Bcrypt (criptografia)
- Nodemailer (notificações por email)

## Estrutura

```
├── config/          # Configurações (database)
├── controllers/     # Lógica de negócio
├── models/          # Schemas do MongoDB
├── routes/          # Definição de rotas
├── services/        # Serviços externos (email, whatsapp, zoom)
├── utils/           # Utilitários e middlewares
└── server.js        # Entry point
```

## Instalação

```bash
# Clone o repositório
git clone <seu-repositorio>
cd agenda-virtual

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais

# Inicie o servidor
npm run dev
```

O servidor estará disponível em `http://localhost:5000`

## API Endpoints

### Autenticação
```
POST   /api/auth/register    # Criar conta
POST   /api/auth/login        # Login
GET    /api/auth/me           # Perfil do usuário logado
```

### Usuários
```
GET    /api/users/profile              # Obter perfil
PUT    /api/users/profile              # Atualizar perfil
PUT    /api/users/patient-profile     # Atualizar dados do paciente
PUT    /api/users/change-password     # Alterar senha
```

### Psicólogos
```
GET    /api/psychologists              # Listar psicólogos
GET    /api/psychologists/:id          # Obter por ID
GET    /api/psychologists/:id/availability  # Ver disponibilidade
PUT    /api/psychologists/:id          # Atualizar perfil
```

### Agendamentos
```
POST   /api/appointments       # Criar agendamento
GET    /api/appointments       # Listar agendamentos
GET    /api/appointments/:id   # Obter por ID
PUT    /api/appointments/:id   # Atualizar status
DELETE /api/appointments/:id   # Cancelar
```

## Autenticação

As rotas protegidas requerem um token JWT no header:

```
Authorization: Bearer <seu-token>
```

## Funcionalidades

- Autenticação JWT com bcrypt
- Gerenciamento de perfis (pacientes e psicólogos)
- Sistema de agendamentos com validação de conflitos
- Notificações por email (confirmação, lembretes, cancelamentos)
- Integração com WhatsApp (opcional)
- Integração com Zoom para consultas online (opcional)

## Variáveis de Ambiente

```env
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/agenda-mental

# JWT
JWT_SECRET=sua_chave_secreta
JWT_EXPIRE=7d

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASSWORD=sua_senha_de_app
EMAIL_FROM=noreply@agendamental.com

# Opcional: WhatsApp e Zoom
WHATSAPP_ACCOUNT_SID=
WHATSAPP_AUTH_TOKEN=
ZOOM_API_KEY=
ZOOM_API_SECRET=
```

## Exemplos de Uso

### Registrar usuário

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "Senha123",
  "phone": "(11) 99999-9999",
  "role": "patient",
  "dateOfBirth": "1990-05-15"
}
```

### Login

```bash
POST /api/auth/login

{
  "email": "joao@email.com",
  "password": "Senha123"
}
```

### Criar agendamento

```bash
POST /api/appointments
Authorization: Bearer <token>

{
  "psychologistId": "507f1f77bcf86cd799439011",
  "appointmentDate": "2025-11-15",
  "startTime": "14:00",
  "endTime": "14:50",
  "type": "online",
  "notes": "Primeira consulta"
}
```

## Scripts

```bash
npm run dev    # Desenvolvimento (com nodemon)
npm start      # Produção
```

## Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

## Licença

Este projeto está sob a licença ISC.
