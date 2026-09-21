import { Route } from "react-router-dom";
import { AuthLayout } from "@/layouts/AuthLayout";
import { Login } from "@/pages/Login";
import { PublicGuard } from "./guards/PublicGuard";

export const publicRoutes = (
  <Route
    element={
      <PublicGuard>
        <AuthLayout />
      </PublicGuard>
    }
  >
    <Route path="/login" element={<Login />} />
  </Route>
);
