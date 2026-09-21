import { useState, type FormEvent } from "react";
import { X, Check, Upload } from "lucide-react";
import type { CreateEventInput } from "../types/agenda.types";

interface AgendaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateEventInput) => Promise<void>;
  monthName: string;
}

export function AgendaFormModal({
  isOpen,
  onClose,
  onSave,
  monthName,
}: AgendaFormModalProps) {
  const [tab, setTab] = useState<"create" | "import">("create");
  const [day, setDay] = useState<number>(18);
  const [time, setTime] = useState("09:30");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("Auditório Principal");
  const [category, setCategory] = useState("Eventos");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave({
        day: Number(day),
        time,
        title,
        location,
        category,
        description,
      });
      setTitle("");
      setDescription("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0f1e36]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-gray-100 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h2 className="text-base font-black text-[#0f1e36]">Novo Evento Escolar</h2>
            <p className="text-xs text-gray-500">Adicione uma atividade à agenda de {monthName} 2026.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-3 flex border-b border-gray-100 gap-4">
          <button
            onClick={() => setTab("create")}
            className={`pb-3 text-xs font-bold transition-all border-b-2 ${
              tab === "create"
                ? "border-[#44abff] text-[#0f1e36]"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            Cadastrar Manualmente
          </button>
          <button
            onClick={() => setTab("import")}
            className={`pb-3 text-xs font-bold transition-all border-b-2 ${
              tab === "import"
                ? "border-[#44abff] text-[#0f1e36]"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            Importar CSV
          </button>
        </div>

        {/* Body */}
        {tab === "create" ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Título da Atividade / Evento
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/40 text-sm text-[#0f1e36]"
                placeholder="Ex: Reunião de Pais e Mestres"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Dia ({monthName})
                </label>
                <input
                  type="number"
                  min={1}
                  max={31}
                  required
                  value={day}
                  onChange={(e) => setDay(Number(e.target.value))}
                  className="w-full bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/40 text-sm text-[#0f1e36]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Horário
                </label>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/40 text-sm text-[#0f1e36]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Local
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/40 text-sm text-[#0f1e36]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Categoria
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/40 text-sm text-[#0f1e36]"
                >
                  <option value="Eventos">Eventos</option>
                  <option value="Acadêmico">Acadêmico</option>
                  <option value="Esportes">Esportes</option>
                  <option value="Institucional">Institucional</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Descrição / Pauta (Opcional)
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-50 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/40 text-xs text-[#0f1e36]"
                placeholder="Detalhes sobre a programação..."
              />
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-[#0f1e36] text-white text-xs font-bold hover:bg-[#0f1e36]/90 flex items-center gap-1.5 shadow-md shadow-[#0f1e36]/15 disabled:opacity-60"
              >
                <Check size={14} />
                {isSubmitting ? "Salvando..." : "Adicionar à Agenda"}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 space-y-4 text-center">
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 hover:border-[#44abff] transition-colors">
              <Upload size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-xs font-bold text-[#0f1e36]">Importar Planilha de Eventos</p>
              <p className="text-[11px] text-gray-500 mt-1">Arraste um arquivo .csv ou clique para selecionar.</p>
            </div>
            <button
              onClick={onClose}
              className="w-full bg-[#0f1e36] text-white py-2.5 rounded-xl text-xs font-bold"
            >
              Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
