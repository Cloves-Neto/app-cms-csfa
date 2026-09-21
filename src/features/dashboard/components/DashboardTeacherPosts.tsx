import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileEdit, Plus, Clock, AlertTriangle, CheckCircle, Send } from "lucide-react";
import { postService } from "@/features/post/services/post.service";
import type { Post } from "@/features/post/types/post.types";

export function DashboardTeacherPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"ALL" | "DRAFT" | "PENDING" | "RETURNED" | "PUBLISHED">("ALL");

  const loadPosts = async () => {
    setIsLoading(true);
    const res = await postService.getMyPosts();
    setPosts(res);
    setIsLoading(false);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const filteredPosts = posts.filter((p) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "DRAFT") return p.status === "DRAFT";
    if (activeTab === "PENDING") return p.status === "PENDING_REVIEW";
    if (activeTab === "RETURNED") return p.status === "RETURNED";
    if (activeTab === "PUBLISHED") return p.status === "PUBLISHED" || p.published;
    return true;
  });

  const handleSubmitReview = async (post: Post) => {
    if (!confirm(`Enviar o post "${post.title}" para a fila de revisão da Coordenação?`)) return;
    try {
      await postService.submitReview(post.id);
      await loadPosts();
    } catch (e) {
      alert("Erro ao enviar post para revisão.");
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-xs flex flex-col justify-start h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#44abff] flex items-center justify-center font-black">
            <FileEdit size={18} />
          </div>
          <div>
            <h3 className="font-black text-sm text-[#0f1e36] tracking-tight leading-none">
              Minhas Postagens
            </h3>
            <span className="text-[11px] font-medium text-gray-400">
              Painel do Professor — Fluxo de publicação
            </span>
          </div>
        </div>

        <Link
          to="/dashboard/posts/novo"
          className="px-3 py-1.5 rounded-xl bg-[#0f1e36] text-white text-xs font-bold hover:bg-[#0f1e36]/90 flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus size={14} className="text-[#44abff]" />
          Nova Postagem
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 pt-3 pb-2 overflow-x-auto text-[11px] font-bold">
        {[
          { id: "ALL", label: `Todos (${posts.length})` },
          { id: "RETURNED", label: `Devolvidos (${posts.filter(p => p.status === "RETURNED").length})`, alert: posts.filter(p => p.status === "RETURNED").length > 0 },
          { id: "PENDING", label: `Em Revisão (${posts.filter(p => p.status === "PENDING_REVIEW").length})` },
          { id: "DRAFT", label: `Rascunhos (${posts.filter(p => p.status === "DRAFT").length})` },
          { id: "PUBLISHED", label: `Publicados (${posts.filter(p => p.status === "PUBLISHED" || p.published).length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === tab.id
                ? "bg-[#0f1e36] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.label}
            {tab.alert && <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-50 pt-1 space-y-2">
        {isLoading ? (
          <div className="py-8 flex flex-col items-center justify-center text-gray-400 gap-2">
            <Clock className="animate-spin text-[#44abff]" size={20} />
            <span className="text-xs">Carregando suas postagens...</span>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-400">
            Nenhuma postagem encontrada nesta categoria.
          </div>
        ) : (
          filteredPosts.map((post) => {
            const isReturned = post.status === "RETURNED";
            const isPending = post.status === "PENDING_REVIEW";
            const isDraft = post.status === "DRAFT";
            const isPublished = post.status === "PUBLISHED" || post.published;

            return (
              <div key={post.id} className="pt-2.5 pb-2 text-left space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs font-bold text-[#0f1e36] truncate">
                        {post.title}
                      </h4>
                      {isReturned && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                          <AlertTriangle size={10} /> Devolvido para ajustes
                        </span>
                      )}
                      {isPending && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                          <Clock size={10} /> Aguardando Coordenação
                        </span>
                      )}
                      {isDraft && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                          Rascunho
                        </span>
                      )}
                      {isPublished && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle size={10} /> No Ar (Site)
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400 block">{post.date}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {(isDraft || isReturned) && (
                      <>
                        <Link
                          to={`/dashboard/posts/editar/${post.id}`}
                          className="px-2.5 py-1 text-xs font-bold text-gray-600 hover:text-[#0f1e36] bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => handleSubmitReview(post)}
                          className="px-2.5 py-1 text-xs font-bold text-white bg-[#44abff] hover:bg-[#2993ed] rounded-lg flex items-center gap-1 transition-colors shadow-xs"
                          title="Enviar para aprovação da coordenação"
                        >
                          <Send size={11} />
                          Enviar
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Review Notes Warning Banner */}
                {isReturned && post.reviewNotes && (
                  <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2">
                    <AlertTriangle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-amber-950 font-bold">Observação da Coordenação:</strong>
                      <span>{post.reviewNotes}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
