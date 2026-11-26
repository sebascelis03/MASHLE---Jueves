# 📋 Plan de Implementación #4: Fase 2 — Pulido de Accesibilidad Universal (Lectura por Voz TTS en Tareas, Navegación por Flechas en Grilla de Calendario y Limpieza de Linter)

**Estado:** Aprobado y en Ejecución  
**Fecha:** 2026-11-26

---

## 1. ¿Qué se hará?
1. **Tarea 2.1 — Botón de Lectura en Voz Alta (`TTS`) Directa en cada Tarjeta de Tarea (`TaskCard.jsx`) y Controles Rápidos de Voz (`A11yControls.jsx`):**
   - Añadir botón accesible **"🔊 Escuchar"** en cada `TaskCard.jsx` que lea en voz alta el resumen completo de la tarea (título, materia, prioridad, fecha/hora, estado personal y descripción).
   - Añadir conmutador rápido de **Voz (`TTS`)** en `A11yControls.jsx`.
2. **Tarea 2.2 — Navegación de Grilla por Teclado (Flechas) en el Calendario e Indicadores de Progreso (`CalendarGrid.jsx`):**
   - Soportar navegación por teclado con `ArrowRight`, `ArrowLeft`, `ArrowDown`, `ArrowUp`, `Home` y `End` entre los días del mes.
   - Reflejar el progreso individual del estudiante en los indicadores y anuncios `aria-label` de cada celda del calendario.
3. **Tarea 2.3 — Navegación por Flechas en Pestañas Principales (`App.jsx`) y Limpieza de Warnings en `oxlint`:**
   - Soportar `ArrowRight`, `ArrowLeft`, `Home` y `End` en la barra `role="tablist"` de `App.jsx`.
   - Limpiar advertencias de `oxlint` en `FocusTrap.jsx`, `A11yContext.jsx`, `TaskCard.jsx`, `TaskFormModal.jsx`, `CalendarGrid.jsx` y `scripts/generate-icons.js`.

---

## 2. Paso a Paso de Ejecución
1. Registrar `PLAN_04_FASE2_ACCESIBILIDAD_AVANZADA.md` y actualizar `02_TAREA_ACTIVA.md`.
2. Actualizar `src/components/tasks/TaskCard.jsx` y `src/components/a11y/A11yControls.jsx`.
3. Actualizar `src/components/calendar/CalendarGrid.jsx` y `src/App.jsx`.
4. Limpiar warnings de linter en `FocusTrap.jsx`, `A11yContext.jsx`, `TaskFormModal.jsx` y `scripts/generate-icons.js`.
5. Verificar con `npm run lint` y `npm run build` y actualizar `.docs/`.
