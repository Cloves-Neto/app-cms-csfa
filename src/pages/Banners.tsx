import WrapPages from "@/layouts/WrapPages";
import {
  useBanners,
  BannerHeader,
  BannerFilters,
  BannerTable,
  BannerFormModal,
} from "@/features/banners";


export function Banners() {
  const {
    filteredBanners,
    paginatedBanners,
    stats,
    isLoading,
    searchQuery,
    filterStatus,
    viewMode,
    currentPage,
    itemsPerPage,
    isModalOpen,
    editingBanner,
    setSearchQuery,
    setFilterStatus,
    setViewMode,
    setCurrentPage,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSaveBanner,
    handleDeleteBanner,
    handleToggleStatus,
    handleReorder,
    handleSaveAsTemplate,
  } = useBanners();

  return (
    <>
      <WrapPages
        header={<BannerHeader onNewBannerClick={openCreateModal} />}
        content={
          <div className="space-y-4 w-full h-full flex flex-col min-h-0">
            <BannerFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filterStatus={filterStatus}
              onFilterChange={setFilterStatus}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              stats={stats}
            />

            <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-xs flex flex-col justify-between overflow-hidden p-2 sm:p-4 min-h-0">
              <BannerTable
                banners={paginatedBanners}
                totalFilteredCount={filteredBanners.length}
                isLoading={isLoading}
                viewMode={viewMode}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onEdit={openEditModal}
                onDelete={handleDeleteBanner}
                onToggleStatus={handleToggleStatus}
                onReorder={handleReorder}
              />
            </div>
          </div>
        }
      />

      <BannerFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveBanner}
        onSaveAsTemplate={handleSaveAsTemplate}
        editingBanner={editingBanner}
      />
    </>
  );
}

export default Banners;
