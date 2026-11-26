# ✅ Tareas Realizadas (Resumen Histórico)

Listado simplificado de los módulos y entregables ya completados en el proyecto **MASHLE (Calendario Estudiantil)**:

1. **Inicialización y Configuración Base PWA:**
   - Configuración de React 19 + Vite 8 + `vite-plugin-pwa` (`vite.config.js`, `package.json`).
   - Generación de iconos adaptables (`192x192`, `512x512`) y banner de instalación (`PWAInstallBanner.jsx`).
2. **Capa de Persistencia Local (`storageService.js`):**
   - Base de datos local en `localStorage` con cuentas mock preconfiguradas (*Carlos Mendoza*, *Valentina Restrepo*, *Sofía Carvajal*), grupos iniciales, materias con enlaces de WhatsApp, tareas oficiales y progreso individual.
3. **Suite de Accesibilidad Universal (WCAG 2.1 AA/AAA):**
   - Sistema de Design Tokens (`tokens.css`) con modo Alto Contraste AAA y 4 modos de daltonismo.
   - Asistente de calibración inicial (`A11yOnboardingModal.jsx`), barra flotante (`A11yControls.jsx`), anuncios de lector de pantalla (`LiveAnnouncer.jsx`), notificaciones visuales (`ToastHost.jsx`), trampa de foco (`FocusTrap.jsx`) y enlace de salto (`SkipLink.jsx`).
   - Síntesis de voz (Web Speech API) y atajos globales de teclado (`Alt + N`, `Alt + C`, `Alt + L`, `Alt + M`).
4. **Módulos Funcionales de la Plataforma Principal (`/`):**
   - Portal de acceso (`AuthView.jsx`).
   - Calendario mensual accesible (`CalendarGrid.jsx`).
   - Tablero y lista de seguimiento con notas privadas por estudiante (`AgendaView.jsx`, `TaskCard.jsx`, `TaskFormModal.jsx`, `TaskStatusBadge.jsx`).
   - Directorio de materias con *deep links* accesibles a WhatsApp (`SubjectsDirectoryView.jsx`).
   - Comunidad escolar con membresía única y alerta de cambio de grupo (`GroupCommunityView.jsx`, `GroupWarningDialog.jsx`).
   - Panel de administración y protocolo obligatorio de sucesión (`GroupAdminPanel.jsx`, `SuccessionModal.jsx`).
5. **Apartado Comparativo de Boceto Inicial (`/boceto`):**
   - Construcción de `BocetoView.jsx` y `boceto.css` sin herramientas A11y ni estilos modernos para evidenciar el *"Antes vs. Después"* en la sustentación del Proyecto de Grado.
6. **Plan de Implementación #1 — Estructura Documental `.docs/`:**
   - Creación de las 6 subcarpetas temáticas en `.docs/` como Fuente Única de Verdad, consolidación de los documentos previos de `docs/` y eliminación de la carpeta `docs/` antigua.
