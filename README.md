
**Plataforma de avaliação automática e treinamento guiado de redação ENEM**

---

## 📘 **Visão Geral**

O **RedaIA** é uma plataforma web desenvolvida para ajudar estudantes a alcançar o mais próximo possível da **nota 1000 na redação do ENEM**, oferecendo:

* Avaliação automática por IA usando **Google Gemini (API gratuita)**
* Correção completa estruturada nas **5 competências do ENEM**
* Roadmap personalizado de estudos
* Ferramentas de prática contínua (introdução guiada, conclusão guiada, reescrita, cronômetro de simulado)
* Histórico de evolução com gráficos
* Interface simples, intuitiva e responsiva

O projeto foi inteiramente desenvolvido usando o **Cursor**, seguindo boas práticas de desenvolvimento, testes e validação com público real.

---

## 🎯 **Objetivo do Projeto**

Criar um sistema capaz de **avaliar, orientar e treinar redações do ENEM** usando IA, fornecendo devolutivas claras, estruturadas e objetivas, além de um plano progressivo de treino que leva o usuário da base ao avançado.

A proposta principal é aproximar o estudante do formato e critérios avaliativos do ENEM, tornando o processo de aprender redação **mais acessível, interativo e automatizado**.

---

## 🧠 **Principais Funcionalidades**

### ✔️ **1. Avaliação de Redação por IA**

* Envio do texto na plataforma
* IA analisa e devolve:

  * Nota por competência (0–200)
  * Nota total (0–1000)
  * Feedback detalhado
  * Pontos fortes
  * Pontos fracos
  * Sugestões práticas para reescrita

### ✔️ **2. Roadmap de Treinamento**

* Plano adaptativo de 8 a 12 semanas
* Práticas diárias: tese, argumentação, repertório, introdução e conclusão
* Reavaliação semanal e ajuste automático

### ✔️ **3. Ferramentas de Escrita**

* Editor moderno com contagem de palavras
* Modo “Simulado ENEM” (cronômetro de 1h ou 1h30)
* Biblioteca de temas reais e simulados
* Geração de temas inéditos via IA

### ✔️ **4. Dashboard de Evolução**

* Histórico de redações
* Evolução semanal
* Comparação por competência
* Gráficos de progresso

### ✔️ **5. Salvamento e Revisão de Redações**

* Armazenamento de todos os textos
* Comparação entre versões
* Reescrita orientada

---

## 🏗️ **Arquitetura do Sistema**

### **Frontend**

* React + TypeScript (Vite)
* TipTap ou Draft.js como editor
* PWA (funciona no celular)

### **Backend**

* Node.js + Express
* Integração com API Gemini
* Autenticação JWT
* Validação robusta de respostas da IA

### **Banco de Dados**

* PostgreSQL
  Tabelas:
* users
* writings
* evaluations
* roadmap_plans
* practice_sessions

---

## 📡 **API — Endpoints Principais**

```
POST /api/auth/register
POST /api/auth/login
GET  /api/user/profile

POST /api/writes               -> cria redação
POST /api/writes/:id/evaluate  -> avaliação via IA
GET  /api/writes               -> lista redações
GET  /api/writes/:id           -> redação + feedback

GET  /api/stats                -> métricas do usuário
GET  /api/roadmap              -> roadmap personalizado
```

Documentação completa da API está em:
`/docs/api/api_documentation.md`

---

## 🤖 **Avaliação via IA (Gemini)**

A avaliação segue rigorosamente as 5 competências do ENEM:

* C1: Domínio da escrita formal
* C2: Compreensão do tema
* C3: Argumentação
* C4: Coesão e coerência
* C5: Proposta de intervenção

A IA retorna JSON estruturado contendo notas e feedback por competência.

> O prompt completo utilizado está no arquivo
> `/backend/src/ai/promptTemplate.ts`.

---

## 📁 **Estrutura do Repositório**

Conforme exigido:

```
/
├── README.md
├── docs/
│   └── api/api_documentation.md
├── validation/
│   ├── target_audience.md
│   ├── validation_report.md
│   ├── evidence/
│   └── feedback/
├── frontend/
│   └── web/
├── backend/
│   ├── src/
│   ├── tests/
│   └── package.json
└── database/
    └── schema.sql
```

---

## ✔️ **Validação com Público-Alvo**

A validação foi feita conforme orientado no documento fornecido.

Documentos disponíveis em `/validation/`:

* `target_audience.md` – definição do grupo
* `validation_report.md` – relatório de validação real
* Pasta `evidence/` – prints, fotos, gravações autorizadas
* Pasta `feedback/` – formulários respondidos (CSV/PDF)

A validação incluiu:

1. Demonstração do sistema
2. Testes com estudantes reais
3. Questionário de usabilidade
4. Ajustes implementados após o feedback

---

## 🧪 **Testes**

O projeto inclui:

* Testes unitários (Jest)
* Testes de integração (rotas principais)
* Testes de contrato JSON do Gemini
* Testes de frontend (React Testing Library)

Rodar testes:

```
npm run test
```

---

## 🚀 **Deploy**

### **Frontend**

Hospedado na Vercel ou Netlify
URL: *[coloque aqui]*

### **Backend**

Hospedado na Render / Railway
URL: *[coloque aqui]*

### **Banco**

PostgreSQL Railway / Supabase

---

## 🔧 **Instalação e Execução Local**

### Clonar:

```
git clone https://github.com/SEU-USUARIO/RedaIA.git
cd RedaIA
```

### Backend:

```
cd backend
npm install
npm run dev
```

### Frontend:

```
cd frontend/web
npm install
npm run dev
```

---

## 📌 **Requisitos Funcionais**

* O usuário deve poder escrever, enviar e avaliar redações
* O sistema deve armazenar histórico completo
* A IA deve fornecer notas por competência
* O sistema deve gerar roadmap de estudo
* Deve haver evidência de validação com público real

---

## 🔒 **Requisitos Não Funcionais**

* Interface responsiva
* Segurança com JWT
* API robusta e validada
* Testes automatizados
* Logs de auditoria
* Tratamento de erros da IA

---

## 💡 **Tecnologias Utilizadas**

* React
* Node.js
* Express
* PostgreSQL
* Gemini API
* TypeScript
* Jest
* Vite
* Cursor (IDE assistida por IA)

---

## 📄 **Licença**

MIT.

---

## 👨‍💻 Devs


