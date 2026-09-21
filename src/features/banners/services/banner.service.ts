import { httpClient, type HttpClient } from "@/core/http";
import type { Banner, CreateBannerInput } from "../types/banner.types";

export class BannerService {
  private readonly client: HttpClient;

  constructor(client: HttpClient = httpClient) {
    this.client = client;
  }

  private normalizeBanner(b: any): Banner {
    return {
      id: b.id,
      title: b.title,
      imageUrl: b.imageUrl,
      targetUrl: b.targetUrl || b.link || "",
      createdAt: b.createdAt ? new Date(b.createdAt).toLocaleDateString("pt-BR") : new Date().toLocaleDateString("pt-BR"),
      publishDate: b.publishDate ? new Date(b.publishDate).toLocaleDateString("pt-BR") : b.createdAt ? new Date(b.createdAt).toLocaleDateString("pt-BR") : new Date().toLocaleDateString("pt-BR"),
      order: b.order ?? 1,
      isActive: b.isActive ?? b.active ?? true,
    };
  }

  async getAll(): Promise<Banner[]> {
    try {
      const res = await this.client.get<any>("/banners");
      const list = Array.isArray(res) ? res : res.data || [];
      if (Array.isArray(list)) {
        return list.map((b: any) => this.normalizeBanner(b));
      }
      return [];
    } catch (error) {
      console.error("Erro ao buscar banners:", error);
      return [];
    }
  }

  async create(data: CreateBannerInput): Promise<Banner> {
    const res = await this.client.post<any>("/banners", {
      title: data.title,
      imageUrl: data.imageUrl,
      targetUrl: data.targetUrl,
      order: data.order ?? 1,
      isActive: data.isActive,
    });
    return this.normalizeBanner(res.data || res);
  }

  async update(id: string | number, data: Partial<CreateBannerInput>): Promise<Banner> {
    const payload: any = {};
    if (data.title !== undefined) payload.title = data.title;
    if (data.imageUrl !== undefined) payload.imageUrl = data.imageUrl;
    if (data.targetUrl !== undefined) payload.targetUrl = data.targetUrl;
    if (data.order !== undefined) payload.order = data.order;
    if (data.isActive !== undefined) payload.isActive = data.isActive;

    const res = await this.client.put<any>(`/banners/${id}`, payload);
    return this.normalizeBanner(res.data || res);
  }

  async delete(id: string | number): Promise<void> {
    await this.client.delete(`/banners/${id}`);
  }

  async saveTemplate(data: { name: string; imageUrl: string; targetUrl: string }): Promise<any> {
    const res = await this.client.post<any>("/banners/templates", data);
    return res.data || res;
  }

  async toggleStatus(id: string | number): Promise<Banner> {
    const res = await this.client.patch<any>(`/banners/${id}/status`);
    return this.normalizeBanner(res.data || res);
  }

  async reorder(id: string | number, direction: "up" | "down"): Promise<Banner[]> {
    const all = await this.getAll();
    const index = all.findIndex((b) => String(b.id) === String(id));
    if (index === -1) return all;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= all.length) return all;

    const currentBanner = all[index];
    const targetBanner = all[targetIndex];

    const currentOrder = currentBanner.order;
    const targetOrder = targetBanner.order;

    await Promise.all([
      this.update(currentBanner.id, { order: targetOrder }),
      this.update(targetBanner.id, { order: currentOrder }),
    ]);

    return await this.getAll();
  }
}

export const bannerService = new BannerService();
