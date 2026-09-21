import { createContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { authService, AuthService } from "../services/auth.service";
import type { AuthContextType, LoginInput, UserSession } from "../types/auth.types";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  service?: AuthService;
}

const USER_STORAGE_KEY = "csfa_user_session";

export function AuthProvider({ children, service = authService }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Inicializa sessão a partir do storage
  useEffect(() => {
    const storedToken = service.getStoredToken();
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);

    if (storedToken) {
      setToken(storedToken);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          setUser(null);
        }
      }
    }
    setIsLoading(false);
  }, [service]);

  // Logout automático ao receber evento de 401 emitido pelo HttpClient
  const logout = useCallback(() => {
    service.removeStoredToken();
    localStorage.removeItem(USER_STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, [service]);

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [logout]);

  const login = useCallback(
    async (credentials: LoginInput) => {
      setIsLoading(true);
      try {
        const response = await service.login(credentials);
        setToken(response.token);

        if (response.user) {
          setUser(response.user);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));
        }
      } finally {
        setIsLoading(false);
      }
    },
    [service]
  );

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: Boolean(token),
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
