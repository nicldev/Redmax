# 🚀 Instruções de Instalação e Execução

## Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn

## Passos para executar

1. **Instalar dependências:**
```bash
npm install
```

2. **Executar em modo desenvolvimento:**
```bash
npm run dev
```

3. **Acessar no navegador:**
```
http://localhost:3000
```

## 📄 Páginas disponíveis

- `/` - Landing Page (Home)
- `/login` - Página de login
- `/cadastro` - Página de cadastro
- `/dashboard` - Dashboard principal
- `/redacoes` - Histórico de redações
- `/redacoes/nova` - Criar nova redação
- `/redacoes/[id]/resultado` - Resultado da avaliação
- `/roadmap` - Roadmap de estudos
- `/perfil` - Perfil do usuário

## 🎨 Características do Design

✅ Estilo Notion-like implementado
✅ Paleta de cores suave (#F7F7F5)
✅ Tipografia Inter
✅ Cards com bordas leves
✅ Layout modular e limpo
✅ Responsivo

## 📦 Estrutura do Projeto

```
REDMAX/
├── app/                    # Páginas Next.js
│   ├── page.tsx           # Landing page
│   ├── dashboard/         # Dashboard
│   ├── redacoes/          # Páginas de redações
│   ├── roadmap/           # Roadmap
│   └── perfil/            # Perfil
├── components/            # Componentes reutilizáveis
│   ├── Card.tsx
│   ├── Button.tsx
│   ├── Heading.tsx
│   └── Header.tsx
└── package.json
```

## 🔧 Tecnologias Utilizadas

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Lucide React (ícones)

