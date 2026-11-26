# 🎓 MASHLE — Calendario Estudiantil Accesible & Usable (PWA)

> **Proyecto de Grado — FESC 2026-2**  
> Plataforma web progresiva (PWA) diseñada bajo los estándares internacionales de **Accesibilidad Universal (WCAG 2.1 Niveles AA y AAA)** y **Heurísticas de Usabilidad (UX)** para la autogestión de tareas escolares, materias y comunidades cerradas de estudiantes.

---

## 🎯 1. Propósito del Proyecto

Las agendas académicas tradicionales suelen excluir a estudiantes con baja visión, ceguera, daltonismo, dificultades auditivas o limitaciones motrices. **MASHLE (Calendario Estudiantil)** elimina estas barreras integrando:

1. **Asistente Inicial de Calibración Inclusiva (Estilo Consola):** Permite calibrar brillo/contraste mediante símbolos de umbral, elegir entre 4 modos de daltonismo, activar síntesis de voz (`TTS`), sonidos del sistema y alertas visuales flotantes.
2. **Navegación 100% por Teclado y Lectores de Pantalla:** Soporte completo de `Tab`, desplazamiento por flechas (`←`, `→`, `↑`, `↓`, `Home`, `End`) en la grilla mensual del calendario y en la barra de pestañas (`role="tablist"`), atajos globales (`Alt + N`, `Alt + C`, `Alt + L`, `Alt + M`), `SkipLink`, `FocusTrap` en modales y anuncios dinámicos `aria-live`.
3. **Triple Codificación Visual (WCAG 1.4.1):** Ningún estado o prioridad se transmite solo con color; todos combinan **Color + Ícono + Etiqueta Textual + Borde**.
4. **Autogestión Estudiantil y Tablero Scrum Reactivo:** Separación estricta entre las tareas oficiales publicadas por el estudiante Administrador y el seguimiento personal de 3 estados (*Por realizar*, *En progreso*, *Ya la realicé*) con notas privadas para cada estudiante.
5. **Comunidades Cerradas con Sucesión Garantizada:** Regla de membresía única (*1 estudiante = 1 grupo activo*), ingreso por código de invitación o solicitud aprobada, y protocolo obligatorio de sucesión para que ningún grupo quede sin administrador.

---

## 🔑 2. Cuentas Oficiales de Prueba y Modo Sustentación en 1 Clic

El portal de acceso (`AuthView`) incluye **7 cuentas preconfiguradas** y un botón de **"⚡ Cargar Demo & Entrar"** que puebla automáticamente 2 comunidades, 5 materias con enlaces de WhatsApp, 6 tareas en el mes actual, avances individuales y solicitudes pendientes:

| Cuenta | Usuario / Correo | Contraseña | Rol Base | Comunidad en Escenario Demo |
| :--- | :--- | :---: | :--- | :--- |
| **Admin 1** | `admin1` / `admin1@gmail.com` | `1234` | 👑 Administrador | Ingeniería de Software — Semestre 2026-2 (`FESC-2026`) |
| **Admin 2** | `admin2` / `admin2@gmail.com` | `1234` | 👑 Administrador | Semillero de Investigación UX & A11y (`UX-A11Y`) |
| **Admin 3** | `admin3` / `admin3@gmail.com` | `1234` | 👑 Administrador | Sin grupo inicial (disponible para crear comunidad en vivo) |
| **User 1** | `user1` / `user1@gmail.com` | `4321` | 🎒 Estudiante | Miembro de Ingeniería de Software (`FESC-2026`) |
| **User 2** | `user2` / `user2@gmail.com` | `4321` | 🎒 Estudiante | Miembro de Ingeniería de Software (`FESC-2026`) |
| **User 3** | `user3` / `user3@gmail.com` | `4321` | 🎒 Estudiante | Con solicitud pendiente en `FESC-2026` (para aprobar en vivo) |
| **User 4** | `user4` / `user4@gmail.com` | `4321` | 🎒 Estudiante | Miembro de Semillero UX & A11y (`UX-A11Y`) |

> 💡 **Cambio Rápido en Vivo:** Una vez dentro de la aplicación, haz clic en el botón **`Perfil / Demo`** de la barra superior para cambiar en 1 clic entre cualquiera de las 7 cuentas sin cerrar sesión, editar tu perfil o recargar/limpiar los datos de demostración.

---

## ⌨️ 3. Mapa de Atajos de Teclado Accesibles

| Atajo / Tecla | Acción en el Sistema |
| :--- | :--- |
| `Tab` / `Shift + Tab` | Recorrer elementos interactivos con anillo de foco visible de alto contraste (`3px`) |
| `Alt + N` | Abrir ventana de **Nueva Tarea Escolar** (exclusivo para Administrador) |
| `Alt + C` | Cambiar a la pestaña **Calendario** |
| `Alt + L` | Cambiar a la pestaña **Tablero Scrum & Lista** |
| `Alt + M` | Cambiar a la pestaña **Materias & WhatsApp** |
| `←` `→` `↑` `↓` `Home` `End` | Desplazarse por los días de la grilla mensual del Calendario o entre las pestañas principales |
| `Escape` | Cerrar cualquier modal o diálogo activo y restaurar el foco al botón disparador |

---

## 🧱 4. Arquitectura y Tecnologías

- **Frontend:** React 19 + JSX.
- **Bundler:** Vite 8.
- **PWA & Offline-First:** `vite-plugin-pwa` (Workbox Service Worker + `manifest.webmanifest`).
- **Estilos:** Vanilla CSS con arquitectura de Design Tokens (`src/styles/tokens.css`), modo Alto Contraste WCAG AAA y 4 paletas de daltonismo (*Protanopía*, *Deuteranopía*, *Tritanopía*, *Acromatopsia*).
- **Iconografía Accesible:** `lucide-react` con atributos `aria-hidden="true"` acompañados siempre de etiquetas semánticas.
- **Documentación Interna (Fuente Única de Verdad):** Centralizada en la carpeta `.docs/` dividida en 6 subcarpetas temáticas.

---

## 💻 5. Instalación y Ejecución Local

### Prerrequisitos
- **Node.js** 18.0 o superior.

### Comandos
1. **Instalar dependencias:**
   ```bash
   npm install
   ```
2. **Iniciar servidor de desarrollo local:**
   ```bash
   npm run dev
   ```
3. **Ejecutar en red local multi-dispositivo (para probar en celulares en el mismo Wi-Fi):**
   ```bash
   npm run dev -- --host
   ```
4. **Compilar versión de producción PWA:**
   ```bash
   npm run build
   npm run preview
   ```
