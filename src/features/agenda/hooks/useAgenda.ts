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
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(options.initialMonthIndex ?? 8); // 8 = Setembro
  const [selectedDay, setSelectedDay] = useState<number | null>(18);
  const [events, setEvents] = useState<Record<number, SchoolEvent[]>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Drawer / Modals State
  const [isEventDrawerOpen, setIsEventDrawerOpen] = useState<boolean>(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState<boolean>(false);

  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await service.getEventsByMonth(currentMonthIndex);
      setEvents(data);
    } finally {
      setIsLoading(false);
    }
  }, [service, currentMonthIndex]);

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

  // Grade de 30 dias para Setembro (1º cai na terça-feira)
  const calendarDays: CalendarDay[] = useMemo(() => {
    return [
      { dayNum: 30, isCurrentMonth: false, hasEvent: false },
      { dayNum: 31, isCurrentMonth: false, hasEvent: false },
      ...Array.from({ length: 30 }, (_, i) => ({
        dayNum: i + 1,
        isCurrentMonth: true,
        hasEvent: Boolean(events[i + 1]?.length),
        eventsCount: events[i + 1]?.length || 0,
      })),
      { dayNum: 1, isCurrentMonth: false, hasEvent: false },
      { dayNum: 2, isCurrentMonth: false, hasEvent: false },
      { dayNum: 3, isCurrentMonth: false, hasEvent: false },
    ];
  }, [events]);

  const selectedDayEvents = selectedDay ? events[selectedDay] || [] : [];

  const handleDayClick = useCallback((dayNum: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return;
    setSelectedDay(dayNum);
    setIsEventDrawerOpen(true);
  }, []);

  const handlePrevMonth = useCallback(() => {
    setCurrentMonthIndex((prev) => (prev > 0 ? prev - 1 : 11));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentMonthIndex((prev) => (prev < 11 ? prev + 1 : 0));
  }, []);

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
