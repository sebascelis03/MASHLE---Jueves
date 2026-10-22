import React, { useState, useEffect } from 'react';
import { A11yProvider, useA11y } from './context/A11yContext';
import { AuthGroupProvider, useAuthGroup } from './context/AuthGroupContext';
import { TaskProvider, useTasks } from './context/TaskContext';

import { SkipLink } from './components/a11y/SkipLink';
import { LiveAnnouncer } from './components/a11y/LiveAnnouncer';
import { A11yControls } from './components/a11y/A11yControls';
import { A11yOnboardingModal } from './components/a11y/A11yOnboardingModal';
import { ToastHost } from './components/a11y/ToastHost';
import { PWAInstallBanner } from './components/common/PWAInstallBanner';

import { AuthView } from './components/auth/AuthView';
import { CalendarGrid } from './components/calendar/CalendarGrid';
import { AgendaView } from './components/calendar/AgendaView';
import { GroupCommunityView } from './components/community/GroupCommunityView';
import { GroupAdminPanel } from './components/admin/GroupAdminPanel';

import { TaskFormModal } from './components/tasks/TaskFormModal';
import { GroupWarningDialog } from './components/community/GroupWarningDialog';
import { SuccessionModal } from './components/admin/SuccessionModal';

import { 
  Calendar as CalIcon, 
  CheckSquare, 
  Users, 
  ShieldCheck, 
  Plus, 
  GraduationCap, 
  Crown,
  LogOut
} from 'lucide-react';

