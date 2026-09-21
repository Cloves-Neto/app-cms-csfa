import { Image as ImageIcon, Plus } from "lucide-react";
import { Button } from "@/components/common/Button";

interface BannerHeaderProps {
  onNewBannerClick: () => void;
}

export function BannerHeader({ onNewBannerClick }: BannerHeaderProps) {
  return (
    <nav className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full h-full">
      <div className="w-full sm:w-auto">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0f1e36] flex items-center gap-2">
          <ImageIcon size={22} className="text-[#44abff]" />
          <span>Banners & Destaques da Home</span>
        </h1>
        <p className="text-xs text-gray-500 font-normal mt-0.5">
          Gerencie os banners rotativos, comunicados em destaque e campanhas na página inicial do portal CSFA.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 justify-start shrink-0 w-full sm:w-auto">
        <Button
          onClick={onNewBannerClick}
          icon={<Plus size={15} className="text-[#44abff]" />}
          size="md"
        >
          Novo Banner
        </Button>
      </div>
    </nav>
  );
}
