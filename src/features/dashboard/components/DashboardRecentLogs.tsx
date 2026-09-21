import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Activity, ArrowRight, Clock, User } from "lucide-react";
import { logService, type AuditLogItem } from "@/features/logs/services/log.service";
import { EmptyState } from "@/components/common/EmptyState";

export function DashboardRecentLogs() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    logService.getLogs({ limit: 5 }).then((res) => {
      if (mounted) {
        setLogs(res.items || []);
        setIsLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const formatAction = (action: string) => {
    switch (action) {
      case "LOGIN":
        return { label: "Login Realizado", color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
      case "APPROVE_POST":
        return { label: "Post Aprovado", color: "bg-blue-50 text-blue-700 border-blue-200" };
      case "RETURN_POST":
        return { label: "Post Devolvido", color: "bg-amber-50 text-amber-700 border-amber-200" };
      case "SUBMIT_POST_REVIEW":
        return { label: "Revisão Solicitada", color: "bg-purple-50 text-purple-700 border-purple-200" };
      case "CREATE_POST":
        return { label: "Novo Post", color: "bg-sky-50 text-sky-700 border-sky-200" };
      case "SEND_NOTIFICATION":
        return { label: "Notificação Disparada", color: "bg-indigo-50 text-indigo-700 border-indigo-200" };
      case "CREATE_USER":
        return { label: "Usuário Criado", color: "bg-teal-50 text-teal-700 border-teal-200" };
      default:
        return { label: action, color: "bg-gray-50 text-gray-700 border-gray-200" };
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-xs flex flex-col justify-start h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#0f1e36]/5 text-[#0f1e36] flex items-center justify-center">
            <ShieldCheck size={18} className="text-[#44abff]" />
          </div>
          <div>
            <h3 className="font-black text-sm text-[#0f1e36] tracking-tight leading-none">
              Logs Recentes de Auditoria
            </h3>
            <span className="text-[11px] font-medium text-gray-400">
              Últimas atividades registradas
            </span>
          </div>
        </div>

        <Link
          to="/dashboard/logs"
          className="text-xs font-bold text-[#44abff] hover:text-[#0f1e36] flex items-center gap-1 transition-colors"
        >
          Ver todos
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-50 pt-2 space-y-2">
        {isLoading ? (
          <div className="py-8 flex flex-col items-center justify-center text-gray-400 gap-2">
            <Activity className="animate-spin text-[#44abff]" size={20} />
            <span className="text-xs">Carregando logs do sistema...</span>
          </div>
        ) : logs.length === 0 ? (
          <EmptyState
            icon={<ShieldCheck size={32} className="text-gray-300 mb-2 stroke-1" />}
            title="Nenhum log registrado"
            description="Nenhuma atividade registrada até o momento no sistema."
          />
        ) : (
          logs.map((item) => {
            const badge = formatAction(item.action);
            return (
              <div key={item.id} className="pt-2.5 pb-2 flex items-start justify-between gap-3 text-left">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className="text-[11px] text-gray-500 font-medium truncate">
                      {item.details || item.module}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <User size={10} />
                      {item.user ? `${item.user.firstName || item.user.email}` : "Sistema"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {new Date(item.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
