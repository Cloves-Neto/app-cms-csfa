/**
 * Configuração central e imutável de ambiente da aplicação.
 * Lê variáveis do Vite (`import.meta.env`) com fallbacks seguros.
 */
export const envConfig = {
  api: {
    baseURL: import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001",
    timeoutMs: Number(import.meta.env.VITE_API_TIMEOUT ?? 15000),
  },
  auth: {
    tokenStorageKey: import.meta.env.VITE_TOKEN_STORAGE_KEY ?? "token",
    refreshTokenStorageKey: import.meta.env.VITE_REFRESH_TOKEN_STORAGE_KEY ?? "refreshToken",
  },
} as const;

export type EnvConfig = typeof envConfig;
