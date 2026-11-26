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
  2. **Progreso y notas privadas por estudiante (`user_progress`):** Cada alumno marca su propio avance y guarda notas personales sin alterar los datos de sus compañeros.

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
- **Solución implementada:** Se agregaron `sendJoinRequest`, `cancelJoinRequest` y `joinGroupByCode` en `AuthGroupContext.jsx` y sus controles accesibles en `GroupCommunityView.jsx`, además de sincronizar el `grupoId` del estudiante cuando el administrador aprueba su solicitud.

### 2.2. Separación entre "Transferir Liderazgo Principal" y "Salir del Grupo" + Retiro de Miembros
- **Solución implementada:** Se creó `openTransferLeadershipModal()` con la acción `{ type: 'transfer_only' }` y `removeMemberFromGroup(memberId)` en `AuthGroupContext.jsx`.

### 2.3. Filtro por Día Seleccionado en Calendario y Banner Guía "Sin Comunidad"
- **Solución implementada:** Se añadió un banner guía accesible en `App.jsx` cuando `!currentGroup` y el botón conmutador en `AgendaView.jsx` para filtrar las tareas del día seleccionado (`selectedDate`).

---

## 🕒 Hito 3: Fase 1 — Cierre del Funcionamiento Puro y Hoja de Ruta en 4 Fases con Firebase (2026-11-26)

### 3.1. Definición de Hoja de Ruta en 4 Fases (con Firebase al final)
- **Acuerdo Estratégico:** Se definió avanzar por capas estrictas:
  1. **Fase 1:** Funcionamiento puro del sistema en local.
  2. **Fase 2:** Pulido de accesibilidad universal.
  3. **Fase 3:** Registro, perfiles y semilla de demostración para sustentación.
  4. **Fase 4:** Integración híbrida con **Firebase (Firestore + Hosting PWA)** manteniendo respaldo `localStorage` offline.

### 3.2. Tablero Scrum Reactivo de 3 Estados por Estudiante y Desglose Nominal Admin
- **Problema:** Las columnas del Tablero Scrum dependían solo del estado oficial (`task.estado`), por lo que cuando un estudiante marcaba su avance, la tarjeta no se movía de columna para él ni existía el estado intermedio `En Progreso` personal. Tampoco podía el Administrador ver qué estudiante específico había entregado cada tarea.
- **Solución:**
  - Se extendió `userProgress` con `estadoPersonal: 'pendiente' | 'en_progreso' | 'finalizada'` y `setMyTaskStatus`.
  - `AgendaView.jsx` ahora agrupa las 3 columnas del Tablero Scrum según el avance del usuario actual (y ofrece al Admin un conmutador entre *"Mi Avance"* y *"Estado Oficial"*).
  - `TaskCard.jsx` incluye un desplegable accesible (*"Ver estudiantes"*) para que el Administrador vea el listado completo de miembros del grupo y el estado individual de cada uno.

### 3.3. Visibilidad de Prioridades, Ordenamiento Cronológico y Edición Integral en Panel Admin
- **Solución:**
  - `TaskCard.jsx` muestra el badge de prioridad (*Alta*, *Media*, *Baja*), `TaskContext.jsx` ordena las tareas por fecha/hora de entrega más próxima y peso de prioridad, y `AgendaView.jsx` permite filtrar por prioridad.
  - `GroupAdminPanel.jsx` ahora permite editar los datos de la comunidad activa (`updateCurrentGroup`) y editar/eliminar materias directamente desde la tabla administrativa, limpiando referencias huérfanas en las tareas.
