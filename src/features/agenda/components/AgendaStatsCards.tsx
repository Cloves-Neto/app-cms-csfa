import { Calendar, Sparkles, GraduationCap } from "lucide-react";
import type { AgendaStats } from "../types/agenda.types";

interface AgendaStatsCardsProps {
  stats: AgendaStats;
}

export function AgendaStatsCards({ stats }: AgendaStatsCardsProps) {
  return (
    <nav className="grid grid-cols-1 sm:grid-cols-3 sm:gap-4 md:gap-6 w-full h-full">
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-200/80 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            Eventos Agendados
          </span>
          <span className="text-xl sm:text-2xl font-black text-[#0f1e36]">
            {stats.totalEvents}
          </span>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-[#44abff]/10 text-[#44abff] flex items-center justify-center border border-[#44abff]/30 shadow-xs">
          <Calendar size={20} />
        </div>
      </div>

      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-200/80 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block">
            Destaques Institucionais
          </span>
          <span className="text-xl sm:text-2xl font-black text-purple-700">
            {stats.featuredEvents}
          </span>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200">
          <Sparkles size={20} />
        </div>
      </div>

      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-200/80 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
            Categorias Ativas
          </span>
          <span className="text-xl sm:text-2xl font-black text-emerald-700">
            {stats.categoriesCount}
          </span>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
          <GraduationCap size={20} />
        </div>
      </div>
    </nav>
  );
}
