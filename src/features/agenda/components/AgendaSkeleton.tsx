import { ChevronLeft, ChevronRight } from "lucide-react";

export function AgendaSkeleton() {
  const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const SKELETON_DAYS = Array.from({ length: 35 }); // 5 semanas

  return (
    <div className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden animate-pulse">
      {/* Month Navigation Skeleton */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 shrink-0">
        <div className="h-6 w-32 bg-gray-200 rounded-md" />

        <div className="flex items-center gap-1">
          <div className="p-1.5 rounded-xl border border-gray-200 text-gray-300">
            <ChevronLeft size={16} />
          </div>
          <div className="p-1.5 rounded-xl border border-gray-200 text-gray-300">
            <ChevronRight size={16} />
          </div>
        </div>
      </div>

      {/* Weekdays Header */}
      <div className="grid grid-cols-7 gap-1 pt-2 text-center text-[11px] font-bold text-gray-300 uppercase tracking-wider shrink-0">
        {WEEKDAYS.map((wd) => (
          <div key={wd} className="py-1">
            {wd}
          </div>
        ))}
      </div>

      {/* Days Grid Skeleton */}
      <div className="grid grid-cols-7 gap-1.5 flex-1 min-h-0 py-2 overflow-y-auto">
        {SKELETON_DAYS.map((_, idx) => (
          <div
            key={idx}
            className="p-2 rounded-2xl border border-gray-100 bg-gray-50 flex flex-col justify-between text-left min-h-14 sm:min-h-18"
          >
            <div className="h-3 w-4 bg-gray-200 rounded-md" />
            <div className="hidden sm:flex mt-1">
              <div className="h-3 w-10 bg-gray-200 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
