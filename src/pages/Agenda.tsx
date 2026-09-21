import { useState } from "react";
import WrapPages from "@/layouts/WrapPages";
import {
  useAgenda,
  agendaService,
  AgendaHeader,
  AgendaStatsCards,
  CalendarMonthView,
  DayEventsDrawer,
  AgendaFormModal,
  AgendaImportModal,
} from "@/features/agenda";

/**
 * Página de Agenda & Calendário Escolar.
 * Orquestra o calendário visual, inserção manual e importação massiva em lote de CSV (até 150MB).
 */
export function Agenda() {
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);

  const {
    currentMonthName,
    selectedDay,
    selectedDayEvents,
    calendarDays,
    stats,
    isEventDrawerOpen,
    isManageModalOpen,
    setIsEventDrawerOpen,
    setIsManageModalOpen,
    handleDayClick,
    handlePrevMonth,
    handleNextMonth,
    handleCreateEvent,
    handleDeleteEvent,
  } = useAgenda();

  const handleDownloadTemplate = async () => {
    try {
      await agendaService.downloadTemplateCsv();
    } catch (e) {
      console.error("Erro ao baixar modelo CSV:", e);
    }
  };

  const handleImportSuccess = () => {
    // Força recarregamento ou atualização suave
    window.location.reload();
  };

  return (
    <>
      <WrapPages
        header={
          <AgendaHeader
            onNewEventClick={() => setIsManageModalOpen(true)}
            onImportCsvClick={() => setIsImportModalOpen(true)}
            onDownloadTemplate={handleDownloadTemplate}
          />
        }
        actions={<AgendaStatsCards stats={stats} />}
        content={
          <div className="w-full h-full bg-white p-4 sm:p-6 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col justify-between overflow-hidden">
            <CalendarMonthView
              currentMonthName={currentMonthName}
              calendarDays={calendarDays}
              selectedDay={selectedDay}
              onDayClick={handleDayClick}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
            />
          </div>
        }
      />

      {/* Drawer de Detalhes dos Eventos do Dia */}
      <DayEventsDrawer
        isOpen={isEventDrawerOpen}
        onClose={() => setIsEventDrawerOpen(false)}
        selectedDay={selectedDay}
        events={selectedDayEvents}
        monthName={currentMonthName}
        onDeleteEvent={handleDeleteEvent}
      />

      {/* Modal de Criação Manual de Evento */}
      <AgendaFormModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        onSave={handleCreateEvent}
        monthName={currentMonthName}
      />

      {/* Modal de Importação de Arquivo CSV (até 150MB) */}
      <AgendaImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={handleImportSuccess}
      />
    </>
  );
}

export default Agenda;
