import React, { useState } from 'react';
import { FocusTrap } from '../a11y/FocusTrap';
import { useAuthGroup } from '../../context/AuthGroupContext';
import { storageService } from '../../services/storageService';
import {
  User,
  Key,
  Save,
  X,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Users
} from 'lucide-react';

export const ProfileModal = ({ isOpen, onClose }) => {
  const {
    currentUser,
    currentGroup,
    isAdmin,
    updateMyProfile,
    quickSwitchAccount,
    loadDemoData,
    resetSystemData
  } = useAuthGroup();

  const [nombre, setNombre] = useState(() => currentUser?.nombre || '');
  const [newPassword, setNewPassword] = useState('');
  const [feedback, setFeedback] = useState(null);

  if (!isOpen || !currentUser) return null;

  const allAccounts = storageService.getUsers();

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const res = updateMyProfile({
      nombre,
      password: newPassword.trim() || undefined
    });
    if (res.success) {
      setNewPassword('');
      setFeedback({ type: 'success', text: 'Tus datos de perfil se han actualizado.' });
    } else {
      setFeedback({ type: 'error', text: res.error });
    }
  };

  const handleQuickSwitch = (username) => {
    const res = quickSwitchAccount(username);
    if (res.success) {
      setNombre(res.user.nombre);
      setNewPassword('');
      setFeedback({
        type: 'success',
        text: `Ahora estás usando la cuenta ${res.user.nombre} (${res.user.username}).`
      });
    }
  };

  const handleLoadDemo = () => {
    loadDemoData(currentUser.username || 'admin1');
    setFeedback({
      type: 'success',
      text: '¡Escenario Demo cargado con comunidades, materias, tareas y progreso!'
    });
  };

  const handleResetClean = () => {
    resetSystemData();
    setFeedback({
      type: 'success',
      text: 'Sistema reiniciado en blanco (7 cuentas listas sin grupos ni tareas).'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <FocusTrap
        role="dialog"
        ariaLabel="Mi Perfil y Herramientas de Demostración"
        onClose={onClose}
      >
        <div className="modal-content profile-modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="profile-modal-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="profile-avatar-badge" aria-hidden="true">
                <User size={24} color="#3b82f6" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Mi Perfil y Cambio Rápido</h2>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Usuario: <strong>{currentUser.username || currentUser.email}</strong> ·{' '}
                  {currentGroup ? `${currentGroup.nombre} (${isAdmin ? 'Admin' : 'Estudiante'})` : 'Sin comunidad asignada'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-sm btn-secondary"
              aria-label="Cerrar ventana de perfil"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          {feedback && (
            <div
              role={feedback.type === 'error' ? 'alert' : 'status'}
              className={`badge ${feedback.type === 'error' ? 'badge-danger' : 'badge-completed'}`}
              style={{ padding: '0.6rem 0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}
            >
              <CheckCircle2 size={16} aria-hidden="true" />
              <span>{feedback.text}</span>
            </div>
          )}

          {/* Formulario para editar nombre y contraseña */}
          <form onSubmit={handleSaveProfile} className="profile-form-section">
            <h3 style={{ fontSize: '0.98rem', margin: '0 0 0.65rem' }}>✏️ Editar Datos de Mi Cuenta</h3>
            <div className="profile-grid-2">
              <div>
                <label htmlFor="profile-name-input" className="label">Nombre Visible *</label>
                <input
                  id="profile-name-input"
                  type="text"
                  className="input"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="profile-pass-input" className="label">Nueva Contraseña (Opcional)</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Key size={15} style={{ position: 'absolute', left: '0.75rem', color: 'var(--text-muted)' }} aria-hidden="true" />
                  <input
                    id="profile-pass-input"
                    type="password"
                    className="input"
                    style={{ paddingLeft: '2.2rem' }}
                    placeholder="Dejar vacío para no cambiar"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.65rem' }}>
              <button type="submit" className="btn btn-sm btn-primary">
                <Save size={14} aria-hidden="true" />
                <span>Guardar Perfil</span>
              </button>
            </div>
          </form>

          {/* Cambio rápido de cuenta en 1 clic para sustentación */}
          <div className="profile-switch-section">
            <h3 style={{ fontSize: '0.98rem', margin: '0 0 0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Users size={16} color="#38bdf8" aria-hidden="true" />
              <span>Cambio Rápido de Cuenta (Para Sustentación en Vivo)</span>
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 0.65rem' }}>
              Alterna al instante entre Administrador y Estudiantes sin tener que cerrar sesión:
            </p>
            <div className="quick-accounts-grid" role="group" aria-label="Cuentas disponibles para cambio rápido">
              {allAccounts.map(acc => {
                const isCurrent = acc.id === currentUser.id;
                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => handleQuickSwitch(acc.username || acc.id)}
                    className={`quick-acc-btn ${isCurrent ? 'active' : ''}`}
                    aria-pressed={isCurrent}
                    aria-label={`Cambiar a cuenta ${acc.nombre} (${acc.username})`}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <strong>{acc.nombre}</strong>
                      <span style={{ fontSize: '0.72rem', opacity: 0.85 }}>
                        {acc.username?.startsWith('admin') ? '👑 Admin' : '🎒 User'}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {acc.username} · Clave: {acc.password}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Herramientas de Escenario Demo */}
          <div className="profile-demo-section">
            <h3 style={{ fontSize: '0.98rem', margin: '0 0 0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={16} color="#eab308" aria-hidden="true" />
              <span>Datos de Demostración para Sustentación</span>
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 0.75rem' }}>
              Carga un semestre completo (2 comunidades, 5 materias con WhatsApp, 6 tareas del mes actual, avances de estudiantes y solicitud pendiente) o limpia todo para empezar de cero.
            </p>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={handleLoadDemo}
                className="btn btn-sm btn-primary"
              >
                <Sparkles size={14} aria-hidden="true" />
                <span>⚡ Cargar Escenario Demo Completo</span>
              </button>
              <button
                type="button"
                onClick={handleResetClean}
                className="btn btn-sm btn-secondary"
              >
                <RotateCcw size={14} aria-hidden="true" />
                <span>🧹 Reiniciar Datos en Blanco</span>
              </button>
            </div>
          </div>

          <style>{`
            .profile-modal-content {
              max-width: 620px;
              display: flex;
              flex-direction: column;
              gap: 1rem;
            }
            .profile-modal-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 0.75rem;
            }
            .profile-avatar-badge {
              background: rgba(59, 130, 246, 0.15);
              padding: 0.6rem;
              border-radius: var(--radius-md);
              display: flex;
            }
            .profile-form-section, .profile-switch-section, .profile-demo-section {
              background: var(--bg-surface-elevated);
              border: 1px solid var(--border-subtle);
              border-radius: var(--radius-md);
              padding: 0.9rem 1rem;
            }
            .profile-grid-2 {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
              gap: 0.75rem;
            }
            .quick-accounts-grid {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(155px, 1fr));
              gap: 0.5rem;
            }
            .quick-acc-btn {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              gap: 0.15rem;
              padding: 0.5rem 0.65rem;
              border-radius: var(--radius-sm);
              background: var(--bg-surface);
              border: 1.5px solid var(--border-normal);
              color: var(--text-main);
              cursor: pointer;
              text-align: left;
              transition: all var(--transition-fast);
            }
            .quick-acc-btn:hover {
              border-color: var(--border-focus);
            }
            .quick-acc-btn.active {
              border-color: var(--primary-500);
              background: var(--primary-glow);
            }
          `}</style>
        </div>
      </FocusTrap>
    </div>
  );
};
