import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storageService } from '../services/storageService';

const A11yContext = createContext();

export const A11yProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => storageService.getSettings());
  const [announcement, setAnnouncement] = useState({ message: '', priority: 'polite', id: 0 });

  useEffect(() => {
    // Sincronizar atributos en el elemento raíz <html> para estilos inmediatos
    const root = document.documentElement;
    if (settings.altoContraste) {
      root.setAttribute('data-contrast', 'high');
    } else {
      root.removeAttribute('data-contrast');
    }

    root.setAttribute('data-font-size', settings.fontSize || 'normal');
    storageService.saveSettings(settings);
  }, [settings]);

  const toggleAltoContraste = () => {
    setSettings(prev => {
      const next = !prev.altoContraste;
      announce(next ? 'Modo de alto contraste activado.' : 'Modo de alto contraste desactivado.', 'polite');
      return { ...prev, altoContraste: next };
    });
  };

  const setFontSize = (size) => {
    setSettings(prev => ({ ...prev, fontSize: size }));
    const labels = { normal: 'Tamaño de texto estándar', large: 'Tamaño de texto grande', xlarge: 'Tamaño de texto muy grande' };
    announce(labels[size] || 'Tamaño de fuente cambiado', 'polite');
  };

  const announce = useCallback((message, priority = 'polite') => {
    setAnnouncement({
      message,
      priority,
      id: Date.now()
    });
  }, []);

  return (
    <A11yContext.Provider value={{
      altoContraste: settings.altoContraste,
      fontSize: settings.fontSize,
      toggleAltoContraste,
      setFontSize,
      announce,
      announcement
    }}>
      {children}
    </A11yContext.Provider>
  );
};

export const useA11y = () => {
  const context = useContext(A11yContext);
  if (!context) {
    throw new Error('useA11y debe usarse dentro de un A11yProvider');
  }
  return context;
};
