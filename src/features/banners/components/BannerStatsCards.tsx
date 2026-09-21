import { Image as ImageIcon, Check, EyeOff } from "lucide-react";
import type { BannerStats } from "../types/banner.types";

interface BannerStatsCardsProps {
  stats: BannerStats;
}

export function BannerStatsCards({ stats }: BannerStatsCardsProps) {
  return (
    <nav className="grid grid-cols-1 sm:grid-cols-3 sm:gap-4 md:gap-6 w-full h-full">
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-200/80 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            Total de Banners
          </span>
          <span className="text-xl sm:text-2xl font-black text-[#0f1e36]">
            {stats.total}
          </span>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-[#44abff]/10 text-[#44abff] flex items-center justify-center border border-[#44abff]/30 shadow-xs">
          <ImageIcon size={20} />
        </div>
      </div>

      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-200/80 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
            Banners Ativos (Carrossel)
          </span>
          <span className="text-xl sm:text-2xl font-black text-emerald-700">
            {stats.active}
          </span>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
          <Check size={20} />
        </div>
      </div>

      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-200/80 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">
            Banners Inativos / Rascunho
          </span>
          <span className="text-xl sm:text-2xl font-black text-amber-700">
            {stats.inactive}
          </span>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
          <EyeOff size={20} />
        </div>
      </div>
    </nav>
  );
}
