import { useState, useEffect } from "react";
import WrapPages from "@/layouts/WrapPages";
import { useAuth } from "@/features/auth";
import { Bell, Send, History, Check, AlertTriangle, Info, CheckCircle2, Search } from "lucide-react";
import { notificationService, type AppNotification } from "@/features/notifications/services/notification.service";
import { userService } from "@/features/users/services/user.service";
import { TableSkeleton } from "@/components/common/Skeleton";
import { EmptyState } from "@/components/common/EmptyState";

export function NotificationsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"INBOX" | "SEND" | "HISTORY">("INBOX");
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [history, setHistory] = useState<AppNotification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<AppNotification | null>(null);
  
  // Filters
  const [readFilter, setReadFilter] = useState<"ALL" | "READ" | "UNREAD">("ALL");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [usersList, setUsersList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Form states
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"INFO" | "WARNING" | "SUCCESS" | "DANGER">("INFO");
  const [targetUserId, setTargetUserId] = useState<string>("");
  const [targetRoles, setTargetRoles] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [actionUrl, setActionUrl] = useState("");
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);

  const canSend = user?.role === "ADMIN" || user?.role === "COORDENACAO" || user?.role === "SECRETARIA";

  // Filter logic
  const filteredNotifications = notifications.filter(n => {
      let matches = true;
      if (readFilter === "READ" && !n.isRead) matches = false;
      if (readFilter === "UNREAD" && n.isRead) matches = false;
      if (dateFilter) {
          const notifDate = new Date(n.createdAt).toISOString().split("T")[0];
          if (notifDate !== dateFilter) matches = false;
      }
      if (searchQuery) {
          const lowerQ = searchQuery.toLowerCase();
          if (!n.title.toLowerCase().includes(lowerQ) && !n.message.toLowerCase().includes(lowerQ)) {
              matches = false;
          }
      }
      return matches;
  });

  const loadInbox = async () => {
    setIsLoading(true);
    const data = await notificationService.getMyNotifications();
    setNotifications(data);
    setIsLoading(false);
  };

  const loadHistory = async () => {
    if (!canSend) return;
    setIsLoading(true);
    const data = await notificationService.getHistory();
    setHistory(data);
    setIsLoading(false);
  };

  const loadUsers = async () => {
    if (!canSend) return;
    try {
      const data = await userService.getAll();
      setUsersList(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (activeTab === "INBOX") loadInbox();
    if (activeTab === "HISTORY") loadHistory();
    if (activeTab === "SEND") loadUsers();
  }, [activeTab]);

  const handleMarkAsRead = async (id: string) => {
    await notificationService.markAsRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const toggleRole = (r: string) => {
    setTargetRoles(prev => 
      prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]
    );
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    try {
      setIsSending(true);
      
      const isGlobal = targetRoles.length === 0 && !targetUserId;

      let uploadedAttachmentUrl = null;
      let uploadedAttachmentType = null;

      if (attachmentFile) {
        const formData = new FormData();
        formData.append("file", attachmentFile);
        formData.append("folder", "documentos");
        
        // Simples chamada direta ao endpoint de upload para o anexo da notificação
        const res = await fetch("http://localhost:8080/api/upload", {
          method: "POST",
          body: formData,
        });
        const uploadResult = await res.json();
        
        if (uploadResult?.data?.url) {
          uploadedAttachmentUrl = uploadResult.data.url;
          // Definir tipo básico
          const mime = attachmentFile.type;
          if (mime.includes("image")) uploadedAttachmentType = "IMAGE";
          else if (mime.includes("pdf")) uploadedAttachmentType = "PDF";
          else uploadedAttachmentType = "DOC";
        }
      }

      await notificationService.send({
        title,
        message,
        type,
        targetUserId: targetUserId || null,
        targetRoles: targetRoles,
        isGlobal,
        actionUrl: actionUrl || undefined,
        attachmentUrl: uploadedAttachmentUrl || undefined,
        attachmentType: uploadedAttachmentType || undefined,
      });

      setStatusMessage("Notificação enviada com sucesso!");
      setTitle("");
      setMessage("");
      setTargetUserId("");
      setTargetRoles([]);
      setActionUrl("");
      setAttachmentFile(null);
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (error) {
      alert("Erro ao disparar notificação.");
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteSent = async (id: string) => {
    if (!confirm("Deseja realmente excluir esta notificação enviada?")) return;
    try {
      await notificationService.delete(id);
      setHistory(prev => prev.filter(n => n.id !== id));
    } catch (e) {
      alert("Erro ao excluir notificação.");
    }
  };

  const handleResend = (item: AppNotification) => {
    setTitle(item.title);
    setMessage(item.message);
    setType(item.type);
    
    if (item.isGlobal) {
        setTargetUserId("");
        setTargetRoles([]);
    } else {
        setTargetUserId(item.targetUserId || "");
        setTargetRoles(item.targetRoles || []);
    }
    
    setActionUrl(item.actionUrl || "");
    setActiveTab("SEND");
  };

  const getTypeIcon = (t: string) => {
    switch (t) {
      case "WARNING":
        return <AlertTriangle size={16} className="text-amber-500" />;
      case "SUCCESS":
        return <CheckCircle2 size={16} className="text-emerald-500" />;
      case "DANGER":
        return <AlertTriangle size={16} className="text-red-500" />;
      default:
        return <Info size={16} className="text-[#44abff]" />;
    }
  };

  return (
    <>
    <WrapPages
      header={
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0f1e36] text-white flex items-center justify-center">
              <Bell size={20} className="text-[#44abff]" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#0f1e36] tracking-tight">Central de Notificações</h2>
              <p className="text-xs text-gray-400 font-medium">Comunicação e avisos institucionais</p>
            </div>
          </div>

        </div>
      }
      actions={
        activeTab === "INBOX" && notifications.length > 0 ? (
          <div className="flex justify-end w-full">
            <button
              onClick={handleMarkAllRead}
              className="text-xs font-bold text-[#44abff] hover:text-[#0f1e36] transition-colors flex items-center gap-1"
            >
              <Check size={14} />
              Marcar todas como lidas
            </button>
          </div>
        ) : undefined
      }
      content={
        <div className="space-y-4 w-full h-full flex flex-col min-h-0">
          <div className="bg-white rounded-3xl border border-gray-100 p-4 shadow-xs flex flex-col xl:flex-row xl:items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 xl:pb-0">
              <button
                onClick={() => setActiveTab("INBOX")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === "INBOX"
                    ? "bg-[#0f1e36] text-white shadow-xs"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                Caixa de Entrada
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    activeTab === "INBOX" ? "bg-[#44abff] text-[#0f1e36]" : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {notifications.filter((n) => !n.isRead).length}
                </span>
              </button>

              {canSend && (
                <>
                  <button
                    onClick={() => setActiveTab("SEND")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      activeTab === "SEND"
                        ? "bg-[#0f1e36] text-white shadow-xs"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Send size={14} />
                    Enviar Notificação
                  </button>
                  <button
                    onClick={() => setActiveTab("HISTORY")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      activeTab === "HISTORY"
                        ? "bg-[#0f1e36] text-white shadow-xs"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <History size={14} />
                    Histórico
                  </button>
                </>
              )}
            </div>

            {activeTab === "INBOX" && (
              <div className="flex flex-wrap items-center gap-2">
                <select 
                  value={readFilter} 
                  onChange={(e) => setReadFilter(e.target.value as any)} 
                  className="text-xs p-2 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/30 text-[#0f1e36]"
                >
                  <option value="ALL">Todas</option>
                  <option value="UNREAD">Não lidas</option>
                  <option value="READ">Lidas</option>
                </select>

                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="text-xs p-2 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/30 text-[#0f1e36]"
                />
                
                <div className="relative w-full sm:w-64">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar notificações..."
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/30 text-[#0f1e36]"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 bg-white rounded-3xl border border-gray-100 p-6 shadow-xs overflow-y-auto min-h-0">
          {activeTab === "INBOX" && (
            <div className="space-y-3">
              {isLoading ? (
                <div className="pt-2">
                  <TableSkeleton rows={4} />
                </div>
              ) : filteredNotifications.length === 0 ? (
                <EmptyState
                  title="Nenhuma notificação"
                  description="Você não possui notificações no momento."
                />
              ) : (
                filteredNotifications.slice(0, 6).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                        setSelectedNotification(item);
                        if (!item.isRead) handleMarkAsRead(item.id);
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 text-left group ${
                      item.isRead
                        ? "bg-white border-gray-100 text-gray-600 hover:border-gray-200"
                        : "bg-blue-50/40 border-[#44abff]/30 text-[#0f1e36] hover:bg-blue-50 hover:shadow-xs"
                    }`}
                  >
                    <div className="shrink-0 mt-0.5">
                       {item.sender?.firstName ? (
                           <div className="w-10 h-10 rounded-full bg-[#0f1e36] text-[#44abff] flex items-center justify-center text-sm font-bold shadow-xs">
                               {item.sender.firstName.charAt(0)}{item.sender.lastName ? item.sender.lastName.charAt(0) : ''}
                           </div>
                       ) : (
                           <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                               {getTypeIcon(item.type)}
                           </div>
                       )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center min-h-[40px]">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-bold text-sm text-[#0f1e36] truncate">{item.title}</h4>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-bold text-gray-700">
                            {item.sender?.firstName ? `${item.sender.firstName} ${item.sender.lastName || ''}` : "Sistema CSFA"}
                        </span>
                        <span className="text-[10px] text-gray-400">• {new Date(item.createdAt).toLocaleDateString("pt-BR")}</span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mt-1">{item.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: SEND NOTIFICATION */}
          {activeTab === "SEND" && canSend && (
            <form onSubmit={handleSendNotification} className="max-w-2xl mx-auto space-y-4 text-left">
              {statusMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl font-bold">
                  {statusMessage}
                </div>
              )}

              <div className="space-y-3">
                <label className="text-xs font-bold text-[#0f1e36]">Destinatários (Setores)</label>
                <div className="flex flex-wrap gap-3">
                  <label className="flex items-center gap-2 cursor-pointer bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl">
                    <input 
                      type="checkbox" 
                      checked={targetRoles.length === 0 && !targetUserId}
                      onChange={() => {
                        setTargetRoles([]);
                        setTargetUserId("");
                      }}
                      className="rounded text-[#44abff] focus:ring-[#44abff]"
                    />
                    <span className="text-xs font-semibold text-gray-700">📢 Todos (Global)</span>
                  </label>
                  
                  {[
                    { id: "PROFESSOR", label: "👩‍🏫 Professores" },
                    { id: "SECRETARIA", label: "📋 Secretaria" },
                    { id: "COORDENACAO", label: "🎓 Coordenação" },
                    { id: "ADMIN", label: "⚙️ Administração" },
                  ].map(role => (
                    <label key={role.id} className={`flex items-center gap-2 cursor-pointer border px-3 py-2 rounded-xl transition-colors ${targetRoles.includes(role.id) ? 'bg-blue-50/50 border-[#44abff]/40' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>
                      <input 
                        type="checkbox" 
                        checked={targetRoles.includes(role.id)}
                        onChange={() => {
                          setTargetUserId("");
                          toggleRole(role.id);
                        }}
                        className="rounded text-[#44abff] focus:ring-[#44abff]"
                      />
                      <span className="text-xs font-semibold text-gray-700">{role.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0f1e36]">Ou Usuário Específico</label>
                <select
                  value={targetUserId}
                  onChange={(e) => {
                    setTargetUserId(e.target.value);
                    if (e.target.value) setTargetRoles([]);
                  }}
                  className="w-full text-xs p-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/30 focus:border-[#44abff] bg-white text-[#0f1e36]"
                >
                  <option value="">Nenhum (usar regras acima)</option>
                  {usersList.map((u) => (
                    <option key={u.id} value={u.id}>
                      👤 {u.firstName ? `${u.firstName} ${u.lastName ?? ""}` : u.email} ({u.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0f1e36]">Tipo de Aviso</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: "INFO", label: "Informativo", color: "border-blue-200 bg-blue-50 text-blue-800" },
                    { id: "SUCCESS", label: "Sucesso", color: "border-emerald-200 bg-emerald-50 text-emerald-800" },
                    { id: "WARNING", label: "Aviso/Alerta", color: "border-amber-200 bg-amber-50 text-amber-800" },
                    { id: "DANGER", label: "Urgente", color: "border-red-200 bg-red-50 text-red-800" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setType(t.id as any)}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all text-center ${
                        type === t.id ? `${t.color} ring-2 ring-[#44abff]` : "border-gray-200 bg-white text-gray-500"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0f1e36]">Título do Aviso</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Reunião Pedagógica Geral do Trimestre"
                  required
                  className="w-full text-xs p-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/30 focus:border-[#44abff] text-[#0f1e36]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0f1e36]">Mensagem</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Digite o conteúdo detalhado da notificação..."
                  rows={4}
                  required
                  className="w-full text-xs p-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/30 focus:border-[#44abff] text-[#0f1e36]"
                />
              </div>
              
              {/* Optional Link */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0f1e36]">Link de Ação (Opcional)</label>
                <input
                  type="url"
                  id="actionUrl"
                  placeholder="Ex: https://csfa.edu.br/documento"
                  className="w-full text-xs p-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/30 focus:border-[#44abff] text-[#0f1e36]"
                />
              </div>

              {/* Optional Attachment (File Input) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0f1e36]">Anexo (Imagem, PDF, DOC)</label>
                <input
                  type="file"
                  id="attachmentFile"
                  accept="image/*,.pdf,.doc,.docx"
                  className="w-full text-xs p-2 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/30 focus:border-[#44abff] text-[#0f1e36] bg-white file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#44abff]/10 file:text-[#44abff] hover:file:bg-[#44abff]/20"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSending}
                  className="px-6 py-2.5 rounded-2xl bg-[#0f1e36] text-white font-bold text-xs hover:bg-[#0f1e36]/90 transition-all shadow-md flex items-center gap-2"
                >
                  <Send size={14} className="text-[#44abff]" />
                  {isSending ? "Enviando..." : "Disparar Notificação"}
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: HISTORY */}
          {activeTab === "HISTORY" && canSend && (
            <div className="space-y-3 text-left">
              {isLoading ? (
                <div className="pt-2">
                  <TableSkeleton rows={4} />
                </div>
              ) : history.length === 0 ? (
                <EmptyState
                  title="Nenhum envio"
                  description="Nenhum envio registrado no momento."
                />
              ) : (
                history.map((item) => (
                  <div key={item.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#0f1e36]">{item.title}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-600">
                          {item.isGlobal ? "Destino: Todos" : (item.targetRoles && item.targetRoles.length > 0) ? `Destino: Perfis ${item.targetRoles.join(", ")}` : item.targetUser ? `Destino: ${item.targetUser.firstName || item.targetUser.email}` : "Destino: Indefinido"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-gray-400">
                          {new Date(item.createdAt).toLocaleDateString("pt-BR")}
                        </span>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleResend(item)} className="text-[#44abff] hover:text-[#0f1e36] p-1" title="Reenviar">
                            <History size={14} />
                          </button>
                          <button onClick={() => handleDeleteSent(item.id)} className="text-red-400 hover:text-red-600 p-1" title="Excluir">
                            <AlertTriangle size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{item.message}</p>
                    {item.attachmentUrl && (
                      <div className="mt-2 text-[10px] text-blue-500 font-bold">
                        📎 Anexo ({item.attachmentType})
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
          </div>
        </div>
      }
    />

    {/* Notification Context Modal */}
    {selectedNotification && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div 
          className="absolute inset-0 bg-[#0f1e36]/40 backdrop-blur-xs"
          onClick={() => setSelectedNotification(null)}
        />
        <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-lg max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between p-6 border-b border-gray-50 bg-gray-50/50 rounded-t-3xl shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-center justify-center shrink-0">
                 {getTypeIcon(selectedNotification.type)}
              </div>
              <div>
                <h3 className="font-black text-[#0f1e36]">{selectedNotification.title}</h3>
                <p className="text-xs text-gray-400 font-medium">Enviado em {new Date(selectedNotification.createdAt).toLocaleString("pt-BR")}</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 overflow-y-auto min-h-0 text-[#0f1e36] text-sm leading-relaxed whitespace-pre-wrap">
            {selectedNotification.message}
            
            {/* Anexos */}
            {selectedNotification.attachmentUrl && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-[#0f1e36] mb-2 flex items-center gap-2">
                     📎 Anexo ({selectedNotification.attachmentType || "Arquivo"})
                  </h4>
                  {selectedNotification.attachmentType === "IMAGE" ? (
                      <img src={selectedNotification.attachmentUrl} alt="Anexo" className="max-w-full rounded-2xl border border-gray-200 shadow-sm" />
                  ) : (
                      <a href={selectedNotification.attachmentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-[#0f1e36] text-xs font-bold rounded-xl transition-colors border border-gray-200">
                         Abrir Anexo
                      </a>
                  )}
                </div>
            )}
            
            {/* Link de ação */}
            {selectedNotification.actionUrl && (
                <div className="mt-6">
                    <a href={selectedNotification.actionUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-full px-6 py-3 bg-[#0f1e36] text-white font-bold text-sm rounded-2xl hover:bg-[#0f1e36]/90 transition-colors shadow-md">
                        Acessar Link Adicional
                    </a>
                </div>
            )}
          </div>
          
          <div className="p-4 border-t border-gray-50 flex justify-end shrink-0">
            <button 
                onClick={() => setSelectedNotification(null)}
                className="px-6 py-2.5 bg-gray-100 text-[#0f1e36] font-bold text-xs rounded-xl hover:bg-gray-200 transition-colors"
            >
                Fechar
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}

export default NotificationsPage;
