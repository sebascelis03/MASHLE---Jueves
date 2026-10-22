import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { useA11y } from '../../context/A11yContext';

export const PWAInstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const { announce } = useA11y();

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
      announce('La aplicación Calendario Estudiantil está disponible para instalarse en tu dispositivo.', 'polite');
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, [announce]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      announce('¡Instalación iniciada con éxito!', 'polite');
    }
    setDeferredPrompt(null);
    setShowBanner(false);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    announce('Aviso de instalación descartado.', 'polite');
  };

  if (!showBanner) return null;

  return (
    <div 
      className="pwa-install-banner" 
      role="region" 
      aria-label="Aviso de instalación de aplicación web progresiva"
    >
      <div className="pwa-banner-content">
        <Smartphone className="pwa-icon" aria-hidden="true" size={24} />
        <div>
          <strong>Instala el Calendario Estudiantil en tu dispositivo</strong>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Accede rápidamente desde tu pantalla de inicio y revisa tus tareas escolares incluso sin conexión a internet.
          </p>
        </div>
      </div>
      <div className="pwa-banner-actions">
        <button
          type="button"
          onClick={handleInstallClick}
          className="btn btn-sm btn-primary"
          aria-label="Instalar la aplicación en el dispositivo"
        >
          <Download size={16} aria-hidden="true" />
          <span>Instalar App</span>
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          className="btn btn-sm btn-secondary"
          aria-label="Cerrar aviso de instalación"
        >
          <X size={16} aria-hidden="true" />
          <span>Ahora no</span>
        </button>
      </div>

      <style>{`
        .pwa-install-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.75rem 1.25rem;
          background: linear-gradient(90deg, rgba(37, 99, 235, 0.15), rgba(124, 58, 237, 0.15));
          border-bottom: 2px solid var(--primary-500);
          color: var(--text-main);
          flex-wrap: wrap;
        }
        .pwa-banner-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
          min-width: 250px;
        }
        .pwa-icon {
          color: var(--primary-500);
          flex-shrink: 0;
        }
        .pwa-banner-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
      `}</style>
    </div>
  );
};
