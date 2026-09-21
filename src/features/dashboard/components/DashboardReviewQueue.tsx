import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, ArrowRight, CheckCircle, RotateCcw, Clock, AlertCircle } from "lucide-react";
import { postService } from "@/features/post/services/post.service";
import type { Post } from "@/features/post/types/post.types";
import { EmptyState } from "@/components/common/EmptyState";

export function DashboardReviewQueue() {
  const [queue, setQueue] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reviewModalPost, setReviewModalPost] = useState<Post | null>(null);
  const [returnNotes, setReturnNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const loadQueue = async () => {
    setIsLoading(true);
    const res = await postService.getReviewQueue();
    setQueue(res);
    setIsLoading(false);
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const handleApprove = async (post: Post) => {
    if (!confirm(`Aprovar e publicar a postagem "${post.title}" no site institucional?`)) return;
    try {
      await postService.approve(post.id);
      await loadQueue();
    } catch (e) {
      alert("Erro ao aprovar postagem.");
    }
  };

  const handleReturn = async () => {
    if (!reviewModalPost) return;
    if (!returnNotes.trim()) {
      alert("Por favor, digite a observação/motivo da devolução.");
      return;
    }

    try {
      setIsSubmitting(true);
      await postService.returnPost(reviewModalPost.id, returnNotes);
      setReviewModalPost(null);
      setReturnNotes("");
      await loadQueue();
    } catch (e) {
      alert("Erro ao devolver postagem.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-xs flex flex-col justify-start h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-black">
            <FileText size={18} />
          </div>
          <div>
            <h3 className="font-black text-sm text-[#0f1e36] tracking-tight leading-none flex items-center gap-2">
              Fila de Revisão Pedagógica
              {queue.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-100 text-purple-700 font-bold">
                  {queue.length} pendente{queue.length > 1 ? "s" : ""}
                </span>
              )}
            </h3>
            <span className="text-[11px] font-medium text-gray-400">
              Postagens aguardando aprovação
            </span>
          </div>
        </div>

        <Link
          to="/dashboard/revisao"
          className="text-xs font-bold text-[#44abff] hover:text-[#0f1e36] flex items-center gap-1 transition-colors"
        >
          Ver fila completa
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-50 pt-2 space-y-2">
        {isLoading ? (
          <div className="py-8 flex flex-col items-center justify-center text-gray-400 gap-2">
            <Clock className="animate-spin text-purple-500" size={20} />
            <span className="text-xs">Carregando fila de revisão...</span>
          </div>
        ) : queue.length === 0 ? (
          <EmptyState
            icon={<FileText size={32} className="text-gray-300 mb-2 stroke-1" />}
            title="Fila de revisão vazia"
            description="Nenhuma postagem aguardando revisão no momento. Tudo em dia! ✨"
          />
        ) : (
          queue.map((item) => (
            <div key={item.id} className="pt-2.5 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
              <div className="min-w-0 space-y-1">
                <h4 className="text-xs font-bold text-[#0f1e36] truncate">
                  {item.title}
                </h4>
                <div className="flex items-center gap-2 text-[10px] text-gray-400">
                  <span>Autor: <strong className="text-gray-600">{item.author}</strong></span>
                  <span>•</span>
                  <span>{item.date}</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => setReviewModalPost(item)}
                  className="px-2.5 py-1.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 text-xs font-bold hover:bg-amber-100 flex items-center gap-1 transition-colors"
                  title="Devolver para ajustes do professor"
                >
                  <RotateCcw size={12} />
                  Devolver
                </button>
                <button
                  onClick={() => handleApprove(item)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 flex items-center gap-1 shadow-xs transition-colors"
                  title="Aprovar e publicar imediatamente"
                >
                  <CheckCircle size={12} />
                  Aprovar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Return Notes Modal */}
      {reviewModalPost && (
        <div className="fixed inset-0 z-50 bg-[#0f1e36]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-2.5 text-amber-600 mb-3">
              <AlertCircle size={20} />
              <h3 className="font-bold text-base text-[#0f1e36]">Devolver Postagem para Ajustes</h3>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Informe ao professor(a) <strong>{reviewModalPost.author}</strong> quais alterações são necessárias no post <em>"{reviewModalPost.title}"</em>.
            </p>

            <textarea
              value={returnNotes}
              onChange={(e) => setReturnNotes(e.target.value)}
              placeholder="Ex: Favor substituir a imagem principal por uma foto com melhor resolução e corrigir o segundo parágrafo..."
              rows={4}
              className="w-full text-xs p-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/30 focus:border-[#44abff] mb-4 text-[#0f1e36]"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setReviewModalPost(null);
                  setReturnNotes("");
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleReturn}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
              >
                {isSubmitting ? "Enviando..." : "Confirmar Devolução"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
