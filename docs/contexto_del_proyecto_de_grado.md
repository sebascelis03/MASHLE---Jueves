# Proyecto de Grado: Calendario Estudiantil (Accesibilidad y Usabilidad)

## 📖 Descripción General
Aplicación web enfocada en el registro y seguimiento de tareas escolares. Su diseño y desarrollo están centrados estrictamente en los pilares de **Accesibilidad** y **Usabilidad**, garantizando que estudiantes con diferentes capacidades y necesidades puedan interactuar con la plataforma de manera eficiente y sin barreras.

## 🎯 Público Objetivo y Estructura
*   **Usuarios Exclusivos:** La plataforma está diseñada únicamente para **estudiantes**.
*   **Comunidades Cerradas:** Los estudiantes se agrupan en espacios tipo "comunidad" dependiendo de su grupo o curso. Cada grupo tiene su propio entorno privado.

## ⚙️ Funcionalidades Principales

### 1. Gestión de Tareas y Calendario
*   **Calendario de Registro:** Espacio principal para la creación y visualización de tareas escolares.
*   **Progresión de Tareas:** Apartado dedicado al seguimiento del estado de las tareas (ej. Pendientes, Finalizadas).
*   **Integración de Comunicación:** Cada materia registrada cuenta con un acceso directo al grupo de WhatsApp correspondiente.

### 2. Administración y Roles
*   **Rol de Administrador:** Cada grupo cuenta con un estudiante administrador encargado de:
    *   Crear el grupo.
    *   Aprobar o rechazar solicitudes de acceso.
    *   Gestionar y ceder roles dentro del grupo.
*   **Salida Automática y Sucesión de Roles:**
    *   Si un usuario crea o se une a un nuevo grupo, el sistema lo expulsa automáticamente de su grupo anterior.
    *   Si el usuario que sale es el Administrador, el sistema exige la cesión del rol (elección manual del sucesor) o realiza una reasignación automática para que el grupo nunca quede sin administración.

---

## 🧠 Lineamientos de Usabilidad (UX)
*   **Simplicidad e Intuición:** Vistas de calendario limpias que permitan crear tareas con la menor cantidad de clics. Los cambios de estado (pendiente a finalizada) deben ser rápidos (ej. *checkbox* o *drag & drop*).
*   **Prevención de Errores:** Al cambiar de grupo, se debe mostrar una alerta clara antes de ejecutar la salida automática y pérdida de acceso al grupo anterior.
*   **Control de Sucesión:** El administrador saliente debe poder elegir a su sucesor de una lista antes de abandonar la comunidad, evitando sucesiones accidentales.
*   **Integración Fluida:** Botones de WhatsApp configurados con *deep links* para una transición directa sin pantallas intermedias.

## ♿ Lineamientos de Accesibilidad (A11y)
*   **Navegación por Teclado:** Toda la aplicación (calendario, modales, creación de tareas) debe ser operable mediante el uso exclusivo de la tecla `Tab` y atajos de teclado.
*   **Compatibilidad con Lectores de Pantalla:** 
    *   Uso de etiquetas y atributos ARIA (ej. `role="alertdialog"` para advertencias de cambio de grupo).
    *   El "foco" del teclado debe atraparse dentro de ventanas emergentes (modales) al gestionar roles.
    *   Notificaciones audibles (`aria-live`) cuando un usuario recibe un nuevo rol.
*   **Comunicación más allá del Color:** Los estados de las tareas (completado/pendiente) deben diferenciarse por íconos o texto, no solo por colores (rojo/verde) para apoyar a usuarios con daltonismo.
*   **Enlaces Descriptivos:** Los botones (como el de WhatsApp) deben contar con texto contextual (visible o para lectores) estructurado semánticamente, evitando botones que solo contengan íconos mudos.
*   **Alto Contraste y Escalabilidad:** Asegurar legibilidad tipográfica y permitir el aumento del zoom o tamaño de fuente sin romper la interfaz del calendario.
