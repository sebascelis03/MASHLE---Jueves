# 📋 Plan de Implementación #2: Cierre Funcional de Comunidades, Sucesión/Administración, Filtro de Calendario y Sincronización Documental

**Estado:** Aprobado y en Ejecución  
**Fecha:** 2026-11-26

---

## 1. ¿Qué se hará?
Completar los flujos pendientes de lógica de negocio, usabilidad y accesibilidad detectados en la auditoría técnica del proyecto:
1. Flujo completo de ingreso a comunidades (Solicitud de Acceso aprobada por Admin + Unión directa mediante Código de Invitación).
2. Transferencia de liderazgo principal sin expulsión forzosa (`transfer_only`) y opción de expulsar miembros del grupo en el Panel Admin.
3. Filtro interactivo por fecha seleccionada en la vista de Calendario + Guía accesible de estado vacío cuando el usuario aún no pertenece a un grupo.
4. Inclusión del atajo `Alt + M` y `FocusTrap` en el diálogo de atajos de teclado.
5. Sincronización de `.docs/` con las 7 cuentas oficiales (`admin1..3`, `user1..4`) y registro de decisiones.

---

## 2. ¿Cómo está planteado?
- **`src/context/AuthGroupContext.jsx`:**
  - `sendJoinRequest(targetGroupId)` y `cancelJoinRequest(targetGroupId)`: Envía o retira la solicitud del estudiante en `solicitudesPendientes` del grupo.
  - `joinGroupByCode(code)`: Valida el código de invitación (`codigoInvitacion`) e inicia el ingreso directo (respetando la regla 1 estudiante = 1 grupo con advertencia o sucesión si ya estaba en otro grupo).
  - `openTransferLeadershipModal()` y soporte para `pendingAction.type === 'transfer_only'`: Transfiere `adminId` a otro miembro sin sacar al administrador actual del grupo.
  - `removeMemberFromGroup(memberId)`: Permite al administrador retirar a un estudiante del grupo y limpiar sus datos de membresía.
  - Sincronización en `approveJoinRequest` para actualizar el registro del estudiante aprobado en `storageService`.
- **`src/components/community/GroupCommunityView.jsx`:**
  - Tarjeta de ingreso rápido por **Código de Invitación**.
  - Botones en cada comunidad para **Solicitar Acceso** (o **Cancelar Solicitud** si ya está pendiente) y opción de ingreso directo con código.
- **`src/components/admin/GroupAdminPanel.jsx` y `src/components/admin/SuccessionModal.jsx`:**
  - Botón *"Ceder Liderazgo Principal"* conectado al modo `transfer_only`.
  - Botón *"Expulsar"* para miembros del grupo (excepto el creador principal).
- **`src/App.jsx`, `src/components/calendar/CalendarGrid.jsx` y `src/components/calendar/AgendaView.jsx`:**
  - Banner guía accesible cuando `!currentGroup` con botón directo para ir a la pestaña **Mi Comunidad**.
  - Filtro opcional por día seleccionado (`selectedDate`) en `AgendaView` cuando se navega desde el Calendario o mediante conmutador accesible.
- **`src/components/a11y/A11yControls.jsx` y `src/components/a11y/A11yOnboardingModal.jsx`:**
  - Documentación del atajo `Alt + M` y `FocusTrap` en el popover de atajos.

---

## 3. Paso a Paso de Ejecución
1. Registrar `PLAN_02_CIERRE_FUNCIONAL_SISTEMA.md` y actualizar `02_TAREA_ACTIVA.md`.
2. Actualizar `src/context/AuthGroupContext.jsx`.
3. Actualizar `src/components/community/GroupCommunityView.jsx`, `src/components/admin/GroupAdminPanel.jsx` y `src/components/admin/SuccessionModal.jsx`.
4. Actualizar `src/App.jsx`, `src/components/calendar/CalendarGrid.jsx` y `src/components/calendar/AgendaView.jsx`.
5. Actualizar `src/components/a11y/A11yControls.jsx` y `src/components/a11y/A11yOnboardingModal.jsx`.
6. Validar con `npm run lint` y `npm run build`, y actualizar `.docs/`.
