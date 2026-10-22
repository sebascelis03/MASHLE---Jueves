import React, { useEffect } from 'react';
import { useA11y } from '../../context/A11yContext';
import { Info, CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react';

const TOAST_DURATION_MS = 6000;

const TOAST_META = {
  info: { Icon: Info, label: 'Aviso', color: 'var(--toast-info)' },
  success: { Icon: CheckCircle2, label: 'Correcto', color: 'var(--toast-success)' },
  warning: { Icon: AlertTriangle, label: 'Atención', color: 'var(--toast-warning)' },
  error: { Icon: XCircle, label: 'Error', color: 'var(--toast-error)' }
};

const ToastItem = ({ toast, onDismiss }) => {
  const meta = TOAST_META[toast.type] || TOAST_META.info;
  const { Icon } = meta;

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <li className="toast-item" style={{ borderLeftColor: meta.color }}>
      <span className="toast-icon" style={{ color: meta.color }} aria-hidden="true">
        <Icon size={20} />
      </span>
      <div className="toast-body">
        {/* Etiqueta textual: la severidad nunca depende solo del color */}
        <strong className="toast-label">{meta.label}</strong>
        <span className="toast-message">{toast.message}</span>
      </div>
      <button
        type="button"
        className="toast-close"
        onClick={() => onDismiss(toast.id)}
        aria-label={`Cerrar aviso: ${toast.message}`}
      >
        <X size={16} aria-hidden="true" />
      </button>
    </li>
  );
};

/**
 * Alertas 100% visuales (Toast) para usuarios con discapacidad auditiva.
 * No usa aria-live: los lectores de pantalla ya reciben el aviso por LiveAnnouncer
 * y así se evita la doble lectura.
 */
export const ToastHost = () => {
  const { toasts, dismissToast } = useA11y();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-host" role="region" aria-label="Avisos visuales del sistema">
      <ul className="toast-list">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </ul>

      <style>{`
        .toast-host {
          position: fixed;
          right: 1rem;
          bottom: 1rem;
          z-index: 2000;
          width: min(380px, calc(100vw - 2rem));
        }
        .toast-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .toast-item {
          display: flex;
          align-items: flex-start;
          gap: 0.65rem;
          padding: 0.75rem 0.85rem;
          background-color: var(--bg-surface-elevated);
          color: var(--text-main);
          border: 1px solid var(--border-normal);
          border-left: 6px solid var(--toast-info);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          animation: slideUp 180ms ease-out;
        }
        .toast-icon {
          display: flex;
          padding-top: 0.1rem;
        }
        .toast-body {
          display: flex;
          flex-direction: column;
          flex: 1;
          gap: 0.1rem;
          font-size: 0.88rem;
          line-height: 1.4;
        }
        .toast-label {
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
        }
        .toast-close {
          background: transparent;
          border: 1px solid transparent;
          color: var(--text-muted);
          cursor: pointer;
          border-radius: var(--radius-sm);
          padding: 0.2rem;
          display: flex;
        }
        .toast-close:hover {
          color: var(--text-main);
          border-color: var(--border-normal);
        }
      `}</style>
    </div>
  );
};
