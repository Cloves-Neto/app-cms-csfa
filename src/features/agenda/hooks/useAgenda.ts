import { useState, useEffect, useMemo, useCallback } from "react";
import { agendaService, AgendaService } from "../services/agenda.service";
import type { AgendaStats, CalendarDay, CreateEventInput, SchoolEvent } from "../types/agenda.types";

export const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

interface UseAgendaOptions {
  service?: AgendaService;
  initialMonthIndex?: number;
}

export function useAgenda(options: UseAgendaOptions = {}) {
  const service = options.service ?? agendaService;
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(
    options.initialMonthIndex ?? new Date().getMonth()
  );
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());
  const [events, setEvents] = useState<Record<number, SchoolEvent[]>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Drawer / Modals State
  const [isEventDrawerOpen, setIsEventDrawerOpen] = useState<boolean>(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState<boolean>(false);

  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      // In a real API, we should pass currentYear as well.
      // Assuming getEventsByMonth handles it or just returns events for that month.
      const data = await service.getEventsByMonth(currentYear, currentMonthIndex);
      setEvents(data);
    } finally {
      setIsLoading(false);
    }
  }, [service, currentMonthIndex, currentYear]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Estatísticas calculadas
  const stats: AgendaStats = useMemo(() => {
    const allEvents = Object.values(events).flat();
    const categories = new Set(allEvents.map((e) => e.category));
    return {
      totalEvents: allEvents.length,
      featuredEvents: allEvents.filter((e) => e.category === "Eventos" || e.category === "Institucional").length,
      categoriesCount: categories.size,
    };
  }, [events]);

  // Grade de dias dinâmica
  const calendarDays: CalendarDay[] = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonthIndex, 1).getDay(); // 0 (Dom) a 6 (Sáb)
    const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonthIndex, 0).getDate();
    
    const days: CalendarDay[] = [];

    // Dias do mês anterior
    for (let i = 0; i < firstDay; i++) {
      days.push({
        dayNum: daysInPrevMonth - firstDay + i + 1,
        isCurrentMonth: false,
        hasEvent: false,
      });
    }

    // Dias do mês atual
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        dayNum: i,
        isCurrentMonth: true,
        hasEvent: Boolean(events[i]?.length),
        eventsCount: events[i]?.length || 0,
      });
    }

    // Dias do próximo mês (para completar 35 ou 42 dias, normalmente múltiplos de 7)
    const totalSlots = days.length > 35 ? 42 : 35;
    const nextMonthDays = totalSlots - days.length;
    for (let i = 1; i <= nextMonthDays; i++) {
      days.push({
        dayNum: i,
        isCurrentMonth: false,
        hasEvent: false,
      });
    }

    return days;
  }, [currentYear, currentMonthIndex, events]);

  const selectedDayEvents = selectedDay ? events[selectedDay] || [] : [];

  const handleDayClick = useCallback((dayNum: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return;
    setSelectedDay(dayNum);
    setIsEventDrawerOpen(true);
  }, []);

  const handlePrevMonth = useCallback(() => {
    const now = new Date();
    const currentAbsoluteMonth = currentYear * 12 + currentMonthIndex;
    const nowAbsoluteMonth = now.getFullYear() * 12 + now.getMonth();

    if (currentAbsoluteMonth <= nowAbsoluteMonth) {
      return; // Bloqueia navegação para o passado
    }

    if (currentMonthIndex > 0) {
      setCurrentMonthIndex(currentMonthIndex - 1);
    } else {
      setCurrentMonthIndex(11);
      setCurrentYear(currentYear - 1);
    }
  }, [currentYear, currentMonthIndex]);

  const handleNextMonth = useCallback(() => {
    const now = new Date();
    const currentAbsoluteMonth = currentYear * 12 + currentMonthIndex;
    const nowAbsoluteMonth = now.getFullYear() * 12 + now.getMonth();

    if (currentAbsoluteMonth >= nowAbsoluteMonth + 12) {
      return; // Bloqueia navegação além de 12 meses
    }

    if (currentMonthIndex < 11) {
      setCurrentMonthIndex(currentMonthIndex + 1);
    } else {
      setCurrentMonthIndex(0);
      setCurrentYear(currentYear + 1);
    }
  }, [currentYear, currentMonthIndex]);

  const handleCreateEvent = useCallback(
    async (input: CreateEventInput) => {
      const created = await service.createEvent(input);
      setEvents((prev) => {
        const dayEvents = prev[input.day] ? [...prev[input.day], created] : [created];
        return { ...prev, [input.day]: dayEvents };
      });
      setIsManageModalOpen(false);
    },
    [service]
  );

  const handleDeleteEvent = useCallback(
    async (day: number, id: string | number) => {
      await service.deleteEvent(day, id);
      setEvents((prev) => {
        const remaining = (prev[day] || []).filter((e) => String(e.id) !== String(id));
        const updated = { ...prev };
        if (remaining.length === 0) {
          delete updated[day];
        } else {
          updated[day] = remaining;
        }
        return updated;
      });
    },
    [service]
  );

  return {
    currentYear,
    currentMonthIndex,
    currentMonthName: MONTH_NAMES[currentMonthIndex],
    selectedDay,
    selectedDayEvents,
    calendarDays,
    stats,
    isLoading,
    isEventDrawerOpen,
    isManageModalOpen,
    setIsEventDrawerOpen,
    setIsManageModalOpen,
    handleDayClick,
    handlePrevMonth,
    handleNextMonth,
    handleCreateEvent,
    handleDeleteEvent,
  };
}
