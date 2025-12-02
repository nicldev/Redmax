#Backend API

Backend completo em TypeScript com autenticação segura, verificação de e-mail e gerenciamento de conta.

## 🚀 Tecnologias

- **Node.js** (>=18) + **TypeScript**
- **Express** - Framework web
- **Prisma ORM** + **PostgreSQL** - Banco de dados
- **JWT** - Autenticação (access + refresh tokens)
- **bcrypt** - Hash de senhas (salt rounds 12)
- **Nodemailer** - Envio de e-mails
- **Zod** - Validação de dados
- **Winston** - Logs estruturados
- **Jest + Supertest** - Testes automatizados
- **Google Generative AI (Gemini)** - Avaliação de redações por IA

## 📋 Pré-requisitos

- Node.js >= 18
- PostgreSQL >= 14
- npm ou yarn

## 🔧 Instalação

1. **Clone o repositório e entre na pasta backend:**
```bash
cd backend
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
- `DATABASE_URL` - URL de conexão PostgreSQL
- `ACCESS_TOKEN_SECRET` - Chave secreta para JWT access token
- `REFRESH_TOKEN_SECRET` - Chave secreta para JWT refresh token
- Configurações SMTP (veja seção de e-mail abaixo)

4. **Configure o banco de dados:**
```bash
# Gerar Prisma Client
npm run prisma:generate

# Executar migrations
npm run prisma:migrate

# Popular banco com dados de teste (opcional)
npm run prisma:seed
```

5. **Inicie o servidor:**
```bash
# Desenvolvimento (com hot reload)
npm run dev

# Produção
npm run build
npm start
```

## 📧 Configuração de E-mail

### Desenvolvimento (Mailtrap)

1. Crie conta em [Mailtrap.io](https://mailtrap.io)
2. Configure no `.env`:
```
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=seu-usuario-mailtrap
SMTP_PASS=sua-senha-mailtrap
```

### Produção (SMTP real)

Configure com seu provedor SMTP (Gmail, SendGrid, etc):
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-app
SMTP_FROM_EMAIL=noreply@redaia.com
SMTP_FROM_NAME=RedaIA
```

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Testes em modo watch
npm run test:watch

# Com cobertura
npm test -- --coverage
```

## 📚 Endpoints da API

### Temas de Redação

#### GET `/api/themes/random`
Retorna um tema aleatório de redação do ENEM.

#### GET `/api/themes`
Retorna todos os temas ativos disponíveis.

#### GET `/api/themes/:id`
Retorna um tema específico por ID.

### Redações

#### POST `/api/essays`
Cria uma nova redação (requer autenticação).

#### GET `/api/essays`
Lista as redações do usuário (requer autenticação).

#### GET `/api/essays/:id`
Busca uma redação específica (requer autenticação).

#### PUT `/api/essays/:id`
Atualiza uma redação (requer autenticação).

#### POST `/api/essays/:id/evaluate`
Avalia uma redação usando IA (requer autenticação e GEMINI_API_KEY).

#### DELETE `/api/essays/:id`
Deleta uma redação (requer autenticação).

#### GET `/api/essays/statistics`
Retorna estatísticas das redações do usuário (requer autenticação).

**Para documentação completa dos endpoints de redações e temas, veja [API_ENDPOINTS.md](./API_ENDPOINTS.md)**

### Autenticação

#### POST `/api/auth/register`
Registra novo usuário.

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "SenhaSegura123",
  "school": "Escola Exemplo",
  "grade": "3º Ano"
}
```

**Resposta (201):**
```json
{
  "success": true,
  "message": "Conta criada com sucesso. Verifique seu e-mail para ativar sua conta.",
  "data": {
    "user": {
      "id": "...",
      "name": "João Silva",
      "email": "joao@example.com"
    }
  }
}
```

#### GET `/api/auth/verify-email?token=...`
Verifica e-mail do usuário. Retorna página HTML.

#### POST `/api/auth/login`
Login do usuário.

**Body:**
```json
{
  "email": "joao@example.com",
  "password": "SenhaSegura123"
}
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "uuid-token",
    "user": {
      "id": "...",
      "name": "João Silva",
      "email": "joao@example.com",
      "emailVerified": true
    }
  }
}
```

#### POST `/api/auth/refresh`
Renova access token.

**Body:**
```json
{
  "refreshToken": "uuid-token"
}
```

#### POST `/api/auth/logout`
Logout do usuário.

#### POST `/api/auth/resend-verification`
Reenvia e-mail de verificação (requer autenticação).

### Gerenciamento de Usuário

Todas as rotas abaixo requerem autenticação (header `Authorization: Bearer <accessToken>`).

#### GET `/api/user/profile`
Retorna perfil do usuário autenticado.

#### PUT `/api/user/profile`
Atualiza perfil.

**Body:**
```json
{
  "name": "João Silva Atualizado",
  "school": "Nova Escola",
  "grade": "2º Ano"
}
```

#### PUT `/api/user/change-password`
Altera senha.

**Body:**
```json
{
  "currentPassword": "SenhaAntiga123",
  "newPassword": "NovaSenhaSegura123"
}
```

#### DELETE `/api/user`
Deleta conta (requer confirmação de senha).

**Body:**
```json
{
  "password": "SenhaAtual123"
}
```

## 🔒 Segurança

- ✅ Senhas hasheadas com bcrypt (salt rounds 12)
- ✅ JWT com tokens de acesso e refresh
- ✅ Rotação de refresh tokens
- ✅ Rate limiting em endpoints sensíveis
- ✅ Validação completa com Zod
- ✅ Sanitização de inputs (prevenção XSS)
- ✅ Helmet para headers de segurança
- ✅ CORS configurável
- ✅ Logs estruturados (sem dados sensíveis)

## 📝 Exemplos cURL

### Registrar usuário
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123"
  }'
```

### Obter perfil (autenticado)
```bash
curl -X GET http://localhost:3001/api/user/profile \
  -H "Authorization: Bearer <accessToken>"
```

## 🚢 Deploy

### Railway / Render / Heroku

1. Configure variáveis de ambiente no painel
2. Execute migrations:
```bash
npm run prisma:migrate deploy
```
3. Build e start:
```bash
npm run build
npm start
```

### Variáveis de ambiente necessárias

- `DATABASE_URL`
- `ACCESS_TOKEN_SECRET`
- `REFRESH_TOKEN_SECRET`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- `FRONTEND_URL`
- `CORS_ORIGIN`
- `GEMINI_API_KEY` (opcional - necessário para avaliação de redações, veja [SETUP_GEMINI.md](./SETUP_GEMINI.md))

## 📦 Scripts Disponíveis

- `npm run dev` - Desenvolvimento com hot reload
- `npm run build` - Build para produção
- `npm start` - Iniciar servidor em produção
- `npm test` - Executar testes
- `npm run prisma:migrate` - Executar migrations
- `npm run prisma:seed` - Popular banco com dados de teste
- `npm run prisma:studio` - Abrir Prisma Studio

## 🐛 Troubleshooting

### Erro de conexão com banco
Verifique se o PostgreSQL está rodando e se `DATABASE_URL` está correto.

### E-mails não são enviados
- Em desenvolvimento: use Mailtrap
- Verifique configurações SMTP no `.env`
- Teste conexão SMTP com `npm run dev` e veja logs

### Erro "Token inválido"
- Verifique se `ACCESS_TOKEN_SECRET` e `REFRESH_TOKEN_SECRET` estão configurados
- Tokens expiram: access (15min), refresh (30 dias)

## 📄 Licença

ISC

