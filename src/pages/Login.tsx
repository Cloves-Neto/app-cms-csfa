import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, LoginForm, type LoginInput } from "@/features/auth";

/**
 * Página de Login.
 * Orquestra o fluxo de autenticação e delega UI ao LoginForm e estado ao AuthContext.
 */
export function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLoginSubmit = async (credentials: LoginInput) => {
    setErrorMessage(null);
    try {
      await login(credentials);
      navigate("/dashboard");
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Falha ao realizar login");
    }
  };

  return (
    <div className="w-full">
      <LoginForm
        onSubmit={handleLoginSubmit}
        isLoading={isLoading}
        errorMessage={errorMessage}
      />
    </div>
  );
}

export default Login;
