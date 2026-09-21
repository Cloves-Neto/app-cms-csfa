import { useState, useEffect, useMemo, useCallback } from "react";
import { userService, UserService } from "../services/user.service";
import type { CreateUserInput, UserItem, UserStats, UserStatus } from "../types/user.types";

interface UseUsersOptions {
  service?: UserService;
  itemsPerPage?: number;
}

export function useUsers(options: UseUsersOptions = {}) {
  const service = options.service ?? userService;
  const itemsPerPage = options.itemsPerPage ?? 5;

  const [users, setUsers] = useState<UserItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | UserStatus>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Estados de Modais
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState<boolean>(false);
  const [resetPasswordTargetUser, setResetPasswordTargetUser] = useState<UserItem | null>(null);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await service.getAll();
      setUsers(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao carregar usuários");
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Estatísticas calculadas
  const stats: UserStats = useMemo(() => {
    const active = users.filter((u) => u.status === "active").length;
    const businessHours = users.filter((u) => u.accessSchedule === "business_hours").length;
    const blocked = users.filter((u) => u.status === "blocked").length;
    return {
      total: users.length,
      active,
      businessHours,
      blocked,
    };
  }, [users]);

  // Filtragem
  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query);

      const matchesStatus = statusFilter === "all" || user.status === statusFilter;
      const matchesRole =
        roleFilter === "all" ||
        user.role.toLowerCase().includes(roleFilter.toLowerCase()) ||
        user.systemRole?.toLowerCase() === roleFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, searchQuery, statusFilter, roleFilter]);

  // Paginação
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  // Abertura / Fechamento de Modais
  const openCreateModal = useCallback(() => {
    setEditingUser(null);
    setIsFormModalOpen(true);
  }, []);

  const openEditModal = useCallback((user: UserItem) => {
    setEditingUser(user);
    setIsFormModalOpen(true);
  }, []);

  const closeFormModal = useCallback(() => {
    setIsFormModalOpen(false);
    setEditingUser(null);
  }, []);

  const openResetPasswordModal = useCallback((user: UserItem) => {
    setResetPasswordTargetUser(user);
    setIsResetPasswordModalOpen(true);
  }, []);

  const closeResetPasswordModal = useCallback(() => {
    setIsResetPasswordModalOpen(false);
    setResetPasswordTargetUser(null);
  }, []);

  // Handlers de Ações
  const handleSaveUser = useCallback(
    async (data: CreateUserInput) => {
      if (editingUser) {
        const updated = await service.update(editingUser.id, data);
        setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? updated : u)));
      } else {
        const created = await service.create(data);
        setUsers((prev) => [created, ...prev]);
      }
      closeFormModal();
    },
    [editingUser, service, closeFormModal]
  );

  const handleDeleteUser = useCallback(
    async (id: string | number) => {
      await service.delete(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    },
    [service]
  );

  const handleToggleStatus = useCallback(
    async (id: string | number, newStatus: UserStatus) => {
      const updated = await service.toggleStatus(id, newStatus);
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    },
    [service]
  );

  const handleResetPassword = useCallback(
    async (userId: string | number, newPass: string) => {
      await service.resetPassword(userId, newPass);
      closeResetPasswordModal();
    },
    [service, closeResetPasswordModal]
  );

  return {
    users,
    filteredUsers,
    paginatedUsers,
    stats,
    isLoading,
    error,
    searchQuery,
    statusFilter,
    roleFilter,
    currentPage,
    totalPages,
    itemsPerPage,
    isFormModalOpen,
    editingUser,
    isResetPasswordModalOpen,
    resetPasswordTargetUser,
    setSearchQuery: (q: string) => {
      setSearchQuery(q);
      setCurrentPage(1);
    },
    setStatusFilter: (s: "all" | UserStatus) => {
      setStatusFilter(s);
      setCurrentPage(1);
    },
    setRoleFilter: (r: string) => {
      setRoleFilter(r);
      setCurrentPage(1);
    },
    setCurrentPage,
    refetch: loadUsers,
    openCreateModal,
    openEditModal,
    closeFormModal,
    openResetPasswordModal,
    closeResetPasswordModal,
    handleSaveUser,
    handleDeleteUser,
    handleToggleStatus,
    handleResetPassword,
  };
}
