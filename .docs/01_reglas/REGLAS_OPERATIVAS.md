# ⚖️ Reglas Operativas Estrictas del Proyecto

Este documento constituye la norma permanente e inquebrantable de trabajo para el proyecto **MASHLE (Calendario Estudiantil Accesible y Usable)**. Ninguna acción sobre el código o la configuración puede ejecutarse fuera de estos lineamientos.

---

## 1. 📋 Planificación Obligatoria Previa
- **Prohibición de modificación directa:** Está estrictamente prohibido crear, editar o eliminar archivos de código, estilos, documentación o configuración sin antes redactar y presentar al usuario un **Plan de Implementación numerado** (`PLAN_XX_...`).
- **Contenido obligatorio de todo Plan:**
  1. **¿Qué se hará?**: Alcance claro y archivos afectados.
  2. **¿Cómo está planteado?**: Diseño técnico, arquitectura o cambios específicos.
  3. **Paso a paso de ejecución**: Secuencia ordenada de acciones y verificación.
- **Requisito de aprobación explícita:** Solo se puede escribir o modificar archivos después de recibir la confirmación explícita del usuario.

---

## 2. 🚫 Prohibición Absoluta de Comandos Git
- **Cero ejecución automática de Git:** Está estrictamente prohibido ejecutar cualquier comando de `git` (`git init`, `git status`, `git add`, `git commit`, `git push`, `git pull`, `git checkout`, `git branch`, `git merge`, `git reset`, etc.) desde la terminal del agente.
- **Entrega manual al usuario:** Siempre que una tarea o fase requiera control de versiones o cambio de rama, el agente debe redactar los comandos exactos en un bloque de código para que el usuario los ejecute manualmente en su terminal y confirme el resultado.

---

## 3. 🗂️ Política de Compactación y Orden Documental (`.docs/`)
- **Fuente Única de Verdad:** Toda la documentación del proyecto vive exclusivamente dentro de la carpeta raíz `.docs/`, dividida estrictamente en 6 subcarpetas temáticas:
  1. `.docs/01_reglas/` → `REGLAS_OPERATIVAS.md`
  2. `.docs/02_idea_general/` → `DOCUMENTO_MAESTRO.md`
  3. `.docs/03_referencia_ui_diseno/` → Guías estéticas, paleta de colores, tipografía, accesibilidad visual y referencias de vistas/componentes.
  4. `.docs/04_toma_de_decisiones/` → `BITACORA_DECISIONES.md` (registro cronológico e incremental de decisiones técnicas, iteraciones, errores y soluciones).
  5. `.docs/05_tareas_pendientes/` → Gestión de tareas en tres archivos:
     - `01_TAREAS_REALIZADAS.md` (resumen simplificado de lo completado).
     - `02_TAREA_ACTIVA.md` (el foco único en el que se trabaja actualmente).
     - `03_TAREAS_FUTURAS.md` (pendientes a futuro y hallazgos detectados que no se tocarán por el momento).
  6. `.docs/06_planes_implementacion/` → Almacén exclusivo de cada Plan de Implementación numerado (`PLAN_01_...md`, `PLAN_02_...md`, etc.).
- **Compactación periódica bajo instrucción:** Cuando el usuario lo indique explícitamente, los planes de implementación antiguos o ya superados en `.docs/06_planes_implementacion/` se compactarán en un único archivo Markdown histórico para evitar acumulación y desorden.
