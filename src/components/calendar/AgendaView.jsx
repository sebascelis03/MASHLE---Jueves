import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import { TaskCard } from '../tasks/TaskCard';
import { useAuthGroup } from '../../context/AuthGroupContext';
import { CheckSquare, Clock, AlertTriangle, Plus, LayoutGrid, List } from 'lucide-react';

export const AgendaView = () => {
  const { 
    filteredTasks, 
    subjects, 
    filterSubject, 
    setFilterSubject,
    setIsTaskModalOpen,
    setEditingTask,
    tasks,
    getMyProgress
  } = useTasks();

  const { isAdmin } = useAuthGroup();

  // Modo de visualización: 'scrum' (Tablero Scrum) o 'list' (Lista)
  const [viewMode, setViewMode] = useState('scrum');
  // Filtro personal del estudiante: 'all' | 'my_pending' | 'my_done'
  const [personalFilter, setPersonalFilter] = useState('all');

  const total = tasks.length;
  const pendingCount = tasks.filter(t => t.estado === 'pendiente').length;
  const inProgressCount = tasks.filter(t => t.estado === 'en_progreso').length;
  const completedCount = tasks.filter(t => t.estado === 'finalizada').length;

  const handleCreateNew = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  // Filtrado final aplicando también el estado individual si está activo
  const displayedTasks = filteredTasks.filter(task => {
    if (personalFilter === 'all') return true;
    const progress = getMyProgress(task.id);
    if (personalFilter === 'my_done') return progress.realizada;
    if (personalFilter === 'my_pending') return !progress.realizada;
    return true;
  });

  const pendingTasks = displayedTasks.filter(t => t.estado === 'pendiente');
  const inProgressTasks = displayedTasks.filter(t => t.estado === 'en_progreso');
  const completedTasks = displayedTasks.filter(t => t.estado === 'finalizada');

  return (
    <section className="agenda-section" aria-label="Lista y progresión de tareas escolares">
      {/* Resumen Métrico Accesible */}
      <div className="stats-row" role="region" aria-label="Resumen de estado de tareas">
        <div className="stat-card">
          <span className="stat-label">Total Tareas</span>
          <span className="stat-value">{total}</span>
        </div>
        <div className="stat-card stat-pending">
          <span className="stat-label">
            <Clock size={14} aria-hidden="true" /> Pendientes
          </span>
          <span className="stat-value">{pendingCount}</span>
        </div>
        <div className="stat-card stat-progress">
          <span className="stat-label">
            <AlertTriangle size={14} aria-hidden="true" /> En Progreso
          </span>
          <span className="stat-value">{inProgressCount}</span>
        </div>
        <div className="stat-card stat-completed">
          <span className="stat-label">
            <CheckSquare size={14} aria-hidden="true" /> Finalizadas
          </span>
          <span className="stat-value">{completedCount}</span>
        </div>
      </div>

      {/* Barra de Filtros y Selector de Vista Scrum / Lista */}
      <div className="card filters-card" role="search" aria-label="Filtros de tareas">
        <div className="filters-group">
          {/* Selector Vista Scrum vs Lista */}
          <div className="view-mode-toggle" role="group" aria-label="Selector de visualización">
            <button
              type="button"
              className={`btn btn-sm ${viewMode === 'scrum' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('scrum')}
              aria-pressed={viewMode === 'scrum'}
              aria-label="Ver en modo Tablero Scrum"
              title="Modo Tablero Scrum (Columnas)"
            >
              <LayoutGrid size={15} aria-hidden="true" />
              <span>Tablero Scrum</span>
            </button>
            <button
              type="button"
              className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('list')}
              aria-pressed={viewMode === 'list'}
              aria-label="Ver en modo Lista de Tareas"
              title="Modo Lista"
            >
              <List size={15} aria-hidden="true" />
              <span>Lista</span>
            </button>
          </div>

          <div className="filter-item">
            <label htmlFor="filter-subject-select" className="sr-only">Filtrar por materia</label>
            <select
              id="filter-subject-select"
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="select btn-sm"
              aria-label="Filtrar por materia escolar"
            >
              <option value="todas">Todas las Materias ({subjects.length})</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.nombre}</option>
              ))}
            </select>
          </div>

          {/* Filtro personal de estudiante */}
          <div className="filter-item">
            <label htmlFor="filter-personal-select" className="sr-only">Filtrar por mi progreso personal</label>
            <select
              id="filter-personal-select"
              value={personalFilter}
              onChange={(e) => setPersonalFilter(e.target.value)}
              className="select btn-sm"
              aria-label="Filtrar por mi seguimiento personal"
            >
              <option value="all">Todo mi seguimiento</option>
              <option value="my_pending">✗ Solo mis tareas pendientes</option>
              <option value="my_done">✓ Solo mis tareas realizadas</option>
            </select>
          </div>
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={handleCreateNew}
            className="btn btn-sm btn-primary"
            aria-label="Crear nueva tarea escolar (Atajo Alt + N)"
          >
            <Plus size={16} aria-hidden="true" />
            <span>Nueva Tarea (Alt + N)</span>
          </button>
        )}
      </div>

      {/* Contenido según la vista elegida */}
      {displayedTasks.length === 0 ? (
        <div className="card empty-tasks-card" role="status">
          <p style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>
            🎉 No hay tareas que coincidan con los filtros seleccionados.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.5rem 0 1rem' }}>
            {isAdmin
              ? 'Puedes agregar una nueva tarea o cambiar el criterio de búsqueda.'
              : 'Cambia el criterio de búsqueda o espera a que el administrador publique nuevas tareas.'}
          </p>
          {isAdmin && (
            <button
              type="button"
              onClick={handleCreateNew}
              className="btn btn-primary"
            >
              <Plus size={16} aria-hidden="true" />
              <span>Crear una tarea ahora</span>
            </button>
          )}
        </div>
      ) : viewMode === 'scrum' ? (
        /* Tablero Scrum de 3 Columnas */
        <div className="scrum-board-grid" role="region" aria-label="Tablero Scrum de tareas">
          {/* Columna 1: Pendientes */}
          <div className="scrum-column" role="region" aria-label={`Columna Pendientes con ${pendingTasks.length} tareas`}>
            <div className="scrum-column-header col-pending">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} aria-hidden="true" />
                <h3 className="scrum-column-title">Por Realizar (Pendientes)</h3>
              </div>
              <span className="badge badge-pending">{pendingTasks.length}</span>
            </div>
            <div className="scrum-column-cards">
              {pendingTasks.length === 0 ? (
                <div className="scrum-empty-state">No hay tareas pendientes</div>
              ) : (
                pendingTasks.map(task => (
                  <TaskCard key={task.id} task={task} subject={subjects.find(s => s.id === task.materiaId)} />
                ))
              )}
            </div>
          </div>

          {/* Columna 2: En Progreso */}
          <div className="scrum-column" role="region" aria-label={`Columna En Progreso con ${inProgressTasks.length} tareas`}>
            <div className="scrum-column-header col-progress">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={16} aria-hidden="true" />
                <h3 className="scrum-column-title">En Progreso</h3>
              </div>
              <span className="badge badge-progress">{inProgressTasks.length}</span>
            </div>
            <div className="scrum-column-cards">
              {inProgressTasks.length === 0 ? (
                <div className="scrum-empty-state">No hay tareas en progreso</div>
              ) : (
                inProgressTasks.map(task => (
                  <TaskCard key={task.id} task={task} subject={subjects.find(s => s.id === task.materiaId)} />
                ))
              )}
            </div>
          </div>

          {/* Columna 3: Finalizadas */}
          <div className="scrum-column" role="region" aria-label={`Columna Finalizadas con ${completedTasks.length} tareas`}>
            <div className="scrum-column-header col-completed">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckSquare size={16} aria-hidden="true" />
                <h3 className="scrum-column-title">Finalizadas</h3>
              </div>
              <span className="badge badge-completed">{completedTasks.length}</span>
            </div>
            <div className="scrum-column-cards">
              {completedTasks.length === 0 ? (
                <div className="scrum-empty-state">No hay tareas finalizadas</div>
              ) : (
                completedTasks.map(task => (
                  <TaskCard key={task.id} task={task} subject={subjects.find(s => s.id === task.materiaId)} />
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Vista de Lista Tradicional */
        <div className="tasks-list" role="feed" aria-busy="false" aria-label="Tareas escolares en lista">
          {displayedTasks.map(task => {
            const subject = subjects.find(s => s.id === task.materiaId);
            return (
              <TaskCard key={task.id} task={task} subject={subject} />
            );
          })}
        </div>
      )}

      <style>{`
        .agenda-section {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .stats-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 0.75rem;
        }
        .stat-card {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-normal);
          border-radius: var(--radius-lg);
          padding: 0.85rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .stat-label {
          font-size: 0.82rem;
          color: var(--text-muted);
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .stat-value {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.02em;
        }
        .stat-pending .stat-value { color: var(--status-pending-text); }
        .stat-progress .stat-value { color: var(--status-progress-text); }
        .stat-completed .stat-value { color: var(--status-completed-text); }

        .filters-card {
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .filters-group {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.65rem;
        }
        .view-mode-toggle {
          display: flex;
          gap: 0.35rem;
          background-color: var(--bg-surface-elevated);
          padding: 0.2rem;
          border-radius: var(--radius-md);
        }
        .filter-item {
          display: flex;
          align-items: center;
        }
        .tasks-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .empty-tasks-card {
          padding: 3rem 1.5rem;
          text-align: center;
        }

        /* Estilos del Tablero Scrum */
        .scrum-board-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));
          gap: 1.25rem;
          align-items: flex-start;
        }
        .scrum-column {
          background-color: var(--bg-surface-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-xl);
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          min-height: 250px;
        }
        .scrum-column-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 0.65rem;
          border-bottom: 1px solid var(--border-subtle);
        }
        .scrum-column-title {
          font-size: 1rem;
          margin: 0;
          font-weight: 700;
        }
        .col-pending { color: var(--status-pending-text); }
        .col-progress { color: var(--status-progress-text); }
        .col-completed { color: var(--status-completed-text); }

        .scrum-column-cards {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
        .scrum-empty-state {
          padding: 2rem 1rem;
          text-align: center;
          color: var(--text-muted);
          font-size: 0.85rem;
          border: 1.5px dashed var(--border-normal);
          border-radius: var(--radius-md);
        }
      `}</style>
    </section>
  );
};
