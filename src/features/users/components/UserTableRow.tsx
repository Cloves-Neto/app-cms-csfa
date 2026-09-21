import { Globe, Building2, Pencil, KeyRound, Trash2 } from "lucide-react";
import type { UserItem, UserStatus } from "../types/user.types";
import { UserRoleBadge } from "./UserRoleBadge";
import { UserStatusBadge } from "./UserStatusBadge";

interface UserTableRowProps {
  user: UserItem;
  onEdit: (user: UserItem) => void;
  onResetPassword: (user: UserItem) => void;
  onToggleStatus: (id: string | number, newStatus: UserStatus) => void;
  onDelete: (id: string | number) => void;
}

export function UserTableRow({
  user,
  onEdit,
  onResetPassword,
  onToggleStatus,
  onDelete,
}: UserTableRowProps) {
  return (
    <tr className="hover:bg-gray-50/80 transition-colors group">
      {/* User Info (Avatar, Name, Email) */}
      <td className="py-3.5 sm:py-4 px-4 sm:px-5">
        <div className="flex items-center gap-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-9 h-9 rounded-full object-cover border border-gray-200 shrink-0 shadow-xs"
            onError={(e) => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0f1e36&color=44abff`;
            }}
          />
          <div className="space-y-0.5">
            <p className="font-bold text-[#0f1e36] text-xs sm:text-sm group-hover:text-[#44abff] transition-colors">
              {user.name}
            </p>
            <p className="text-[11px] text-gray-500 font-medium">{user.email}</p>
          </div>
        </div>
      </td>

      {/* Role & Permissions */}
      <td className="py-3.5 sm:py-4 px-4 sm:px-5">
        <UserRoleBadge role={user.role} permissions={user.permissions} />
      </td>

      {/* Access Schedule */}
      <td className="py-3.5 sm:py-4 px-4 sm:px-5">
        <div className="flex items-center gap-1.5">
          {user.accessSchedule === "full" ? (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-200">
              <Globe size={11} className="text-blue-600" />
              Livre 24h
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-[11px] font-bold border border-gray-200">
              <Building2 size={11} className="text-gray-500" />
              Horário Comercial
            </span>
          )}
        </div>
      </td>

      {/* Last Access */}
      <td className="py-3.5 sm:py-4 px-4 sm:px-5 text-gray-500 font-medium text-xs">
        {user.lastAccess}
      </td>

      {/* Status */}
      <td className="py-3.5 sm:py-4 px-4 sm:px-5 text-center">
        <UserStatusBadge
          status={user.status}
          onToggleStatus={(newStatus) => onToggleStatus(user.id, newStatus)}
        />
      </td>

      {/* Actions */}
      <td className="py-3.5 sm:py-4 px-4 sm:px-5 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => onEdit(user)}
            className="p-2 rounded-xl text-gray-500 hover:text-[#0f1e36] hover:bg-gray-100 transition-colors"
            title="Editar Cadastro e Permissões"
          >
            <Pencil size={15} />
          </button>

          <button
            onClick={() => onResetPassword(user)}
            className="p-2 rounded-xl text-gray-500 hover:text-[#44abff] hover:bg-[#44abff]/10 transition-colors"
            title="Redefinir Senha (TI)"
          >
            <KeyRound size={15} />
          </button>

          <button
            onClick={() => onDelete(user.id)}
            className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Excluir Usuário"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
}
