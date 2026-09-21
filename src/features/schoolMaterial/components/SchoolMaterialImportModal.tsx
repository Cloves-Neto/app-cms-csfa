import { useState, useRef, type FormEvent, type DragEvent } from "react";
import { UploadCloud, FileSpreadsheet, Download, CheckCircle2, AlertCircle, X, Loader2 } from "lucide-react";
import { schoolMaterialService, type ImportSchoolMaterialCsvResponse } from "../services/schoolMaterial.service";
import { Button } from "@/components/common/Button";

interface SchoolMaterialImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: () => void;
}

export function SchoolMaterialImportModal({ isOpen, onClose, onImportSuccess }: SchoolMaterialImportModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ImportSchoolMaterialCsvResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    setErrorMessage(null);
    setResult(null);

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setErrorMessage("Por favor, selecione um arquivo válido no formato .csv.");
      return;
    }

    if (file.size > 150 * 1024 * 1024) {
      setErrorMessage("O arquivo excede o limite máximo permitido de 150MB.");
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);
    setResult(null);

    try {
      const response = await schoolMaterialService.importCsv(selectedFile);
      setResult(response);
      onImportSuccess();
    } catch (err: any) {
      setErrorMessage(err.response?.data?.error || err.message || "Erro ao importar arquivo CSV.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      await schoolMaterialService.downloadTemplateCsv();
    } catch (e) {
      console.error("Erro ao baixar modelo:", e);
    }
  };

  const handleClose = () => {
    if (isLoading) return;
    setSelectedFile(null);
    setResult(null);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-gray-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#44abff]/15 flex items-center justify-center text-[#44abff]">
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0f1e36]">Importar Materiais via CSV</h2>
              <p className="text-xs text-gray-500 font-normal">
                Sincronize múltiplas listas de materiais (até 150MB)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Card de Download do Modelo */}
          <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-center justify-between gap-3">
            <div className="text-xs text-blue-900">
              <p className="font-bold">Ainda não tem a planilha preenchida?</p>
              <p className="text-blue-700/80 text-[11px] mt-0.5">
                Baixe o modelo com cabeçalhos e exemplos oficiais.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-[#44abff] hover:bg-[#2993ed] text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <Download size={13} />
              <span>Modelo CSV</span>
            </button>
          </div>

          {/* Área de Drag and Drop */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
              isDragging
                ? "border-[#44abff] bg-[#44abff]/5"
                : selectedFile
                ? "border-emerald-300 bg-emerald-50/30"
                : "border-gray-200 hover:border-gray-300 bg-gray-50/50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />

            {selectedFile ? (
              <>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <FileSpreadsheet size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Pronto para envio
                  </p>
                </div>
                <p className="text-xs text-[#44abff] font-semibold mt-1">Clique para trocar de arquivo</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl bg-[#0f1e36]/5 text-[#0f1e36] flex items-center justify-center">
                  <UploadCloud size={24} className="text-[#44abff]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">Arraste o arquivo CSV aqui</p>
                  <p className="text-xs text-gray-500 mt-0.5">ou clique para selecionar do seu computador</p>
                </div>
                <span className="text-[11px] text-gray-400 font-medium">
                  Suporta arquivos .CSV de até 150MB
                </span>
              </>
            )}
          </div>

          {/* Feedback de Erro */}
          {errorMessage && (
            <div className="p-3.5 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-start gap-2">
              <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Feedback de Sucesso */}
          {result && (
            <div className="p-4 bg-emerald-50 text-emerald-800 text-xs rounded-2xl border border-emerald-200/80 space-y-1.5 animate-in fade-in">
              <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
                <CheckCircle2 size={18} className="text-emerald-600" />
                <span>Importação Concluída com Sucesso!</span>
              </div>
              <p>
                Foram processadas <strong>{result.data.totalProcessed} linhas</strong> e{" "}
                <strong>{result.data.totalImported} materiais</strong> foram adicionados.
              </p>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex items-center justify-end gap-2 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              size="md"
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={!selectedFile || isLoading}
              size="md"
              icon={
                isLoading ? (
                  <Loader2 size={16} className="animate-spin text-white" />
                ) : (
                  <UploadCloud size={16} />
                )
              }
            >
              {isLoading ? "Processando CSV..." : "Iniciar Importação"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
