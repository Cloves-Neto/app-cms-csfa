import { Users as UsersIcon, UserCheck, Clock, UserX } from "lucide-react";
import type { UserStats } from "../types/user.types";

interface UserStatsCardsProps {
  stats: UserStats;
}

export function UserStatsCards({ stats }: UserStatsCardsProps) {
  return (
    <nav className="grid grid-cols-2 lg:grid-cols-4 sm:gap-4 md:gap-6 w-full h-full">
      {/* Total */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-200/80 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            Total de Usuários
          </span>
          <span className="text-xl sm:text-2xl font-black text-[#0f1e36]">
            {stats.total}
          </span>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-[#44abff]/10 text-[#44abff] flex items-center justify-center border border-[#44abff]/30 shadow-xs">
          <UsersIcon size={20} />
        </div>
      </div>

      {/* Ativos */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-200/80 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
            Ativos no Sistema
          </span>
          <span className="text-xl sm:text-2xl font-black text-emerald-700">
            {stats.active}
          </span>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
          <UserCheck size={20} />
        </div>
      </div>

      {/* Horário Comercial */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-200/80 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">
            Horário Comercial
          </span>
          <span className="text-xl sm:text-2xl font-black text-amber-700">
            {stats.businessHours}
          </span>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
          <Clock size={20} />
        </div>
      </div>

      {/* Bloqueados */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-200/80 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">
            Acessos Bloqueados
          </span>
          <span className="text-xl sm:text-2xl font-black text-rose-700">
            {stats.blocked}
          </span>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
          <UserX size={20} />
        </div>
      </div>
    </nav>
  );
}
