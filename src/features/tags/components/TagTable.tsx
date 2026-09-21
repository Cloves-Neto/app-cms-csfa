import { TableSkeleton } from "@/components/common/Skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { Pagination } from "@/components/common/Pagination";
import type { TagItem } from "../types/tag.types";
import { TagTableRow } from "./TagTableRow";

interface TagTableProps {
  tags: TagItem[];
  totalFilteredCount: number;
  isLoading: boolean;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onEdit: (tag: TagItem) => void;
  onDelete: (id: string | number) => void;
  onToggleStatus: (id: string | number) => void;
}

export function TagTable({
  tags,
  totalFilteredCount,
  isLoading,
  currentPage,
  itemsPerPage,
  onPageChange,
  onEdit,
  onDelete,
  onToggleStatus,
}: TagTableProps) {
  if (isLoading) {
    return <TableSkeleton rows={5} cols={6} />;
  }

  if (totalFilteredCount === 0) {
    return (
      <EmptyState
        title="Nenhuma tag encontrada"
        description="Não encontramos nenhuma tag correspondente aos filtros informados."
      />
    );
  }

  const totalPages = Math.ceil(totalFilteredCount / itemsPerPage) || 1;

  return (
    <div className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden pt-2">
      <div className="overflow-x-auto overflow-y-auto flex-1 min-h-0 pr-1">
        <table className="w-full text-left border-collapse min-w-160">
          <thead>
            <tr className="border-b border-gray-200 text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">
              <th className="py-3 px-4 rounded-l-xl">Tag / Categoria</th>
              <th className="py-3 px-4">Slug URL</th>
              <th className="py-3 px-4">Descrição</th>
              <th className="py-3 px-4 text-center">Utilização</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right rounded-r-xl">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tags.map((tag) => (
              <TagTableRow
                key={tag.id}
                tag={tag}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleStatus={onToggleStatus}
              />
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalFilteredCount}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
      />
    </div>
  );
}
