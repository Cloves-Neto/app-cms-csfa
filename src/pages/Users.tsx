import WrapPages from "@/layouts/WrapPages";
import {
  useUsers,
  UserHeader,
  UserFilters,
  UserTable,
  UserFormModal,
  ResetPasswordModal,
} from "@/features/users";

export function Users() {
  const {
    users,
    paginatedUsers,
    filteredUsers,
    stats,
    isLoading,
    searchQuery,
    statusFilter,
    roleFilter,
    currentPage,
    itemsPerPage,
    isFormModalOpen,
    editingUser,
    isResetPasswordModalOpen,
    resetPasswordTargetUser,
    setSearchQuery,
    setStatusFilter,
    setRoleFilter,
    setCurrentPage,
    openCreateModal,
    openEditModal,
    closeFormModal,
    openResetPasswordModal,
    closeResetPasswordModal,
    handleSaveUser,
    handleDeleteUser,
    handleToggleStatus,
    handleResetPassword,
  } = useUsers();

  const coordinators = users.filter((u) => u.systemRole === "COORDENACAO" && u.status === "active");

  return (
    <>
      <WrapPages
        header={<UserHeader onNewUserClick={openCreateModal} />}
        content={
          <div className="space-y-4 w-full h-full flex flex-col min-h-0">
            <UserFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              roleFilter={roleFilter}
              onRoleFilterChange={setRoleFilter}
              stats={stats}
            />

            <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-xs flex flex-col justify-between overflow-hidden p-2 sm:p-4 min-h-0">
              <UserTable
                users={paginatedUsers}
                totalFilteredCount={filteredUsers.length}
                isLoading={isLoading}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onEdit={openEditModal}
                onResetPassword={openResetPasswordModal}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDeleteUser}
              />
            </div>
          </div>
        }
      />

      <UserFormModal
        isOpen={isFormModalOpen}
        onClose={closeFormModal}
        onSave={handleSaveUser}
        editingUser={editingUser}
        coordinators={coordinators}
      />

      <ResetPasswordModal
        isOpen={isResetPasswordModalOpen}
        onClose={closeResetPasswordModal}
        user={resetPasswordTargetUser}
        onConfirmReset={handleResetPassword}
      />
    </>
  );
}

export default Users;
