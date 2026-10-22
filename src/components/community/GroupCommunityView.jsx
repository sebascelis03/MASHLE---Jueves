import React, { useState, useEffect } from 'react';
import { useAuthGroup } from '../../context/AuthGroupContext';
import { Users, Plus, CheckCircle2, ArrowRight, LogOut } from 'lucide-react';

export const GroupCommunityView = () => {
  const { groups, currentGroup, currentUser, isAdmin, requestJoinGroup, createNewGroup, requestLeaveGroup } = useAuthGroup();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [codigoInvitacion, setCodigoInvitacion] = useState('');

  // Cuando el usuario cambia efectivamente de grupo, se limpia y cierra el formulario
  useEffect(() => {
    setNombre('');
    setDescripcion('');
    setCodigoInvitacion('');
    setShowCreateForm(false);
  }, [currentGroup?.id]);

  // Si ya hay grupo, createNewGroup abre el aviso/sucesión y el formulario se conserva
  // por si el usuario cancela.
  const handleCreate = (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    createNewGroup({
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      codigoInvitacion: codigoInvitacion.trim().toUpperCase()
    });
  };

  return (
    <div className="community-view-container" role="region" aria-label="Comunidades y grupos escolares">
      {/* Resumen del grupo actual */}
      <div className="card current-group-hero">
        <div className="current-group-hero-content">
          <div className="group-avatar-icon" aria-hidden="true">
            <Users size={28} color="#3b82f6" />
          </div>
          <div>
            <span className="current-group-badge">Comunidad Activa Actual</span>
            <h2 style={{ fontSize: '1.4rem', margin: '0.2rem 0' }}>
              {currentGroup ? currentGroup.nombre : 'Sin grupo asignado'}
            </h2>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {currentGroup ? currentGroup.descripcion : 'Únete a un grupo escolar para ver tareas y participar.'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setShowCreateForm(prev => !prev)}
            className="btn btn-primary"
            aria-expanded={showCreateForm}
            aria-label="Crear una nueva comunidad escolar"
          >
            <Plus size={16} aria-hidden="true" />
            <span>Crear Nueva Comunidad</span>
          </button>
          {currentGroup && (
            <button
              type="button"
              onClick={requestLeaveGroup}
              className="btn btn-secondary"
              aria-label={isAdmin ? 'Salir de mi grupo (deberás ceder la administración)' : 'Salir de mi grupo actual'}
            >
              <LogOut size={16} aria-hidden="true" />
              <span>Salir del grupo</span>
            </button>
          )}
        </div>
      </div>

      {/* Formulario de creación de comunidad */}
      {showCreateForm && (
        <form onSubmit={handleCreate} className="card create-community-card">
          <h3 style={{ fontSize: '1.15rem', margin: '0 0 1rem' }}>🏫 Crear Nueva Comunidad Estudiantil</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Al crear una comunidad te convertirás automáticamente en su <strong>Administrador</strong>. 
            Recuerda que solo puedes pertenecer a un grupo escolar a la vez: si ya estás en uno, saldrás de él
            {isAdmin ? ' (antes deberás ceder la administración a un compañero).' : '.'}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
            <div>
              <label htmlFor="create-group-nombre" className="label">Nombre del Grupo *</label>
              <input
                id="create-group-nombre"
                type="text"
                className="input"
                placeholder="Ej. Grado 11B - Prom 2026"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="create-group-code" className="label">Código de Invitación (Opcional)</label>
              <input
                id="create-group-code"
                type="text"
                className="input"
                placeholder="Ej. G11B-2026"
                value={codigoInvitacion}
                onChange={(e) => setCodigoInvitacion(e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginTop: '0.75rem' }}>
            <label htmlFor="create-group-desc" className="label">Descripción o Especialidad</label>
            <textarea
              id="create-group-desc"
              className="textarea"
              rows={2}
              placeholder="Descripción breve de los estudiantes o materias del curso..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Crear y Convertirme en Administrador
            </button>
          </div>
        </form>
      )}

      {/* Explorador de grupos disponibles */}
      <h3 style={{ fontSize: '1.2rem', margin: '1rem 0 0.5rem' }}>Explorar Comunidades Estudiantiles</h3>
      <div className="groups-grid">
        {groups.map(group => {
          const isMyGroup = currentGroup?.id === group.id;
          const isUserAdmin = group.adminId === currentUser?.id;

          return (
            <div 
              key={group.id} 
              className={`card group-card ${isMyGroup ? 'active-group-card' : ''}`}
            >
              <div className="group-card-header">
                <div>
                  <h4 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--text-main)' }}>
                    {group.nombre}
                  </h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Código: <strong>{group.codigoInvitacion}</strong>
                  </span>
                </div>
                {isMyGroup && (
                  <span className="badge badge-completed" style={{ fontSize: '0.7rem' }}>
                    <CheckCircle2 size={12} aria-hidden="true" /> Tu Grupo
                  </span>
                )}
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '0.5rem 0', flex: 1 }}>
                {group.descripcion}
              </p>

              <div className="group-card-footer">
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  👥 {group.miembros.length} estudiantes
                </span>

                {isMyGroup ? (
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: isUserAdmin ? '#eab308' : '#3b82f6' }}>
                    {isUserAdmin ? '👑 Administrador' : '🎒 Estudiante Miembro'}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => requestJoinGroup(group.id)}
                    className="btn btn-sm btn-secondary"
                    aria-label={currentGroup ? `Unirme a la comunidad ${group.nombre} y salir de mi grupo actual` : `Unirme a la comunidad ${group.nombre}`}
                  >
                    <span>Unirme a este Grupo</span>
                    <ArrowRight size={14} aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .community-view-container {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .current-group-hero {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem;
          flex-wrap: wrap;
          gap: 1.25rem;
          background: linear-gradient(135deg, var(--bg-surface), var(--bg-surface-elevated));
          border-left: 5px solid var(--primary-500);
        }
        .current-group-hero-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .group-avatar-icon {
          background: rgba(59, 130, 246, 0.15);
          padding: 0.85rem;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .current-group-badge {
          font-size: 0.75rem;
          text-transform: uppercase;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: var(--primary-500);
        }
        .create-community-card {
          border-color: var(--primary-500);
          animation: slideUp 150ms ease-out;
        }
        .groups-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1rem;
        }
        .group-card {
          display: flex;
          flex-direction: column;
          border: 1px solid var(--border-normal);
          transition: transform var(--transition-fast), border-color var(--transition-fast);
        }
        .group-card:hover {
          border-color: var(--border-focus);
          transform: translateY(-2px);
        }
        .active-group-card {
          border-color: var(--primary-500);
          box-shadow: 0 0 12px var(--primary-glow);
        }
        .group-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 0.5rem;
        }
        .group-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 1rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-subtle);
        }
      `}</style>
    </div>
  );
};
