/**
 * Tipos e contratos do domínio de Agenda Escolar & Eventos CSFA.
 */

export interface SchoolEvent {
  id: string | number;
  title: string;
  time: string;
  location: string;
  category: string;
  description?: string;
  day?: number;
  date?: string;
}

export interface CreateEventInput {
  title: string;
  day: number;
  time: string;
  location: string;
  category: string;
  description?: string;
  monthIndex?: number;
}

export interface CalendarDay {
  dayNum: number;
  isCurrentMonth: boolean;
  hasEvent: boolean;
  eventsCount?: number;
}

export interface AgendaStats {
  totalEvents: number;
  featuredEvents: number;
  categoriesCount: number;
}
