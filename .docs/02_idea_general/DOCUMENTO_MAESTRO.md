# 📘 Documento Maestro: MASHLE — Calendario Estudiantil Accesible y Usable

**Proyecto de Grado:** FESC 2026-2  
**Enfoque Central:** Accesibilidad Universal (WCAG 2.1 Niveles AA y AAA), Usabilidad (UX) e Inclusión Escolar  
**Arquitectura:** React 19 + Vite 8 + PWA Offline-First + Vanilla CSS (Design Tokens)

---

## 1. 🎯 ¿Qué es el Proyecto y Qué Problema Resuelve?

**MASHLE (Calendario Estudiantil)** es una aplicación web progresiva (PWA) enfocada en el registro, organización y seguimiento de tareas académicas dentro de comunidades cerradas de estudiantes.

### Problema que Resuelve
Las plataformas académicas y agendas digitales convencionales suelen presentar barreras severas para estudiantes con discapacidad visual, baja visión, daltonismo, dificultades auditivas o limitaciones motrices (dependencia del ratón), además de carecer de mecanismos claros de prevención de errores al gestionar grupos estudiantiles.

MASHLE resuelve esto mediante:
1. **Accesibilidad Universal Nativa (WCAG 2.1 AA/AAA):** Navegación 100% por teclado, atajos globales, trampa de foco en modales, asistente inicial de calibración visual/auditiva estilo consola, síntesis de voz integrada (TTS), anuncios dinámicos (`aria-live`), modo de alto contraste AAA y 4 filtros/paletas para daltonismo con triple codificación (color + ícono + texto).
2. **Contraste Metodológico ("El Antes vs. El Después"):** Integra tanto la versión final accesible (`/`) como el apartado de boceto inicial de baja fidelidad (`/boceto`) para demostrar académicamente la evolución arquitectónica, visual y funcional del software.
3. **Gestión Segura de Comunidades Cerradas:** Modelo de membresía única (*1 estudiante = 1 grupo activo*) con prevención de pérdida accidental de datos y protocolo obligatorio de sucesión de administrador.

---

## 2. 🧩 Módulos Funcionales del Sistema

### 2.1. Portal de Autenticación (`AuthView`)
- Inicio de sesión con correo institucional y contraseña (con botón accesible para mostrar/ocultar contraseña).
- Registro local de nuevos estudiantes.
- Panel de acceso rápido con **3 cuentas mock preconfiguradas** para pruebas inmediatas de roles:
  - **Carlos Mendoza** (`prueba1@gmail.com` / `1234`): **Administrador** de *Ingeniería de Software 10A*.
  - **Valentina Restrepo** (`prueba2@gmail.com` / `1234`): **Estudiante** miembro de *Ingeniería de Software 10A*.
  - **Sofía Carvajal** (`prueba3@gmail.com` / `1234`): **Administradora** de *Semillero UX*.

### 2.2. Suite de Accesibilidad Universal (`src/components/a11y/`)
- **Asistente de Calibración (`A11yOnboardingModal`):** Wizard interactivo al primer ingreso (con opción de omitir) para calibrar brillo/contraste, probar modos de daltonismo y activar asistencia de voz o alertas visuales.
- **Panel Flotante Rápido (`A11yControls`):** Conmutadores en tiempo real para Alto Contraste, escala tipográfica (`A`, `A+`, `A++`), filtros de daltonismo, brillo y lector de voz (Web Speech API).
- **Infraestructura A11y:** `SkipLink` (salto al contenido principal), `FocusTrap` (confinamiento y restauración de foco en modales), `LiveAnnouncer` (regiones `aria-live="polite"` y `assertive`) y `ToastHost` (notificaciones visuales accesibles para discapacidad auditiva).

### 2.3. Calendario Mensual de Actividades (`CalendarGrid`)
- Cuadrícula mensual accesible de 7 columnas (Lunes a Domingo).
- Navegación entre meses (`Anterior`, `Hoy`, `Siguiente`) con anuncio audible del mes activo.
- Indicadores claros de tareas por fecha y apertura rápida de detalles.

### 2.4. Tablero & Lista de Seguimiento Individual (`AgendaView`, `TaskCard`, `TaskFormModal`)
- **Segregación de permisos:** Solo el **Administrador** del grupo puede crear, editar o eliminar tareas oficiales del curso (`Alt + N`).
- **Progreso individual por estudiante:** Cada alumno gestiona su estado personal sobre cada tarea oficial (*Pendiente*, *En Progreso*, *Finalizada* / *Ya la realicé*) sin alterar el registro de sus compañeros.
- **Notas privadas:** Campo personal persistido localmente por estudiante y tarea.
- **Métricas del grupo:** Indicadores de cumplimiento colectivo visibles para la administración.

