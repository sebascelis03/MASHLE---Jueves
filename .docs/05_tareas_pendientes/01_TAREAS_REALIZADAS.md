# ✅ Tareas Realizadas (Resumen Histórico)

Listado simplificado de los módulos y entregables ya completados en el proyecto **MASHLE (Calendario Estudiantil)**:

1. **Inicialización y Configuración Base PWA:**
   - Configuración de React 19 + Vite 8 + `vite-plugin-pwa` (`vite.config.js`, `package.json`).
   - Generación de iconos adaptables (`192x192`, `512x512`) y banner de instalación (`PWAInstallBanner.jsx`).
2. **Capa de Persistencia Local (`storageService.js`):**
   - Base de datos local en `localStorage` con las 7 cuentas oficiales (`admin1..3` con clave `1234` y `user1..4` con clave `4321`), grupos, materias con enlaces de WhatsApp, tareas oficiales y progreso individual.
3. **Suite de Accesibilidad Universal (WCAG 2.1 AA/AAA):**
   - Sistema de Design Tokens (`tokens.css`) con modo Alto Contraste AAA y 4 modos de daltonismo.
   - Asistente de calibración inicial (`A11yOnboardingModal.jsx`), barra superior (`A11yControls.jsx`), anuncios de lector de pantalla (`LiveAnnouncer.jsx`), notificaciones visuales (`ToastHost.jsx`), trampa de foco (`FocusTrap.jsx`) y enlace de salto (`SkipLink.jsx`).
   - Síntesis de voz (Web Speech API), sonidos discretos (Web Audio API) y atajos globales de teclado (`Alt + N`, `Alt + C`, `Alt + L`, `Alt + M`).
4. **Plan de Implementación #1 — Estructura Documental `.docs/`:**
   - Creación de las 6 subcarpetas temáticas en `.docs/` como Fuente Única de Verdad.
5. **Plan de Implementación #2 — Cierre de Comunidades, Sucesión y Filtro de Fecha:**
   - Solicitudes de acceso a grupos, unión por código de invitación, transferencia de liderazgo principal sin expulsión forzosa, retiro de miembros, filtro por fecha seleccionada en Calendario y banner guía cuando no hay grupo activo.
6. **Plan de Implementación #3 — Fase 1 Completada (Funcionamiento Puro del Sistema):**
   - **Tarea 1.1:** Seguimiento individual de 3 estados (`Pendiente`, `En Progreso`, `Finalizada`) conectado dinámicamente a las columnas del Tablero Scrum + conmutador *"Mi Avance / Estado Oficial"* para el Administrador.
   - **Tarea 1.2:** Desglose nominal desplegable en cada tarea para que el Administrador vea el estado individual de cada estudiante del salón.
   - **Tarea 1.3:** Insignias de prioridad (*Alta*, *Media*, *Baja*) en cada tarea, ordenamiento automático por fecha/hora de entrega y filtro por prioridad.
   - **Tarea 1.4:** Edición de nombre, descripción y código de la comunidad activa + edición y eliminación de materias desde la tabla del Panel Admin con limpieza de tareas huérfanas.
