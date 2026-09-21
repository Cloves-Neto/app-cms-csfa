import { useState, useEffect } from "react";
import WrapPages from "@/layouts/WrapPages";
import { ShieldCheck, Activity, Clock, User, ArrowLeft, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { logService, type AuditLogItem } from "@/features/logs/services/log.service";

export function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [moduleFilter, setModuleFilter] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadLogs = async () => {
    setIsLoading(true);
    const res = await logService.getLogs({
      page,
      limit: 20,
      module: moduleFilter || undefined,
    });
    setLogs(res.items || []);
    setTotal(res.total || 0);
    setIsLoading(false);
  };

  useEffect(() => {
    loadLogs();
  }, [page, moduleFilter]);

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
      case "CREATE_MATERIAL":
        return { label: "Material Cadastrado", color: "bg-rose-50 text-rose-700 border-rose-200" };
      case "DELETE_MATERIAL":
        return { label: "Material Removido", color: "bg-red-50 text-red-700 border-red-200" };
      default:
        return { label: action, color: "bg-gray-50 text-gray-700 border-gray-200" };
    }
  };

  return (
    <WrapPages
      header={
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0f1e36] text-white flex items-center justify-center">
              <ShieldCheck size={20} className="text-[#44abff]" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#0f1e36] tracking-tight">Logs de Auditoria e Segurança</h2>
              <p className="text-xs text-gray-400 font-medium">Histórico completo de ações administrativas e eventos do sistema</p>
            </div>
          </div>

          <Link
            to="/dashboard"
            className="text-xs font-bold text-gray-500 hover:text-[#0f1e36] flex items-center gap-1.5 self-start sm:self-auto"
          >
            <ArrowLeft size={14} />
            Voltar ao Dashboard
          </Link>
        </div>
      }
      content={
        <div className="space-y-4 w-full h-full flex flex-col min-h-0">
          {/* Top Controls: Filters */}
          <div className="bg-white rounded-3xl border border-gray-100 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
              <select
                value={moduleFilter}
                onChange={(e) => {
                  setModuleFilter(e.target.value);
                  setPage(1);
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gray-50 text-gray-600 hover:bg-gray-100 border-none outline-none focus:ring-0 cursor-pointer"
              >
                <option value="">Todos os Módulos</option>
                <option value="AUTH">Autenticação</option>
                <option value="POSTS">Postagens</option>
                <option value="BANNERS">Banners</option>
                <option value="AGENDA">Agenda Escolar</option>
                <option value="USERS">Usuários</option>
                <option value="NOTIFICATIONS">Notificações</option>
                <option value="SYSTEM">Sistema</option>
              </select>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
                Total: {total}
              </span>
              <div className="relative w-full md:w-72">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar nos logs..."
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/30 text-[#0f1e36]"
                />
              </div>
            </div>
          </div>

          {/* Logs List */}
          <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden flex flex-col min-h-0">
            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-2 p-12">
                <Activity className="animate-spin text-[#44abff]" size={24} />
                <span className="text-xs">Carregando logs do sistema...</span>
              </div>
            ) : logs.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-gray-400 space-y-2">
                <ShieldCheck size={32} className="text-gray-300 mx-auto" />
                <p className="text-xs font-semibold text-gray-500">Nenhum log encontrado.</p>
                <p className="text-[11px] text-gray-400">
                  As ações e eventos do sistema correspondentes aos filtros aparecerão aqui.
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-gray-100">
                {logs.map((log) => {
                  const badge = formatAction(log.action);
                  return (
                    <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left hover:bg-gray-50/50 transition-colors px-2 rounded-lg">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badge.color}`}>
                            {badge.label}
                          </span>
                          <span className="text-xs font-bold text-[#0f1e36]">
                            {log.details || log.module}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-[11px] text-gray-400">
                          <span className="flex items-center gap-1 font-medium">
                            <User size={12} />
                            {log.user ? `${log.user.firstName || log.user.email} (${log.user.role})` : "Ação de Sistema"}
                          </span>
                          {log.ipAddress && (
                            <span className="text-[10px] text-gray-400">IP: {log.ipAddress}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-gray-400 shrink-0 self-end sm:self-center font-medium">
                        <Clock size={12} />
                        {new Date(log.createdAt).toLocaleString("pt-BR")}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      }
    />
  );
}

export default AuditLogsPage;
