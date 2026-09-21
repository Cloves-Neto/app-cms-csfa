---
name: architecture-guard
description: Regras, diretrizes e checklist de validação arquitetural para garantir o desacoplamento, evitar monólitos, auditar limites de arquivos e preservar a Clean Architecture no app-cms-csfa.
---

```yaml
nome: architecture-guard
versão: 1.0.0
data_criacao: 2026-09-13
escopo: projeto
funcao: Auditoria e guarda de conformidade arquitetural no frontend
```

# 🛡️ Architecture Guard — Diretrizes & Auditoria

Esta skill define as regras inegociáveis de arquitetura, limites de responsabilidade e checklists de revisão de código para manter o **CSFA CMS** modular, sustentável e livre de monolitos.

---

## 🚫 Regras Anti-Monólito (Invioláveis)

1. **Proibido `fetch` ou `axios` dentro de componentes React**:
   - Todo acesso HTTP deve residir exclusivamente em `src/features/{domain}/services/` ou `src/core/http/`.
   - Componentes React recebem dados via props ou Custom Hooks.

2. **Limite de Tamanho de Arquivos**:
   - **Páginas orquestradoras (`src/pages/*.tsx`)**: Máximo de **80 linhas**.
   - **Componentes de UI (`components/*.tsx`)**: Máximo de **150 linhas**. Se passar disso, deve ser decomposto em subcomponentes.
   - **Hooks (`hooks/use*.ts`)**: Focados exclusivamente em estado da UI, delegação de chamadas e computações derivadas (`useMemo`/`useCallback`).

3. **Uso Obrigatório do Alias `@/`**:
   - Proibido uso de imports relativos profundos como `../../../../core/http`.
   - Use sempre `@/core`, `@/features`, `@/components`, `@/routes`, `@/shared`.

4. **Injeção de Dependências em Serviços e Hooks**:
   - Serviços devem aceitar `HttpClient` no construtor com fallback para a instância padrão.
   - Hooks devem aceitar a instância do serviço por parâmetro padrão para facilitar testes unitários e mocks.

---

## 📐 Camadas e Fluxo Unidirecional

```text
[ Página Orquestradora ] (src/pages/Users.tsx)
          ↓
[ Feature Hook ] (useUsers.ts)
          ↓
[ Feature Service ] (user.service.ts)
          ↓
[ Core HTTP Client ] (src/core/http/axios-http-client.ts)
          ↓
[ Backend API ] (/api/users)
```

**Regras de Dependência**:
- As **páginas** conhecem as **features** e o **layout**.
- As **features** conhecem o **core** e o **shared**.
- Uma feature **NUNCA** deve importar arquivos internos de outra feature diretamente, exceto via `index.ts` público da feature se estritamente necessário.
- O **core** não conhece nenhuma feature.

---

## 🔍 Checklist de Auditoria de Código (Code Review)

Antes de aprovar qualquer alteração ou merge, verifique:

- [ ] **Desacoplamento de UI e Dados**: O componente renderiza apenas UI? Há lógica de `try/catch` de rede dentro de botões? Se houver, mova para o Hook/Service.
- [ ] **Estado Local vs. Compartilhado**: Estados de formulário/modal estão encapsulados no próprio modal ou no hook da feature?
- [ ] **Reutilização de Design System**: Foram usados os componentes de `src/components/common/` (`Button`, `EmptyState`, `Pagination`, `Skeleton`, `StepWizard`) em vez de recriar estilos do zero?
- [ ] **TypeScript Estrito**: Todas as interfaces e DTOs estão tipadas sem uso de `any`?
- [ ] **Build Limpo**: O comando `npm run build` (`tsc -b && vite build`) roda com 0 erros e 0 warnings de imports não utilizados?
