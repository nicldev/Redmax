# 📝 Sistema de Tipografia - RedaIA

Documentação completa do sistema de tipografia do projeto RedaIA.

## 🎨 Famílias Tipográficas

### 1. Sans-serif (Inter) - Fonte Base
**Uso:** 75-80% da interface

- Menus e navegação
- Botões e ações
- Formulários e inputs
- Texto corrido e parágrafos
- Descrições e labels
- Cards e componentes
- Corpo de texto geral

**Variável CSS:** `var(--font-sans)`
**Classe Tailwind:** `font-sans` (padrão)

### 2. Serif (Lora) - Títulos e Destaques
**Uso:** 15% da interface

- Apenas H1 e H2
- Títulos de seções importantes
- Headlines principais
- **NÃO usar** em parágrafos pequenos
- **NÃO usar** em texto corrido

**Variável CSS:** `var(--font-serif)`
**Classe Tailwind:** `font-serif`
**Classes utilitárias:**
- `.title-serif` - Para H1
- `.section-title-serif` - Para H2

### 3. Monospace (Fira Code) - Elementos Técnicos
**Uso:** 10% da interface

- Números importantes (notas, estatísticas)
- Tags e badges
- Valores e IDs
- Status técnicos
- Blocos de código
- Timestamps e códigos

**Variável CSS:** `var(--font-mono)`
**Classe Tailwind:** `font-mono`
**Classes utilitárias:**
- `.mono` - Texto monospace genérico
- `.number-mono` - Números com tabular-nums
- `.code-block` - Blocos de código

## 📏 Escala Tipográfica

### H1 - Título Principal
```css
font-family: serif (Lora)
font-size: clamp(42px, 5vw, 56px)
font-weight: 600
line-height: 1.35
letter-spacing: -0.02em
```
**Uso:** Título principal da página, hero sections

### H2 - Título de Seção
```css
font-family: serif (Lora)
font-size: clamp(32px, 4vw, 40px)
font-weight: 600
line-height: 1.4
letter-spacing: -0.01em
```
**Uso:** Títulos de seções importantes, seções principais

### H3 - Subtítulo
```css
font-family: sans (Inter)
font-size: clamp(24px, 3vw, 28px)
font-weight: 600
line-height: 1.45
```
**Uso:** Subtítulos, títulos de cards, seções menores

### H4 - Subtítulo Menor
```css
font-family: sans (Inter)
font-size: clamp(20px, 2.5vw, 24px)
font-weight: 600
line-height: 1.5
```
**Uso:** Subtítulos de componentes, labels importantes

### Body Large - Texto Grande
```css
font-family: sans (Inter)
font-size: 18px
line-height: 1.6
```
**Uso:** Texto introdutório, descrições importantes

### Body - Texto Padrão
```css
font-family: sans (Inter)
font-size: 16px
line-height: 1.6
```
**Uso:** Texto corrido padrão, parágrafos, conteúdo geral

### Small - Texto Pequeno
```css
font-family: sans (Inter)
font-size: 14px
line-height: 1.5
```
**Uso:** Labels, metadados, informações secundárias

### Mono - Texto Monospace
```css
font-family: mono (Fira Code)
font-size: 14-15px
line-height: 1.4-1.6
```
**Uso:** Números, códigos, valores técnicos

## 🎯 Proporção Recomendada

- **Sans (Inter):** 75-80% da interface
- **Serif (Lora):** 15% da interface (apenas títulos)
- **Mono (Fira Code):** 10% da interface (elementos técnicos)

## 📋 Classes Utilitárias Disponíveis

### Serif
- `.title-serif` - Para títulos principais (H1)
- `.section-title-serif` - Para títulos de seção (H2)

### Monospace
- `.mono` - Texto monospace genérico
- `.number-mono` - Números com tabular-nums (alinhamento perfeito)
- `.code-block` - Blocos de código

### Tamanhos
- `.body-large` - Texto grande (18px)
- `.body` - Texto padrão (16px)
- `.small` - Texto pequeno (14px)

## 💡 Exemplos de Uso

### Título Principal (H1)
```tsx
<h1 className="title-serif text-[clamp(42px,5vw,56px)]">
  A forma mais moderna de treinar redação
</h1>
```

### Título de Seção (H2)
```tsx
<h2 className="section-title-serif text-[clamp(32px,4vw,40px)]">
  Como funciona
</h2>
```

### Número Importante
```tsx
<span className="number-mono text-4xl font-semibold">
  740/1000
</span>
```

### Badge/Tag
```tsx
<span className="mono text-xs px-2 py-1 bg-gray-100 rounded">
  AVALIADA
</span>
```

### Texto Corrido
```tsx
<p className="body text-secondary">
  Receba notas de 0 a 1000 com correção automática...
</p>
```

## ✅ Regras de Uso

### ✅ FAZER
- Usar serif apenas em H1 e H2
- Usar sans como padrão para todo conteúdo
- Usar mono para números, códigos e valores técnicos
- Manter line-height entre 1.35-1.6
- Usar clamp() para responsividade tipográfica

### ❌ NÃO FAZER
- Não usar serif em parágrafos
- Não usar serif em texto pequeno
- Não usar mono em texto corrido
- Não misturar fontes sem necessidade
- Não usar tamanhos fixos (preferir clamp)

## 🔄 Responsividade

Todos os tamanhos usam `clamp()` para responsividade automática:

```css
/* Exemplo H1 */
font-size: clamp(42px, 5vw, 56px);
/* Mínimo: 42px, Ideal: 5vw, Máximo: 56px */
```

Isso garante que a tipografia se adapte perfeitamente a qualquer tamanho de tela.

## 🎨 Hierarquia Visual

1. **H1 (Serif)** - Maior impacto, hero sections
2. **H2 (Serif)** - Seções principais
3. **H3 (Sans)** - Subtítulos, cards
4. **Body (Sans)** - Conteúdo principal
5. **Mono** - Dados técnicos, números

---

**Última atualização:** 2024
**Versão:** 1.0.0

