# 📋 Plan de Implementación #6: Fase 4 — Integración Híbrida con Firebase (`mashle-beta777`) y Configuración de Hosting PWA

**Estado:** Aprobado y en Ejecución  
**Fecha:** 2026-11-26

---

## 1. ¿Qué se hará?
1. **Tarea 4.1 — Configuración del SDK de Firebase (`src/services/firebaseConfig.js`):**
   - Conectar las credenciales del proyecto Firebase **`mashle-beta777`** e inicializar **Cloud Firestore**.
   - Incluir funciones de lectura/escritura y suscripción en tiempo real (`onSnapshot`) sobre el documento compartido `mashle_app_state/global_state`, con manejo silencioso de errores para que jamás interrumpa la ejecución local si no hay internet.
2. **Tarea 4.2 — Motor de Persistencia Híbrida (`Cloud Firestore` ↔ `localStorage`):**
   - Actualizar `src/services/storageService.js` para que cada cambio en usuarios, comunidades, materias, tareas o progreso individual se guarde de inmediato en `localStorage` y se replique hacia Cloud Firestore.
   - Al recibir actualizaciones remotas desde Firestore, sincronizar `localStorage` y notificar a `AuthGroupContext.jsx` y `TaskContext.jsx` mediante el evento `cal_estudiantil_data_reload` para que todos los dispositivos conectados vean los cambios en vivo sin recargar la página.
   - Añadir un indicador de estado de sincronización en `src/components/a11y/A11yControls.jsx` (**`☁️ Firebase Sync`** / **`💾 Modo Local`**).
3. **Tarea 4.3 — Configuración de Firebase Hosting (`firebase.json` y `.firebaserc`):**
   - Crear `.firebaserc` apuntando al proyecto `mashle-beta777` y `firebase.json` apuntando a la carpeta de producción `dist` con soporte SPA y PWA.

---

## 2. Paso a Paso de Ejecución
1. Registrar `PLAN_06_FASE4_FIREBASE_HIBRIDO.md` y actualizar `02_TAREA_ACTIVA.md`.
2. Crear `src/services/firebaseConfig.js` y actualizar `src/services/storageService.js`.
3. Actualizar `src/context/AuthGroupContext.jsx`, `src/context/TaskContext.jsx` y `src/components/a11y/A11yControls.jsx`.
4. Crear `firebase.json` y `.firebaserc` en la raíz del proyecto.
5. Actualizar `DOCUMENTO_MAESTRO.md`, `BITACORA_DECISIONES.md`, `01_TAREAS_REALIZADAS.md`, `02_TAREA_ACTIVA.md`, `03_TAREAS_FUTURAS.md` y `README.md`, y entregar los comandos al usuario para su ejecución manual.
