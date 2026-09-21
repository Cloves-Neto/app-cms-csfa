import { Link } from "react-router-dom";
import { User, Calendar, Eye, Pencil, Trash2 } from "lucide-react";
import type { Post } from "../types/post.types";
import { PostStatusBadge } from "./PostStatusBadge";

interface PostTableRowProps {
  post: Post;
  onToggleStatus: (id: string | number) => void;
  onDelete: (id: string | number) => void;
}

export function PostTableRow({ post, onToggleStatus, onDelete }: PostTableRowProps) {
  return (
    <tr className="hover:bg-gray-50/80 transition-colors group">
      {/* Title */}
      <td className="py-3.5 sm:py-4 px-4 sm:px-5 font-bold text-[#0f1e36]">
        <div className="space-y-0.5">
          <p className="text-xs sm:text-sm group-hover:text-[#44abff] transition-colors">
            {post.title}
          </p>
        </div>
      </td>

      {/* Author & Category */}
      <td className="py-3.5 sm:py-4 px-4 sm:px-5">
        <div className="space-y-1">
          <span className="text-gray-600 font-semibold flex items-center gap-1 text-xs">
            <User size={13} className="text-gray-400" />
            {post.author}
          </span>
          <span className="px-2.5 py-0.5 rounded-md bg-gray-100 border border-gray-200 text-xs font-bold text-[#0f1e36] inline-block">
            {post.category}
          </span>
        </div>
      </td>

      {/* Date */}
      <td className="py-3.5 sm:py-4 px-4 sm:px-5 text-gray-500 font-medium">
        <div className="flex items-center gap-1.5 text-xs sm:text-sm">
          <Calendar size={13} className="text-gray-400" />
          <span>{post.date}</span>
        </div>
      </td>

      {/* Views */}
      <td className="py-3.5 sm:py-4 px-4 sm:px-5 text-center font-semibold text-[#0f1e36]">
        <div className="flex items-center justify-center gap-1 text-xs sm:text-sm">
          <Eye size={13} className="text-gray-400" />
          <span>{post.views}</span>
        </div>
      </td>

      {/* Status */}
      <td className="py-3.5 sm:py-4 px-4 sm:px-5 text-center">
        <PostStatusBadge post={post} onToggleStatus={onToggleStatus} />
      </td>

      {/* Actions */}
      <td className="py-3.5 sm:py-4 px-4 sm:px-5 text-right">
        <div className="flex items-center justify-end gap-1.5">
          <Link
            to={`/dashboard/posts/editar/${post.id}`}
            className="p-2 rounded-xl text-gray-500 hover:text-[#0f1e36] hover:bg-gray-100 transition-colors"
            title="Editar Postagem"
          >
            <Pencil size={16} />
          </Link>

          <button
            onClick={() => onDelete(post.id)}
            className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Excluir Postagem"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
