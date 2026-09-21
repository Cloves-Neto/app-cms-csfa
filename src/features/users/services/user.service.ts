import { httpClient, type HttpClient } from "@/core/http";
import type { CreateUserInput, UserItem, UserStatus } from "../types/user.types";

/**
 * Service de Domínio para Gestão de Usuários.
 * Conectado 100% à API REST da CSFA.
 */
export class UserService {
  private readonly client: HttpClient;

  constructor(client: HttpClient = httpClient) {
    this.client = client;
  }

  private normalizeUser(raw: any): UserItem {
    const rawRole = raw.role || raw.systemRole || "PROFESSOR";
    const statusMap: Record<string, UserStatus> = {
      ACTIVE: "active",
      INACTIVE: "inactive",
      BLOCKED: "blocked",
      active: "active",
      inactive: "inactive",
      blocked: "blocked",
    };
    const scheduleMap: Record<string, "full" | "business_hours" | "restricted"> = {
      FULL: "full",
      BUSINESS_HOURS: "business_hours",
      WEEKDAYS: "business_hours",
      RESTRICTED: "restricted",
      full: "full",
      business_hours: "business_hours",
      restricted: "restricted",
    };

    const roleLabels: Record<string, string> = {
      TI: "Administrador Geral (TI)",
      ADMIN: "Administrador Geral",
      COORDENACAO: "Coordenação Pedagógica",
      SECRETARIA: "Secretaria Escolar",
      PROFESSOR: "Professor Titular",
    };

    const fullName = raw.name || `${raw.firstName || ""} ${raw.lastName || ""}`.trim() || "Usuário CSFA";

    return {
      id: raw.id,
      name: fullName,
      email: raw.email,
      avatar: raw.avatar || raw.imageUrl || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80`,
      role: roleLabels[rawRole] || raw.role || "Professor Titular",
      systemRole: rawRole,
      status: statusMap[raw.status] || "active",
      accessSchedule: scheduleMap[raw.accessSchedule] || "full",
      coordinatorId: raw.coordinatorId || null,
      lastAccess: raw.lastLogin ? new Date(raw.lastLogin).toLocaleString("pt-BR") : raw.lastAccess || "Recente",
      createdAt: raw.createdAt ? new Date(raw.createdAt).toLocaleDateString("pt-BR") : new Date().toLocaleDateString("pt-BR"),
      permissions: Array.isArray(raw.permissions)
        ? raw.permissions.map((p: any) => ({
            moduleKey: p.moduleKey || p.module,
            moduleName: p.moduleName || p.moduleKey || p.module,
            level: (p.level || p.accessLevel || "none").toLowerCase(),
          }))
        : [],
    };
  }

  async getAll(): Promise<UserItem[]> {
    try {
      const response = await this.client.get<any>("/users");
      const list = Array.isArray(response) ? response : response.data || [];
      if (Array.isArray(list)) {
        return list.map((u) => this.normalizeUser(u));
      }
      return [];
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      return [];
    }
  }

  async getById(id: string | number): Promise<UserItem> {
    const response = await this.client.get<any>(`/users/${id}`);
    const user = response.data || response;
    if (!user) throw new Error("Usuário não encontrado");
    return this.normalizeUser(user);
  }

  async create(data: CreateUserInput): Promise<UserItem> {
    const nameParts = data.name.trim().split(" ");
    const firstName = nameParts[0] || data.name;
    const lastName = nameParts.slice(1).join(" ") || "";

    const payload = {
      firstName,
      lastName,
      email: data.email,
      password: data.password || "senha123",
      role: data.systemRole || "PROFESSOR",
      status: data.status ? data.status.toUpperCase() : "ACTIVE",
      accessSchedule: data.accessSchedule ? data.accessSchedule.toUpperCase() : "FULL",
      coordinatorId: data.coordinatorId || null,
      imageUrl: data.avatar || null,
      permissions: data.permissions
        ? data.permissions.map((p) => ({
            moduleKey: p.moduleKey,
            level: p.level.toLowerCase(),
          }))
        : undefined,
    };

    const response = await this.client.post<any>("/users", payload);
    return this.normalizeUser(response.data || response);
  }

  async update(id: string | number, data: Partial<CreateUserInput>): Promise<UserItem> {
    const payload: any = {};
    if (data.name) {
      const parts = data.name.trim().split(" ");
      payload.firstName = parts[0];
      payload.lastName = parts.slice(1).join(" ");
    }
    if (data.email) payload.email = data.email;
    if (data.systemRole) payload.role = data.systemRole.toUpperCase();
    if (data.status) payload.status = data.status.toUpperCase();
    if (data.accessSchedule) payload.accessSchedule = data.accessSchedule.toUpperCase();
    if (data.coordinatorId !== undefined) payload.coordinatorId = data.coordinatorId;
    if (data.avatar) payload.imageUrl = data.avatar;
    if (data.permissions) {
      payload.permissions = data.permissions.map((p) => ({
        moduleKey: p.moduleKey,
        level: p.level.toLowerCase(),
      }));
    }

    const response = await this.client.put<any>(`/users/${id}`, payload);
    return this.normalizeUser(response.data || response);
  }

  async delete(id: string | number): Promise<void> {
    await this.client.delete(`/users/${id}`);
  }

  async toggleStatus(id: string | number, newStatus: UserStatus): Promise<UserItem> {
    const response = await this.client.patch<any>(`/users/${id}/status`, { status: newStatus.toUpperCase() });
    return this.normalizeUser(response.data || response);
  }

  async resetPassword(userId: string | number, newPassword: string): Promise<{ message: string }> {
    return this.client.post<{ message: string }>("/auth/password-reset/admin", {
      userId: String(userId),
      newPassword,
    });
  }
}

export const userService = new UserService();
