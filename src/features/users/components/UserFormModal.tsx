import { useState, useEffect, type FormEvent } from "react";
import { X, ChevronLeft, ChevronRight, Check, Clock, Globe } from "lucide-react";
import { StepWizard, type Step } from "@/components/common/StepWizard";
import type { AccessSchedule, CreateUserInput, ModulePermission, PermissionLevel, UserItem, UserRole, UserStatus } from "../types/user.types";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateUserInput) => Promise<void>;
  editingUser?: UserItem | null;
  coordinators?: UserItem[];
}

const userModalSteps: Step[] = [
  { id: 1, title: "Dados Pessoais", subtitle: "Nome, E-mail & Cargo" },
  { id: 2, title: "Horário & Status", subtitle: "Regras de Acesso" },
  { id: 3, title: "Módulos & Permissões", subtitle: "Acessos às Funcionalidades" },
];

const DEFAULT_MODULES: { key: ModulePermission["moduleKey"]; name: string; description: string }[] = [
  { key: "agenda", name: "Agenda Escolar & Eventos", description: "Gerenciamento do calendário e programação escolar" },
  { key: "posts", name: "Postagens & Notícias", description: "Criação de artigos e comunicados do portal" },
  { key: "banners", name: "Banners do Portal", description: "Carrossel e imagens rotativas da home" },
  { key: "tags", name: "Tags & Categorias", description: "Organização e rotulagem do conteúdo" },
  { key: "users", name: "Gestão de Usuários & TI", description: "Controle de acessos, senhas e permissões" },
];

