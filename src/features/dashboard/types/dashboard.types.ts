/**
 * Tipos e contratos do domínio de Dashboard & Métricas CSFA.
 */

export interface DashboardEventItem {
  id: string | number;
  title: string;
  time: string;
  location: string;
  category: string;
  description?: string;
}

export interface DashboardEventGroup {
  dateKey: string;
  dayNumber: string;
  monthShort: string;
  weekday: string;
  fullDateLabel: string;
  events: DashboardEventItem[];
}

export interface DashboardArticleItem {
  id: string | number;
  title: string;
  author: string;
  date: string;
  views: string | number;
  category: string;
  imageUrl?: string;
}

export interface DashboardMetrics {
  totalPosts: number;
  activeBanners: number;
  upcomingEventsCount: number;
  activeUsers: number;
  pendingSubmissions: number;
}
