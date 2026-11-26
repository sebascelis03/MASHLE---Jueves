# 📓 Bitácora de Toma de Decisiones Técnicas

Registro cronológico e incremental de las decisiones arquitectónicas, iteraciones de diseño, problemas resueltos y acuerdos operativos del proyecto **MASHLE (Calendario Estudiantil)**.

---

## 🕒 Hito 0: Decisiones Fundacionales del Proyecto (Histórico Consolidado)

### 0.1. Arquitectura Frontend y Persistencia Offline-First
- **Contexto:** Se requería una aplicación rápida, instalable en dispositivos móviles/escritorio y funcional en entornos educativos con conectividad intermitente, sin depender de servidores externos complejos para las demostraciones del Proyecto de Grado.
- **Decisión:** Construir una **PWA con React 19 + Vite 8 + `vite-plugin-pwa`** y una capa de persistencia desacoplada en `src/services/storageService.js` sobre `localStorage` con 7 cuentas base (`admin1..3` y `user1..4`).

### 0.2. Suite de Accesibilidad Universal (WCAG 2.1 AA/AAA) y Calibrador Inicial
- **Contexto:** El núcleo académico del proyecto de grado es la **Accesibilidad y Usabilidad**.
- **Decisión:**
  - Implementar un **Asistente de Calibración (`A11yOnboardingModal.jsx`)** inspirado en la configuración inicial de consolas de videojuegos (calibración de brillo/contraste con símbolos de umbral, selector de daltonismo, lectura por voz, sonidos y alertas visuales, siempre con botón "Omitir").
  - Crear `A11yControls.jsx` como barra superior permanente.
  - Garantizar triple codificación en estados de tareas (color + ícono + etiqueta textual) y soporte de teclado total (`FocusTrap`, `SkipLink`, `LiveAnnouncer`, `ToastHost` y atajos `Alt + N/C/L/M`).

### 0.3. Segregación de Permisos en Tareas (Oficiales vs. Progreso Individual)
- **Contexto:** Si cualquier estudiante modificaba o borraba una tarea del grupo, afectaría a toda la clase.
- **Decisión:** Separar el modelo de datos en dos niveles dentro de `TaskContext.jsx` y `storageService.js`:
  1. **Tareas oficiales del grupo:** Solo el **Administrador** puede crearlas, editarlas o eliminarlas.
  2. **Progreso y notas privadas por estudiante (`user_progress`):** Cada alumno marca su propio avance (*"Ya la realicé" / "No la he realizado"*) y guarda notas personales sin alterar los datos de sus compañeros.

---

## 🕒 Hito 1: Estandarización Documental y Reglas Operativas (2026-11-26)

### 1.1. Adopción de `.docs/` como Fuente Única de Verdad
- **Decisión:**
  1. Establecer las **3 Reglas Operativas Estrictas** en `.docs/01_reglas/REGLAS_OPERATIVAS.md`.
  2. Consolidar toda la documentación del proyecto dentro de las 6 subcarpetas oficiales de `.docs/`.
  3. Crear la rama de trabajo `dev-sebas` mediante ejecución manual del usuario.

---

## 🕒 Hito 2: Cierre Funcional de Comunidades, Administración y Filtro de Calendario (2026-11-26)

### 2.1. Flujo Completo de Solicitudes de Acceso y Código de Invitación
- **Problema detectado:** `GroupAdminPanel.jsx` tenía una lista de solicitudes pendientes (`solicitudesPendientes`), pero `GroupCommunityView.jsx` no tenía botón para enviar solicitudes ni formulario para ingresar con código de invitación.
- **Solución implementada:** Se agregaron `sendJoinRequest`, `cancelJoinRequest` y `joinGroupByCode` en `AuthGroupContext.jsx` y sus controles accesibles en `GroupCommunityView.jsx`, además de sincronizar el `grupoId` del estudiante cuando el administrador aprueba su solicitud.

### 2.2. Separación entre "Transferir Liderazgo Principal" y "Salir del Grupo" + Retiro de Miembros
- **Problema detectado:** El botón *"Ceder Liderazgo Principal"* en `GroupAdminPanel.jsx` abría `SuccessionModal` en modo salida, expulsando al administrador de su propio grupo. Además, no existía acción para retirar a un miembro de la comunidad.
- **Solución implementada:**
  - Se creó `openTransferLeadershipModal()` con la acción `{ type: 'transfer_only' }`, permitiendo transferir `adminId` a otro miembro mientras el administrador anterior permanece en el grupo como estudiante.
  - Se agregó `removeMemberFromGroup(memberId)` en `AuthGroupContext.jsx` y el botón *"Retirar"* en `GroupAdminPanel.jsx`.

### 2.3. Filtro por Día Seleccionado en Calendario y Banner Guía "Sin Comunidad"
- **Problema detectado:** Seleccionar un día en `CalendarGrid.jsx` actualizaba `selectedDate`, pero `AgendaView.jsx` no ofrecía filtrar las tareas de ese día. Asimismo, al iniciar sesión sin grupo asignado, las pestañas de Calendario y Tablero se veían vacías sin explicar que primero se debe crear o unirse a una comunidad.
- **Solución implementada:**
  - Se añadió un banner guía accesible en `App.jsx` cuando `!currentGroup` con botón directo para ir a **Mi Comunidad**.
  - Se añadió en `AgendaView.jsx` el botón conmutador para filtrar instantáneamente las tareas del día seleccionado (`selectedDate`) o ver todas las del grupo.
