import React, { useState } from 'react';
import './boceto.css';

export const BocetoView = ({ onSwitchToApp }) => {
  const [activeTab, setActiveTab] = useState('calendario'); // 'calendario' | 'tareas' | 'materias' | 'comunidad' | 'admin'
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Datos de ejemplo para la versión inicial
  const [tasks, setTasks] = useState([
    { id: 1, titulo: 'Taller de Cálculo Integral', materia: 'Matemáticas', fecha: '2026-10-26', estado: 'pendiente', prioridad: 'Alta' },
    { id: 2, titulo: 'Ensayo sobre Literatura Medieval', materia: 'Español', fecha: '2026-10-27', estado: 'en_progreso', prioridad: 'Media' },
    { id: 3, titulo: 'Laboratorio de Circuitos', materia: 'Física', fecha: '2026-10-28', estado: 'pendiente', prioridad: 'Alta' },
    { id: 4, titulo: 'Exposición Revolución Industrial', materia: 'Historia', fecha: '2026-10-24', estado: 'finalizada', prioridad: 'Baja' },
    { id: 5, titulo: 'Vocabulario Unidad 4', materia: 'Inglés', fecha: '2026-10-30', estado: 'pendiente', prioridad: 'Media' }
  ]);

  const [newTask, setNewTask] = useState({
    titulo: '',
    materia: 'Matemáticas',
    fecha: '2026-10-29',
    prioridad: 'Media'
  });

  const subjects = [
    { id: 'mat', nombre: 'Matemáticas', docente: 'Prof. Carlos Mendoza', whatsapp: 'https://chat.whatsapp.com/demo1' },
    { id: 'esp', nombre: 'Español y Literatura', docente: 'Prof. María Ortiz', whatsapp: 'https://chat.whatsapp.com/demo2' },
    { id: 'fis', nombre: 'Física Clásica', docente: 'Prof. Roberto Silva', whatsapp: 'https://chat.whatsapp.com/demo3' },
    { id: 'ing', nombre: 'Inglés Técnico', docente: 'Prof. Sarah Jenkins', whatsapp: 'https://chat.whatsapp.com/demo4' },
    { id: 'his', nombre: 'Historia Universal', docente: 'Prof. Álvaro Gómez', whatsapp: 'https://chat.whatsapp.com/demo5' }
  ];

  const members = [
    { id: 'u1', nombre: 'Juan Pérez (Tú)', rol: 'Administrador' },
    { id: 'u2', nombre: 'Ana María Gómez', rol: 'Estudiante' },
    { id: 'u3', nombre: 'Carlos Rodríguez', rol: 'Estudiante' },
    { id: 'u4', nombre: 'Luisa Fernanda Díaz', rol: 'Estudiante' }
  ];

  const handleSaveTask = (e) => {
    e.preventDefault();
    if (!newTask.titulo.trim()) return;
    setTasks(prev => [
      ...prev,
      {
        id: Date.now(),
        titulo: newTask.titulo,
        materia: newTask.materia,
        fecha: newTask.fecha,
        estado: 'pendiente',
        prioridad: newTask.prioridad
      }
    ]);
    setNewTask({ titulo: '', materia: 'Matemáticas', fecha: '2026-10-29', prioridad: 'Media' });
    setIsModalOpen(false);
  };

  const toggleTaskStatus = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const next = t.estado === 'pendiente' ? 'en_progreso' : (t.estado === 'en_progreso' ? 'finalizada' : 'pendiente');
        return { ...t, estado: next };
      }
      return t;
    }));
  };

  return (
    <div className="boceto-container">
      {/* Encabezado Principal */}
      <header className="boceto-header">
        <div className="boceto-header-inner">
          <div className="boceto-title-box">
            <h1>Calendario Estudiantil</h1>
            <p>Portal de Acceso para Estudiantes</p>
          </div>
          <div className="boceto-user-box">
            <div>
              <strong>Estudiante:</strong> Juan Pérez (Admin) &nbsp;|&nbsp; <strong>Grupo:</strong> Grado 11-A
            </div>
            <button 
              type="button" 
              className="boceto-btn" 
              onClick={() => alert('Sesión cerrada correctamente')}
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Pestañas de Navegación */}
      <nav className="boceto-nav">
        <div className="boceto-tabs">
          <button 
            type="button" 
            className={`boceto-tab-btn ${activeTab === 'calendario' ? 'active' : ''}`}
            onClick={() => setActiveTab('calendario')}
          >
            Calendario
          </button>
          <button 
            type="button" 
            className={`boceto-tab-btn ${activeTab === 'tareas' ? 'active' : ''}`}
            onClick={() => setActiveTab('tareas')}
          >
            Tablero & Lista
          </button>
          <button 
            type="button" 
            className={`boceto-tab-btn ${activeTab === 'materias' ? 'active' : ''}`}
            onClick={() => setActiveTab('materias')}
          >
            Materias & WhatsApp
          </button>
          <button 
            type="button" 
            className={`boceto-tab-btn ${activeTab === 'comunidad' ? 'active' : ''}`}
            onClick={() => setActiveTab('comunidad')}
          >
            Mi Comunidad
          </button>
          <button 
            type="button" 
            className={`boceto-tab-btn ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
          >
            Panel Admin
          </button>
        </div>
      </nav>

      {/* Contenido Principal por Pestañas */}
      <main className="boceto-main">
        {/* PESTAÑA 1: CALENDARIO */}
        {activeTab === 'calendario' && (
          <div>
            <div className="boceto-card">
              <div className="boceto-card-title">
                <span>Calendario de Actividades — Octubre 2026</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" className="boceto-btn">&lt; Anterior</button>
                  <button type="button" className="boceto-btn">Hoy</button>
                  <button type="button" className="boceto-btn">Siguiente &gt;</button>
                  <button 
                    type="button" 
                    className="boceto-btn boceto-btn-primary"
                    onClick={() => setIsModalOpen(true)}
                  >
                    + Nueva Tarea
                  </button>
                </div>
              </div>

              {/* Grilla 7x5 de Calendario */}
              <div className="boceto-calendar-grid">
                {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => (
                  <div key={d} className="boceto-cal-header">{d}</div>
                ))}
                
                {Array.from({ length: 31 }, (_, i) => {
                  const day = i + 1;
                  const dayTasks = tasks.filter(t => {
                    const dNum = parseInt(t.fecha.split('-')[2], 10);
                    return dNum === day;
                  });
                  const isToday = day === 24;

                  return (
                    <div key={day} className={`boceto-cal-cell ${isToday ? 'today' : ''}`}>
                      <span className="boceto-day-num">{day} {isToday ? '(Hoy)' : ''}</span>
                      {dayTasks.map(t => (
                        <div key={t.id} className="boceto-task-pill" title={t.titulo}>
                          • {t.titulo}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Listado de tareas del mes */}
            <div className="boceto-card">
              <div className="boceto-card-title">
                <span>Tareas Registradas para Octubre</span>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Total: {tasks.length}</span>
              </div>
              <table className="boceto-table">
                <thead>
                  <tr>
                    <th>Estado</th>
                    <th>Título</th>
                    <th>Materia</th>
                    <th>Fecha Entrega</th>
                    <th>Prioridad</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map(t => (
                    <tr key={t.id}>
                      <td>
                        <span style={{ 
                          fontWeight: 'bold',
                          color: t.estado === 'finalizada' ? '#047857' : (t.estado === 'en_progreso' ? '#b45309' : '#374151') 
                        }}>
                          {t.estado === 'pendiente' ? 'Pendiente' : (t.estado === 'en_progreso' ? 'En Progreso' : 'Finalizada')}
                        </span>
                      </td>
                      <td><strong>{t.titulo}</strong></td>
                      <td>{t.materia}</td>
                      <td>{t.fecha}</td>
                      <td>{t.prioridad}</td>
                      <td>
                        <button 
                          type="button" 
                          className="boceto-btn"
                          onClick={() => toggleTaskStatus(t.id)}
                        >
                          Cambiar Estado
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PESTAÑA 2: TABLERO & LISTA */}
        {activeTab === 'tareas' && (
          <div className="boceto-card">
            <div className="boceto-card-title">
              <span>Tablero de Seguimiento de Tareas</span>
              <button 
                type="button" 
                className="boceto-btn boceto-btn-primary"
                onClick={() => setIsModalOpen(true)}
              >
                + Nueva Tarea
              </button>
            </div>
            
            <div className="boceto-board-grid">
              {/* Columna Pendientes */}
              <div className="boceto-board-col">
                <div className="boceto-col-header">
                  <span>Pendientes</span>
                  <span>({tasks.filter(t => t.estado === 'pendiente').length})</span>
                </div>
                {tasks.filter(t => t.estado === 'pendiente').map(t => (
                  <div key={t.id} className="boceto-task-card">
                    <strong>{t.titulo}</strong>
                    <div className="boceto-task-meta">Materia: {t.materia}</div>
                    <div className="boceto-task-meta">Fecha de Entrega: {t.fecha}</div>
                    <div style={{ marginTop: '8px' }}>
                      <button 
                        type="button" 
                        className="boceto-btn" 
                        onClick={() => toggleTaskStatus(t.id)}
                      >
                        Pasar a En Progreso
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Columna En Proceso */}
              <div className="boceto-board-col">
                <div className="boceto-col-header">
                  <span>En Progreso</span>
                  <span>({tasks.filter(t => t.estado === 'en_progreso').length})</span>
                </div>
                {tasks.filter(t => t.estado === 'en_progreso').map(t => (
                  <div key={t.id} className="boceto-task-card">
                    <strong>{t.titulo}</strong>
                    <div className="boceto-task-meta">Materia: {t.materia}</div>
                    <div className="boceto-task-meta">Fecha de Entrega: {t.fecha}</div>
                    <div style={{ marginTop: '8px' }}>
                      <button 
                        type="button" 
                        className="boceto-btn" 
                        onClick={() => toggleTaskStatus(t.id)}
                      >
                        Marcar como Finalizada
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Columna Finalizadas */}
              <div className="boceto-board-col">
                <div className="boceto-col-header">
                  <span>Finalizadas</span>
                  <span>({tasks.filter(t => t.estado === 'finalizada').length})</span>
                </div>
                {tasks.filter(t => t.estado === 'finalizada').map(t => (
                  <div key={t.id} className="boceto-task-card">
                    <del><strong>{t.titulo}</strong></del>
                    <div className="boceto-task-meta">Materia: {t.materia}</div>
                    <div className="boceto-task-meta">Completada el {t.fecha}</div>
                    <div style={{ marginTop: '8px' }}>
                      <button 
                        type="button" 
                        className="boceto-btn" 
                        onClick={() => toggleTaskStatus(t.id)}
                      >
                        Reabrir Tarea
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 3: MATERIAS & WHATSAPP */}
        {activeTab === 'materias' && (
          <div className="boceto-card">
            <div className="boceto-card-title">
              <span>Directorio de Materias y Grupos de WhatsApp</span>
              <button 
                type="button" 
                className="boceto-btn boceto-btn-primary"
                onClick={() => alert('Formulario de registro de materia')}
              >
                + Registrar Materia
              </button>
            </div>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 12px 0' }}>
              Directorio de materias escolares y enlaces directos a los grupos de comunicación.
            </p>
            <table className="boceto-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Materia</th>
                  <th>Docente Asignado</th>
                  <th>Enlace de WhatsApp</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map(s => (
                  <tr key={s.id}>
                    <td><code>{s.id.toUpperCase()}</code></td>
                    <td><strong>{s.nombre}</strong></td>
                    <td>{s.docente}</td>
                    <td>
                      <a href={s.whatsapp} target="_blank" rel="noreferrer" style={{ color: '#2563eb' }}>
                        {s.whatsapp}
                      </a>
                    </td>
                    <td>
                      <button 
                        type="button" 
                        className="boceto-btn"
                        onClick={() => window.open(s.whatsapp, '_blank')}
                      >
                        Abrir Chat
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PESTAÑA 4: COMUNIDAD ESCOLAR */}
        {activeTab === 'comunidad' && (
          <div>
            <div className="boceto-card">
              <div className="boceto-card-title">
                <span>Comunidad Escolar: Grado 11-A</span>
                <button 
                  type="button" 
                  className="boceto-btn boceto-btn-danger"
                  onClick={() => alert('¿Estás seguro de que deseas salir del grupo?')}
                >
                  Abandonar Grupo
                </button>
              </div>
              <p style={{ fontSize: '13px', margin: '4px 0 12px 0' }}>
                <strong>Descripción:</strong> Grupo de estudiantes para coordinación académica y tareas.
              </p>
              <div style={{ background: '#f9fafb', border: '1px solid #d1d5db', padding: '10px', fontSize: '13px' }}>
                <strong>Código de Invitación:</strong> <code>GRP-11A-2026</code>
              </div>
            </div>

            <div className="boceto-card">
              <div className="boceto-card-title">
                <span>Otras Comunidades Escolares Disponibles</span>
              </div>
              <table className="boceto-table">
                <thead>
                  <tr>
                    <th>Nombre de la Comunidad</th>
                    <th>Descripción</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Grado 10-B Secundaria</strong></td>
                    <td>Grupo general de grado décimo sección B</td>
                    <td><button type="button" className="boceto-btn">Solicitar Unirse</button></td>
                  </tr>
                  <tr>
                    <td><strong>Club de Robótica y Ciencias</strong></td>
                    <td>Proyectos extracurriculares de tecnología</td>
                    <td><button type="button" className="boceto-btn">Solicitar Unirse</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PESTAÑA 5: PANEL ADMIN */}
        {activeTab === 'admin' && (
          <div className="boceto-card">
            <div className="boceto-card-title">
              <span>Panel de Administración del Grupo</span>
              <span style={{ fontSize: '12px', background: '#e5e7eb', padding: '3px 8px', borderRadius: '3px' }}>
                Rol: Administrador Principal
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#6b7280' }}>
              Gestión de estudiantes integrantes y asignación de roles dentro del grupo escolar.
            </p>
            
            <table className="boceto-table" style={{ marginTop: '12px' }}>
              <thead>
                <tr>
                  <th>Nombre del Estudiante</th>
                  <th>Rol Actual</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {members.map(m => (
                  <tr key={m.id}>
                    <td><strong>{m.nombre}</strong></td>
                    <td>{m.rol}</td>
                    <td>
                      {m.rol !== 'Administrador' ? (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button 
                            type="button" 
                            className="boceto-btn"
                            onClick={() => alert(`Rol de administrador transferido a ${m.nombre}`)}
                          >
                            Ceder Admin
                          </button>
                          <button 
                            type="button" 
                            className="boceto-btn boceto-btn-danger"
                            onClick={() => alert(`Estudiante ${m.nombre} eliminado del grupo`)}
                          >
                            Expulsar
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>Administrador Actual</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Modal de Nueva Tarea */}
      {isModalOpen && (
        <div className="boceto-modal-overlay">
          <div className="boceto-modal-box">
            <h3 style={{ margin: '0 0 12px 0', borderBottom: '1px solid #9ca3af', paddingBottom: '6px' }}>
              Crear Nueva Tarea
            </h3>
            <form onSubmit={handleSaveTask}>
              <div className="boceto-form-group">
                <label>Título de la Tarea:</label>
                <input 
                  type="text" 
                  className="boceto-input" 
                  value={newTask.titulo} 
                  onChange={e => setNewTask({ ...newTask, titulo: e.target.value })} 
                  placeholder="Ej. Taller de física..." 
                  required 
                />
              </div>

              <div className="boceto-form-group">
                <label>Materia:</label>
                <select 
                  className="boceto-select"
                  value={newTask.materia}
                  onChange={e => setNewTask({ ...newTask, materia: e.target.value })}
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.nombre}>{s.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="boceto-form-group">
                <label>Fecha de Entrega:</label>
                <input 
                  type="date" 
                  className="boceto-input"
                  value={newTask.fecha}
                  onChange={e => setNewTask({ ...newTask, fecha: e.target.value })}
                  required
                />
              </div>

              <div className="boceto-form-group">
                <label>Prioridad:</label>
                <select 
                  className="boceto-select"
                  value={newTask.prioridad}
                  onChange={e => setNewTask({ ...newTask, prioridad: e.target.value })}
                >
                  <option value="Alta">Alta</option>
                  <option value="Media">Media</option>
                  <option value="Baja">Baja</option>
                </select>
              </div>

              <div className="boceto-modal-footer">
                <button 
                  type="button" 
                  className="boceto-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="boceto-btn boceto-btn-primary"
                >
                  Guardar Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pie de Página */}
      <footer className="boceto-footer">
        <div>
          <strong>Calendario Estudiantil</strong> — Plataforma de Gestión y Seguimiento de Tareas Escolares.
        </div>
      </footer>
    </div>
  );
};
