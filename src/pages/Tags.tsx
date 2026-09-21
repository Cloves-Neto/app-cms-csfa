import WrapPages from "@/layouts/WrapPages";
import { Search } from "lucide-react";
import {
  useTags,
  TagHeader,
  TagTable,
  TagFormModal,
} from "@/features/tags";

/**
 * Página de Gestão de Tags & Categorias.
 * Atua puramente como orquestradora e compositora de microcomponentes de domínio.
 */
export function Tags() {
  const {
    filteredTags,
    paginatedTags,
    stats,
    isLoading,
    searchQuery,
    filterStatus,
    currentPage,
    itemsPerPage,
    isModalOpen,
    editingTag,
    setSearchQuery,
    setFilterStatus,
    setCurrentPage,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSaveTag,
    handleDeleteTag,
    handleToggleStatus,
  } = useTags();

  return (
    <>
      <WrapPages
        header={<TagHeader onNewTagClick={openCreateModal} />}
        content={
          <div className="space-y-4 w-full h-full flex flex-col min-h-0">
            <div className="bg-white rounded-3xl border border-gray-100 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
                {[
                  { id: "all", label: "Todas", count: stats.total },
                  { id: "active", label: "Ativas", count: stats.active },
                  { id: "inactive", label: "Inativas", count: stats.inactive },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setFilterStatus(tab.id as any)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      filterStatus === tab.id
                        ? "bg-[#0f1e36] text-white shadow-xs"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {tab.label}
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        filterStatus === tab.id ? "bg-[#44abff] text-[#0f1e36]" : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-72">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome, slug ou descrição..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#44abff]/30 text-[#0f1e36]"
                />
              </div>
            </div>

            <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-xs flex flex-col justify-between overflow-hidden p-2 sm:p-4 min-h-0">
              <TagTable
                tags={paginatedTags}
                totalFilteredCount={filteredTags.length}
                isLoading={isLoading}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onEdit={openEditModal}
                onDelete={handleDeleteTag}
                onToggleStatus={handleToggleStatus}
              />
            </div>
          </div>
        }
      />

      <TagFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveTag}
        editingTag={editingTag}
      />
    </>
  );
}

export default Tags;
