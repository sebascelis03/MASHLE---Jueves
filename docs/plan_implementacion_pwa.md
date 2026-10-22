# 📋 Plan de Implementación: PWA Calendario Estudiantil (Accesibilidad y Usabilidad)

Documento de referencia: [contexto_del_proyecto_de_grado.md](file:///c:/Users/HP%20INC/Desktop/Fesc%202026-2/03%20-%20Jueves/MASHLE/docs/contexto_del_proyecto_de_grado.md)

---

## 🎯 1. Objetivos del Sistema y Alcance
Desarrollar una **Progressive Web App (PWA)** instalable y con soporte offline para la gestión de tareas escolares y grupos estudiantiles cerrados, con un estándar estricto de:
- **Accesibilidad Universal (A11y):** Cumplimiento de WCAG 2.1 (Niveles AA y AAA), navegación 100% por teclado, compatibilidad con lectores de pantalla (NVDA, VoiceOver, JAWS, Narrador), distinción sin depender del color y alto contraste.
- **Usabilidad (UX):** Flujos ágiles con mínima carga cognitiva, prevención activa de errores en cambios de grupo y transferencia de liderazgo asistida.
- **Instalabilidad y Desempeño (PWA):** Carga instantánea, service worker para soporte offline y almacenamiento local reactivo.

---

## 🛠️ 2. Stack Tecnológico
- **Frontend Core:** React 18+ (SPA moderna, componentes funcionales, hooks).
- **Herramienta de Compilación y Servidor:** Vite.
- **Estilos:** Vanilla CSS moderno con Design System accesible (`tokens.css`, variables CSS nativas, alto contraste, animaciones respetuosas con `prefers-reduced-motion`).
- **PWA Tooling:** `vite-plugin-pwa` (generación automática de Service Worker y manifiesto web estándar).
- **Iconografía:** Lucide React enriquecida con etiquetas semánticas y `aria-hidden` para accesibilidad.
- **Persistencia de Datos:** Almacenamiento local reactivo (`localStorage`) con arquitectura desacoplada para soporte 100% offline.

---

## 🏗️ 3. Estructura de la Aplicación

```
MASHLE/
├── docs/                       # Documentación del proyecto (.md)
│   ├── contexto_del_proyecto_de_grado.md
│   └── plan_implementacion_pwa.md
├── public/
│   ├── favicon.svg
│   ├── pwa-192x192.png
│   └── pwa-512x512.png
├── src/
│   ├── components/
│   │   ├── a11y/               # LiveAnnouncer, FocusTrap, SkipLink, A11yControls
│   │   ├── admin/              # SuccessionModal, GroupAdminPanel
│   │   ├── calendar/           # CalendarGrid, AgendaView, DayDetailModal
│   │   ├── common/             # Button, Modal, Badge, Toast
│   │   ├── community/          # GroupSwitcher, GroupWarningDialog, JoinGroupModal
│   │   └── tasks/              # TaskCard, TaskFormModal, TaskStatusFilter
│   ├── context/
│   │   ├── A11yContext.jsx     # Contraste, tamaño de texto, voz/anuncios
│   │   ├── AuthGroupContext.jsx# Usuario, grupo activo, membresía, roles
│   │   └── TaskContext.jsx     # Tareas, materias, WhatsApp links
│   ├── services/
│   │   └── storageService.js   # Semillas y persistencia offline
│   ├── styles/
│   │   ├── tokens.css          # Variables CSS, colores WCAG AAA
│   │   └── index.css           # Estilos base, reset, utilidades accesibles
│   ├── App.jsx
│   └── main.jsx
├── vite.config.js
└── package.json
```

---

## 🚀 4. Fases de Ejecución

1. **Fase 1: Configuración de Entorno & PWA:**
   - Creación de app React + Vite.
   - Instalación y configuración de `vite-plugin-pwa` y `lucide-react`.
   - Manifest Web con soporte para instalación y standalone mode.

2. **Fase 2: Sistema de Diseño Accesible (A11y Core):**
   - Variables CSS con paletas WCAG AAA.
   - Modo normal, modo oscuro y modo alto contraste.
   - Controles de accesibilidad: tamaño de fuente (A- / A+), alternador de alto contraste, indicador de foco visible (3px).
   - `LiveAnnouncer` para anunciar eventos en vivo a lectores de pantalla.
   - `FocusTrap` para modales.

3. **Fase 3: Módulo de Calendario y Tareas Estudiantiles:**
   - Vista dual: Calendario mensual con navegación accesible por teclado + Vista Agenda / Lista accesible.
   - Creación y edición de tareas con atajo de teclado (`Alt + N`).
   - Estados de tareas (Pendiente, En progreso, Finalizada) con triple codificación sensorial (texto, ícono, estilo).
   - Acceso directo a WhatsApp por materia mediante deep link y etiquetas descriptivas.

4. **Fase 4: Comunidades, Roles y Sucesión de Administrador:**
   - Comunidad cerrada con único grupo activo por estudiante.
   - Prevención de errores con diálogo de advertencia destructiva (`role="alertdialog"`).
   - Flujo de sucesión obligatoria: si el administrador sale, se exige selección de sucesor o se ejecuta sucesión automática si es el único paso.
   - Gestión de solicitudes y miembros por parte del administrador.

5. **Fase 5: Verificación y Pruebas Offline:**
   - Verificación de compilación sin errores (`npm run build`).
   - Verificación de service worker y manifest para instalación PWA.
   - Verificación de navegación 100% por teclado y atajos.
