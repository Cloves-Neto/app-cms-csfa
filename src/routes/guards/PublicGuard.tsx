import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth";

interface PublicGuardProps {
  children: ReactNode;
}

export function PublicGuard({ children }: PublicGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f5f8]">
        <div className="w-8 h-8 rounded-full border-3 border-[#0f1e36] border-t-[#44abff] animate-spin" />
      </div>
    );
  }

  if (isAuthenticated && process.env.NODE_ENV === "production") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
