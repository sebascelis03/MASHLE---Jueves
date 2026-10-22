// Servicio de Almacenamiento Local (Offline-first) con datos semilla accesibles y base mock de usuarios

const STORAGE_KEYS = {
  USERS: 'cal_estudiantil_users',
  CURRENT_USER: 'cal_estudiantil_user',
  GROUPS: 'cal_estudiantil_groups',
  TASKS: 'cal_estudiantil_tasks',
  SUBJECTS: 'cal_estudiantil_subjects',
  SETTINGS: 'cal_estudiantil_settings'
};

// Cuentas Mock para pruebas de acceso, roles y sucesión
export const MOCK_ACCOUNTS = [
  {
    id: 'usr-1',
    nombre: 'Carlos Mendoza',
    email: 'prueba1@gmail.com',
    password: '1234',
    grupoId: 'grp-ingenieria-10a',
    rol: 'admin',
    descripcionRol: 'Estudiante Administrador del Grupo 10A (Dueño de los datos del proyecto)'
  },
  {
    id: 'usr-2',
    nombre: 'Valentina Restrepo',
    email: 'prueba2@gmail.com',
    password: '1234',
    grupoId: 'grp-ingenieria-10a',
    rol: 'estudiante',
    descripcionRol: 'Estudiante Miembro del Grupo 10A (Para probar permisos y sucesión)'
  },
  {
    id: 'usr-5',
    nombre: 'Sofía Carvajal',
    email: 'prueba3@gmail.com',
    password: '1234',
    grupoId: 'grp-diseno-ux',
    rol: 'admin',
    descripcionRol: 'Estudiante Administradora en otra comunidad (Semillero UX)'
  }
];

const SEED_GROUPS = [
  {
    id: 'grp-ingenieria-10a',
    nombre: 'Ingeniería de Software - Grupo 10A',
    codigoInvitacion: 'SOFT-10A',
    adminId: 'usr-1',
    descripcion: 'Grupo oficial de décimo semestre para seguimiento de proyectos y entregas.',
    solicitudesPendientes: [
      { id: 'usr-4', nombre: 'Andrés López', email: 'andres.lopez@estudiante.edu' }
    ],
    miembros: [
      { id: 'usr-1', nombre: 'Carlos Mendoza', email: 'prueba1@gmail.com', rol: 'admin' },
      { id: 'usr-2', nombre: 'Valentina Restrepo', email: 'prueba2@gmail.com', rol: 'estudiante' },
      { id: 'usr-3', nombre: 'Mateo Gómez', email: 'mateo.gomez@estudiante.edu', rol: 'estudiante' }
    ]
  },
  {
    id: 'grp-diseno-ux',
    nombre: 'Diseño de Interfaces & UX - Semillero',
    codigoInvitacion: 'UX-2026',
    adminId: 'usr-5',
    descripcion: 'Comunidad de estudio de diseño centrado en el usuario y accesibilidad digital.',
    solicitudesPendientes: [],
    miembros: [
      { id: 'usr-5', nombre: 'Sofía Carvajal', email: 'prueba3@gmail.com', rol: 'admin' },
      { id: 'usr-6', nombre: 'David Pinzón', email: 'd.pinzon@estudiante.edu', rol: 'estudiante' }
    ]
  }
];

const SEED_SUBJECTS = [
  {
    id: 'mat-accesibilidad',
    grupoId: 'grp-ingenieria-10a',
    nombre: 'Accesibilidad Web y WCAG',
    docente: 'Dra. Elena Ramos',
    color: '#2563eb',
    colorAltoContraste: '#60a5fa',
    whatsappUrl: 'https://chat.whatsapp.com/sample-accesibilidad-web'
  },
  {
    id: 'mat-arquitectura',
    grupoId: 'grp-ingenieria-10a',
    nombre: 'Arquitectura de Software PWA',
    docente: 'Ing. Rodrigo Vega',
    color: '#7c3aed',
    colorAltoContraste: '#c084fc',
    whatsappUrl: 'https://chat.whatsapp.com/sample-arquitectura-pwa'
  },
  {
    id: 'mat-metodologias',
    grupoId: 'grp-ingenieria-10a',
    nombre: 'Gestión Ágil y Usabilidad',
    docente: 'Mg. Laura Sarmiento',
    color: '#059669',
    colorAltoContraste: '#34d399',
    whatsappUrl: 'https://chat.whatsapp.com/sample-gestion-agil'
  },
  {
    id: 'mat-ux-research',
    grupoId: 'grp-diseno-ux',
    nombre: 'Investigación con Usuarios',
    docente: 'Lic. Camilo Torres',
    color: '#d97706',
    colorAltoContraste: '#fbbf24',
    whatsappUrl: 'https://chat.whatsapp.com/sample-ux-research'
  }
];

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
const pad = (n) => String(n).padStart(2, '0');

