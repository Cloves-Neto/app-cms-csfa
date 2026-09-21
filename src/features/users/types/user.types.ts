/**
 * Tipos e contratos do domínio de Usuários e Gestão de Acessos CSFA.
 * Compatível com o modelo de dados do backend Prisma (`api-csfa`) e necessidades da UI.
 */

export type UserStatus = "active" | "inactive" | "blocked";
export type AccessSchedule = "full" | "business_hours" | "restricted"; // "Livre 24h" vs "Durante Expediente" vs "Restrito"
export type PermissionLevel = "none" | "view" | "editor" | "full";
export type UserRole = "PROFESSOR" | "TI" | "COORDENACAO" | "SECRETARIA" | "ADMIN";

export interface ModulePermission {
  moduleKey: "agenda" | "posts" | "banners" | "tags" | "users";
  moduleName: string;
  level: PermissionLevel;
}

export interface UserItem {
  id: string | number;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  avatar: string;
  role: string;
  systemRole?: UserRole;
  status: UserStatus;
  accessSchedule: AccessSchedule;
  coordinatorId?: string | null;
  lastAccess: string;
  createdAt: string;
  permissions: ModulePermission[];
}

export interface CreateUserInput {
  name: string;
  email: string;
  password?: string;
  role: string;
  systemRole?: UserRole;
  status: UserStatus;
  accessSchedule: AccessSchedule;
  coordinatorId?: string | null;
  avatar?: string;
  permissions: ModulePermission[];
}

export interface UpdateUserInput extends Partial<CreateUserInput> {
  id: string | number;
}

export interface UserStats {
  total: number;
  active: number;
  businessHours: number;
  blocked: number;
}

export interface UserFiltersState {
  searchQuery: string;
  status: "all" | UserStatus;
  roleFilter: string;
  currentPage: number;
  itemsPerPage: number;
}
