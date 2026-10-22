import React, { useState, useEffect } from 'react';
import { useA11y } from '../../context/A11yContext';
import { Eye, Type, Wifi, WifiOff, Keyboard } from 'lucide-react';

export const A11yControls = () => {
  const { altoContraste, fontSize, toggleAltoContraste, setFontSize, announce, openOnboarding } = useA11y();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      announce('Conexión a internet restablecida. La aplicación está en línea.', 'polite');
    };
    const handleOffline = () => {
      setIsOnline(false);
      announce('Conexión perdida. Estás usando la aplicación en modo sin conexión.', 'assertive');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [announce]);

  return (
    <div className="a11y-controls-bar" role="region" aria-label="Controles de accesibilidad y estado de red">
      <div className="a11y-controls-group">
        {/* Indicador de Red PWA */}
        <div 
          className={`network-badge ${isOnline ? 'online' : 'offline'}`}
          role="status"
          aria-label={isOnline ? 'Estado de red: En línea' : 'Estado de red: Modo sin conexión (Offline)'}
          title={isOnline ? 'En línea' : 'Modo sin conexión'}
        >
          {isOnline ? (
            <>
              <Wifi size={14} aria-hidden="true" />
              <span>En línea</span>
            </>
          ) : (
            <>
              <WifiOff size={14} aria-hidden="true" />
              <span>Sin conexión</span>
            </>
          )}
        </div>

        {/* Reabrir el asistente de calibración (estilo consola) */}
        <button
          type="button"
          onClick={openOnboarding}
          className="btn btn-sm btn-secondary"
          aria-label="Abrir el asistente de calibración de accesibilidad"
          title="Calibrar Accesibilidad"
        >
          <span aria-hidden="true">🎮</span>
          <span>Calibrar Accesibilidad</span>
        </button>

        {/* Botón Alto Contraste */}
        <button
          type="button"
          onClick={toggleAltoContraste}
          className={`btn btn-sm ${altoContraste ? 'btn-primary' : 'btn-secondary'}`}
          aria-pressed={altoContraste}
          aria-label={altoContraste ? "Desactivar modo de alto contraste" : "Activar modo de alto contraste (WCAG AAA)"}
          title="Alternar Alto Contraste"
        >
          <Eye size={16} aria-hidden="true" />
          <span>{altoContraste ? "Contraste Alto Activo" : "Alto Contraste"}</span>
        </button>

        {/* Controles de Escala de Texto */}
        <div className="font-size-selector" role="group" aria-label="Ajuste de tamaño de texto">
          <span className="font-size-label" id="font-size-heading" aria-hidden="true">
            <Type size={14} /> Texto:
          </span>
          <button
            type="button"
            className={`btn-font ${fontSize === 'normal' ? 'active' : ''}`}
            onClick={() => setFontSize('normal')}
            aria-pressed={fontSize === 'normal'}
            aria-label="Tamaño de texto estándar (100%)"
          >
            A
          </button>
          <button
            type="button"
            className={`btn-font btn-font-lg ${fontSize === 'large' ? 'active' : ''}`}
            onClick={() => setFontSize('large')}
            aria-pressed={fontSize === 'large'}
            aria-label="Tamaño de texto grande (120%)"
          >
            A+
          </button>
          <button
            type="button"
            className={`btn-font btn-font-xl ${fontSize === 'xlarge' ? 'active' : ''}`}
            onClick={() => setFontSize('xlarge')}
            aria-pressed={fontSize === 'xlarge'}
            aria-label="Tamaño de texto muy grande (140%)"
          >
            A++
          </button>
        </div>

        {/* Botón de Ayuda de Atajos de Teclado */}
        <button
          type="button"
          onClick={() => setShowShortcutsModal(prev => !prev)}
          className="btn btn-sm btn-secondary"
          aria-label="Ver atajos de teclado accesibles"
          title="Atajos de Teclado"
        >
          <Keyboard size={16} aria-hidden="true" />
          <span>Atajos</span>
        </button>
      </div>

      {showShortcutsModal && (
        <div className="shortcuts-tooltip card" role="dialog" aria-label="Lista de atajos de teclado">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '0.95rem', margin: 0 }}>⌨️ Atajos de Teclado</h3>
            <button 
              type="button" 
              className="btn btn-sm btn-secondary" 
              onClick={() => setShowShortcutsModal(false)}
              aria-label="Cerrar ventana de atajos"
            >
              ✕
            </button>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.825rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li><kbd>Tab</kbd> / <kbd>Shift + Tab</kbd>: Navegar elementos</li>
            <li><kbd>Alt + N</kbd>: Crear nueva tarea escolar (administrador)</li>
            <li><kbd>Alt + C</kbd>: Ir a vista Calendario</li>
            <li><kbd>Alt + L</kbd>: Ir a vista Lista / Agenda</li>
            <li><kbd>Escape</kbd>: Cerrar cualquier ventana o modal</li>
          </ul>
        </div>
      )}

      <style>{`
        .a11y-controls-bar {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: 0.4rem 1rem;
          background-color: var(--bg-surface-elevated);
          border-bottom: 1px solid var(--border-subtle);
          position: relative;
        }
        .a11y-controls-group {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-wrap: wrap;
        }
        .network-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
        }
        .network-badge.online {
          background-color: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid #10b981;
        }
        .network-badge.offline {
          background-color: rgba(239, 68, 68, 0.15);
          color: #f87171;
          border: 1px solid #ef4444;
        }
        .font-size-selector {
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
          background-color: var(--bg-surface);
          padding: 0.2rem 0.4rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-normal);
        }
        .font-size-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 0.2rem;
          margin-right: 0.3rem;
        }
        .btn-font {
          background: transparent;
          border: 1px solid transparent;
          color: var(--text-main);
          font-weight: 700;
          cursor: pointer;
          border-radius: 4px;
          padding: 0.15rem 0.4rem;
          font-size: 0.8rem;
          transition: all 120ms ease;
        }
        .btn-font.active {
          background-color: var(--primary-600);
          color: #ffffff;
          border-color: var(--primary-500);
        }
        .btn-font-lg { font-size: 0.95rem; }
        .btn-font-xl { font-size: 1.05rem; }
        .shortcuts-tooltip {
          position: absolute;
          top: 100%;
          right: 1rem;
          margin-top: 0.5rem;
          width: 290px;
          z-index: 100;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border-focus);
        }
        kbd {
          background: var(--bg-surface-elevated);
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid var(--border-normal);
          font-family: monospace;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};
