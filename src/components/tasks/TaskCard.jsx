import React from 'react';
import { TaskStatusBadge } from './TaskStatusBadge';
import { Calendar, Clock, MessageCircle, Trash2, Edit3 } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export const TaskCard = ({ task, subject }) => {
  const { updateTaskStatus, deleteTask, setEditingTask, setIsTaskModalOpen } = useTasks();

  const handleEdit = () => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleStatusChange = (e) => {
    updateTaskStatus(task.id, e.target.value);
  };

  return (
    <article 
      className="card task-card" 
      aria-labelledby={`task-title-${task.id}`}
      style={{
        borderLeft: subject ? `5px solid ${subject.color}` : '5px solid var(--border-normal)'
      }}
    >
      <div className="task-header">
        <div className="task-title-area">
          {subject && (
            <span className="task-subject-tag" style={{ color: subject.color }}>
              ● {subject.nombre}
            </span>
          )}
          <h3 id={`task-title-${task.id}`} className="task-title">
            {task.titulo}
          </h3>
        </div>

        <TaskStatusBadge estado={task.estado} />
      </div>

      {task.descripcion && (
        <p className="task-description">{task.descripcion}</p>
      )}

      <div className="task-meta">
        <div className="task-meta-item">
          <Calendar size={15} aria-hidden="true" />
          <span>Entrega: <strong>{task.fechaEntrega}</strong></span>
        </div>
        {task.horaEntrega && (
          <div className="task-meta-item">
            <Clock size={15} aria-hidden="true" />
            <span>{task.horaEntrega}</span>
          </div>
        )}
      </div>

      <div className="task-footer">
        {/* Integración con WhatsApp directa (Deep link) */}
        {subject?.whatsappUrl ? (
          <a
            href={subject.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-whatsapp"
            aria-label={`Abrir grupo de WhatsApp para la materia ${subject.nombre} en una nueva pestaña`}
          >
            <MessageCircle size={15} aria-hidden="true" />
            <span>WhatsApp Materia</span>
          </a>
        ) : (
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Sin enlace de WhatsApp</span>
        )}

        <div className="task-actions">
          {/* Selector accesible de cambio de estado rápido */}
          <label htmlFor={`status-select-${task.id}`} className="sr-only">
            Cambiar estado de la tarea {task.titulo}
          </label>
          <select
            id={`status-select-${task.id}`}
            value={task.estado}
            onChange={handleStatusChange}
            className="select btn-sm"
            style={{ width: 'auto', fontWeight: 600 }}
            aria-label={`Cambiar estado de ${task.titulo}`}
          >
            <option value="pendiente">Pendiente</option>
            <option value="en_progreso">En Progreso</option>
            <option value="finalizada">Finalizada</option>
          </select>

          <button
            type="button"
            onClick={handleEdit}
            className="btn btn-sm btn-secondary"
            aria-label={`Editar tarea ${task.titulo}`}
            title="Editar tarea"
          >
            <Edit3 size={15} aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => deleteTask(task.id)}
            className="btn btn-sm btn-danger"
            aria-label={`Eliminar tarea ${task.titulo}`}
            title="Eliminar tarea"
          >
            <Trash2 size={15} aria-hidden="true" />
          </button>
        </div>
      </div>

      <style>{`
        .task-card {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-normal);
          border-radius: var(--radius-lg);
          padding: 1rem 1.25rem;
          transition: transform var(--transition-fast), border-color var(--transition-fast);
        }
        .task-card:hover {
          border-color: var(--border-focus);
          transform: translateY(-2px);
        }
        .task-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 0.75rem;
        }
        .task-subject-tag {
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          display: block;
          margin-bottom: 0.2rem;
        }
        .task-title {
          font-size: 1.05rem;
          margin: 0;
          color: var(--text-main);
        }
        .task-description {
          font-size: 0.9rem;
          color: var(--text-muted);
          line-height: 1.5;
          margin: 0;
        }
        .task-meta {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          font-size: 0.85rem;
          color: var(--text-muted);
          flex-wrap: wrap;
        }
        .task-meta-item {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .task-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-subtle);
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .task-actions {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
      `}</style>
    </article>
  );
};
