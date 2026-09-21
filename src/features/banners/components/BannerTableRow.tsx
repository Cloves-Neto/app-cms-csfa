import { Eye, EyeOff, Pencil, Trash2, ArrowUp, ArrowDown, ExternalLink } from "lucide-react";
import type { Banner } from "../types/banner.types";

interface BannerTableRowProps {
  banner: Banner;
  onEdit: (banner: Banner) => void;
  onDelete: (id: string | number) => void;
  onToggleStatus: (id: string | number) => void;
  onReorder: (id: string | number, direction: "up" | "down") => void;
}

export function BannerTableRow({
  banner,
  onEdit,
  onDelete,
  onToggleStatus,
  onReorder,
}: BannerTableRowProps) {
  return (
    <tr className="hover:bg-gray-50/80 transition-colors group">
      {/* Position */}
      <td className="py-3 px-4 font-black text-xs text-[#0f1e36]">
        <div className="flex items-center gap-1">
          <span className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center font-black text-xs">
            #{banner.order}
          </span>
          <div className="flex flex-col">
            <button
              onClick={() => onReorder(banner.id, "up")}
              className="text-gray-400 hover:text-[#0f1e36]"
              title="Subir"
            >
              <ArrowUp size={11} />
            </button>
            <button
              onClick={() => onReorder(banner.id, "down")}
              className="text-gray-400 hover:text-[#0f1e36]"
              title="Descer"
            >
              <ArrowDown size={11} />
            </button>
          </div>
        </div>
      </td>

      {/* Image Thumbnail */}
      <td className="py-3 px-4">
        <div className="w-20 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
          <img
            src={banner.imageUrl}
            alt={banner.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80";
            }}
          />
        </div>
      </td>

      {/* Title & Link */}
      <td className="py-3 px-4">
        <p className="font-bold text-xs sm:text-sm text-[#0f1e36] line-clamp-1">{banner.title}</p>
        <a
          href={banner.targetUrl}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-[#44abff] hover:underline flex items-center gap-1 font-medium truncate max-w-xs"
        >
          <ExternalLink size={11} className="shrink-0" />
          <span className="truncate">{banner.targetUrl}</span>
        </a>
      </td>

      {/* Date */}
      <td className="py-3 px-4 text-xs text-gray-500 font-medium">
        {banner.publishDate}
      </td>

      {/* Status */}
      <td className="py-3 px-4 text-center">
        <button
          onClick={() => onToggleStatus(banner.id)}
          className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 mx-auto border transition-all ${
            banner.isActive
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
              : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
          }`}
        >
          {banner.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
          <span>{banner.isActive ? "Ativo" : "Inativo"}</span>
        </button>
      </td>

      {/* Actions */}
      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => onEdit(banner)}
            className="p-1.5 rounded-xl text-gray-500 hover:text-[#0f1e36] hover:bg-gray-100"
            title="Editar Banner"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(banner.id)}
            className="p-1.5 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50"
            title="Excluir Banner"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
}
