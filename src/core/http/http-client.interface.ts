/**
 * Configuração de requisição genérica desacoplada de bibliotecas HTTP externas (Axios, Fetch, etc.).
 */
export interface HttpRequestConfig {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  timeout?: number;
  responseType?: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream';
}

/**
 * Contrato universal de cliente HTTP para desacoplamento e injeção de dependência.
 * Permite que Services consumam chamadas HTTP sem se acoplarem diretamente ao Axios.
 */
export interface HttpClient {
  get<T>(url: string, config?: HttpRequestConfig): Promise<T>;
  post<T>(url: string, data?: unknown, config?: HttpRequestConfig): Promise<T>;
  put<T>(url: string, data?: unknown, config?: HttpRequestConfig): Promise<T>;
  patch<T>(url: string, data?: unknown, config?: HttpRequestConfig): Promise<T>;
  delete<T>(url: string, config?: HttpRequestConfig): Promise<T>;
}
