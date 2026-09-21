---
name: http-service-integration
description: Padrões de comunicação HTTP, consumo de API, tipagem de contratos de dados, tratamento de erros e integração com o backend api-csfa.
---

```yaml
nome: http-service-integration
versão: 1.0.0
data_criacao: 2026-09-13
escopo: projeto
funcao: Padrões de integração de serviços HTTP e tratamento de dados no CSFA CMS
```

# 🌐 HTTP Service Integration — Padrões de API & Contratos

Esta skill define as diretrizes para integração do frontend `app-cms-csfa` com o backend `api-csfa`, padronizando o cliente HTTP, os contratos de requisição/resposta e o tratamento de falhas.

---

## 🔌 Cliente HTTP Centralizado (`src/core/http/`)

Todas as requisições utilizam o contrato `HttpClient`:

```typescript
export interface HttpClient {
  get<T = unknown>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>;
  post<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>>;
  put<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>>;
  patch<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>>;
  delete<T = unknown>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>;
}
```

---

## 📦 Contratos de Resposta Padronizados

O backend retorna respostas estruturadas no padrão:

```typescript
// Resposta padrão
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status: number;
}

// Resposta com paginação
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

---

## 🛡️ Tratamento de Erros

A camada de HTTP converte respostas de erro em classes de erro tipadas:

- `UnauthorizedError` (HTTP 401): Dispara limpeza de sessão e redirecionamento para `/login`.
- `ForbiddenError` (HTTP 403): Bloqueio de acesso por falta de permissão no módulo.
- `NotFoundError` (HTTP 404): Recurso não encontrado.
- `ValidationError` (HTTP 400/422): Erros de validação de campos nos formulários.

### Exemplo de Captura de Erros no Hook:

```typescript
try {
  await service.create(payload);
  toast.success("Item criado com sucesso!");
} catch (error) {
  if (error instanceof ValidationError) {
    toast.error(`Dados inválidos: ${error.message}`);
  } else if (error instanceof UnauthorizedError) {
    // Tratado automaticamente pelo interceptor
  } else {
    toast.error("Erro inesperado ao salvar. Tente novamente.");
  }
}
```

---

## 🔄 Injeção de Dependência & Testabilidade

Sempre exporte tanto a classe quanto a instância singleton do serviço:

```typescript
export class BannerService {
  constructor(private readonly client: HttpClient = httpClient) {}

  async list(page = 1, limit = 10): Promise<Banner[]> {
    const response = await this.client.get<Banner[]>("/banners", {
      params: { page, limit },
    });
    return response.data;
  }
}

// Instância singleton padrão para a aplicação
export const bannerService = new BannerService();
```

Isso permite que testes ou implementações alternativas forneçam um mock do `HttpClient`:

```typescript
const mockHttpClient: HttpClient = {
  get: vi.fn().mockResolvedValue({ data: [], status: 200 }),
  post: vi.fn(),
  put: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
};

const serviceUnderTest = new BannerService(mockHttpClient);
```
