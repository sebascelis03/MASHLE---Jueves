import React from 'react';
import { FocusTrap } from '../a11y/FocusTrap';
import { useAuthGroup } from '../../context/AuthGroupContext';
import { AlertTriangle, LogOut, ArrowRight, X } from 'lucide-react';

export const GroupWarningDialog = () => {
  const { 
    isSwitchWarningOpen, 
    cancelGroupSwitch, 
    confirmGroupSwitch, 
    currentGroup, 
    pendingGroupSwitch,
    isAdmin 
  } = useAuthGroup();

  if (!isSwitchWarningOpen || !pendingGroupSwitch) return null;

  return (
    <div className="modal-overlay" onClick={cancelGroupSwitch}>
      <FocusTrap
        role="alertdialog"
        onClose={cancelGroupSwitch}
        ariaLabel="Alerta de prevención: salida automática del grupo escolar"
        ariaDescribedBy="alert-desc-group-switch"
      >
        <div 
          className="modal-content alert-dialog-content" 
          onClick={(e) => e.stopPropagation()}
        >
          <div className="alert-header">
            <div className="alert-icon-wrap" aria-hidden="true">
              <AlertTriangle size={32} color="#f59e0b" />
            </div>
            <div>
              <h2 id="alert-title-group-switch" className="alert-heading">
                ⚠️ Confirmación de Salida Automática
              </h2>
              <p className="alert-subheading">
                Prevención de errores en comunidades cerradas
              </p>
            </div>
          </div>

          <div id="alert-desc-group-switch" className="alert-body">
            <p>
              Actualmente perteneces al grupo escolar: <br />
              <strong style={{ color: 'var(--text-main)', fontSize: '1.05rem' }}>
                📁 {currentGroup?.nombre || 'Grupo actual'}
              </strong>
            </p>
            <p>
              El sistema de comunidades cerradas únicamente permite pertenecer a un grupo a la vez. 
              Al unirte a <strong style={{ color: 'var(--primary-500)' }}>{pendingGroupSwitch.nombre}</strong>, 
              <strong> serás expulsado automáticamente de tu grupo anterior</strong> y perderás acceso a su calendario privado.
            </p>

            {isAdmin && (
              <div className="admin-succession-warning">
                <strong>👑 Eres el Administrador de este grupo:</strong>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem' }}>
                  Por lineamiento del sistema, el grupo nunca puede quedar sin administración. Al continuar, deberás 
                  <strong> seleccionar formalmente a tu sucesor</strong> antes de completar tu salida.
                </p>
              </div>
            )}
          </div>

          <div className="alert-actions">
            <button
              type="button"
              onClick={cancelGroupSwitch}
              className="btn btn-secondary"
              aria-label="Cancelar y permanecer en mi grupo actual"
            >
              <X size={16} aria-hidden="true" />
              <span>Cancelar (Permanecer en el grupo)</span>
            </button>
            <button
              type="button"
              onClick={confirmGroupSwitch}
              className="btn btn-danger"
              aria-label="Aceptar salida automática y continuar con el cambio de grupo"
            >
              <span>{isAdmin ? 'Continuar a Sucesión' : 'Aceptar Salida y Unirse'}</span>
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>

          <style>{`
            .alert-dialog-content {
              border-color: #f59e0b;
              box-shadow: 0 0 25px rgba(245, 158, 11, 0.25);
            }
            .alert-header {
              display: flex;
              align-items: center;
              gap: 1rem;
              margin-bottom: 1.25rem;
            }
            .alert-icon-wrap {
              background: rgba(245, 158, 11, 0.15);
              padding: 0.75rem;
              border-radius: var(--radius-md);
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .alert-heading {
              font-size: 1.25rem;
              margin: 0;
              color: var(--text-main);
            }
            .alert-subheading {
              font-size: 0.85rem;
              color: var(--text-secondary);
              margin: 0.2rem 0 0;
            }
            .alert-body {
              font-size: 0.95rem;
              color: var(--text-muted);
              line-height: 1.55;
              display: flex;
              flex-direction: column;
              gap: 0.75rem;
              margin-bottom: 1.5rem;
            }
            .admin-succession-warning {
              background-color: rgba(234, 179, 8, 0.12);
              border-left: 4px solid #eab308;
              padding: 0.75rem 1rem;
              border-radius: 0 var(--radius-md) var(--radius-md) 0;
              color: #fef08a;
            }
            .alert-actions {
              display: flex;
              align-items: center;
              justify-content: flex-end;
              gap: 0.75rem;
              flex-wrap: wrap;
            }
          `}</style>
        </div>
      </FocusTrap>
    </div>
  );
};
