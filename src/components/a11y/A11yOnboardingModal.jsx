import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FocusTrap } from './FocusTrap';
import { useA11y } from '../../context/A11yContext';
import {
  Gamepad2, Sun, Eye, Palette, Volume2, Keyboard, BellRing,
  ChevronLeft, ChevronRight, Check, SkipForward, RotateCcw, Clock, PlayCircle, CheckCircle2, XCircle
} from 'lucide-react';

const TOTAL_STEPS = 4;

const STEP_TITLES = [
  'Calibración de brillo y contraste',
  'Prueba y modos de daltonismo',
  'Asistencia para ceguera y baja visión',
  'Asistencia para discapacidad auditiva'
];

const COLOR_MODES = [
  { id: 'estandar', nombre: 'Tricromía estándar', detalle: 'Visión normal de los colores.' },
  { id: 'protanopia', nombre: 'Protanopía', detalle: 'Deficiencia de rojo. Usa azul, amarillo y magenta.' },
  { id: 'deuteranopia', nombre: 'Deuteranopía', detalle: 'Deficiencia de verde. Usa azul, amarillo y magenta.' },
  { id: 'tritanopia', nombre: 'Tritanopía', detalle: 'Deficiencia de azul/amarillo. Usa rojo, verde azulado y violeta.' },
  { id: 'acromatopsia', nombre: 'Acromatopsia / Monocromático', detalle: 'Escala de grises de alto contraste.' }
];

const STEP_NARRATION = [
  'Paso 1 de 4. Calibración de brillo y contraste. Ajusta el control deslizante hasta que el símbolo de la izquierda sea apenas visible y el de la derecha sea claramente visible. También puedes activar el modo de alto contraste.',
  'Paso 2 de 4. Modos de daltonismo. Elige la paleta que mejor se vea. Los estados de las tareas siempre combinan color, ícono y texto.',
  'Paso 3 de 4. Asistencia para ceguera y baja visión. Puedes activar la lectura en voz alta, los sonidos del sistema y usar atajos de teclado: Alt más N crea una tarea nueva, Alt más C abre el calendario y Alt más L abre la agenda.',
  'Paso 4 de 4. Asistencia para discapacidad auditiva. Activa las alertas visuales para recibir avisos en ventanas flotantes en lugar de depender de sonidos.'
];

// Interruptor accesible (role="switch")
const Switch = ({ id, checked, onChange, label, description }) => (
  <div className="a11y-switch-row">
    <div className="a11y-switch-text">
      <label htmlFor={id} className="a11y-switch-label">{label}</label>
      {description && <p id={`${id}-desc`} className="a11y-switch-desc">{description}</p>}
    </div>
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-describedby={description ? `${id}-desc` : undefined}
      onClick={() => onChange(!checked)}
      className={`a11y-switch ${checked ? 'on' : ''}`}
    >
      <span className="a11y-switch-state">{checked ? 'Activado' : 'Desactivado'}</span>
      <span className="a11y-switch-knob" aria-hidden="true" />
    </button>
  </div>
);

// Símbolo de la caja de calibración
const CalibrationSymbol = ({ shape, color, label }) => (
  <svg
    width="72"
    height="72"
    viewBox="0 0 72 72"
    role="img"
    aria-label={label}
    style={{ color }}
  >
    {shape === 'circle' && <circle cx="36" cy="36" r="26" fill="currentColor" />}
    {shape === 'triangle' && <polygon points="36,8 66,62 6,62" fill="currentColor" />}
    {shape === 'square' && <rect x="10" y="10" width="52" height="52" rx="6" fill="currentColor" />}
  </svg>
);

