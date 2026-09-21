import { httpClient, type HttpClient } from "@/core/http";

export interface ISchoolMaterial {
  id: string;
  title: string;
  academicYear: number;
  segment: string;
  grade: string;
  fileUrl: string;
  isActive: boolean;
  createdAt: string;
}

export interface ImportSchoolMaterialCsvResponse {
  success: boolean;
  message: string;
  data: {
    totalProcessed: number;
    totalImported: number;
    totalSkipped: number;
    errors?: string[];
  };
}

class SchoolMaterialService {
  private client: HttpClient;

  constructor(client: HttpClient = httpClient) {
    this.client = client;
  }

  async getAll(params?: { academicYear?: number; segment?: string }): Promise<ISchoolMaterial[]> {
    return this.client.get<ISchoolMaterial[]>("/school-materials", { params });
  }

  async create(data: Omit<ISchoolMaterial, "id" | "createdAt" | "isActive">): Promise<ISchoolMaterial> {
    return this.client.post<ISchoolMaterial>("/school-materials", data);
  }

  async delete(id: string): Promise<void> {
    await this.client.delete(`/school-materials/${id}`);
  }

  async importCsv(file: File): Promise<ImportSchoolMaterialCsvResponse> {
    const formData = new FormData();
    formData.append("file", file);

    return this.client.post<ImportSchoolMaterialCsvResponse>("/school-materials/import-csv", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      // Timeout maior para upload e processamento (30s)
      timeout: 30000,
    });
  }

  async downloadTemplateCsv(): Promise<void> {
    const response = await this.client.get<Blob>("/school-materials/template-csv", {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response as any]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "modelo_materiais_csfa.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
}

export const schoolMaterialService = new SchoolMaterialService();
