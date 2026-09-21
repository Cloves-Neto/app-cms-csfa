import { useState, useEffect } from "react";
import WrapPages from "@/layouts/WrapPages";
import {
  Inbox,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Search,
  CheckCircle2,
  Clock,
  Archive,
  Trash2,
  Eye,
  MessageCircle,
  FileText,
  X,
  ExternalLink,
  MoreVertical
} from "lucide-react";
import {
  submissionService,
  type ContactSubmission,
  type SubmissionType,
  type SubmissionStatus,
  type ExtraDataParsed,
} from "@/features/submissions";

export function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<SubmissionType | "ALL">("ALL");
  const [selectedStatus, setSelectedStatus] = useState<SubmissionStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<ContactSubmission | null>(null);
  const [internalNotes, setInternalNotes] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [promptModal, setPromptModal] = useState<{ isOpen: boolean; newStatus: SubmissionStatus | null; note: string }>({
    isOpen: false,
    newStatus: null,
    note: "",
  });

  const loadSubmissions = async () => {
    setIsLoading(true);
    const data = await submissionService.getAll({
      type: activeTab,
      status: selectedStatus,
      search: searchQuery || undefined,
    });
    setSubmissions(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadSubmissions();
  }, [activeTab, selectedStatus]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadSubmissions();
  };

  const handleOpenDetail = (item: ContactSubmission) => {
    setSelectedItem(item);
    setInternalNotes(item.notes || "");
  };

  const handleCloseDetail = () => {
    if (selectedItem) {
      if (internalNotes !== (selectedItem.notes || "")) {
        if (!window.confirm("Existem alterações nas anotações não salvas. Deseja descartar as alterações e fechar?")) {
          return;
        }
      }
    }
    setSelectedItem(null);
    setInternalNotes("");
  };

  const handleStatusClick = (newStatus: SubmissionStatus) => {
    if (!selectedItem || newStatus === selectedItem.status) return;
    
    // Sempre exigir a anotação abrindo o modal ao mudar de status
    setPromptModal({ isOpen: true, newStatus, note: "" });
  };

  const handleSaveNotes = async () => {
    if (!selectedItem) return;

    const notesChanged = internalNotes !== (selectedItem.notes || "");

    if (!notesChanged) {
      setToastMessage("Nenhuma alteração nas anotações.");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    await performStatusUpdate(selectedItem.status, internalNotes);
  };

  const performStatusUpdate = async (newStatus: SubmissionStatus, finalNote: string) => {
    if (!selectedItem) return;
    setIsUpdating(true);
    const success = await submissionService.updateStatus(selectedItem.id, newStatus, finalNote);
    setIsUpdating(false);

    if (success) {
      setSelectedItem((prev) => (prev ? { ...prev, status: newStatus, notes: finalNote } : null));
      setSubmissions((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id ? { ...item, status: newStatus, notes: finalNote } : item
        )
      );
      setInternalNotes(finalNote);
      
      setToastMessage("Alterações salvas com sucesso!");
      setTimeout(() => setToastMessage(null), 3000);
    } else {
      alert("Erro ao salvar alterações.");
    }
  };

  const handleConfirmPrompt = async () => {
    if (promptModal.newStatus && promptModal.note.trim()) {
      await performStatusUpdate(promptModal.newStatus, promptModal.note);
      setPromptModal({ isOpen: false, newStatus: null, note: "" });
    }
  };

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm("Deseja realmente remover esta mensagem do registro?")) return;

    const success = await submissionService.delete(id);
    if (success) {
      setSubmissions((prev) => prev.filter((item) => item.id !== id));
      if (selectedItem?.id === id) {
        handleCloseDetail();
      }
    }
  };

  const getCleanPhone = (phone: string) => {
    return phone.replace(/\D/g, "");
  };

  const getWhatsAppLink = (phone: string, name: string) => {
    const clean = getCleanPhone(phone);
    const text = encodeURIComponent(`Olá ${name}, tudo bem? Sou da equipe de atendimento do Colégio São Francisco de Assis (CSFA).`);
    return `https://wa.me/55${clean}?text=${text}`;
  };

  const parseExtra = (extraData?: string | null): ExtraDataParsed => {
    if (!extraData) return {};
    try {
      return JSON.parse(extraData);
    } catch {
      return {};
    }
  };

  // Metrics
  const totalCount = submissions.length;
  const pendingCount = submissions.filter((s) => s.status === "PENDING").length;
  const contactCount = submissions.filter((s) => s.type === "CONTACT").length;
  const careersCount = submissions.filter((s) => s.type === "CAREERS").length;
  const admissionsCount = submissions.filter((s) => s.type === "ADMISSIONS").length;

  const getTypeBadge = (type: SubmissionType) => {
    switch (type) {
      case "CONTACT":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-50 text-[#0f1e36] border border-blue-200/60">
            <Mail size={11} className="text-[#44abff]" />
            Fale Conosco
          </span>
        );
      case "CAREERS":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200/60">
            <Briefcase size={11} className="text-purple-600" />
            Trabalhe Conosco
          </span>
        );
      case "ADMISSIONS":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
            <GraduationCap size={11} className="text-emerald-600" />
            Matrícula
          </span>
        );
    }
  };

  const getStatusBadge = (status: SubmissionStatus) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock size={10} />
            Pendente
          </span>
        );
      case "REVIEWED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
            <Eye size={10} />
            Em Análise
          </span>
        );
      case "CONTACTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 size={10} />
            Contatado
          </span>
        );
      case "ARCHIVED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600 border border-gray-200">
            <Archive size={10} />
            Arquivado
          </span>
        );
    }
  };

  return (
    <>
      <WrapPages
        header={
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0f1e36] text-white flex items-center justify-center shadow-md">
                <Inbox size={20} className="text-[#44abff]" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#0f1e36] tracking-tight">Atendimento & Formulários</h2>
                <p className="text-xs text-gray-400 font-medium">
                  Gestão centralizada de contatos, candidaturas e matrículas
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-[#0f1e36] shadow-xs">
                Total: {totalCount}
              </span>
              {pendingCount > 0 && (
                <span className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800 shadow-xs flex items-center gap-1">
                  <Clock size={12} />
                  {pendingCount} pendente(s)
                </span>
              )}
            </div>
          </div>
        }
        content={
        <div className="space-y-4 w-full h-full flex flex-col min-h-0">
          {/* Top Controls: Tabs, Filters & Search */}
          <div className="bg-white rounded-3xl border border-gray-100 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
              {[
                { id: "ALL", label: "Todos", count: totalCount },
                { id: "CONTACT", label: "Fale Conosco", count: contactCount },
                { id: "CAREERS", label: "Trabalhe Conosco", count: careersCount },
                { id: "ADMISSIONS", label: "Matrículas", count: admissionsCount },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    activeTab === tab.id
                      ? "bg-[#0f1e36] text-white shadow-xs"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      activeTab === tab.id ? "bg-[#44abff] text-[#0f1e36]" : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Filter by Status and Search */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="text-xs px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/30 text-[#0f1e36] font-semibold"
              >
                <option value="ALL">Todos os Status</option>
                <option value="PENDING">Pendentes</option>
                <option value="REVIEWED">Em Análise</option>
                <option value="CONTACTED">Contatados</option>
                <option value="ARCHIVED">Arquivados</option>
              </select>

              <form onSubmit={handleSearch} className="relative flex-1 md:w-56">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome, e-mail..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/30 text-[#0f1e36]"
                />
              </form>
            </div>
          </div>

          {/* Submissions Table / Cards */}
          <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden flex flex-col min-h-0">
            {isLoading ? (
              <div className="flex-1 flex items-center justify-center p-12 text-xs text-gray-400">
                Carregando atendimentos e solicitações...
              </div>
            ) : submissions.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-gray-400 space-y-2">
                <Inbox size={32} className="text-gray-300 mx-auto" />
                <p className="text-xs font-semibold text-gray-500">Nenhuma submissão encontrada.</p>
                <p className="text-[11px] text-gray-400">
                  Os formulários preenchidos no portal institucional aparecerão listados aqui em tempo real.
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                {submissions.map((item) => {
                  const extra = parseExtra(item.extraData);
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleOpenDetail(item)}
                      className="p-4 sm:p-5 hover:bg-gray-50/70 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left"
                    >
                      {/* Left info */}
                      <div className="flex items-start gap-3.5 min-w-0">
                        <div className="shrink-0 mt-0.5">{getTypeBadge(item.type)}</div>
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-xs text-[#0f1e36]">{item.name}</h4>
                            {item.subject && (
                              <span className="text-[11px] text-gray-500 font-medium truncate max-w-xs">
                                · {item.subject}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-gray-400 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Phone size={11} className="text-gray-400" />
                              {item.phone}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Mail size={11} className="text-gray-400" />
                              {item.email}
                            </span>
                            {extra.studentName && (
                              <>
                                <span>•</span>
                                <span className="text-emerald-700 font-semibold">
                                  Aluno: {extra.studentName}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right actions & status */}
                      <div className="flex items-center gap-3 shrink-0 justify-between sm:justify-end">
                        {getStatusBadge(item.status)}

                        <div className="flex items-center gap-1">
                          {/* Direct WhatsApp CTA */}
                          <a
                            href={getWhatsAppLink(item.phone, item.name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                            title="Conversar no WhatsApp"
                          >
                            <MessageCircle size={14} />
                          </a>

                          {/* Direct Email CTA */}
                          <a
                            href={`mailto:${item.email}?subject=Contato%20CSFA`}
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 rounded-xl bg-blue-50 text-[#0f1e36] hover:bg-blue-100 transition-colors"
                            title="Enviar E-mail"
                          >
                            <Mail size={14} className="text-[#44abff]" />
                          </a>

                          {/* Resume CTA (if has attachment) */}
                          {item.attachmentUrl && (
                            <a
                              href={item.attachmentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-2 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
                              title="Baixar Currículo / Anexo"
                            >
                              <FileText size={14} />
                            </a>
                          )}

                          {/* Link CTA (if has link) */}
                          {extra.linkType && extra.linkUrl && (
                            <a
                              href={extra.linkUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors flex items-center gap-1 text-[10px] font-bold"
                              title={`Abrir ${extra.linkType}`}
                            >
                              <ExternalLink size={14} />
                            </a>
                          )}

                          {/* Delete */}
                          <button
                            onClick={(e) => handleDelete(item.id, e)}
                            className="p-2 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                            title="Remover"
                          >
                            <Trash2 size={14} />
                          </button>

                          {/* 3-dots Menu for History */}
                          <div className="relative group/menu">
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="p-2 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-[#0f1e36] transition-colors"
                              title="Ver Histórico Rápido"
                            >
                              <MoreVertical size={14} />
                            </button>
                            <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10 p-3 flex flex-col gap-2 cursor-default" onClick={(e) => e.stopPropagation()}>
                              <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Histórico Rápido</h5>
                              {item.history && item.history.length > 0 ? (
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                  {item.history.slice(0, 3).map((h) => (
                                    <div key={h.id} className="text-left border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                                      <div className="flex items-center justify-between mb-0.5">
                                        <p className="text-[11px] font-bold text-[#0f1e36] truncate">{h.userName}</p>
                                        <span className="text-[9px] text-gray-400">{new Date(h.createdAt).toLocaleDateString("pt-BR")}</span>
                                      </div>
                                      <p className="text-[10px] text-gray-500 italic line-clamp-2">{h.note || "Sem anotação"}</p>
                                      <div className="mt-1">
                                        {getStatusBadge(h.status)}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-[10px] text-gray-400">Nenhum histórico registrado.</p>
                              )}
                            </div>
                          </div>
                        </div>
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

    {/* DETAILED MODAL / DRAWER */}
    {selectedItem && (
        <div className="fixed inset-0 bg-[#0f1e36]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-6 text-left animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {getTypeBadge(selectedItem.type)}
                  {getStatusBadge(selectedItem.status)}
                </div>
                <h3 className="text-lg font-black text-[#0f1e36]">{selectedItem.name}</h3>
                <p className="text-xs text-gray-400">
                  Recebido em {new Date(selectedItem.createdAt).toLocaleString("pt-BR")}
                </p>
              </div>

              <button
                onClick={handleCloseDetail}
                className="p-2 rounded-xl text-gray-400 hover:text-[#0f1e36] hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs">
              <div>
                <span className="text-gray-400 font-medium block">Telefone / WhatsApp</span>
                <span className="font-bold text-[#0f1e36]">{selectedItem.phone}</span>
              </div>
              <div>
                <span className="text-gray-400 font-medium block">E-mail</span>
                <span className="font-bold text-[#0f1e36]">{selectedItem.email}</span>
              </div>
              {selectedItem.subject && (
                <div className="sm:col-span-2">
                  <span className="text-gray-400 font-medium block">Assunto / Interesse</span>
                  <span className="font-bold text-[#0f1e36]">{selectedItem.subject}</span>
                </div>
              )}
            </div>

            {/* Extra Data for Admissions / Careers */}
            {selectedItem.extraData && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#0f1e36] uppercase tracking-wider">
                  Informações Adicionais
                </h4>
                <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl text-xs space-y-2">
                  {parseExtra(selectedItem.extraData).studentName && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Nome do Aluno:</span>
                      <span className="font-bold text-[#0f1e36]">
                        {parseExtra(selectedItem.extraData).studentName}
                      </span>
                    </div>
                  )}
                  {parseExtra(selectedItem.extraData).birthDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Data de Nascimento:</span>
                      <span className="font-bold text-[#0f1e36]">
                        {parseExtra(selectedItem.extraData).birthDate}
                      </span>
                    </div>
                  )}
                  {parseExtra(selectedItem.extraData).grade && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Turma pretendida:</span>
                      <span className="font-bold text-[#0f1e36]">
                        {parseExtra(selectedItem.extraData).grade}
                      </span>
                    </div>
                  )}
                  {parseExtra(selectedItem.extraData).linkType && parseExtra(selectedItem.extraData).linkUrl && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">
                        {parseExtra(selectedItem.extraData).linkType === 'LINKEDIN' ? 'LinkedIn' :
                         parseExtra(selectedItem.extraData).linkType === 'INSTAGRAM' ? 'Instagram' :
                         parseExtra(selectedItem.extraData).linkType === 'WEBSITE' ? 'Site / Portfólio' : 'Link do Currículo'}:
                      </span>
                      <a
                        href={parseExtra(selectedItem.extraData).linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#44abff] hover:underline font-bold flex items-center gap-1"
                      >
                        Acessar
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Timeline / Histórico */}
            {selectedItem.history && selectedItem.history.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <h4 className="text-xs font-bold text-[#0f1e36] uppercase tracking-wider">Histórico de Atendimento</h4>
                <div className="space-y-4">
                  {selectedItem.history.map((hist, idx) => (
                    <div key={hist.id} className="relative flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-[#44abff] mt-1.5 shrink-0" />
                        {idx !== selectedItem.history!.length - 1 && <div className="w-0.5 h-full bg-gray-100 my-1" />}
                      </div>
                      <div className="pb-1">
                        <div className="text-xs font-bold text-[#0f1e36]">
                          {hist.userName} <span className="text-gray-400 font-normal">({hist.userRole})</span>
                        </div>
                        <div className="text-[10px] text-gray-400 font-medium">
                          {new Date(hist.createdAt).toLocaleString("pt-BR")}
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          {getStatusBadge(hist.status)}
                          {hist.note && <span className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-md">{hist.note}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Message / Presentation */}
            {selectedItem.message && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-[#0f1e36] uppercase tracking-wider">
                  Mensagem / Observação
                </h4>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-xs text-gray-700 whitespace-pre-line leading-relaxed">
                  {selectedItem.message}
                </div>
              </div>
            )}

            {/* Attachment Download */}
            {selectedItem.attachmentUrl && (
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-900">
                  <FileText size={16} className="text-purple-600" />
                  <span>Currículo / Anexo</span>
                </div>
                <a
                  href={selectedItem.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="px-3 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-colors flex items-center gap-1"
                >
                  Download
                  <ExternalLink size={12} />
                </a>
              </div>
            )}

            {/* Change Status & Internal Notes */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <h4 className="text-xs font-bold text-[#0f1e36] uppercase tracking-wider">
                Atualizar Status do Atendimento
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "PENDING", label: "Pendente", color: "hover:bg-amber-50" },
                  { id: "REVIEWED", label: "Em Análise", color: "hover:bg-blue-50" },
                  { id: "CONTACTED", label: "Contatado", color: "hover:bg-emerald-50" },
                  { id: "ARCHIVED", label: "Arquivado", color: "hover:bg-gray-100" },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => handleStatusClick(st.id as any)}
                    disabled={isUpdating}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      selectedItem.status === st.id
                        ? "bg-[#0f1e36] text-white border-[#0f1e36]"
                        : `bg-white text-gray-600 border-gray-200 ${st.color}`
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-[#0f1e36]">Anotações Internas da Equipe</label>
                <textarea
                  rows={3}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Registre detalhes do contato (ex: Ligado dia 15/09, agendada visita para 18/09 com a secretaria)..."
                  className="w-full text-xs p-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/30 text-[#0f1e36]"
                />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href={getWhatsAppLink(selectedItem.phone, selectedItem.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <MessageCircle size={14} />
                  Chamar no WhatsApp
                </a>

                <a
                  href={`mailto:${selectedItem.email}?subject=Colégio%20São%20Francisco%20de%20Assis`}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-[#0f1e36] hover:bg-[#0f1e36]/90 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <Mail size={14} className="text-[#44abff]" />
                  Responder E-mail
                </a>
              </div>

              <button
                onClick={handleSaveNotes}
                disabled={isUpdating}
                className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-[#44abff] hover:bg-[#44abff]/90 text-[#0f1e36] font-black text-xs transition-colors shadow-md shadow-[#44abff]/20 disabled:opacity-50"
              >
                {isUpdating ? "Salvando..." : "Salvar Anotações"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROMPT MODAL */}
      {promptModal.isOpen && (
        <div className="fixed inset-0 bg-[#0f1e36]/50 backdrop-blur-xs z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black text-[#0f1e36]">Anotação Obrigatória</h3>
              <button
                onClick={() => setPromptModal({ isOpen: false, newStatus: null, note: "" })}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-100"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Por favor, adicione uma anotação justificando a mudança de status.
            </p>
            <textarea
              autoFocus
              rows={3}
              className="w-full text-xs p-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/30 text-[#0f1e36]"
              placeholder="O que foi conversado? Por que o status mudou?"
              value={promptModal.note}
              onChange={(e) => setPromptModal({ ...promptModal, note: e.target.value })}
            />
            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => setPromptModal({ isOpen: false, newStatus: null, note: "" })}
                className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancelar
              </button>
              <button
                disabled={!promptModal.note.trim() || isUpdating}
                onClick={handleConfirmPrompt}
                className="px-4 py-2 text-xs font-bold text-white bg-[#0f1e36] rounded-xl hover:bg-[#0f1e36]/90 disabled:opacity-50 transition-colors shadow-md shadow-[#0f1e36]/15 flex items-center gap-1.5"
              >
                {isUpdating ? "Salvando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#0f1e36] text-white px-5 py-3 rounded-2xl shadow-xl border border-gray-700 flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300 z-[100]">
          <CheckCircle2 size={16} className="text-[#44abff]" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}
    </>
  );
}

export default SubmissionsPage;
