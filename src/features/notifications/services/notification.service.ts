import { httpClient, type HttpClient } from "@/core/http";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "INFO" | "WARNING" | "SUCCESS" | "DANGER";
  targetUserId?: string | null;
  targetRole?: string | null;
  isGlobal?: boolean;
  targetUser?: {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    role?: string;
  } | null;
  senderId?: string | null;
  sender?: {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
  } | null;
  isRead: boolean;
  actionUrl?: string | null;
  attachmentUrl?: string | null;
  attachmentType?: string | null;
  createdAt: string;
}

export interface CreateNotificationDTO {
  title: string;
  message: string;
  type?: "INFO" | "WARNING" | "SUCCESS" | "DANGER";
  targetUserId?: string | null;
  targetRole?: string | null;
  isGlobal?: boolean;
  actionUrl?: string;
  attachmentUrl?: string;
  attachmentType?: string;
}

export class NotificationService {
  private readonly client: HttpClient;

  constructor(client: HttpClient = httpClient) {
    this.client = client;
  }

  async getMyNotifications(): Promise<AppNotification[]> {
    try {
      const res = await this.client.get<any>("/notifications");
      return Array.isArray(res) ? res : res.data || [];
    } catch (e) {
      console.error("Erro ao buscar notificações:", e);
      return [];
    }
  }

  async markAsRead(id: string): Promise<void> {
    await this.client.patch(`/notifications/${id}/read`);
  }

  async markAllAsRead(): Promise<void> {
    await this.client.patch("/notifications/read-all");
  }

  async send(data: CreateNotificationDTO): Promise<AppNotification> {
    const res = await this.client.post<any>("/notifications", data);
    return res.data || res;
  }

  async getHistory(): Promise<AppNotification[]> {
    try {
      const res = await this.client.get<any>("/notifications/history");
      return Array.isArray(res) ? res : res.data || [];
    } catch (e) {
      console.error("Erro ao buscar histórico de notificações:", e);
      return [];
    }
  }

  async delete(id: string): Promise<void> {
    await this.client.delete(`/notifications/${id}`);
  }
}

export const notificationService = new NotificationService();
