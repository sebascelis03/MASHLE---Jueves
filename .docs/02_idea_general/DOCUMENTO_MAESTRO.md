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
2. **Gestión Segura de Comunidades Cerradas:** Modelo de membresía única (*1 estudiante = 1 grupo activo*) con ingreso por código de invitación o solicitud de acceso aprobada por el administrador, prevención de pérdida accidental de datos y protocolo obligatorio de sucesión de administrador.
3. **Segregación de Tareas Oficiales vs. Seguimiento Individual:** Solo el administrador gestiona las tareas oficiales del curso, mientras que cada estudiante lleva su control privado (*"Ya la realicé" / "No la he realizado"*) y sus notas personales.

---

## 2. 🧩 Módulos Funcionales del Sistema

### 2.1. Portal de Autenticación (`AuthView`)
- Inicio de sesión con usuario o correo electrónico y contraseña (con botón accesible para mostrar/ocultar contraseña).
- Registro local de nuevos estudiantes (con apertura automática del asistente de calibración A11y).
- Panel de acceso rápido con **7 cuentas oficiales preconfiguradas** (`storageService.js`):
  - **Administradores (Clave `1234`):**
    - `admin1` (`admin1@gmail.com`) — *Admin 1*
    - `admin2` (`admin2@gmail.com`) — *Admin 2*
    - `admin3` (`admin3@gmail.com`) — *Admin 3*
  - **Estudiantes Miembros (Clave `4321`):**
    - `user1` (`user1@gmail.com`) — *User 1*
    - `user2` (`user2@gmail.com`) — *User 2*
    - `user3` (`user3@gmail.com`) — *User 3*
    - `user4` (`user4@gmail.com`) — *User 4*

### 2.2. Suite de Accesibilidad Universal (`src/components/a11y/`)
- **Asistente de Calibración (`A11yOnboardingModal`):** Wizard interactivo de 4 pasos (con opción de omitir y lectura por voz de cada paso) para calibrar brillo/contraste, probar modos de daltonismo, activar síntesis de voz/sonidos y alertas visuales.
- **Panel Superior Rápido (`A11yControls`):** Estado de red en vivo (`En línea` / `Sin conexión`), botón de recalibración, conmutador de Alto Contraste AAA, escala tipográfica (`A`, `A+`, `A++`) y diálogo de atajos de teclado con `FocusTrap`.
- **Infraestructura A11y:** `SkipLink` (salto al contenido principal), `FocusTrap` (confinamiento y restauración de foco en modales), `LiveAnnouncer` (regiones `aria-live="polite"` y `assertive`) y `ToastHost` (notificaciones visuales accesibles para discapacidad auditiva).

### 2.3. Calendario Mensual de Actividades (`CalendarGrid`)
- Cuadrícula mensual accesible de 7 columnas (Lunes a Domingo).
- Navegación entre meses (`Anterior`, `Hoy`, `Siguiente`) con anuncio audible del mes activo.
- Indicadores de tareas por fecha y conexión con `AgendaView` para filtrar por el día seleccionado (`selectedDate`).

### 2.4. Tablero Scrum & Lista de Seguimiento Individual (`AgendaView`, `TaskCard`, `TaskFormModal`)
- **Modos de vista:** Tablero Scrum de 3 columnas (*Pendientes*, *En Progreso*, *Finalizadas*) y vista de Lista tradicional.
- **Filtros combinados:** Filtro por materia, filtro por día seleccionado en el calendario y filtro por progreso personal (*Todo mi seguimiento*, *Solo mis tareas pendientes*, *Solo mis tareas realizadas*).
- **Segregación de permisos:** Solo el **Administrador** del grupo puede crear, editar, cambiar el estado oficial o eliminar tareas del curso (`Alt + N`).
- **Progreso individual y notas privadas:** Cada alumno marca su estado personal (*"Ya la realicé" / "No la he realizado"*) y guarda notas privadas persistidas localmente.
- **Métricas del grupo:** Barra de progreso (`progressbar` ARIA) visible para el administrador con el conteo de cuántos estudiantes del salón ya realizaron cada tarea.

### 2.5. Directorio de Materias y Enlaces de WhatsApp (`SubjectsDirectoryView`)
- Catálogo de asignaturas del grupo con buscador en tiempo real, docente, correo electrónico, notas de horario y color identificador.
- **Deep Links accesibles a WhatsApp:** Botones con etiquetas semánticas descriptivas (`aria-label="Abrir chat de WhatsApp de [Materia]..."`) y `rel="noopener noreferrer"`.

### 2.6. Mi Comunidad Escolar (`GroupCommunityView`, `GroupWarningDialog`)
- Visualización de la comunidad activa y su código de invitación.
- **Ingreso por Código de Invitación:** Formulario rápido para unirse introduciendo el código del grupo.
- **Solicitudes de Acceso:** Posibilidad de enviar solicitud de acceso (que el administrador aprueba en el Panel Admin) o unirse directamente.
- **Regla de Membresía Única:** Si el estudiante intenta cambiarse o crear otro grupo, se dispara un diálogo accesible (`role="alertdialog"`) advirtiendo la salida automática de su grupo actual.

### 2.7. Panel de Administración y Sucesión (`GroupAdminPanel`, `SuccessionModal`)
- Aprobación/rechazo de solicitudes de ingreso pendientes.
- Gestión de miembros: asignación de Co-Administradores, retiro/expulsión de miembros y transferencia voluntaria del liderazgo principal permaneciendo en el grupo (`transfer_only`).
- **Protocolo Obligatorio de Sucesión al Salir:** Si el Administrador intenta abandonar el grupo, el sistema impide que la comunidad quede acéfala exigiendo elegir manualmente a un estudiante sucesor o aplicar asignación automática.

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
│   │   ├── calendar/                      # CalendarGrid, AgendaView
│   │   ├── common/                        # PWAInstallBanner
│   │   ├── community/                     # GroupCommunityView, GroupWarningDialog
│   │   ├── subjects/                      # SubjectsDirectoryView
│   │   └── tasks/                         # TaskCard, TaskFormModal, TaskStatusBadge
│   ├── context/
│   │   ├── A11yContext.jsx                # Estado global de accesibilidad, TTS, audio y temas
│   │   ├── AuthGroupContext.jsx           # Estado de sesión, grupo único, solicitudes, miembros y sucesión
│   │   └── TaskContext.jsx                # Tareas oficiales del curso y progreso/notas por alumno
│   ├── services/
│   │   └── storageService.js              # Persistencia Offline-First en localStorage (7 cuentas base)
│   ├── styles/
│   │   ├── tokens.css                     # Design Tokens, Alto Contraste AAA y modos de daltonismo
│   │   └── index.css                      # Estilos base, layout responsivo y componentes
│   ├── App.jsx                            # Layout principal, atajos Alt+N/C/L/M y navegación por pestañas
│   └── main.jsx                           # Punto de entrada React 19
├── index.html
├── package.json
└── vite.config.js                         # Configuración Vite 8 + vite-plugin-pwa
```
