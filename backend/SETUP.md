# Setup do Banco de Dados

## 1. Criar o arquivo .env

Crie o arquivo `.env` na raiz do diretório `backend/` com o seguinte conteúdo:

```env
# Server
NODE_ENV=development
PORT=3333
API_URL=http://localhost:3333

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/redamax_db?schema=public"

# JWT Secrets
ACCESS_TOKEN_SECRET=redaia-access-token-secret-change-in-production-2024
REFRESH_TOKEN_SECRET=redaia-refresh-token-secret-change-in-production-2024

# JWT Expiration (in seconds)
ACCESS_TOKEN_EXPIRES_IN=900
REFRESH_TOKEN_EXPIRES_IN=2592000

# Email Configuration (SMTP) - Mailtrap para desenvolvimento
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-mailtrap-user
SMTP_PASS=your-mailtrap-password
SMTP_FROM_EMAIL=noreply@redaia.com
SMTP_FROM_NAME=RedaIA

# Frontend URL
FRONTEND_URL=http://localhost:3000

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 2. Criar o banco de dados PostgreSQL

Se o banco `redamax_db` não existir, crie-o:

### Usando psql:
```bash
psql -U postgres
CREATE DATABASE redamax_db;
\q
```

### Ou usando SQL direto:
```bash
psql -U postgres -c "CREATE DATABASE redamax_db;"
```

## 3. Executar migrations e seed

```bash
npm run prisma:migrate
npm run prisma:seed
```

## 4. Verificar se tudo está funcionando

```bash
npm run dev
```

