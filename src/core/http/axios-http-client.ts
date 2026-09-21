import axios from "axios";
import type { AxiosError, AxiosInstance } from "axios";
import type { HttpClient, HttpRequestConfig } from "./http-client.interface";
import {
  ForbiddenError,
  HttpError,
  NetworkError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "./http-errors";

export interface AxiosHttpClientOptions {
  baseURL?: string;
  timeout?: number;
  getToken?: () => string | null;
  onUnauthorized?: () => void;
}

/**
 * Implementação do contrato HttpClient utilizando Axios.
 * Isola completamente a biblioteca Axios do restante da aplicação.
 */
export class AxiosHttpClient implements HttpClient {
  private readonly client: AxiosInstance;
  private readonly getToken?: () => string | null;
  private readonly onUnauthorized?: () => void;

  constructor(options: AxiosHttpClientOptions = {}) {
    this.getToken = options.getToken;
    this.onUnauthorized = options.onUnauthorized;

    this.client = axios.create({
      baseURL: options.baseURL,
      timeout: options.timeout ?? 15000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Interceptor de Requisição: Injeção de Bearer Token
    this.client.interceptors.request.use((config) => {
      if (this.getToken) {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    });

    // Interceptor de Resposta: Normalização e Mapeamento de Erros
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<{ message?: string; error?: string; details?: unknown }>) => {
        if (!error.response) {
          // Erro de rede / timeout
          throw new NetworkError(
            error.message || "Falha de conexão com o servidor",
            error
          );
        }

        const { status, data } = error.response;
        const message = data?.message || data?.error || error.message || "Erro na requisição";

        switch (status) {
          case 401:
            if (this.onUnauthorized) {
              this.onUnauthorized();
            }
            throw new UnauthorizedError(message, data?.details, error);
          case 403:
            throw new ForbiddenError(message, data?.details, error);
          case 404:
            throw new NotFoundError(message, data?.details, error);
          case 400:
          case 422:
            throw new ValidationError(message, data?.details, error);
          default:
            throw new HttpError(message, status, undefined, data?.details, error);
        }
      }
    );
  }

  async get<T>(url: string, config?: HttpRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, {
      params: config?.params,
      headers: config?.headers,
      signal: config?.signal,
      timeout: config?.timeout,
    });
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: HttpRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, {
      params: config?.params,
      headers: config?.headers,
      signal: config?.signal,
      timeout: config?.timeout,
    });
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config?: HttpRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, {
      params: config?.params,
      headers: config?.headers,
      signal: config?.signal,
      timeout: config?.timeout,
    });
    return response.data;
  }

  async patch<T>(url: string, data?: unknown, config?: HttpRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, {
      params: config?.params,
      headers: config?.headers,
      signal: config?.signal,
      timeout: config?.timeout,
    });
    return response.data;
  }

  async delete<T>(url: string, config?: HttpRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, {
      params: config?.params,
      headers: config?.headers,
      signal: config?.signal,
      timeout: config?.timeout,
    });
    return response.data;
  }
}
