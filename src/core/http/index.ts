import { envConfig } from "../config/env.config";
import { AxiosHttpClient } from "./axios-http-client";
import type { AxiosHttpClientOptions } from "./axios-http-client";
import type { HttpClient } from "./http-client.interface";

export type { HttpClient, HttpRequestConfig } from "./http-client.interface";
export { AxiosHttpClient } from "./axios-http-client";
export type { AxiosHttpClientOptions } from "./axios-http-client";
export {
  HttpError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
  NetworkError,
} from "./http-errors";
export type { ApiResponse, PaginatedResponse, PaginationMeta } from "./types";

/**
 * Factory para criar clientes HTTP customizados (ex: instâncias secundárias ou com configurações especiais).
 */
export function createHttpClient(options?: AxiosHttpClientOptions): HttpClient {
  return new AxiosHttpClient({
    baseURL: options?.baseURL ?? envConfig.api.baseURL,
    timeout: options?.timeout ?? envConfig.api.timeoutMs,
    getToken:
      options?.getToken ??
      (() => {
        try {
          return localStorage.getItem(envConfig.auth.tokenStorageKey);
        } catch {
          return null;
        }
      }),
    onUnauthorized:
      options?.onUnauthorized ??
      (() => {
        // Dispara evento customizado para permitir que AuthContext ou Router capture 401 sem acoplamento direto
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("auth:unauthorized"));
        }
      }),
  });
}

/**
 * Instância Singleton padrão do cliente HTTP da aplicação.
 * Injeta token automaticamente a partir do localStorage e trata erros padronizados.
 */
export const httpClient: HttpClient = createHttpClient();
