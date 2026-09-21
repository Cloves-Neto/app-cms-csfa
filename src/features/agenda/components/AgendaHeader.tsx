import { Calendar, Plus, Download, UploadCloud, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/common/Button";

interface AgendaHeaderProps {
  onNewEventClick: () => void;
  onImportCsvClick: () => void;
  onDownloadTemplate: () => void;
}

export function AgendaHeader({ onNewEventClick, onImportCsvClick, onDownloadTemplate }: AgendaHeaderProps) {
  return (
    <nav className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full h-full">
      <div className="w-full sm:w-auto">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0f1e36] flex items-center gap-2">
          <Calendar size={22} className="text-[#44abff]" />
          <span>Agenda & Calendário Escolar</span>
        </h1>
        <p className="text-xs text-gray-500 font-normal mt-0.5">
          Gerencie o cronograma de aulas, simulados, reuniões pedagógicas e eventos esportivos CSFA.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 justify-start shrink-0 w-full sm:w-auto">
        {/* Botão de Download do Modelo CSV */}
        <Button
          variant="outline"
          onClick={onDownloadTemplate}
          icon={<Download size={14} className="text-gray-500" />}
          size="md"
        >
          <span className="flex items-center gap-1.5">
            <FileSpreadsheet size={14} className="text-emerald-600" />
            <span>Modelo CSV</span>
          </span>
        </Button>

        {/* Botão de Importar CSV */}
        <Button
          variant="outline"
          onClick={onImportCsvClick}
          icon={<UploadCloud size={15} className="text-[#44abff]" />}
          size="md"
        >
          Importar CSV
        </Button>

        {/* Botão de Novo Evento Manual */}
        <Button
          onClick={onNewEventClick}
          icon={<Plus size={15} className="text-[#44abff]" />}
          size="md"
        >
          Novo Evento
        </Button>
      </div>
    </nav>
  );
}
