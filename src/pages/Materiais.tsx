import { useState, useEffect } from "react";
import WrapPages from "@/layouts/WrapPages";
import {
  schoolMaterialService,
  SchoolMaterialHeader,
  SchoolMaterialImportModal,
  type ISchoolMaterial,
} from "@/features/schoolMaterial";
import { Loader2, Trash2, BookOpen, AlertCircle, Search } from "lucide-react";
import { Button } from "@/components/common/Button";

export function Materiais() {
  const [materials, setMaterials] = useState<ISchoolMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      setIsLoading(true);
      const data = await schoolMaterialService.getAll();
      setMaterials(data);
    } catch (error: any) {
      alert(error.response?.data?.message || "Erro ao carregar materiais");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Deseja realmente excluir esta lista de materiais?")) return;
    
    try {
      await schoolMaterialService.delete(id);
      alert("Lista removida com sucesso");
      fetchMaterials();
    } catch (error) {
      alert("Erro ao remover lista");
    }
  };

  const handleImportSuccess = () => {
    fetchMaterials();
  };

  return (
    <>
      <WrapPages
        header={
          <SchoolMaterialHeader
            onImportCsvClick={() => setIsImportModalOpen(true)}
          />
        }
        content={
          <div className="space-y-4 w-full h-full flex flex-col min-h-0">
            <div className="bg-white rounded-3xl border border-gray-100 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
                <button className="px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 bg-[#0f1e36] text-white shadow-xs">
                  Todos os Materiais
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#44abff] text-[#0f1e36]">
                    {materials.length}
                  </span>
                </button>
              </div>
              
              <div className="relative w-full md:w-72">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar material..."
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/30 text-[#0f1e36]"
                />
              </div>
            </div>

            <div className="flex-1 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col min-h-0">
              {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <Loader2 size={32} className="animate-spin mb-4 text-[#44abff]" />
                <p>Carregando materiais escolares...</p>
              </div>
            ) : materials.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4 border border-gray-100">
                  <BookOpen size={24} className="text-gray-300" />
                </div>
                <h3 className="text-gray-900 font-bold mb-1 text-lg">Nenhum material encontrado</h3>
                <p className="text-sm">Você ainda não cadastrou nenhuma lista de materiais.</p>
                <div className="mt-6 flex items-center gap-2">
                  <Button onClick={() => setIsImportModalOpen(true)} icon={<AlertCircle size={16} />}>
                    Importar Agora
                  </Button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Título</th>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Segmento</th>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Série</th>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ano</th>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Arquivo</th>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {materials.map((mat) => (
                      <tr key={mat.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                              <BookOpen size={18} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">{mat.title}</p>
                              <p className="text-xs text-gray-500">Adicionado em {new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(mat.createdAt))}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600 font-medium">
                          {mat.segment.replace(/_/g, " ")}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600 font-medium">
                          {mat.grade}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600 font-medium">
                          {mat.academicYear}
                        </td>
                        <td className="py-4 px-4 text-sm">
                          <a 
                            href={mat.fileUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-[#44abff] hover:underline"
                          >
                            Ver PDF
                          </a>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => handleDelete(mat.id)}
                            className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      }
      />

      <SchoolMaterialImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={handleImportSuccess}
      />
    </>
  );
}

export default Materiais;
