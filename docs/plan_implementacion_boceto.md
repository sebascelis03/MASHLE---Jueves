# Plan de Implementación: Apartado de Boceto Inicial (`/boceto`)

Este documento define la estructura, justificación y ordenamiento del nuevo apartado **`/boceto`** dentro de la aplicación **MASHLE (Calendario Estudiantil)**. Su propósito es servir como evidencia del estado inicial del proyecto (plano conceptual o prototipo de baja fidelidad) en contraste directo con la versión final dotada de accesibilidad (WCAG 2.1 AA/AAA) y diseño visual moderno.

---

## 1. 🎯 Propósito y Justificación Pedagógica

Para la sustentación ante la docente y el informe de grado, es indispensable evidenciar la evolución del software mediante capturas de pantalla comparativas del tipo **"Antes vs. Después"**:
* **Antes (`/boceto`):** El plano inicial arquitectónico y de distribución básica de información, sin estándares de accesibilidad, sin estilos avanzados y con interacción elemental.
* **Después (`/`):** La plataforma terminada, con diseño UI/UX premium, interfaz adaptable, motor PWA e implementación estricta de accesibilidad universal (WCAG 2.1 AA/AAA).

La ruta `/boceto` permite conservar ambos estados en la misma aplicación de forma independiente y alternar entre ellos con un solo clic o mediante la URL directa.

---

## 2. ✂️ ¿Qué se quita en el apartado Boceto? ("Qué Quitar")

Para reflejar fielmente un boceto de baja fidelidad (*wireframe*), se retiraron por completo las siguientes capas:

### A. Capa de Accesibilidad Universal (WCAG 2.1)
* ❌ **Panel flotante de control A11y (`A11yControls`):** Eliminado el botón flotante y el menú con conmutadores de alto contraste, escala de fuentes (normal/grande/extragrande), filtros de daltonismo (protanopia, deuteranopia, tritanopia, acromatopsia) y regulador de brillo.
* ❌ **Lectores y síntesis de voz (`LiveAnnouncer` & Web Speech API):** Sin anuncios auditivos con `aria-live="polite"` ni lectura asistida por síntesis de voz en español.
* ❌ **Retroalimentación por sonido (Web Audio API):** Sin patrones de frecuencia para éxito, advertencia o error.
* ❌ **Guía de inducción accesible (`A11yOnboardingModal`):** Sin asistente de calibración al primer ingreso.
* ❌ **Salto al contenido principal (`SkipLink`):** Sin enlace oculto accesible mediante la tecla `Tab`.
* ❌ **Notificaciones accesibles (`ToastHost`):** Sin notificaciones flotantes con roles ARIA.
* ❌ **Trampas de foco (`FocusTrap`):** Los modales en el boceto no retienen el foco del teclado ni manejan accesibilidad con `Esc` o tabulación cíclica estricta.
* ❌ **Atajos de teclado globales:** Sin combinaciones `Alt + N` (Nueva tarea), `Alt + C` (Calendario), `Alt + L` (Tablero), `Alt + M` (Materias).

### B. Capa de Diseño Visual y Estilos Modernos
* ❌ **Tokens y temas dinámicos (`tokens.css`):** Sin paletas HSL afinadas, sin modo oscuro ni variables de color semánticas.
* ❌ **Estética moderna:** Sin efectos de *glassmorphism*, sin gradientes, sin elevaciones con sombras difusas (`box-shadow`), sin bordes redondeados tipo píldora (`border-radius: 9999px`) ni micro-animaciones al pasar el cursor (*hover* o *focus ring*).
* ❌ **Doble codificación cromática en tareas:** En el boceto no hay insignias de color rojo/amarillo/verde con íconos dobles; los estados se muestran en texto plano entre corchetes: `[PENDIENTE]`, `[EN PROCESO]`, `[FINALIZADA]`.
* ❌ **Íconos vectoriales temáticos:** Se reducen a símbolos ASCII o botones planos elementales.

### C. Capa de Usabilidad e Infraestructura
* ❌ **Mecanismo de sucesión de roles en 2 pasos:** El panel admin muestra solo botones básicos sin protección contra abandono accidental ni traspaso obligatorio de liderazgo.
* ❌ **Banner y capacidades PWA:** Sin aviso de instalación de la aplicación, sin Service Worker interactivo ni gestión de caché *offline*.

---

## 3. 📐 ¿Cómo está organizado el apartado Boceto? ("Cómo Ordenarle")

Siguiendo el requerimiento estricto, **la pantalla no contiene textos ficticios como "Modo Boceto", "Wireframe", "V1" ni etiquetas provisionales**. El único lugar donde figura el término es en la ruta URL (`/boceto`). 

Todo en la interfaz se visualiza con los **títulos reales de la plataforma**, tal como se vería en su primera versión de construcción:
* **Título principal:** `Calendario Estudiantil`
* **Subtítulo:** `Portal de Acceso para Estudiantes`
* **Pestañas:** `Calendario`, `Tablero & Lista`, `Materias & WhatsApp`, `Mi Comunidad`, `Panel Admin`
* **Estilo visual:** Aspecto básico y limpio de construcción inicial (cuadrículas simples con bordes grises `#9ca3af`, tablas estándar, fuentes nativas `Arial` y botones planos), sin ningún adorno de accesibilidad.

