# 📦 Registro Oficial de Exportación y Despliegue — MASHLE (Calendario Estudiantil PWA)

Este documento certifica y registra de manera integral el estado, arquitectura, artefactos compilados y configuración en la nube de la **versión actual exportada** del proyecto **MASHLE (Calendario Estudiantil Accesible & Usable)** para el **Proyecto de Grado — FESC 2026-2**.

---

## 🕒 1. Metadatos Oficiales de la Exportación

| Campo | Valor Registrado |
| :--- | :--- |
| **Nombre del Sistema** | MASHLE — Calendario Estudiantil Accesible & Usable (PWA) |
| **Versión de Exportación** | `v1.0.0-production` (Build Híbrido: Firebase Cloud + Offline-First PWA) |
| **Fecha de Exportación** | **26 de noviembre de 2026** (`2026-11-26`) |
| **Hora de Exportación** | **19:13:27 (UTC-5 / Hora Oficial de Colombia)** |
| **Rama Git Activa** | `dev-sebas` |
| **Proyecto Firebase ID** | `mashle-beta777` |
| **URL Principal (Firebase Hosting)** | `https://mashle-beta777.web.app` |
| **URL Alternativa (Firebase App)** | `https://mashle-beta777.firebaseapp.com` |
| **Base de Datos en Tiempo Real** | Cloud Firestore (`(default)` — Colección: `mashle_app_state` / Documento: `global_state`) |
| **Respaldo Local / Sin Conexión** | `localStorage` (`cal_estudiantil_v2_clean`) + Service Worker Workbox (`dist/sw.js`) |

---

## 🏗️ 2. Resumen Técnico del Build Exportado (`dist/`)

La exportación de producción se genera mediante **Vite 8 (`vite build`)** y **`vite-plugin-pwa` (v2.0.0)**, produciendo los siguientes artefactos verificados con **0 errores de compilación**:

- **`dist/index.html`**: Punto de entrada HTML5 semántico con metadatos de aplicación web progresiva.
- **`dist/manifest.webmanifest`**: Manifiesto PWA estándar con `display: "standalone"`, orientación adaptable, colores de tema (`#1e293b` / `#0f172a`) e iconos `any maskable` (`pwa-192x192.png` y `pwa-512x512.png`).
- **`dist/sw.js` y `dist/workbox-*.js`**: Service Worker con precarga (*precache*) de los activos estáticos (JS, CSS, HTML, SVG, PNG) para permitir que la aplicación abra y funcione incluso sin acceso a internet.
- **`dist/registerSW.js`**: Script de registro automático (`autoUpdate`) del Service Worker.
- **`dist/assets/index-*.css`**: Hoja de estilos compilada con el sistema completo de Design Tokens (`tokens.css`), modo Alto Contraste WCAG AAA y las 4 paletas de daltonismo.
- **`dist/assets/index-*.js`**: Bundle de producción con React 19, SDK modular de Firebase (App + Firestore), iconografía `lucide-react` y todos los módulos del sistema.

---

## 🧩 3. Inventario Completo de Funcionalidades Incluidas en esta Exportación

Esta versión exportada consolida el **100% de las 4 Fases de la Hoja de Ruta Maestra**:

### 🟢 Fase 1: Funcionamiento Puro del Sistema
1. **Tablero Scrum Reactivo de 3 Estados por Estudiante:**
   - Cada estudiante gestiona su avance privado en cada tarea entre **`Por realizar (Pendiente)`**, **`En progreso`** y **`Ya la realicé (Finalizada)`**, además de guardar **notas personales privadas**.
   - Las 3 columnas del Tablero Scrum se actualizan automáticamente según el progreso del usuario activo.
   - El Administrador dispone del conmutador **`Mi Avance` vs. `Estado Oficial`** para alternar el criterio de las columnas.
2. **Desglose Nominal de Cumplimiento para el Administrador:**
   - Barra de progreso (`progressbar` ARIA) y botón desplegable **`Ver estudiantes`** en cada tarea para consultar el estado individual de cada integrante del grupo.
3. **Prioridades, Ordenamiento Cronológico y Filtros Combinados:**
   - Insignias de prioridad (`🔥 Alta`, `⚡ Media`, `📌 Baja`) con triple codificación.
   - Ordenamiento automático por fecha/hora de entrega más próxima y peso de prioridad.
   - Filtros por **Materia**, **Prioridad**, **Seguimiento Personal** y **Día Seleccionado en el Calendario (`selectedDate`)**.
