# ✅ Tareas Realizadas (Resumen Histórico)

Listado simplificado de los módulos y entregables ya completados en el proyecto **MASHLE (Calendario Estudiantil)**:

1. **Inicialización y Configuración Base PWA:**
   - Configuración de React 19 + Vite 8 + `vite-plugin-pwa` (`vite.config.js`, `package.json`).
   - Generación de iconos adaptables (`192x192`, `512x512`) y banner de instalación (`PWAInstallBanner.jsx`).
2. **Capa de Persistencia Local (`storageService.js`):**
   - Base de datos local en `localStorage` con las 7 cuentas oficiales (`admin1..3` con clave `1234` y `user1..4` con clave `4321`), grupos, materias con enlaces de WhatsApp, tareas oficiales y progreso individual.
3. **Plan de Implementación #1 — Estructura Documental `.docs/`:**
   - Creación de las 6 subcarpetas temáticas en `.docs/` como Fuente Única de Verdad.
4. **Plan de Implementación #2 — Cierre de Comunidades, Sucesión y Filtro de Fecha:**
   - Solicitudes de acceso a grupos, unión por código de invitación, transferencia de liderazgo principal sin expulsión forzosa, retiro de miembros, filtro por fecha seleccionada en Calendario y banner guía cuando no hay grupo activo.
5. **Plan de Implementación #3 — Fase 1 Completada (Funcionamiento Puro del Sistema):**
   - Tablero Scrum reactivo de 3 estados (`Pendiente`, `En Progreso`, `Finalizada`) por estudiante + conmutador *"Mi Avance / Estado Oficial"* para el Admin.
   - Desglose nominal desplegable en cada tarea para que el Administrador vea el estado individual de cada estudiante del salón.
   - Insignias de prioridad (*Alta*, *Media*, *Baja*), ordenamiento cronológico y filtro por prioridad.
   - Edición de datos de la comunidad activa y edición/eliminación de materias desde la tabla del Panel Admin.
6. **Plan de Implementación #4 — Fase 2 Completada (Pulido de Accesibilidad Universal WCAG 2.1 AA/AAA):**
   - **Tarea 2.1:** Botón **"🔊 Escuchar tarea"** en cada `TaskCard.jsx` (lectura completa por voz TTS) + botón rápido de **Voz (TTS)** en la barra superior (`A11yControls.jsx`).
   - **Tarea 2.2:** Navegación por flechas de teclado (`←`, `→`, `↑`, `↓`, `Home`, `End`) en la grilla mensual de `CalendarGrid.jsx` y en la barra de pestañas `role="tablist"` de `App.jsx`, con indicadores de progreso personal por día.
   - **Tarea 2.3:** Limpieza de advertencias de linter en `FocusTrap.jsx`, `A11yContext.jsx`, `TaskCard.jsx`, `TaskFormModal.jsx`, `CalendarGrid.jsx` y `scripts/generate-icons.js`.
