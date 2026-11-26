# 📋 Plan de Implementación #3: Fase 1 — Cierre del Funcionamiento Puro (Tablero Scrum por Estudiante, Desglose Nominal Admin, Prioridades y Gestión Integral de Grupo/Materias)

**Estado:** Aprobado y en Ejecución  
**Fecha:** 2026-11-26

---

## 1. ¿Qué se hará?
1. Registrar la **Hoja de Ruta Maestra de 4 Fases** (Fase 1: Funcionamiento Puro, Fase 2: Accesibilidad, Fase 3: Registro y Datos Demo, Fase 4: Integración Híbrida con Firebase + Hosting PWA) en `.docs/05_tareas_pendientes/03_TAREAS_FUTURAS.md`.
2. **Tarea 1.1 — Progreso Individual de 3 Estados y Tablero Scrum Reactivo por Estudiante:**
   - Soportar los 3 estados del flujo Scrum en el seguimiento personal de cada estudiante: `pendiente` (*Por realizar*), `en_progreso` (*En progreso*) y `finalizada` (*Ya la realicé*).
   - Hacer que las 3 columnas del Tablero Scrum en `AgendaView.jsx` muevan las tarjetas según el avance individual del estudiante (y permitir al Administrador alternar entre *"Mi Seguimiento Personal"* y *"Estado Oficial del Curso"*).
3. **Tarea 1.2 — Desglose Nominal de Cumplimiento para el Administrador:**
   - Añadir un desplegable accesible en cada `TaskCard.jsx` (solo visible para Administradores) que muestre la lista completa de estudiantes del grupo y el estado exacto de cada uno en esa tarea (*Finalizada*, *En Progreso*, *Pendiente*).
4. **Tarea 1.3 — Visibilidad de Prioridades (*Alta*, *Media*, *Baja*), Filtro por Prioridad y Ordenamiento Cronológico:**
   - Mostrar insignia de prioridad en cada `TaskCard.jsx` con triple codificación.
   - Ordenar automáticamente las tareas por fecha/hora de entrega más próxima y peso de prioridad.
   - Agregar selector de filtro por prioridad en `AgendaView.jsx`.
5. **Tarea 1.4 — Edición de Datos del Grupo y Gestión Completa de Materias en Panel Admin:**
   - Agregar `updateCurrentGroup` en `AuthGroupContext.jsx` y formulario de edición de grupo (nombre, descripción, código de invitación) en `GroupAdminPanel.jsx`.
   - Añadir edición y eliminación directa de materias desde la tabla de `GroupAdminPanel.jsx`, desasociando de forma segura el `materiaId` en tareas huérfanas al eliminar una materia.

---

## 2. Paso a Paso de Ejecución
1. Registrar `PLAN_03_FASE1_FUNCIONAMIENTO_PURO.md` y actualizar `02_TAREA_ACTIVA.md` y `03_TAREAS_FUTURAS.md`.
2. Actualizar `src/context/TaskContext.jsx`.
3. Actualizar `src/components/tasks/TaskCard.jsx` y `src/components/calendar/AgendaView.jsx`.
4. Actualizar `src/context/AuthGroupContext.jsx` y `src/components/admin/GroupAdminPanel.jsx`.
5. Ejecutar `npm run lint` y `npm run build` y actualizar `01_TAREAS_REALIZADAS.md` y `BITACORA_DECISIONES.md`.
