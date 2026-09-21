---
name: feature-scaffolding
description: Guia e modelo estrutural para criar e organizar novos módulos e domínios de negócio sob `src/features/{domain}` no app-cms-csfa, garantindo arquitetura limpa, desacoplamento e ausência de monolitos.
---

```yaml
nome: feature-scaffolding
versão: 1.0.0
data_criacao: 2026-09-13
escopo: projeto
funcao: Padronização da criação de novos domínios e módulos no frontend CSFA CMS
```

# 🏗️ Feature Scaffolding — Padrão de Novos Domínios

Esta skill define o processo obrigatório para criação de qualquer nova feature ou domínio de negócio no **CSFA CMS** (`app-cms-csfa`), garantindo que o código permaneça modular, desacoplado e escalável.

---

## 📁 Estrutura de Diretórios de uma Feature

Ao criar uma nova funcionalidade (ex: `notificacoes`, `relatorios`, `matriculas`), a estrutura dentro de `src/features/{nome-dominio}/` DEVE seguir rigorosamente a árvore abaixo:

```text
src/features/{domain}/
├── components/          # Microcomponentes de UI específicos do domínio
│   ├── {Domain}Header.tsx      # Cabeçalho com títulos e CTAs
│   ├── {Domain}StatsCards.tsx  # Cards de resumo/métricas
│   ├── {Domain}Filters.tsx     # Barra de filtros e busca
│   ├── {Domain}Table.tsx       # Tabela de listagem
│   ├── {Domain}TableRow.tsx    # Linha individual de item com ações
│   └── {Domain}FormModal.tsx   # Modal/formulário de criação ou edição
├── hooks/               # Custom hooks com lógica de estado e orquestração
│   └── use{Domain}.ts          # Hook principal de estado, filtros e mutações
├── services/            # Camada de comunicação com a API (HTTP)
│   └── {domain}.service.ts     # Classe de serviço com injeção do HttpClient
├── types/               # Tipos TypeScript, interfaces e DTOs
│   └── {domain}.types.ts       # Modelos de dados e payloads de entrada
└── index.ts             # Ponto único de exportação da feature
```

---

## 📋 Passo a Passo para Criar uma Nova Feature

### Passo 1: Definir os Tipos (`types/{domain}.types.ts`)
Defina as entidades e os DTOs de criação/atualização:

```typescript
export interface CustomItem {
  id: number;
  title: string;
  status: "active" | "inactive";
  createdAt: string;
}

export interface CreateCustomItemInput {
  title: string;
  status?: "active" | "inactive";
}

export interface UpdateCustomItemInput {
  title?: string;
  status?: "active" | "inactive";
}
```

---

### Passo 2: Implementar o Service (`services/{domain}.service.ts`)
O serviço encapsula as chamadas HTTP recebendo a dependência `HttpClient`:

```typescript
import { httpClient, type HttpClient } from "@/core/http";
import type { CustomItem, CreateCustomItemInput } from "../types/{domain}.types";

export class CustomItemService {
  constructor(private readonly client: HttpClient = httpClient) {}

  async getAll(): Promise<CustomItem[]> {
    const response = await this.client.get<CustomItem[]>("/custom-items");
    return response.data;
  }

  async create(data: CreateCustomItemInput): Promise<CustomItem> {
    const response = await this.client.post<CustomItem>("/custom-items", data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await this.client.delete(`/custom-items/${id}`);
  }
}

export const customItemService = new CustomItemService();
```

---

### Passo 3: Criar o Custom Hook (`hooks/use{Domain}.ts`)
O hook gerencia todo o estado da tela, filtros, modais e feedback:

```typescript
import { useState, useEffect, useCallback, useMemo } from "react";
import { customItemService, type CustomItemService } from "../services/{domain}.service";
import type { CustomItem, CreateCustomItemInput } from "../types/{domain}.types";

export function useCustomItems(service: CustomItemService = customItemService) {
  const [items, setItems] = useState<CustomItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CustomItem | null>(null);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await service.getAll();
      setItems(data);
    } catch (err) {
      console.error("Erro ao carregar itens:", err);
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  return {
    items: filteredItems,
    rawItems: items,
    isLoading,
    searchTerm,
    setSearchTerm,
    isModalOpen,
    setIsModalOpen,
    editingItem,
    setEditingItem,
    reload: loadData,
  };
}
```

---

### Passo 4: Criar os Microcomponentes de UI (`components/`)
Divida a tela em partes independentes e coesas:
- `{Domain}Header.tsx`: Apenas título, descrição e botão de ação principal.
- `{Domain}Filters.tsx`: Campo de busca e filtros de status.
- `{Domain}Table.tsx`: Tabela com cabeçalhos e delegação de renderização para `{Domain}TableRow`.
- `{Domain}FormModal.tsx`: Modal isolado com formulário e validação.

---

### Passo 5: Exportar na Raiz da Feature (`index.ts`)
```typescript
export * from "./types/{domain}.types";
export * from "./services/{domain}.service";
export * from "./hooks/use{Domain}";
export * from "./components/{Domain}Header";
export * from "./components/{Domain}Filters";
export * from "./components/{Domain}Table";
export * from "./components/{Domain}FormModal";
```

---

### Passo 6: Conectar à Página Orquestradora (`src/pages/{Domain}.tsx`)
A página deve ter **no máximo 60-80 linhas**, apenas conectando o hook aos componentes:

```tsx
import { useCustomItems, CustomHeader, CustomFilters, CustomTable, CustomFormModal } from "@/features/{domain}";

export default function CustomPage() {
  const {
    items,
    isLoading,
    searchTerm,
    setSearchTerm,
    isModalOpen,
    setIsModalOpen,
    editingItem,
    setEditingItem,
  } = useCustomItems();

  return (
    <div className="space-y-6">
      <CustomHeader onNew={() => { setEditingItem(null); setIsModalOpen(true); }} />
      <CustomFilters searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <CustomTable items={items} isLoading={isLoading} />
      <CustomFormModal
        isOpen={isModalOpen}
        editingItem={editingItem}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
```
