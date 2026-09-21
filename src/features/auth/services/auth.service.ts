import { httpClient, type HttpClient } from "@/core/http";
import { envConfig } from "@/core/config";
import type {
  AdminResetPasswordInput,
  LoginInput,
  LoginResponse,
  RegisterInput,
  ResetPasswordConfirmInput,
  ResetPasswordRequestInput,
} from "../types/auth.types";

/**
 * Service de Domínio para Autenticação.
 * Encapsula chamadas às rotas de auth do backend CSFA (`/auth/login`, etc.).
 */
export class AuthService {
  private readonly client: HttpClient;
  private readonly tokenKey: string;

  constructor(client: HttpClient = httpClient, tokenKey: string = envConfig.auth.tokenStorageKey) {
    this.client = client;
    this.tokenKey = tokenKey;
  }

  /**
   * Realiza login de usuário contra a API real.
   */
  async login(credentials: LoginInput): Promise<LoginResponse> {
    const response = await this.client.post<any>("/auth/login", credentials);
    const token = response.token || response.data?.token;
    const user = response.user || response.data?.user;

    if (token) {
      this.saveToken(token);
    }

    return {
      token,
      user,
      message: response.message || "Login realizado com sucesso",
    };
  }

  /**
   * Registro de novo usuário com e-mail institucional.
   */
  async register(data: RegisterInput): Promise<{ message: string }> {
    return this.client.post<{ message: string }>("/auth/register", data);
  }

  /**
   * Verificação de e-mail institucional via token.
   */
  async verifyEmail(token: string): Promise<{ message: string }> {
    return this.client.get<{ message: string }>(`/auth/verify-email?token=${encodeURIComponent(token)}`);
  }

  /**
   * Solicitação de redefinição de senha por e-mail.
   */
  async requestPasswordReset(input: ResetPasswordRequestInput): Promise<{ message: string }> {
    return this.client.post<{ message: string }>("/auth/password-reset/request", input);
  }

  /**
   * Confirmação de redefinição de senha com token de recuperação.
   */
  async confirmPasswordReset(input: ResetPasswordConfirmInput): Promise<{ message: string }> {
    return this.client.post<{ message: string }>("/auth/password-reset/confirm", input);
  }

  /**
   * Redefinição direta de senha por administrador TI.
   */
  async adminResetPassword(input: AdminResetPasswordInput): Promise<{ message: string }> {
    return this.client.post<{ message: string }>("/auth/password-reset/admin", input);
  }

  /**
   * Salva o token no storage local.
   */
  saveToken(token: string): void {
    try {
      localStorage.setItem(this.tokenKey, token);
    } catch {
      // Ignora em ambientes restritos
    }
  }

  /**
   * Obtém o token salvo no storage.
   */
  getStoredToken(): string | null {
    try {
      return localStorage.getItem(this.tokenKey);
    } catch {
      return null;
    }
  }

  /**
   * Remove o token do storage local (logout).
   */
  removeStoredToken(): void {
    try {
      localStorage.removeItem(this.tokenKey);
    } catch {
      // Ignora
    }
  }
}

export const authService = new AuthService();
