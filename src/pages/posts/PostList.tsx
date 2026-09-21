import WrapPages from "@/layouts/WrapPages";
import {
  usePosts,
  PostHeader,
  PostFilters,
  PostTable,
} from "@/features/post";

/**
 * Página de Postagens & Comunicados.
 * Atua puramente como orquestradora e compositora de microcomponentes de domínio.
 * Zero acoplamento com chamadas HTTP diretas ou cálculos de estado interno.
 */
export function PostList() {
  const {
    paginatedPosts,
    filteredPosts,
    stats,
    isLoading,
    searchQuery,
    filterStatus,
    currentPage,
    itemsPerPage,
    handleSearchChange,
    handleFilterChange,
    setCurrentPage,
    handleToggleStatus,
    handleDeletePost,
  } = usePosts();

  return (
    <WrapPages
      header={<PostHeader />}
      content={
        <div className="space-y-4 w-full h-full flex flex-col min-h-0">
          <PostFilters
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            filterStatus={filterStatus}
            onFilterChange={handleFilterChange}
            stats={stats}
          />

          <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-xs flex flex-col justify-between overflow-hidden p-2 sm:p-4 min-h-0">
            <PostTable
              posts={paginatedPosts}
              totalFilteredCount={filteredPosts.length}
              isLoading={isLoading}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDeletePost}
            />
          </div>
        </div>
      }
    />
  );
}

export default PostList;
