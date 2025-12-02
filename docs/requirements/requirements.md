# Requisitos do Sistema - ConexãoSaber

## 1. Introdução

O ConexãoSaber é uma plataforma multiplataforma desenvolvida para auxiliar estudantes na preparação para a redação do ENEM, oferecendo correção automática por IA e acompanhamento de progresso.

## 2. Objetivo do Projeto

Desenvolver uma solução tecnológica que contribua para o ODS 11 (Cidades e Comunidades Sustentáveis), promovendo educação de qualidade e acessível através de uma plataforma de treino de redação para o ENEM.

## 3. Requisitos Funcionais

### 3.1 Autenticação e Gerenciamento de Usuários

#### RF01 - Cadastro de Usuário
- O sistema deve permitir o cadastro de novos usuários com:
  - Nome completo
  - E-mail válido
  - Senha segura (mínimo 8 caracteres)
  - Escola (opcional)
  - Série/Ano (opcional)
- O sistema deve enviar e-mail de verificação após o cadastro
- O sistema deve impedir cadastro com e-mail duplicado

#### RF02 - Verificação de E-mail
- O sistema deve enviar link de verificação por e-mail
- O sistema deve permitir verificação através de token único
- O sistema deve bloquear acesso até verificação do e-mail

#### RF03 - Login
- O sistema deve permitir login com e-mail e senha
- O sistema deve gerar tokens JWT (access e refresh)
- O sistema deve validar credenciais antes de autenticar

#### RF04 - Gerenciamento de Perfil
- O sistema deve permitir visualização do perfil do usuário
- O sistema deve permitir atualização de dados do perfil
- O sistema deve permitir alteração de senha
- O sistema deve permitir exclusão de conta

### 3.2 Funcionalidades de Redação

#### RF05 - Criação de Redação
- O sistema deve permitir criação de nova redação
- O sistema deve fornecer editor de texto para escrita
- O sistema deve salvar rascunho automaticamente

#### RF06 - Correção Automática por IA
- O sistema deve avaliar redação por competências do ENEM:
  - Competência 1: Domínio da escrita formal
  - Competência 2: Compreensão da proposta
  - Competência 3: Argumentação
  - Competência 4: Coesão e coerência
  - Competência 5: Proposta de intervenção
- O sistema deve fornecer feedback detalhado por competência
- O sistema deve atribuir nota de 0 a 200 por competência

#### RF07 - Histórico de Redações
- O sistema deve exibir lista de redações criadas
- O sistema deve permitir visualização de redações anteriores
- O sistema deve exibir notas e feedbacks anteriores

### 3.3 Dashboard e Estatísticas

#### RF08 - Dashboard Principal
- O sistema deve exibir métricas de progresso:
  - Total de redações realizadas
  - Média de notas
  - Evolução ao longo do tempo
  - Gráficos de desempenho

## 4. Requisitos Não-Funcionais

### 4.1 Performance
- O sistema deve responder requisições em menos de 2 segundos
- O sistema deve suportar pelo menos 100 usuários simultâneos

### 4.2 Segurança
- O sistema deve usar HTTPS em produção
- O sistema deve hash de senhas com bcrypt (salt rounds 12)
- O sistema deve implementar JWT para autenticação
- O sistema deve implementar rate limiting
- O sistema deve validar e sanitizar todas as entradas

### 4.3 Usabilidade
- O sistema deve ter interface responsiva
- O sistema deve suportar modo escuro
- O sistema deve ser acessível (WCAG 2.1 nível AA)

### 4.4 Compatibilidade
- O sistema deve funcionar em navegadores modernos (Chrome, Firefox, Safari, Edge)
- O sistema deve ser responsivo para mobile, tablet e desktop

### 4.5 Confiabilidade
- O sistema deve ter disponibilidade de 99% do tempo
- O sistema deve implementar tratamento de erros adequado
- O sistema deve ter logs estruturados

## 5. Regras de Negócio

### RN01 - Verificação de E-mail
- Usuários não podem acessar funcionalidades principais sem verificar e-mail
- Tokens de verificação expiram em 24 horas

### RN02 - Autenticação
- Access tokens expiram em 15 minutos
- Refresh tokens expiram em 30 dias
- Refresh tokens são rotacionados a cada uso

### RN03 - Redações
- Cada redação deve ter no mínimo 7 linhas
- Cada redação deve ter no máximo 30 linhas
- Redações são avaliadas automaticamente após submissão

## 6. Integrações

### 6.1 Serviço de E-mail
- Integração com SMTP para envio de e-mails
- Suporte a Mailtrap (desenvolvimento) e SMTP real (produção)

### 6.2 Banco de Dados
- PostgreSQL como banco de dados principal
- Prisma ORM para gerenciamento de dados

## 7. Público-Alvo

O sistema é direcionado a:
- Estudantes do Ensino Médio que estão se preparando para o ENEM
- Professores que desejam acompanhar o progresso de seus alunos
- Instituições de ensino que buscam ferramentas educacionais

## 8. Vinculação ao ODS 11

O projeto contribui para o ODS 11 (Cidades e Comunidades Sustentáveis) através de:
- Promoção de educação de qualidade e acessível
- Democratização do acesso a ferramentas de preparação para o ENEM
- Suporte ao desenvolvimento de habilidades de escrita e argumentação
- Contribuição para formação de cidadãos mais preparados

