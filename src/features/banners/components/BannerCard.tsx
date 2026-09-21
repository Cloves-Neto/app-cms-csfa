import { Eye, EyeOff, Pencil, Trash2, ArrowUp, ArrowDown, ExternalLink } from "lucide-react";
import type { Banner } from "../types/banner.types";

interface BannerCardProps {
  banner: Banner;
  onEdit: (banner: Banner) => void;
  onDelete: (id: string | number) => void;
  onToggleStatus: (id: string | number) => void;
  onReorder: (id: string | number, direction: "up" | "down") => void;
}

export function BannerCard({ banner, onEdit, onDelete, onToggleStatus, onReorder }: BannerCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group">
      {/* Image Container with Badges */}
      <div className="relative aspect-16/8 overflow-hidden bg-gray-100">
        <img
          src={banner.imageUrl}
          alt={banner.title}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80";
          }}
        />

        {/* Order Badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#0f1e36]/80 backdrop-blur-xs text-white text-[11px] font-extrabold rounded-xl border border-white/20">
          Posição #{banner.order}
        </div>

        {/* Status Badge Toggle */}
        <button
          onClick={() => onToggleStatus(banner.id)}
          className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-extrabold flex items-center gap-1 shadow-sm border backdrop-blur-xs transition-all ${
            banner.isActive
              ? "bg-emerald-500/90 text-white border-emerald-400"
              : "bg-amber-500/90 text-white border-amber-400"
          }`}
          title="Alternar Status"
        >
          {banner.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
          <span>{banner.isActive ? "Ativo" : "Inativo"}</span>
        </button>
      </div>

      {/* Card Info */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="font-bold text-sm text-[#0f1e36] line-clamp-2 leading-snug group-hover:text-[#44abff] transition-colors">
            {banner.title}
          </h3>

          {banner.targetUrl && (
            <a
              href={banner.targetUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[#44abff] hover:underline flex items-center gap-1 mt-1 font-medium truncate"
            >
              <ExternalLink size={11} className="shrink-0" />
              <span className="truncate">{banner.targetUrl}</span>
            </a>
          )}
        </div>

        {/* Card Footer Actions */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={() => onReorder(banner.id, "up")}
              className="p-1.5 rounded-lg text-gray-400 hover:text-[#0f1e36] hover:bg-gray-100 transition-colors"
              title="Mover para cima"
            >
              <ArrowUp size={14} />
            </button>
            <button
              onClick={() => onReorder(banner.id, "down")}
              className="p-1.5 rounded-lg text-gray-400 hover:text-[#0f1e36] hover:bg-gray-100 transition-colors"
              title="Mover para baixo"
            >
              <ArrowDown size={14} />
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(banner)}
              className="p-1.5 rounded-xl text-gray-500 hover:text-[#0f1e36] hover:bg-gray-100 transition-colors"
              title="Editar Banner"
            >
              <Pencil size={15} />
            </button>
            <button
              onClick={() => onDelete(banner.id)}
              className="p-1.5 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Excluir Banner"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
