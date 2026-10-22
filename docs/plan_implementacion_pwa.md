# 📋 Plan de Implementación Maestro: PWA Calendario Estudiantil (Accesibilidad y Usabilidad)

**Documento del Proyecto de Grado:** FESC 2026-2  
**Tecnología Base:** Vite + React 19 + PWA Offline + Vanilla CSS (Design Tokens)  
**Entorno de Red:** Modo local multi-dispositivo vía `npm run dev -- --host`  
**Almacenamiento:** 100% Local (`localStorage` / Offline-First)  
**Control de Versiones:** Commits manuales gestionados exclusivamente por el usuario (sin ejecución de comandos Git por agentes).

---

## 🎯 1. Objetivos del Sistema y Nuevas Especificaciones

1. **Onboarding de Calibración Inclusiva (Estilo PlayStation / Consola de Videojuegos):**
   - Asistente de inicio interactivo con botón visible de **"Omitir"** en todo momento.
   - **Prueba de Brillo y Contraste:** Cuadro con símbolos en diferentes umbrales (*"Ajusta el contraste hasta que el símbolo izquierdo sea apenas visible y el derecho sea claramente visible"*), activador de Alto Contraste (WCAG AAA).
   - **Prueba y Modos de Daltonismo:** Mini-test visual interactivo y selector de paletas adaptadas (Protanopía, Deuteranopía, Tritanopía, Monocromático) con doble codificación obligatoria (color + ícono + texto).
   - **Herramientas para Discapacidad Visual:** Síntesis de voz integrada (Web Speech API TTS) para lectura en voz alta de tareas y contenidos, más soporte total de lectores de pantalla (NVDA, JAWS, Narrador) y atajos de teclado globales.
   - **Herramientas para Discapacidad Auditiva:** Notificaciones 100% visuales con banners emergentes y transcripciones accesibles, sin depender jamás exclusivamente de avisos sonoros.

2. **Gestión Estricta de Comunidades (1 Estudiante = 1 Grupo Máximo):**
   - Filosofía similar a grupos cerrados de mensajería (WhatsApp).
   - Si un estudiante está en un grupo e intenta **crear** o **unirse** a otro:
     - **Miembro estándar:** Alerta obligatoria de confirmación; al aceptar, sale automáticamente del grupo anterior y se incorpora al nuevo.
     - **Administrador:** No puede salir sin antes transferir la administración mediante la selección guiada de un sucesor (o sucesión asistida si es el único caso).

3. **Segregación Estricta de Carga de Tareas y Seguimiento Individual:**
   - **Administradores designados:** Únicos autorizados para crear, editar, programar y eliminar tareas oficiales del curso escolar y gestionar materias/enlaces de WhatsApp.
   - **Estudiantes miembros:** No alteran la tarea oficial colectiva; cuentan con su propio panel de estado:
     - Marcar: **"Ya la realicé"** / **"No la he realizado"** / **"En proceso"**.
     - **Notas personales privadas:** Campo de texto libre para apuntes personales (ej. "Me falta redactar la conclusión", "Entregado por correo").
   - **Métricas del Administrador:** Visualización del porcentaje del salón que ya realizó cada tarea (ej. 15 de 22 alumnos).

---

## 🏗️ 2. Arquitectura de Componentes y Almacenamiento

