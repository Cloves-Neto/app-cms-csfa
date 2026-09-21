import { useState, type FormEvent } from "react";
import { Lock, Mail, Eye, EyeOff, Loader2, AlertCircle, X, HelpCircle, ArrowRight } from "lucide-react";
import { loginSchema, type LoginFormData } from "../schemas/login.schema";
import type { LoginInput } from "../types/auth.types";

interface LoginFormProps {
  onSubmit: (credentials: LoginInput) => Promise<void>;
  isLoading?: boolean;
  errorMessage?: string | null;
}

export function LoginForm({ onSubmit, isLoading = false, errorMessage }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [localError, setLocalError] = useState<string | null>(null);

  const validateForm = (): LoginFormData | null => {
    setFieldErrors({});
    setLocalError(null);

    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const formattedErrors: { email?: string; password?: string } = {};
      result.error.issues.forEach((err: any) => {
        const field = err.path[0] as "email" | "password";
        if (field && !formattedErrors[field]) {
          formattedErrors[field] = err.message;
        }
      });
      setFieldErrors(formattedErrors);
      return null;
    }

    return result.data;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    const validatedData = validateForm();
    if (!validatedData) return;

    try {
      await onSubmit(validatedData);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Credenciais inválidas. Verifique seu e-mail e senha.";
      setLocalError(message);
    }
  };

  const activeError = errorMessage || localError;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full" noValidate>
      {/* Toast / Alerta de Erro de Credenciais */}
      {activeError && (
        <div className="p-3.5 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200/80 flex items-start gap-2.5 shadow-sm animate-in fade-in slide-in-from-top-1 duration-200">
          <AlertCircle size={17} className="text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold text-red-800">Falha na Autenticação</p>
            <p className="text-red-600 mt-0.5 leading-relaxed font-normal">
              {activeError.includes("401") || activeError.toLowerCase().includes("inval") || activeError.toLowerCase().includes("credencia")
                ? "Credenciais incorretas. Verifique seu e-mail e senha."
                : activeError}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setLocalError(null)}
            className="text-red-400 hover:text-red-600 transition-colors p-0.5"
            title="Fechar alerta"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Input de Login / E-mail */}
      <div className="w-72 mx-auto">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
            <span>Login</span>
            <span title="Utilize seu e-mail institucional cadastrado">
              <HelpCircle size={13} className="text-gray-400 hover:text-gray-600 cursor-help" />
            </span>
          </label>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Mail size={16} />
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldErrors.email) {
                setFieldErrors((prev) => ({ ...prev, email: undefined }));
              }
            }}
            autoComplete="email"
            className={`w-full bg-white pl-10 pr-4 py-2.5 border rounded-xl text-sm transition-all text-[#0f1e36] placeholder-gray-400 focus:outline-none focus:ring-2 ${
              fieldErrors.email
                ? "border-red-400 focus:ring-red-400/30 focus:border-red-500 bg-red-50/20"
                : "border-gray-200 focus:ring-[#44abff]/30 focus:border-[#44abff]"
            } ${isLoading ? "opacity-60 cursor-not-allowed bg-gray-50" : ""}`}
            placeholder="seu.nome@colsaofrancisco.com.br"
            disabled={isLoading}
          />
        </div>
        {fieldErrors.email && (
          <p className="text-red-600 text-xs mt-1.5 font-medium flex items-center gap-1">
            <span>•</span> {fieldErrors.email}
          </p>
        )}
      </div>

      {/* Input de Senha */}
      <div className="w-72 mx-auto mb-12">
        <label className="block text-xs font-bold text-gray-700 mb-1.5">
          Senha
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Lock size={16} />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (fieldErrors.password) {
                setFieldErrors((prev) => ({ ...prev, password: undefined }));
              }
            }}
            autoComplete="current-password"
            className={`w-full bg-white pl-10 pr-11 py-2.5 border rounded-xl text-sm transition-all text-[#0f1e36] placeholder-gray-400 focus:outline-none focus:ring-2 ${
              fieldErrors.password
                ? "border-red-400 focus:ring-red-400/30 focus:border-red-500 bg-red-50/20"
                : "border-gray-200 focus:ring-[#44abff]/30 focus:border-[#44abff]"
            } ${isLoading ? "opacity-60 cursor-not-allowed bg-gray-50" : ""}`}
            placeholder="••••••••"
            disabled={isLoading}
          />
          {/* Botão Único de Visualização de Senha */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors focus:outline-none cursor-pointer"
            tabIndex={-1}
            aria-label={showPassword ? "Ocultar senha" : "Ver senha"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {fieldErrors.password && (
          <p className="text-red-600 text-xs mt-1.5 font-medium flex items-center gap-1">
            <span>•</span> {fieldErrors.password}
          </p>
        )}
      </div>

      {/* Botão de Envio com Blue-Brand e Spinner */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-52 mx-auto bg-[#44abff] hover:bg-[#2993ed] active:bg-[#1a83dd] text-white py-3 rounded-xl font-bold text-sm transition-all duration-200 shadow-md shadow-[#44abff]/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6 cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader2 size={17} className="animate-spin text-white" />
            <span>Autenticando...</span>
          </>
        ) : (
          <>
            <span>Entrar</span>
            <ArrowRight size={16} className="translate-x-0.5" />
          </>
        )}
      </button>


    </form>
  );
}
