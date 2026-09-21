import { httpClient, type HttpClient } from "@/core/http";
import type { ContactSubmission, SubmissionType, SubmissionStatus } from "../types/submission.types";

export interface GetSubmissionsParams {
  type?: SubmissionType | "ALL";
  status?: SubmissionStatus | "ALL";
  search?: string;
}

export class SubmissionService {
  private readonly client: HttpClient;

  constructor(client: HttpClient = httpClient) {
    this.client = client;
  }

  async getAll(params?: GetSubmissionsParams): Promise<ContactSubmission[]> {
    try {
      const res = await this.client.get<any>("/contact/submissions", {
        params: {
          type: params?.type !== "ALL" ? params?.type : undefined,
          status: params?.status !== "ALL" ? params?.status : undefined,
          search: params?.search || undefined,
        },
      });
      const list = Array.isArray(res) ? res : res?.data || [];
      return Array.isArray(list) ? list : [];
    } catch (error) {
      console.error("Erro ao carregar submissões:", error);
      return [];
    }
  }

  async updateStatus(id: string, status: SubmissionStatus, notes?: string): Promise<boolean> {
    try {
      await this.client.patch(`/contact/submissions/${id}/status`, {
        status,
        notes,
      });
      return true;
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      return false;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.client.delete(`/contact/submissions/${id}`);
      return true;
    } catch (error) {
      console.error("Erro ao remover submissão:", error);
      return false;
    }
  }
}

export const submissionService = new SubmissionService();
