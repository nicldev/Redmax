# RedaIA - Plataforma de Treino de Redação para o ENEM

Plataforma moderna inspirada no Notion para treinar redação para o ENEM com correção automática por IA.

## 🚀 Tecnologias

- **Next.js 14** - Framework React
- **TypeScript** - Type safety
- **Tailwind CSS** - Estilização
- **Lucide React** - Ícones

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar produção
npm start
```

## 🎨 Design

O design segue um estilo **Notion-like** com:

- Paleta de cores suave (#F7F7F5 de fundo)
- Tipografia Inter/Rubik/Nunito
- Cards com bordas leves e sombras sutis
- Layout modular e limpo
- Máxima largura de 880px (estilo Notion)

## 📄 Páginas

1. **Landing Page** (`/`) - Página inicial com hero, funcionalidades e CTA
2. **Dashboard** (`/dashboard`) - Visão geral com métricas e últimas redações
3. **Nova Redação** (`/redacoes/nova`) - Editor estilo Notion para escrever
4. **Resultado** (`/redacoes/[id]/resultado`) - Avaliação detalhada por competências
5. **Histórico** (`/redacoes`) - Lista de todas as redações com filtros
6. **Roadmap** (`/roadmap`) - Plano de estudos personalizado
7. **Perfil** (`/perfil`) - Dados do usuário e configurações

## 🧩 Componentes

- `Card` - Card base com estilo Notion
- `Button` - Botões com variantes (primary, secondary, outline)
- `Heading` - Títulos minimalistas
- `Header` - Header fixo com navegação

## 🎯 Próximos Passos

- Integração com API de correção por IA
- Autenticação de usuários
- Banco de dados para persistência
- Sistema de roadmap dinâmico
- Exportação de PDF

