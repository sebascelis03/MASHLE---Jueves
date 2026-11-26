# 📓 Bitácora de Toma de Decisiones Técnicas

Registro cronológico e incremental de las decisiones arquitectónicas, iteraciones de diseño, problemas resueltos y acuerdos operativos del proyecto **MASHLE (Calendario Estudiantil)**.

---

## 🕒 Hito 0: Decisiones Fundacionales del Proyecto (Histórico Consolidado)

### 0.1. Arquitectura Frontend y Persistencia Offline-First
- **Decisión:** Construir una **PWA con React 19 + Vite 8 + `vite-plugin-pwa`** y una capa de persistencia desacoplada en `src/services/storageService.js` sobre `localStorage` con 7 cuentas base (`admin1..3` y `user1..4`).

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

### 5.1. Creación de `ProfileModal.jsx` y Cambio Rápido de Cuenta para Sustentación
- **Contexto:** Durante la sustentación académica se requiere demostrar cómo interactúan el Administrador y los Estudiantes sin perder tiempo cerrando sesión y escribiendo contraseñas repetidamente, además de poder editar los datos del perfil propio.
- **Solución:** Se creó `src/components/auth/ProfileModal.jsx` accesible desde el botón **"Perfil / Demo"** de la cabecera, permitiendo editar nombre y contraseña (`updateMyProfile`) y alternar en 1 clic entre cualquiera de las 7 cuentas (`quickSwitchAccount`).

### 5.2. Generador de Escenario Demo con Fechas Dinámicas (`loadDemoScenario`)
- **Contexto:** Para que el calendario mensual nunca luzca vacío sin importar en qué día se realice la sustentación, las fechas de las tareas de demostración deben generarse dentro del mes en curso.
- **Solución:** `storageService.loadDemoScenario()` calcula fechas relativas al día actual dentro del mes presente y puebla 2 comunidades (`FESC-2026` y `UX-A11Y`), 5 materias con enlaces de WhatsApp, 6 tareas con prioridades variadas, progreso individual de varios estudiantes y 1 solicitud pendiente de `user3` lista para aprobar en vivo. Además, se creó el `README.md` oficial en la raíz del proyecto.