const OnboardingContent = () => {
  const {
    settings, updateSettings, closeOnboarding, announce, speak, stopSpeaking,
    isSpeechSupported, playSound, showToast
  } = useA11y();

  const [step, setStep] = useState(1);
  const headingRef = useRef(null);
  const isFirstRender = useRef(true);

  // Copia de la configuración al abrir: "Omitir" descarta los cambios hechos en el asistente
  const initialSettingsRef = useRef(settings);

  // Al cambiar de paso, mover el foco al encabezado para lectores de pantalla
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    headingRef.current?.focus();
    announce(`Paso ${step} de ${TOTAL_STEPS}: ${STEP_TITLES[step - 1]}`, 'polite');
  }, [step, announce]);

  const handleSkip = useCallback(() => {
    const { daltonismo, brillo, altoContraste, lecturaVoz, sonidos, alertasVisuales } = initialSettingsRef.current;
    updateSettings({ daltonismo, brillo, altoContraste, lecturaVoz, sonidos, alertasVisuales });
    closeOnboarding();
  }, [updateSettings, closeOnboarding]);

  const handleFinish = () => {
    closeOnboarding();
    announce('Configuración de accesibilidad guardada. Puedes recalibrar cuando quieras desde el botón Calibrar Accesibilidad.', 'polite');
  };

  const handleNext = () => setStep(s => Math.min(TOTAL_STEPS, s + 1));
  const handleBack = () => setStep(s => Math.max(1, s - 1));

  const handleReadStep = () => speak(STEP_NARRATION[step - 1], { force: true });

  const brillo = Number(settings.brillo) || 100;

  return (
    <div className="modal-overlay a11y-onboarding-overlay">
      <FocusTrap
        role="dialog"
        onClose={handleSkip}
        ariaLabel="Asistente de calibración de accesibilidad"
        ariaDescribedBy="onboarding-progress"
      >
        <div className="modal-content onboarding-content" onClick={(e) => e.stopPropagation()}>
          {/* Cabecera */}
          <div className="onboarding-header">
            <div className="onboarding-icon" aria-hidden="true">
              <Gamepad2 size={26} />
            </div>
            <div style={{ flex: 1 }}>
              <p id="onboarding-progress" className="onboarding-progress-text">
                Paso {step} de {TOTAL_STEPS}
              </p>
              <h2 ref={headingRef} tabIndex={-1} className="onboarding-title">
                {STEP_TITLES[step - 1]}
              </h2>
            </div>
          </div>

          <div
            className="onboarding-progress-bar"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={TOTAL_STEPS}
            aria-valuenow={step}
            aria-valuetext={`Paso ${step} de ${TOTAL_STEPS}`}
            aria-label="Progreso del asistente"
          >
            <span style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
          </div>

          {/* PASO 1: Brillo y contraste */}
          {step === 1 && (
            <section className="onboarding-step" aria-labelledby="calib-instructions">
              <p id="calib-instructions" className="onboarding-instruction">
                Ajusta el contraste hasta que el símbolo de la izquierda sea <strong>apenas visible</strong> y
                el de la derecha sea <strong>claramente visible</strong>.
              </p>

              <div className="calibration-box">
                <div className="calibration-cell">
                  <CalibrationSymbol shape="circle" color="var(--calib-faint)" label="Símbolo izquierdo: debe ser apenas visible" />
                  <span>Apenas visible</span>
                </div>
                <div className="calibration-cell">
                  <CalibrationSymbol shape="triangle" color="var(--calib-mid)" label="Símbolo central: visibilidad media" />
                  <span>Intermedio</span>
                </div>
                <div className="calibration-cell">
                  <CalibrationSymbol shape="square" color="var(--calib-strong)" label="Símbolo derecho: debe ser claramente visible" />
                  <span>Claramente visible</span>
                </div>
              </div>

              <div className="calibration-controls">
                <label htmlFor="calib-brightness" className="calibration-label">
                  <Sun size={16} aria-hidden="true" /> Brillo de la pantalla: <strong>{brillo}%</strong>
                </label>
                <input
                  id="calib-brightness"
                  type="range"
                  min="60"
                  max="140"
                  step="5"
                  value={brillo}
                  onChange={(e) => updateSettings({ brillo: Number(e.target.value) })}
                  aria-valuetext={`${brillo} por ciento`}
                  className="calibration-slider"
                />
                <div className="calibration-actions">
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    onClick={() => updateSettings({ brillo: 100 })}
                  >
                    <RotateCcw size={14} aria-hidden="true" />
                    <span>Restablecer brillo</span>
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${settings.altoContraste ? 'btn-primary' : 'btn-secondary'}`}
                    aria-pressed={settings.altoContraste}
                    onClick={() => updateSettings({ altoContraste: !settings.altoContraste })}
                  >
                    <Eye size={14} aria-hidden="true" />
                    <span>Modo Alto Contraste (WCAG AAA): {settings.altoContraste ? 'Activado' : 'Desactivado'}</span>
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* PASO 2: Daltonismo */}
          {step === 2 && (
            <section className="onboarding-step" aria-labelledby="cb-heading">
              <p id="cb-heading" className="onboarding-instruction">
                <Palette size={16} aria-hidden="true" style={{ verticalAlign: 'text-bottom' }} />{' '}
                Elige la paleta que mejor distingas. El cambio se aplica al instante.
              </p>

              {/* Test visual de contraste */}
              <div className="contrast-test" aria-label="Prueba visual de contraste de texto">
                <p style={{ color: 'var(--text-main)', fontWeight: 700 }}>Texto principal: ¿se lee con comodidad?</p>
                <p style={{ color: 'var(--text-muted)' }}>Texto secundario: debe poder leerse sin esfuerzo.</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Texto de apoyo (tamaño pequeño).</p>
              </div>

              <fieldset className="color-mode-fieldset">
                <legend className="sr-only">Modo de color</legend>
                <div className="color-mode-grid" role="radiogroup" aria-label="Modo de daltonismo">
                  {COLOR_MODES.map(mode => {
                    const selected = (settings.daltonismo || 'estandar') === mode.id;
                    return (
                      <label
                        key={mode.id}
                        htmlFor={`cb-${mode.id}`}
                        className={`color-mode-card ${selected ? 'selected' : ''}`}
                      >
                        <input
                          id={`cb-${mode.id}`}
                          type="radio"
                          name="color-mode"
                          value={mode.id}
                          checked={selected}
                          onChange={() => {
                            updateSettings({ daltonismo: mode.id });
                            announce(`Paleta seleccionada: ${mode.nombre}.`, 'polite');
                          }}
                        />
                        <span className="color-mode-text">
                          <strong>{mode.nombre}</strong>
                          <small>{mode.detalle}</small>
                        </span>
                        {selected && <Check size={16} aria-hidden="true" />}
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              {/* Vista previa en tiempo real: color + ícono + etiqueta */}
              <div className="badge-preview" role="group" aria-label="Vista previa de las etiquetas de estado de tareas">
                <span className="badge badge-completed">
                  <CheckCircle2 size={13} aria-hidden="true" />
                  <span aria-hidden="true">✓</span>
                  <span>Finalizada</span>
                </span>
                <span className="badge badge-progress">
                  <PlayCircle size={13} aria-hidden="true" />
                  <span aria-hidden="true">⏳</span>
                  <span>En progreso</span>
                </span>
                <span className="badge badge-pending">
                  <Clock size={13} aria-hidden="true" />
                  <span aria-hidden="true">⏳</span>
                  <span>Pendiente</span>
                </span>
                <span className="badge badge-danger">
                  <XCircle size={13} aria-hidden="true" />
                  <span aria-hidden="true">✗</span>
                  <span>No realizada</span>
                </span>
              </div>
              <p className="onboarding-hint">
                Cada estado se identifica por <strong>color + ícono + texto + estilo de borde</strong>, nunca solo por color.
              </p>
            </section>
          )}

          {/* PASO 3: Ceguera y baja visión */}
          {step === 3 && (
            <section className="onboarding-step" aria-labelledby="blind-heading">
              <p id="blind-heading" className="onboarding-instruction">
                Estas opciones complementan (no reemplazan) a tu lector de pantalla, si usas uno.
              </p>

              <Switch
                id="sw-tts"
                checked={Boolean(settings.lecturaVoz)}
                onChange={(value) => {
                  updateSettings({ lecturaVoz: value });
                  if (value) speak('Lectura en voz alta activada.', { force: true });
                  else stopSpeaking();
                }}
                label="Lectura en voz alta (TTS)"
                description={
                  isSpeechSupported
                    ? 'Lee en voz alta los avisos de la aplicación usando la síntesis de voz de tu navegador.'
                    : 'Tu navegador no ofrece síntesis de voz (Web Speech API).'
                }
              />
              {isSpeechSupported && (
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={() => speak('Esta es una prueba de lectura en voz alta del Calendario Estudiantil.', { force: true })}
                >
                  <Volume2 size={14} aria-hidden="true" />
                  <span>Probar voz</span>
                </button>
              )}

              <Switch
                id="sw-sounds"
                checked={Boolean(settings.sonidos)}
                onChange={(value) => {
                  updateSettings({ sonidos: value });
                  if (value) playSound('success', { force: true });
                }}
                label="Sonidos discretos del sistema"
                description="Tonos suaves y breves para avisos, confirmaciones y alertas."
              />
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={() => playSound('success', { force: true })}
              >
                <Volume2 size={14} aria-hidden="true" />
                <span>Probar sonido</span>
              </button>

              <div className="shortcuts-box">
                <h3 className="shortcuts-title"><Keyboard size={16} aria-hidden="true" /> Atajos de teclado</h3>
                <ul>
                  <li><kbd>Alt + N</kbd> Nueva tarea (administradores)</li>
                  <li><kbd>Alt + C</kbd> Ir al calendario</li>
                  <li><kbd>Alt + L</kbd> Ir a la agenda / lista</li>
                  <li><kbd>Esc</kbd> Cerrar ventanas</li>
                </ul>
              </div>
            </section>
          )}

          {/* PASO 4: Discapacidad auditiva */}
          {step === 4 && (
            <section className="onboarding-step" aria-labelledby="deaf-heading">
              <p id="deaf-heading" className="onboarding-instruction">
                Recibe todos los avisos como mensajes flotantes visibles, sin depender de señales acústicas.
              </p>

              <Switch
                id="sw-toasts"
                checked={Boolean(settings.alertasVisuales)}
                onChange={(value) => {
                  updateSettings({ alertasVisuales: value });
                  if (value) showToast('Alertas visuales activadas. Verás los avisos aquí.', 'success');
                }}
                label="Alertas visuales (banners flotantes)"
                description="Cada aviso del sistema aparece como un banner con ícono y etiqueta de texto."
              />

              <div className="toast-test-actions">
                <button type="button" className="btn btn-sm btn-secondary" onClick={() => showToast('Así se verá un aviso informativo.', 'info')}>
                  <BellRing size={14} aria-hidden="true" /><span>Probar aviso</span>
                </button>
                <button type="button" className="btn btn-sm btn-secondary" onClick={() => showToast('Así se verá una alerta importante.', 'warning')}>
                  <BellRing size={14} aria-hidden="true" /><span>Probar alerta</span>
                </button>
              </div>
            </section>
          )}

          {/* Pie: Omitir SIEMPRE visible */}
          <div className="onboarding-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleSkip}
              aria-label="Omitir el asistente y usar la configuración por defecto"
            >
              <SkipForward size={16} aria-hidden="true" />
              <span>Omitir</span>
            </button>

            <div className="onboarding-footer-right">
              {isSpeechSupported && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleReadStep}
                  aria-label="Leer este paso en voz alta"
                  title="Leer este paso en voz alta"
                >
                  <Volume2 size={16} aria-hidden="true" />
                  <span>Leer</span>
                </button>
              )}
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleBack}
                disabled={step === 1}
              >
                <ChevronLeft size={16} aria-hidden="true" />
                <span>Atrás</span>
              </button>
              {step < TOTAL_STEPS ? (
                <button type="button" className="btn btn-primary" onClick={handleNext}>
                  <span>Siguiente</span>
                  <ChevronRight size={16} aria-hidden="true" />
                </button>
              ) : (
                <button type="button" className="btn btn-primary" onClick={handleFinish}>
                  <Check size={16} aria-hidden="true" />
                  <span>Finalizar</span>
                </button>
              )}
            </div>
          </div>

          <style>{`
            .a11y-onboarding-overlay { z-index: 1500; }
            .onboarding-content {
              max-width: 680px;
              border-color: var(--primary-500);
              display: flex;
              flex-direction: column;
              gap: 1rem;
            }
            .onboarding-header { display: flex; align-items: center; gap: 0.9rem; }
            .onboarding-icon {
              background: var(--primary-glow);
              color: var(--primary-500);
              padding: 0.65rem;
              border-radius: var(--radius-md);
              display: flex;
            }
            .onboarding-progress-text {
              font-size: 0.78rem;
              font-weight: 700;
              letter-spacing: 0.05em;
              text-transform: uppercase;
              color: var(--text-muted);
              margin: 0;
            }
            .onboarding-title { font-size: 1.3rem; margin: 0; outline: none; }
            .onboarding-progress-bar {
              height: 6px;
              background: var(--bg-surface-elevated);
              border-radius: var(--radius-full);
              overflow: hidden;
            }
            .onboarding-progress-bar span {
              display: block;
              height: 100%;
              background: var(--primary-500);
              transition: width var(--transition-normal);
            }
            .onboarding-step { display: flex; flex-direction: column; gap: 0.85rem; }
            .onboarding-instruction { color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; }
            .onboarding-hint { color: var(--text-secondary); font-size: 0.82rem; }

            .calibration-box {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 0.5rem;
              background-color: var(--calib-bg);
              border: 2px solid var(--border-normal);
              border-radius: var(--radius-md);
              padding: 1.25rem 0.5rem 0.75rem;
            }
            .calibration-cell {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 0.5rem;
              font-size: 0.75rem;
              color: var(--text-secondary);
            }
            .calibration-controls { display: flex; flex-direction: column; gap: 0.6rem; }
            .calibration-label { display: flex; align-items: center; gap: 0.4rem; font-weight: 600; font-size: 0.9rem; }
            .calibration-slider { width: 100%; height: 28px; accent-color: var(--primary-500); cursor: pointer; }
            .calibration-actions { display: flex; flex-wrap: wrap; gap: 0.5rem; }

            .contrast-test {
              background: var(--bg-surface-elevated);
              border: 1px solid var(--border-normal);
              border-radius: var(--radius-md);
              padding: 0.75rem 1rem;
              display: flex;
              flex-direction: column;
              gap: 0.2rem;
              font-size: 0.92rem;
            }
            .color-mode-fieldset { border: none; padding: 0; }
            .color-mode-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 0.5rem; }
            .color-mode-card {
              display: flex;
              align-items: center;
              gap: 0.65rem;
              padding: 0.65rem 0.8rem;
              background: var(--bg-surface-elevated);
              border: 2px solid var(--border-normal);
              border-radius: var(--radius-md);
              cursor: pointer;
            }
            .color-mode-card:hover { border-color: var(--border-focus); }
            .color-mode-card.selected { border-color: var(--primary-500); background: var(--primary-glow); }
            .color-mode-card input { width: 18px; height: 18px; accent-color: var(--primary-500); }
            .color-mode-text { display: flex; flex-direction: column; flex: 1; font-size: 0.88rem; }
            .color-mode-text small { color: var(--text-muted); font-size: 0.76rem; }
            .badge-preview { display: flex; flex-wrap: wrap; gap: 0.5rem; padding: 0.5rem 0; }

            .a11y-switch-row {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 1rem;
              padding: 0.7rem 0.9rem;
              background: var(--bg-surface-elevated);
              border: 1px solid var(--border-normal);
              border-radius: var(--radius-md);
            }
            .a11y-switch-label { font-weight: 700; font-size: 0.92rem; cursor: pointer; }
            .a11y-switch-desc { font-size: 0.8rem; color: var(--text-muted); margin-top: 0.15rem; }
            .a11y-switch {
              display: inline-flex;
              align-items: center;
              gap: 0.5rem;
              flex-shrink: 0;
              padding: 0.3rem 0.6rem;
              font-family: inherit;
              font-size: 0.78rem;
              font-weight: 700;
              color: var(--text-main);
              background: var(--bg-surface);
              border: 2px solid var(--border-normal);
              border-radius: var(--radius-full);
              cursor: pointer;
            }
            .a11y-switch.on { border-color: var(--status-completed-border); background: var(--status-completed-bg); color: var(--status-completed-text); }
            .a11y-switch-knob {
              width: 14px; height: 14px; border-radius: 50%;
              background: var(--text-muted);
            }
            .a11y-switch.on .a11y-switch-knob { background: var(--status-completed-border); }

            .shortcuts-box {
              background: var(--bg-surface-elevated);
              border: 1px dashed var(--border-normal);
              border-radius: var(--radius-md);
              padding: 0.75rem 1rem;
            }
            .shortcuts-title { font-size: 0.95rem; display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.4rem; }
            .shortcuts-box ul { list-style: none; display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 0.35rem; font-size: 0.85rem; }
            .shortcuts-box kbd {
              background: var(--bg-surface);
              padding: 2px 6px;
              border-radius: 4px;
              border: 1px solid var(--border-normal);
              font-family: monospace;
              font-weight: bold;
              margin-right: 0.35rem;
            }
            .toast-test-actions { display: flex; flex-wrap: wrap; gap: 0.5rem; }

            .onboarding-footer {
              display: flex;
              align-items: center;
              justify-content: space-between;
              flex-wrap: wrap;
              gap: 0.6rem;
              padding-top: 0.9rem;
              border-top: 1px solid var(--border-subtle);
            }
            .onboarding-footer-right { display: flex; align-items: center; flex-wrap: wrap; gap: 0.5rem; }
            .btn:disabled { opacity: 0.5; cursor: not-allowed; }
          `}</style>
        </div>
      </FocusTrap>
    </div>
  );
};

export const A11yOnboardingModal = () => {
  const { isOnboardingOpen } = useA11y();
  if (!isOnboardingOpen) return null;
  return <OnboardingContent />;
};
