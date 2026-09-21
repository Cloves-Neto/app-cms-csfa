import { httpClient, type HttpClient } from "@/core/http";
import type { CreateEventInput, SchoolEvent } from "../types/agenda.types";

export interface ImportCsvResponse {
  success: boolean;
  message: string;
  data: {
    totalProcessed: number;
    totalImported: number;
    totalSkipped: number;
    supabaseBackupUrl?: string;
    errors?: string[];
  };
}

export class AgendaService {
  private readonly client: HttpClient;

  constructor(client: HttpClient = httpClient) {
    this.client = client;
  }

  private mapCategory(type: string): "Acadêmico" | "Eventos" | "Institucional" | "Esportes" {
    const map: Record<string, "Acadêmico" | "Eventos" | "Institucional" | "Esportes"> = {
      ACADEMICO: "Acadêmico",
      EVENTO: "Eventos",
      ESPORTIVO: "Esportes",
      REUNIAO: "Institucional",
      FERIADO: "Institucional",
      ACADEMIC: "Acadêmico",
      EVENT: "Eventos",
      SPORTS: "Esportes",
      INSTITUTIONAL: "Institucional",
      HOLIDAY: "Institucional",
    };
    return map[type] || "Eventos";
  }

  async getEventsByMonth(monthIndex: number): Promise<Record<number, SchoolEvent[]>> {
    try {
      const res = await this.client.get<any>(`/agenda?month=${monthIndex + 1}`);
      const list = Array.isArray(res) ? res : res.data || [];
      const grouped: Record<number, SchoolEvent[]> = {};

      if (Array.isArray(list) && list.length > 0) {
        list.forEach((e: any) => {
          const date = new Date(e.date || e.startDate);
          const day = date.getUTCDate ? date.getUTCDate() : date.getDate();
          const time = e.time || `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;

          const item: SchoolEvent = {
            id: e.id,
            title: e.title,
            time,
            location: e.location || "CSFA",
            category: this.mapCategory(e.type || e.category),
            description: e.description || "",
            day,
          };

          if (!grouped[day]) grouped[day] = [];
          grouped[day].push(item);
        });
      }

      return grouped;
    } catch (error) {
      console.error("Erro ao buscar eventos da agenda:", error);
      return {};
    }
  }

  async createEvent(input: CreateEventInput): Promise<SchoolEvent> {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const date = new Date(Date.UTC(currentYear, currentMonth, input.day, 12, 0, 0));

    const typeMap: Record<string, string> = {
      "Acadêmico": "ACADEMICO",
      "Eventos": "EVENTO",
      "Esportes": "ESPORTIVO",
      "Institucional": "REUNIAO",
    };

    const payload = {
      title: input.title,
      description: input.description,
      location: input.location || "CSFA",
      time: input.time || "08:00",
      type: typeMap[input.category] || "EVENTO",
      date: date.toISOString(),
      status: "CONFIRMADO",
    };

    const res = await this.client.post<any>("/agenda", payload);
    const created = res.data || res;

    return {
      id: created.id || Date.now(),
      title: created.title || input.title,
      time: created.time || input.time,
      location: created.location || input.location,
      category: input.category,
      description: created.description || input.description,
      day: input.day,
    };
  }

  async deleteEvent(_day: number, id: string | number): Promise<void> {
    await this.client.delete(`/agenda/${id}`);
  }

  /**
   * Baixa o arquivo modelo CSV de exemplo formatado para importação em lote.
   */
  async downloadTemplateCsv(): Promise<void> {
    const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/agenda/template-csv`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "modelo_agenda_csfa.csv";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  /**
   * Envia o arquivo CSV (até 150MB) para a API processar e sincronizar no banco.
   */
  async importCsv(file: File): Promise<ImportCsvResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("token") || localStorage.getItem("csfa_auth_token");
    const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/agenda/import-csv`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || result.message || "Falha ao importar arquivo CSV.");
    }

    return result;
  }
}

export const agendaService = new AgendaService();
