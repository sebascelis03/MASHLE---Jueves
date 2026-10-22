import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import { useA11y } from '../../context/A11yContext';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalIcon } from 'lucide-react';

export const CalendarGrid = () => {
  const { tasks, selectedDate, setSelectedDate, setIsTaskModalOpen, setEditingTask } = useTasks();
  const { announce } = useA11y();

  const [currentMonthDate, setCurrentMonthDate] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const daysOfWeek = [
    { short: 'Lun', full: 'Lunes' },
    { short: 'Mar', full: 'Martes' },
    { short: 'Mié', full: 'Miércoles' },
    { short: 'Jue', full: 'Jueves' },
    { short: 'Vie', full: 'Viernes' },
    { short: 'Sáb', full: 'Sábado' },
    { short: 'Dom', full: 'Domingo' }
  ];

  // Cálculo de días del mes
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Ajustar a Lunes = 0
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const totalDaysInPrevMonth = new Date(year, month, 0).getDate();

  const prevMonth = () => {
    const prev = new Date(year, month - 1, 1);
    setCurrentMonthDate(prev);
    announce(`Mes cambiado a ${monthNames[prev.getMonth()]} de ${prev.getFullYear()}`, 'polite');
  };

  const nextMonth = () => {
    const next = new Date(year, month + 1, 1);
    setCurrentMonthDate(next);
    announce(`Mes cambiado a ${monthNames[next.getMonth()]} de ${next.getFullYear()}`, 'polite');
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonthDate(new Date(today.getFullYear(), today.getMonth(), 1));
    const pad = (n) => String(n).padStart(2, '0');
    const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
    setSelectedDate(todayStr);
    announce(`Seleccionado el día de hoy, ${today.toLocaleDateString()}`, 'polite');
  };

  const handleDaySelect = (dayNum) => {
    const pad = (n) => String(n).padStart(2, '0');
    const dateStr = `${year}-${pad(month + 1)}-${pad(dayNum)}`;
    setSelectedDate(dateStr);

    const dayTasks = tasks.filter(t => t.fechaEntrega === dateStr);
    const countMsg = dayTasks.length === 1 ? '1 tarea pendiente' : `${dayTasks.length} tareas`;
    announce(`Seleccionado día ${dayNum} de ${monthNames[month]}. ${countMsg}.`, 'polite');
  };

  const handleNewTaskForSelected = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const pad = (n) => String(n).padStart(2, '0');
  const todayObj = new Date();
  const todayStr = `${todayObj.getFullYear()}-${pad(todayObj.getMonth() + 1)}-${pad(todayObj.getDate())}`;

  return (
    <div className="card calendar-container" role="region" aria-label="Calendario de registro y tareas escolares">
      {/* Encabezado del Calendario */}
      <div className="calendar-header">
        <div className="calendar-title-group">
          <CalIcon size={22} className="cal-icon-accent" aria-hidden="true" />
          <h2 id="calendar-month-heading" className="calendar-heading">
            {monthNames[month]} {year}
          </h2>
        </div>

        <div className="calendar-nav-buttons">
          <button
            type="button"
            onClick={goToToday}
            className="btn btn-sm btn-secondary"
            aria-label="Ir a la fecha de hoy"
          >
            Hoy
          </button>
          <button
            type="button"
            onClick={prevMonth}
            className="btn btn-sm btn-secondary"
            aria-label={`Mes anterior: ${monthNames[(month + 11) % 12]}`}
            title="Mes anterior"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={nextMonth}
            className="btn btn-sm btn-secondary"
            aria-label={`Mes siguiente: ${monthNames[(month + 1) % 12]}`}
            title="Mes siguiente"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Días de la semana */}
      <div className="calendar-grid days-header" role="row">
        {daysOfWeek.map((day, idx) => (
          <div 
            key={idx} 
            className="day-name-cell"
            role="columnheader" 
            aria-label={day.full}
          >
            <span aria-hidden="true">{day.short}</span>
          </div>
        ))}
      </div>

      {/* Celdas del calendario */}
      <div className="calendar-grid days-body" role="grid" aria-labelledby="calendar-month-heading">
        {/* Días del mes previo (inactivos) */}
        {Array.from({ length: firstDayIndex }).map((_, i) => {
          const prevDayNum = totalDaysInPrevMonth - firstDayIndex + i + 1;
          return (
            <div key={`prev-${i}`} className="day-cell inactive" aria-hidden="true">
              <span className="day-number">{prevDayNum}</span>
            </div>
          );
        })}

        {/* Días del mes actual */}
        {Array.from({ length: totalDaysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const dateStr = `${year}-${pad(month + 1)}-${pad(dayNum)}`;
          const isSelected = selectedDate === dateStr;
          const isToday = todayStr === dateStr;
          const dayTasks = tasks.filter(t => t.fechaEntrega === dateStr);
          const hasPending = dayTasks.some(t => t.estado === 'pendiente');
          const hasInProgress = dayTasks.some(t => t.estado === 'en_progreso');
          const hasCompleted = dayTasks.some(t => t.estado === 'finalizada');

          return (
            <button
              key={`day-${dayNum}`}
              type="button"
              onClick={() => handleDaySelect(dayNum)}
              className={`day-cell active-cell ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
              role="gridcell"
              aria-selected={isSelected}
              aria-label={`${dayNum} de ${monthNames[month]} de ${year}. ${dayTasks.length} tareas registradas. ${isToday ? 'Es hoy.' : ''}`}
            >
              <span className="day-number">{dayNum}</span>

              {/* Indicadores visuales y accesibles de tareas */}
              {dayTasks.length > 0 && (
                <div className="task-indicators-container" aria-hidden="true">
                  <span className="task-count-pill">{dayTasks.length}</span>
                  <div className="task-dots-row">
                    {hasPending && <span className="dot dot-pending" title="Pendiente" />}
                    {hasInProgress && <span className="dot dot-progress" title="En progreso" />}
                    {hasCompleted && <span className="dot dot-completed" title="Finalizada" />}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Barra de acción rápida para el día seleccionado */}
      <div className="calendar-selected-bar">
        <span>Fecha seleccionada: <strong>{selectedDate}</strong></span>
        <button
          type="button"
          onClick={handleNewTaskForSelected}
          className="btn btn-sm btn-primary"
          aria-label={`Crear nueva tarea para el día ${selectedDate}`}
        >
          <Plus size={16} aria-hidden="true" />
          <span>Nueva Tarea aquí</span>
        </button>
      </div>

      <style>{`
        .calendar-container {
          padding: 1.25rem;
        }
        .calendar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .calendar-title-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .cal-icon-accent {
          color: var(--primary-500);
        }
        .calendar-heading {
          font-size: 1.35rem;
          margin: 0;
          color: var(--text-main);
        }
        .calendar-nav-buttons {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .days-header {
          margin-bottom: 0.5rem;
        }
        .day-name-cell {
          text-align: center;
          font-weight: 700;
          font-size: 0.8rem;
          color: var(--text-secondary);
          padding: 0.35rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .day-cell {
          min-height: 85px;
          background-color: var(--bg-surface-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          text-align: left;
          color: var(--text-main);
          cursor: pointer;
          transition: border-color var(--transition-fast), background-color var(--transition-fast);
          position: relative;
        }
        .day-cell.inactive {
          opacity: 0.3;
          background-color: transparent;
          cursor: default;
        }
        .day-cell.active-cell:hover {
          border-color: var(--border-focus);
          background-color: var(--bg-surface-hover);
        }
        .day-cell.selected {
          border: 2px solid var(--border-focus);
          box-shadow: 0 0 0 1px var(--border-focus);
          background-color: var(--bg-surface-hover);
        }
        .day-cell.today .day-number {
          background-color: var(--primary-500);
          color: var(--text-inverted);
          width: 26px;
          height: 26px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
        }
        .day-number {
          font-size: 0.9rem;
          font-weight: 700;
        }
        .task-indicators-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          margin-top: auto;
        }
        .task-count-pill {
          font-size: 0.72rem;
          font-weight: 800;
          padding: 1px 6px;
          border-radius: var(--radius-full);
          background-color: var(--bg-surface);
          border: 1px solid var(--border-normal);
        }
        .task-dots-row {
          display: flex;
          gap: 3px;
        }
        .dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }
        .dot-pending { background-color: #f59e0b; }
        .dot-progress { background-color: #3b82f6; }
        .dot-completed { background-color: #10b981; }
        
        .calendar-selected-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 1rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-subtle);
          font-size: 0.9rem;
        }

        @media (max-width: 640px) {
          .day-cell {
            min-height: 55px;
            padding: 0.3rem;
          }
          .task-dots-row { display: none; }
        }
      `}</style>
    </div>
  );
};
