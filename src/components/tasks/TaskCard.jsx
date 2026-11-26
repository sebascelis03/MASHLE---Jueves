import React, { useState, useEffect } from 'react';
import { TaskStatusBadge } from './TaskStatusBadge';
import {
  Calendar,
  Clock,
  MessageCircle,
  Trash2,
  Edit3,
  Check,
  X,
  Save,
  Lock,
  Users,
  StickyNote,
  PlayCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { useAuthGroup } from '../../context/AuthGroupContext';

const PRIORITY_CONFIG = {
  alta: {
    label: 'Prioridad Alta',
    shortLabel: '🔥 Alta',
    className: 'badge-danger'
  },
  media: {
    label: 'Prioridad Media',
    shortLabel: '⚡ Media',
    className: 'badge-pending'
  },
  baja: {
    label: 'Prioridad Baja',
    shortLabel: '📌 Baja',
    className: 'badge-progress'
  }
};

export const TaskCard = ({ task, subject }) => {
  const {
    updateTaskStatus,
    deleteTask,
    setEditingTask,
    setIsTaskModalOpen,
    getMyProgress,
    setMyTaskStatus,
    saveMyNotes,
    getTaskCompletion
  } = useTasks();
  const { isAdmin, currentUser } = useAuthGroup();

  const myProgress = getMyProgress(task.id);
  const { done, inProgress, pending, total, membersBreakdown } = getTaskCompletion(task.id);
  const completionPct = total > 0 ? Math.round((done / total) * 100) : 0;

  const [showBreakdown, setShowBreakdown] = useState(false);

  // Borrador local de notas personales (se guarda con el botón)
  const [notesDraft, setNotesDraft] = useState(myProgress.notasPersonales);
  useEffect(() => {
    setNotesDraft(myProgress.notasPersonales);
  }, [myProgress.notasPersonales, currentUser?.id]);

  const notesChanged = notesDraft !== myProgress.notasPersonales;
  const priorityInfo = PRIORITY_CONFIG[task.prioridad || 'media'] || PRIORITY_CONFIG.media;

  const handleEdit = () => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleStatusChange = (e) => {
    updateTaskStatus(task.id, e.target.value);
  };

  const handleSaveNotes = (e) => {
    e.preventDefault();
    saveMyNotes(task.id, notesDraft.trim());
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
          {subject ? (
            <span className="task-subject-tag" style={{ color: subject.color }}>
              ● {subject.nombre}
            </span>
          ) : (
            <span className="task-subject-tag" style={{ color: 'var(--text-secondary)' }}>
              ● General
            </span>
          )}
          <h3 id={`task-title-${task.id}`} className="task-title">
            {task.titulo}
          </h3>
        </div>

        <div className="task-badges">
          {/* Insignia de Prioridad con triple codificación */}
          <span
            className={`badge ${priorityInfo.className}`}
            aria-label={priorityInfo.label}
            title={priorityInfo.label}
          >
            <span>{priorityInfo.shortLabel}</span>
          </span>

          {/* Estado oficial del curso */}
          <TaskStatusBadge estado={task.estado} />

          {/* Estado personal del estudiante: color + ícono + etiqueta */}
          {myProgress.estadoPersonal === 'finalizada' ? (
            <span className="badge badge-completed" role="status" aria-label="Mi seguimiento: realizada">
              <Check size={13} aria-hidden="true" />
              <span>Mi estado: Realizada</span>
            </span>
          ) : myProgress.estadoPersonal === 'en_progreso' ? (
            <span className="badge badge-progress" role="status" aria-label="Mi seguimiento: en progreso">
              <PlayCircle size={13} aria-hidden="true" />
              <span>Mi estado: En Progreso</span>
            </span>
          ) : (
            <span className="badge badge-danger" role="status" aria-label="Mi seguimiento: pendiente por realizar">
              <X size={13} aria-hidden="true" />
              <span>Mi estado: Pendiente</span>
            </span>
          )}
        </div>
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

      {/* Métrica y desglose nominal de cumplimiento del salón (solo administrador) */}
      {isAdmin && (
        <div className="completion-box">
          <div className="completion-top-row">
            <div className="completion-text">
              <Users size={15} aria-hidden="true" />
              <span>
                <strong>{done} de {total}</strong> realizaron · <strong>{inProgress}</strong> en progreso · <strong>{pending}</strong> pendientes
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowBreakdown(prev => !prev)}
              className="btn btn-sm btn-secondary"
              aria-expanded={showBreakdown}
              aria-label={`Ver detalle de cumplimiento por estudiante en ${task.titulo}`}
            >
              <span>{showBreakdown ? 'Ocultar estudiantes' : 'Ver estudiantes'}</span>
              {showBreakdown ? <ChevronUp size={14} aria-hidden="true" /> : <ChevronDown size={14} aria-hidden="true" />}
            </button>
          </div>

          <div className="completion-bar-row">
            <div
              className="completion-bar"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={total}
              aria-valuenow={done}
              aria-valuetext={`${done} de ${total} estudiantes han realizado esta tarea (${completionPct}%)`}
              aria-label={`Cumplimiento del salón en ${task.titulo}`}
            >
              <span style={{ width: `${completionPct}%` }} />
            </div>
            <span className="completion-pct" aria-hidden="true">{completionPct}%</span>
          </div>

          {showBreakdown && (
            <div className="members-breakdown-list" role="region" aria-label={`Estado de estudiantes en ${task.titulo}`}>
              {membersBreakdown.map(member => (
                <div key={member.id} className="member-breakdown-item">
                  <div className="member-breakdown-name">
                    <strong>{member.nombre}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{member.email}</span>
                  </div>
                  <div>
                    {member.estadoPersonal === 'finalizada' ? (
                      <span className="badge badge-completed" style={{ fontSize: '0.72rem' }}>
                        <Check size={12} aria-hidden="true" /> Realizada
                      </span>
                    ) : member.estadoPersonal === 'en_progreso' ? (
                      <span className="badge badge-progress" style={{ fontSize: '0.72rem' }}>
                        <PlayCircle size={12} aria-hidden="true" /> En Progreso
                      </span>
                    ) : (
                      <span className="badge badge-pending" style={{ fontSize: '0.72rem' }}>
                        <AlertTriangle size={12} aria-hidden="true" /> Pendiente
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Seguimiento individual del estudiante (3 estados Scrum + Notas privadas) */}
      {currentUser && (
        <section className="personal-box" aria-labelledby={`personal-${task.id}`}>
          <h4 id={`personal-${task.id}`} className="personal-title">
            <StickyNote size={15} aria-hidden="true" /> Mi seguimiento personal
            <span className="personal-private"><Lock size={12} aria-hidden="true" /> Privado</span>
          </h4>

          <div className="personal-toggle" role="group" aria-label={`Mi estado personal en la tarea ${task.titulo}`}>
            <button
              type="button"
              className={`btn btn-sm ${myProgress.estadoPersonal === 'pendiente' ? 'btn-primary' : 'btn-secondary'}`}
              aria-pressed={myProgress.estadoPersonal === 'pendiente'}
              onClick={() => setMyTaskStatus(task.id, 'pendiente')}
            >
              <Clock size={14} aria-hidden="true" />
              <span>Por realizar</span>
            </button>

            <button
              type="button"
              className={`btn btn-sm ${myProgress.estadoPersonal === 'en_progreso' ? 'btn-primary' : 'btn-secondary'}`}
              aria-pressed={myProgress.estadoPersonal === 'en_progreso'}
              onClick={() => setMyTaskStatus(task.id, 'en_progreso')}
            >
              <PlayCircle size={14} aria-hidden="true" />
              <span>En progreso</span>
            </button>

            <button
              type="button"
              className={`btn btn-sm ${myProgress.estadoPersonal === 'finalizada' ? 'btn-primary' : 'btn-secondary'}`}
              aria-pressed={myProgress.estadoPersonal === 'finalizada'}
              onClick={() => setMyTaskStatus(task.id, 'finalizada')}
            >
              <Check size={14} aria-hidden="true" />
              <span>Ya la realicé</span>
            </button>
          </div>

          <form onSubmit={handleSaveNotes} className="personal-notes">
            <label htmlFor={`notes-${task.id}`} className="label">
              Notas personales (solo tú las ves)
            </label>
            <textarea
              id={`notes-${task.id}`}
              className="textarea"
              rows={2}
              maxLength={1000}
              placeholder="Recordatorios, notas de entrega, enlaces personales..."
              value={notesDraft}
              onChange={(e) => setNotesDraft(e.target.value)}
            />
            <div className="personal-notes-actions">
              <span className="personal-updated">
                {myProgress.fechaActualizacion
                  ? `Actualizado: ${new Date(myProgress.fechaActualizacion).toLocaleString('es-CO')}`
                  : 'Sin cambios guardados'}
              </span>
              <button type="submit" className="btn btn-sm btn-secondary" disabled={!notesChanged}>
                <Save size={14} aria-hidden="true" />
                <span>Guardar nota</span>
              </button>
            </div>
          </form>
        </section>
      )}

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

        {/* Edición oficial: solo el administrador del grupo */}
        {isAdmin && (
          <div className="task-actions">
            <label htmlFor={`status-select-${task.id}`} className="sr-only">
              Cambiar estado oficial de la tarea {task.titulo}
            </label>
            <select
              id={`status-select-${task.id}`}
              value={task.estado}
              onChange={handleStatusChange}
              className="select btn-sm"
              style={{ width: 'auto', fontWeight: 600 }}
              aria-label={`Cambiar estado oficial de ${task.titulo}`}
              title="Estado oficial de la tarea para el salón"
            >
              <option value="pendiente">Oficial: Pendiente</option>
              <option value="en_progreso">Oficial: En Progreso</option>
              <option value="finalizada">Oficial: Finalizada</option>
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
        )}
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
          flex-wrap: wrap;
        }
        .task-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          justify-content: flex-end;
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
        .completion-box {
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
          padding: 0.65rem 0.85rem;
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-normal);
          border-radius: var(--radius-md);
          font-size: 0.84rem;
        }
        .completion-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .completion-text {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--text-main);
        }
        .completion-bar-row {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .completion-bar {
          flex: 1;
          min-width: 120px;
          height: 10px;
          background: var(--bg-app);
          border: 1px solid var(--border-normal);
          border-radius: var(--radius-full);
          overflow: hidden;
        }
        .completion-bar span {
          display: block;
          height: 100%;
          background: var(--status-completed-border);
        }
        .completion-pct { font-weight: 800; color: var(--text-main); }
        .members-breakdown-list {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          margin-top: 0.25rem;
          padding-top: 0.5rem;
          border-top: 1px solid var(--border-subtle);
        }
        .member-breakdown-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          padding: 0.35rem 0.5rem;
          border-radius: var(--radius-sm);
          background: var(--bg-surface);
        }
        .member-breakdown-name {
          display: flex;
          flex-direction: column;
        }
        .personal-box {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          padding: 0.75rem 0.9rem;
          border: 1px dashed var(--border-normal);
          border-radius: var(--radius-md);
          background: var(--bg-surface-subtle);
        }
        .personal-title {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.92rem;
          margin: 0;
        }
        .personal-private {
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
          margin-left: auto;
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--text-muted);
        }
        .personal-toggle { display: flex; flex-wrap: wrap; gap: 0.45rem; }
        .personal-notes { display: flex; flex-direction: column; gap: 0.35rem; }
        .personal-notes-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .personal-updated { font-size: 0.75rem; color: var(--text-muted); }
        .personal-notes .btn:disabled { opacity: 0.55; cursor: not-allowed; }
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
