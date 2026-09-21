---
name: component-authoring
description: Diretrizes e padrões para criação de microcomponentes de UI, modais, tabelas, filtros e uso do Design System comum no app-cms-csfa.
---

```yaml
nome: component-authoring
versão: 1.0.0
data_criacao: 2026-09-13
escopo: projeto
funcao: Padrões de desenvolvimento de componentes de interface no CSFA CMS
```

# 🧩 Component Authoring — Padrões de UI & Design System

Esta skill padroniza a criação de componentes de interface visual no **CSFA CMS**, garantindo consistência estética, alto desempenho e máxima reutilização, em total conformidade com a skill `ui-design-system`.

---

## 🎨 Componentes do Design System (`src/components/common/`)

Sempre reutilize os componentes base antes de criar elementos ad-hoc:

### 1. `Button`
```tsx
import { Button } from "@/components/common";
import { Plus } from "lucide-react";

<Button variant="primary" size="md" icon={<Plus className="w-4 h-4" />} onClick={handleCreate}>
  Novo Registro
</Button>
```
- **Variantes**: `primary`, `secondary`, `outline`, `ghost`, `danger`.
- **Tamanhos**: `sm`, `md`, `lg`.

### 2. `StepWizard`
Usado em formulários complexos e modais com múltiplas etapas (ex: cadastro de usuários):
```tsx
import { StepWizard, type Step } from "@/components/common";

const steps: Step[] = [
  { id: 1, title: "Dados Gerais", subtitle: "Identificação" },
  { id: 2, title: "Permissões", subtitle: "Acessos do Usuário" },
];

<StepWizard steps={steps} currentStep={currentStep} onStepClick={(id) => setCurrentStep(id)} />
```

### 3. `EmptyState`
Usado em listas e tabelas quando nenhum resultado for encontrado:
```tsx
import { EmptyState } from "@/components/common";

<EmptyState
  title="Nenhum item cadastrado"
  description="Clique no botão acima para adicionar o primeiro registro."
  actionLabel="Criar Registro"
  onAction={handleNew}
/>
```

### 4. `TableSkeleton` & `CardsSkeleton`
Para feedback visual instantâneo durante carregamento de dados:
```tsx
import { TableSkeleton } from "@/components/common";

{isLoading ? <TableSkeleton rows={5} /> : <MyTable items={items} />}
```

### 5. `Pagination`
Para navegação de dados paginados:
```tsx
import { Pagination } from "@/components/common";

<Pagination
  currentPage={page}
  totalPages={totalPages}
  totalItems={totalItems}
  itemsPerPage={limit}
  onPageChange={setPage}
/>
```

---

## 🪟 Padrão de Modais (`FormModal`)

Todo modal de formulário deve seguir a estrutura:

1. **Backdrop com blur suave**: `fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in`.
2. **Container com cantos arredondados e sombra elegante**: `bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-2xl w-full overflow-hidden`.
3. **Cabeçalho com botão fechar**: Título descritivo + botão `X`.
4. **Corpo com scroll se necessário**: `max-h-[75vh] overflow-y-auto p-6`.
5. **Rodapé com ações**: Botão de cancelamento e botão primário com estado de loading.

---

## 🎯 Padrão de Linhas de Tabela (`TableRow`)

As linhas de tabela devem:
- Possuir hover elegante com transição suave (`hover:bg-blue-50/40 transition-colors`).
- Ter ações agrupadas à direita com botões de ícone consistentes (`Editar`, `Alternar Status`, `Excluir`).
- Usar badges padronizados para status (ativo/inativo) e categorias.
