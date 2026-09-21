import { useState, useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth";
import type { AppNotification } from "@/features/notifications/services/notification.service";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Search, 
  Bell, 
  User, 
  X,
  GraduationCap,
  ClipboardCheck,
  Calendar,
  Image as ImageIcon,
  Tag,
  Inbox,
  BookOpen
} from "lucide-react";

export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  // State for responsive sidebar behavior
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [notificationsCount, setNotificationsCount] = useState<number>(3);

  // Monitor screen width for mobile breakpoint (< 900px)
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 900;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch unread notifications count & poll for new
  const [toasts, setToasts] = useState<AppNotification[]>([]);
  
  useEffect(() => {
    let active = true;
    let lastChecked = new Date().toISOString();

    const fetchNotifications = async () => {
      const { notificationService } = await import("@/features/notifications/services/notification.service");
      const res = await notificationService.getMyNotifications();
      if (!active) return;
      
      const unread = res.filter((n) => !n.isRead);
      setNotificationsCount(unread.length);
      
      // Check for new since last poll
      const newNotifs = unread.filter(n => n.createdAt > lastChecked);
      if (newNotifs.length > 0) {
        setToasts(prev => [...prev, ...newNotifs]);
        // Update last checked
        lastChecked = new Date().toISOString();
      }
    };

    // Initial fetch
    fetchNotifications();

    // Polling every 15s
    const interval = setInterval(fetchNotifications, 15000);
    
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [location.pathname]);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userRole = (user?.role || "ADMIN").toUpperCase();

  // Navigation items based strictly on RBAC Role
  const allMenuItems = [
    { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} />, roles: ["ADMIN", "COORDENACAO", "SECRETARIA", "PROFESSOR", "TI"] },
    { label: "Atendimento & Contatos", path: "/dashboard/atendimento", icon: <Inbox size={20} />, roles: ["ADMIN", "COORDENACAO", "SECRETARIA", "TI"] },
    { label: "Agenda Escolar", path: "/dashboard/agenda", icon: <Calendar size={20} />, roles: ["ADMIN", "COORDENACAO", "SECRETARIA", "TI"] },
    { label: "Materiais", path: "/dashboard/materiais", icon: <BookOpen size={20} />, roles: ["ADMIN", "COORDENACAO", "SECRETARIA", "TI"] },
    { label: "Banners Portal", path: "/dashboard/banners", icon: <ImageIcon size={20} />, roles: ["ADMIN", "COORDENACAO", "TI"] },
    { label: userRole === "PROFESSOR" ? "Minhas Postagens" : "Postagens", path: "/dashboard/posts", icon: <FileText size={20} />, roles: ["ADMIN", "COORDENACAO", "PROFESSOR", "TI"] },
    { label: "Fila de Revisão", path: "/dashboard/revisao", icon: <ClipboardCheck size={20} />, roles: ["ADMIN", "COORDENACAO", "TI"] },
    { label: "Tags & Categorias", path: "/dashboard/tags", icon: <Tag size={20} />, roles: ["ADMIN", "COORDENACAO", "TI"] },
    { label: "Notificações", path: "/dashboard/notificacoes", icon: <Bell size={20} />, roles: ["ADMIN", "COORDENACAO", "SECRETARIA", "PROFESSOR", "TI"] },
    { label: "Usuários", path: "/dashboard/usuarios", icon: <Users size={20} />, roles: ["ADMIN", "TI"] },
    { label: "Logs de Auditoria", path: "/dashboard/logs", icon: <Settings size={20} />, roles: ["ADMIN", "TI"] },
  ];

  const menuItems = allMenuItems.filter((item) => item.roles.includes(userRole));

  // Footer navigation items (Settings, Suporte, Logout)
  const footerItems = [
    { 
      label: "Settings", 
      icon: <Settings size={20} />, 
      action: () => navigate("/dashboard/settings")
    },
    { 
      label: "Suporte", 
      icon: <HelpCircle size={20} />, 
      action: () => alert("Central de Suporte CSFA: suporte@csfa.com.br")
    },
    { 
      label: "Logout", 
      icon: <LogOut size={20} />, 
      action: handleLogout,
      isDanger: true
    },
  ];

  // Determine current page title dynamically
  const getPageTitle = () => {
    const current = menuItems.find(item => {
      if (item.path === "/dashboard") return location.pathname === "/dashboard";
      return location.pathname.startsWith(item.path);
    });
    return current ? current.label : "Dashboard";
  };

  // Is sidebar effectively expanded right now?
  const isSidebarExpanded = isMobile ? isMobileOpen : isHovered;

  return (
    <div className="min-h-screen bg-[#f3f5f8] flex font-sans text-[#0f1e36] antialiased selection:bg-[#44abff]/20">
      
      {/* Mobile Backdrop Overlay */}
      {isMobile && isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-[#0f1e36]/40 backdrop-blur-xs z-40 transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* ASIDE BAR (SIDEBAR) */}
      {/* Positioned fixed so it overlays over content without pushing main layout */}
      <aside
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
        className={`fixed top-0 left-0 bottom-0 z-50 bg-white border-r border-gray-200/80 flex flex-col justify-between transition-all duration-300 ease-in-out shadow-[4px_0_24px_rgba(15,30,54,0.06)] ${
          isSidebarExpanded 
            ? "w-64" 
            : isMobile 
              ? "-translate-x-full w-64" // hidden on mobile until logo click toggles it
              : "w-[76px]" // collapsed desktop state (icons only)
        } ${isMobile && isMobileOpen ? "translate-x-0" : ""}`}
      >
        {/* TOP OF ASIDE: LOGO ONLY */}
        <div className="h-20 flex items-center px-4.5 border-b border-gray-100 justify-between">
          <button 
            onClick={() => {
              if (isMobile) {
                setIsMobileOpen(!isMobileOpen);
              }
            }}
            className="flex items-center gap-3 text-left focus:outline-none group w-full"
            title={isMobile ? "Alternar Menu" : "Colégio São Francisco de Assis"}
          >
            {/* CSFA Official Logo Icon / SVG Badge */}
            <div className="w-10 h-10 rounded-2xl bg-[#0f1e36] text-white flex items-center justify-center font-bold shadow-md shadow-[#0f1e36]/15 group-hover:scale-105 transition-transform shrink-0 border border-[#44abff]/30 relative overflow-hidden">
              <img 
                src="/logo-white.svg" 
                alt="CSFA Logo" 
                className="w-7 h-7 object-contain"
                onError={(e) => {
                  // Fallback icon if svg image fails to load
                  e.currentTarget.style.display = 'none';
                }}
              />
              <GraduationCap size={20} className="text-[#44abff] hidden [img[style*='display: none']~&]:block" />
            </div>

            {/* Logo Text (only visible when expanded) */}
            <div className={`overflow-hidden transition-all duration-200 ${isSidebarExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"}`}>
              <span className="font-black text-base tracking-tight text-[#0f1e36] whitespace-nowrap block leading-none">
                CSFA
              </span>
              <span className="text-[10px] font-bold text-[#44abff] uppercase tracking-wider block mt-0.5 whitespace-nowrap">
                São Francisco de Assis
              </span>
            </div>
          </button>

          {/* Close button on mobile expanded drawer */}
          {isMobile && isMobileOpen && (
            <button 
              onClick={() => setIsMobileOpen(false)} 
              className="p-1.5 rounded-lg text-gray-400 hover:text-[#0f1e36] hover:bg-gray-100 transition-colors shrink-0"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* MIDDLE OF ASIDE: NAVIGATION LINKS */}
        <nav className="flex-1 py-6 px-3.5 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = item.path === "/dashboard" 
              ? location.pathname === "/dashboard"
              : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => isMobile && setIsMobileOpen(false)}
                className={`flex items-center gap-3.5 px-3.5 py-3 rounded-2xl transition-all duration-200 group relative ${
                  isActive
                    ? "bg-[#0f1e36] text-white shadow-md shadow-[#0f1e36]/15 font-semibold"
                    : "text-gray-500 hover:bg-[#44abff]/10 hover:text-[#0f1e36]"
                }`}
                title={!isSidebarExpanded ? item.label : undefined}
              >
                <div className={`shrink-0 flex items-center justify-center ${isActive ? "text-[#44abff]" : "text-gray-500 group-hover:text-[#44abff]"}`}>
                  {item.icon}
                </div>

                <span className={`text-sm whitespace-nowrap transition-all duration-200 overflow-hidden ${
                  isSidebarExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"
                }`}>
                  {item.label}
                </span>

                {/* Tooltip hint when collapsed on desktop */}
                {!isSidebarExpanded && !isMobile && (
                  <div className="absolute left-full ml-3 px-2.5 py-1 bg-[#0f1e36] text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap shadow-lg">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* FOOTER OF ASIDE: SETTINGS, SUPORTE, LOGOUT ONLY */}
        <div className="p-3.5 border-t border-gray-100 space-y-1.5 bg-gray-50/50">
          {footerItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                if (isMobile) setIsMobileOpen(false);
                item.action();
              }}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 group relative ${
                item.isDanger
                  ? "text-red-500 hover:bg-red-50 hover:text-red-600"
                  : "text-gray-500 hover:bg-[#44abff]/10 hover:text-[#0f1e36]"
              }`}
              title={!isSidebarExpanded ? item.label : undefined}
            >
              <div className="shrink-0 flex items-center justify-center">
                {item.icon}
              </div>

              <span className={`text-sm whitespace-nowrap transition-all duration-200 overflow-hidden ${
                isSidebarExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"
              }`}>
                {item.label}
              </span>

              {!isSidebarExpanded && !isMobile && (
                <div className="absolute left-full ml-3 px-2.5 py-1 bg-[#0f1e36] text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap shadow-lg">
                  {item.label}
                </div>
              )}
            </button>
          ))}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      {/* On desktop (>= 900px), left padding pl-[76px] ensures content is offset correctly and sidebar opens over top */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen min-[900px]:h-screen overflow-y-auto min-[900px]:overflow-hidden transition-all duration-300 min-[900px]:pl-[76px]">
        
        {/* FIXED MAIN MENU / HEADER BAR */}
        <header className="shrink-0 z-30 bg-[#f3f5f8]/90 backdrop-blur-md border-b border-gray-200/70 py-2.5 px-4 sm:px-6 min-[900px]:px-8">
          <div className="max-w-7xl w-full mx-auto flex items-center justify-between gap-4">
            
            {/* Left section: Mobile Logo / Toggle + Current Page Name */}
            <div className="flex items-center gap-3 min-w-0">
              {/* Mobile Logo Button to toggle Aside bar (< 900px) */}
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="min-[900px]:hidden w-9 h-9 rounded-2xl bg-[#0f1e36] text-[#44abff] flex items-center justify-center shrink-0 shadow-xs hover:bg-[#0f1e36]/90 transition-colors border border-[#44abff]/30 p-1.5"
                title="Abrir Menu"
              >
                <img src="/logo-white.svg" alt="CSFA Logo" className="w-full h-full object-contain" />
              </button>

              {/* Current Page Title & Subtitle */}
              <div>
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-[#0f1e36] truncate leading-tight">
                  {getPageTitle()}
                </h1>
                <p className="text-[10px] font-semibold text-[#44abff] hidden sm:block">
                  Colégio São Francisco de Assis — Painel Administrativo
                </p>
              </div>
            </div>

            {/* Center Section: Search Bar (Centered on desktop) */}
            <div className="flex-1 max-w-sm mx-4 hidden md:block">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Search size={15} />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white text-xs pl-9 pr-4 py-2 rounded-full border border-gray-200/80 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#44abff]/30 focus:border-[#44abff] placeholder:text-gray-400 transition-all text-[#0f1e36]"
                />
              </div>
            </div>

            {/* Right section: Mobile Search + User Icon + Notifications */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              
              {/* Mobile Search input */}
              <div className="relative max-w-[130px] md:hidden">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400">
                  <Search size={14} />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white text-xs pl-7 pr-3 py-1 rounded-full border border-gray-200/80 focus:outline-none focus:ring-2 focus:ring-[#44abff]/30 text-[#0f1e36]"
                />
              </div>

              {/* Notification Icon */}
              <button 
                onClick={() => navigate("/dashboard/notificacoes")}
                className="relative w-8.5 h-8.5 rounded-full bg-white border border-gray-200/80 shadow-xs flex items-center justify-center text-[#0f1e36] hover:text-[#44abff] hover:bg-gray-50 transition-colors shrink-0"
                title="Central de Notificações"
              >
                <Bell size={16} />
                {notificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#44abff] ring-2 ring-white" />
                )}
              </button>

              {/* User Icon / Avatar */}
              <button 
                className="flex items-center gap-2 p-1 pl-1 pr-2 sm:pr-2.5 bg-white border border-gray-200/80 shadow-xs rounded-full hover:bg-gray-50 transition-colors shrink-0"
                title="Perfil do Usuário CSFA"
              >
                <div className="w-7 h-7 rounded-full bg-[#0f1e36] text-[#44abff] flex items-center justify-center font-bold text-xs shadow-xs border border-[#44abff]/20">
                  <User size={14} />
                </div>
                <span className="hidden sm:inline text-xs font-bold text-[#0f1e36]">
                  {user?.firstName ? `${user.firstName} ${user.lastName ?? ""}`.trim() : "Admin CSFA"}
                </span>
              </button>
            </div>

          </div>
        </header>

        {/* OUTLET PAGE CONTAINER (Centralized aligned with header container) */}
        <main className="flex-1 overflow-y-auto min-[900px]:overflow-hidden flex flex-col p-4 sm:p-6 min-[900px]:py-6 max-w-7xl w-full mx-auto min-h-0">
          <Outlet />
        </main>
      </div>

      {/* TOASTS / POPUPS FOR NEW NOTIFICATIONS */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div 
            key={`toast-${toast.id}`} 
            className="pointer-events-auto bg-white rounded-2xl shadow-xl shadow-[#0f1e36]/10 border border-[#44abff]/30 p-4 w-[340px] animate-in slide-in-from-top-10 fade-in duration-300 relative"
          >
            <button 
              onClick={() => removeToast(toast.id)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={14} />
            </button>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0f1e36] text-white flex items-center justify-center shrink-0">
                <Bell size={14} className="text-[#44abff]" />
              </div>
              <div className="space-y-1 pr-4">
                <div className="text-xs font-bold text-[#0f1e36] leading-tight line-clamp-2">
                  {toast.title}
                </div>
                <div className="text-[10px] text-gray-500 font-medium">
                  {toast.sender?.firstName ? `Enviado por ${toast.sender.firstName}` : "Aviso Institucional"}
                </div>
                <div className="text-[11px] text-gray-600 leading-snug line-clamp-2 mt-1">
                  {toast.message}
                </div>
                <button 
                  onClick={() => {
                    removeToast(toast.id);
                    navigate("/dashboard/notificacoes");
                  }}
                  className="mt-2 text-[10px] font-bold text-[#44abff] hover:text-[#0f1e36] transition-colors"
                >
                  Ver Notificação
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