const MainLayout = () => {
  const [activeTab, setActiveTab] = useState('calendar'); // 'calendar' | 'agenda' | 'community' | 'admin'
  const { currentGroup, currentUser, isAdmin, isAuthenticated, logout } = useAuthGroup();
  const { setIsTaskModalOpen, setEditingTask } = useTasks();
  const { announce } = useA11y();

  // Escuchar atajos globales de teclado cuando está autenticado
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleKeyDown = (e) => {
      // Alt + N: Nueva Tarea (solo el administrador crea tareas oficiales)
      if (e.altKey && (e.key === 'n' || e.key === 'N')) {
        e.preventDefault();
        if (!isAdmin) {
          announce('Solo el administrador del grupo puede crear tareas. Puedes llevar tu propio seguimiento en cada tarea.', 'polite');
          return;
        }
        setEditingTask(null);
        setIsTaskModalOpen(true);
        announce('Ventana para crear nueva tarea abierta.', 'polite');
      }
      // Alt + C: Vista Calendario
      if (e.altKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        setActiveTab('calendar');
        announce('Cambiado a vista Calendario.', 'polite');
      }
      // Alt + L: Vista Lista / Agenda
      if (e.altKey && (e.key === 'l' || e.key === 'L')) {
        e.preventDefault();
        setActiveTab('agenda');
        announce('Cambiado a vista Lista y Progresión.', 'polite');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthenticated, isAdmin, setIsTaskModalOpen, setEditingTask, announce]);

  const handleTabChange = (tabId, label) => {
    setActiveTab(tabId);
    announce(`Pestaña activa: ${label}`, 'polite');
  };

  const openNewTaskModal = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  return (
    <div className="app-shell">
      <SkipLink />
      <LiveAnnouncer />
      <A11yControls />
      <PWAInstallBanner />
      <A11yOnboardingModal />
      <ToastHost />

      {/* Barra de Navegación y Encabezado Principal */}
      <header className="app-header" role="banner">
        <div className="header-container">
          <div className="brand-group">
            <div className="brand-icon-wrap" aria-hidden="true">
              <GraduationCap size={28} color="#3b82f6" />
            </div>
            <div>
              <h1 className="brand-title">Calendario Estudiantil</h1>
              {isAuthenticated ? (
                <div className="student-badge">
                  <span className="student-name">{currentUser?.nombre}</span>
                  <span className="student-group-chip">
                    {isAdmin ? <Crown size={12} color="#eab308" aria-hidden="true" /> : null}
                    {currentGroup?.nombre || 'Sin Grupo Asignado'}
                  </span>
                </div>
              ) : (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Portal de Acceso para Estudiantes
                </span>
              )}
            </div>
          </div>

          {isAuthenticated ? (
            <div className="header-actions">
              {isAdmin && (
                <button
                  type="button"
                  onClick={openNewTaskModal}
                  className="btn btn-primary"
                  aria-label="Crear nueva tarea escolar (Atajo de teclado Alt + N)"
                  title="Atajo: Alt + N"
                >
                  <Plus size={18} aria-hidden="true" />
                  <span>Nueva Tarea (Alt+N)</span>
                </button>
              )}

              <button
                type="button"
                onClick={logout}
                className="btn btn-secondary"
                aria-label={`Cerrar sesión de ${currentUser?.nombre}`}
                title="Cerrar sesión"
              >
                <LogOut size={16} aria-hidden="true" />
                <span>Salir</span>
              </button>
            </div>
          ) : null}
        </div>

        {/* Pestañas de Navegación Accesibles (solo si ha iniciado sesión) */}
        {isAuthenticated && (
          <nav className="tabs-nav" role="navigation" aria-label="Navegación principal de la aplicación">
            <div className="tabs-list" role="tablist">
              <button
                type="button"
                role="tab"
                id="tab-calendar"
                aria-selected={activeTab === 'calendar'}
                aria-controls="panel-calendar"
                tabIndex={activeTab === 'calendar' ? 0 : -1}
                onClick={() => handleTabChange('calendar', 'Calendario')}
                className={`nav-tab-btn ${activeTab === 'calendar' ? 'active' : ''}`}
              >
                <CalIcon size={18} aria-hidden="true" />
                <span>Calendario (Alt+C)</span>
              </button>

              <button
                type="button"
                role="tab"
                id="tab-agenda"
                aria-selected={activeTab === 'agenda'}
                aria-controls="panel-agenda"
                tabIndex={activeTab === 'agenda' ? 0 : -1}
                onClick={() => handleTabChange('agenda', 'Lista y Progresión')}
                className={`nav-tab-btn ${activeTab === 'agenda' ? 'active' : ''}`}
              >
                <CheckSquare size={18} aria-hidden="true" />
                <span>Lista & Progresión (Alt+L)</span>
              </button>

              <button
                type="button"
                role="tab"
                id="tab-community"
                aria-selected={activeTab === 'community'}
                aria-controls="panel-community"
                tabIndex={activeTab === 'community' ? 0 : -1}
                onClick={() => handleTabChange('community', 'Mi Comunidad')}
                className={`nav-tab-btn ${activeTab === 'community' ? 'active' : ''}`}
              >
                <Users size={18} aria-hidden="true" />
                <span>Mi Comunidad</span>
              </button>

              <button
                type="button"
                role="tab"
                id="tab-admin"
                aria-selected={activeTab === 'admin'}
                aria-controls="panel-admin"
                tabIndex={activeTab === 'admin' ? 0 : -1}
                onClick={() => handleTabChange('admin', 'Panel de Administración')}
                className={`nav-tab-btn ${activeTab === 'admin' ? 'active' : ''}`}
              >
                <ShieldCheck size={18} aria-hidden="true" />
                <span>Panel Admin {isAdmin ? '👑' : ''}</span>
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* Contenido Principal */}
      <main id="main-content" className="main-content" tabIndex={-1} role="main">
        {!isAuthenticated ? (
          <AuthView />
        ) : (
          <>
            {activeTab === 'calendar' && (
              <div role="tabpanel" id="panel-calendar" aria-labelledby="tab-calendar">
                <div className="calendar-layout-view">
                  <CalendarGrid />
                  <div style={{ marginTop: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>📋 Tareas del Día y Próximas</h3>
                    <AgendaView />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'agenda' && (
              <div role="tabpanel" id="panel-agenda" aria-labelledby="tab-agenda">
                <AgendaView />
              </div>
            )}

            {activeTab === 'community' && (
              <div role="tabpanel" id="panel-community" aria-labelledby="tab-community">
                <GroupCommunityView />
              </div>
            )}

            {activeTab === 'admin' && (
              <div role="tabpanel" id="panel-admin" aria-labelledby="tab-admin">
                <GroupAdminPanel />
              </div>
            )}

            {/* Modales y Cuadros de Diálogo */}
            <TaskFormModal />
            <GroupWarningDialog />
            <SuccessionModal />
          </>
        )}
      </main>

      {/* Pie de Página Accesible */}
      <footer className="app-footer" role="contentinfo">
        <div className="footer-content">
          <p>
            <strong>Calendario Estudiantil PWA</strong> — Diseñado con pilares de <strong>Accesibilidad (WCAG 2.1 AA/AAA)</strong> y <strong>Usabilidad</strong>.
          </p>
          <div className="footer-tags">
            <span>🔑 Autenticación & Cuentas Mock</span>
            <span>⌨️ Navegación 100% por Teclado</span>
            <span>📱 PWA Instalable & Offline</span>
            <span>💬 Enlaces WhatsApp Integrados</span>
            <span>🛡️ Sucesión de Roles Garantizada</span>
          </div>
        </div>
      </footer>

      <style>{`
        .app-shell {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .app-header {
          background-color: var(--bg-surface);
          border-bottom: 1px solid var(--border-subtle);
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .header-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem 1.25rem 0.75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .brand-group {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }
        .brand-icon-wrap {
          background: rgba(59, 130, 246, 0.15);
          padding: 0.5rem;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .brand-title {
          font-size: 1.35rem;
          margin: 0;
          letter-spacing: -0.02em;
        }
        .student-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.82rem;
          margin-top: 0.2rem;
          flex-wrap: wrap;
        }
        .student-name {
          color: var(--text-muted);
          font-weight: 600;
        }
        .student-group-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          background: var(--bg-surface-elevated);
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-normal);
          font-weight: 700;
          color: var(--text-main);
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .tabs-nav {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.25rem;
        }
        .tabs-list {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          padding-bottom: 0.25rem;
        }
        .nav-tab-btn {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.65rem 1rem;
          font-family: inherit;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-secondary);
          background: transparent;
          border: none;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          white-space: nowrap;
          transition: all var(--transition-fast);
        }
        .nav-tab-btn:hover {
          color: var(--text-main);
          background-color: var(--bg-surface-subtle);
        }
        .nav-tab-btn.active {
          color: var(--primary-500);
          border-bottom-color: var(--primary-500);
          font-weight: 700;
        }
        .main-content {
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          padding: 1.5rem 1.25rem;
          flex: 1;
          outline: none;
        }
        .app-footer {
          margin-top: auto;
          background-color: var(--bg-surface);
          border-top: 1px solid var(--border-subtle);
          padding: 1.5rem 1.25rem;
        }
        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
          font-size: 0.85rem;
          color: var(--text-secondary);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .footer-tags {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
          font-size: 0.78rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};

export default function App() {
  return (
    <A11yProvider>
      <AuthGroupProvider>
        <TaskProvider>
          <MainLayout />
        </TaskProvider>
      </AuthGroupProvider>
    </A11yProvider>
  );
}
