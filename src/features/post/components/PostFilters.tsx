import { Search } from "lucide-react";
import type { PostFilterStatus, PostStats } from "../types/post.types";

interface PostFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterStatus: PostFilterStatus;
  onFilterChange: (status: PostFilterStatus) => void;
  stats: PostStats;
}

export function PostFilters({
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterChange,
  stats,
}: PostFiltersProps) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
      {/* Status Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
        {[
          { id: "all", label: "Todas", count: stats.total },
          { id: "published", label: "Publicadas", count: stats.published },
          { id: "draft", label: "Rascunhos", count: stats.draft },
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

      {/* Search Box */}
      <div className="relative w-full md:w-72">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por título, autor ou categoria..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/30 text-[#0f1e36]"
        />
      </div>
    </div>
  );
}
