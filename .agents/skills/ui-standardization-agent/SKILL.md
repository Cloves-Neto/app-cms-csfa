---
nome: ui-standardization-agent
versão: 1.0.0
data_criacao: 2026-09-16
escopo: projeto
funcao: Padronização de UI e Design System (Filtros, Buscas, Tabelas e Cabeçalhos)
---

# UI Standardization Agent

Este agente é responsável por garantir e impor os padrões visuais e o Design System do `app-cms-csfa`. Ele atua como um "architecture-guard" focado puramente no aspecto da interface.

## Regras de Componentes Comuns

### Barra de Filtros e Busca (Filter Bar & Search Bar)
Toda página do painel administrativo (como Materiais, Postagens, Logs, Revisões, Tags, Banners) deve apresentar seus controles de filtro no seguinte layout padronizado:

1. **Contêiner Principal:**
   O encapsulamento da barra deve ser feito com um container branco com bordas sutis e sombra suave, utilizando as seguintes classes utilitárias exatas:
   `className="bg-white rounded-3xl border border-gray-100 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0"`

2. **Lado Esquerdo (Abas/Tabs):**
   Deve conter os filtros de listagem agrupados em formato de abas roláveis horizontalmente, evitando botões modais ou drop-downs complicados sempre que possível.
   `className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0"`
   Abas ativas devem ter a cor de destaque (ex: `bg-[#0f1e36] text-white`).
   Abas inativas devem ser sutis (ex: `bg-gray-50 text-gray-600 hover:bg-gray-100`).

3. **Lado Direito (Barra de Busca):**
   A busca ("Search Bar") deve SEMPRE ser mantida compacta e alinhada à direita em resoluções grandes.
   Não deve usar `flex-1` ou expandir indefinidamente em telas largas se estiver concorrendo com muito espaço em branco. O tamanho sugerido é fixar `md:w-64` ou `md:w-72`.
   - Contêiner: `className="relative flex-1 md:w-64"`
   - Ícone: Um ícone de lupa posicionado à esquerda de forma absoluta (`absolute left-3 top-1/2 -translate-y-1/2 text-gray-400`).
   - Input de Texto: `className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/30 text-[#0f1e36]"`

4. **Botões de Filtros Avançados ("Filter Button"):**
   Por definição de design, botões adicionais de filtro que não estejam inseridos dentro das lógicas da barra ou modais sob demanda DEVEM SER REMOVIDOS para limpar e simplificar a UI.

### Responsabilidade na Aplicação
Nenhum agente ou IA operando neste projeto está autorizado a criar variações de barras de ferramentas ou search bars que fujam a este padrão visual e de estrutura do DOM, a não ser por ordem expressa do usuário com o comando "Ignorar UI Standardization".
