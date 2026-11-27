# 📓 Bitácora de Toma de Decisiones Técnicas

Registro cronológico e incremental de las decisiones arquitectónicas, iteraciones de diseño, problemas resueltos y acuerdos operativos del proyecto **MASHLE (Calendario Estudiantil)**.

---

## 🕒 Hito 0: Decisiones Fundacionales del Proyecto (Histórico Consolidado)

### 0.1. Arquitectura Frontend y Persistencia Offline-First
- **Decisión:** Construir una **PWA con React 19 + Vite 8 + `vite-plugin-pwa`** y una capa de persistencia desacoplada en `src/services/storageService.js` con 7 cuentas base (`admin1..3` y `user1..4`).

### 0.2. Suite de Accesibilidad Universal (WCAG 2.1 AA/AAA) y Calibrador Inicial
- **Decisión:** Implementar `A11yOnboardingModal.jsx` estilo consola, `A11yControls.jsx`, triple codificación en estados de tareas y soporte de teclado total (`FocusTrap`, `SkipLink`, `LiveAnnouncer`, `ToastHost` y atajos `Alt + N/C/L/M`).

### 0.3. Segregación de Permisos en Tareas (Oficiales vs. Progreso Individual)
- **Decisión:** Separar tareas oficiales creadas por el Administrador del seguimiento personal y notas privadas de cada estudiante (`user_progress`).

---

## 🕒 Hito 1: Estandarización Documental y Reglas Operativas (2026-11-26)

### 1.1. Adopción de `.docs/` como Fuente Única de Verdad
- **Decisión:** Establecer las 3 Reglas Operativas Estrictas, consolidar la documentación en las 6 subcarpetas de `.docs/` y crear la rama de desarrollo `dev-sebas`.

---

## 🕒 Hito 2: Cierre Funcional de Comunidades, Administración y Filtro de Calendario (2026-11-26)

### 2.1. Flujo Completo de Solicitudes de Acceso, Código de Invitación y Transferencia de Liderazgo
- **Solución implementada:** `sendJoinRequest`, `cancelJoinRequest`, `joinGroupByCode`, `openTransferLeadershipModal` (`transfer_only`), `removeMemberFromGroup`, filtro por fecha seleccionada en `AgendaView.jsx` y banner guía cuando `!currentGroup`.

---

## 🕒 Hito 3: Fase 1 — Cierre del Funcionamiento Puro y Hoja de Ruta en 4 Fases con Firebase (2026-11-26)

### 3.1. Tablero Scrum Reactivo de 3 Estados por Estudiante, Desglose Nominal Admin y Prioridades
- **Solución implementada:**
  - Progreso individual de 3 estados (`pendiente`, `en_progreso`, `finalizada`) sincronizado con las columnas del Tablero Scrum + conmutador *"Mi Avance / Estado Oficial"* para el Admin.
  - Desplegable nominal *"Ver estudiantes"* en cada `TaskCard.jsx` para el Administrador.
  - Insignias de prioridad (*Alta*, *Media*, *Baja*), ordenamiento cronológico automático, filtro por prioridad y edición completa de grupo/materias en `GroupAdminPanel.jsx`.

---

## 🕒 Hito 4: Fase 2 — Pulido de Accesibilidad Universal y Calidad de Código (2026-11-26)

### 4.1. Lectura en Voz Alta (`TTS`) Directa por Tarea y Navegación WAI-ARIA por Flechas
- **Solución implementada:**
  - Botón **"🔊 Escuchar tarea"** en cada `TaskCard.jsx` y conmutador rápido **"Voz (TTS)"** en `A11yControls.jsx`.
  - Navegación con flechas (`←`, `→`, `↑`, `↓`, `Home`, `End`) en `CalendarGrid.jsx` y `App.jsx`, y limpieza de warnings de linter.

---

## 🕒 Hito 5: Fase 3 — Perfil de Estudiante, Cambio Rápido de Cuenta, Escenario Demo en 1 Clic y `README.md` (2026-11-26)

### 5.1. Creación de `ProfileModal.jsx` y Generador de Escenario Demo (`loadDemoScenario`)
- **Solución implementada:** Modal de perfil con edición de nombre/contraseña, cambio en 1 clic entre las 7 cuentas (`quickSwitchAccount`), cargador de escenario académico de sustentación con fechas dinámicas en el mes actual y `README.md` oficial en la raíz.

---

## 🕒 Hito 6: Fase 4 — Integración Híbrida con Firebase Cloud Firestore (`mashle-beta777`) y Hosting PWA (2026-11-26)

### 6.1. Arquitectura Dual-Mode (Cloud Firestore Realtime + `localStorage` Fallback)
- **Contexto:** Se requería conectar el proyecto a Firebase (`mashle-beta777`) para sincronización multi-dispositivo en tiempo real y despliegue en Firebase Hosting, pero garantizando que si en la sustentación se presenta localmente o sin internet, la aplicación siga funcionando sin fallos.
- **Solución:**
  - Se creó `src/services/firebaseConfig.js` con las credenciales de `mashle-beta777` y suscripción `onSnapshot` sobre `mashle_app_state/global_state`.
  - `storageService.js` guarda de forma síncrona en `localStorage` y replica asíncronamente en Firestore (`syncToCloud`). Al recibir cambios desde otro dispositivo, actualiza `localStorage` y dispara `cal_estudiantil_data_reload`.
  - Se añadió el indicador en vivo **`☁️ Firebase Sync` / `💾 Modo Local`** en `A11yControls.jsx`.
  - Se crearon `firebase.json` y `.firebaserc` para despliegue directo en Firebase Hosting.

---

## 🕒 Hito 7: Creación del Registro Oficial de Exportación en `.docs/07_registro_exportacion/` (2026-11-26)

### 7.1. Certificación de Versión Exportada (`v1.0.0-production`)
- **Decisión:** Incorporar la subcarpeta `.docs/07_registro_exportacion/` con el archivo `REGISTRO_EXPORTACION_ACTUAL.md` documentando la versión exportada el **26 de noviembre de 2026 (19:13 UTC-5)**, sus artefactos PWA compilados en `dist/`, las URLs de Firebase Hosting (`https://mashle-beta777.web.app`), la base de datos Cloud Firestore y el inventario completo de las Fases 1 a 4.
