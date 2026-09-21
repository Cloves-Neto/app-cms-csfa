import type { TagItem } from "../types/tag.types";

interface TagBadgeProps {
  tag: TagItem;
}

export function TagBadge({ tag }: TagBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${tag.color}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      <span>{tag.name}</span>
    </span>
  );
}
