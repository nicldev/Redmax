# Arquitetura do Sistema - ConexãoSaber

## 1. Visão Geral

O ConexãoSaber é uma aplicação multiplataforma desenvolvida com arquitetura cliente-servidor, utilizando tecnologias modernas para garantir escalabilidade, manutenibilidade e performance.

## 2. Arquitetura Geral

```
┌─────────────────┐
│   Frontend      │
│   (Next.js)     │
│   Port: 3000    │
└────────┬────────┘
         │ HTTP/REST
         │
┌────────▼────────┐
│    Backend      │
│   (Express)     │
│   Port: 3333    │
└────────┬────────┘
         │
┌────────▼────────┐
│   PostgreSQL    │
│   Database      │
└─────────────────┘
```

## 3. Componentes do Sistema

### 3.1 Frontend (Next.js 14)

**Tecnologias:**
- Next.js 14 com App Router
- TypeScript
- Tailwind CSS
- React Context API (gerenciamento de tema)

**Estrutura:**
```
frontend/web/
├── app/                    # Páginas e rotas
├── components/            # Componentes reutilizáveis
└── contexts/              # Context API
```

**Características:**
- Server-Side Rendering (SSR) e Static Site Generation (SSG)
- Roteamento baseado em arquivos
- Suporte a modo escuro
- Design responsivo (mobile-first)

### 3.2 Backend (Node.js + Express)

**Tecnologias:**
- Node.js (>=18)
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT (autenticação)
- bcrypt (hash de senhas)
- Zod (validação)
- Winston (logs)

**Estrutura:**
```
backend/
├── src/
│   ├── app.ts            # Configuração do Express
│   ├── server.ts         # Servidor HTTP
│   ├── controllers/     # Lógica de controle
│   ├── routes/          # Definição de rotas
│   ├── services/        # Lógica de negócio
│   ├── middlewares/     # Middlewares
│   ├── models/          # Modelos de dados
│   ├── validators/      # Schemas de validação
│   ├── utils/           # Utilitários
│   └── tests/           # Testes automatizados
└── prisma/
    ├── schema.prisma    # Schema do banco
    └── seed.ts          # Dados de seed
```

**Padrões Arquiteturais:**
- MVC (Model-View-Controller)
- Service Layer Pattern
- Repository Pattern (via Prisma)

### 3.3 Banco de Dados (PostgreSQL)

**Modelos Principais:**

1. **User** - Usuários do sistema
   - id, name, email, passwordHash
   - emailVerified, school, grade
   - createdAt, updatedAt

2. **EmailVerification** - Tokens de verificação
   - id, userId, token, expiresAt

3. **RefreshToken** - Tokens de refresh
   - id, userId, tokenHash, expiresAt, revokedAt

## 4. Fluxo de Autenticação

```
1. Cliente → POST /api/auth/register
2. Backend → Cria usuário + token de verificação
3. Backend → Envia e-mail de verificação
4. Cliente → GET /api/auth/verify-email?token=...
5. Backend → Marca e-mail como verificado
6. Cliente → POST /api/auth/login
7. Backend → Retorna accessToken + refreshToken
8. Cliente → Usa accessToken em requisições autenticadas
9. Cliente → POST /api/auth/refresh (quando accessToken expira)
```

## 5. Segurança

### 5.1 Autenticação
- JWT com access tokens (15 min) e refresh tokens (30 dias)
- Rotação de refresh tokens
- Verificação obrigatória de e-mail

### 5.2 Proteção de Dados
- Senhas hasheadas com bcrypt (12 salt rounds)
- Sanitização de inputs (prevenção XSS)
- Validação com Zod
- Rate limiting em endpoints sensíveis

### 5.3 Headers de Segurança
- Helmet.js para headers HTTP seguros
- CORS configurável
- Content Security Policy

## 6. APIs e Endpoints

### 6.1 Autenticação
- `POST /api/auth/register` - Cadastro
- `GET /api/auth/verify-email` - Verificação de e-mail
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Renovar token
- `POST /api/auth/logout` - Logout
- `POST /api/auth/resend-verification` - Reenviar verificação

### 6.2 Usuário (Autenticado)
- `GET /api/user/profile` - Obter perfil
- `PUT /api/user/profile` - Atualizar perfil
- `PUT /api/user/change-password` - Alterar senha
- `DELETE /api/user` - Deletar conta

## 7. Testes

### 7.1 Backend
- Testes unitários com Jest
- Testes de integração com Supertest
- Cobertura de código

### 7.2 Frontend
- Testes podem ser adicionados com Jest/Vitest

## 8. Deploy

### 8.1 Frontend
- Vercel ou Netlify
- Deploy automático via Git

### 8.2 Backend
- Railway, Render ou Heroku
- Variáveis de ambiente configuradas
- Migrations executadas automaticamente

## 9. Monitoramento e Logs

- Winston para logs estruturados
- Logs de requisições, erros e operações importantes
- Sem logs de dados sensíveis

## 10. Escalabilidade

### 10.1 Atual
- Arquitetura monolítica simples
- Banco de dados único

### 10.2 Futuro
- Possibilidade de separar em microsserviços
- Cache com Redis
- Load balancing
- CDN para assets estáticos

## 11. Mudanças Arquiteturais

Durante o desenvolvimento, foram mantidas as seguintes decisões arquiteturais:
- Uso de Prisma ORM para facilitar migrações
- JWT para autenticação stateless
- TypeScript para type safety
- Next.js para melhor SEO e performance