### Estructura de la Pantalla:
```
+-----------------------------------------------------------------------------------+
| Calendario Estudiantil                Estudiante: Juan Pérez (Admin) | Grado 11-A |
| Portal de Acceso para Estudiantes                    [Ver Versión Final] [Salir]  |
+-----------------------------------------------------------------------------------+
| [ Calendario ] [ Tablero & Lista ] [ Materias & WhatsApp ] [ Mi Comunidad ] [ Admin ] |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  CONTENIDO DE LA PESTAÑA CON TÍTULOS Y ESTRUCTURA REAL                            |
|  - Calendario de Actividades (Cuadrícula mensual 7x5 con líneas grises)           |
|  - Tablero de Tareas (3 Columnas: Pendientes, En Progreso, Finalizadas)           |
|  - Directorio de Materias y Grupos de WhatsApp (Tabla estándar con links)        |
|  - Mi Comunidad Escolar (Código del grupo y tabla de comunidades)                |
|  - Panel de Administración (Tabla de integrantes con acciones de rol)            |
|                                                                                   |
+-----------------------------------------------------------------------------------+
| Pie de página: Calendario Estudiantil — Plataforma de Gestión Escolar             |
+-----------------------------------------------------------------------------------+
```

---

## 4. 🗂️ Detalle de las Secciones en el Boceto

| Pestaña | Contenido en `/boceto` (Wireframe) | Contenido en `/` (Versión Final Accesible) |
| :--- | :--- | :--- |
| **1. Calendario** | Grilla de 7 columnas con líneas de 1px, número de día simple y etiquetas de texto plano para las tareas. Botón plano `+ Nueva Tarea`. | Grilla responsiva, contraste optimizado, soporte para lectores de pantalla, indicadores de alta visibilidad, badges de materias coloreadas y filtros. |
| **2. Tablero / Tareas** | 3 columnas básicas (Pendientes, En Proceso, Finalizadas) con tarjetas monocromáticas y botones de texto para avanzar de estado. | Tablero Kanban accesible, medidor circular de progreso personal, notas privadas por estudiante, filtros combinados y accesibilidad ARIA completa. |
| **3. Materias & WhatsApp** | Tabla clásica con columnas (Código, Materia, Docente, Enlace WhatsApp, Acción) con URLs directas en texto azul plano. | Directorio con tarjetas estilizadas, chips de colores, botones con iconos descriptivos para lectores de pantalla, búsqueda predictiva y gestión de horarios. |
| **4. Comunidad Escolar** | Caja simple con el grupo actual, código de invitación y tabla de grupos externos con botón "Solicitar Unirse". | Entorno protegido con advertencias accesibles (`role="alertdialog"`), prevención de pérdida de datos y confirmación modal de salida. |
| **5. Panel Admin** | Tabla sencilla de integrantes con botones planos `[Ceder Admin]` y `[Expulsar]`. | Panel con sucesión obligatoria de roles, trampa de foco de teclado, confirmación en dos pasos, anuncios audibles y transferencia de administración a prueba de fallos. |
| **Modal Crear Tarea** | Formulario HTML estándar con campos de entrada (título, materia, fecha, prioridad) y botones planos. | Modal con `FocusTrap`, validaciones accesibles, atajos (`Alt+N`), anuncios audibles y soporte completo de teclado. |

---

## 5. 🔄 Mecanismo de Navegación y Rutas

La aplicación soporta la navegación bidireccional sin perder estado:
1. **Acceso directo por URL:**
   - `http://localhost:5173/boceto` (o con numeral `http://localhost:5173/#/boceto`).
2. **Acceso mediante botón visual:**
   - En la cabecera de la versión final: botón **`📐 Boceto Inicial (/boceto)`**.
   - En la barra superior del boceto: botón **`✨ Ir a Versión Final Accesible`**.
3. **Compatibilidad con History API:**
   - Los botones de avanzar y retroceder del navegador funcionan de forma fluida (`popstate` / `hashchange`).

---

## 6. 📸 Guía para la Toma de Capturas de Pantalla

Para entregar el trabajo a la docente:
1. **Captura 1 (Calendario):**
   - Abrir `/boceto` en la pestaña 1 (Calendario).
   - Tomar captura del plano en cuadrícula simple.
   - Pulsar `✨ Ir a Versión Final Accesible` y tomar captura del Calendario terminado.
2. **Captura 2 (Tablero de Tareas):**
   - En `/boceto`, pestaña 2: capturar las 3 columnas wireframe.
   - En la versión final, pestaña "Tablero & Lista": capturar el progreso personal, las tarjetas modernas y los filtros.
3. **Captura 3 (Materias y WhatsApp):**
   - En `/boceto`, pestaña 3: capturar la tabla básica.
   - En la versión final, pestaña "Materias & WhatsApp": capturar los enlaces integrados y tarjetas de materia.
4. **Captura 4 (Herramientas de Accesibilidad):**
   - Mostrar cómo en `/boceto` **no existe ninguna herramienta de accesibilidad**.
   - En la versión final, desplegar el menú de accesibilidad mostrando el modo de Alto Contraste, tamaño de fuentes, lectura por voz y soporte para daltonismo.
