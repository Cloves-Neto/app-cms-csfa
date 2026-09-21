import { httpClient, type HttpClient } from "@/core/http";
import type { CreateTagInput, TagItem } from "../types/tag.types";

export class TagService {
  private readonly client: HttpClient;

  constructor(client: HttpClient = httpClient) {
    this.client = client;
  }

  private normalizeTag(t: any): TagItem {
    return {
      id: t.id,
      name: t.name,
      slug: t.slug,
      color: t.color || "bg-[#0f1e36] text-[#44abff] border-[#44abff]/30",
      description: t.description || "",
      usageCount: t._count?.posts || t.usageCount || 0,
      createdAt: t.createdAt ? new Date(t.createdAt).toLocaleDateString("pt-BR") : new Date().toLocaleDateString("pt-BR"),
      isActive: t.isActive ?? t.active ?? true,
    };
  }

  async getAll(): Promise<TagItem[]> {
    try {
      const res = await this.client.get<any>("/tags");
      const list = Array.isArray(res) ? res : res.data || [];
      if (Array.isArray(list)) {
        return list.map((t: any) => this.normalizeTag(t));
      }
      return [];
    } catch (error) {
      console.error("Erro ao buscar tags:", error);
      return [];
    }
  }

  async create(input: CreateTagInput): Promise<TagItem> {
    const slug = input.slug || input.name.toLowerCase().replace(/\s+/g, "-");
    const res = await this.client.post<any>("/tags", {
      name: input.name,
      slug,
      color: input.color,
      description: input.description,
    });
    return this.normalizeTag(res.data || res);
  }

  async update(id: string | number, data: Partial<CreateTagInput>): Promise<TagItem> {
    const res = await this.client.put<any>(`/tags/${id}`, data);
    return this.normalizeTag(res.data || res);
  }

  async delete(id: string | number): Promise<void> {
    await this.client.delete(`/tags/${id}`);
  }

  async toggleStatus(id: string | number): Promise<TagItem> {
    const tag = await this.client.get<any>(`/tags/${id}`);
    const item = tag.data || tag;
    return this.update(id, { isActive: !item.isActive });
  }
}

export const tagService = new TagService();
