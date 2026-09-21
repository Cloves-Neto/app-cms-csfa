import { useState, useEffect, useCallback } from "react";
import { dashboardService, DashboardService } from "../services/dashboard.service";
import type { DashboardArticleItem, DashboardEventGroup, DashboardMetrics } from "../types/dashboard.types";

interface UseDashboardOptions {
  service?: DashboardService;
}

export function useDashboard(options: UseDashboardOptions = {}) {
  const service = options.service ?? dashboardService;

  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalPosts: 6,
    activeBanners: 4,
    upcomingEventsCount: 5,
    activeUsers: 4,
    pendingSubmissions: 0,
  });
  const [eventGroups, setEventGroups] = useState<DashboardEventGroup[]>([]);
  const [recentArticles, setRecentArticles] = useState<DashboardArticleItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Notification Modal State
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState<boolean>(false);
  const [isSendingNotification, setIsSendingNotification] = useState<boolean>(false);

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [m, events, articles] = await Promise.all([
        service.getMetrics(),
        service.getUpcomingEvents(),
        service.getRecentArticles(),
      ]);
      setMetrics(m);
      setEventGroups(events);
      setRecentArticles(articles);
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleSendNotification = useCallback(
    async (data: { title: string; message: string }) => {
      setIsSendingNotification(true);
      try {
        await service.sendNotification(data);
        setIsNotifyModalOpen(false);
      } finally {
        setIsSendingNotification(false);
      }
    },
    [service]
  );

  return {
    metrics,
    eventGroups,
    recentArticles,
    isLoading,
    isNotifyModalOpen,
    isSendingNotification,
    setIsNotifyModalOpen,
    handleSendNotification,
    refetch: loadDashboardData,
  };
}
