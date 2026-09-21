---
name: ui-design-system
description: Diretrizes oficiais, tokens de design, regras de layout em 3 seções, paleta CSFA, tipografia, espaçamentos e altura fixa de containers para manter 100% de consistência visual no app-cms-csfa.
---

```yaml
nome: ui-design-system
versão: 1.1.0
data_criacao: 2026-09-13
escopo: projeto
funcao: Guia mestre de padronização visual, tokens e regras de UI/UX do CSFA CMS
```

# 🎨 CSFA CMS — Sistema de Design & Padronização de UI

Esta skill estabelece a especificação canônica de Design System, tokens visuais, dimensões, hierarquia tipográfica e padrões de tela para o **CSFA CMS** (`app-cms-csfa`), garantindo paridade estética e estrutural em 100% das páginas.

---

## 📐 1. Estrutura Padrão de Página (Layout de 3 Seções)

Todas as telas do painel CMS (Posts, Usuários, Banners, Agenda, Tags, Dashboard) seguem obrigatoriamente a estrutura vertical de 3 seções com espaçamento `space-y-5 sm:space-y-6 pb-12 sm:pb-16`:

```text
+-----------------------------------------------------------------------------------+
| 1. SEÇÃO DE CABEÇALHO (Título + Subtítulo à esq. | Botão de Ação Primária à dir.) |
+-----------------------------------------------------------------------------------+
| 2. SEÇÃO DE CARDS MÉTRICOS (Grid de 3 Cards: grid-cols-1 sm:grid-cols-3 gap-3/4)  |
+-----------------------------------------------------------------------------------+
| 3. SEÇÃO PRINCIPAL (Card Branco rounded-3xl border border-gray-200/80 shadow-xs,  |
|    min-h-[460px] flex flex-col justify-between, Filtros no Topo, Tabela de 5 itens |
|    e Barra de Paginação Numérica no Rodapé)                                       |
+-----------------------------------------------------------------------------------+
```

---

## 🎨 2. Paleta de Cores e Tokens CSFA

| Token / Cor | Valor Hex / Tailwind | Aplicação Obrigatória |
| :--- | :--- | :--- |
| **Marinho Primário** | `#0f1e36` (`bg-[#0f1e36]`) | Títulos, botões primários, texto principal, badges dark |
| **Ciano CSFA** | `#44abff` (`text-[#44abff]`) | Ícones de destaque, links, foco de inputs, badges de acento |
| **Verde Sucesso** | `#10b981` (`emerald-600`) | Status **Ativo** / **Publicado**, métricas de alta |
| **Vermelho Perigo** | `#f43f5e` (`rose-600`) | Status **Bloqueado** / **Inativo**, botões de exclusão |
| **Âmbar Alerta** | `#f59e0b` (`amber-600`) | Status **Rascunho** / **Expediente**, avisos de atenção |
| **Fundo da Aplicação** | `#f8fafc` (`bg-slate-50`) | Canvas de fundo da tela e área do dashboard |
| **Bordas Sutis** | `border-gray-200/80` | Separadores de cards, modais e linhas de tabela |

---

## 📏 3. Regras de Arredondamento (Border Radius)

1. **Containers Principais & Modais**: `rounded-3xl` (24px)
2. **Cards Métricos do Topo & Botões de Ação**: `rounded-2xl` (16px)
3. **Badges de Status, Inputs & Modais Internos**: `rounded-xl` (12px)
4. **Pills de Filtro / Abas**: `rounded-2xl` ou `rounded-full`

---

## 📐 4. Espaçamentos em 3 Escalas

### Escala Pequena (`sm`) — Elementos Internos & Linhas de Tabela:
- Padding: `p-3` ou `px-3 py-1.5`
- Gap: `gap-2` (8px)

### Escala Média (`md`) — Cards Métricos & Controles:
- Padding: `p-4 sm:p-5`
- Gap: `gap-3` (12px)

### Escala Grande (`lg`) — Main Section & Container da Página:
- Padding: `p-5 sm:p-6`
- Gap: `gap-5 sm:gap-6` (20px a 24px)
- Margem da Página: `space-y-5 sm:space-y-6`

---

## 🔒 5. Altura do Container Principal (`min-h-[460px]`) & Espaço de Rodapé

Para evitar pulos de layout e garantir estabilidade visual:
1. O card principal de tabelas e listagens possui **altura mínima fixa de `min-h-[460px]` com `flex flex-col justify-between`**.
2. **Espaço Livre Inferior (Workspace Clearance)**: Toda página inclui `pb-12 sm:pb-16` para garantir que botões de ação e paginação jamais fiquem cobertos pela barra de tarefas do sistema.
3. Se a busca retornar **0 registros**, exibe `<EmptyState />` centralizado preservando a altura total.
4. Ao exibir de **1 a 5 registros**, a paginação permanece fixada no rodapé inferior do card branco.

---

## 📄 6. Paginação Padronizada

- **Limite por Página**: Exatamente **5 itens por página** em todas as tabelas.
- **Componente**: Reutilizar sempre `<Pagination />` de `@/components/common`.
  - Lado esquerdo: Contador de registros formatado (`Exibindo 1 a 5 de 12 registros`).
  - Lado direito: Botões de navegação numéricos com indicador de página ativa.

---

## 🔤 7. Hierarquia Tipográfica

- **Título de Página**: `text-xl sm:text-2xl font-black tracking-tight text-[#0f1e36]`
- **Subtítulo de Página**: `text-xs sm:text-sm text-gray-500 mt-0.5`
- **Título de Card Métrico**: `text-[10px] font-bold text-gray-400 uppercase tracking-wider`
- **Valor Métrico**: `text-xl sm:text-2xl font-black text-[#0f1e36]`
- **Cabeçalho de Tabela**: `text-[10px] font-bold text-gray-400 uppercase tracking-wider`
- **Texto Principal de Linha**: `text-xs sm:text-sm font-bold text-[#0f1e36]`
- **Texto Secundário / Data**: `text-[11px] sm:text-xs text-gray-500 font-medium`
