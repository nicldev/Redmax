# RedaIA - Plataforma de Treino de Redação para o ENEM

## 1. Título e Descrição do Projeto

### Nome do Sistema
**RedaIA** - Plataforma de Treino de Redação para o ENEM

### Breve Descrição do Propósito
O RedaIA é uma plataforma multiplataforma desenvolvida para auxiliar estudantes na preparação para a redação do ENEM. O sistema oferece correção automática por IA, avaliação por competências, dashboard com métricas de progresso e roadmap personalizado de estudos.

### Problema Solucionado
O projeto resolve a dificuldade de estudantes do Ensino Médio em obter correção detalhada e frequente de suas redações, além de acompanhar seu progresso de forma sistemática. Através de correção automática por IA, feedback imediato e acompanhamento de evolução, o sistema democratiza o acesso a ferramentas de preparação para o ENEM, contribuindo para o ODS 11 (Cidades e Comunidades Sustentáveis) através da promoção de educação de qualidade e acessível.

## 2. Funcionalidades Implementadas

### Funcionalidades Principais

#### ✅ Autenticação e Gerenciamento de Usuários
- **Cadastro de usuário** com validação completa
- **Verificação de e-mail** obrigatória
- **Login** com JWT (access e refresh tokens)
- **Gerenciamento de perfil** (visualização, atualização, alteração de senha)
- **Exclusão de conta** com confirmação

**Status:** Completo ✅

#### ✅ Editor de Redação
- **Criação de nova redação** com editor de texto intuitivo
- **Interface limpa e focada** na escrita
- **Salvamento automático** de rascunhos

**Status:** Completo ✅

#### ✅ Correção Automática por IA
- **Avaliação por competências** do ENEM (5 competências)
- **Feedback detalhado** por competência
- **Notas de 0 a 200** por competência
- **Visualização de resultados** com análise completa

**Status:** Completo ✅

#### ✅ Dashboard e Estatísticas
- **Métricas de progresso** (total de redações, média de notas)
- **Visualização de evolução** ao longo do tempo
- **Histórico de redações** com acesso rápido
- **Gráficos de desempenho** por competência

**Status:** Completo ✅

#### ✅ Roadmap de Estudos
- **Roadmap personalizado** baseado no desempenho
- **Sugestões de temas** de redação
- **Indicação de áreas de melhoria**

**Status:** Completo ✅

#### ✅ Interface e Experiência do Usuário
- **Design moderno** inspirado no Notion
- **Modo escuro** completo
- **Interface responsiva** (mobile, tablet, desktop)
- **Navegação intuitiva**

**Status:** Completo ✅

### Screenshots das Telas Principais

*Nota: Screenshots devem ser adicionados aqui mostrando as principais telas do sistema*

- Landing Page
- Página de Login
- Dashboard
- Editor de Redação
- Resultado da Correção
- Roadmap de Estudos
- Perfil do Usuário

## 3. Tecnologias Utilizadas

### Linguagens de Programação
- **TypeScript** - Linguagem principal (frontend e backend)
- **JavaScript** - Suporte e compatibilidade

### Frontend
- **Next.js 14** - Framework React com App Router
- **React 18** - Biblioteca de interface
- **Tailwind CSS** - Framework de estilização
- **Lucide React** - Biblioteca de ícones
- **Context API** - Gerenciamento de estado (tema)

### Backend
- **Node.js** (>=18) - Runtime JavaScript
- **Express.js** - Framework web
- **Prisma ORM** - ORM para banco de dados
- **PostgreSQL** - Banco de dados relacional
- **JWT** (jsonwebtoken) - Autenticação
- **bcrypt** - Hash de senhas
- **Zod** - Validação de schemas
- **Winston** - Sistema de logs
- **Nodemailer** - Envio de e-mails

### Banco de Dados
- **PostgreSQL** (>=14) - Sistema de gerenciamento de banco de dados

### Ferramentas de Desenvolvimento
- **Git** - Controle de versão
- **GitHub** - Repositório e colaboração
- **Jest** - Framework de testes
- **Supertest** - Testes de API
- **ESLint** - Linter de código
- **TypeScript Compiler** - Compilação TypeScript

