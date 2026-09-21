import WrapPages from "@/layouts/WrapPages";
import { useAuth } from "@/features/auth";
import {
  useDashboard,
  DashboardHeader,
  DashboardSummaryCards,
  DashboardUpcomingEvents,
  DashboardRecentArticles,
  DashboardRecentLogs,
  DashboardReviewQueue,
  DashboardTeacherPosts,
  DashboardSkeleton,
  NotifyModal,
} from "@/features/dashboard";

/**
 * Página Principal do Dashboard (Home).
 * Renderiza a visão adequada ao perfil do usuário conectado:
 * ADMIN | COORDENACAO | SECRETARIA | PROFESSOR.
 */
export function DashboardHome() {
  const { user } = useAuth();
  const {
    metrics,
    eventGroups,
    recentArticles,
    isNotifyModalOpen,
    isSendingNotification,
    isLoading,
    setIsNotifyModalOpen,
    handleSendNotification,
  } = useDashboard();

  const role = (user?.role || "ADMIN").toUpperCase();

  if (isLoading) {
    return (
      <WrapPages
        header={<></>}
        content={<DashboardSkeleton />}
      />
    );
  }

  return (
    <>
      <WrapPages
        header={<DashboardHeader onOpenNotifyModal={() => setIsNotifyModalOpen(true)} />}
        actions={<DashboardSummaryCards metrics={metrics} />}
        content={
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-2 gap-4 sm:gap-6 w-full h-full min-h-0">
            {(role === "ADMIN" || role === "TI") && (
              <>
                <DashboardUpcomingEvents eventGroups={eventGroups} />
                <DashboardRecentLogs />
                <DashboardReviewQueue />
                <DashboardRecentArticles articles={recentArticles} />
              </>
            )}

            {role === "COORDENACAO" && (
              <>
                <DashboardReviewQueue />
                <DashboardUpcomingEvents eventGroups={eventGroups} />
              </>
            )}

            {role === "PROFESSOR" && (
              <>
                <DashboardTeacherPosts />
                <DashboardUpcomingEvents eventGroups={eventGroups} />
              </>
            )}

            {role === "SECRETARIA" && (
              <>
                <DashboardUpcomingEvents eventGroups={eventGroups} />
                <DashboardRecentArticles articles={recentArticles} />
              </>
            )}
          </div>
        }
      />

      <NotifyModal
        isOpen={isNotifyModalOpen}
        onClose={() => setIsNotifyModalOpen(false)}
        onSend={handleSendNotification}
        isSending={isSendingNotification}
      />
    </>
  );
}

export default DashboardHome;
