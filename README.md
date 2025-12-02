# Conexão Saber - Plataforma de Treino de Redação para o ENEM

## 🎥 Vídeo Demonstrativo

Assista ao vídeo demonstrativo do sistema em funcionamento:

**[🎬 Link do vídeo demonstrativo](https://www.youtube.com/watch?v=aIu2M-98hQo&feature=youtu.be)**

## 📋 Objetivo do Projeto

O **Conexão Saber** é uma plataforma multiplataforma desenvolvida para auxiliar estudantes na preparação para a redação do ENEM. O sistema oferece correção automática por Inteligência Artificial, avaliação detalhada por competências e dashboard com métricas de progresso para acompanhamento da evolução do estudante.

### Problema Solucionado

O projeto resolve a dificuldade de estudantes do Ensino Médio em obter correção detalhada e frequente de suas redações, além de acompanhar seu progresso de forma sistemática. Através de correção automática por IA, feedback imediato e acompanhamento de evolução, o sistema democratiza o acesso a ferramentas de preparação para o ENEM, contribuindo para o ODS 11 (Cidades e Comunidades Sustentáveis) através da promoção de educação de qualidade e acessível.

## 🚀 Funcionalidades Implementadas

### ✅ Sistema de Autenticação e Gerenciamento de Usuários
- **Cadastro de usuário** com validação completa de dados
- **Verificação de e-mail** obrigatória para ativação da conta
- **Login seguro** com JWT (access token e refresh token)
- **Gerenciamento de perfil** (visualização, atualização)

### ✅ Editor de Redação
- **Criação de nova redação** com editor de texto intuitivo e limpo
- **Interface focada na escrita** sem distrações
- **Contador de palavras e caracteres** em tempo real
- **Salvamento automático** de rascunhos
- **Seleção de temas** de redação para prática

### ✅ Correção Automática
- **Avaliação por competências** do ENEM (5 competências avaliadas)
  - Competência 1: Domínio da escrita formal
  - Competência 2: Compreensão do tema
  - Competência 3: Argumentação
  - Competência 4: Coesão e coerência
  - Competência 5: Proposta de intervenção
- **Feedback detalhado** por competência com explicações
- **Notas de 0 a 200** por competência (total de 0 a 1000)
- **Análise de pontos fortes** e pontos de melhoria
- **Sugestões de melhoria** específicas para cada competência
- **Visualização de resultados** completa e organizada

### ✅ Dashboard e Estatísticas
- **Métricas de progresso** (total de redações, média de notas)
- **Visualização de evolução** ao longo do tempo
- **Histórico de redações** com acesso rápido a todas as avaliações
- **Gráficos de desempenho** por competência
- **Análise comparativa** entre redações

### ✅ Gerenciamento de Temas
- **Catálogo de temas** de redação para prática
- **Temas organizados por categoria** (Educação, Meio Ambiente, Saúde, etc.)
- **Temas de edições anteriores do ENEM**
- **Criação e gerenciamento de temas** (administradores)

### ✅ Interface e Experiência do Usuário
- **Design moderno** inspirado no Notion
- **Modo escuro/claro** completo
- **Segregação completa entre frontend e backend
- **Navegação intuitiva** e acessível
- **Feedback visual** para todas as ações

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 14** - Framework React com App Router para renderização do lado do servidor
- **React 18** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Linguagem de programação com tipagem estática
- **Tailwind CSS** - Framework CSS utilitário para estilização
- **Axios** - Biblioteca de JavaScript que permite fazer requisições HTTP de maneira simples e eficiente

### Backend
- **Node.js** (>=18) - Runtime JavaScript para execução no servidor
- **Express.js** - Framework web minimalista e flexível
- **TypeScript** - Tipagem estática para maior segurança de código
- **Prisma ORM** - ORM moderno para acesso ao banco de dados
- **PostgreSQL** (>=14) - Sistema de gerenciamento de banco de dados relacional
- **JWT** (jsonwebtoken) - Autenticação stateless com tokens
- **bcrypt** - Biblioteca para hash seguro de senhas
- **Zod** - Biblioteca de validação de schemas
- **Nodemailer** - Envio de e-mails para verificação e recuperação
- **Winston** - Sistema de logging estruturado

### Banco de Dados
- **PostgreSQL** - Banco de dados relacional de código aberto

### Ferramentas de Desenvolvimento
- **Git** - Controle de versão
- **GitHub** - Repositório e colaboração
- **Jest** - Framework de testes unitários e de integração
- **Supertest** - Testes de API HTTP
- **ESLint** - Linter de código para qualidade
- **TypeScript Compiler** - Compilação TypeScript

## 📦 Instruções de Instalação e Execução

### Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** >= 18
- **PostgreSQL** >= 14
- **npm** ou **yarn**
- **Git**

### 1. Clone o Repositório

```bash
git clone https://github.com/nicldev/Conexao-saber-api.git
cd Conexao-saber-api
```

### 2. Configure o Banco de Dados

Crie um banco de dados PostgreSQL:

```bash
psql -U postgres -c "CREATE DATABASE conexao_saber_db;"
```

Ou através do console do PostgreSQL:

```sql
CREATE DATABASE conexao_saber_db;
```

### 3. Configure o Backend

#### 3.1 Instale as Dependências

```bash
cd backend
npm install
```

#### 3.2 Configure as Variáveis de Ambiente

Crie o arquivo `.env` na pasta `backend/`:

```env
# Server
NODE_ENV=development
PORT=3333

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/conexao_saber_db?schema=public"

# JWT Secrets (gere chaves seguras com pelo menos 32 caracteres)
ACCESS_TOKEN_SECRET=sua-chave-secreta-access-token-min-32-caracteres-aqui
REFRESH_TOKEN_SECRET=sua-chave-secreta-refresh-token-min-32-caracteres-aqui

# JWT Expiration (em segundos)
ACCESS_TOKEN_EXPIRES_IN=900
REFRESH_TOKEN_EXPIRES_IN=2592000

# Email (use Mailtrap para desenvolvimento)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=seu-usuario-mailtrap
SMTP_PASS=sua-senha-mailtrap
SMTP_FROM_EMAIL=noreply@conexaosaber.com
SMTP_FROM_NAME=Conexão Saber

# URLs
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**⚠️ Importante:**
- Substitua `postgres:postgres` pelas suas credenciais do PostgreSQL
- Gere chaves secretas seguras para JWT (mínimo de 32 caracteres)
- Configure o Mailtrap (https://mailtrap.io) para desenvolvimento ou outro serviço SMTP

#### 3.3 Configure o Prisma

```bash
# Gerar o cliente Prisma
npm run prisma:generate

# Executar as migrations
npm run prisma:migrate

# (Opcional) Popular o banco com dados de teste
npm run prisma:seed
```

### 4. Configure o Frontend

#### 4.1 Instale as Dependências

```bash
cd ../frontend/web
npm install
```

#### 4.2 Configure as Variáveis de Ambiente

Crie o arquivo `.env.local` na pasta `frontend/web/`:

```env
# URL da API Backend
NEXT_PUBLIC_API_URL=http://localhost:3333
```

## 🚀 Executando o Projeto

### Modo Desenvolvimento

Você precisará de dois terminais abertos:

#### Terminal 1 - Backend

```bash
cd backend
npm run dev
```

O backend estará rodando em: **http://localhost:3333**

#### Terminal 2 - Frontend

```bash
cd frontend/web
npm run dev
```

O frontend estará rodando em: **http://localhost:3000**

### Modo Produção

#### Backend

```bash
cd backend
npm run build
npm start
```

#### Frontend

```bash
cd frontend/web
npm run build
npm start
```

## 📝 Credenciais de Teste

Atualmente, o sistema não possui credenciais de teste pré-configuradas. Para testar o sistema:

1. **Crie uma conta** através da página de cadastro (`/cadastro`)
2. **Verifique seu e-mail** através do link enviado (em desenvolvimento, verifique o Mailtrap ou sua caixa de entrada)
3. **Faça login** com as credenciais criadas
4. **Crie uma redação** escolhendo um tema disponível
5. **Receba a correção automática**

**Nota:** Em produção, as credenciais de teste podem ser fornecidas através de seed de dados ou configuração administrativa.


O vídeo apresenta todas as funcionalidades principais do Conexão Saber, incluindo cadastro, criação de redação, correção automática por IA e visualização de resultados.

## 📚 Documentação Técnica

A documentação técnica completa está disponível na pasta `docs/`:

- **Documentação da API:** [docs/api/api_documentation.md](./docs/api/api_documentation.md)
- **Arquitetura do Sistema:** [docs/architecture/architecture.md](./docs/architecture/architecture.md)
- **Requisitos:** [docs/requirements/requirements.md](./docs/requirements/requirements.md)
- **Relatório de Validação:** [validation/validation_report.md](./validation/validation_report.md)

## 💬 Feedback

Aqui estão os feedbacks coletados dos usuários durante a validação do projeto:

![Feedback 1](./validation/feedback/WhatsApp%20Image%202025-12-01%20at%2008.59.04%20(1).jpeg)
![Feedback 2](./validation/feedback/WhatsApp%20Image%202025-12-01%20at%2008.59.25%20(1).jpeg)
![Feedback 3](./validation/feedback/WhatsApp%20Image%202025-12-01%20at%2008.59.37%20(1).jpeg)
![Feedback 4](./validation/feedback/WhatsApp%20Image%202025-12-01%20at%2008.59.54%20(1).jpeg)
![Feedback 5](./validation/feedback/WhatsApp%20Image%202025-12-01%20at%2009.00.08%20(1).jpeg)
![Feedback 6](./validation/feedback/WhatsApp%20Image%202025-12-01%20at%2009.00.25%20(1).jpeg)
![Feedback 7](./validation/feedback/WhatsApp%20Image%202025-12-01%20at%2009.00.50%20(1).jpeg)
![Feedback 8](./validation/feedback/WhatsApp%20Image%202025-12-01%20at%2009.01.06%20(1).jpeg)
![Feedback 9](./validation/feedback/WhatsApp%20Image%202025-12-01%20at%2009.01.27%20(1).jpeg)
![Feedback 10](./validation/feedback/WhatsApp%20Image%202025-12-01%20at%2009.01.44%20(1).jpeg)
![Feedback 11](./validation/feedback/WhatsApp%20Image%202025-12-01%20at%2009.02.05%20(1).jpeg)
![Feedback 12](./validation/feedback/WhatsApp%20Image%202025-12-01%20at%2009.02.21%20(1).jpeg)
![Feedback 13](./validation/feedback/WhatsApp%20Image%202025-12-01%20at%2009.02.36%20(1).jpeg)
![Feedback 14](./validation/feedback/WhatsApp%20Image%202025-12-01%20at%2009.02.36%20(2).jpeg)
![Feedback 15](./validation/feedback/WhatsApp%20Image%202025-12-01%20at%2009.02.51%20(1).jpeg)
![Feedback 16](./validation/feedback/WhatsApp%20Image%202025-12-01%20at%2009.02.51%20(2).jpeg)

## 📁 Estrutura do Projeto

```
conexaosaber-main/
├── backend/              # Backend Express
│   ├── src/
│   │   ├── controllers/ # Controllers
│   │   ├── routes/      # Rotas da API
│   │   ├── services/    # Lógica de negócio
│   │   ├── middlewares/ # Middlewares
│   │   ├── utils/       # Utilitários
│   │   └── validators/  # Validadores
│   └── prisma/          # Schema e migrations
├── frontend/
│   └── web/             # Frontend Next.js
│       └── src/
│           ├── app/     # Páginas
│           ├── components/ # Componentes React
│           ├── contexts/   # Context API
│           └── lib/       # Bibliotecas e utilitários
├── docs/                # Documentação técnica
├── database/            # Scripts SQL
├── validation/          # Validação com público-alvo
└── README.md
```

## 🧪 Testes

Para executar os testes do backend:

```bash
cd backend
npm test
```

Para executar em modo watch:

```bash
npm run test:watch
```

## 👥 Equipe de Desenvolvimento

| Nome                                      | Matrícula | Papel                            | Principais Contribuições                                                          |
|-------------------------------------------|-----------|----------------------------------|-----------------------------------------------------------------------------------|
| **Nicolas Lima Ribeiro**                  | 2326327   | Frontend & Documentação          | Desenvolvimento da UI, páginas, rotas e documentação do projeto |
| **Thiago Targino de Souza**               | 2326340   | Backend & Banco de Dados         | Modelagem do banco, CRUD, autenticação, serviços e infraestrutura da API          |
| **Rodrigo de Queiroz Oliveira Rodrigues** | 2326198   | QA / Testes                      | Testes funcionais e validação da experiência do usuário                           |
| **Francisco Flavio Rodrigues de Menezes** | 2314219   | QA / Testes                      | Testes, revisão e acompanhamento de funcionalidades                               |
| **Cleberson Assunção Tavares**            | 2325404   | Pesquisa / Feedback com usuários | Validação prática com alunos e coleta de melhorias                                |
| **Mayara Pinto da Silva**                 | 2317573   | QA e Pesquisa                    | Testes e avaliação de usabilidade                                                 |

## 🌱 Contribuição para o ODS 11

Este projeto contribui para o **Objetivo de Desenvolvimento Sustentável 11 (Cidades e Comunidades Sustentáveis)** através da promoção de educação de qualidade e acessível, democratizando o acesso a ferramentas de preparação para o ENEM e apoiando o desenvolvimento de habilidades de escrita e argumentação essenciais para a formação de cidadãos mais preparados.

Para mais informações sobre o ODS 11: https://brasil.un.org/pt-br/sdgs/11

## 📄 Licença
MIT — livre para uso, estudo e melhorias.

> Este projeto foi desenvolvido para fins acadêmicos.

---

**Desenvolvido com ❤️ para ajudar estudantes a alcançarem a nota 1000 no ENEM.**
