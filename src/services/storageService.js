// Servicio de Almacenamiento Híbrido (Cloud Firestore + Offline-first localStorage)
import { pushAppStateToCloud, subscribeToCloudAppState } from './firebaseConfig';

const STORAGE_KEYS = {
  VERSION: 'cal_estudiantil_v2_clean',
  USERS: 'cal_estudiantil_users',
  CURRENT_USER: 'cal_estudiantil_user',
  GROUPS: 'cal_estudiantil_groups',
  TASKS: 'cal_estudiantil_tasks',
  SUBJECTS: 'cal_estudiantil_subjects',
  SETTINGS: 'cal_estudiantil_settings',
  USER_PROGRESS: 'cal_estudiantil_user_progress'
};

// Valores por defecto de accesibilidad
export const DEFAULT_SETTINGS = {
  altoContraste: false,
  fontSize: 'normal',
  modoOscuro: true,
  reducirAnimaciones: false,
  daltonismo: 'estandar', // 'estandar' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'acromatopsia'
  brillo: 100, // porcentaje 60-140
  lecturaVoz: false, // TTS (Web Speech API)
  sonidos: false, // Retroalimentación auditiva (Web Audio API)
  alertasVisuales: false, // Toasts visuales para discapacidad auditiva
  onboardingCompletado: false
};

// 7 Cuentas Base Oficiales solicitadas por el usuario
export const MOCK_ACCOUNTS = [
  {
    id: 'usr-admin-1',
    nombre: 'Admin 1',
    username: 'admin1',
    email: 'admin1@gmail.com',
    password: '1234',
    grupoId: null,
    rol: 'admin',
    descripcionRol: 'Administrador Estudiantil 1 (Clave: 1234)'
  },
  {
    id: 'usr-admin-2',
    nombre: 'Admin 2',
    username: 'admin2',
    email: 'admin2@gmail.com',
    password: '1234',
    grupoId: null,
    rol: 'admin',
    descripcionRol: 'Administrador Estudiantil 2 (Clave: 1234)'
  },
  {
    id: 'usr-admin-3',
    nombre: 'Admin 3',
    username: 'admin3',
    email: 'admin3@gmail.com',
    password: '1234',
    grupoId: null,
    rol: 'admin',
    descripcionRol: 'Administrador Estudiantil 3 (Clave: 1234)'
  },
  {
    id: 'usr-user-1',
    nombre: 'User 1',
    username: 'user1',
    email: 'user1@gmail.com',
    password: '4321',
    grupoId: null,
    rol: 'estudiante',
    descripcionRol: 'Estudiante Miembro 1 (Clave: 4321)'
  },
  {
    id: 'usr-user-2',
    nombre: 'User 2',
    username: 'user2',
    email: 'user2@gmail.com',
    password: '4321',
    grupoId: null,
    rol: 'estudiante',
    descripcionRol: 'Estudiante Miembro 2 (Clave: 4321)'
  },
  {
    id: 'usr-user-3',
    nombre: 'User 3',
    username: 'user3',
    email: 'user3@gmail.com',
    password: '4321',
    grupoId: null,
    rol: 'estudiante',
    descripcionRol: 'Estudiante Miembro 3 (Clave: 4321)'
  },
  {
    id: 'usr-user-4',
    nombre: 'User 4',
    username: 'user4',
    email: 'user4@gmail.com',
    password: '4321',
    grupoId: null,
    rol: 'estudiante',
    descripcionRol: 'Estudiante Miembro 4 (Clave: 4321)'
  }
];

const SEED_GROUPS = [];
const SEED_SUBJECTS = [];
const SEED_TASKS = [];

let cloudUnsubscribe = null;
let isApplyingRemoteSnapshot = false;

// Helper para generar fechas relativas al mes actual y que las tareas demo siempre aparezcan en el mes visible
const buildRelativeDateInCurrentMonth = (dayOffset) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const targetDay = Math.max(1, Math.min(totalDays, now.getDate() + dayOffset));
  const pad = (n) => String(n).padStart(2, '0');
  return `${year}-${pad(month + 1)}-${pad(targetDay)}`;
};

