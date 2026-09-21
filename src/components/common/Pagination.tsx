import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className = "",
}: PaginationProps) {
  if (totalItems === 0) return null;

  const effectiveTotalPages = Math.max(1, totalPages);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const pages = Array.from({ length: effectiveTotalPages }, (_, i) => i + 1);

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-100 ${className}`}>
      <span className="text-xs text-gray-500 font-medium">
        Exibindo <strong className="text-[#0f1e36]">{startItem}</strong> a{" "}
        <strong className="text-[#0f1e36]">{endItem}</strong> de{" "}
        <strong className="text-[#0f1e36]">{totalItems}</strong> registros
      </span>

      <div className="flex items-center gap-1.5 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          icon={<ChevronLeft size={14} />}
        >
          Anterior
        </Button>

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
              page === currentPage
                ? "bg-[#0f1e36] text-white shadow-xs"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-[#0f1e36] border border-gray-200/80"
            }`}
          >
            {page}
          </button>
        ))}

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= effectiveTotalPages}
          onClick={() => onPageChange(currentPage + 1)}
          icon={<ChevronRight size={14} />}
          iconPosition="right"
        >
          Próximo
        </Button>
      </div>
    </div>
  );
}
