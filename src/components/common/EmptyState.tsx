import { type ReactNode } from "react";
import { Search } from "lucide-react";

export interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  icon = <Search size={32} className="text-gray-300 mb-2 stroke-1" />,
  title = "Nenhum resultado encontrado",
  description = "Não encontramos nenhum item correspondente aos seus critérios de busca ou filtros.",
  action,
}: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-gray-400 w-full h-full min-h-[120px]">
      {icon}
      <p className="text-xs font-semibold text-gray-500">{title}</p>
      {description && (
        <p className="text-[11px] text-gray-400 mt-0.5 max-w-[250px] mx-auto leading-tight">
          {description}
        </p>
      )}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
