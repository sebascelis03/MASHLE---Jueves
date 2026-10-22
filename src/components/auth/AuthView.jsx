import React, { useState } from 'react';
import { useAuthGroup } from '../../context/AuthGroupContext';
import { useA11y } from '../../context/A11yContext';
import { LogIn, UserPlus, GraduationCap, Eye, EyeOff, AlertCircle, Key, Mail, User, ShieldCheck } from 'lucide-react';

export const AuthView = () => {
  const { login, register, mockAccounts } = useAuthGroup();
  const { announce } = useA11y();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleTabChange = (newMode) => {
    setMode(newMode);
    setErrorMsg('');
    announce(newMode === 'login' ? 'Formulario de inicio de sesión activo.' : 'Formulario de registro estudiantil activo.', 'polite');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (mode === 'login') {
      const res = login(email, password);
      if (!res.success) {
        setErrorMsg(res.error);
      }
    } else {
      if (!nombre.trim()) {
        setErrorMsg('Por favor escribe tu nombre completo.');
        return;
      }
      const res = register({ email, password, nombre });
      if (!res.success) {
        setErrorMsg(res.error);
      }
    }
  };

  const handleQuickFill = (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setMode('login');
    setErrorMsg('');
    announce(`Campos autocompletados con la cuenta ${acc.nombre}. Puedes iniciar sesión.`, 'polite');
  };

  return (
    <div className="auth-container" role="main" aria-label="Portal de Acceso Estudiantil">
      <div className="auth-card card">
        {/* Cabecera del Portal */}
        <div className="auth-header">
          <div className="auth-logo-badge" aria-hidden="true">
            <GraduationCap size={36} color="#3b82f6" />
          </div>
          <h1 className="auth-title">Calendario Estudiantil</h1>
          <p className="auth-subtitle">
            Plataforma inclusiva y accesible para comunidades escolares
          </p>
        </div>

        {/* Pestañas de Login y Registro */}
        <div className="auth-tabs" role="tablist" aria-label="Modo de autenticación">
          <button
            type="button"
            role="tab"
            id="tab-login"
            aria-selected={mode === 'login'}
            aria-controls="panel-login-form"
            className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => handleTabChange('login')}
          >
            <LogIn size={16} aria-hidden="true" />
            <span>Iniciar Sesión</span>
          </button>
          <button
            type="button"
            role="tab"
            id="tab-register"
            aria-selected={mode === 'register'}
            aria-controls="panel-register-form"
            className={`auth-tab-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => handleTabChange('register')}
          >
            <UserPlus size={16} aria-hidden="true" />
            <span>Crear Cuenta</span>
          </button>
        </div>

        {/* Mensaje de Error Accesible */}
        {errorMsg && (
          <div 
            className="auth-error-box" 
            role="alert" 
            aria-live="assertive"
          >
            <AlertCircle size={18} aria-hidden="true" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Formulario Principal */}
        <form onSubmit={handleSubmit} className="auth-form" id={mode === 'login' ? 'panel-login-form' : 'panel-register-form'} role="tabpanel">
          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="auth-nombre-input" className="label">
                <span>Nombre Completo del Estudiante *</span>
              </label>
              <div className="input-with-icon">
                <User size={16} className="input-icon" aria-hidden="true" />
                <input
                  id="auth-nombre-input"
                  type="text"
                  className="input with-icon"
                  placeholder="Ej. Carlos Mendoza"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  autoComplete="name"
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="auth-email-input" className="label">
              <span>Correo Electrónico Institucional *</span>
            </label>
            <div className="input-with-icon">
              <Mail size={16} className="input-icon" aria-hidden="true" />
              <input
                id="auth-email-input"
                type="email"
                className="input with-icon"
                placeholder="ejemplo: prueba1@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="auth-password-input" className="label">
              <span>Contraseña *</span>
            </label>
            <div className="input-with-icon">
              <Key size={16} className="input-icon" aria-hidden="true" />
              <input
                id="auth-password-input"
                type={showPassword ? 'text' : 'password'}
                className="input with-icon with-eye"
                placeholder="Ingresa tu contraseña (ej. 1234)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                required
              />
              <button
                type="button"
                className="btn-eye"
                onClick={() => setShowPassword(prev => !prev)}
                aria-label={showPassword ? "Ocultar texto de contraseña" : "Ver texto de contraseña"}
                title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-submit-auth"
            aria-label={mode === 'login' ? "Ingresar a mi cuenta" : "Registrar mi cuenta estudiantil"}
          >
            {mode === 'login' ? (
              <>
                <LogIn size={18} aria-hidden="true" />
                <span>Ingresar al Calendario</span>
              </>
            ) : (
              <>
                <UserPlus size={18} aria-hidden="true" />
                <span>Crear Cuenta Estudiantil</span>
              </>
            )}
          </button>
        </form>

        {/* Panel de Cuentas Mock de Prueba Rápida */}
        <div className="mock-accounts-section" role="region" aria-label="Cuentas de prueba para desarrollo y demostración">
          <div className="mock-accounts-title">
            <ShieldCheck size={16} color="#38bdf8" aria-hidden="true" />
            <span>Cuentas de Prueba Disponibles (Mocks)</span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 0.75rem' }}>
            Haz clic en cualquiera para autocompletar y probar los distintos roles y permisos:
          </p>

          <div className="mock-list">
            {mockAccounts.map(acc => (
              <button
                key={acc.id}
                type="button"
                onClick={() => handleQuickFill(acc)}
                className="mock-item-btn"
                aria-label={`Usar cuenta de prueba de ${acc.nombre}, correo ${acc.email}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: 'var(--text-main)' }}>{acc.nombre}</strong>
                  <span className={`badge ${acc.rol === 'admin' ? 'badge-pending' : 'badge-progress'}`} style={{ fontSize: '0.68rem' }}>
                    {acc.rol === 'admin' ? '👑 Admin' : '🎒 Estudiante'}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--primary-500)', marginTop: '2px' }}>
                  {acc.email} · Clave: {acc.password}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {acc.descripcionRol}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .auth-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 120px);
          padding: 2rem 1rem;
        }
        .auth-card {
          max-width: 480px;
          width: 100%;
          border: 1.5px solid var(--border-normal);
          border-radius: var(--radius-xl);
          padding: 2rem;
          box-shadow: var(--shadow-lg);
          background-color: var(--bg-surface);
        }
        .auth-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .auth-logo-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(59, 130, 246, 0.15);
          width: 64px;
          height: 64px;
          border-radius: var(--radius-lg);
          margin-bottom: 0.75rem;
        }
        .auth-title {
          font-size: 1.5rem;
          margin: 0;
          color: var(--text-main);
        }
        .auth-subtitle {
          font-size: 0.88rem;
          color: var(--text-muted);
          margin: 0.35rem 0 0;
        }
        .auth-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
          background-color: var(--bg-surface-elevated);
          padding: 0.3rem;
          border-radius: var(--radius-md);
          margin-bottom: 1.25rem;
        }
        .auth-tab-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          padding: 0.55rem;
          border-radius: var(--radius-sm);
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 0.88rem;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .auth-tab-btn.active {
          background-color: var(--bg-surface);
          color: var(--text-main);
          box-shadow: var(--shadow-sm);
        }
        .auth-error-box {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background-color: rgba(239, 68, 68, 0.15);
          border: 1px solid #ef4444;
          color: #f87171;
          padding: 0.65rem 0.85rem;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          margin-bottom: 1rem;
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
        }
        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: 0.85rem;
          color: var(--text-secondary);
          pointer-events: none;
        }
        .input.with-icon {
          padding-left: 2.35rem;
        }
        .input.with-eye {
          padding-right: 2.5rem;
        }
        .btn-eye {
          position: absolute;
          right: 0.75rem;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.2rem;
        }
        .btn-submit-auth {
          margin-top: 0.5rem;
          padding: 0.75rem;
          font-size: 0.95rem;
        }
        .mock-accounts-section {
          margin-top: 1.5rem;
          padding-top: 1.25rem;
          border-top: 1px solid var(--border-subtle);
        }
        .mock-accounts-title {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 0.35rem;
        }
        .mock-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .mock-item-btn {
          text-align: left;
          background-color: var(--bg-surface-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.65rem 0.85rem;
          cursor: pointer;
          transition: border-color var(--transition-fast), background-color var(--transition-fast);
        }
        .mock-item-btn:hover {
          border-color: var(--border-focus);
          background-color: var(--bg-surface-hover);
        }
      `}</style>
    </div>
  );
};
