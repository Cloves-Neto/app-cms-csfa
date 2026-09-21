import { Search, Layers, SlidersHorizontal } from "lucide-react";
import type { BannerStats } from "../types/banner.types";

interface BannerFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterStatus: "all" | "active" | "inactive";
  onFilterChange: (status: "all" | "active" | "inactive") => void;
  viewMode: "cards" | "table";
  onViewModeChange: (mode: "cards" | "table") => void;
  stats: BannerStats;
}

export function BannerFilters({
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterChange,
  viewMode,
  onViewModeChange,
  stats,
}: BannerFiltersProps) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
        {[
          { id: "all", label: "Todos", count: stats.total },
          { id: "active", label: "Ativos", count: stats.active },
          { id: "inactive", label: "Inativos", count: stats.inactive },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => onFilterChange(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              filterStatus === tab.id
                ? "bg-[#0f1e36] text-white shadow-xs"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab.label}
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                filterStatus === tab.id ? "bg-[#44abff] text-[#0f1e36]" : "bg-gray-200 text-gray-700"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Right controls: View mode + Search */}
      <div className="flex items-center gap-2 w-full md:w-auto">
        <div className="flex items-center bg-gray-50 p-1 rounded-xl border border-gray-200">
          <button
            onClick={() => onViewModeChange("cards")}
            className={`p-1.5 rounded-lg text-xs transition-all ${
              viewMode === "cards" ? "bg-white text-[#0f1e36] shadow-xs" : "text-gray-500 hover:text-[#0f1e36]"
            }`}
            title="Visualização em Cards"
          >
            <Layers size={15} />
          </button>
          <button
            onClick={() => onViewModeChange("table")}
            className={`p-1.5 rounded-lg text-xs transition-all ${
              viewMode === "table" ? "bg-white text-[#0f1e36] shadow-xs" : "text-gray-500 hover:text-[#0f1e36]"
            }`}
            title="Visualização em Tabela"
          >
            <SlidersHorizontal size={15} />
          </button>
        </div>

        <div className="relative flex-1 md:w-56">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por título ou link..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/30 text-[#0f1e36]"
          />
        </div>
      </div>
    </div>
  );
}
