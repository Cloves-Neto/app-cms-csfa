import { Search } from "lucide-react";
import type { UserStats, UserStatus } from "../types/user.types";

interface UserFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: "all" | UserStatus;
  onStatusFilterChange: (status: "all" | UserStatus) => void;
  roleFilter: string;
  onRoleFilterChange: (role: string) => void;
  stats: UserStats;
}

export function UserFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  roleFilter,
  onRoleFilterChange,
  stats,
}: UserFiltersProps) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
      {/* Status Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
        {[
          { id: "all", label: "Todos", count: stats.total },
          { id: "active", label: "Ativos", count: stats.active },
          { id: "inactive", label: "Inativos", count: stats.total - stats.active - stats.blocked },
          { id: "blocked", label: "Bloqueados", count: stats.blocked },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => onStatusFilterChange(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              statusFilter === tab.id
                ? "bg-[#0f1e36] text-white shadow-xs"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab.label}
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                statusFilter === tab.id ? "bg-[#44abff] text-[#0f1e36]" : "bg-gray-200 text-gray-700"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Role filter & Search box */}
      <div className="flex items-center gap-2 w-full md:w-auto">
        <select
          value={roleFilter}
          onChange={(e) => onRoleFilterChange(e.target.value)}
          className="bg-gray-50 text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/40 text-[#0f1e36] font-semibold"
        >
          <option value="all">Todos os Cargos</option>
          <option value="ti">Administrador (TI)</option>
          <option value="coordenacao">Coordenação Pedagógica</option>
          <option value="secretaria">Secretaria & Comunicação</option>
          <option value="professor">Professores</option>
        </select>

        <div className="relative flex-1 md:w-56">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, e-mail ou cargo..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/30 text-[#0f1e36]"
          />
        </div>
      </div>
    </div>
  );
}
