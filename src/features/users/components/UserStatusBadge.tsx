import { Check, Clock, UserX } from "lucide-react";
import type { UserStatus } from "../types/user.types";

interface UserStatusBadgeProps {
  status: UserStatus;
  onToggleStatus?: (newStatus: UserStatus) => void;
}

export function UserStatusBadge({ status, onToggleStatus }: UserStatusBadgeProps) {
  const getNextStatus = (current: UserStatus): UserStatus => {
    if (current === "active") return "inactive";
    if (current === "inactive") return "blocked";
    return "active";
  };

  const handleClick = () => {
    if (onToggleStatus) {
      onToggleStatus(getNextStatus(status));
    }
  };

  const statusConfig = {
    active: {
      label: "Ativo",
      icon: <Check size={11} className="text-emerald-600" />,
      classes: "bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100",
    },
    inactive: {
      label: "Inativo",
      icon: <Clock size={11} className="text-amber-600" />,
      classes: "bg-amber-50 text-amber-700 border-amber-200/80 hover:bg-amber-100",
    },
    blocked: {
      label: "Bloqueado",
      icon: <UserX size={11} className="text-rose-600" />,
      classes: "bg-rose-50 text-rose-700 border-rose-200/80 hover:bg-rose-100",
    },
  }[status];

  return (
    <button
      onClick={handleClick}
      type="button"
      className={`px-3 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 mx-auto border transition-all ${statusConfig.classes}`}
      title="Clique para alternar status (Ativo -> Inativo -> Bloqueado)"
    >
      {statusConfig.icon}
      <span>{statusConfig.label}</span>
    </button>
  );
}
