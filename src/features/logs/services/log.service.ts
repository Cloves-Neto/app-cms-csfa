import { httpClient, type HttpClient } from "@/core/http";

export interface AuditLogItem {
  id: string;
  userId?: string | null;
  user?: {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    role?: string;
  } | null;
  action: string;
  module: string;
  details?: string | null;
  ipAddress?: string | null;
  createdAt: string;
}

export interface PaginatedLogsResult {
  items: AuditLogItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class LogService {
  private readonly client: HttpClient;

  constructor(client: HttpClient = httpClient) {
    this.client = client;
  }

  async getLogs(params: { limit?: number; page?: number; module?: string; action?: string } = {}): Promise<PaginatedLogsResult> {
    try {
      const query = new URLSearchParams();
      if (params.limit) query.append("limit", String(params.limit));
      if (params.page) query.append("page", String(params.page));
      if (params.module) query.append("module", params.module);
      if (params.action) query.append("action", params.action);

      const res = await this.client.get<any>(`/logs?${query.toString()}`);
      return res.data || res;
    } catch (e) {
      console.error("Erro ao buscar logs:", e);
      return { items: [], total: 0, page: 1, limit: 20, totalPages: 1 };
    }
  }
}

export const logService = new LogService();
