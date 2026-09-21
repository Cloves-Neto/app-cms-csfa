import { X, Clock, MapPin, Trash2, Calendar } from "lucide-react";
import type { SchoolEvent } from "../types/agenda.types";

interface DayEventsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDay: number | null;
  events: SchoolEvent[];
  monthName: string;
  onDeleteEvent: (day: number, id: string | number) => void;
}

export function DayEventsDrawer({
  isOpen,
  onClose,
  selectedDay,
  events,
  monthName,
  onDeleteEvent,
}: DayEventsDrawerProps) {
  if (!isOpen || selectedDay === null) return null;

  return (
    <div className="fixed inset-0 bg-[#0f1e36]/40 backdrop-blur-xs z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between p-6 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#44abff] uppercase tracking-wider">
              <Calendar size={14} />
              <span>Programação do Dia</span>
            </div>
            <h2 className="text-lg font-black text-[#0f1e36]">
              {selectedDay} de {monthName} de 2026
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Events List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {events.length === 0 ? (
            <div className="py-12 text-center text-gray-400 space-y-2">
              <Calendar size={32} className="mx-auto text-gray-300" />
              <p className="text-xs font-medium">Nenhum evento agendado para este dia.</p>
            </div>
          ) : (
            events.map((ev) => (
              <div
                key={ev.id}
                className="p-4 rounded-2xl border border-gray-200/80 bg-gray-50/50 hover:bg-gray-50 transition-all space-y-2 relative group"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#0f1e36] text-white text-[10px] font-bold uppercase tracking-wider">
                    {ev.category}
                  </span>
                  <button
                    onClick={() => onDeleteEvent(selectedDay, ev.id)}
                    className="text-gray-300 hover:text-rose-600 p-1 transition-colors"
                    title="Remover Evento"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <h3 className="font-bold text-sm text-[#0f1e36]">{ev.title}</h3>

                {ev.description && (
                  <p className="text-xs text-gray-500">{ev.description}</p>
                )}

                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 pt-1">
                  <span className="flex items-center gap-1 font-semibold text-[#0f1e36]">
                    <Clock size={13} className="text-[#44abff]" />
                    {ev.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-gray-400" />
                    {ev.location}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full bg-[#0f1e36] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-[#0f1e36]/90 transition-colors"
          >
            Fechar Painel
          </button>
        </div>
      </div>
    </div>
  );
}
