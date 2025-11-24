# 🎓 RedaIA - Plataforma de Treino de Redação para o ENEM

Plataforma completa para treinar redação para o ENEM com correção automática por IA, roadmap personalizado e acompanhamento de evolução.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando o Projeto](#executando-o-projeto)
- [API Backend](#api-backend)
- [Deploy](#deploy)
- [Contribuindo](#contribuindo)

## 🎯 Sobre o Projeto

RedaIA é uma plataforma moderna inspirada no Notion que oferece:

- ✍️ **Editor de redação** limpo e focado
- 🤖 **Correção automática** por IA com avaliação por competências
- 📊 **Dashboard** com métricas e evolução
- 🗺️ **Roadmap personalizado** de estudos
- 📈 **Estatísticas** de progresso
- 🔐 **Autenticação segura** com verificação de e-mail
- 🌓 **Modo escuro** para conforto visual

## 🛠️ Tecnologias

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Lucide React** (ícones)
- **Context API** (gerenciamento de tema)

### Backend
- **Node.js** (>=18)
- **TypeScript**
- **Express**
- **Prisma ORM** + **PostgreSQL**
- **JWT** (autenticação)
- **bcrypt** (hash de senhas)
- **Nodemailer** (envio de e-mails)
- **Zod** (validação)
- **Winston** (logs)
- **Jest** (testes)

## 📁 Estrutura do Projeto

```
REDMAX/
├── app/                    # Frontend Next.js
│   ├── page.tsx           # Landing page
│   ├── dashboard/         # Dashboard
│   ├── redacoes/          # Páginas de redações
│   ├── roadmap/           # Roadmap
│   └── perfil/            # Perfil
├── components/            # Componentes React
│   ├── Card.tsx
│   ├── Button.tsx
│   ├── Header.tsx
│   └── ThemeToggle.tsx
├── contexts/              # Context API
│   └── ThemeContext.tsx
├── backend/               # Backend API
│   ├── src/
│   │   ├── controllers/  # Controllers
│   │   ├── routes/        # Rotas
│   │   ├── services/      # Lógica de negócio
│   │   ├── middlewares/   # Middlewares
│   │   ├── models/        # Prisma client
│   │   ├── utils/         # Utilitários
│   │   └── tests/         # Testes
│   ├── prisma/
│   │   ├── schema.prisma  # Schema do banco
│   │   └── seed.ts        # Seed de dados
│   └── package.json
├── package.json
└── README.md
```

## 🚀 Instalação

### Pré-requisitos

- Node.js >= 18
- PostgreSQL >= 14
- npm ou yarn

### Passo a passo

1. **Clone o repositório:**
```bash
git clone <url-do-repositorio>
cd REDMAX
```

2. **Instale as dependências do frontend:**
```bash
npm install
```

3. **Instale as dependências do backend:**
```bash
cd backend
npm install
cd ..
```

## ⚙️ Configuração

### Frontend

O frontend não requer configuração adicional. As variáveis de ambiente são opcionais.

### Backend

1. **Crie o arquivo `.env` na pasta `backend/`:**

```env
# Server
NODE_ENV=development
PORT=3333

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/redamax_db?schema=public"

# JWT Secrets (gere chaves seguras)
ACCESS_TOKEN_SECRET=sua-chave-secreta-access-token-min-32-caracteres
REFRESH_TOKEN_SECRET=sua-chave-secreta-refresh-token-min-32-caracteres

# JWT Expiration
ACCESS_TOKEN_EXPIRES_IN=900
REFRESH_TOKEN_EXPIRES_IN=2592000

# Email (use Mailtrap para desenvolvimento)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=seu-usuario-mailtrap
SMTP_PASS=sua-senha-mailtrap
SMTP_FROM_EMAIL=noreply@redaia.com
SMTP_FROM_NAME=RedaIA

# URLs
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

2. **Crie o banco de dados PostgreSQL:**

```sql
CREATE DATABASE redamax_db;
```

Ou via linha de comando:
```bash
psql -U postgres -c "CREATE DATABASE redamax_db;"
```

3. **Configure o Prisma:**

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

## ▶️ Executando o Projeto

### Desenvolvimento

**Terminal 1 - Frontend:**
```bash
npm run dev
```
Acesse: http://localhost:3000

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```
API rodando em: http://localhost:3333

### Produção

**Frontend:**
```bash
npm run build
npm start
```

**Backend:**
```bash
cd backend
npm run build
npm start
```

## 🔌 API Backend

### Endpoints de Autenticação

#### `POST /api/auth/register`
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

#### `GET /api/auth/verify-email?token=...`
Verifica e-mail do usuário.

#### `POST /api/auth/login`
Login do usuário.

**Body:**
```json
{
  "email": "joao@example.com",
  "password": "SenhaSegura123"
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "uuid-token",
    "user": {
      "id": "...",
      "name": "João Silva",
      "email": "joao@example.com"
    }
  }
}
```

#### `POST /api/auth/refresh`
Renova access token.

#### `POST /api/auth/logout`
Logout do usuário.

### Endpoints de Usuário (Requerem autenticação)

#### `GET /api/user/profile`
Retorna perfil do usuário autenticado.

**Headers:**
```
Authorization: Bearer <accessToken>
```

#### `PUT /api/user/profile`
Atualiza perfil.

#### `PUT /api/user/change-password`
Altera senha.

#### `DELETE /api/user`
Deleta conta.

### Documentação Completa

Consulte o [README do Backend](./backend/README.md) para documentação completa da API.

## 🧪 Testes

### Backend

```bash
cd backend
npm test
```

### Frontend

Testes do frontend podem ser adicionados com Jest ou Vitest.

## 🚢 Deploy

### Frontend (Vercel/Netlify)

1. Conecte o repositório
2. Configure variáveis de ambiente (se necessário)
3. Deploy automático

### Backend (Railway/Render/Heroku)

1. Configure variáveis de ambiente
2. Execute migrations:
```bash
npm run prisma:migrate deploy
```
3. Build e start:
```bash
npm run build
npm start
```

## 📝 Scripts Disponíveis

### Frontend
- `npm run dev` - Desenvolvimento
- `npm run build` - Build para produção
- `npm start` - Iniciar produção
- `npm run lint` - Linter

### Backend
- `npm run dev` - Desenvolvimento com hot reload
- `npm run build` - Build para produção
- `npm start` - Iniciar produção
- `npm test` - Executar testes
- `npm run prisma:generate` - Gerar Prisma Client
- `npm run prisma:migrate` - Executar migrations
- `npm run prisma:seed` - Popular banco com dados de teste
- `npm run prisma:studio` - Abrir Prisma Studio

## 🎨 Design

O design segue um estilo **Notion-like** com:

- Paleta de cores suave (#F7F7F5 de fundo)
- Tipografia Inter/Rubik/Nunito
- Cards com bordas leves e sombras sutis
- Layout modular e limpo
- Máxima largura de 880px
- **Modo escuro** completo

## 🔒 Segurança

- ✅ Senhas hasheadas com bcrypt (salt rounds 12)
- ✅ JWT com tokens de acesso e refresh
- ✅ Rotação de refresh tokens
- ✅ Rate limiting em endpoints sensíveis
- ✅ Validação completa com Zod
- ✅ Sanitização de inputs (prevenção XSS)
- ✅ Helmet para headers de segurança
- ✅ CORS configurável
- ✅ Verificação de e-mail obrigatória

## 📄 Licença

ISC

## 👥 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📧 Contato

Para dúvidas ou sugestões, abra uma issue no repositório.

---

Desenvolvido com ❤️ para ajudar estudantes a alcançarem a nota 1000 no ENEM.