export const storageService = {
  init() {
    const currentVersion = localStorage.getItem(STORAGE_KEYS.VERSION);
    if (!currentVersion || currentVersion !== 'v2') {
      localStorage.setItem(STORAGE_KEYS.VERSION, 'v2');
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(MOCK_ACCOUNTS));
      localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(SEED_GROUPS));
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(SEED_SUBJECTS));
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(SEED_TASKS));
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.email?.includes('prueba')) {
        this.logout();
      }
      return;
    }

    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(MOCK_ACCOUNTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.GROUPS)) {
      localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(SEED_GROUPS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SUBJECTS)) {
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(SEED_SUBJECTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(SEED_TASKS));
    }
  },

  // Sincroniza el estado local actual hacia Cloud Firestore (si no estamos aplicando un snapshot remoto)
  syncToCloud() {
    if (isApplyingRemoteSnapshot) return;
    const payload = {
      users: this.getUsers(),
      groups: this.getGroups(),
      subjects: this.getSubjects(),
      tasks: this.getTasks(),
      userProgress: this.getUserProgress()
    };
    pushAppStateToCloud(payload);
  },

  // Inicia la escucha en tiempo real de Cloud Firestore (Modo Híbrido)
  startRealtimeCloudSync() {
    this.init();
    if (cloudUnsubscribe) return cloudUnsubscribe;

    let firstSnapshotHandled = false;

    cloudUnsubscribe = subscribeToCloudAppState((remoteData, meta = {}) => {
      // Si el documento en Firebase aún no existe, subimos nuestro estado local inicial
      if (meta.isEmptyCloud) {
        this.syncToCloud();
        return;
      }

      if (!remoteData) return;

      // Si es nuestro propio eco después de la primera carga, lo ignoramos para evitar bucles
      if (firstSnapshotHandled && meta.isOwnEcho) {
        return;
      }
      firstSnapshotHandled = true;

      isApplyingRemoteSnapshot = true;
      try {
        if (Array.isArray(remoteData.users) && remoteData.users.length > 0) {
          localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(remoteData.users));
        }
        if (Array.isArray(remoteData.groups)) {
          localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(remoteData.groups));
        }
        if (Array.isArray(remoteData.subjects)) {
          localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(remoteData.subjects));
        }
        if (Array.isArray(remoteData.tasks)) {
          localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(remoteData.tasks));
        }
        if (remoteData.userProgress && typeof remoteData.userProgress === 'object') {
          localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(remoteData.userProgress));
        }

        // Notificar a los contextos de React para que actualicen la vista en vivo
        window.dispatchEvent(new CustomEvent('cal_estudiantil_data_reload', { detail: { fromCloud: true } }));
      } finally {
        isApplyingRemoteSnapshot = false;
      }
    });

    return cloudUnsubscribe;
  },

  // Generador de Escenario Demo Completo para Sustentación Académica
  loadDemoScenario() {
    const demoGroups = [
      {
        id: 'grp-fesc-2026',
        nombre: 'Ingeniería de Software — Semestre 2026-2',
        descripcion: 'Comunidad principal del curso enfocada en Accesibilidad Universal (WCAG 2.1), Arquitectura y Desarrollo Web.',
        codigoInvitacion: 'FESC-2026',
        adminId: 'usr-admin-1',
        solicitudesPendientes: [
          {
            id: 'usr-user-3',
            nombre: 'User 3',
            email: 'user3@gmail.com',
            fechaSolicitud: new Date().toISOString()
          }
        ],
        miembros: [
          { id: 'usr-admin-1', nombre: 'Admin 1', email: 'admin1@gmail.com', rol: 'admin' },
          { id: 'usr-user-1', nombre: 'User 1', email: 'user1@gmail.com', rol: 'estudiante' },
          { id: 'usr-user-2', nombre: 'User 2', email: 'user2@gmail.com', rol: 'estudiante' }
        ]
      },
      {
        id: 'grp-semillero-ux',
        nombre: 'Semillero de Investigación UX & A11y',
        descripcion: 'Grupo de investigación en diseño inclusivo, pruebas de usabilidad y tecnologías asistivas.',
        codigoInvitacion: 'UX-A11Y',
        adminId: 'usr-admin-2',
        solicitudesPendientes: [],
        miembros: [
          { id: 'usr-admin-2', nombre: 'Admin 2', email: 'admin2@gmail.com', rol: 'admin' },
          { id: 'usr-user-4', nombre: 'User 4', email: 'user4@gmail.com', rol: 'estudiante' }
        ]
      }
    ];

    const demoUsers = MOCK_ACCOUNTS.map(u => {
      if (u.id === 'usr-admin-1') return { ...u, grupoId: 'grp-fesc-2026', rol: 'admin' };
      if (u.id === 'usr-user-1' || u.id === 'usr-user-2') return { ...u, grupoId: 'grp-fesc-2026', rol: 'estudiante' };
      if (u.id === 'usr-admin-2') return { ...u, grupoId: 'grp-semillero-ux', rol: 'admin' };
      if (u.id === 'usr-user-4') return { ...u, grupoId: 'grp-semillero-ux', rol: 'estudiante' };
      return { ...u, grupoId: null };
    });

    const demoSubjects = [
      {
        id: 'mat-a11y',
        grupoId: 'grp-fesc-2026',
        nombre: 'Accesibilidad y Usabilidad Web',
        docente: 'Mg. Laura Castellanos',
        docenteEmail: 'laura.castellanos@fesc.edu.co',
        horarioNotas: 'Jueves 6:00 PM - 9:00 PM · Laboratorio 302',
        whatsappUrl: 'https://chat.whatsapp.com/DemoAccesibilidadFESC2026',
        color: '#2563eb'
      },
      {
        id: 'mat-arq',
        grupoId: 'grp-fesc-2026',
        nombre: 'Arquitectura de Software & PWA',
        docente: 'Ing. Andrés Villamizar',
        docenteEmail: 'andres.villamizar@fesc.edu.co',
        horarioNotas: 'Martes 6:30 PM - 9:30 PM · Aula 204',
        whatsappUrl: 'https://chat.whatsapp.com/DemoArquitecturaPWA2026',
        color: '#7c3aed'
      },
      {
        id: 'mat-req',
        grupoId: 'grp-fesc-2026',
        nombre: 'Ingeniería de Requerimientos',
        docente: 'Esp. Diana Morales',
        docenteEmail: 'diana.morales@fesc.edu.co',
        horarioNotas: 'Miércoles 7:00 PM - 9:00 PM · Sala Virtual',
        whatsappUrl: 'https://chat.whatsapp.com/DemoRequerimientos2026',
        color: '#059669'
      },
      {
        id: 'mat-grado',
        grupoId: 'grp-fesc-2026',
        nombre: 'Proyecto de Grado II',
        docente: 'Dra. Claudia Peñaranda',
        docenteEmail: 'claudia.penaranda@fesc.edu.co',
        horarioNotas: 'Viernes 6:00 PM · Asesorías de Sustentación',
        whatsappUrl: 'https://chat.whatsapp.com/DemoProyectoGrado2026',
        color: '#d97706'
      },
      {
        id: 'mat-ux-lab',
        grupoId: 'grp-semillero-ux',
        nombre: 'Laboratorio de Pruebas con Lectores de Pantalla',
        docente: 'Mg. Laura Castellanos',
        docenteEmail: 'laura.castellanos@fesc.edu.co',
        horarioNotas: 'Sábados 9:00 AM · Semillero UX',
        whatsappUrl: 'https://chat.whatsapp.com/DemoSemilleroUX2026',
        color: '#db2777'
      }
    ];

    const demoTasks = [
      {
        id: 'tsk-demo-1',
        grupoId: 'grp-fesc-2026',
        materiaId: 'mat-a11y',
        titulo: 'Auditoría de Contraste y Lectura por Voz WCAG 2.1 AAA',
        descripcion: 'Verificar los 4 modos de daltonismo, el modo Alto Contraste y la navegación 100% por teclado en la plataforma.',
        fechaEntrega: buildRelativeDateInCurrentMonth(0),
        horaEntrega: '23:59',
        estado: 'en_progreso',
        prioridad: 'alta',
        creadorId: 'usr-admin-1'
      },
      {
        id: 'tsk-demo-2',
        grupoId: 'grp-fesc-2026',
        materiaId: 'mat-grado',
        titulo: 'Sustentación Final del Proyecto de Grado (MASHLE)',
        descripcion: 'Presentar la evolución del software, el flujo de comunidades cerradas, la sucesión obligatoria de administrador y el Tablero Scrum.',
        fechaEntrega: buildRelativeDateInCurrentMonth(2),
        horaEntrega: '18:30',
        estado: 'pendiente',
        prioridad: 'alta',
        creadorId: 'usr-admin-1'
      },
      {
        id: 'tsk-demo-3',
        grupoId: 'grp-fesc-2026',
        materiaId: 'mat-arq',
        titulo: 'Pruebas de Funcionamiento Offline y Service Worker PWA',
        descripcion: 'Comprobar que el manifiesto web y el caché offline permitan consultar y actualizar tareas sin conexión a internet.',
        fechaEntrega: buildRelativeDateInCurrentMonth(-1),
        horaEntrega: '20:00',
        estado: 'finalizada',
        prioridad: 'media',
        creadorId: 'usr-admin-1'
      },
      {
        id: 'tsk-demo-4',
        grupoId: 'grp-fesc-2026',
        materiaId: 'mat-req',
        titulo: 'Matriz de Historias de Usuario y Casos de Prueba de Roles',
        descripcion: 'Documentar las reglas de negocio: 1 estudiante por comunidad, aprobación de solicitudes y cesión de liderazgo.',
        fechaEntrega: buildRelativeDateInCurrentMonth(4),
        horaEntrega: '22:00',
        estado: 'pendiente',
        prioridad: 'media',
        creadorId: 'usr-admin-1'
      },
      {
        id: 'tsk-demo-5',
        grupoId: 'grp-fesc-2026',
        materiaId: 'mat-a11y',
        titulo: 'Guía de Atajos de Teclado y Trampa de Foco en Modales',
        descripcion: 'Validar atajos Alt+N, Alt+C, Alt+L, Alt+M y desplazamiento con flechas en el calendario.',
        fechaEntrega: buildRelativeDateInCurrentMonth(6),
        horaEntrega: '23:59',
        estado: 'pendiente',
        prioridad: 'baja',
        creadorId: 'usr-admin-1'
      },
      {
        id: 'tsk-demo-6',
        grupoId: 'grp-semillero-ux',
        materiaId: 'mat-ux-lab',
        titulo: 'Informe de Evaluación Heurística de Usabilidad',
        descripcion: 'Revisión de prevención de errores al cambiar de comunidad escolar.',
        fechaEntrega: buildRelativeDateInCurrentMonth(1),
        horaEntrega: '17:00',
        estado: 'en_progreso',
        prioridad: 'alta',
        creadorId: 'usr-admin-2'
      }
    ];

    const nowIso = new Date().toISOString();
    const demoProgress = {
      'usr-admin-1_tsk-demo-1': {
        estadoPersonal: 'en_progreso',
        realizada: false,
        notasPersonales: 'Falta capturar pantalla del filtro de tritanopía.',
        fechaActualizacion: nowIso
      },
      'usr-admin-1_tsk-demo-3': {
        estadoPersonal: 'finalizada',
        realizada: true,
        notasPersonales: 'Service Worker validado con Lighthouse.',
        fechaActualizacion: nowIso
      },
      'usr-user-1_tsk-demo-1': {
        estadoPersonal: 'finalizada',
        realizada: true,
        notasPersonales: 'Entregado en el repositorio y revisado con lector de voz.',
        fechaActualizacion: nowIso
      },
      'usr-user-1_tsk-demo-2': {
        estadoPersonal: 'en_progreso',
        realizada: false,
        notasPersonales: 'Preparando diapositivas de demostración.',
        fechaActualizacion: nowIso
      },
      'usr-user-1_tsk-demo-3': {
        estadoPersonal: 'finalizada',
        realizada: true,
        notasPersonales: 'Instalada la PWA en el celular.',
        fechaActualizacion: nowIso
      },
      'usr-user-2_tsk-demo-1': {
        estadoPersonal: 'en_progreso',
        realizada: false,
        notasPersonales: 'Probando navegación con teclado.',
        fechaActualizacion: nowIso
      },
      'usr-user-2_tsk-demo-3': {
        estadoPersonal: 'finalizada',
        realizada: true,
        notasPersonales: 'Pruebas offline listas.',
        fechaActualizacion: nowIso
      }
    };

    localStorage.setItem(STORAGE_KEYS.VERSION, 'v2');
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(demoUsers));
    localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(demoGroups));
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(demoSubjects));
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(demoTasks));
    localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(demoProgress));

    this.syncToCloud();

    return {
      users: demoUsers,
      groups: demoGroups,
      subjects: demoSubjects,
      tasks: demoTasks,
      progress: demoProgress
    };
  },

  // Reiniciar el sistema a estado limpio (7 cuentas base sin grupos ni tareas)
  resetAllData() {
    localStorage.setItem(STORAGE_KEYS.VERSION, 'v2');
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(MOCK_ACCOUNTS));
    localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify({}));

    this.syncToCloud();

    return {
      users: MOCK_ACCOUNTS,
      groups: [],
      subjects: [],
      tasks: [],
      progress: {}
    };
  },

  // Base mock de usuarios
  getUsers() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || MOCK_ACCOUNTS;
    } catch {
      return MOCK_ACCOUNTS;
    }
  },

  saveUsers(users) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.syncToCloud();
  },

  updateUser(updatedUser) {
    if (!updatedUser?.id) return;
    const users = this.getUsers();
    const nextUsers = users.map(u => u.id === updatedUser.id ? { ...u, ...updatedUser } : u);
    this.saveUsers(nextUsers);
  },

  // Autenticación: Permite ingresar con 'admin1', 'admin1@gmail.com', 'user1', etc.
  login(identifier, password) {
    const users = this.getUsers();
    const clean = identifier.trim().toLowerCase();

    const user = users.find(u => {
      const uEmail = (u.email || '').toLowerCase();
      const uUsername = (u.username || '').toLowerCase();
      return (
        uEmail === clean ||
        uUsername === clean ||
        (!clean.includes('@') && uEmail === `${clean}@gmail.com`) ||
        (clean.endsWith('@gmail.com') && uUsername === clean.replace('@gmail.com', ''))
      );
    });

    if (!user) {
      throw new Error(`No existe usuario con el identificador "${identifier}". Prueba con admin1, admin2, user1, etc.`);
    }

    if (user.password !== password) {
      throw new Error('Contraseña incorrecta. Recuerda: admins usan 1234 y users usan 4321.');
    }

    this.setCurrentUser(user);
    return user;
  },

  register({ email, password, nombre }) {
    const users = this.getUsers();
    const cleanInput = email.trim().toLowerCase();
    const normalizedEmail = cleanInput.includes('@') ? cleanInput : `${cleanInput}@gmail.com`;
    const username = cleanInput.replace('@gmail.com', '');

    if (users.some(u => (u.email || '').toLowerCase() === normalizedEmail || (u.username || '').toLowerCase() === username)) {
      throw new Error('Ya existe una cuenta con este nombre de usuario o correo.');
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      nombre: nombre?.trim() || username,
      username: username,
      email: normalizedEmail,
      password: password,
      grupoId: null,
      rol: 'estudiante',
      descripcionRol: 'Estudiante Nuevo Registrado'
    };

    const updatedUsers = [...users, newUser];
    this.saveUsers(updatedUsers);
    this.setCurrentUser(newUser);
    return newUser;
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  getCurrentUser() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) || null;
    } catch {
      return null;
    }
  },

  setCurrentUser(user) {
    if (!user) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    } else {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    }
  },

  getGroups() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.GROUPS)) || [];
    } catch {
      return [];
    }
  },

  saveGroups(groups) {
    localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(groups));
    this.syncToCloud();
  },

  getSubjects(grupoId) {
    this.init();
    try {
      const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBJECTS)) || [];
      return grupoId ? all.filter(s => s.grupoId === grupoId) : all;
    } catch {
      return [];
    }
  },

  saveSubjects(subjects) {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
    this.syncToCloud();
  },

  getTasks(grupoId) {
    this.init();
    try {
      const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS)) || [];
      return grupoId ? all.filter(t => t.grupoId === grupoId) : all;
    } catch {
      return [];
    }
  },

  saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    this.syncToCloud();
  },

  getUserProgress() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_PROGRESS)) || {};
    } catch {
      return {};
    }
  },

  saveUserProgress(progressMap) {
    localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progressMap));
    this.syncToCloud();
  },

  getSettings() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS));
      return { ...DEFAULT_SETTINGS, ...(saved || {}) };
    } catch {
      return { ...DEFAULT_SETTINGS };
    }
  },

  saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }
};
