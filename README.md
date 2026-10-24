# 📚 Calendario Estudiantil — Rama `boceto`

> 📌 **Nota de Versión y Alcance de esta Rama:**  
> Esta rama (`boceto`) alberga la **primera versión funcional de la plataforma escolar en su etapa inicial de construcción**. Representa la arquitectura de información original, la maquetación estructural y los flujos operativos básicos de la aplicación previos a la incorporación de la suite de accesibilidad universal (WCAG 2.1 AA/AAA), el diseño visual moderno y las capacidades de Progressive Web App (PWA) presentes en la rama principal (`main`).

---

## 🎯 1. Propósito Académico de esta Rama

En el marco del **Proyecto de Grado**, esta rama cumple una función metodológica y probatoria fundamental:
1. **Evidencia de Evolución del Software:** Permite contrastar de forma gráfica y operativa el estado inicial de la plataforma (*"El Antes"*) frente a la versión terminada con accesibilidad e inclusión (*"El Después"*).
2. **Sustentación y Capturas de Pantalla:** Proporciona un entorno limpio y aislado para la captura de evidencias requeridas por la docente, demostrando cómo se estructuraron originalmente los requerimientos funcionales antes de la optimización de contraste, lectura por voz, navegación por teclado y diseño de interfaz.

---

## 🧱 2. Arquitectura y Módulos de esta Primera Versión

Esta versión contiene los módulos esenciales del sistema escolar funcionando de manera independiente y libre de herramientas auxiliares de accesibilidad:

### 📅 1. Calendario de Actividades
* Cuadrícula mensual completa de 7 columnas (Lunes a Domingo).
* Visualización directa de las tareas programadas por día con indicadores textuales.
* Navegación entre meses (`Anterior`, `Hoy`, `Siguiente`).
* Tabla cronológica inferior con el listado de tareas registradas para el mes actual, permitiendo cambiar su estado operativo.

### 📋 2. Tablero de Seguimiento de Tareas
* Organización de actividades académicas en tres columnas funcionales:
  * **Pendientes:** Tareas asignadas sin iniciar.
  * **En Progreso:** Actividades en desarrollo por el estudiante.
  * **Finalizadas:** Entregas completadas.
* Botones de transición de estado directo para avanzar o reabrir actividades.

### 📖 3. Directorio de Materias & Enlaces de WhatsApp
* Tabla estructurada con las asignaturas del curso, docentes asignados y códigos de materia.
* Enlaces directos a los grupos oficiales de WhatsApp de cada cátedra para facilitar la comunicación inmediata del grupo.

### 👥 4. Mi Comunidad Escolar
* Visualización del grupo académico activo (`Grado 11-A`).
* Código de invitación alfanumérico para el ingreso de nuevos compañeros.
* Directorio de comunidades externas con opción de envío de solicitud.

### 🛡️ 5. Panel de Administración
* Gestión básica de integrantes del curso.
* Asignación y transferencia de roles de administrador.
* Control de expulsión de integrantes.

### 📝 6. Creación y Registro de Tareas (Modal)
* Formulario para la creación de nuevas tareas escolares especificando:
  * Título descriptivo.
  * Materia asociada.
  * Fecha límite de entrega.
  * Nivel de prioridad (*Alta*, *Media*, *Baja*).

---

## ⚖️ 3. Comparativa: Rama `boceto` vs. Rama `main`

| Criterio Evaluado | Rama `boceto` (Primera Versión) | Rama `main` (Versión Final Accesible) |
| :--- | :--- | :--- |
| **Enfoque Principal** | Estructuración funcional y maquetación de módulos. | Accesibilidad e Inclusión Universal (WCAG 2.1 AA/AAA) + Usabilidad (UX). |
| **Herramientas A11y** | ❌ Sin barra flotante, sin calibración. | ✅ Panel flotante `A11yControls` con atajos globales y calibración. |
| **Contraste y Visión** | Estilos estándar con colores por defecto. | Modo Alto Contraste, 4 filtros de daltonismo y tipografía escalable. |
| **Lectura Asistida** | Sin sintetizador de voz. | Lector de pantalla con Web Speech API y anuncios audibles (`aria-live`). |
| **Navegación por Teclado** | Tabulación genérica nativa del navegador. | Atajos de teclado (`Alt+N`, `Alt+C`, etc.), `SkipLink` y trampa de foco. |
| **PWA & Offline** | Web estándar para navegador. | PWA instalable con Service Worker y funcionamiento offline. |
| **Diseño Visual** | Maquetación limpia en líneas de 1px y grises neutros. | Sistema de diseño moderno, modo oscuro, gradientes y microinteracciones. |

---

## 💻 4. Requisitos y Puesta en Marcha Local

Para clonar, instalar y ejecutar esta versión en tu equipo:

### Prerrequisitos
* **Node.js:** Versión 18.0 o superior instalada.
* **NPM:** Gestor de paquetes oficial.

### Pasos de Instalación

1. **Clonar el repositorio y ubicarse en la rama `boceto`:**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd MASHLE
   git checkout boceto
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Visualizar la aplicación:**
   Abre tu navegador en:
   ```
   http://localhost:5173/boceto
   ```

---

## 🌿 5. Guía de Ramas en Git

* **Trabajar en esta versión inicial:**
  ```bash
  git checkout boceto
  ```
* **Guardar cambios en esta rama:**
  ```bash
  git add .
  git commit -m "feat: actualizar detalles de la primera versión"
  git push origin boceto
  ```
* **Cambiar a la versión final accesible:**
  ```bash
  git checkout main
  ```

---

## 👥 Equipo y Créditos
* **Proyecto:** Calendario Estudiantil Accesible (MASHLE).
* **Institución / Semillero:** FESC 2026-2.
* **Propósito:** Proyecto de Grado enfocado en Accesibilidad, Usabilidad e Inclusión Escolar.
