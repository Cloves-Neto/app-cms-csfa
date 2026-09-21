import { useState, useEffect } from "react";
import WrapPages from "@/layouts/WrapPages";
import { ClipboardCheck, CheckCircle2, RotateCcw, AlertTriangle, Calendar, User, Search } from "lucide-react";
import { postService } from "@/features/post/services/post.service";
import type { Post } from "@/features/post/types/post.types";

export function ReviewQueuePage() {
  const [queue, setQueue] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [returnNotes, setReturnNotes] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const loadQueue = async () => {
    setIsLoading(true);
    const data = await postService.getReviewQueue();
    setQueue(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const handleApprove = async (post: Post) => {
    if (!confirm(`Aprovar e publicar o post "${post.title}" no site institucional?`)) return;
    try {
      setIsProcessing(true);
      await postService.approve(post.id);
      await loadQueue();
    } catch (e) {
      alert("Erro ao aprovar postagem.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReturn = async () => {
    if (!selectedPost) return;
    if (!returnNotes.trim()) {
      alert("Por favor, digite as observações e orientações para o professor.");
      return;
    }

    try {
      setIsProcessing(true);
      await postService.returnPost(selectedPost.id, returnNotes);
      setSelectedPost(null);
      setReturnNotes("");
      await loadQueue();
    } catch (e) {
      alert("Erro ao devolver postagem.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <WrapPages
      header={
        <nav className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full h-full">
          <div className="w-full sm:w-auto">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0f1e36] flex items-center gap-2">
              <ClipboardCheck size={22} className="text-[#44abff]" />
              <span>Fila de Revisão Pedagógica</span>
            </h1>
            <p className="text-xs text-gray-500 font-normal mt-0.5">
              Revisão, aprovação e devolução de matérias submetidas por professores
            </p>
          </div>
        </nav>
      }
      content={
        <div className="space-y-4 w-full h-full flex flex-col min-h-0">
          {/* Top Controls */}
          <div className="bg-white rounded-3xl border border-gray-100 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
              <button className="px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 bg-[#0f1e36] text-white shadow-xs">
                Pendentes de Aprovação
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#44abff] text-[#0f1e36]">
                  {queue.length}
                </span>
              </button>
            </div>
            
            <div className="relative w-full md:w-72">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar nas matérias..."
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/30 text-[#0f1e36]"
              />
            </div>
          </div>

          {/* List Container */}
          <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden flex flex-col min-h-0">
            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-gray-400 gap-2">
                <span className="text-xs">Carregando fila de matérias pendentes...</span>
              </div>
            ) : queue.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-gray-400 space-y-2">
                <CheckCircle2 size={32} className="text-gray-300 mx-auto" />
                <h3 className="font-bold text-sm text-[#0f1e36]">Nenhuma matéria aguardando revisão!</h3>
                <p className="text-[11px] text-gray-400">
                  Todas as matérias submetidas pelos professores foram avaliadas e publicadas.
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                {queue.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 sm:p-5 hover:bg-gray-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 text-left"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700">
                          Aguardando Revisão
                        </span>
                        <span className="text-[11px] text-gray-400 flex items-center gap-1 font-medium">
                          <Calendar size={11} /> {post.date}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm text-[#0f1e36]">{post.title}</h3>
                      {post.excerpt && <p className="text-xs text-gray-500 line-clamp-1">{post.excerpt}</p>}

                      <div className="flex items-center gap-3 text-[11px] text-gray-500 pt-1 font-medium">
                        <span className="flex items-center gap-1">
                          <User size={12} className="text-[#44abff]" />
                          Autor: <strong className="text-gray-700">{post.author}</strong>
                        </span>
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex items-center gap-1">
                            {post.tags.map((t) => (
                              <span key={t.tag.id} className="text-[10px] px-1.5 py-0.5 border border-gray-200 rounded-md text-gray-500 bg-white">
                                #{t.tag.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      <button
                        onClick={() => setSelectedPost(post)}
                        className="px-3 py-2 rounded-xl bg-white text-amber-700 border border-amber-200 text-xs font-bold hover:bg-amber-50 flex items-center gap-1.5 transition-colors"
                      >
                        <RotateCcw size={14} />
                        Devolver Ajustes
                      </button>
                      <button
                        onClick={() => handleApprove(post)}
                        disabled={isProcessing}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
                      >
                        <CheckCircle2 size={14} />
                        Publicar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal de Devolução com Observações */}
          {selectedPost && (
            <div className="fixed inset-0 z-50 bg-[#0f1e36]/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200 text-left">
                <div className="flex items-center gap-2.5 text-amber-600 mb-3">
                  <AlertTriangle size={22} />
                  <h3 className="font-bold text-base text-[#0f1e36]">Devolver Postagem para Ajustes</h3>
                </div>

                <p className="text-xs text-gray-500 mb-3">
                  Informe com clareza quais alterações ou correções o professor(a) <strong>{selectedPost.author}</strong> precisa realizar no post <em>"{selectedPost.title}"</em>:
                </p>

                <textarea
                  value={returnNotes}
                  onChange={(e) => setReturnNotes(e.target.value)}
                  placeholder="Ex: Favor ajustar a imagem de capa e reformular o título para seguir o padrão institucional..."
                  rows={5}
                  required
                  className="w-full text-xs p-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/30 focus:border-[#44abff] mb-4 text-[#0f1e36]"
                />

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPost(null);
                      setReturnNotes("");
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleReturn}
                    disabled={isProcessing}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
                  >
                    {isProcessing ? "Devolvendo..." : "Confirmar e Notificar Professor"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      }
    />
  );
}

export default ReviewQueuePage;