export function UserFormModal({ isOpen, onClose, onSave, editingUser, coordinators = [] }: UserFormModalProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Professor Titular");
  const [systemRole, setSystemRole] = useState<UserRole>("PROFESSOR");
  const [status, setStatus] = useState<UserStatus>("active");
  const [accessSchedule, setAccessSchedule] = useState<AccessSchedule>("full");
  const [coordinatorId, setCoordinatorId] = useState<string>("");
  const [permissions, setPermissions] = useState<ModulePermission[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingUser) {
      setName(editingUser.name);
      setEmail(editingUser.email);
      setRole(editingUser.role);
      setSystemRole(editingUser.systemRole || "PROFESSOR");
      setStatus(editingUser.status);
      setAccessSchedule(editingUser.accessSchedule);
      setCoordinatorId(editingUser.coordinatorId ? String(editingUser.coordinatorId) : "");
      setPermissions(editingUser.permissions || []);
    } else {
      setName("");
      setEmail("");
      setRole("Professor Titular");
      setSystemRole("PROFESSOR");
      setStatus("active");
      setAccessSchedule("full");
      setCoordinatorId("");
      setPermissions(
        DEFAULT_MODULES.map((m) => ({
          moduleKey: m.key,
          moduleName: m.name,
          level: "view",
        }))
      );
    }
    setCurrentStep(1);
  }, [editingUser, isOpen]);

  if (!isOpen) return null;

  const handlePermissionChange = (moduleKey: ModulePermission["moduleKey"], level: PermissionLevel) => {
    setPermissions((prev) =>
      prev.map((p) => (p.moduleKey === moduleKey ? { ...p, level } : p))
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave({
        name,
        email,
        role,
        systemRole,
        status,
        accessSchedule,
        coordinatorId: coordinatorId || null,
        permissions,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0f1e36]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-gray-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-[#0f1e36]">
              {editingUser ? "Editar Cadastro de Usuário" : "Novo Usuário do Sistema"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Defina as credenciais, horário de login e permissões nos módulos.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Wizard Steps Navigation */}
        <div className="px-6 pt-4 pb-2 bg-gray-50/50 border-b border-gray-100">
          <StepWizard steps={userModalSteps} currentStep={currentStep} onStepClick={setCurrentStep} />
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* STEP 1: Dados Pessoais */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/40 text-sm text-[#0f1e36]"
                  placeholder="Ex: Prof. Carlos Eduardo"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  E-mail Institucional (@csfa.com.br)
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/40 text-sm text-[#0f1e36]"
                  placeholder="carlos.eduardo@csfa.com.br"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Cargo / Função Exibida
                  </label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/40 text-sm text-[#0f1e36]"
                    placeholder="Ex: Coordenação Pedagógica"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Perfil de Sistema (Backend)
                  </label>
                  <select
                    value={systemRole}
                    onChange={(e) => setSystemRole(e.target.value as UserRole)}
                    className="w-full bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/40 text-sm text-[#0f1e36] font-semibold"
                  >
                    <option value="PROFESSOR">PROFESSOR</option>
                    <option value="COORDENACAO">COORDENAÇÃO</option>
                    <option value="SECRETARIA">SECRETARIA</option>
                    <option value="TI">TI / ADMINISTRADOR</option>
                  </select>
                </div>
              </div>

              {systemRole === "PROFESSOR" && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Coordenador Responsável
                  </label>
                  <select
                    value={coordinatorId}
                    onChange={(e) => setCoordinatorId(e.target.value)}
                    className="w-full bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/40 text-sm text-[#0f1e36]"
                  >
                    <option value="">Nenhum coordenador vinculado</option>
                    {coordinators.map(coord => (
                      <option key={coord.id} value={String(coord.id)}>
                        {coord.name} ({coord.email})
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-gray-500 mt-1">
                    O coordenador selecionado receberá notificações diretas das publicações submetidas por este professor.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Horário & Status */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Regra de Horário de Acesso ao Painel
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAccessSchedule("full")}
                    className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      accessSchedule === "full"
                        ? "border-[#44abff] bg-[#44abff]/5 ring-2 ring-[#44abff]/20"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Globe size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0f1e36]">Livre 24 Horas</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Permite acesso ao CMS a qualquer dia e horário (TI e Direção).
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAccessSchedule("business_hours")}
                    className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      accessSchedule === "business_hours"
                        ? "border-[#44abff] bg-[#44abff]/5 ring-2 ring-[#44abff]/20"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <Clock size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0f1e36]">Horário Comercial</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Acesso bloqueado fora do expediente escolar (Seg-Sex, 07h às 19h).
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Status Inicial da Conta
                </label>
                <div className="flex gap-2">
                  {(["active", "inactive", "blocked"] as UserStatus[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all border ${
                        status === s
                          ? "bg-[#0f1e36] text-white border-[#0f1e36]"
                          : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {s === "active" ? "Ativo" : s === "inactive" ? "Inativo" : "Bloqueado"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Módulos & Permissões */}
          {currentStep === 3 && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <p className="text-xs text-gray-500">
                Configure o nível de privilégio que este usuário terá em cada área administrativa:
              </p>
              <div className="border border-gray-200 rounded-2xl overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {DEFAULT_MODULES.map((mod) => {
                    const currentLevel =
                      permissions.find((p) => p.moduleKey === mod.key)?.level || "none";

                    return (
                      <div
                        key={mod.key}
                        className="p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 hover:bg-gray-50/50"
                      >
                        <div>
                          <p className="text-xs font-bold text-[#0f1e36]">{mod.name}</p>
                          <p className="text-[11px] text-gray-500">{mod.description}</p>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                          {(["none", "view", "editor", "full"] as PermissionLevel[]).map((lvl) => (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => handlePermissionChange(mod.key, lvl)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                                currentLevel === lvl
                                  ? lvl === "full"
                                    ? "bg-purple-600 text-white"
                                    : lvl === "editor"
                                    ? "bg-blue-600 text-white"
                                    : lvl === "view"
                                    ? "bg-emerald-600 text-white"
                                    : "bg-gray-600 text-white"
                                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                              }`}
                            >
                              {lvl === "none" ? "Nenhum" : lvl === "view" ? "Leitura" : lvl === "editor" ? "Editor" : "Total"}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-1.5"
              >
                <ChevronLeft size={14} />
                Voltar
              </button>
            ) : (
              <div />
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="px-5 py-2.5 rounded-xl bg-[#0f1e36] text-white text-xs font-bold hover:bg-[#0f1e36]/90 flex items-center gap-1.5 shadow-xs"
              >
                Próximo
                <ChevronRight size={14} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 flex items-center gap-1.5 shadow-md shadow-emerald-600/20 disabled:opacity-60"
              >
                <Check size={14} />
                {isSubmitting ? "Salvando..." : editingUser ? "Atualizar Usuário" : "Concluir Cadastro"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
