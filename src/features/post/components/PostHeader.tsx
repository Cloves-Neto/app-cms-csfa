import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/common/Button";

interface PostHeaderProps {
  createUrl?: string;
  onCreateClick?: () => void;
}

export function PostHeader({ createUrl = "/dashboard/posts/novo", onCreateClick }: PostHeaderProps) {
  return (
    <nav className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full h-full">
      <div className="w-full sm:w-auto">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0f1e36] flex items-center gap-2">
          <FileText size={22} className="text-[#44abff]" />
          <span>Postagens & Comunicados</span>
        </h1>
        <p className="text-xs text-gray-500 font-normal mt-0.5">
          Gerencie os artigos, comunicados e matérias do portal escolar CSFA.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 justify-start shrink-0 w-full sm:w-auto">
        <Button
          to={createUrl}
          onClick={onCreateClick}
          icon={<Plus size={15} className="text-[#44abff]" />}
          size="md"
        >
          Criar Nova Postagem
        </Button>
      </div>
    </nav>
  );
}
