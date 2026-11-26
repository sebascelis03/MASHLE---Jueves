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

### 4.1. Lectura en Voz Alta (`TTS`) Directa por Tarea y Conmutador Rápido de Voz
- **Contexto:** Los usuarios con baja visión, ceguera o dislexia necesitaban poder escuchar el contenido completo de cualquier tarea individual bajo demanda y activar/desactivar la voz rápidamente desde la barra superior.
- **Solución:**
  - Se agregó el botón **"🔊 Escuchar tarea"** en cada `TaskCard.jsx`, que sintetiza título, materia, prioridad, fecha/hora de entrega, estado personal, descripción y notas privadas.
  - Se añadió el conmutador rápido **"Voz (TTS) / Voz Activa"** en `A11yControls.jsx`.

### 4.2. Navegación por Flechas de Teclado en Grilla de Calendario y Pestañas (WAI-ARIA)
- **Solución:**
  - En `CalendarGrid.jsx` se implementó navegación con `ArrowRight`, `ArrowLeft`, `ArrowDown` (+7 días), `ArrowUp` (-7 días), `Home` y `End`, además de reflejar el progreso personal del estudiante en los indicadores de cada celda.
  - En `App.jsx` se implementó navegación con `ArrowRight`, `ArrowLeft`, `Home` y `End` sobre la barra `role="tablist"`.
  - Se limpiaron las advertencias de `setState` en `useEffect`, referencias durante render y variables sin uso en `FocusTrap.jsx`, `A11yContext.jsx`, `TaskCard.jsx`, `TaskFormModal.jsx`, `CalendarGrid.jsx` y `scripts/generate-icons.js`.
