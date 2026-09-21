import { useState, type FormEvent } from "react";
import { X, Send, BellRing, CheckCircle2 } from "lucide-react";

interface NotifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (data: { title: string; message: string }) => Promise<void>;
  isSending?: boolean;
}

export function NotifyModal({ isOpen, onClose, onSend, isSending }: NotifyModalProps) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    await onSend({ title, message });
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setTitle("");
      setMessage("");
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-[#0f1e36]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full border border-gray-100 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#0f1e36] text-[#44abff] flex items-center justify-center shadow-xs">
              <BellRing size={16} />
            </div>
            <div>
              <h2 className="text-base font-black text-[#0f1e36]">Disparar Notificação Push</h2>
              <p className="text-xs text-gray-500">Enviar aviso no aplicativo móvel dos responsáveis.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 size={40} className="mx-auto text-emerald-500 animate-bounce" />
            <h3 className="font-bold text-sm text-[#0f1e36]">Notificação Enviada com Sucesso!</h3>
            <p className="text-xs text-gray-500">Os responsáveis cadastrados receberão o alerta.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Título do Alerta
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/40 text-sm text-[#0f1e36]"
                placeholder="Ex: Comunicado Urgente — Reunião Escolar"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Mensagem
              </label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-gray-50 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/40 text-xs text-[#0f1e36]"
                placeholder="Digite a mensagem a ser disparada..."
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
                disabled={isSending}
                className="px-5 py-2.5 rounded-xl bg-[#0f1e36] text-white text-xs font-bold hover:bg-[#0f1e36]/90 flex items-center gap-1.5 shadow-md shadow-[#0f1e36]/15 disabled:opacity-60"
              >
                <Send size={14} className="text-[#44abff]" />
                {isSending ? "Enviando..." : "Disparar Alerta"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
