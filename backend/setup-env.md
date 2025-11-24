# Configuração do .env

Crie um arquivo `.env` na pasta `backend/` com o seguinte conteúdo:

```env
# Server
NODE_ENV=development
PORT=3333
API_URL=http://localhost:3333

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/redamax_db?schema=public"

# JWT Secrets
ACCESS_TOKEN_SECRET=your-super-secret-access-token-key-change-in-production-min-32-chars
REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key-change-in-production-min-32-chars

# JWT Expiration (in seconds)
ACCESS_TOKEN_EXPIRES_IN=900
REFRESH_TOKEN_EXPIRES_IN=2592000

# Email Configuration (SMTP)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-mailtrap-user
SMTP_PASS=your-mailtrap-password
SMTP_FROM_EMAIL=noreply@redaia.com
SMTP_FROM_NAME=RedaIA

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Criar o banco de dados

Se o banco `redamax_db` não existir, execute no PostgreSQL:

```sql
CREATE DATABASE redamax_db;
```

Ou via linha de comando:
```bash
psql -U postgres -c "CREATE DATABASE redamax_db;"
```




