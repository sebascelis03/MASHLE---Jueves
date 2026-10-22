import React, { useState } from 'react';
import { useAuthGroup } from '../../context/AuthGroupContext';
import { useTasks } from '../../context/TaskContext';
import { useA11y } from '../../context/A11yContext';
import { Shield, UserPlus, Users, MessageCircle, Plus, Check, X, Crown, LogOut } from 'lucide-react';

export const GroupAdminPanel = () => {
  const { 
    currentGroup, 
    isAdmin, 
    approveJoinRequest, 
    rejectJoinRequest, 
    setIsSuccessionModalOpen,
    transferAdminRoleAndLeave
  } = useAuthGroup();

  const { subjects, saveSubject } = useTasks();
  const { announce } = useA11y();

  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectDocente, setNewSubjectDocente] = useState('');
  const [newSubjectWhatsapp, setNewSubjectWhatsapp] = useState('');
  const [newSubjectColor, setNewSubjectColor] = useState('#2563eb');
  const [showSubjectForm, setShowSubjectForm] = useState(false);

  if (!isAdmin || !currentGroup) {
    return (
      <div className="card" role="status" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
        <Shield size={36} color="#94a3b8" style={{ marginBottom: '0.75rem' }} />
        <h2 style={{ fontSize: '1.25rem' }}>Panel Reservado para el Administrador del Grupo</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '450px', margin: '0.5rem auto 0' }}>
          Actualmente eres un estudiante miembro en esta comunidad escolar. Solo el administrador asignado puede gestionar solicitudes, miembros y configuración de materias.
        </p>
      </div>
    );
  }

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;

    saveSubject({
      nombre: newSubjectName.trim(),
      docente: newSubjectDocente.trim() || 'Docente Titular',
      whatsappUrl: newSubjectWhatsapp.trim() || 'https://chat.whatsapp.com/',
      color: newSubjectColor
    });

    setNewSubjectName('');
    setNewSubjectDocente('');
    setNewSubjectWhatsapp('');
    setShowSubjectForm(false);
  };

  return (
    <div className="admin-panel-container" role="region" aria-label="Panel de Administración del Grupo">
      {/* Tarjeta de Información General */}
      <div className="card admin-info-card">
        <div className="admin-header-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="admin-badge-icon" aria-hidden="true">
              <Crown size={22} color="#eab308" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', margin: 0 }}>Administración: {currentGroup.nombre}</h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Código de invitación: <strong style={{ color: 'var(--text-main)', letterSpacing: '0.05em' }}>{currentGroup.codigoInvitacion}</strong>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsSuccessionModalOpen(true)}
            className="btn btn-sm btn-secondary"
            aria-label="Ceder administración de este grupo"
          >
            <Crown size={15} aria-hidden="true" />
            <span>Ceder Rol de Administrador</span>
          </button>
        </div>
      </div>

      <div className="admin-grid-layout">
        {/* Solicitudes Pendientes */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <UserPlus size={18} color="#3b82f6" aria-hidden="true" />
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>
              Solicitudes de Acceso ({currentGroup.solicitudesPendientes?.length || 0})
            </h3>
          </div>

          {(!currentGroup.solicitudesPendientes || currentGroup.solicitudesPendientes.length === 0) ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
              No hay solicitudes pendientes de aprobación en este momento.
            </p>
          ) : (
            <div className="applicants-list">
              {currentGroup.solicitudesPendientes.map(applicant => (
                <div key={applicant.id} className="applicant-item">
                  <div>
                    <strong>{applicant.nombre}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{applicant.email}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      type="button"
                      onClick={() => approveJoinRequest(applicant.id)}
                      className="btn btn-sm btn-primary"
                      aria-label={`Aprobar solicitud de acceso de ${applicant.nombre}`}
                      title="Aprobar solicitud"
                    >
                      <Check size={14} aria-hidden="true" />
                      <span>Aprobar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => rejectJoinRequest(applicant.id)}
                      className="btn btn-sm btn-secondary"
                      aria-label={`Rechazar solicitud de acceso de ${applicant.nombre}`}
                      title="Rechazar solicitud"
                    >
                      <X size={14} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Miembros Actuales */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Users size={18} color="#10b981" aria-hidden="true" />
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>
              Estudiantes en la Comunidad ({currentGroup.miembros?.length || 0})
            </h3>
          </div>

          <div className="members-list">
            {currentGroup.miembros?.map(member => (
              <div key={member.id} className="member-item">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <strong>{member.nombre}</strong>
                    {member.rol === 'admin' && (
                      <span className="badge badge-pending" style={{ fontSize: '0.7rem' }}>
                        Admin
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{member.email}</div>
                </div>

                {member.rol !== 'admin' && (
                  <button
                    type="button"
                    onClick={() => transferAdminRoleAndLeave(member.id)}
                    className="btn btn-sm btn-secondary"
                    aria-label={`Transferir rol de administrador a ${member.nombre}`}
                    title="Ceder administración a este miembro"
                  >
                    <Crown size={13} aria-hidden="true" />
                    <span>Hacer Admin</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gestión de Materias y Enlaces de WhatsApp */}
      <div className="card" style={{ marginTop: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageCircle size={18} color="#25d366" aria-hidden="true" />
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>
              Materias Escolares y Enlaces Directos de WhatsApp
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setShowSubjectForm(prev => !prev)}
            className="btn btn-sm btn-primary"
            aria-label="Agregar nueva materia al grupo"
          >
            <Plus size={15} aria-hidden="true" />
            <span>Agregar Materia</span>
          </button>
        </div>

        {showSubjectForm && (
          <form onSubmit={handleAddSubject} className="subject-form-box">
            <h4 style={{ fontSize: '0.95rem', margin: '0 0 0.75rem' }}>➕ Nueva Materia para el Grupo</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              <div>
                <label htmlFor="subj-nombre-input" className="label">Nombre de Materia *</label>
                <input
                  id="subj-nombre-input"
                  type="text"
                  className="input"
                  placeholder="Ej. Redes y Comunicaciones"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="subj-docente-input" className="label">Docente</label>
                <input
                  id="subj-docente-input"
                  type="text"
                  className="input"
                  placeholder="Ej. Mg. Juan Pérez"
                  value={newSubjectDocente}
                  onChange={(e) => setNewSubjectDocente(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="subj-whatsapp-input" className="label">Enlace de Grupo WhatsApp</label>
                <input
                  id="subj-whatsapp-input"
                  type="url"
                  className="input"
                  placeholder="https://chat.whatsapp.com/..."
                  value={newSubjectWhatsapp}
                  onChange={(e) => setNewSubjectWhatsapp(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="subj-color-input" className="label">Color Distintivo</label>
                <input
                  id="subj-color-input"
                  type="color"
                  className="input"
                  style={{ height: '42px', padding: '4px' }}
                  value={newSubjectColor}
                  onChange={(e) => setNewSubjectColor(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setShowSubjectForm(false)}
                className="btn btn-sm btn-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-sm btn-primary"
              >
                Guardar Materia
              </button>
            </div>
          </form>
        )}

        <div className="subjects-table-wrap">
          <table className="subjects-table" aria-label="Tabla de materias y grupos de WhatsApp">
            <thead>
              <tr>
                <th scope="col">Materia</th>
                <th scope="col">Docente</th>
                <th scope="col">Acceso Rápido a WhatsApp</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map(s => (
                <tr key={s.id}>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: s.color }} aria-hidden="true" />
                      {s.nombre}
                    </span>
                  </td>
                  <td>{s.docente}</td>
                  <td>
                    {s.whatsappUrl ? (
                      <a
                        href={s.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-whatsapp"
                        aria-label={`Acceder al chat de WhatsApp de ${s.nombre}`}
                      >
                        <MessageCircle size={14} aria-hidden="true" />
                        <span>Abrir Grupo</span>
                      </a>
                    ) : (
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Sin enlace</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .admin-panel-container {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .admin-info-card {
          border-left: 5px solid #eab308;
        }
        .admin-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .admin-badge-icon {
          background: rgba(234, 179, 8, 0.15);
          padding: 0.65rem;
          border-radius: var(--radius-md);
        }
        .admin-grid-layout {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.25rem;
        }
        .applicants-list, .members-list {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .applicant-item, .member-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.65rem 0.85rem;
          background-color: var(--bg-surface-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          gap: 0.75rem;
        }
        .subject-form-box {
          background: var(--bg-surface-elevated);
          border: 1.5px solid var(--border-normal);
          border-radius: var(--radius-md);
          padding: 1rem;
          margin-bottom: 1rem;
        }
        .subjects-table-wrap {
          overflow-x: auto;
        }
        .subjects-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }
        .subjects-table th, .subjects-table td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid var(--border-subtle);
        }
        .subjects-table th {
          color: var(--text-secondary);
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      `}</style>
    </div>
  );
};
