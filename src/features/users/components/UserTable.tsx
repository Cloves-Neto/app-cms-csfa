import { TableSkeleton } from "@/components/common/Skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { Pagination } from "@/components/common/Pagination";
import type { UserItem, UserStatus } from "../types/user.types";
import { UserTableRow } from "./UserTableRow";

interface UserTableProps {
  users: UserItem[];
  totalFilteredCount: number;
  isLoading: boolean;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onEdit: (user: UserItem) => void;
  onResetPassword: (user: UserItem) => void;
  onToggleStatus: (id: string | number, newStatus: UserStatus) => void;
  onDelete: (id: string | number) => void;
}

export function UserTable({
  users,
  totalFilteredCount,
  isLoading,
  currentPage,
  itemsPerPage,
  onPageChange,
  onEdit,
  onResetPassword,
  onToggleStatus,
  onDelete,
}: UserTableProps) {
  if (isLoading) {
    return <TableSkeleton rows={5} cols={6} />;
  }

  if (totalFilteredCount === 0) {
    return (
      <EmptyState
        title="Nenhum usuário encontrado"
        description="Não encontramos nenhum usuário correspondente aos critérios de busca ou filtro informados."
      />
    );
  }

  const totalPages = Math.ceil(totalFilteredCount / itemsPerPage) || 1;

  return (
    <div className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden pt-2">
      <div className="overflow-x-auto overflow-y-auto flex-1 min-h-0 pr-1">
        <table className="w-full text-left border-collapse min-w-190">
          <thead>
            <tr className="border-b border-gray-200/80 text-[11px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">
              <th className="py-3.5 sm:py-4 px-4 sm:px-5 rounded-l-xl">Usuário</th>
              <th className="py-3.5 sm:py-4 px-4 sm:px-5">Cargo & Permissões</th>
              <th className="py-3.5 sm:py-4 px-4 sm:px-5">Horário de Acesso</th>
              <th className="py-3.5 sm:py-4 px-4 sm:px-5">Último Acesso</th>
              <th className="py-3.5 sm:py-4 px-4 sm:px-5 text-center">Status</th>
              <th className="py-3.5 sm:py-4 px-4 sm:px-5 text-right rounded-r-xl">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
            {users.map((user) => (
              <UserTableRow
                key={user.id}
                user={user}
                onEdit={onEdit}
                onResetPassword={onResetPassword}
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
