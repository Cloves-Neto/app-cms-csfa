import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, ChevronRight, CalendarDays } from "lucide-react";
import type { DashboardEventGroup } from "../types/dashboard.types";
import { EmptyState } from "@/components/common/EmptyState";

interface DashboardUpcomingEventsProps {
  eventGroups: DashboardEventGroup[];
}

export function DashboardUpcomingEvents({ eventGroups }: DashboardUpcomingEventsProps) {
  return (
    <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col h-full overflow-hidden">
      {/* Header do Card */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 shrink-0 mb-3">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-[#44abff]" />
          <h2 className="font-bold text-sm text-[#0f1e36]">Próximos Eventos da Agenda</h2>
        </div>
        <Link
          to="/dashboard/agenda"
          className="text-xs font-bold text-[#44abff] hover:underline flex items-center gap-1"
        >
          <span>Ver Agenda Completa</span>
          <ChevronRight size={13} />
        </Link>
      </div>

      {/* Lista de Eventos Alinhada ao Topo */}
      {eventGroups.length === 0 ? (
        <EmptyState
          icon={<CalendarDays size={32} className="text-gray-300 mb-2 stroke-1" />}
          title="Nenhum evento próximo agendado"
          description="Cadastre novos eventos ou importe o calendário."
        />
      ) : (
        <div className="flex-1 overflow-y-auto pr-1 space-y-3">
          {eventGroups.map((group) => (
            <div key={group.dateKey} className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-[#0f1e36] text-white text-[10px] font-black uppercase tracking-wider">
                  {group.dayNumber} {group.monthShort}
                </span>
                <span className="text-[11px] font-bold text-gray-500 capitalize">{group.fullDateLabel}</span>
              </div>

              <div className="space-y-1.5 pl-2 border-l-2 border-[#44abff]/40">
                {group.events.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3 bg-gray-50/80 hover:bg-gray-100/70 rounded-2xl border border-gray-100 transition-all space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-xs text-[#0f1e36]">{ev.title}</h3>
                      <span className="text-[10px] font-bold text-[#44abff] bg-blue-50 px-2 py-0.5 rounded-md shrink-0">
                        {ev.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-gray-400">
                      <span className="flex items-center gap-1 text-[#0f1e36] font-semibold">
                        <Clock size={11} className="text-[#44abff]" />
                        {ev.time}
                      </span>
                      <span className="flex items-center gap-1 truncate">
                        <MapPin size={11} />
                        {ev.location}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
