# 🔮 Tareas Futuras y Hoja de Ruta Maestra por Fases

En este archivo se mantiene la **Task List Maestra en 4 Fases** acordada para completar el proyecto de forma ordenada.

---

## 🟢 FASE 1: Funcionamiento Puro del Sistema (✅ 100% COMPLETADA — Planes #2 y #3)
- [x] Flujo de solicitudes de acceso a comunidades y unión directa por código de invitación (Plan #2).
- [x] Transferencia de liderazgo principal sin expulsión forzosa y retiro de miembros (Plan #2).
- [x] Filtro por fecha seleccionada en calendario y banner guía sin grupo activo (Plan #2).
- [x] **Tarea 1.1:** Tablero Scrum reactivo de 3 estados (`Pendiente`, `En Progreso`, `Finalizada`) para el seguimiento personal de cada estudiante + conmutador de vista oficial para el Admin (Plan #3).
- [x] **Tarea 1.2:** Desglose nominal de estudiantes en cada tarea para el Administrador (Plan #3).
- [x] **Tarea 1.3:** Insignias visibles de prioridad (*Alta*, *Media*, *Baja*), ordenamiento automático por fecha de entrega más próxima y filtro por prioridad (Plan #3).
- [x] **Tarea 1.4:** Edición de los datos del grupo actual y edición/eliminación de materias desde la tabla del Panel Admin (Plan #3).

---

## 🔵 FASE 2: Pulido de Accesibilidad Universal (WCAG 2.1 AA/AAA) (✅ 100% COMPLETADA — Plan #4)
- [x] **Tarea 2.1 — Botón de Lectura en Voz Alta (`TTS`) por Tarea y Conmutador Rápido:** Botón *"🔊 Escuchar tarea"* en cada `TaskCard.jsx` y botón rápido de voz en `A11yControls.jsx` (Plan #4).
- [x] **Tarea 2.2 — Navegación de Grilla por Teclado en Calendario y Pestañas:** Desplazamiento con flechas (`←`, `→`, `↑`, `↓`, `Home`, `End`) en `CalendarGrid.jsx` y `App.jsx`, e indicadores de progreso personal en las celdas del calendario (Plan #4).
- [x] **Tarea 2.3 — Calidad de Código y Limpieza de Linter:** Limpieza de `FocusTrap.jsx`, `A11yContext.jsx`, `TaskCard.jsx`, `TaskFormModal.jsx`, `CalendarGrid.jsx` y `scripts/generate-icons.js` (Plan #4).

---

## 🟣 FASE 3: Registro, Perfiles y Semilla de Demostración para Sustentación (✅ 100% COMPLETADA — Plan #5)
- [x] **Tarea 3.1 — Gestión de Cuenta / Perfil y Cambio Rápido de Usuario:** Modal `ProfileModal.jsx` para editar nombre/contraseña y cambiar en 1 clic entre las 7 cuentas durante la demostración (Plan #5).
- [x] **Tarea 3.2 — Cargador de "Datos de Demostración para Sustentación":** Botón *"⚡ Cargar Demo & Entrar"* en Login y en Perfil que puebla comunidades, materias con enlaces de WhatsApp, tareas en el mes actual, avances individuales y solicitudes pendientes (Plan #5).
- [x] **Tarea 3.3 — `README.md` Oficial en la Raíz del Proyecto:** Documentación completa de instalación, cuentas de prueba y arquitectura (Plan #5).

---

## 🟠 FASE 4: Integración con Firebase (Firestore + Hosting PWA Híbrido) — *Siguiente y Última Fase*
- [ ] **Tarea 4.1 — Configuración del SDK de Firebase (`src/services/firebaseConfig.js`):** Conectar el proyecto a Firebase con soporte de variables de entorno y *fallback* automático a `localStorage` si se presenta sin conexión.
- [ ] **Tarea 4.2 — Sincronización en Tiempo Real con Firestore (`storageService.js`):** Sincronizar grupos, solicitudes, materias, tareas y progreso de estudiantes en tiempo real entre dispositivos con caché offline de Firestore.
- [ ] **Tarea 4.3 — Configuración de Firebase Hosting (`firebase.json`):** Preparar y documentar el despliegue en `https://<proyecto>.web.app` con certificado SSL para instalación nativa de la PWA en celulares y PC durante la sustentación.
