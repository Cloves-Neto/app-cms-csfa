import { Eye, EyeOff, Pencil, Trash2, Hash } from "lucide-react";
import type { TagItem } from "../types/tag.types";
import { TagBadge } from "./TagBadge";

interface TagTableRowProps {
  tag: TagItem;
  onEdit: (tag: TagItem) => void;
  onDelete: (id: string | number) => void;
  onToggleStatus: (id: string | number) => void;
}

export function TagTableRow({ tag, onEdit, onDelete, onToggleStatus }: TagTableRowProps) {
  return (
    <tr className="hover:bg-gray-50/80 transition-colors group">
      {/* Name & Badge */}
      <td className="py-3.5 px-4 font-bold text-[#0f1e36]">
        <div className="flex items-center gap-2">
          <TagBadge tag={tag} />
        </div>
      </td>

      {/* Slug */}
      <td className="py-3.5 px-4 text-xs font-mono text-gray-500">
        <span className="flex items-center gap-1">
          <Hash size={12} className="text-gray-400" />
          {tag.slug}
        </span>
      </td>

      {/* Description */}
      <td className="py-3.5 px-4 text-xs text-gray-500 max-w-xs truncate">
        {tag.description}
      </td>

      {/* Usage Count */}
      <td className="py-3.5 px-4 text-center font-bold text-xs text-[#0f1e36]">
        <span className="px-2 py-0.5 rounded-md bg-gray-100 border border-gray-200">
          {tag.usageCount} artigos
        </span>
      </td>

      {/* Status */}
      <td className="py-3.5 px-4 text-center">
        <button
          onClick={() => onToggleStatus(tag.id)}
          className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 mx-auto border transition-all ${
            tag.isActive
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
              : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
          }`}
        >
          {tag.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
          <span>{tag.isActive ? "Ativa" : "Inativa"}</span>
        </button>
      </td>

      {/* Actions */}
      <td className="py-3.5 px-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => onEdit(tag)}
            className="p-1.5 rounded-xl text-gray-500 hover:text-[#0f1e36] hover:bg-gray-100"
            title="Editar Tag"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(tag.id)}
            className="p-1.5 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50"
            title="Excluir Tag"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
}
