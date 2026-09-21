import { TableSkeleton, CardsSkeleton } from "@/components/common/Skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { Pagination } from "@/components/common/Pagination";
import type { Banner } from "../types/banner.types";
import { BannerCard } from "./BannerCard";
import { BannerTableRow } from "./BannerTableRow";

interface BannerTableProps {
  banners: Banner[];
  totalFilteredCount: number;
  isLoading: boolean;
  viewMode: "cards" | "table";
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onEdit: (banner: Banner) => void;
  onDelete: (id: string | number) => void;
  onToggleStatus: (id: string | number) => void;
  onReorder: (id: string | number, direction: "up" | "down") => void;
}

export function BannerTable({
  banners,
  totalFilteredCount,
  isLoading,
  viewMode,
  currentPage,
  itemsPerPage,
  onPageChange,
  onEdit,
  onDelete,
  onToggleStatus,
  onReorder,
}: BannerTableProps) {
  if (isLoading) {
    return viewMode === "cards" ? <CardsSkeleton count={6} /> : <TableSkeleton rows={5} cols={6} />;
  }

  if (totalFilteredCount === 0) {
    return (
      <EmptyState
        title="Nenhum banner encontrado"
        description="Não encontramos nenhum banner cadastrado com os filtros informados."
      />
    );
  }

  const totalPages = Math.ceil(totalFilteredCount / itemsPerPage) || 1;

  return (
    <div className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden pt-2">
      {viewMode === "cards" ? (
        <div className="overflow-y-auto flex-1 min-h-0 pr-1 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {banners.map((banner) => (
              <BannerCard
                key={banner.id}
                banner={banner}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleStatus={onToggleStatus}
                onReorder={onReorder}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto overflow-y-auto flex-1 min-h-0 pr-1">
          <table className="w-full text-left border-collapse min-w-160">
            <thead>
              <tr className="border-b border-gray-200 text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                <th className="py-3 px-4 rounded-l-xl">Ordem</th>
                <th className="py-3 px-4">Imagem</th>
                <th className="py-3 px-4">Título / Link</th>
                <th className="py-3 px-4">Data Publicação</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right rounded-r-xl">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {banners.map((banner) => (
                <BannerTableRow
                  key={banner.id}
                  banner={banner}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleStatus={onToggleStatus}
                  onReorder={onReorder}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

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
