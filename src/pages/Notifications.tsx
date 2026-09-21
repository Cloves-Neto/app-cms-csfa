import { useState, useEffect } from "react";
import WrapPages from "@/layouts/WrapPages";
import { useAuth } from "@/features/auth";
import { Bell, Send, History, Check, Clock, AlertTriangle, Info, CheckCircle2, Search } from "lucide-react";
import { notificationService, type AppNotification } from "@/features/notifications/services/notification.service";
import { userService } from "@/features/users/services/user.service";

export function NotificationsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"INBOX" | "SEND" | "HISTORY">("INBOX");
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [history, setHistory] = useState<AppNotification[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Form states
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"INFO" | "WARNING" | "SUCCESS" | "DANGER">("INFO");
  const [targetUserId, setTargetUserId] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const canSend = user?.role === "ADMIN" || user?.role === "COORDENACAO" || user?.role === "SECRETARIA";

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

  const [actionUrl, setActionUrl] = useState("");
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    try {
      setIsSending(true);
      
      let isGlobal = false;
      let role = null;
      let userTarget = null;
      
      if (!targetUserId) {
        isGlobal = true;
      } else if (targetUserId.startsWith("ROLE_")) {
        role = targetUserId.replace("ROLE_", "");
      } else {
        userTarget = targetUserId;
      }

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
        targetUserId: userTarget,
        targetRole: role,
        isGlobal,
        actionUrl: actionUrl || undefined,
        attachmentUrl: uploadedAttachmentUrl || undefined,
        attachmentType: uploadedAttachmentType || undefined,
      });

      setStatusMessage("Notificação enviada com sucesso!");
      setTitle("");
      setMessage("");
      setTargetUserId("");
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
    
    if (item.isGlobal) setTargetUserId("");
    else if (item.targetRole) setTargetUserId(`ROLE_${item.targetRole}`);
    else if (item.targetUserId) setTargetUserId(item.targetUserId);
    
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
          <div className="bg-white rounded-3xl border border-gray-100 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
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

            <div className="relative w-full md:w-72">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar notificações..."
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/30 text-[#0f1e36]"
              />
            </div>
          </div>

          <div className="flex-1 bg-white rounded-3xl border border-gray-100 p-6 shadow-xs overflow-y-auto min-h-0">
          {/* TAB 1: INBOX */}
          {activeTab === "INBOX" && (
            <div className="space-y-3">
              {isLoading ? (
                <div className="py-12 text-center text-xs text-gray-400">Carregando avisos...</div>
              ) : notifications.length === 0 ? (
                <div className="py-12 text-center text-xs text-gray-400">Você não possui notificações no momento.</div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => !item.isRead && handleMarkAsRead(item.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 text-left ${
                      item.isRead
                        ? "bg-white border-gray-100 text-gray-600 opacity-80"
                        : "bg-blue-50/40 border-[#44abff]/30 text-[#0f1e36] shadow-xs"
                    }`}
                  >
                    <div className="shrink-0 mt-0.5">{getTypeIcon(item.type)}</div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-bold text-xs text-[#0f1e36]">{item.title}</h4>
                        <span className="text-[10px] text-gray-400 flex items-center gap-1 shrink-0">
                          <Clock size={10} />
                          {new Date(item.createdAt).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{item.message}</p>
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

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0f1e36]">Destinatário</label>
                <select
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                  className="w-full text-xs p-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/30 focus:border-[#44abff] bg-white text-[#0f1e36]"
                >
                  <option value="">📢 Todos os Usuários (Global)</option>
                  <optgroup label="Por Setor (Role)">
                    <option value="ROLE_PROFESSOR">👩‍🏫 Professores</option>
                    <option value="ROLE_SECRETARIA">📋 Secretaria</option>
                    <option value="ROLE_COORDENACAO">🎓 Coordenação</option>
                    <option value="ROLE_ADMIN">⚙️ Administração</option>
                  </optgroup>
                  <optgroup label="Usuários Específicos">
                    {usersList.map((u) => (
                      <option key={u.id} value={u.id}>
                        👤 {u.firstName ? `${u.firstName} ${u.lastName ?? ""}` : u.email} ({u.role})
                      </option>
                    ))}
                  </optgroup>
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
                <div className="py-12 text-center text-xs text-gray-400">Carregando histórico...</div>
              ) : history.length === 0 ? (
                <div className="py-12 text-center text-xs text-gray-400">Nenhum envio registrado.</div>
              ) : (
                history.map((item) => (
                  <div key={item.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#0f1e36]">{item.title}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-600">
                          {item.isGlobal ? "Destino: Todos" : item.targetRole ? `Destino: Perfil ${item.targetRole}` : item.targetUser ? `Destino: ${item.targetUser.firstName || item.targetUser.email}` : "Destino: Indefinido"}
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
  );
}

export default NotificationsPage;
