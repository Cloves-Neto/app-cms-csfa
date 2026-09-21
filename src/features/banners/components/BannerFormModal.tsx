import { useState, useEffect, type FormEvent } from "react";
import { X, Check, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import type { Banner, CreateBannerInput } from "../types/banner.types";

interface BannerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateBannerInput) => Promise<void>;
  onSaveAsTemplate?: (data: { title: string; imageUrl: string; targetUrl: string }) => Promise<void>;
  editingBanner?: Banner | null;
}

export function BannerFormModal({
  isOpen,
  onClose,
  onSave,
  onSaveAsTemplate,
  editingBanner,
}: BannerFormModalProps) {
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingBanner) {
      setTitle(editingBanner.title);
      setImageUrl(editingBanner.imageUrl);
      setTargetUrl(editingBanner.targetUrl);
      setPublishDate(editingBanner.publishDate);
      setIsActive(editingBanner.isActive);
    } else {
      setTitle("");
      setImageUrl("");
      setTargetUrl("");
      setPublishDate(new Date().toLocaleDateString("pt-BR"));
      setIsActive(true);
    }
  }, [editingBanner, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave({
        title,
        imageUrl,
        targetUrl,
        publishDate,
        isActive,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0f1e36]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-gray-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h2 className="text-base font-black text-[#0f1e36]">
              {editingBanner ? "Editar Banner" : "Novo Banner do Portal"}
            </h2>
            <p className="text-xs text-gray-500">Configure a imagem, link de destino e publicação.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Título do Banner / Campanha
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/40 text-sm text-[#0f1e36]"
              placeholder="Ex: Matrículas Abertas 2027"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              URL da Imagem Desktop (1200x600 recomendado)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <ImageIcon size={15} />
              </div>
              <input
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-gray-50 pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/40 text-sm text-[#0f1e36]"
                placeholder="https://..."
              />
            </div>
            {imageUrl && (
              <div className="mt-2 aspect-16/7 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80";
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Link de Redirecionamento (CTA)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <LinkIcon size={15} />
              </div>
              <input
                type="url"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className="w-full bg-gray-50 pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/40 text-sm text-[#0f1e36]"
                placeholder="https://csfa.com.br/pagina-destino"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Exibir no Carrossel da Home
            </span>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`w-12 h-6.5 rounded-full p-1 transition-colors ${
                isActive ? "bg-emerald-600" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-4.5 h-4.5 rounded-full bg-white transition-transform ${
                  isActive ? "translate-x-5.5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            {onSaveAsTemplate ? (
              <button
                type="button"
                disabled={isSubmitting || !title || !imageUrl}
                onClick={async () => {
                  setIsSubmitting(true);
                  try {
                    await onSaveAsTemplate({ title, imageUrl, targetUrl });
                    alert("Template salvo com sucesso!");
                  } catch (e) {
                    alert("Erro ao salvar template.");
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#44abff] bg-[#44abff]/10 hover:bg-[#44abff]/20 disabled:opacity-60 transition-colors"
              >
                Salvar como Template
              </button>
            ) : <div />}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-[#0f1e36] text-white text-xs font-bold hover:bg-[#0f1e36]/90 flex items-center gap-1.5 shadow-md shadow-[#0f1e36]/15 disabled:opacity-60"
              >
                <Check size={14} />
                {isSubmitting ? "Salvando..." : editingBanner ? "Atualizar Banner" : "Publicar Banner"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
