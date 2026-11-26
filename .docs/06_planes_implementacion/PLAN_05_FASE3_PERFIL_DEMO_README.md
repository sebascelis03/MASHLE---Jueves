# 📋 Plan de Implementación #5: Fase 3 — Perfil de Estudiante, Cargador de Escenario de Demostración para Sustentación y `README.md` Oficial

**Estado:** Aprobado y en Ejecución  
**Fecha:** 2026-11-26

---

## 1. ¿Qué se hará?
1. **Tarea 3.1 — Gestión de Perfil del Estudiante y Cambio Rápido de Cuenta (`ProfileModal.jsx` / `App.jsx` / `AuthGroupContext.jsx`):**
   - Permitir al usuario autenticado abrir el modal accesible **"👤 Mi Perfil / Cambiar Cuenta"** desde el encabezado.
   - Soportar edición de nombre completo y contraseña (`updateMyProfile`), sincronizando con `storageService` y con la lista de miembros del grupo activo.
   - Permitir cambiar en 1 clic entre cualquiera de las 7 cuentas (`admin1..3`, `user1..4`) sin tener que cerrar sesión y escribir credenciales manualmente.
2. **Tarea 3.2 — Cargador de "Datos de Demostración para Sustentación" (`storageService.js` / `AuthView.jsx` / `ProfileModal.jsx`):**
   - Añadir `loadDemoScenario()` en `storageService.js` que crea 2 comunidades (*Ingeniería de Software - FESC 2026-2* y *Semillero UX & A11y*), 4 materias con enlaces de WhatsApp, 6 tareas con fechas dinámicas en el mes actual, progreso/notas de varios estudiantes y 1 solicitud de acceso pendiente lista para aprobar en vivo.
   - Añadir `resetAllData()` para limpiar los datos y dejar las 7 cuentas en blanco cuando se desee demostrar la creación desde cero.
3. **Tarea 3.3 — Creación del `README.md` Oficial en la Raíz del Proyecto:**
   - Redactar `README.md` completo con arquitectura, 7 cuentas base, matriz WCAG 2.1 AA/AAA, atajos de teclado y guía de sustentación.

---

## 2. Paso a Paso de Ejecución
1. Registrar `PLAN_05_FASE3_PERFIL_DEMO_README.md` y actualizar `02_TAREA_ACTIVA.md`.
2. Actualizar `src/services/storageService.js`.
3. Actualizar `src/context/AuthGroupContext.jsx` y `src/context/TaskContext.jsx`.
4. Crear `src/components/auth/ProfileModal.jsx` y actualizar `src/App.jsx` y `src/components/auth/AuthView.jsx`.
5. Crear `README.md` en la raíz, verificar `npm run lint` y `npm run build`, y actualizar `.docs/`.
