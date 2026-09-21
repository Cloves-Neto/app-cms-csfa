import { Link } from "react-router-dom";
import { FileText, Eye, Calendar, ChevronRight, Newspaper } from "lucide-react";
import type { DashboardArticleItem } from "../types/dashboard.types";
import { EmptyState } from "@/components/common/EmptyState";

interface DashboardRecentArticlesProps {
  articles: DashboardArticleItem[];
}

export function DashboardRecentArticles({ articles }: DashboardRecentArticlesProps) {
  const getCategoryBadgeColor = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes("tec") || cat.includes("rob")) return "bg-indigo-50 text-indigo-700 border-indigo-200/60";
    if (cat.includes("inst")) return "bg-blue-50 text-[#44abff] border-blue-200/60";
    if (cat.includes("esp")) return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
    if (cat.includes("acad")) return "bg-amber-50 text-amber-700 border-amber-200/60";
    return "bg-gray-50 text-gray-700 border-gray-200/60";
  };

  return (
    <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col h-full overflow-hidden">
      {/* Header do Card */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 shrink-0 mb-3">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-[#44abff]" />
          <h2 className="font-bold text-sm text-[#0f1e36]">Últimas Matérias & Postagens</h2>
        </div>
        <Link
          to="/dashboard/posts"
          className="text-xs font-bold text-[#44abff] hover:underline flex items-center gap-1"
        >
          <span>Ver Todas</span>
          <ChevronRight size={13} />
        </Link>
      </div>

      {/* Lista de Matérias Alinhada ao Topo */}
      {articles.length === 0 ? (
        <EmptyState
          icon={<Newspaper size={32} className="text-gray-300 mb-2 stroke-1" />}
          title="Nenhuma matéria cadastrada ainda"
          description="Crie sua primeira postagem no módulo de Posts."
        />
      ) : (
        <div className="flex-1 overflow-y-auto pr-1 space-y-2.5">
          {articles.map((art) => (
            <div
              key={art.id}
              className="p-2.5 sm:p-3 bg-gray-50/80 hover:bg-gray-100/70 rounded-2xl border border-gray-100 transition-all flex items-center justify-between gap-3 group"
            >
              {/* Thumbnail com Imagem */}
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl overflow-hidden shrink-0 bg-gray-200 border border-gray-100 shadow-2xs">
                <img
                  src={art.imageUrl || "/posts/post-1-robotica.jpg"}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Informações da Matéria */}
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getCategoryBadgeColor(
                      art.category
                    )}`}
                  >
                    {art.category}
                  </span>
                </div>

                <h3 className="font-bold text-xs text-[#0f1e36] truncate group-hover:text-[#44abff] transition-colors">
                  {art.title}
                </h3>

                <div className="flex items-center gap-2 text-[11px] text-gray-400">
                  <span className="font-medium text-gray-600 truncate max-w-32">{art.author}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 shrink-0">
                    <Calendar size={10} />
                    {art.date}
                  </span>
                </div>
              </div>

              {/* Badge de Visualizações */}
              <div className="flex items-center gap-1 text-xs font-bold text-[#0f1e36] shrink-0 bg-white px-2.5 py-1.5 rounded-xl border border-gray-100 shadow-2xs">
                <Eye size={12} className="text-gray-400" />
                <span>{art.views}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