### 2.5. Directorio de Materias y Enlaces de WhatsApp (`SubjectsDirectoryView`)
- Catálogo de asignaturas del grupo con código, docente asignado y horarios.
- **Deep Links accesibles a WhatsApp:** Botones con etiquetas semánticas descriptivas (`aria-label="Abrir grupo de WhatsApp para [Materia]..."`) y `rel="noopener noreferrer"`.

### 2.6. Mi Comunidad Escolar (`GroupCommunityView`, `GroupWarningDialog`)
- Visualización de la comunidad activa y código de invitación para compartir.
- Exploración de otras comunidades o creación de un nuevo grupo.
- **Regla de Membresía Única:** Si el estudiante intenta cambiarse o crear otro grupo, se dispara un diálogo accesible (`role="alertdialog"`) advirtiendo la salida automática de su grupo actual.

### 2.7. Panel de Administración y Sucesión (`GroupAdminPanel`, `SuccessionModal`)
- Aprobación/rechazo de solicitudes de ingreso, gestión de miembros y transferencia de liderazgo.
- **Protocolo Obligatorio de Sucesión:** Si el Administrador intenta abandonar el grupo, el sistema impide que la comunidad quede acéfala exigiendo elegir manualmente a un estudiante sucesor (o aplicar sucesión asistida).

### 2.8. Apartado de Boceto Inicial (`BocetoView` en `/boceto`)
- Representación funcional de la primera versión (wireframe de baja fidelidad en líneas grises de 1px, tablas planas y sin capa A11y ni tokens modernos), accesible mediante `/boceto` o el botón de conmutación en la cabecera para toma de evidencias comparativas.

---

## 3. 🏗️ Arquitectura Técnica y Estructura del Código

```text
MASHLE/
├── .docs/                                 # Fuente Única de Verdad (Documentación)
├── public/                                # Iconos PWA (192x192, 512x512) y activos estáticos
├── scripts/
│   └── generate-icons.js                  # Script utilitario de iconos PWA
├── src/
│   ├── assets/                            # Recursos gráficos internos
│   ├── components/
│   │   ├── a11y/                          # A11yControls, A11yOnboardingModal, FocusTrap, LiveAnnouncer, SkipLink, ToastHost
│   │   ├── admin/                         # GroupAdminPanel, SuccessionModal
│   │   ├── auth/                          # AuthView
│   │   ├── boceto/                        # BocetoView, boceto.css (Versión wireframe comparativa)
│   │   ├── calendar/                      # CalendarGrid, AgendaView
│   │   ├── common/                        # PWAInstallBanner
│   │   ├── community/                     # GroupCommunityView, GroupWarningDialog
│   │   ├── subjects/                      # SubjectsDirectoryView
│   │   └── tasks/                         # TaskCard, TaskFormModal, TaskStatusBadge
│   ├── context/
│   │   ├── A11yContext.jsx                # Estado global de accesibilidad, TTS, audio y temas
│   │   ├── AuthGroupContext.jsx           # Estado de sesión, grupo único, miembros y sucesión
│   │   └── TaskContext.jsx                # Tareas oficiales del curso y progreso/notas por alumno
│   ├── services/
│   │   └── storageService.js              # Persistencia Offline-First en localStorage con datos semilla
│   ├── styles/
│   │   ├── tokens.css                     # Design Tokens, Alto Contraste AAA y modos de daltonismo
│   │   └── index.css                      # Estilos base, layout responsivo y componentes
│   ├── App.jsx                            # Enrutador principal (/ vs /boceto), atajos Alt+N/C/L/M y layout
│   └── main.jsx                           # Punto de entrada React 19
├── index.html
├── package.json
└── vite.config.js                         # Configuración Vite 8 + vite-plugin-pwa
```

---

## 4. 💾 Modelo de Persistencia Local (`storageService.js`)

El sistema opera **100% Offline-First** sobre `localStorage`:
- **Usuarios y Sesión:** Cuentas mock iniciales + cuentas registradas localmente y sesión activa.
- **Grupos y Solicitudes:** Comunidades escolares, lista de miembros, administrador actual y solicitudes pendientes.
- **Materias y Tareas Oficiales:** Asignaturas con enlaces de WhatsApp y tareas creadas por el administrador del grupo.
- **Progreso Personal (`user_progress`):** Mapa indexado por `userId` y `taskId` que almacena el estado individual (`pending`, `in_progress`, `completed`) y las `notasPersonales` privadas de cada estudiante.
- **Preferencias A11y:** Configuración persistente de alto contraste, tamaño de fuente, filtro de daltonismo, nivel de brillo, síntesis de voz y estado del onboarding.
