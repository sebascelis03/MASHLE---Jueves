# 🔮 Tareas Futuras y Hoja de Ruta Maestra por Fases

En este archivo se mantiene la **Task List Maestra en 4 Fases** acordada para completar el proyecto de forma ordenada (primero funcionamiento puro, luego accesibilidad, luego autenticación/datos de prueba y finalmente despliegue híbrido en Firebase).

---

## 🟢 FASE 1: Funcionamiento Puro del Sistema (✅ 100% COMPLETADA — Planes #2 y #3)
- [x] Flujo de solicitudes de acceso a comunidades y unión directa por código de invitación (Plan #2).
- [x] Transferencia de liderazgo principal sin expulsión forzosa y retiro de miembros (Plan #2).
- [x] Filtro por fecha seleccionada en calendario y banner guía sin grupo activo (Plan #2).
- [x] **Tarea 1.1:** Tablero Scrum reactivo de 3 estados (`Pendiente`, `En Progreso`, `Finalizada`) para el seguimiento personal de cada estudiante + conmutador de vista oficial para el Admin (Plan #3).
- [x] **Tarea 1.2:** Desglose nominal de estudiantes en cada tarea para el Administrador (ver quién ya entregó, quién está en progreso y quién falta) (Plan #3).
- [x] **Tarea 1.3:** Insignias visibles de prioridad (*Alta*, *Media*, *Baja*), ordenamiento automático por fecha de entrega más próxima y filtro por prioridad (Plan #3).
- [x] **Tarea 1.4:** Edición de los datos del grupo actual (nombre, descripción, código de invitación) y edición/eliminación de materias desde la tabla del Panel Admin con limpieza de tareas huérfanas (Plan #3).

---

## 🔵 FASE 2: Pulido de Accesibilidad Universal (WCAG 2.1 AA/AAA) — *Siguiente Fase*
- [ ] **Tarea 2.1 — Botón de Lectura en Voz Alta (`TTS`) por Tarea:** Añadir botón *"🔊 Escuchar tarea"* en cada `TaskCard.jsx` para leer en voz alta título, materia, fecha, prioridad, descripción y estado.
- [ ] **Tarea 2.2 — Navegación de Grilla por Teclado en Calendario e Indicadores:** Permitir desplazarse entre los días del mes usando flechas del teclado además de `Tab`, y reflejar el progreso en las celdas del calendario.
- [ ] **Tarea 2.3 — Calidad de Código y Cero Warnings A11y/Lint:** Limpiar las advertencias de `oxlint` (`FocusTrap`, `A11yContext`, `TaskFormModal`, `scripts/generate-icons.js`) para lograr 0 warnings y 0 errors.

---

## 🟣 FASE 3: Registro, Perfiles y Semilla de Demostración para Sustentación
- [ ] **Tarea 3.1 — Gestión de Cuenta / Perfil y Cambio Rápido de Usuario:** Permitir al usuario editar su nombre/perfil o cambiar rápidamente entre cuentas de prueba durante la demostración.
- [ ] **Tarea 3.2 — Cargador de "Datos de Demostración para Sustentación":** Botón accesible para poblar o restaurar en un clic un escenario académico completo (comunidades, materias con enlaces de WhatsApp, tareas con distintas prioridades/fechas y progreso de varios alumnos) para que la presentación nunca inicie en blanco.
- [ ] **Tarea 3.3 — `README.md` Oficial en la Raíz del Proyecto:** Documentación completa de instalación, cuentas de prueba y arquitectura.

---

## 🟠 FASE 4: Integración con Firebase (Firestore + Hosting PWA Híbrido) — *Fase Final*
- [ ] **Tarea 4.1 — Configuración del SDK de Firebase (`src/services/firebaseConfig.js`):** Conectar el proyecto a Firebase con soporte de variables de entorno y *fallback* automático a `localStorage` si se presenta sin conexión.
- [ ] **Tarea 4.2 — Sincronización en Tiempo Real con Firestore (`storageService.js`):** Sincronizar grupos, solicitudes, materias, tareas y progreso de estudiantes en tiempo real entre dispositivos con caché offline de Firestore.
- [ ] **Tarea 4.3 — Configuración de Firebase Hosting (`firebase.json`):** Preparar y documentar el despliegue en `https://<proyecto>.web.app` con certificado SSL para instalación nativa de la PWA en celulares y PC durante la sustentación.