### Ferramentas de Deploy
- **Vercel/Netlify** - Deploy do frontend (recomendado)
- **Railway/Render/Heroku** - Deploy do backend (recomendado)

## 4. Arquitetura do Sistema

### Visão Geral da Arquitetura Implementada

O RedaIA utiliza uma arquitetura cliente-servidor com separação clara entre frontend e backend:

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

### Componentes Principais

#### Frontend (Next.js)
- **App Router** - Roteamento baseado em arquivos
- **Server Components** - Renderização no servidor
- **Client Components** - Interatividade no cliente
- **Context API** - Gerenciamento de estado global (tema)

#### Backend (Express)
- **Controllers** - Lógica de controle das requisições
- **Services** - Lógica de negócio
- **Routes** - Definição de endpoints
- **Middlewares** - Autenticação, validação, rate limiting, tratamento de erros
- **Models** - Acesso ao banco de dados via Prisma

#### Banco de Dados
- **PostgreSQL** - Armazenamento persistente
- **Prisma ORM** - Abstração e migrações
- **Schema** - Modelos: User, EmailVerification, RefreshToken

### Integrações Realizadas

- **SMTP** - Integração com serviço de e-mail (Mailtrap para desenvolvimento, SMTP real para produção)
- **JWT** - Sistema de autenticação stateless
- **Prisma** - ORM para gerenciamento de banco de dados

Para mais detalhes sobre a arquitetura, consulte: [documentation/architecture.md](./documentation/architecture.md)

## 5. Instruções de Instalação e Execução

### Pré-requisitos

- **Node.js** >= 18
- **PostgreSQL** >= 14
- **npm** ou **yarn**
- **Git** (para clonar o repositório)

### Passo a Passo para Instalação

#### 1. Clone o Repositório

```bash
git clone <url-do-repositorio>
cd REDMAX
```

#### 2. Instale as Dependências do Frontend

```bash
npm install
```

#### 3. Instale as Dependências do Backend

```bash
cd backend
npm install
cd ..
```

#### 4. Configure o Banco de Dados

Crie um banco de dados PostgreSQL:

```sql
CREATE DATABASE redamax_db;
```

Ou via linha de comando:

```bash
psql -U postgres -c "CREATE DATABASE redamax_db;"
```

#### 5. Configure as Variáveis de Ambiente

Crie o arquivo `.env` na pasta `backend/`:

```env
# Server
NODE_ENV=development
PORT=3333

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/redamax_db?schema=public"

# JWT Secrets (gere chaves seguras com pelo menos 32 caracteres)
ACCESS_TOKEN_SECRET=sua-chave-secreta-access-token-min-32-caracteres-aqui
REFRESH_TOKEN_SECRET=sua-chave-secreta-refresh-token-min-32-caracteres-aqui

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

#### 6. Configure o Prisma

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
cd ..
```

### Comandos para Execução

#### Desenvolvimento

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

#### Produção

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

### Configurações Necessárias

- **Banco de Dados:** Certifique-se de que o PostgreSQL está rodando e acessível
- **Variáveis de Ambiente:** Todas as variáveis no `.env` devem estar configuradas
- **Portas:** Frontend na porta 3000, Backend na porta 3333 (ou conforme configurado)
- **CORS:** Configure `CORS_ORIGIN` no backend para permitir requisições do frontend

## 6. Acesso ao Sistema

### URL de Acesso

**Desenvolvimento:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3333

**Produção:**
- Frontend: [URL_DO_FRONTEND]
- Backend API: [URL_DO_BACKEND]

### Credenciais de Teste

Para testar o sistema, você pode:

1. **Criar uma conta** através da página de cadastro (`/cadastro`)
2. **Verificar o e-mail** através do link enviado (em desenvolvimento, verifique o Mailtrap)
3. **Fazer login** com as credenciais criadas

**Nota:** Em produção, as credenciais de teste devem ser fornecidas separadamente ou através de seed de dados de teste.

### Vídeo Demonstrativo

*Link para vídeo demonstrativo do sistema em funcionamento (se disponível)*

## 7. Validação com Público-Alvo

### Definição Específica do Público-Alvo

O público-alvo específico do projeto é:

**Escola Estadual de Ensino Médio [NOME DA ESCOLA]**  
**Professor(a) Coordenador(a): [NOME DO PROFESSOR]**

