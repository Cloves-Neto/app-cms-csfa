import { Link } from "react-router-dom";
import { FileText, Image as ImageIcon, Calendar, Users, ArrowUpRight, Inbox } from "lucide-react";
import type { DashboardMetrics } from "../types/dashboard.types";

interface DashboardSummaryCardsProps {
  metrics: DashboardMetrics;
}

export function DashboardSummaryCards({ metrics }: DashboardSummaryCardsProps) {
  return (
    <nav className="grid grid-cols-2 lg:grid-cols-5 sm:gap-4 md:gap-6 w-full h-full">
      {/* Posts */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col justify-between group hover:border-[#44abff]/50 transition-all">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-2xl bg-[#44abff]/10 text-[#44abff] flex items-center justify-center border border-[#44abff]/30 shadow-xs">
            <FileText size={18} />
          </div>
          <Link
            to="/dashboard/posts"
            className="p-1.5 rounded-xl text-gray-400 group-hover:text-[#44abff] group-hover:bg-[#44abff]/10 transition-all"
            title="Ver Todas as Postagens"
          >
            <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="mt-3">
          <span className="text-xl sm:text-2xl font-black text-[#0f1e36]">
            {metrics.totalPosts}
          </span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mt-0.5">
            Postagens Publicadas
          </span>
        </div>
      </div>

      {/* Banners */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col justify-between group hover:border-emerald-300 transition-all">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shadow-xs">
            <ImageIcon size={18} />
          </div>
          <Link
            to="/dashboard/banners"
            className="p-1.5 rounded-xl text-gray-400 group-hover:text-emerald-600 group-hover:bg-emerald-50 transition-all"
            title="Gerenciar Banners"
          >
            <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="mt-3">
          <span className="text-xl sm:text-2xl font-black text-emerald-700">
            {metrics.activeBanners}
          </span>
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mt-0.5">
            Banners Ativos na Home
          </span>
        </div>
      </div>

      {/* Agenda */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col justify-between group hover:border-purple-300 transition-all">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200 shadow-xs">
            <Calendar size={18} />
          </div>
          <Link
            to="/dashboard/agenda"
            className="p-1.5 rounded-xl text-gray-400 group-hover:text-purple-600 group-hover:bg-purple-50 transition-all"
            title="Ver Calendário Escolar"
          >
            <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="mt-3">
          <span className="text-xl sm:text-2xl font-black text-purple-700">
            {metrics.upcomingEventsCount}
          </span>
          <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block mt-0.5">
            Eventos Programados
          </span>
        </div>
      </div>

      {/* Users */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col justify-between group hover:border-blue-300 transition-all">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200 shadow-xs">
            <Users size={18} />
          </div>
          <Link
            to="/dashboard/usuarios"
            className="p-1.5 rounded-xl text-gray-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all"
            title="Gerenciar Usuários"
          >
            <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="mt-3">
          <span className="text-xl sm:text-2xl font-black text-blue-700">
            {metrics.activeUsers}
          </span>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block mt-0.5">
            Usuários com Acesso
          </span>
        </div>
      </div>

      {/* Atendimentos Pendentes */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col justify-between group hover:border-amber-300 transition-all">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shadow-xs">
            <Inbox size={18} />
          </div>
          <Link
            to="/dashboard/atendimento"
            className="p-1.5 rounded-xl text-gray-400 group-hover:text-amber-600 group-hover:bg-amber-50 transition-all"
            title="Ver Atendimentos"
          >
            <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="mt-3">
          <span className={`text-xl sm:text-2xl font-black ${metrics.pendingSubmissions > 0 ? "text-amber-600" : "text-amber-700"}`}>
            {metrics.pendingSubmissions}
          </span>
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block mt-0.5">
            Leads Pendentes
          </span>
        </div>
      </div>
    </nav>
  );
}
