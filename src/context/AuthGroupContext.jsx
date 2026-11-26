import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService, MOCK_ACCOUNTS } from '../services/storageService';
import { useA11y } from './A11yContext';

const AuthGroupContext = createContext();

/* ==========================================================================
   Helpers puros
   REGLA DE COMUNIDAD: 1 usuario = 1 grupo a la vez.
   La fuente de verdad es la lista de miembros de cada grupo; el grupoId y el
   rol del usuario siempre se derivan de ella.
   ========================================================================== */

// Deriva grupoId y rol del usuario a partir de la membresía real en los grupos
const resolveUserMembership = (user, groupsList) => {
  if (!user) return null;
  const group = groupsList.find(g => g.miembros.some(m => m.id === user.id));
  const member = group ? group.miembros.find(m => m.id === user.id) : null;
  const isUserAdmin = Boolean(group && (group.adminId === user.id || member?.rol === 'admin'));
  return {
    ...user,
    grupoId: group ? group.id : null,
    rol: group ? (isUserAdmin ? 'admin' : 'estudiante') : (user.rol || 'estudiante')
  };
};

// Retira al usuario de un grupo. Si era el administrador, cede el rol al sucesor.
// Si el grupo queda sin miembros, se cierra (se elimina de la lista).
const removeUserFromGroup = (groupsList, userId, groupId, successorId = null) => {
  return groupsList
    .map(g => {
      if (g.id !== groupId) return g;

      const wasAdmin = g.adminId === userId;
      const remaining = g.miembros.filter(m => m.id !== userId);
      const newAdminId = wasAdmin
        ? (remaining.find(m => m.id === successorId)?.id ?? remaining[0]?.id ?? null)
        : g.adminId;

      return {
        ...g,
        adminId: newAdminId,
        miembros: remaining.map(m => (m.id === newAdminId ? { ...m, rol: 'admin' } : m))
      };
    })
    .filter(g => g.id !== groupId || g.miembros.length > 0);
};