const SEED_TASKS = [
  {
    id: 'tsk-1',
    grupoId: 'grp-ingenieria-10a',
    materiaId: 'mat-accesibilidad',
    titulo: 'Auditoría de Lectores de Pantalla (NVDA & Narrador)',
    descripcion: 'Evaluar etiquetas ARIA, navegación por teclas Tab, contraste 7:1 y focus traps en modales de la PWA.',
    fechaEntrega: `${currentYear}-${currentMonth}-${pad(Math.min(10, 28))}`,
    horaEntrega: '23:59',
    estado: 'en_progreso',
    prioridad: 'alta',
    creadorId: 'usr-1'
  },
  {
    id: 'tsk-2',
    grupoId: 'grp-ingenieria-10a',
    materiaId: 'mat-arquitectura',
    titulo: 'Configuración de Service Worker y Manifest PWA',
    descripcion: 'Garantizar que la aplicación cargue en modo sin conexión (offline) y sea instalable en Android, Windows y macOS.',
    fechaEntrega: `${currentYear}-${currentMonth}-${pad(Math.min(15, 28))}`,
    horaEntrega: '18:00',
    estado: 'pendiente',
    prioridad: 'media',
    creadorId: 'usr-2'
  },
  {
    id: 'tsk-3',
    grupoId: 'grp-ingenieria-10a',
    materiaId: 'mat-metodologias',
    titulo: 'Entrega de Prototipo de Sucesión de Administrador',
    descripcion: 'Diseñar el flujo de prevención de errores y selección de sucesor cuando el administrador sale del grupo.',
    fechaEntrega: `${currentYear}-${currentMonth}-${pad(Math.min(5, 28))}`,
    horaEntrega: '12:00',
    estado: 'finalizada',
    prioridad: 'alta',
    creadorId: 'usr-1'
  },
  {
    id: 'tsk-4',
    grupoId: 'grp-ingenieria-10a',
    materiaId: 'mat-accesibilidad',
    titulo: 'Verificación de Daltonismo y Señalética Visual',
    descripcion: 'Confirmar que ningún estado dependa exclusivamente de rojo o verde; incluir iconos claros y etiquetas de texto.',
    fechaEntrega: `${currentYear}-${currentMonth}-${pad(Math.min(22, 28))}`,
    horaEntrega: '20:00',
    estado: 'pendiente',
    prioridad: 'baja',
    creadorId: 'usr-1'
  }
];

export const storageService = {
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(MOCK_ACCOUNTS));
    } else {
      // Asegurar que la cuenta referenciada prueba1@gmail.com siempre esté presente
      const existingUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS));
      const hasPrueba1 = existingUsers.some(u => u.email.toLowerCase() === 'prueba1@gmail.com');
      if (!hasPrueba1) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([...MOCK_ACCOUNTS, ...existingUsers]));
      }
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
  },

  // Autenticación Mock
  login(email, password) {
    const users = this.getUsers();
    const cleanEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      throw new Error('No existe una cuenta registrada con este correo electrónico.');
    }

    if (user.password !== password) {
      throw new Error('Contraseña incorrecta. Inténtalo de nuevo.');
    }

    // Guardar usuario en sesión
    this.setCurrentUser(user);
    return user;
  },

  register({ email, password, nombre }) {
    const users = this.getUsers();
    const cleanEmail = email.trim().toLowerCase();

    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      throw new Error('Ya existe una cuenta con este correo institucional.');
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      nombre: nombre?.trim() || cleanEmail.split('@')[0],
      email: cleanEmail,
      password: password,
      grupoId: null, // Inicia sin grupo asignado
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
  },

  getSettings() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS)) || {
        altoContraste: false,
        fontSize: 'normal',
        modoOscuro: true,
        reducirAnimaciones: false
      };
    } catch {
      return {
        altoContraste: false,
        fontSize: 'normal',
        modoOscuro: true,
        reducirAnimaciones: false
      };
    }
  },

  saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }
};
