// Servicio de Almacenamiento Local (Offline-first) para Plataforma Estudiantil Autónoma

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

// Los grupos inician limpios para que el usuario los cree desde la app
const SEED_GROUPS = [];
const SEED_SUBJECTS = [];
const SEED_TASKS = [];

export const storageService = {
  init() {
    // Migración limpia a versión 2 (limpiar usuarios antiguos y grupos precargados)
    const currentVersion = localStorage.getItem(STORAGE_KEYS.VERSION);
    if (!currentVersion || currentVersion !== 'v2') {
      localStorage.setItem(STORAGE_KEYS.VERSION, 'v2');
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(MOCK_ACCOUNTS));
      localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(SEED_GROUPS));
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(SEED_SUBJECTS));
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(SEED_TASKS));
      // Si el usuario actual era de los antiguos pruebaX, desconectar para login fresco
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

    // Guardar usuario en sesión
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

  // Progreso y notas individuales por estudiante
  // Clave: cal_estudiantil_user_progress -> { "[userId]_[taskId]": { realizada: boolean, notasPersonales: string, fechaActualizacion: string } }
  getUserProgress() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_PROGRESS)) || {};
    } catch {
      return {};
    }
  },

  saveUserProgress(progressMap) {
    localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progressMap));
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
