# 📓 Bitácora de Toma de Decisiones Técnicas

Registro cronológico e incremental de las decisiones arquitectónicas, iteraciones de diseño, problemas resueltos y acuerdos operativos del proyecto **MASHLE (Calendario Estudiantil)**.

---

## 🕒 Hito 0: Decisiones Fundacionales del Proyecto (Histórico Consolidado)

### 0.1. Arquitectura Frontend y Persistencia Offline-First
- **Contexto:** Se requería una aplicación rápida, instalable en dispositivos móviles/escritorio y funcional en entornos educativos con conectividad intermitente, sin depender de servidores externos complejos para las demostraciones del Proyecto de Grado.
- **Decisión:** Construir una **PWA con React 19 + Vite 8 + `vite-plugin-pwa`** y una capa de persistencia desacoplada en `src/services/storageService.js` sobre `localStorage` con datos semilla preconfigurados.
- **Resultado:** Carga instantánea, soporte offline mediante Service Worker y 3 cuentas mock listas para evaluar todos los flujos de rol.

### 0.2. Suite de Accesibilidad Universal (WCAG 2.1 AA/AAA) y Calibrador Inicial
- **Contexto:** El núcleo académico del proyecto de grado es la **Accesibilidad y Usabilidad**. No bastaba con agregar atributos ARIA aislados; los estudiantes con discapacidad visual, daltonismo o dificultades auditivas necesitaban calibrar su experiencia desde el primer momento.
- **Decisión:**
  - Implementar un **Asistente de Calibración (`A11yOnboardingModal.jsx`)** inspirado en la configuración inicial de consolas de videojuegos (calibración de brillo/contraste con símbolos de umbral, selector de daltonismo y lectura por voz, siempre con botón "Omitir").
  - Crear `A11yControls.jsx` como barra/botón de ajuste rápido permanente.
  - Garantizar triple codificación en estados de tareas (color + ícono + etiqueta textual) y soporte de teclado total (`FocusTrap`, `SkipLink`, `LiveAnnouncer`, `ToastHost` y atajos `Alt + N/C/L/M`).

### 0.3. Segregación de Permisos en Tareas (Oficiales vs. Progreso Individual)
- **Contexto:** Si cualquier estudiante modificaba o borraba una tarea del grupo, afectaría a toda la clase.
- **Decisión:** Separar el modelo de datos en dos niveles dentro de `TaskContext.jsx` y `storageService.js`:
  1. **Tareas oficiales del grupo:** Solo el **Administrador** puede crearlas, editarlas o eliminarlas.
  2. **Progreso y notas privadas por estudiante (`user_progress`):** Cada alumno marca su propio avance (*Pendiente*, *En Progreso*, *Finalizada*) y guarda notas personales sin alterar los datos de sus compañeros.

### 0.4. Regla de Membresía Única y Protocolo Obligatorio de Sucesión
- **Contexto:** Evitar que los estudiantes pertenezcan a múltiples cursos contradictorios o que un grupo quede sin administrador cuando su creador se retira.
- **Decisión:**
  - Aplicar la regla **1 Estudiante = 1 Grupo Activo** con advertencia explícita (`GroupWarningDialog.jsx` con `role="alertdialog"`).
  - Bloquear la salida directa de un Administrador hasta que designe a un sucesor en `SuccessionModal.jsx` (o ejecute la sucesión asistida).

### 0.5. Creación del Apartado `/boceto` para Sustentación Académica
- **Contexto:** La docente solicitó evidencia clara de la evolución del software (*"El Antes vs. El Después"*).
- **Decisión:** Incorporar la ruta `/boceto` (`src/components/boceto/BocetoView.jsx` y `boceto.css`) dentro de la misma aplicación y en la rama `boceto`. Esta vista muestra los mismos módulos funcionales con los títulos reales de la plataforma, pero con estética de construcción inicial (cuadrícula de 1px, tablas básicas y sin herramientas de accesibilidad), permitiendo alternar en un clic con la versión final accesible.

---

## 🕒 Hito 1: Estandarización Documental y Reglas Operativas (2026-11-26)

### 1.1. Adopción de `.docs/` como Fuente Única de Verdad
- **Contexto:** Existían documentos sueltos en una carpeta `docs/` sin estructura estandarizada de seguimiento de tareas ni bitácora de decisiones.
- **Decisión:**
  1. Establecer las **3 Reglas Operativas Estrictas** en `.docs/01_reglas/REGLAS_OPERATIVAS.md` (Planificación obligatoria previa numerada con aprobación del usuario, prohibición absoluta de ejecutar comandos `git` por parte del agente y política de orden/compactación).
  2. Migrar y consolidar toda la documentación previa dentro de las 6 subcarpetas oficiales de `.docs/`.
  3. Eliminar la antigua carpeta `docs/` para evitar duplicidad de fuentes.
