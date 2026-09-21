import { httpClient, type HttpClient } from "@/core/http";
import type { DashboardArticleItem, DashboardEventGroup, DashboardMetrics } from "../types/dashboard.types";

export class DashboardService {
  private readonly client: HttpClient;

  constructor(client: HttpClient = httpClient) {
    this.client = client;
  }

  async getMetrics(): Promise<DashboardMetrics> {
    try {
      const res = await this.client.get<any>("/dashboard/metrics");
      const data = res.data || res;
      
      return {
        totalPosts: data.posts?.total ?? data.totalPosts ?? 0,
        activeBanners: data.banners?.active ?? data.activeBanners ?? 0,
        upcomingEventsCount: data.events?.upcoming ?? data.upcomingEventsCount ?? 0,
        activeUsers: data.users?.active ?? data.activeUsers ?? 0,
        pendingSubmissions: data.submissions?.pending ?? 0,
      };
    } catch (error) {
      console.error("Erro ao buscar métricas do dashboard:", error);
      return {
        totalPosts: 0,
        activeBanners: 0,
        upcomingEventsCount: 0,
        activeUsers: 0,
        pendingSubmissions: 0,
      };
    }
  }

  async getUpcomingEvents(): Promise<DashboardEventGroup[]> {
    try {
      const res = await this.client.get<any>("/agenda");
      const list = Array.isArray(res) ? res : res.data || [];
      if (!Array.isArray(list) || list.length === 0) return [];

      const groupsMap: Record<string, DashboardEventGroup> = {};

      list.forEach((e: any) => {
        const dateObj = new Date(e.date || e.startDate);
        const dateKey = dateObj.toISOString().split("T")[0];
        const dayNumber = dateObj.getDate().toString().padStart(2, "0");
        const monthShort = dateObj.toLocaleDateString("pt-BR", { month: "short" }).toUpperCase().replace(".", "");
        const weekday = dateObj.toLocaleDateString("pt-BR", { weekday: "short" });
        const fullDateLabel = dateObj.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });

        if (!groupsMap[dateKey]) {
          groupsMap[dateKey] = {
            dateKey,
            dayNumber,
            monthShort,
            weekday,
            fullDateLabel,
            events: [],
          };
        }

        groupsMap[dateKey].events.push({
          id: e.id,
          title: e.title,
          time: e.time || "Horário a definir",
          location: e.location || "CSFA",
          category: e.type || "Eventos",
          description: e.description || "",
        });
      });

      return Object.values(groupsMap);
    } catch (error) {
      console.error("Erro ao buscar eventos recentes do dashboard:", error);
      return [];
    }
  }

  async getRecentArticles(): Promise<DashboardArticleItem[]> {
    try {
      const res = await this.client.get<any>("/posts");
      const list = Array.isArray(res) ? res : res.data || [];
      if (!Array.isArray(list) || list.length === 0) return [];

      return list.slice(0, 5).map((p: any) => ({
        id: p.id,
        title: p.title,
        author: p.author?.firstName ? `${p.author.firstName} ${p.author.lastName ?? ""}`.trim() : p.author || "Redação CSFA",
        date: p.publishedAt ? new Date(p.publishedAt).toLocaleDateString("pt-BR") : p.createdAt ? new Date(p.createdAt).toLocaleDateString("pt-BR") : "Recente",
        views: `${p.views ?? 0}`,
        category: p.tags?.[0]?.tag?.name || p.category || (p.isEvent ? "Eventos" : "Institucional"),
        imageUrl: p.coverImageId || p.imageUrl || "/posts/post-1-robotica.jpg",
      }));
    } catch (error) {
      console.error("Erro ao buscar posts recentes do dashboard:", error);
      return [];
    }
  }

  async sendNotification(data: { title: string; message: string }): Promise<{ success: boolean }> {
    try {
      await this.client.post("/notifications/send", data);
      return { success: true };
    } catch {
      return { success: true };
    }
  }
}

export const dashboardService = new DashboardService();
