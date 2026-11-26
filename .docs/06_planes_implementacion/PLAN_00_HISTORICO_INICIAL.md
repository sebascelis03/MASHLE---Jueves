# 🗄️ Plan 00 (Histórico Compactado): Implementación Inicial PWA Accesible y Apartado `/boceto`

> **Nota de Compactación:** Este documento preserva y compacta los dos planes de implementación originales que existían en la antigua carpeta `docs/` (`plan_implementacion_pwa.md` y `plan_implementacion_boceto.md`) antes de la adopción de `.docs/` como Fuente Única de Verdad.

---

## Parte A: Plan Original de la PWA Calendario Estudiantil (Accesibilidad y Usabilidad)

### 1. Objetivos Implementados
1. **Onboarding de Calibración Inclusiva (`A11yOnboardingModal.jsx`):**
   - Asistente interactivo al primer ingreso con botón **"Omitir"** permanente.
   - Calibración de brillo y contraste con símbolos de umbral visual y activador de Alto Contraste (WCAG AAA).
   - Selector de modos de daltonismo (*Normal*, *Protanopía*, *Deuteranopía*, *Tritanopía*, *Monocromático*) con triple codificación obligatoria (color + ícono + texto).
   - Síntesis de voz integrada (Web Speech API) + soporte de lectores de pantalla (`LiveAnnouncer.jsx`) + notificaciones visuales (`ToastHost.jsx`).
2. **Gestión Estricta de Comunidades (1 Estudiante = 1 Grupo Máximo):**
   - Confirmación accesible con `role="alertdialog"` (`GroupWarningDialog.jsx`) al intentar cambiar o crear otro grupo.
   - Protocolo obligatorio de sucesión de administrador (`SuccessionModal.jsx`) antes de abandonar el grupo.
3. **Segregación de Permisos en Tareas:**
   - Solo el Administrador crea, edita o elimina tareas oficiales del grupo (`TaskFormModal.jsx`).
   - Cada estudiante gestiona su estado individual (*Pendiente*, *En Progreso*, *Finalizada*) y sus notas personales privadas (`TaskCard.jsx`).

---

## Parte B: Plan Original del Apartado de Boceto Inicial (`/boceto`)

### 1. Propósito Académico
Evidenciar la evolución del software mediante capturas comparativas **"Antes (`/boceto`) vs. Después (`/`)"** para el informe y sustentación del Proyecto de Grado.

### 2. Capas Retiradas en `/boceto`
- **Sin capa A11y:** Sin `A11yControls`, sin `A11yOnboardingModal`, sin síntesis de voz, sin `LiveAnnouncer`, sin `ToastHost`, sin `SkipLink`, sin `FocusTrap` y sin atajos `Alt + N/C/L/M`.
- **Sin diseño moderno ni tokens:** Sin modo oscuro, sin paletas de daltonismo, sin gradientes ni insignias cromáticas dobles (los estados se muestran en texto plano: `[PENDIENTE]`, `[EN PROCESO]`, `[FINALIZADA]`).
- **Sin PWA ni sucesión en 2 pasos:** Interfaz plana con cuadrícula de 1px (`#9ca3af`), tipografía `Arial` y tablas HTML clásicas.

### 3. Organización y Navegación
- Emplea los títulos reales de la plataforma (*Calendario Estudiantil*, *Portal de Acceso para Estudiantes*) sin etiquetas artificiales de "Modo Wireframe".
- Conmutación bidireccional directa entre `/` y `/boceto` mediante botón en la cabecera o URL.
