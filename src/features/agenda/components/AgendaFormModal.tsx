import { useState, useEffect, type FormEvent } from "react";
import { X, Check } from "lucide-react";
import type { CreateEventInput } from "../types/agenda.types";
import { agendaService, type EventCategory } from "../services/agenda.service";

interface AgendaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateEventInput) => Promise<void>;
  monthName?: string;
  monthIndex?: number;
  year?: number;
}

export function AgendaFormModal({
  isOpen,
  onClose,
  onSave,
}: AgendaFormModalProps) {
  const [dateStr, setDateStr] = useState<string>("");
  const [time, setTime] = useState("09:30");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState(""); // optional
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [minDateStr, setMinDateStr] = useState<string>("");
  const [maxDateStr, setMaxDateStr] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      agendaService.getCategories().then(setCategories);
      agendaService.getServerTime().then((isoString) => {
        const today = new Date(isoString);
        setMinDateStr(today.toISOString().split("T")[0]);
        
        // Regra: max date is 6 months ahead
        const maxDate = new Date(today);
        maxDate.setMonth(maxDate.getMonth() + 6);
        setMaxDateStr(maxDate.toISOString().split("T")[0]);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!dateStr) return;

    const [y, m, d] = dateStr.split("-").map(Number);
    
    // Client-side block for past dates
    const inputDate = new Date(y, m - 1, d);
    const todayZero = new Date();
    todayZero.setHours(0, 0, 0, 0);

    if (inputDate < todayZero) {
      alert("Não é permitido cadastrar eventos em datas passadas.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        day: d,
        month: m - 1,
        year: y,
        time,
        title,
        location,
        category: category || undefined,
        description,
      });
      setTitle("");
      setDescription("");
      setDateStr("");
      setLocation("");
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
            <p className="text-xs text-gray-500">Adicione uma atividade à agenda.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
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
                  Data
                </label>
                <input
                  type="date"
                  min={minDateStr}
                  max={maxDateStr}
                  required
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
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
                  placeholder="Digite o local do evento"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Categoria (Opcional)
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/40 text-sm text-[#0f1e36]"
                >
                  <option value="">Selecione...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Descrição / Pauta (Opcional)
                </label>
                <span className={`text-[10px] font-bold ${description.length >= 500 ? 'text-red-500' : 'text-gray-400'}`}>
                  {description.length} / 500
                </span>
              </div>
              <textarea
                rows={2}
                maxLength={500}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-50 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/40 text-xs text-[#0f1e36] resize-none"
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
      </div>
    </div>
  );
}