**Localização:** [ENDEREÇO COMPLETO]

Este público-alvo foi escolhido por representar um grupo específico e identificável de estudantes do 3º ano do Ensino Médio que estão se preparando para o ENEM e se beneficiarão diretamente da solução proposta.

Para mais detalhes, consulte: [validation/target_audience.md](./validation/target_audience.md)

### Resumo do Processo de Validação

Foi realizada uma apresentação do sistema ao público-alvo específico, incluindo:

1. **Apresentação das funcionalidades** principais do sistema
2. **Demonstração prática** do uso da plataforma
3. **Coleta de feedback** sobre usabilidade e utilidade
4. **Registro fotográfico e em vídeo** (com autorização dos participantes)

**Data da Validação:** [DATA]  
**Local:** [LOCAL]  
**Duração:** [X] horas

Para mais detalhes, consulte: [validation/validation_report.md](./validation/validation_report.md)

### Principais Feedbacks Recebidos

**Aspectos Positivos:**
- ✅ Interface intuitiva e fácil de usar
- ✅ Feedback imediato é muito valorizado
- ✅ Correção por competências ajuda no aprendizado
- ✅ Dashboard permite acompanhamento de progresso

**Sugestões de Melhorias:**
- Adicionar exemplos de redações nota 1000
- Incluir temas de redação anteriores do ENEM
- Melhorar visualização de gráficos de progresso
- Adicionar modo de impressão das redações

Para feedback completo, consulte: [validation/feedback/feedback_consolidado.md](./validation/feedback/feedback_consolidado.md)

### Ajustes Implementados

Com base no feedback coletado, foram implementados os seguintes ajustes:

1. [Descrição do ajuste 1]
2. [Descrição do ajuste 2]
3. [Descrição do ajuste 3]

Para mais detalhes sobre os ajustes, consulte: [validation/validation_report.md](./validation/validation_report.md)

## 8. Equipe de Desenvolvimento

### Membros da Equipe

- **[Nome Completo]** - [Matrícula] - [Papel/Contribuição]
- **[Nome Completo]** - [Matrícula] - [Papel/Contribuição]
- **[Nome Completo]** - [Matrícula] - [Papel/Contribuição]

### Papéis e Contribuições Principais

- **Desenvolvimento Frontend:** [Nomes]
- **Desenvolvimento Backend:** [Nomes]
- **Banco de Dados:** [Nomes]
- **Testes:** [Nomes]
- **Documentação:** [Nomes]
- **Validação com Público-Alvo:** [Nomes]

---

## Estrutura do Repositório

```
REDMAX/
├── app/                  # Frontend Next.js (páginas e rotas)
├── components/           # Componentes React
├── contexts/             # Context API
├── frontend/
│   └── web/             # Configurações do frontend (opcional)
├── backend/             # Backend Express
│   ├── src/             # Código-fonte
│   └── prisma/          # Schema e migrations
├── documentation/       # Documentação técnica
│   ├── requirements.md
│   ├── architecture.md
│   └── api.md
├── database/            # Scripts de banco de dados
│   └── schema.sql
├── validation/          # Validação com público-alvo
│   ├── target_audience.md
│   ├── validation_report.md
│   ├── feedback/
│   └── evidence/
└── README.md
```

## Links Úteis

- **Documentação da API:** [documentation/api.md](./documentation/api.md)
- **Arquitetura do Sistema:** [documentation/architecture.md](./documentation/architecture.md)
- **Requisitos:** [documentation/requirements.md](./documentation/requirements.md)
- **Relatório de Validação:** [validation/validation_report.md](./validation/validation_report.md)

## Contribuição para o ODS 11

Este projeto contribui para o **Objetivo de Desenvolvimento Sustentável 11 (Cidades e Comunidades Sustentáveis)** através da promoção de educação de qualidade e acessível, democratizando o acesso a ferramentas de preparação para o ENEM e apoiando o desenvolvimento de habilidades de escrita e argumentação essenciais para a formação de cidadãos mais preparados.

Para mais informações sobre o ODS 11: https://brasil.un.org/pt-br/sdgs/11

---

**Desenvolvido com ❤️ para ajudar estudantes a alcançarem a nota 1000 no ENEM.**
