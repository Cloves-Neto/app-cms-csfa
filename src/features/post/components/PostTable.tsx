import { TableSkeleton } from "@/components/common/Skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { Pagination } from "@/components/common/Pagination";
import type { Post } from "../types/post.types";
import { PostTableRow } from "./PostTableRow";

interface PostTableProps {
  posts: Post[];
  totalFilteredCount: number;
  isLoading: boolean;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onToggleStatus: (id: string | number) => void;
  onDelete: (id: string | number) => void;
}

export function PostTable({
  posts,
  totalFilteredCount,
  isLoading,
  currentPage,
  itemsPerPage,
  onPageChange,
  onToggleStatus,
  onDelete,
}: PostTableProps) {
  if (isLoading) {
    return <TableSkeleton rows={5} cols={6} />;
  }

  if (totalFilteredCount === 0) {
    return (
      <EmptyState
        title="Nenhuma postagem encontrada"
        description="Não encontramos nenhuma postagem correspondente aos critérios de busca ou filtro informados."
      />
    );
  }

  const totalPages = Math.ceil(totalFilteredCount / itemsPerPage) || 1;

  return (
    <div className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden pt-2">
      <div className="overflow-x-auto overflow-y-auto flex-1 min-h-0 pr-1">
        <table className="w-full text-left border-collapse min-w-175">
          <thead>
            <tr className="border-b border-gray-200/80 text-[11px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">
              <th className="py-3.5 sm:py-4 px-4 sm:px-5 rounded-l-xl">Título da Postagem</th>
              <th className="py-3.5 sm:py-4 px-4 sm:px-5">Autor / Categoria</th>
              <th className="py-3.5 sm:py-4 px-4 sm:px-5">Data</th>
              <th className="py-3.5 sm:py-4 px-4 sm:px-5 text-center">Visualizações</th>
              <th className="py-3.5 sm:py-4 px-4 sm:px-5 text-center">Status</th>
              <th className="py-3.5 sm:py-4 px-4 sm:px-5 text-right rounded-r-xl">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
            {posts.map((post) => (
              <PostTableRow
                key={post.id}
                post={post}
                onToggleStatus={onToggleStatus}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
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
