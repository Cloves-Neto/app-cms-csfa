import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import WrapPages from "@/layouts/WrapPages";
import { useAuth } from "@/features/auth";
import { FileEdit, ArrowLeft, Save, Send, UploadCloud, AlertTriangle, CheckCircle } from "lucide-react";
import { postService } from "@/features/post/services/post.service";
import { httpClient } from "@/core/http";

export function PostEditorPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImageId, setCoverImageId] = useState("");
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isEvent, setIsEvent] = useState(false);
  const [reviewNotes, setReviewNotes] = useState<string | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);

  const canDirectPublish = user?.role === "ADMIN" || user?.role === "COORDENACAO";

  // Slug auto-generation
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  useEffect(() => {
    if (isEditing && id) {
      setIsLoading(true);
      postService
        .getById(id)
        .then((post) => {
          setTitle(post.title);
          setSlug(post.slug || "");
          setExcerpt(post.excerpt || "");
          setContent(post.content || "");
          setCoverImageId(post.coverImageId || "");
          setCoverPreview(post.coverImageId || null);
          setIsEvent(Boolean(post.isEvent));
          setReviewNotes(post.reviewNotes || null);
        })
        .catch(() => {
          alert("Erro ao carregar dados do post.");
          navigate("/dashboard/posts");
        })
        .finally(() => setIsLoading(false));
    }
  }, [id, isEditing]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditing || !slug) {
      setSlug(generateSlug(val));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await httpClient.post<any>("/upload/post", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const url = response.url || response.data?.url;
      if (url) {
        setCoverImageId(url);
        setCoverPreview(url);
      }
    } catch (error) {
      alert("Erro ao fazer upload da imagem de capa.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (submitForReview: boolean, directPublish: boolean = false) => {
    if (!title.trim()) {
      alert("O título do post é obrigatório.");
      return;
    }
    if (!content.trim()) {
      alert("O conteúdo da postagem é obrigatório.");
      return;
    }

    try {
      setIsSaving(true);
      const payload: any = {
        title,
        slug: slug || generateSlug(title),
        excerpt,
        content,
        coverImageId: coverImageId || undefined,
        isEvent,
        published: directPublish,
      };

      let savedPost;
      if (isEditing && id) {
        savedPost = await postService.update(id, payload);
      } else {
        savedPost = await postService.create(payload);
      }

      if (submitForReview && savedPost?.id) {
        await postService.submitReview(savedPost.id);
      }

      alert(
        directPublish
          ? "Post publicado com sucesso!"
          : submitForReview
          ? "Post salvo e submetido para revisão pedagógica!"
          : "Rascunho salvo com sucesso!"
      );

      navigate("/dashboard/posts");
    } catch (error: any) {
      alert(error.message || "Erro ao salvar postagem.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <WrapPages
      header={
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0f1e36] text-white flex items-center justify-center">
              <FileEdit size={20} className="text-[#44abff]" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#0f1e36] tracking-tight">
                {isEditing ? "Editar Matéria / Notícia" : "Nova Matéria / Notícia"}
              </h2>
              <p className="text-xs text-gray-400 font-medium">
                Redação de artigos, eventos e comunicados institucionais
              </p>
            </div>
          </div>

          <Link
            to="/dashboard/posts"
            className="text-xs font-bold text-gray-500 hover:text-[#0f1e36] flex items-center gap-1.5 self-start sm:self-auto"
          >
            <ArrowLeft size={14} />
            Voltar
          </Link>
        </div>
      }
      content={
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs w-full h-full overflow-y-auto text-left">
          {isLoading ? (
            <div className="py-16 text-center text-xs text-gray-400">Carregando editor...</div>
          ) : (
            <form onSubmit={(e) => e.preventDefault()} className="max-w-4xl mx-auto space-y-6">
              {/* Alert if returned */}
              {reviewNotes && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                  <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                  <div className="text-xs text-amber-900">
                    <strong className="block font-bold mb-1">
                      Atenção: Esta matéria foi devolvida pela Coordenação para ajustes
                    </strong>
                    <p>{reviewNotes}</p>
                  </div>
                </div>
              )}

              {/* Title & Slug */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0f1e36]">Título da Postagem *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Ex: Alunos do CSFA conquistam medalhas na Olimpíada de Robótica"
                    required
                    className="w-full text-sm font-bold p-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/30 focus:border-[#44abff] text-[#0f1e36]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">URL Amigável (Slug)</label>
                  <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-2xl border border-gray-200 text-xs text-gray-500">
                    <span>https://csfa.com.br/noticias/</span>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="slug-da-materia"
                      className="bg-transparent font-medium focus:outline-none flex-1 text-[#0f1e36]"
                    />
                  </div>
                </div>
              </div>

              {/* Cover Image Upload */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#0f1e36]">Imagem de Capa (Banner da Notícia)</label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {coverPreview ? (
                    <div className="w-40 h-24 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 shrink-0 relative group">
                      <img src={coverPreview} alt="Capa" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setCoverPreview(null);
                          setCoverImageId("");
                        }}
                        className="absolute inset-0 bg-black/50 text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        Trocar
                      </button>
                    </div>
                  ) : (
                    <label className="w-full sm:w-60 h-24 rounded-2xl border-2 border-dashed border-gray-300 hover:border-[#44abff] bg-gray-50/50 hover:bg-[#44abff]/5 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors shrink-0">
                      <UploadCloud size={20} className="text-gray-400" />
                      <span className="text-[11px] font-bold text-gray-600">
                        {isUploading ? "Enviando..." : "Upload de Imagem (até 50MB)"}
                      </span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  )}

                  <div className="text-[11px] text-gray-400 space-y-1">
                    <p>Recomendado: Formatos JPG, PNG ou WebP de alta resolução (mínimo 1200x630px).</p>
                    <p>A imagem será exibida em destaque no topo do artigo e nos cards de notícias.</p>
                  </div>
                </div>
              </div>

              {/* Excerpt */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0f1e36]">Resumo da Notícia (Linha fina / Subtítulo)</label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Breve resumo que aparecerá nas listagens e redes sociais..."
                  rows={2}
                  className="w-full text-xs p-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/30 focus:border-[#44abff] text-[#0f1e36]"
                />
              </div>

              {/* Content */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0f1e36]">Conteúdo Completo do Artigo *</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Escreva aqui a matéria completa..."
                  rows={12}
                  required
                  className="w-full text-xs p-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/30 focus:border-[#44abff] leading-relaxed font-sans text-[#0f1e36]"
                />
              </div>

              {/* Event checkbox */}
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#0f1e36]">
                <input
                  type="checkbox"
                  checked={isEvent}
                  onChange={(e) => setIsEvent(e.target.checked)}
                  className="rounded text-[#44abff] focus:ring-[#44abff]"
                />
                Esta postagem é a cobertura de um Evento Escolar
              </label>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleSubmit(false, false)}
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-2xl border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-100 transition-all flex items-center gap-2"
                >
                  <Save size={14} />
                  Salvar Rascunho
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSubmit(true, false)}
                    disabled={isSaving}
                    className="px-6 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-all shadow-md flex items-center gap-2"
                  >
                    <Send size={14} />
                    Submeter para Revisão Pedagógica
                  </button>

                  {canDirectPublish && (
                    <button
                      type="button"
                      onClick={() => handleSubmit(false, true)}
                      disabled={isSaving}
                      className="px-6 py-2.5 rounded-2xl bg-[#0f1e36] hover:bg-[#0f1e36]/90 text-white font-bold text-xs transition-all shadow-md flex items-center gap-2"
                    >
                      <CheckCircle size={14} className="text-[#44abff]" />
                      Publicar Diretamente no Site
                    </button>
                  )}
                </div>
              </div>
            </form>
          )}
        </div>
      }
    />
  );
}

export default PostEditorPage;
