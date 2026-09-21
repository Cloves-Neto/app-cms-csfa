import { useState, useEffect, type FormEvent } from "react";
import { X, Check, Hash } from "lucide-react";
import type { CreateTagInput, TagItem } from "../types/tag.types";

interface TagFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateTagInput) => Promise<void>;
  editingTag?: TagItem | null;
}

const COLOR_PRESETS = [
  { name: "Navy CSFA", class: "bg-[#0f1e36] text-[#44abff] border-[#44abff]/30" },
  { name: "Azul Claro", class: "bg-blue-50 text-blue-700 border-blue-200" },
  { name: "Roxo", class: "bg-purple-50 text-purple-700 border-purple-200" },
  { name: "Verde", class: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { name: "Âmbar", class: "bg-amber-50 text-amber-700 border-amber-200" },
  { name: "Rosa", class: "bg-rose-50 text-rose-700 border-rose-200" },
];

export function TagFormModal({
  isOpen,
  onClose,
  onSave,
  editingTag,
}: TagFormModalProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [color, setColor] = useState(COLOR_PRESETS[0].class);
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingTag) {
      setName(editingTag.name);
      setSlug(editingTag.slug);
      setColor(editingTag.color);
      setDescription(editingTag.description);
      setIsActive(editingTag.isActive);
    } else {
      setName("");
      setSlug("");
      setColor(COLOR_PRESETS[0].class);
      setDescription("");
      setIsActive(true);
    }
  }, [editingTag, isOpen]);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingTag) {
      setSlug(val.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, ""));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave({
        name,
        slug,
        color,
        description,
        isActive,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0f1e36]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full border border-gray-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h2 className="text-base font-black text-[#0f1e36]">
              {editingTag ? "Editar Categoria / Tag" : "Nova Tag de Conteúdo"}
            </h2>
            <p className="text-xs text-gray-500">Defina o nome, slug e estilo visual da tag.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Nome da Tag
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/40 text-sm text-[#0f1e36]"
              placeholder="Ex: Comunicação Interna"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Slug da URL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Hash size={14} />
              </div>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-gray-50 pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/40 text-sm text-[#0f1e36] font-mono"
                placeholder="comunicacao-interna"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Estilo Visual / Cor do Badge
            </label>
            <div className="grid grid-cols-3 gap-2">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => setColor(preset.class)}
                  className={`p-2 rounded-xl text-xs font-bold border transition-all text-center ${
                    preset.class
                  } ${
                    color === preset.class ? "ring-2 ring-[#0f1e36] shadow-xs" : "opacity-75 hover:opacity-100"
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Descrição
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-50 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/40 text-xs text-[#0f1e36]"
              placeholder="Onde e como esta categoria deve ser aplicada..."
            />
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
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
              {isSubmitting ? "Salvando..." : editingTag ? "Atualizar Tag" : "Criar Tag"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
