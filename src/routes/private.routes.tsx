import { Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { DashboardHome } from "@/pages/DashboardHome";
import { Agenda } from "@/pages/Agenda";
import { Banners } from "@/pages/Banners";
import { Tags } from "@/pages/Tags";
import { Users } from "@/pages/Users";
import { PostList } from "@/pages/posts/PostList";
import { ReviewQueuePage } from "@/pages/revisao/ReviewQueue";
import { PostEditorPage } from "@/pages/posts/PostEditor";
import { NotificationsPage } from "@/pages/Notifications";
import { AuditLogsPage } from "@/pages/AuditLogs";
import { SubmissionsPage } from "@/pages/Submissions";
import { AuthGuard } from "./guards/AuthGuard";

import { Materiais } from "@/pages/Materiais";

export const privateRoutes = (
  <Route
    path="/dashboard"
    element={
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    }
  >
    <Route index element={<DashboardHome />} />
    <Route path="agenda" element={<Agenda />} />
    <Route path="materiais" element={<Materiais />} />
    <Route path="banners" element={<Banners />} />
    <Route path="tags" element={<Tags />} />
    <Route path="usuarios" element={<Users />} />
    <Route path="posts" element={<PostList />} />
    <Route path="revisao" element={<ReviewQueuePage />} />
    <Route path="posts/novo" element={<PostEditorPage />} />
    <Route path="posts/editar/:id" element={<PostEditorPage />} />
    <Route path="atendimento" element={<SubmissionsPage />} />
    <Route path="mensagens" element={<SubmissionsPage />} />
    <Route path="notificacoes" element={<NotificationsPage />} />
    <Route path="logs" element={<AuditLogsPage />} />
    <Route path="ti/redefinir-senha" element={<Navigate to="/dashboard/usuarios" replace />} />
  </Route>
);
