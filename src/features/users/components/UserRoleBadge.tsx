import { Shield, Sparkles, User, Building2 } from "lucide-react";
import type { ModulePermission } from "../types/user.types";

interface UserRoleBadgeProps {
  role: string;
  permissions?: ModulePermission[];
}

export function UserRoleBadge({ role, permissions = [] }: UserRoleBadgeProps) {
  const activePermissionsCount = permissions.filter((p) => p.level !== "none").length;

  const isTI = role.toLowerCase().includes("ti") || role.toLowerCase().includes("admin");
  const isCoord = role.toLowerCase().includes("coordena");
  const isSecretaria = role.toLowerCase().includes("secretaria") || role.toLowerCase().includes("comunicação");

  const icon = isTI ? (
    <Shield size={12} className="text-[#44abff]" />
  ) : isCoord ? (
    <Sparkles size={12} className="text-purple-600" />
  ) : isSecretaria ? (
    <Building2 size={12} className="text-emerald-600" />
  ) : (
    <User size={12} className="text-gray-500" />
  );

  return (
    <div className="space-y-1">
      <span className="text-xs font-bold text-[#0f1e36] flex items-center gap-1.5">
        {icon}
        <span>{role}</span>
      </span>
      {permissions.length > 0 && (
        <span className="px-2 py-0.5 rounded-md bg-gray-100 border border-gray-200 text-[10px] font-bold text-gray-600 inline-block">
          {activePermissionsCount === permissions.length
            ? "Acesso Total (5/5)"
            : `${activePermissionsCount}/${permissions.length} módulos`}
        </span>
      )}
    </div>
  );
}
