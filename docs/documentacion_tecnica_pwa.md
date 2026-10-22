# 📘 Documentación Técnica: PWA Calendario Estudiantil (Accesibilidad y Usabilidad)

Proyecto enfocado en el registro y seguimiento de tareas escolares en comunidades cerradas de estudiantes, diseñado con base en los estándares de accesibilidad **WCAG 2.1 (AA y AAA)** y heurísticas de usabilidad para estudiantes con diversas capacidades.

---

## 🔑 1. Autenticación y Cuentas Mock

El sistema cuenta con un **Portal de Acceso para Estudiantes** ([AuthView](file:///c:/Users/HP%20INC/Desktop/Fesc%202026-2/03%20-%20Jueves/MASHLE/src/components/auth/AuthView.jsx)) que soporta:
- **Inicio de Sesión (Login):** Validación de correo institucional y contraseña, con alternador accesible para ver/ocultar contraseña.
- **Registro de Estudiante:** Creación de cuenta rápida (Nombre completo, correo y contraseña) que se guarda en la base local mock de usuarios.
- **Cierre de Sesión:** Botón accesible en la cabecera para regresar al portal de acceso.

### 📋 Cuentas Mock de Prueba Preconfiguradas

| Estudiante | Correo | Contraseña | Rol | Comunidad | Notas |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Carlos Mendoza** | `prueba1@gmail.com` | `1234` | **Administrador** | Ingeniería de Software 10A | **Cuenta principal referenciada** a todos los datos iniciales de materias, tareas y solicitudes. |
| **Valentina Restrepo** | `prueba2@gmail.com` | `1234` | **Estudiante** | Ingeniería de Software 10A | Miembro regular para verificar permisos limitados y recepción de sucesiones. |
| **Sofía Carvajal** | `prueba3@gmail.com` | `1234` | **Administradora** | Semillero UX | Administradora de otra comunidad para probar la salida automática y advertencia al cambiar de grupo. |

> [!TIP]
> En la pantalla de Login hay un panel de acceso rápido donde puedes hacer clic sobre cualquiera de estas cuentas para autocompletar el formulario al instante.

---

## 🚀 2. Tecnologías Utilizadas

- **Frontend:** React 19 + JSX.
- **Herramienta de Compilación y Bundler:** Vite 8.
- **PWA (Progressive Web App):** `vite-plugin-pwa` con Workbox para Service Worker automatizado y manifiesto web estándar (`manifest.webmanifest`).
- **Iconografía:** `lucide-react` con atributos semánticos `aria-hidden="true"` y texto accesible alternativo.
- **Estilos:** Vanilla CSS con Arquitectura de Tokens (`tokens.css`), variables nativas, soporte de alto contraste y reducción de movimiento (`prefers-reduced-motion`).
- **Almacenamiento:** Capa desacoplada `storageService.js` basada en `localStorage` con tabla de usuarios mock (*offline-first*).

---

## ♿ 3. Pilares de Accesibilidad (A11y) Implementados

### 3.1. Navegación 100% por Teclado y Atajos
Toda la aplicación es operable sin necesidad de mouse:
- `Tab` / `Shift + Tab`: Recorrido ordenado de elementos interactivos.
- `Alt + N`: Dispara el modal de creación de nueva tarea escolar.
- `Alt + C`: Cambia a la vista de **Calendario**.
- `Alt + L`: Cambia a la vista de **Lista y Progresión**.
- `Escape`: Cierra cualquier ventana modal o diálogo activo.
- `SkipLink`: Salto directo al contenido principal (`#main-content`) disponible al primer `Tab`.

### 3.2. Trampa de Foco (`FocusTrap`) y Restauración
- Al abrir modales (creación de tarea, diálogo de advertencia de salida o cesión de rol), el foco del teclado queda confinado dentro del modal.
- Al cerrarse con `Escape` o botón de cancelar, el foco se restaura automáticamente al elemento exacto que abrió el modal.

### 3.3. Regiones Dinámicas para Lectores de Pantalla (`LiveAnnouncer`)
- **`aria-live="polite"`**: Anuncia cambios no críticos como login exitoso, cambio de mes en el calendario, filtros aplicados, cambio de estado de tarea o alteración de tamaño de fuente.
- **`aria-live="assertive"`**: Notifica eventos críticos inmediatos como asignación/transferencia del rol de Administrador, alertas de expulsión de grupo, errores de formulario o pérdida de conexión a internet.

### 3.4. Distinción Más Allá del Color (Soporte para Daltonismo)
- Ningún estado se comunica exclusivamente por color:
  - **Pendiente:** Ícono de reloj (<Clock />) + Texto explícito "Pendiente" + Borde punteado/ámbar.
  - **En Progreso:** Ícono de ejecución (<PlayCircle />) + Texto "En Progreso" + Borde azul.
  - **Finalizada:** Ícono de verificación (<CheckCircle2 />) + Texto "Finalizada" + Borde esmeralda.

### 3.5. Modo Alto Contraste (WCAG AAA) y Escalabilidad
- **Selector de Alto Contraste:** Cambia a fondo negro absoluto con texto en contraste máximo (blanco y amarillo brillante, > 7:1) y bordes contrastantes.
- **Ajuste de Tipografía:** Botones `A`, `A+`, `A++` que escalan dinámicamente las fuentes base del documento.

---

## 🧠 4. Usabilidad y Prevención de Errores (UX)

### 4.1. Comunidades Cerradas y Membresía Única
- Cada estudiante pertenece a un único grupo escolar privado.
- Si un estudiante intenta ingresar a un nuevo grupo, se activa un cuadro de diálogo con `role="alertdialog"` para prevenir la pérdida inadvertida de acceso a su comunidad anterior.

### 4.2. Protocolo Obligatorio de Sucesión de Administrador
- Si el estudiante saliente es el **Administrador**, el sistema bloquea la salida sin liderazgo y abre el modal de sucesión (`SuccessionModal`).
- Permite la **selección manual del sucesor** de entre la lista de compañeros o la **asignación automática de emergencia** al miembro más antiguo para evitar que el grupo quede huérfano.
- Se notifica mediante lectores de pantalla el nuevo rol transferido.

### 4.3. Integración Directa con WhatsApp (Deep Links)
- Cada materia cuenta con un acceso directo configurado (`btn-whatsapp`) que abre el enlace correspondiente con `rel="noopener noreferrer"` y etiquetas semánticas completas:
  ```html
  <a href="..." aria-label="Abrir grupo de WhatsApp para [Materia] en una nueva pestaña">
  ```

---

## 📱 5. PWA y Soporte Offline

1. **Service Worker (`sw.js`):** Cachea todos los activos HTML, JS, CSS e iconos para cargar al instante sin conexión a internet.
2. **Web App Manifest (`manifest.webmanifest`):** Define `display: "standalone"`, iconos adaptables (`pwa-192x192.png`, `pwa-512x512.png`), nombre y colores de tema.
3. **Banner de Instalación:** Detecta el evento `beforeinstallprompt` y presenta una invitación accesible para instalar en pantalla de inicio.
4. **Indicador de Red en Vivo:** Notifica en la barra superior si la aplicación está En Línea o en Modo Sin Conexión.

---

## 💻 6. Comandos de Ejecución

Para iniciar el servidor de desarrollo local:
```bash
npm run dev
```

Para previsualizar la compilación de producción:
```bash
npm run preview
```

Para compilar el proyecto:
```bash
npm run build
```
