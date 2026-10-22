import React from 'react';
import { useTasks } from '../../context/TaskContext';
import { TaskCard } from '../tasks/TaskCard';
import { Filter, CheckSquare, Clock, AlertTriangle, Plus } from 'lucide-react';

export const AgendaView = () => {
  const { 
    filteredTasks, 
    subjects, 
    filterStatus, 
    setFilterStatus, 
    filterSubject, 
    setFilterSubject,
    setIsTaskModalOpen,
    setEditingTask,
    tasks
  } = useTasks();

  const total = tasks.length;
  const pendingCount = tasks.filter(t => t.estado === 'pendiente').length;
  const inProgressCount = tasks.filter(t => t.estado === 'en_progreso').length;
  const completedCount = tasks.filter(t => t.estado === 'finalizada').length;

  const handleCreateNew = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

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

      {/* Barra de Filtros Accesibles */}
      <div className="card filters-card" role="search" aria-label="Filtros de tareas">
        <div className="filters-group">
          <Filter size={16} aria-hidden="true" className="filter-icon" />
          
          <div className="filter-item">
            <label htmlFor="filter-status-select" className="sr-only">Filtrar por estado</label>
            <select
              id="filter-status-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="select btn-sm"
              aria-label="Filtrar por estado de tarea"
            >
              <option value="todos">Todos los Estados ({total})</option>
              <option value="pendiente">Solo Pendientes ({pendingCount})</option>
              <option value="en_progreso">Solo En Progreso ({inProgressCount})</option>
              <option value="finalizada">Solo Finalizadas ({completedCount})</option>
            </select>
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
              <option value="todas">Todas las Materias</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCreateNew}
          className="btn btn-sm btn-primary"
          aria-label="Crear nueva tarea escolar (Atajo Alt + N)"
        >
          <Plus size={16} aria-hidden="true" />
          <span>Nueva Tarea (Alt + N)</span>
        </button>
      </div>

      {/* Lista de Tareas */}
      <div className="tasks-list" role="feed" aria-busy="false" aria-label="Tareas escolares">
        {filteredTasks.length === 0 ? (
          <div className="card empty-tasks-card" role="status">
            <p style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>
              🎉 No hay tareas que coincidan con los filtros seleccionados.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.5rem 0 1rem' }}>
              Puedes agregar una nueva tarea o cambiar el criterio de búsqueda.
            </p>
            <button
              type="button"
              onClick={handleCreateNew}
              className="btn btn-primary"
            >
              <Plus size={16} aria-hidden="true" />
              <span>Crear una tarea ahora</span>
            </button>
          </div>
        ) : (
          filteredTasks.map(task => {
            const subject = subjects.find(s => s.id === task.materiaId);
            return (
              <TaskCard key={task.id} task={task} subject={subject} />
            );
          })
        )}
      </div>

      <style>{`
        .agenda-section {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .stats-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 0.75rem;
        }
        .stat-card {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.75rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .stat-label {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .stat-value {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--text-main);
        }
        .stat-pending { border-left: 4px solid var(--status-pending-border); }
        .stat-progress { border-left: 4px solid var(--status-progress-border); }
        .stat-completed { border-left: 4px solid var(--status-completed-border); }
        
        .filters-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .filters-group {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-wrap: wrap;
        }
        .filter-icon {
          color: var(--text-secondary);
        }
        .tasks-list {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }
        .empty-tasks-card {
          text-align: center;
          padding: 3rem 1.5rem;
        }
      `}</style>
    </section>
  );
};
