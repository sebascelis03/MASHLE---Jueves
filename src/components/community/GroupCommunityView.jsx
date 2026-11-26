import React, { useState } from 'react';
import { useAuthGroup } from '../../context/AuthGroupContext';
import { Users, Plus, CheckCircle2, ArrowRight, LogOut, KeyRound, Send, Clock, X } from 'lucide-react';

export const GroupCommunityView = () => {
  const {
    groups,
    currentGroup,
    currentUser,
    isAdmin,
    requestJoinGroup,
    sendJoinRequest,
    cancelJoinRequest,
    joinGroupByCode,
    createNewGroup,
    requestLeaveGroup
  } = useAuthGroup();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [codigoInvitacion, setCodigoInvitacion] = useState('');

  // Ingreso rápido por código de invitación
  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const [codeMessage, setCodeMessage] = useState(null);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    const res = createNewGroup({
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      codigoInvitacion: codigoInvitacion.trim().toUpperCase()
    });

    if (!res?.pending) {
      setNombre('');
      setDescripcion('');
      setCodigoInvitacion('');
      setShowCreateForm(false);
    }
  };

  const handleJoinByCode = (e) => {
    e.preventDefault();
    setCodeMessage(null);
    const res = joinGroupByCode(inviteCodeInput);
    if (!res.success) {
      setCodeMessage({ type: 'error', text: res.error });
    } else {
      setInviteCodeInput('');
      setCodeMessage({ type: 'success', text: `Código válido para "${res.group.nombre}".` });
    }
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
              {currentGroup
                ? `${currentGroup.descripcion || 'Comunidad estudiantil activa.'} · Código: ${currentGroup.codigoInvitacion}`
                : 'Únete a un grupo con código de invitación, envía una solicitud o crea una nueva comunidad.'}
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

      {/* Tarjeta de unión directa por Código de Invitación */}
      <form onSubmit={handleJoinByCode} className="card join-code-card" aria-label="Unirse con código de invitación">
        <div className="join-code-info">
          <KeyRound size={20} color="#38bdf8" aria-hidden="true" />
          <div>
            <h3 style={{ fontSize: '1rem', margin: 0 }}>🔑 ¿Tienes un Código de Invitación?</h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '0.15rem 0 0' }}>
              Ingresa el código del curso para unirte de inmediato sin esperar aprobación manual.
            </p>
          </div>
        </div>

        <div className="join-code-controls">
          <label htmlFor="invite-code-input" className="sr-only">Código de invitación del grupo</label>
          <input
            id="invite-code-input"
            type="text"
            className="input"
            placeholder="Ej. COD-1234 o G11B-2026"
            value={inviteCodeInput}
            onChange={(e) => {
              setInviteCodeInput(e.target.value);
              if (codeMessage) setCodeMessage(null);
            }}
            style={{ maxWidth: '220px' }}
          />
          <button type="submit" className="btn btn-secondary">
            <span>Ingresar con Código</span>
            <ArrowRight size={15} aria-hidden="true" />
          </button>
        </div>

        {codeMessage && (
          <div
            role={codeMessage.type === 'error' ? 'alert' : 'status'}
            style={{
              width: '100%',
              fontSize: '0.84rem',
              color: codeMessage.type === 'error' ? '#f87171' : '#34d399',
              marginTop: '0.35rem'
            }}
          >
            {codeMessage.text}
          </div>
        )}
      </form>

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
      <h3 style={{ fontSize: '1.2rem', margin: '0.5rem 0 0.25rem' }}>Explorar Comunidades Estudiantiles ({groups.length})</h3>
      {groups.length === 0 ? (
        <div className="card" role="status" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
          <p style={{ fontSize: '1.05rem', fontWeight: 600, margin: '0 0 0.4rem' }}>
            🏫 Aún no hay comunidades estudiantiles creadas.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0 0 1rem' }}>
            Haz clic en <strong>Crear Nueva Comunidad</strong> para fundar el primer grupo escolar y gestionar su calendario.
          </p>
          <button
            type="button"
            onClick={() => setShowCreateForm(true)}
            className="btn btn-primary"
          >
            <Plus size={16} aria-hidden="true" />
            <span>Crear Primera Comunidad</span>
          </button>
        </div>
      ) : (
        <div className="groups-grid">
          {groups.map(group => {
            const isMyGroup = currentGroup?.id === group.id;
            const memberEntry = group.miembros.find(m => m.id === currentUser?.id);
            const isUserAdmin = group.adminId === currentUser?.id || memberEntry?.rol === 'admin';
            const hasPendingRequest = (group.solicitudesPendientes || []).some(s => s.id === currentUser?.id);

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
                  {isMyGroup ? (
                    <span className="badge badge-completed" style={{ fontSize: '0.7rem' }}>
                      <CheckCircle2 size={12} aria-hidden="true" /> Tu Grupo
                    </span>
                  ) : hasPendingRequest ? (
                    <span className="badge badge-pending" style={{ fontSize: '0.7rem' }}>
                      <Clock size={12} aria-hidden="true" /> Solicitud enviada
                    </span>
                  ) : null}
                </div>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '0.5rem 0', flex: 1 }}>
                  {group.descripcion || 'Comunidad estudiantil cerrada.'}
                </p>

                <div className="group-card-footer">
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    👥 {group.miembros.length} estudiante{group.miembros.length === 1 ? '' : 's'}
                  </span>

                  {isMyGroup ? (
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: isUserAdmin ? '#eab308' : '#3b82f6' }}>
                      {isUserAdmin ? '👑 Administrador' : '🎒 Estudiante Miembro'}
                    </span>
                  ) : (
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      {hasPendingRequest ? (
                        <button
                          type="button"
                          onClick={() => cancelJoinRequest(group.id)}
                          className="btn btn-sm btn-secondary"
                          aria-label={`Cancelar solicitud enviada a ${group.nombre}`}
                        >
                          <X size={13} aria-hidden="true" />
                          <span>Cancelar Solicitud</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => sendJoinRequest(group.id)}
                          className="btn btn-sm btn-secondary"
                          aria-label={`Enviar solicitud de acceso al administrador de ${group.nombre}`}
                          title="El administrador del grupo podrá aprobar tu solicitud en el Panel Admin"
                        >
                          <Send size={13} aria-hidden="true" />
                          <span>Solicitar Acceso</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => requestJoinGroup(group.id)}
                        className="btn btn-sm btn-primary"
                        aria-label={currentGroup ? `Unirme directamente a la comunidad ${group.nombre} y salir de mi grupo actual` : `Unirme directamente a la comunidad ${group.nombre}`}
                      >
                        <span>Unirme Ahora</span>
                        <ArrowRight size={14} aria-hidden="true" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

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
        .join-code-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          padding: 1rem 1.25rem;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-normal);
        }
        .join-code-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .join-code-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
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
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 1rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-subtle);
        }
      `}</style>
    </div>
  );
};
