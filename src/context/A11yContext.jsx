import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { storageService } from '../services/storageService';

const A11yContext = createContext();

const MAX_TOASTS = 4;

// Patrones de tonos (Web Audio API). Discretos: volumen bajo y duración corta.
const SOUND_PATTERNS = {
  info: [{ f: 660, d: 0.08 }],
  success: [{ f: 523, d: 0.08 }, { f: 784, d: 0.12 }],
  warning: [{ f: 440, d: 0.12 }, { f: 440, d: 0.12 }],
  alert: [{ f: 880, d: 0.1 }, { f: 520, d: 0.18 }],
  error: [{ f: 330, d: 0.16 }, { f: 220, d: 0.22 }]
};

export const A11yProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => storageService.getSettings());
  const [announcement, setAnnouncement] = useState({ message: '', priority: 'polite', id: 0 });
  const [toasts, setToasts] = useState([]);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => !storageService.getSettings().onboardingCompletado);

  // Referencia siempre actualizada para que announce() no dependa del estado
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const audioCtxRef = useRef(null);

  // Sincronizar atributos en <html> para estilos inmediatos + persistir
  useEffect(() => {
    const root = document.documentElement;

    if (settings.altoContraste) {
      root.setAttribute('data-contrast', 'high');
    } else {
      root.removeAttribute('data-contrast');
    }

    root.setAttribute('data-font-size', settings.fontSize || 'normal');

    const palette = settings.daltonismo || 'estandar';
    if (palette === 'estandar') {
      root.removeAttribute('data-colorblind');
    } else {
      root.setAttribute('data-colorblind', palette);
    }

    const brightness = Math.min(140, Math.max(60, Number(settings.brillo) || 100));
    root.style.setProperty('--a11y-brightness', String(brightness / 100));
    if (brightness !== 100 || palette === 'acromatopsia') {
      root.setAttribute('data-a11y-filter', 'on');
    } else {
      root.removeAttribute('data-a11y-filter');
    }

    storageService.saveSettings(settings);
  }, [settings]);

  // --- Retroalimentación auditiva (Web Audio API) ---
  const playSound = useCallback((kind = 'info', { force = false } = {}) => {
    if (!force && !settingsRef.current.sonidos) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      let t = ctx.currentTime;
      (SOUND_PATTERNS[kind] || SOUND_PATTERNS.info).forEach(({ f, d }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = f;
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.06, t + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + d);
        osc.connect(gain).connect(ctx.destination);
        osc.start(t);
        osc.stop(t + d + 0.02);
        t += d + 0.04;
      });
    } catch {
      /* Audio no disponible: se ignora sin romper la app */
    }
  }, []);

  // --- Lectura en voz alta (Web Speech API) ---
  const isSpeechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const speak = useCallback((text, { force = false } = {}) => {
    if (!text || !('speechSynthesis' in window)) return;
    if (!force && !settingsRef.current.lecturaVoz) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 1;
      window.speechSynthesis.speak(utterance);
    } catch {
      /* TTS no disponible */
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }, []);

  // --- Alertas visuales (Toast) ---
  const showToast = useCallback((message, type = 'info') => {
    if (!message) return;
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts(prev => [...prev, { id, message, type }].slice(-MAX_TOASTS));
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // --- Anuncios (lectores de pantalla + canales opcionales) ---
  const announce = useCallback((message, priority = 'polite') => {
    setAnnouncement({ message, priority, id: Date.now() });

    const current = settingsRef.current;
    if (current.lecturaVoz) speak(message);
    if (current.sonidos) playSound(priority === 'assertive' ? 'alert' : 'info');
    if (current.alertasVisuales) showToast(message, priority === 'assertive' ? 'warning' : 'info');
  }, [speak, playSound, showToast]);

  // --- Acciones de configuración ---
  const updateSettings = useCallback((patch) => {
    setSettings(prev => ({ ...prev, ...patch }));
  }, []);

  const toggleAltoContraste = () => {
    const next = !settings.altoContraste;
    setSettings(prev => ({ ...prev, altoContraste: next }));
    announce(next ? 'Modo de alto contraste activado.' : 'Modo de alto contraste desactivado.', 'polite');
  };

  const setFontSize = (size) => {
    setSettings(prev => ({ ...prev, fontSize: size }));
    const labels = { normal: 'Tamaño de texto estándar', large: 'Tamaño de texto grande', xlarge: 'Tamaño de texto muy grande' };
    announce(labels[size] || 'Tamaño de fuente cambiado', 'polite');
  };

  // --- Asistente de calibración ---
  const openOnboarding = useCallback(() => setIsOnboardingOpen(true), []);

  const closeOnboarding = useCallback(() => {
    setIsOnboardingOpen(false);
    setSettings(prev => (prev.onboardingCompletado ? prev : { ...prev, onboardingCompletado: true }));
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }, []);

  return (
    <A11yContext.Provider value={{
      settings,
      altoContraste: settings.altoContraste,
      fontSize: settings.fontSize,
      daltonismo: settings.daltonismo,
      brillo: settings.brillo,
      lecturaVoz: settings.lecturaVoz,
      sonidos: settings.sonidos,
      alertasVisuales: settings.alertasVisuales,
      updateSettings,
      toggleAltoContraste,
      setFontSize,
      announce,
      announcement,
      speak,
      stopSpeaking,
      isSpeechSupported,
      playSound,
      toasts,
      showToast,
      dismissToast,
      isOnboardingOpen,
      openOnboarding,
      closeOnboarding
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
