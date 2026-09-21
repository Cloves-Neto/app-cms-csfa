import { Plus, FileSpreadsheet, BookOpen } from "lucide-react";
import { Button } from "@/components/common/Button";

interface SchoolMaterialHeaderProps {
  onImportCsvClick: () => void;
  onNewMaterialClick?: () => void;
}

export function SchoolMaterialHeader({ onImportCsvClick, onNewMaterialClick }: SchoolMaterialHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-100 shadow-xs text-[#44abff]">
          <BookOpen size={24} strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#0f1e36] tracking-tight">Materiais Escolares</h1>
          <p className="text-sm text-gray-500 font-medium mt-0.5">
            Gerencie as listas de material por segmento e série
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          icon={<FileSpreadsheet size={16} />}
          onClick={onImportCsvClick}
          className="bg-white"
        >
          Importar Lote (CSV)
        </Button>
        {onNewMaterialClick && (
          <Button icon={<Plus size={16} />} onClick={onNewMaterialClick}>
            Nova Lista
          </Button>
        )}
      </div>
    </div>
  );
}
