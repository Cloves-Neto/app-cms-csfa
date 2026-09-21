import { Link } from "react-router-dom";
import { FilePlus, BellRing, UserPlus } from "lucide-react";
import { useAuth } from "@/features/auth";

interface DashboardHeaderProps {
  onOpenNotifyModal: () => void;
}

export function DashboardHeader({ onOpenNotifyModal }: DashboardHeaderProps) {
  const { user } = useAuth();
  const userName = user?.firstName ?? "Administrador";

  const currentDateStr = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  const formattedDate = currentDateStr.charAt(0).toUpperCase() + currentDateStr.slice(1);

  return (
    <nav className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full h-full">
      <div className="w-full sm:w-auto">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0f1e36]">
          Olá, {userName}! 👋
        </h1>
        <p className="text-xs text-gray-500 font-normal mt-0.5">
          {formattedDate} — Painel Geral CSFA
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 justify-start shrink-0 w-full sm:w-auto">
        <Link
          to="/dashboard/posts/novo"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#0f1e36] text-white text-xs font-bold hover:bg-[#0f1e36]/90 transition-all shadow-xs"
        >
          <FilePlus size={14} className="text-[#44abff]" />
          <span>Nova Postagem</span>
        </Link>

        <button
          onClick={onOpenNotifyModal}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white border border-gray-200 text-[#0f1e36] text-xs font-bold hover:bg-gray-50 transition-all shadow-xs"
        >
          <BellRing size={14} className="text-[#44abff]" />
          <span>Disparar Notificação</span>
        </button>

        <Link
          to="/dashboard/usuarios"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white border border-gray-200 text-[#0f1e36] text-xs font-bold hover:bg-gray-50 transition-all shadow-xs"
        >
          <UserPlus size={14} className="text-[#44abff]" />
          <span>Novo Usuário</span>
        </Link>
      </div>
    </nav>
  );
}
