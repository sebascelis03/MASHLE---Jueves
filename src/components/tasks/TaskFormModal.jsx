import React, { useState, useEffect } from 'react';
import { FocusTrap } from '../a11y/FocusTrap';
import { useTasks } from '../../context/TaskContext';
import { useAuthGroup } from '../../context/AuthGroupContext';
import { X, Save, AlertCircle } from 'lucide-react';

export const TaskFormModal = () => {
  const { isTaskModalOpen, setIsTaskModalOpen, editingTask, setEditingTask, subjects, saveTask, selectedDate } = useTasks();
  const { isAdmin } = useAuthGroup();

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [materiaId, setMateriaId] = useState('');
  const [fechaEntrega, setFechaEntrega] = useState(selectedDate);
  const [horaEntrega, setHoraEntrega] = useState('23:59');
  const [estado, setEstado] = useState('pendiente');
  const [prioridad, setPrioridad] = useState('media');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitulo(editingTask.titulo);
      setDescripcion(editingTask.descripcion || '');
      setMateriaId(editingTask.materiaId || (subjects[0]?.id || ''));
      setFechaEntrega(editingTask.fechaEntrega || selectedDate);
      setHoraEntrega(editingTask.horaEntrega || '23:59');
      setEstado(editingTask.estado || 'pendiente');
      setPrioridad(editingTask.prioridad || 'media');
    } else {
      setTitulo('');
      setDescripcion('');
      setMateriaId(subjects[0]?.id || '');
      setFechaEntrega(selectedDate);
      setHoraEntrega('23:59');
      setEstado('pendiente');
      setPrioridad('media');
    }
    setError('');
  }, [editingTask, isTaskModalOpen, selectedDate, subjects]);

  // Solo el administrador del grupo puede crear/editar tareas oficiales
  if (!isTaskModalOpen || !isAdmin) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!titulo.trim()) {
      setError('Por favor escribe el título de la tarea.');
      return;
    }
    if (!fechaEntrega) {
      setError('Por favor selecciona una fecha de entrega.');
      return;
    }

    saveTask({
      id: editingTask?.id,
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      materiaId: materiaId || subjects[0]?.id || 'general',
      fechaEntrega,
      horaEntrega,
      estado,
      prioridad
    });
  };

  const handleClose = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <FocusTrap onClose={handleClose} ariaLabel={editingTask ? "Editar tarea escolar" : "Crear nueva tarea escolar"}>
        <div 
          className="modal-content" 
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.35rem', margin: 0 }}>
              {editingTask ? '✏️ Editar Tarea Escolar' : '➕ Nueva Tarea Escolar'}
            </h2>
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-sm btn-secondary"
              aria-label="Cerrar modal de tarea (Escape)"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          {error && (
            <div 
              role="alert" 
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: '#f87171',
                border: '1px solid #ef4444',
                padding: '0.65rem 1rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem'
              }}
            >
              <AlertCircle size={16} aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label htmlFor="task-titulo-input" className="label">
                <span>Título de la Tarea <span style={{ color: '#ef4444' }}>*</span></span>
              </label>
              <input
                id="task-titulo-input"
                type="text"
                className="input"
                placeholder="Ej. Taller de Algoritmos o Ensayo de Historia"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                autoFocus
                required
              />
            </div>

            <div>
              <label htmlFor="task-materia-select" className="label">
                <span>Materia Asociada</span>
              </label>
              <select
                id="task-materia-select"
                className="select"
                value={materiaId}
                onChange={(e) => setMateriaId(e.target.value)}
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.nombre} ({s.docente})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label htmlFor="task-fecha-input" className="label">
                  <span>Fecha de Entrega <span style={{ color: '#ef4444' }}>*</span></span>
                </label>
                <input
                  id="task-fecha-input"
                  type="date"
                  className="input"
                  value={fechaEntrega}
                  onChange={(e) => setFechaEntrega(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="task-hora-input" className="label">
                  <span>Hora Límite</span>
                </label>
                <input
                  id="task-hora-input"
                  type="time"
                  className="input"
                  value={horaEntrega}
                  onChange={(e) => setHoraEntrega(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label htmlFor="task-estado-select" className="label">
                  <span>Estado de la Tarea</span>
                </label>
                <select
                  id="task-estado-select"
                  className="select"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en_progreso">En Progreso</option>
                  <option value="finalizada">Finalizada</option>
                </select>
              </div>

              <div>
                <label htmlFor="task-prioridad-select" className="label">
                  <span>Prioridad</span>
                </label>
                <select
                  id="task-prioridad-select"
                  className="select"
                  value={prioridad}
                  onChange={(e) => setPrioridad(e.target.value)}
                >
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta (Urgente)</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="task-desc-textarea" className="label">
                <span>Descripción o Notas Adicionales</span>
              </label>
              <textarea
                id="task-desc-textarea"
                className="textarea"
                rows={3}
                placeholder="Detalles sobre entregables, enlaces de apoyo o especificaciones del profesor..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={handleClose}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                <Save size={16} aria-hidden="true" />
                <span>{editingTask ? 'Guardar Cambios' : 'Crear Tarea'}</span>
              </button>
            </div>
          </form>
        </div>
      </FocusTrap>
    </div>
  );
};
