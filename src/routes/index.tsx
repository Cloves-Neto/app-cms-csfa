import { Routes, Route, Navigate } from "react-router-dom";
import { publicRoutes } from "./public.routes";
import { privateRoutes } from "./private.routes";

export function AppRoutes() {
  return (
    <Routes>
      {publicRoutes}
      {privateRoutes}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export { AuthGuard } from "./guards/AuthGuard";
export { PublicGuard } from "./guards/PublicGuard";
