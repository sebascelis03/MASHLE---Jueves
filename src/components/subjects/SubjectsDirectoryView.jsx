import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import { useAuthGroup } from '../../context/AuthGroupContext';
import { useA11y } from '../../context/A11yContext';
import { FocusTrap } from '../a11y/FocusTrap';
import { 
  BookOpen, 
  MessageCircle, 
  Plus, 
  Edit3, 
  Trash2, 
  Mail, 
  User, 
  ExternalLink, 
  Search, 
  Calendar,
  X,
  Check
} from 'lucide-react';

const SUBJECT_COLORS = [
  { label: 'Azul', value: '#2563eb' },
  { label: 'Morado', value: '#7c3aed' },
  { label: 'Verde', value: '#059669' },
  { label: 'Ámbar', value: '#d97706' },
  { label: 'Rosa', value: '#db2777' },
  { label: 'Cian', value: '#0891b2' }
];

export const SubjectsDirectoryView = () => {
  const { currentGroup, isAdmin } = useAuthGroup();
  const { subjects, saveSubject, deleteSubject, tasks } = useTasks();
  const { announce } = useA11y();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  // Formulario
  const [nombre, setNombre] = useState('');
  const [docente, setDocente] = useState('');
  const [docenteEmail, setDocenteEmail] = useState('');
  const [horarioNotas, setHorarioNotas] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [color, setColor] = useState(SUBJECT_COLORS[0].value);

  const groupSubjects = subjects.filter(s => s.grupoId === currentGroup?.id);

  const filteredSubjects = groupSubjects.filter(s => {
    const term = searchTerm.toLowerCase();
    return (
      (s.nombre || '').toLowerCase().includes(term) ||
      (s.docente || '').toLowerCase().includes(term) ||
      (s.docenteEmail || '').toLowerCase().includes(term)
    );
  });

  const openCreateModal = () => {
    setEditingSubject(null);
    setNombre('');
    setDocente('');
    setDocenteEmail('');
    setHorarioNotas('');
    setWhatsappUrl('https://chat.whatsapp.com/');
    setColor(SUBJECT_COLORS[0].value);
    setIsModalOpen(true);
    announce('Ventana para agregar nueva materia abierta.', 'polite');
  };

  const openEditModal = (subject) => {
    setEditingSubject(subject);
    setNombre(subject.nombre);
    setDocente(subject.docente || '');
    setDocenteEmail(subject.docenteEmail || '');
    setHorarioNotas(subject.horarioNotas || '');
    setWhatsappUrl(subject.whatsappUrl || 'https://chat.whatsapp.com/');
    setColor(subject.color || SUBJECT_COLORS[0].value);
    setIsModalOpen(true);
    announce(`Editando materia ${subject.nombre}.`, 'polite');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSubject(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    saveSubject({
      id: editingSubject?.id,
      nombre: nombre.trim(),
      docente: docente.trim() || 'Docente Titular',
      docenteEmail: docenteEmail.trim(),
      horarioNotas: horarioNotas.trim(),
      whatsappUrl: whatsappUrl.trim() || 'https://chat.whatsapp.com/',
      color
    });

    closeModal();
  };

  const handleDelete = (subject) => {
    if (window.confirm(`¿Estás seguro de eliminar la materia "${subject.nombre}"?`)) {
      if (deleteSubject) {
        deleteSubject(subject.id);
      }
    }
  };

  if (!currentGroup) {
    return (
      <div className="card" role="status" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
        <BookOpen size={36} color="#94a3b8" style={{ marginBottom: '0.75rem' }} />
        <h2 style={{ fontSize: '1.25rem' }}>Sin Comunidad Activa</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '450px', margin: '0.5rem auto 0' }}>
          Únete o crea un grupo estudiantil en la pestaña <strong>Mi Comunidad</strong> para ver las materias y los enlaces de WhatsApp de tu curso.
        </p>
      </div>
    );
  }

  return (
    <div className="subjects-view-container" role="region" aria-label="Directorio de Materias y Grupos de WhatsApp">
      {/* Cabecera del Directorio */}
      <div className="card subjects-hero">
        <div className="subjects-hero-content">
          <div className="subjects-icon-wrap" aria-hidden="true">
            <BookOpen size={28} color="#3b82f6" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', margin: '0.2rem 0' }}>
              Directorio de Materias y Chats de WhatsApp
            </h2>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Comunidad: <strong>{currentGroup.nombre}</strong> · Acceso directo a los grupos de estudio y datos de profesores.
            </p>
          </div>
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={openCreateModal}
            className="btn btn-primary"
            aria-label="Agregar nueva materia al grupo"
          >
            <Plus size={16} aria-hidden="true" />
            <span>Agregar Materia</span>
          </button>
        )}
      </div>

      {/* Barra de Búsqueda Rápida */}
      <div className="card subjects-search-bar" role="search">
        <div className="search-input-wrap">
          <Search size={16} className="search-icon" aria-hidden="true" />
          <input
            type="text"
            className="input with-icon"
            placeholder="Buscar por materia, profesor o correo (ej. Biología, Matemáticas)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Buscar materia o docente"
          />
        </div>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
          {filteredSubjects.length} materia{filteredSubjects.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Cuadrícula de Materias */}
      {filteredSubjects.length === 0 ? (
        <div className="card empty-subjects-card" role="status">
          <p style={{ fontSize: '1.15rem', fontWeight: 600, margin: '0 0 0.5rem' }}>
            {groupSubjects.length === 0 ? '📚 Aún no hay materias registradas en este grupo.' : '🔍 No se encontraron materias que coincidan con la búsqueda.'}
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            {isAdmin 
              ? 'Haz clic en "Agregar Materia" para registrar asignaturas con sus datos y enlace de WhatsApp.'
              : 'El administrador de tu comunidad aún no ha agregado las materias del semestre.'}
          </p>
          {isAdmin && groupSubjects.length === 0 && (
            <button
              type="button"
              onClick={openCreateModal}
              className="btn btn-primary"
              style={{ marginTop: '1rem' }}
            >
              <Plus size={16} aria-hidden="true" />
              <span>Registrar Primera Materia</span>
            </button>
          )}
        </div>
      ) : (
        <div className="subjects-grid">
          {filteredSubjects.map(subject => {
            const subjectTasks = tasks.filter(t => t.materiaId === subject.id);
            const pendingTasksCount = subjectTasks.filter(t => t.estado !== 'finalizada').length;

            return (
              <div 
                key={subject.id} 
                className="card subject-card"
                style={{ borderTop: `5px solid ${subject.color || '#2563eb'}` }}
              >
                <div className="subject-card-header">
                  <div>
                    <h3 className="subject-title">{subject.nombre}</h3>
                    <div className="subject-teacher">
                      <User size={14} aria-hidden="true" />
                      <span>{subject.docente || 'Docente Titular'}</span>
                    </div>
                  </div>

                  <span className="badge badge-progress" style={{ fontSize: '0.75rem' }}>
                    <Calendar size={12} aria-hidden="true" />
                    <span>{pendingTasksCount} pendientes</span>
                  </span>
                </div>

                {/* Datos de contacto del profesor */}
                {subject.docenteEmail && (
                  <div className="subject-contact-row">
                    <Mail size={14} aria-hidden="true" />
                    <a 
                      href={`mailto:${subject.docenteEmail}`}
                      className="teacher-email-link"
                      aria-label={`Enviar correo a ${subject.docente}: ${subject.docenteEmail}`}
                    >
                      {subject.docenteEmail}
                    </a>
                  </div>
                )}

                {subject.horarioNotas && (
                  <p className="subject-notes">{subject.horarioNotas}</p>
                )}

                {/* Botón Principal de WhatsApp */}
                <div className="subject-whatsapp-area">
                  {subject.whatsappUrl ? (
                    <a
                      href={subject.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-whatsapp w-full"
                      aria-label={`Abrir chat de WhatsApp de ${subject.nombre} en una nueva pestaña`}
                    >
                      <MessageCircle size={18} aria-hidden="true" />
                      <span>Abrir Chat de WhatsApp</span>
                      <ExternalLink size={14} aria-hidden="true" />
                    </a>
                  ) : (
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Sin enlace de WhatsApp registrado
                    </span>
                  )}
                </div>

                {/* Acciones de Administrador */}
                {isAdmin && (
                  <div className="subject-admin-actions">
                    <button
                      type="button"
                      onClick={() => openEditModal(subject)}
                      className="btn btn-sm btn-secondary"
                      aria-label={`Editar materia ${subject.nombre}`}
                    >
                      <Edit3 size={14} aria-hidden="true" />
                      <span>Editar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(subject)}
                      className="btn btn-sm btn-danger"
                      aria-label={`Eliminar materia ${subject.nombre}`}
                    >
                      <Trash2 size={14} aria-hidden="true" />
                      <span>Eliminar</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal para Crear / Editar Materia */}
      {isModalOpen && (
        <div className="modal-overlay">
          <FocusTrap
            role="dialog"
            ariaLabel={editingSubject ? "Editar Materia Escolar" : "Registrar Nueva Materia"}
            onClose={closeModal}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">
                  {editingSubject ? "✏️ Editar Materia" : "➕ Registrar Nueva Materia"}
                </h3>
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-close-modal"
                  aria-label="Cerrar ventana de materia"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-group">
                  <label htmlFor="subj-nombre-input" className="label">
                    <span>Nombre de la Materia *</span>
                  </label>
                  <input
                    id="subj-nombre-input"
                    type="text"
                    className="input"
                    placeholder="Ej. Biología Celular, Cálculo Diferencial, etc."
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label htmlFor="subj-docente-input" className="label">
                      <span>Profesor / Docente</span>
                    </label>
                    <input
                      id="subj-docente-input"
                      type="text"
                      className="input"
                      placeholder="Ej. Dra. María González"
                      value={docente}
                      onChange={(e) => setDocente(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="subj-email-input" className="label">
                      <span>Correo del Profesor</span>
                    </label>
                    <input
                      id="subj-email-input"
                      type="email"
                      className="input"
                      placeholder="profesor@ejemplo.com"
                      value={docenteEmail}
                      onChange={(e) => setDocenteEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subj-whatsapp-input" className="label">
                    <span>Enlace al Grupo de WhatsApp de la Materia *</span>
                  </label>
                  <input
                    id="subj-whatsapp-input"
                    type="url"
                    className="input"
                    placeholder="https://chat.whatsapp.com/..."
                    value={whatsappUrl}
                    onChange={(e) => setWhatsappUrl(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subj-notas-input" className="label">
                    <span>Horario o Notas Informativas (Opcional)</span>
                  </label>
                  <textarea
                    id="subj-notas-input"
                    className="textarea"
                    rows={2}
                    placeholder="Ej. Clases martes y jueves 8:00 AM. Aula 204."
                    value={horarioNotas}
                    onChange={(e) => setHorarioNotas(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="label">
                    <span>Color Identificador de la Materia</span>
                  </label>
                  <div className="colors-selector" role="radiogroup" aria-label="Color de la materia">
                    {SUBJECT_COLORS.map(c => (
                      <button
                        key={c.value}
                        type="button"
                        role="radio"
                        aria-checked={color === c.value}
                        aria-label={`Color ${c.label}`}
                        className={`color-btn ${color === c.value ? 'selected' : ''}`}
                        style={{ backgroundColor: c.value }}
                        onClick={() => setColor(c.value)}
                      >
                        {color === c.value && <Check size={14} color="#ffffff" aria-hidden="true" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn btn-secondary"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    {editingSubject ? "Guardar Cambios" : "Crear Materia"}
                  </button>
                </div>
              </form>
            </div>
          </FocusTrap>
        </div>
      )}

      <style>{`
        .subjects-view-container {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .subjects-hero {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          padding: 1.25rem;
        }
        .subjects-hero-content {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }
        .subjects-icon-wrap {
          background: rgba(59, 130, 246, 0.15);
          padding: 0.65rem;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .subjects-search-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          gap: 1rem;
        }
        .search-input-wrap {
          position: relative;
          flex: 1;
          display: flex;
          align-items: center;
        }
        .search-icon {
          position: absolute;
          left: 0.85rem;
          color: var(--text-muted);
          pointer-events: none;
        }
        .empty-subjects-card {
          padding: 3rem 1.5rem;
          text-align: center;
        }
        .subjects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.25rem;
        }
        .subject-card {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          padding: 1.25rem;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-normal);
          border-radius: var(--radius-lg);
          transition: transform var(--transition-fast), border-color var(--transition-fast);
        }
        .subject-card:hover {
          border-color: var(--border-focus);
          transform: translateY(-2px);
        }
        .subject-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 0.5rem;
        }
        .subject-title {
          font-size: 1.15rem;
          margin: 0 0 0.25rem;
          color: var(--text-main);
        }
        .subject-teacher {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .subject-contact-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.84rem;
          color: var(--text-muted);
        }
        .teacher-email-link {
          color: var(--primary-500);
          text-decoration: underline;
        }
        .subject-notes {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin: 0;
          line-height: 1.4;
          background: var(--bg-surface-elevated);
          padding: 0.5rem 0.65rem;
          border-radius: var(--radius-sm);
        }
        .subject-whatsapp-area {
          margin-top: auto;
          padding-top: 0.5rem;
        }
        .w-full {
          width: 100%;
          justify-content: center;
          padding: 0.75rem;
        }
        .subject-admin-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
          padding-top: 0.5rem;
          border-top: 1px solid var(--border-subtle);
        }
        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        .colors-selector {
          display: flex;
          gap: 0.65rem;
        }
        .color-btn {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          border: 2px solid transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform var(--transition-fast);
        }
        .color-btn:hover {
          transform: scale(1.1);
        }
        .color-btn.selected {
          border-color: #ffffff;
          box-shadow: 0 0 0 2px var(--primary-500);
        }
      `}</style>
    </div>
  );
};
