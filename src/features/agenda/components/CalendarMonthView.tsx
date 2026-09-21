import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CalendarDay } from "../types/agenda.types";

interface CalendarMonthViewProps {
  currentMonthName: string;
  year?: number;
  calendarDays: CalendarDay[];
  selectedDay: number | null;
  onDayClick: (dayNum: number, isCurrentMonth: boolean) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function CalendarMonthView({
  currentMonthName,
  year = 2026,
  calendarDays,
  selectedDay,
  onDayClick,
  onPrevMonth,
  onNextMonth,
}: CalendarMonthViewProps) {
  return (
    <div className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden">
      {/* Month Navigation */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-base sm:text-lg font-black text-[#0f1e36]">
            {currentMonthName} {year}
          </h2>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onPrevMonth}
            className="p-1.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
            title="Mês Anterior"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={onNextMonth}
            className="p-1.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
            title="Próximo Mês"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Weekdays Header */}
      <div className="grid grid-cols-7 gap-1 pt-2 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider shrink-0">
        {WEEKDAYS.map((wd) => (
          <div key={wd} className="py-1">
            {wd}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1.5 flex-1 min-h-0 py-2 overflow-y-auto">
        {calendarDays.map((day, idx) => {
          const isSelected = day.isCurrentMonth && day.dayNum === selectedDay;

          return (
            <button
              key={idx}
              onClick={() => onDayClick(day.dayNum, day.isCurrentMonth)}
              disabled={!day.isCurrentMonth}
              className={`p-2 rounded-2xl border transition-all flex flex-col justify-between text-left min-h-14 sm:min-h-18 ${
                !day.isCurrentMonth
                  ? "opacity-30 bg-gray-50 border-gray-100 cursor-not-allowed"
                  : isSelected
                  ? "border-[#44abff] bg-[#44abff]/10 ring-2 ring-[#44abff]/30 shadow-xs"
                  : day.hasEvent
                  ? "bg-white border-blue-200/80 hover:border-[#44abff] hover:shadow-xs"
                  : "bg-white border-gray-200/70 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span
                  className={`text-xs font-black ${
                    isSelected
                      ? "text-[#0f1e36]"
                      : day.isCurrentMonth
                      ? "text-gray-700"
                      : "text-gray-400"
                  }`}
                >
                  {day.dayNum}
                </span>

                {day.hasEvent && (
                  <span className="w-2 h-2 rounded-full bg-[#44abff] ring-2 ring-white" />
                )}
              </div>

              {day.hasEvent && day.eventsCount && day.eventsCount > 0 && (
                <div className="hidden sm:flex items-center gap-1 mt-1">
                  <span className="text-[10px] font-bold text-[#44abff] bg-blue-50 px-1.5 py-0.5 rounded-md truncate max-w-full">
                    {day.eventsCount} {day.eventsCount === 1 ? "evento" : "eventos"}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
