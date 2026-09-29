import { type ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";

export interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  icon = (
    <div className="w-12 h-12 rounded-full flex items-center justify-center text-gray-300 mb-3 border-[3px] border-gray-200">
      <CheckCircle2 size={24} className="text-gray-300 stroke-[3]" />
    </div>
  ),
  title = "Nenhum resultado encontrado",
  description = "Não encontramos nenhum item correspondente aos seus critérios de busca ou filtros.",
  action,
}: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-16 px-4 text-center w-full h-full min-h-[200px]">
      {icon}
      <h3 className="text-base font-bold text-[#0f1e36] mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 font-medium max-w-md mx-auto">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
