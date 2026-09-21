import { useState, useEffect, useMemo, useCallback } from "react";
import { postService, PostService } from "../services/post.service";
import type { Post, PostFilterStatus, PostStats } from "../types/post.types";

interface UsePostsOptions {
  service?: PostService;
  itemsPerPage?: number;
}

/**
 * Custom Hook para orquestrar o estado e operações de Postagens na UI.
 * Isola completamente a lógica de filtros, busca, paginação e mutações da View.
 */
export function usePosts(options: UsePostsOptions = {}) {
  const service = options.service ?? postService;
  const itemsPerPage = options.itemsPerPage ?? 5;

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<PostFilterStatus>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Carregamento inicial de posts
  const loadPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await service.getAll();
      setPosts(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao carregar postagens");
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // Estatísticas calculadas
  const stats: PostStats = useMemo(() => {
    const published = posts.filter((p) => p.published || p.status === "Publicado").length;
    const draft = posts.filter((p) => !p.published || p.status === "Rascunho").length;
    return {
      total: posts.length,
      published,
      draft,
    };
  }, [posts]);

  // Filtros de busca e status aplicados
  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesSearch =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query);

      const isPublished = post.published || post.status === "Publicado";
      if (filterStatus === "published") return matchesSearch && isPublished;
      if (filterStatus === "draft") return matchesSearch && !isPublished;
      return matchesSearch;
    });
  }, [posts, searchQuery, filterStatus]);

  // Paginação aplicada sobre os posts filtrados
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage) || 1;
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPosts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPosts, currentPage, itemsPerPage]);

  // Handlers de interação
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback((status: PostFilterStatus) => {
    setFilterStatus(status);
    setCurrentPage(1);
  }, []);

  const handleToggleStatus = useCallback(
    async (id: string | number) => {
      try {
        const updated = await service.toggleStatus(id);
        setPosts((prev) => prev.map((p) => (String(p.id) === String(id) ? updated : p)));
      } catch (err: unknown) {
        // Atualização otimista caso falhe
        setPosts((prev) =>
          prev.map((p) =>
            String(p.id) === String(id)
              ? {
                  ...p,
                  published: !p.published,
                  status: p.status === "Publicado" ? "Rascunho" : "Publicado",
                }
              : p
          )
        );
      }
    },
    [service]
  );

  const handleDeletePost = useCallback(
    async (id: string | number) => {
      try {
        await service.delete(id);
        setPosts((prev) => prev.filter((p) => String(p.id) !== String(id)));
      } catch (err: unknown) {
        setPosts((prev) => prev.filter((p) => String(p.id) !== String(id)));
      }
    },
    [service]
  );

  return {
    posts,
    filteredPosts,
    paginatedPosts,
    stats,
    isLoading,
    error,
    searchQuery,
    filterStatus,
    currentPage,
    totalPages,
    itemsPerPage,
    refetch: loadPosts,
    handleSearchChange,
    handleFilterChange,
    setCurrentPage,
    handleToggleStatus,
    handleDeletePost,
  };
}
