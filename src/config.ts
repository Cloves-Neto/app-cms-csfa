/**
 * Configuração central da aplicação.
 *
 * Centraliza valores que hoje estão hardcoded/pulverizados:
 * - `http://localhost:3000` → em `Login.tsx:18` e `docs/integration.md`;
 * - chave `"token"` do localStorage → em `App.tsx:17`, `Login.tsx:24`,
 *   `DashboardLayout.tsx:47`.
 *
 * Disparado por `import.meta.env` (Vite), então pode ser sobrescrito por
 * `.env.local` sem tocar no código:
 * - `VITE_API_BASE_URL`
 * - `VITE_TOKEN_STORAGE_KEY`
 */
export const config = {
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000",
  },
  auth: {
    tokenStorageKey: import.meta.env.VITE_TOKEN_STORAGE_KEY ?? "token",
  },
} as const;
