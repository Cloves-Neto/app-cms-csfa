import { Tag as TagIcon, Plus } from "lucide-react";
import { Button } from "@/components/common/Button";

interface TagHeaderProps {
  onNewTagClick: () => void;
}

export function TagHeader({ onNewTagClick }: TagHeaderProps) {
  return (
    <nav className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full h-full">
      <div className="w-full sm:w-auto">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0f1e36] flex items-center gap-2">
          <TagIcon size={22} className="text-[#44abff]" />
          <span>Tags & Categorias de Conteúdo</span>
        </h1>
        <p className="text-xs text-gray-500 font-normal mt-0.5">
          Organize e padronize a taxonomia de postagens, eventos e comunicados do portal CSFA.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 justify-start shrink-0 w-full sm:w-auto">
        <Button
          onClick={onNewTagClick}
          icon={<Plus size={15} className="text-[#44abff]" />}
          size="md"
        >
          Nova Categoria / Tag
        </Button>
      </div>
    </nav>
  );
}