```
src/
├── components/
│   ├── a11y/
│   │   ├── A11yOnboardingModal.jsx  # Wizard estilo PlayStation (Contraste, Daltonismo, TTS, Omitir)
│   │   ├── A11yControls.jsx         # Barra rápida superior (Alto contraste, Texto, Lector TTS)
│   │   ├── LiveAnnouncer.jsx        # Región aria-live y alertas visuales tipo banner
│   │   ├── FocusTrap.jsx            # Confinamiento seguro de teclado para modales
│   │   └── SkipLink.jsx             # Salto directo al contenido principal
│   ├── admin/
│   │   ├── GroupAdminPanel.jsx      # Panel de administración, aprobación y métricas de tareas
│   │   └── SuccessionModal.jsx      # Cesión obligatoria de rol antes de salir del grupo
│   ├── auth/
│   │   └── AuthView.jsx             # Login, Registro local y cuentas mock
│   ├── calendar/
│   │   ├── CalendarGrid.jsx         # Grilla mensual accesible
│   │   └── AgendaView.jsx           # Vista de lista con filtros
│   ├── community/
│   │   ├── GroupCommunityView.jsx   # Vista de comunidad, crear y unirse a grupos
│   │   └── GroupWarningDialog.jsx   # Confirmación destructiva de cambio de grupo
│   └── tasks/
│       ├── TaskCard.jsx             # Tarjeta con estado individual del alumno + notas personales
│       ├── TaskFormModal.jsx        # Modal de creación/edición exclusivo para administradores
│       └── TaskStatusBadge.jsx      # Badge con icono, texto y color adaptado a daltonismo
├── context/
│   ├── A11yContext.jsx              # Configuración A11y, tema, daltonismo, TTS, sonidos
│   ├── AuthGroupContext.jsx         # Sesión, grupo único, miembros, roles y sucesión
│   └── TaskContext.jsx              # Tareas oficiales + progreso y notas de cada estudiante
├── services/
│   └── storageService.js            # Base de datos local (localStorage) desacoplada y reactiva
└── styles/
    ├── tokens.css                   # Variables CSS, paletas de daltonismo, alto contraste
    └── index.css                    # Clases utilitarias y reseteo accesible
```

---

## 📊 3. Esquema de Datos en Almacenamiento Local (`localStorage`)

```javascript
// 1. Tareas Oficiales (Solo administradores escriben aquí)
cal_estudiantil_tasks: [
  {
    id: "tsk-1",
    grupoId: "grp-ingenieria-10a",
    materiaId: "mat-accesibilidad",
    titulo: "Auditoría WCAG 2.1 AAA",
    descripcion: "Pruebas con lectores de pantalla y navegación por teclado.",
    fechaEntrega: "2026-10-28",
    horaEntrega: "23:59",
    creadorId: "usr-admin-1"
  }
]

// 2. Progreso y Notas Personales del Estudiante
// Clave: cal_estudiantil_user_progress
{
  "usr-2_tsk-1": {
    userId: "usr-2",
    taskId: "tsk-1",
    realizada: true, // true = "Ya la realicé" | false = "No la he realizado"
    notasPersonales: "Falta enviar anexo por correo al profesor.",
    fechaModificacion: "2026-10-22T13:40:00Z"
  }
}

// 3. Preferencias de Accesibilidad
// Clave: cal_estudiantil_settings
{
  onboardingCompletado: true,
  altoContraste: false,
  modoDaltonismo: "normal", // 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'monocromatico'
  calibracionContraste: 100, // 80 - 140%
  fontSize: "normal",        // 'normal' | 'large' | 'xlarge'
  lectorVozActivo: false,
  alertasVisuales: true
}
```

---

## 🛠️ 4. Fases de Ejecución

1. **Fase 1: Motor de Accesibilidad & Calibrador PlayStation:**
   - Crear `A11yOnboardingModal.jsx` con el flujo por pasos: Contraste (con caja apenas/claramente visible), Daltonismo con previsualización, Asistencia auditiva/visual y botón "Omitir".
   - Integrar síntesis de voz (`window.speechSynthesis`) y alertas visuales sin depender de audio.
   - Enriquecer `tokens.css` con variables para modos de daltonismo.

2. **Fase 2: Segregación de Roles & Tareas con Notas Personales:**
   - Restringir la apertura de `TaskFormModal` y la eliminación de tareas exclusivamente al Administrador.
   - Transformar `TaskCard.jsx` para que cada estudiante visualice y actualice su progreso particular ("Ya la realicé" / "No la he realizado") y edite sus notas privadas persistidas localmente.
   - Agregar métricas de entrega para el Administrador en la cabecera de la tarea.

3. **Fase 3: Refuerzo de la Regla de Grupo Único & Advertencias:**
   - Asegurar que cualquier intento de crear un grupo nuevo o ingresar a otro requiera la salida explícita del actual mediante diálogo modal de confirmación.
   - Flujo de sucesión obligatoria cuando quien sale es el Administrador.

4. **Fase 4: Verificación de Build & Prueba en Red Local:**
   - Validar compilación con `npm run build`.
   - Probar en red multi-dispositivo con `npm run dev -- --host`.
