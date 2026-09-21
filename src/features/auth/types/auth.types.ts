/**
 * Tipos e contratos do domínio de Autenticação e Sessão de Usuário.
 * Alinhado com as rotas do backend Express em `api-csfa/src/routers/AuthRouter.ts`.
 */

export type UserRole = "PROFESSOR" | "TI" | "COORDENACAO" | "SECRETARIA" | "ADMIN";

export interface UserSession {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  imageUrl?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user?: UserSession;
  message?: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
}

export interface ResetPasswordRequestInput {
  email: string;
}

export interface ResetPasswordConfirmInput {
  token: string;
  newPassword: string;
}

export interface AdminResetPasswordInput {
  userId: string;
  newPassword: string;
}

export interface AuthContextType {
  user: UserSession | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginInput) => Promise<void>;
  logout: () => void;
}
