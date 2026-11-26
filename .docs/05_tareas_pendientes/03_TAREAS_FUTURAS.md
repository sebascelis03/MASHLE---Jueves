# 🔮 Tareas Futuras y Hoja de Ruta Maestra por Fases

En este archivo se mantiene la **Task List Maestra en 4 Fases** acordada para completar el proyecto de forma ordenada (primero funcionamiento puro, luego accesibilidad, luego autenticación/datos de prueba y finalmente despliegue híbrido en Firebase).

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

## 🟣 FASE 3: Registro, Perfiles y Semilla de Demostración para Sustentación — *Siguiente Fase*
- [ ] **Tarea 3.1 — Gestión de Cuenta / Perfil y Cambio Rápido de Usuario:** Permitir al usuario editar su nombre/contraseña desde la sesión activa y cambiar rápidamente entre cuentas de prueba durante la demostración.
- [ ] **Tarea 3.2 — Cargador de "Datos de Demostración para Sustentación":** Botón accesible para poblar o restaurar en un clic un escenario académico completo (comunidades con las 7 cuentas distribuidas, materias con enlaces reales/mock de WhatsApp, tareas con distintas prioridades/fechas del mes actual, progreso de varios alumnos y solicitudes pendientes) para que la presentación nunca inicie en blanco.
- [ ] **Tarea 3.3 — `README.md` Oficial en la Raíz del Proyecto:** Documentación completa de instalación, cuentas de prueba y arquitectura.

---

## 🟠 FASE 4: Integración con Firebase (Firestore + Hosting PWA Híbrido) — *Fase Final*
- [ ] **Tarea 4.1 — Configuración del SDK de Firebase (`src/services/firebaseConfig.js`):** Conectar el proyecto a Firebase con soporte de variables de entorno y *fallback* automático a `localStorage` si se presenta sin conexión.
- [ ] **Tarea 4.2 — Sincronización en Tiempo Real con Firestore (`storageService.js`):** Sincronizar grupos, solicitudes, materias, tareas y progreso de estudiantes en tiempo real entre dispositivos con caché offline de Firestore.
- [ ] **Tarea 4.3 — Configuración de Firebase Hosting (`firebase.json`):** Preparar y documentar el despliegue en `https://<proyecto>.web.app` con certificado SSL para instalación nativa de la PWA en celulares y PC durante la sustentación.
