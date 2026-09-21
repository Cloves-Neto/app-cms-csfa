import { Eye, EyeOff } from "lucide-react";
import type { Post } from "../types/post.types";

interface PostStatusBadgeProps {
  post: Post;
  onToggleStatus: (id: string | number) => void;
  disabled?: boolean;
}

export function PostStatusBadge({ post, onToggleStatus, disabled }: PostStatusBadgeProps) {
  const isPublished = post.published || post.status === "Publicado";

  return (
    <button
      onClick={() => onToggleStatus(post.id)}
      disabled={disabled}
      className={`px-3 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 mx-auto border transition-all ${
        isPublished
          ? "bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100"
          : "bg-amber-50 text-amber-700 border-amber-200/80 hover:bg-amber-100"
      } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
      title="Clique para alternar status entre Publicado e Rascunho"
    >
      {isPublished ? (
        <>
          <Eye size={12} className="text-emerald-600" />
          <span>Publicado</span>
        </>
      ) : (
        <>
          <EyeOff size={12} className="text-amber-600" />
          <span>Rascunho</span>
        </>
      )}
    </button>
  );
}
