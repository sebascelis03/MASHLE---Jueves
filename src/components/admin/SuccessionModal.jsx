import React, { useState, useEffect } from 'react';
import { FocusTrap } from '../a11y/FocusTrap';
import { useAuthGroup } from '../../context/AuthGroupContext';
import { Crown, UserCheck, ShieldAlert, Check, UserX } from 'lucide-react';

export const SuccessionModal = () => {
  const {
    isSuccessionModalOpen,
    cancelSuccession,
    currentGroup,
    currentUser,
    pendingAction,
    transferAdminRoleAndLeave,
    autoAssignSuccessorAndLeave
  } = useAuthGroup();

  // Candidatos elegibles (excluyendo al admin saliente)
  const eligibleMembers = currentGroup?.miembros.filter(m => m.id !== currentUser?.id) || [];
  const [selectedSuccessorId, setSelectedSuccessorId] = useState('');

  // Reiniciar la selección cada vez que se abre el modal o cambia el grupo
  useEffect(() => {
    if (isSuccessionModalOpen) {
      const candidates = currentGroup?.miembros.filter(m => m.id !== currentUser?.id) || [];
      setSelectedSuccessorId(candidates[0]?.id || '');
    }
  }, [isSuccessionModalOpen, currentGroup?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isSuccessionModalOpen || !currentGroup) return null;

  const reasonText =
    pendingAction?.type === 'join'
      ? `Para unirte a "${pendingAction.group.nombre}"`
      : pendingAction?.type === 'create'
        ? `Para crear la comunidad "${pendingAction.data?.nombre}"`
        : 'Para retirarte del grupo';

  const handleManualSuccession = (e) => {
    e.preventDefault();
    if (!selectedSuccessorId && eligibleMembers.length > 0) return;
    transferAdminRoleAndLeave(selectedSuccessorId);
  };

  const handleCancel = () => {
    cancelSuccession();
  };

  return (
    <div className="modal-overlay">
      <FocusTrap
        role="dialog"
        onClose={handleCancel}
        ariaLabel="Protocolo de sucesión obligatoria de Administrador"
        ariaDescribedBy="succession-modal-desc"
      >
        <div className="modal-content succession-content" onClick={(e) => e.stopPropagation()}>
          <div className="succession-header">
            <div className="crown-badge" aria-hidden="true">
              <Crown size={28} color="#eab308" />
            </div>
            <div>
              <h2 id="succession-title" style={{ fontSize: '1.3rem', margin: 0 }}>
                👑 Cesión y Sucesión de Administrador
              </h2>
              <p id="succession-modal-desc" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
                {reasonText} debes <strong>transferir la administración</strong> de <strong>{currentGroup.nombre}</strong> a un compañero.
                El grupo no puede quedar sin administrador.
              </p>
            </div>
          </div>

          {eligibleMembers.length === 0 ? (
            <div className="no-members-box">
              <UserX size={28} color="#f87171" aria-hidden="true" />
              <div>
                <strong>Eres el único miembro en esta comunidad.</strong>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Al salir, el grupo quedará cerrado.
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                  <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                    Permanecer
                  </button>
                  <button type="button" className="btn btn-danger" onClick={() => transferAdminRoleAndLeave(null)}>
                    Salir y cerrar el grupo
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleManualSuccession}>
              <fieldset style={{ border: 'none', padding: 0, margin: '1rem 0 1.25rem' }}>
                <legend style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>
                  Selecciona de la lista al estudiante que asumirá el rol de Administrador:
                </legend>

                <div className="candidates-list" role="radiogroup" aria-label="Miembros candidatos a administrador">
                  {eligibleMembers.map(member => {
                    const isChecked = selectedSuccessorId === member.id;
                    return (
                      <label 
                        key={member.id} 
                        className={`candidate-card ${isChecked ? 'selected' : ''}`}
                        htmlFor={`candidate-${member.id}`}
                      >
                        <input
                          id={`candidate-${member.id}`}
                          type="radio"
                          name="successor"
                          value={member.id}
                          checked={isChecked}
                          onChange={() => setSelectedSuccessorId(member.id)}
                          className="candidate-radio"
                        />
                        <div className="candidate-info">
                          <span className="candidate-name">{member.nombre}</span>
                          <span className="candidate-email">{member.email}</span>
                        </div>
                        {isChecked && (
                          <span className="candidate-badge" aria-hidden="true">
                            <Check size={16} /> Sucesor Elegido
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <div className="succession-actions">
                <button
                  type="button"
                  onClick={autoAssignSuccessorAndLeave}
                  className="btn btn-secondary"
                  aria-label="Ceder el rol automáticamente al miembro con mayor antigüedad y salir"
                  title="Asignación automática"
                >
                  <ShieldAlert size={16} aria-hidden="true" />
                  <span>Asignación Automática</span>
                </button>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-secondary"
                    aria-label="Cancelar salida y conservar mi rol de administrador"
                  >
                    Permanecer
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!selectedSuccessorId}
                    aria-label="Confirmar cesión de rol y salir del grupo"
                  >
                    <UserCheck size={16} aria-hidden="true" />
                    <span>Ceder Rol y Salir</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          <style>{`
            .succession-content {
              border-color: #eab308;
            }
            .succession-header {
              display: flex;
              align-items: center;
              gap: 1rem;
              margin-bottom: 1rem;
            }
            .crown-badge {
              background: rgba(234, 179, 8, 0.15);
              padding: 0.65rem;
              border-radius: var(--radius-md);
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .candidates-list {
              display: flex;
              flex-direction: column;
              gap: 0.6rem;
            }
            .candidate-card {
              display: flex;
              align-items: center;
              gap: 0.75rem;
              padding: 0.85rem 1rem;
              background-color: var(--bg-surface-elevated);
              border: 1.5px solid var(--border-normal);
              border-radius: var(--radius-md);
              cursor: pointer;
              transition: all var(--transition-fast);
            }
            .candidate-card:hover {
              border-color: var(--border-focus);
              background-color: var(--bg-surface-hover);
            }
            .candidate-card.selected {
              border-color: #eab308;
              background-color: rgba(234, 179, 8, 0.08);
            }
            .candidate-radio {
              width: 18px;
              height: 18px;
              accent-color: #eab308;
            }
            .candidate-info {
              display: flex;
              flex-direction: column;
              flex: 1;
            }
            .candidate-name {
              font-weight: 700;
              font-size: 0.95rem;
              color: var(--text-main);
            }
            .candidate-email {
              font-size: 0.8rem;
              color: var(--text-muted);
            }
            .candidate-badge {
              display: flex;
              align-items: center;
              gap: 0.25rem;
              font-size: 0.75rem;
              font-weight: 700;
              color: #fef08a;
              background-color: rgba(234, 179, 8, 0.2);
              padding: 0.2rem 0.5rem;
              border-radius: var(--radius-full);
            }
            .no-members-box {
              display: flex;
              align-items: center;
              gap: 1rem;
              padding: 1rem;
              background: rgba(239, 68, 68, 0.1);
              border-radius: var(--radius-md);
              border: 1px solid #ef4444;
              margin: 1rem 0;
            }
            .succession-actions {
              display: flex;
              align-items: center;
              justify-content: space-between;
              flex-wrap: wrap;
              gap: 0.75rem;
              margin-top: 1.5rem;
            }
          `}</style>
        </div>
      </FocusTrap>
    </div>
  );
};