4. **Comunidades Cerradas (1 Estudiante = 1 Grupo) y Panel Admin:**
   - Unión mediante **Código de Invitación**, envío de **Solicitudes de Acceso** aprobadas por el Administrador o unión directa con diálogo de prevención (`GroupWarningDialog`).
   - Protocolo obligatorio de **Sucesión de Administrador (`SuccessionModal`)** al salir del grupo, más opción de **Transferir Liderazgo Principal permaneciendo en la comunidad** (`transfer_only`).
   - Gestión de miembros (hacer Co-Admin, retirar miembro), edición de datos de la comunidad activa y creación/edición/eliminación de materias con enlaces directos a **WhatsApp**.

### 🔵 Fase 2: Accesibilidad Universal (WCAG 2.1 Niveles AA y AAA)
1. **Asistente Inicial de Calibración (`A11yOnboardingModal`):**
   - Wizard de 4 pasos estilo consola: calibrador de brillo y contraste con símbolos de umbral, selector de 4 modos de daltonismo (*Protanopía*, *Deuteranopía*, *Tritanopía*, *Acromatopsia*), síntesis de voz (`TTS`), sonidos discretos (Web Audio API) y alertas visuales (`ToastHost`).
2. **Lectura en Voz Alta (`TTS`) Individual por Tarea:**
   - Botón **`🔊 Escuchar tarea`** en cada tarjeta (`TaskCard`) y conmutador rápido **`Voz (TTS)`** en la barra superior (`A11yControls`).
3. **Navegación 100% por Teclado y Patrones WAI-ARIA:**
   - Desplazamiento con flechas (`←`, `→`, `↑`, `↓`, `Home`, `End`) en la grilla mensual del Calendario y en la barra de pestañas principales (`role="tablist"`).
   - Atajos globales: `Alt + N` (Nueva tarea), `Alt + C` (Calendario), `Alt + L` (Tablero Scrum & Lista), `Alt + M` (Materias & WhatsApp) y `Escape` (Cerrar modales con `FocusTrap`).

### 🟣 Fase 3: Gestión de Perfil y Modo Sustentación en 1 Clic
1. **Modal de Perfil y Cambio Rápido de Cuenta (`ProfileModal`):**
   - Botón **`Perfil / Demo`** en la cabecera para editar nombre visible/contraseña y cambiar en 1 clic entre cualquiera de las 7 cuentas de prueba sin cerrar sesión.
2. **Cargador de Escenario Demo (`loadDemoScenario`):**
   - Botón **`⚡ Cargar Demo & Entrar`** que puebla automáticamente 2 comunidades (`FESC-2026` y `UX-A11Y`), 5 materias con enlaces de WhatsApp, 6 tareas ubicadas dinámicamente en el mes actual, avances individuales y 1 solicitud pendiente (`user3`) lista para aprobar en vivo.

### 🟠 Fase 4: Persistencia Híbrida (Firebase Cloud Firestore + `localStorage`)
1. **Sincronización Multi-Dispositivo en Tiempo Real (`firebaseConfig.js` + `storageService.js`):**
   - Cada cambio se guarda instantáneamente en `localStorage` y se replica en **Cloud Firestore (`mashle-beta777`)**.
   - Mediante `onSnapshot`, todos los navegadores o celulares conectados reciben los cambios en vivo sin recargar la página.
   - Indicador de estado en la barra superior: **`☁️ Firebase Sync`** (conectado a la nube) o **`💾 Modo Local`** (funcionando offline).

---

## 🔑 4. Credenciales Incluidas en la Versión Exportada

| Cuenta | Usuario | Correo | Contraseña | Rol |
| :--- | :--- | :--- | :---: | :--- |
| **Admin 1** | `admin1` | `admin1@gmail.com` | `1234` | 👑 Administrador Principal (`FESC-2026` en Demo) |
| **Admin 2** | `admin2` | `admin2@gmail.com` | `1234` | 👑 Administrador (`UX-A11Y` en Demo) |
| **Admin 3** | `admin3` | `admin3@gmail.com` | `1234` | 👑 Administrador Disponible |
| **User 1** | `user1` | `user1@gmail.com` | `4321` | 🎒 Estudiante Miembro (`FESC-2026` en Demo) |
| **User 2** | `user2` | `user2@gmail.com` | `4321` | 🎒 Estudiante Miembro (`FESC-2026` en Demo) |
| **User 3** | `user3` | `user3@gmail.com` | `4321` | 🎒 Estudiante con Solicitud Pendiente (`FESC-2026` en Demo) |
| **User 4** | `user4` | `user4@gmail.com` | `4321` | 🎒 Estudiante Miembro (`UX-A11Y` en Demo) |

---

## 💻 5. Comandos de Re-Exportación y Despliegue

Para volver a compilar y publicar una actualización de esta exportación en el futuro:

```bash
# 1. Compilar versión de producción en la carpeta dist/
npm run build

# 2. Desplegar hacia Firebase Hosting (proyecto mashle-beta777)
firebase deploy --only hosting
```
