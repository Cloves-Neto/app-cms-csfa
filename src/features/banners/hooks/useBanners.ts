import { useState, useEffect, useMemo, useCallback } from "react";
import { bannerService, BannerService } from "../services/banner.service";
import type { Banner, BannerStats, CreateBannerInput } from "../types/banner.types";

interface UseBannersOptions {
  service?: BannerService;
  itemsPerPage?: number;
}

export function useBanners(options: UseBannersOptions = {}) {
  const service = options.service ?? bannerService;
  const itemsPerPage = options.itemsPerPage ?? 6;

  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  const loadBanners = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await service.getAll();
      setBanners(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao carregar banners");
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  useEffect(() => {
    loadBanners();
  }, [loadBanners]);

  const stats: BannerStats = useMemo(() => {
    const active = banners.filter((b) => b.isActive).length;
    return {
      total: banners.length,
      active,
      inactive: banners.length - active,
    };
  }, [banners]);

  const filteredBanners = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return banners.filter((b) => {
      const matchesSearch = !query || b.title.toLowerCase().includes(query) || b.targetUrl.toLowerCase().includes(query);
      if (filterStatus === "active") return matchesSearch && b.isActive;
      if (filterStatus === "inactive") return matchesSearch && !b.isActive;
      return matchesSearch;
    });
  }, [banners, searchQuery, filterStatus]);

  const totalPages = Math.ceil(filteredBanners.length / itemsPerPage) || 1;
  const paginatedBanners = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBanners.slice(start, start + itemsPerPage);
  }, [filteredBanners, currentPage, itemsPerPage]);

  const openCreateModal = useCallback(() => {
    setEditingBanner(null);
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((banner: Banner) => {
    setEditingBanner(banner);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingBanner(null);
  }, []);

  const handleSaveBanner = useCallback(
    async (data: CreateBannerInput) => {
      if (editingBanner) {
        const updated = await service.update(editingBanner.id, data);
        setBanners((prev) => prev.map((b) => (b.id === editingBanner.id ? updated : b)));
      } else {
        const created = await service.create(data);
        setBanners((prev) => [...prev, created]);
      }
      closeModal();
    },
    [editingBanner, service, closeModal]
  );

  const handleDeleteBanner = useCallback(
    async (id: string | number) => {
      await service.delete(id);
      setBanners((prev) => prev.filter((b) => b.id !== id));
    },
    [service]
  );

  const handleSaveAsTemplate = useCallback(
    async (data: { title: string; imageUrl: string; targetUrl: string }) => {
      await service.saveTemplate({
        name: data.title,
        imageUrl: data.imageUrl,
        targetUrl: data.targetUrl,
      });
    },
    [service]
  );

  const handleToggleStatus = useCallback(
    async (id: string | number) => {
      const updated = await service.toggleStatus(id);
      setBanners((prev) => prev.map((b) => (b.id === id ? updated : b)));
    },
    [service]
  );

  const handleReorder = useCallback(
    async (id: string | number, direction: "up" | "down") => {
      const reordered = await service.reorder(id, direction);
      setBanners(reordered);
    },
    [service]
  );

  return {
    banners,
    filteredBanners,
    paginatedBanners,
    stats,
    isLoading,
    error,
    searchQuery,
    filterStatus,
    viewMode,
    currentPage,
    totalPages,
    itemsPerPage,
    isModalOpen,
    editingBanner,
    setSearchQuery: (q: string) => {
      setSearchQuery(q);
      setCurrentPage(1);
    },
    setFilterStatus: (s: "all" | "active" | "inactive") => {
      setFilterStatus(s);
      setCurrentPage(1);
    },
    setViewMode,
    setCurrentPage,
    refetch: loadBanners,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSaveBanner,
    handleDeleteBanner,
    handleToggleStatus,
    handleReorder,
    handleSaveAsTemplate,
  };
}
