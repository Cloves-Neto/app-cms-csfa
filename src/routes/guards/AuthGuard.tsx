import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth";

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f5f8]">
        <div className="w-8 h-8 rounded-full border-3 border-[#0f1e36] border-t-[#44abff] animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated && process.env.NODE_ENV === "production") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
