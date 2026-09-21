import { useState, useEffect, useMemo, useCallback } from "react";
import { tagService, TagService } from "../services/tag.service";
import type { CreateTagInput, TagItem, TagStats } from "../types/tag.types";

interface UseTagsOptions {
  service?: TagService;
  itemsPerPage?: number;
}

export function useTags(options: UseTagsOptions = {}) {
  const service = options.service ?? tagService;
  const itemsPerPage = options.itemsPerPage ?? 6;

  const [tags, setTags] = useState<TagItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingTag, setEditingTag] = useState<TagItem | null>(null);

  const loadTags = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await service.getAll();
      setTags(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao carregar tags");
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  useEffect(() => {
    loadTags();
  }, [loadTags]);

  const stats: TagStats = useMemo(() => {
    const active = tags.filter((t) => t.isActive).length;
    const totalUsage = tags.reduce((acc, t) => acc + t.usageCount, 0);
    return {
      total: tags.length,
      active,
      inactive: tags.length - active,
      totalUsage,
    };
  }, [tags]);

  const filteredTags = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return tags.filter((t) => {
      const matchesSearch =
        !query ||
        t.name.toLowerCase().includes(query) ||
        t.slug.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query);

      if (filterStatus === "active") return matchesSearch && t.isActive;
      if (filterStatus === "inactive") return matchesSearch && !t.isActive;
      return matchesSearch;
    });
  }, [tags, searchQuery, filterStatus]);

  const totalPages = Math.ceil(filteredTags.length / itemsPerPage) || 1;
  const paginatedTags = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTags.slice(start, start + itemsPerPage);
  }, [filteredTags, currentPage, itemsPerPage]);

  const openCreateModal = useCallback(() => {
    setEditingTag(null);
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((tag: TagItem) => {
    setEditingTag(tag);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingTag(null);
  }, []);

  const handleSaveTag = useCallback(
    async (data: CreateTagInput) => {
      if (editingTag) {
        const updated = await service.update(editingTag.id, data);
        setTags((prev) => prev.map((t) => (t.id === editingTag.id ? updated : t)));
      } else {
        const created = await service.create(data);
        setTags((prev) => [...prev, created]);
      }
      closeModal();
    },
    [editingTag, service, closeModal]
  );

  const handleDeleteTag = useCallback(
    async (id: string | number) => {
      await service.delete(id);
      setTags((prev) => prev.filter((t) => t.id !== id));
    },
    [service]
  );

  const handleToggleStatus = useCallback(
    async (id: string | number) => {
      const updated = await service.toggleStatus(id);
      setTags((prev) => prev.map((t) => (t.id === id ? updated : t)));
    },
    [service]
  );

  return {
    tags,
    filteredTags,
    paginatedTags,
    stats,
    isLoading,
    error,
    searchQuery,
    filterStatus,
    currentPage,
    totalPages,
    itemsPerPage,
    isModalOpen,
    editingTag,
    setSearchQuery: (q: string) => {
      setSearchQuery(q);
      setCurrentPage(1);
    },
    setFilterStatus: (s: "all" | "active" | "inactive") => {
      setFilterStatus(s);
      setCurrentPage(1);
    },
    setCurrentPage,
    refetch: loadTags,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSaveTag,
    handleDeleteTag,
    handleToggleStatus,
  };
}