export const AuthGroupProvider = ({ children }) => {
  const { announce, openOnboarding } = useA11y();
  const [groups, setGroups] = useState(() => storageService.getGroups());
  const [currentUser, setCurrentUser] = useState(() =>
    resolveUserMembership(storageService.getCurrentUser(), storageService.getGroups())
  );

  // Acción en espera de confirmación:
  //   { type: 'join', group } | { type: 'create', data } | { type: 'leave' } | { type: 'transfer_only' }
  const [pendingAction, setPendingAction] = useState(null);
  const [isSuccessionModalOpen, setIsSuccessionModalOpen] = useState(false);
  const [isSwitchWarningOpen, setIsSwitchWarningOpen] = useState(false);

  // Sincronizar con almacenamiento local
  useEffect(() => {
    storageService.setCurrentUser(currentUser);
    if (currentUser) storageService.updateUser(currentUser);
  }, [currentUser]);

  useEffect(() => {
    storageService.saveGroups(groups);
  }, [groups]);

  /* ---------------------------- Autenticación ---------------------------- */
  const login = (email, password) => {
    try {
      const user = storageService.login(email, password);
      const userWithUpdatedRole = resolveUserMembership(user, groups);

      setCurrentUser(userWithUpdatedRole);
      announce(`Sesión iniciada correctamente. Bienvenido, ${user.nombre}.`, 'polite');
      return { success: true, user: userWithUpdatedRole };
    } catch (err) {
      announce(`Error de ingreso: ${err.message}`, 'assertive');
      return { success: false, error: err.message };
    }
  };

  const register = ({ email, password, nombre }) => {
    try {
      const newUser = storageService.register({ email, password, nombre });
      setCurrentUser(newUser);
      announce(`Cuenta creada exitosamente para ${newUser.nombre}. Bienvenido.`, 'polite');
      // Al registrarse, se ofrece el asistente de calibración de accesibilidad
      openOnboarding();
      return { success: true, user: newUser };
    } catch (err) {
      announce(`Error de registro: ${err.message}`, 'assertive');
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    storageService.logout();
    setCurrentUser(null);
    setPendingAction(null);
    setIsSwitchWarningOpen(false);
    setIsSuccessionModalOpen(false);
    announce('Has cerrado sesión correctamente.', 'polite');
  };

  /* ------------------------------ Grupo actual ----------------------------- */
  const currentGroup = groups.find(g => g.id === currentUser?.grupoId) || null;
  const currentMember = currentGroup?.miembros?.find(m => m.id === currentUser?.id);
  const isPrimaryAdmin = Boolean(currentGroup && currentGroup.adminId === currentUser?.id);
  const isAdmin = Boolean(currentGroup && (isPrimaryAdmin || currentMember?.rol === 'admin'));

  const buildNewGroup = ({ nombre, descripcion, codigoInvitacion }) => ({
    id: `grp-${Date.now()}`,
    nombre,
    descripcion: descripcion || '',
    codigoInvitacion: codigoInvitacion || `COD-${Math.floor(1000 + Math.random() * 9000)}`,
    adminId: currentUser.id,
    solicitudesPendientes: [],
    miembros: [
      { id: currentUser.id, nombre: currentUser.nombre, email: currentUser.email, rol: 'admin' }
    ]
  });

  // Limpia cualquier solicitud pendiente del usuario en otros grupos cuando ya ingresó a uno
  const clearUserPendingRequests = (groupsList, userId) =>
    groupsList.map(g => ({
      ...g,
      solicitudesPendientes: (g.solicitudesPendientes || []).filter(s => s.id !== userId)
    }));

  // Ejecuta una acción de unión/creación/salida. Garantiza que el usuario nunca
  // quede en dos grupos: primero se retira del actual y luego entra al nuevo.
  const performExit = (action, successorId = null) => {
    if (!currentUser) return;

    // Caso especial: Ceder liderazgo principal permaneciendo en el grupo actual
    if (action?.type === 'transfer_only') {
      if (!currentGroup || !successorId) return;
      const successor = currentGroup.miembros.find(m => m.id === successorId);
      if (!successor) return;

      const nextGroups = groups.map(g => {
        if (g.id !== currentGroup.id) return g;
        return {
          ...g,
          adminId: successor.id,
          miembros: g.miembros.map(m => {
            if (m.id === successor.id) return { ...m, rol: 'admin' };
            if (m.id === currentUser.id) return { ...m, rol: 'estudiante' };
            return m;
          })
        };
      });

      const updatedSuccessor = { id: successor.id, grupoId: currentGroup.id, rol: 'admin' };
      storageService.updateUser(updatedSuccessor);

      setGroups(nextGroups);
      setCurrentUser(prev => ({ ...prev, rol: 'estudiante' }));
      setPendingAction(null);
      setIsSuccessionModalOpen(false);
      announce(`Has cedido el liderazgo principal de ${currentGroup.nombre} a ${successor.nombre}. Continúas como estudiante miembro del grupo.`, 'assertive');
      return;
    }

    let nextGroups = currentUser.grupoId
      ? removeUserFromGroup(groups, currentUser.id, currentUser.grupoId, successorId)
      : groups;

    if (successorId && currentUser.grupoId) {
      storageService.updateUser({ id: successorId, grupoId: currentUser.grupoId, rol: 'admin' });
    }

    let nextUser = { ...currentUser, grupoId: null, rol: 'estudiante' };
    let message = 'Has salido de tu grupo escolar.';

    if (action?.type === 'join') {
      const target = nextGroups.find(g => g.id === action.group.id);
      if (!target) {
        announce('El grupo al que querías unirte ya no está disponible.', 'assertive');
      } else {
        nextGroups = clearUserPendingRequests(nextGroups, currentUser.id).map(g =>
          g.id === target.id
            ? {
                ...g,
                miembros: [
                  ...g.miembros,
                  { id: currentUser.id, nombre: currentUser.nombre, email: currentUser.email, rol: 'estudiante' }
                ]
              }
            : g
        );
        nextUser = { ...nextUser, grupoId: target.id, rol: 'estudiante' };
        message = `Te has unido exitosamente al grupo: ${target.nombre}.`;
      }
    } else if (action?.type === 'create') {
      const newGroup = buildNewGroup(action.data);
      nextGroups = [...clearUserPendingRequests(nextGroups, currentUser.id), newGroup];
      nextUser = { ...nextUser, grupoId: newGroup.id, rol: 'admin' };
      message = `Comunidad "${newGroup.nombre}" creada con éxito. Ahora eres el Administrador.`;
    }

    setGroups(nextGroups);
    setCurrentUser(nextUser);
    setPendingAction(null);
    setIsSwitchWarningOpen(false);
    setIsSuccessionModalOpen(false);
    announce(message, 'assertive');
  };

  // Miembros que podrían recibir la administración
  const otherMembers = currentGroup ? currentGroup.miembros.filter(m => m.id !== currentUser?.id) : [];

  // Punto de entrada común (1 usuario = 1 grupo):
  //  - Sin grupo actual: ejecuta directo.
  //  - Miembro regular (o admin único): aviso de confirmación (GroupWarningDialog).
  //  - Administrador con compañeros: sucesión obligatoria (SuccessionModal).
  const requestExitAction = (action) => {
    if (!currentUser?.grupoId) {
      performExit(action);
      return { pending: false, route: 'direct' };
    }
    setPendingAction(action);
    if (isAdmin && otherMembers.length > 0) {
      setIsSuccessionModalOpen(true);
      return { pending: true, route: 'succession' };
    }
    setIsSwitchWarningOpen(true);
    return { pending: true, route: 'warning' };
  };

  // 1. Unirse directamente a un grupo existente (o tras validar código)
  const requestJoinGroup = (targetGroupId) => {
    if (!currentUser) return;

    if (currentUser.grupoId === targetGroupId) {
      announce('Ya te encuentras en este grupo escolar.', 'polite');
      return;
    }

    const targetGroup = groups.find(g => g.id === targetGroupId);
    if (!targetGroup) return;

    const { route } = requestExitAction({ type: 'join', group: targetGroup });
    if (route === 'warning') {
      announce(
        `Atención: al ingresar a ${targetGroup.nombre} saldrás automáticamente de tu grupo actual.`,
        'assertive'
      );
    } else if (route === 'succession') {
      announce('Eres el administrador de tu grupo actual. Debes ceder la administración a un compañero antes de unirte a otro grupo.', 'assertive');
    }
  };

  // 1.b Enviar solicitud de acceso a un grupo (para que el Administrador la apruebe en Panel Admin)
  const sendJoinRequest = (targetGroupId) => {
    if (!currentUser) return { success: false };

    if (currentUser.grupoId === targetGroupId) {
      announce('Ya eres miembro de esta comunidad.', 'polite');
      return { success: false };
    }

    const targetGroup = groups.find(g => g.id === targetGroupId);
    if (!targetGroup) return { success: false };

    const alreadyRequested = (targetGroup.solicitudesPendientes || []).some(s => s.id === currentUser.id);
    if (alreadyRequested) {
      announce(`Ya tienes una solicitud pendiente en ${targetGroup.nombre}.`, 'polite');
      return { success: false };
    }

    const nextGroups = groups.map(g =>
      g.id === targetGroupId
        ? {
            ...g,
            solicitudesPendientes: [
              ...(g.solicitudesPendientes || []),
              {
                id: currentUser.id,
                nombre: currentUser.nombre,
                email: currentUser.email,
                fechaSolicitud: new Date().toISOString()
              }
            ]
          }
        : g
    );

    setGroups(nextGroups);
    announce(`Solicitud enviada a la comunidad "${targetGroup.nombre}". El administrador del grupo podrá aprobar tu ingreso.`, 'polite');
    return { success: true };
  };

  // 1.c Cancelar solicitud de acceso enviada previamente
  const cancelJoinRequest = (targetGroupId) => {
    if (!currentUser) return;
    const targetGroup = groups.find(g => g.id === targetGroupId);
    if (!targetGroup) return;

    const nextGroups = groups.map(g =>
      g.id === targetGroupId
        ? {
            ...g,
            solicitudesPendientes: (g.solicitudesPendientes || []).filter(s => s.id !== currentUser.id)
          }
        : g
    );
    setGroups(nextGroups);
    announce(`Solicitud de acceso a "${targetGroup.nombre}" cancelada.`, 'polite');
  };

  // 1.d Unirse directamente mediante Código de Invitación
  const joinGroupByCode = (rawCode) => {
    if (!currentUser) return { success: false, error: 'Debes iniciar sesión.' };
    const cleanCode = (rawCode || '').trim().toUpperCase();
    if (!cleanCode) {
      announce('Por favor ingresa un código de invitación válido.', 'assertive');
      return { success: false, error: 'Ingresa un código de invitación.' };
    }

    const targetGroup = groups.find(
      g => (g.codigoInvitacion || '').trim().toUpperCase() === cleanCode
    );

    if (!targetGroup) {
      const msg = `No se encontró ninguna comunidad con el código "${cleanCode}". Verifica el código con el administrador.`;
      announce(msg, 'assertive');
      return { success: false, error: msg };
    }

    if (currentUser.grupoId === targetGroup.id) {
      const msg = `Ya perteneces a la comunidad "${targetGroup.nombre}".`;
      announce(msg, 'polite');
      return { success: false, error: msg };
    }

    requestJoinGroup(targetGroup.id);
    return { success: true, group: targetGroup };
  };

  // 2. Crear una nueva comunidad
  const createNewGroup = (data) => {
    if (!currentUser || !data?.nombre?.trim()) return { pending: false };

    const result = requestExitAction({ type: 'create', data });
    if (result.route === 'succession') {
      announce('Para crear una nueva comunidad primero debes ceder la administración de tu grupo actual.', 'assertive');
    } else if (result.route === 'warning') {
      announce('Atención: al crear una nueva comunidad saldrás automáticamente de tu grupo actual.', 'assertive');
    }
    return result;
  };

  // 3. Salir del grupo actual sin unirse a otro
  const requestLeaveGroup = () => {
    if (!currentUser?.grupoId) return;
    const { route } = requestExitAction({ type: 'leave' });
    if (route === 'succession') {
      announce('Eres el administrador. Debes ceder la administración a un compañero antes de salir del grupo.', 'assertive');
    } else {
      announce('Atención: vas a salir de tu grupo escolar actual.', 'assertive');
    }
  };

  // 3.b Abrir modal para ceder liderazgo principal SIN salir del grupo
  const openTransferLeadershipModal = () => {
    if (!currentGroup || !isPrimaryAdmin) return;
    if (otherMembers.length === 0) {
      announce('No hay otros miembros en la comunidad a quienes ceder el liderazgo.', 'assertive');
      return;
    }
    setPendingAction({ type: 'transfer_only' });
    setIsSuccessionModalOpen(true);
    announce('Selecciona al miembro que recibirá el liderazgo principal de la comunidad.', 'polite');
  };

  // 4. Confirmación del aviso (miembro regular, o administrador único: el grupo se cierra)
  const confirmGroupSwitch = () => {
    performExit(pendingAction);
  };

  const cancelGroupSwitch = () => {
    setIsSwitchWarningOpen(false);
    setPendingAction(null);
    announce('Cambio de grupo cancelado.', 'polite');
  };

  const cancelSuccession = () => {
    setIsSuccessionModalOpen(false);
    setPendingAction(null);
    announce('Cesión de administración cancelada. Sigues siendo el administrador.', 'polite');
  };

  // 5. Cesión de administración (SuccessionModal) y salida (o solo transferencia si es transfer_only)
  const transferAdminRoleAndLeave = (successorId) => {
    if (!currentGroup || !isAdmin) return;

    const successor = otherMembers.find(m => m.id === successorId);
    if (!successor && otherMembers.length > 0) {
      announce('Debes seleccionar un miembro válido como nuevo administrador.', 'assertive');
      return;
    }

    const action = pendingAction;
    performExit(action, successor ? successor.id : null);

    if (successor && action?.type !== 'transfer_only') {
      announce(`El rol de Administrador ha sido transferido a ${successor.nombre}. Has salido del grupo anterior.`, 'assertive');
    }
  };

  // 6. Salida con reasignación automática de sucesor
  const autoAssignSuccessorAndLeave = () => {
    if (!currentGroup) return;
    transferAdminRoleAndLeave(otherMembers[0]?.id ?? null);
  };

  /* ------------------ Acciones del Administrador (solicitudes y miembros) ------------------ */
  const approveJoinRequest = (applicantId) => {
    if (!isAdmin || !currentGroup) return;

    const applicant = (currentGroup.solicitudesPendientes || []).find(a => a.id === applicantId);
    if (!applicant) return;

    // Regla 1 usuario = 1 grupo: no se puede aprobar a quien ya pertenece a otra comunidad
    const alreadyElsewhere = groups.some(
      g => g.id !== currentGroup.id && g.miembros.some(m => m.id === applicantId)
    );
    if (alreadyElsewhere) {
      setGroups(groups.map(g =>
        g.id === currentGroup.id
          ? { ...g, solicitudesPendientes: g.solicitudesPendientes.filter(a => a.id !== applicantId) }
          : g
      ));
      announce(`${applicant.nombre} ya pertenece a otra comunidad y no puede unirse a la vez a dos grupos. Solicitud descartada.`, 'assertive');
      return;
    }

    // Limpiar también cualquier solicitud que ese estudiante tuviera en otros grupos
    const nextGroups = groups.map(g => {
      if (g.id === currentGroup.id) {
        return {
          ...g,
          solicitudesPendientes: (g.solicitudesPendientes || []).filter(a => a.id !== applicantId),
          miembros: [...g.miembros, { id: applicant.id, nombre: applicant.nombre, email: applicant.email, rol: 'estudiante' }]
        };
      }
      return {
        ...g,
        solicitudesPendientes: (g.solicitudesPendientes || []).filter(a => a.id !== applicantId)
      };
    });

    setGroups(nextGroups);
    storageService.updateUser({ id: applicant.id, grupoId: currentGroup.id, rol: 'estudiante' });
    announce(`Solicitud de ${applicant.nombre} aprobada. Ahora es miembro del grupo.`, 'polite');
  };

  const rejectJoinRequest = (applicantId) => {
    if (!isAdmin || !currentGroup) return;

    setGroups(groups.map(g =>
      g.id === currentGroup.id
        ? { ...g, solicitudesPendientes: g.solicitudesPendientes.filter(a => a.id !== applicantId) }
        : g
    ));
    announce('Solicitud rechazada.', 'polite');
  };

  // Alternar privilegios de administrador para un compañero de grupo
  const toggleMemberAdminRole = (memberId) => {
    if (!currentGroup || !isAdmin) return;
    if (memberId === currentGroup.adminId) {
      announce('No puedes cambiar los permisos del creador principal del grupo.', 'assertive');
      return;
    }
    const target = currentGroup.miembros.find(m => m.id === memberId);
    if (!target) return;

    const willBeAdmin = target.rol !== 'admin';
    const nextGroups = groups.map(g => {
      if (g.id !== currentGroup.id) return g;
      return {
        ...g,
        miembros: g.miembros.map(m => (m.id === memberId ? { ...m, rol: willBeAdmin ? 'admin' : 'estudiante' } : m))
      };
    });

    setGroups(nextGroups);
    storageService.updateUser({ id: memberId, rol: willBeAdmin ? 'admin' : 'estudiante' });
    announce(
      willBeAdmin
        ? `${target.nombre} ahora tiene privilegios de Administrador en el grupo.`
        : `Se han removido los privilegios de Administrador a ${target.nombre}.`,
      'polite'
    );
  };

  // Expulsar a un miembro del grupo (solo administradores, no se puede expulsar al creador principal)
  const removeMemberFromGroup = (memberId) => {
    if (!currentGroup || !isAdmin) return;
    if (memberId === currentGroup.adminId) {
      announce('No se puede expulsar al administrador principal del grupo.', 'assertive');
      return;
    }
    if (memberId === currentUser?.id) {
      requestLeaveGroup();
      return;
    }

    const target = currentGroup.miembros.find(m => m.id === memberId);
    if (!target) return;

    const nextGroups = groups.map(g => {
      if (g.id !== currentGroup.id) return g;
      return {
        ...g,
        miembros: g.miembros.filter(m => m.id !== memberId)
      };
    });

    setGroups(nextGroups);
    storageService.updateUser({ id: memberId, grupoId: null, rol: 'estudiante' });
    announce(`${target.nombre} ha sido retirado de la comunidad ${currentGroup.nombre}.`, 'assertive');
  };

  // Actualizar datos generales del grupo actual (nombre, descripción, código de invitación)
  const updateCurrentGroup = ({ nombre, descripcion, codigoInvitacion }) => {
    if (!currentGroup || !isAdmin) return { success: false };
    const cleanName = (nombre || '').trim();
    const cleanCode = (codigoInvitacion || '').trim().toUpperCase();

    if (!cleanName) {
      announce('El nombre de la comunidad no puede estar vacío.', 'assertive');
      return { success: false };
    }

    const nextGroups = groups.map(g => {
      if (g.id !== currentGroup.id) return g;
      return {
        ...g,
        nombre: cleanName,
        descripcion: (descripcion || '').trim(),
        codigoInvitacion: cleanCode || g.codigoInvitacion
      };
    });

    setGroups(nextGroups);
    announce(`Datos de la comunidad "${cleanName}" actualizados correctamente.`, 'polite');
    return { success: true };
  };

  // Grupo "destino" que se muestra en los diálogos de advertencia
  const pendingGroupSwitch =
    pendingAction?.type === 'join'
      ? pendingAction.group
      : pendingAction?.type === 'create'
        ? { nombre: pendingAction.data.nombre }
        : null;

  return (
    <AuthGroupContext.Provider value={{
      currentUser,
      isAuthenticated: Boolean(currentUser),
      login,
      register,
      logout,
      mockAccounts: MOCK_ACCOUNTS,
      currentGroup,
      groups,
      isAdmin,
      isPrimaryAdmin,
      toggleMemberAdminRole,
      removeMemberFromGroup,
      updateCurrentGroup,
      requestJoinGroup,
      sendJoinRequest,
      cancelJoinRequest,
      joinGroupByCode,
      createNewGroup,
      requestLeaveGroup,
      openTransferLeadershipModal,
      confirmGroupSwitch,
      cancelGroupSwitch,
      cancelSuccession,
      transferAdminRoleAndLeave,
      autoAssignSuccessorAndLeave,
      approveJoinRequest,
      rejectJoinRequest,
      isSwitchWarningOpen,
      isSuccessionModalOpen,
      pendingAction,
      pendingGroupSwitch,
      setIsSuccessionModalOpen
    }}>
      {children}
    </AuthGroupContext.Provider>
  );
};

export const useAuthGroup = () => {
  const context = useContext(AuthGroupContext);
  if (!context) {
    throw new Error('useAuthGroup debe usarse dentro de un AuthGroupProvider');
  }
  return context;
};
