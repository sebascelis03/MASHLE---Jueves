import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService, MOCK_ACCOUNTS } from '../services/storageService';
import { useA11y } from './A11yContext';

const AuthGroupContext = createContext();

export const AuthGroupProvider = ({ children }) => {
  const { announce } = useA11y();
  const [currentUser, setCurrentUser] = useState(() => storageService.getCurrentUser());
  const [groups, setGroups] = useState(() => storageService.getGroups());
  
  // Modales de prevención y sucesión
  const [pendingGroupSwitch, setPendingGroupSwitch] = useState(null);
  const [isSuccessionModalOpen, setIsSuccessionModalOpen] = useState(false);
  const [isSwitchWarningOpen, setIsSwitchWarningOpen] = useState(false);

  // Sincronizar con almacenamiento local
  useEffect(() => {
    storageService.setCurrentUser(currentUser);
  }, [currentUser]);

  useEffect(() => {
    storageService.saveGroups(groups);
  }, [groups]);

  // Funciones de Autenticación
  const login = (email, password) => {
    try {
      const user = storageService.login(email, password);
      // Sincronizar con los grupos en caso de que su rol haya cambiado
      const currentGrp = groups.find(g => g.id === user.grupoId);
      const isGrpAdmin = currentGrp && currentGrp.adminId === user.id;
      const userWithUpdatedRole = {
        ...user,
        rol: isGrpAdmin ? 'admin' : (user.grupoId ? 'estudiante' : user.rol)
      };

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
      return { success: true, user: newUser };
    } catch (err) {
      announce(`Error de registro: ${err.message}`, 'assertive');
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    storageService.logout();
    setCurrentUser(null);
    announce('Has cerrado sesión correctamente.', 'polite');
  };

  // Grupo activo del usuario actual
  const currentGroup = groups.find(g => g.id === currentUser?.grupoId) || null;
  const isAdmin = currentGroup && currentGroup.adminId === currentUser?.id;

  // 1. Iniciar intención de cambio o unión a un nuevo grupo
  const requestJoinGroup = (targetGroupId) => {
    if (!currentUser) return;
    
    if (currentUser.grupoId === targetGroupId) {
      announce('Ya te encuentras en este grupo escolar.', 'polite');
      return;
    }

    const targetGroup = groups.find(g => g.id === targetGroupId);
    if (!targetGroup) return;

    if (currentUser.grupoId) {
      setPendingGroupSwitch(targetGroup);
      setIsSwitchWarningOpen(true);
      announce(`Atención: Deseas unirte a ${targetGroup.nombre}. Esto provocará tu salida automática de tu grupo actual.`, 'assertive');
    } else {
      executeJoinGroup(targetGroup);
    }
  };

  // 2. Confirmación de salida del grupo anterior
  const confirmGroupSwitch = () => {
    setIsSwitchWarningOpen(false);

    if (isAdmin) {
      setIsSuccessionModalOpen(true);
      announce('Eres el administrador de tu grupo actual. Debes seleccionar un sucesor antes de abandonarlo.', 'assertive');
      return;
    }

    if (pendingGroupSwitch) {
      executeJoinGroup(pendingGroupSwitch);
    }
  };

  // 3. Ejecutar cesión de rol y proceder con la salida
  const transferAdminRoleAndLeave = (successorId) => {
    if (!currentGroup || !isAdmin) return;

    const successor = currentGroup.miembros.find(m => m.id === successorId);
    if (!successor && currentGroup.miembros.length > 1) {
      announce('Debes seleccionar un miembro válido como nuevo administrador.', 'assertive');
      return;
    }

    const updatedGroups = groups.map(g => {
      if (g.id === currentGroup.id) {
        const remainingMembers = g.miembros
          .filter(m => m.id !== currentUser.id)
          .map(m => m.id === successorId ? { ...m, rol: 'admin' } : m);

        return {
          ...g,
          adminId: successorId,
          miembros: remainingMembers
        };
      }
      return g;
    });

    setGroups(updatedGroups);
    setIsSuccessionModalOpen(false);

    const successorName = successor ? successor.nombre : 'un miembro asignado automáticamente';
    announce(`El rol de Administrador ha sido transferido a ${successorName}. Has salido del grupo anterior.`, 'assertive');

    if (pendingGroupSwitch) {
      executeJoinGroup(pendingGroupSwitch, updatedGroups);
    }
  };

  // 4. Salida abrupta con reasignación automática de sucesor
  const autoAssignSuccessorAndLeave = () => {
    if (!currentGroup) return;
    const eligibleMembers = currentGroup.miembros.filter(m => m.id !== currentUser.id);
    const fallbackSuccessorId = eligibleMembers.length > 0 ? eligibleMembers[0].id : null;

    transferAdminRoleAndLeave(fallbackSuccessorId);
  };

  // 5. Unirse efectivamente al nuevo grupo
  const executeJoinGroup = (targetGroup, currentGroupsList = groups) => {
    const updatedGroups = currentGroupsList.map(g => {
      if (g.id === currentUser.grupoId) {
        return {
          ...g,
          miembros: g.miembros.filter(m => m.id !== currentUser.id)
        };
      }
      if (g.id === targetGroup.id) {
        const alreadyIn = g.miembros.some(m => m.id === currentUser.id);
        const newMembers = alreadyIn 
          ? g.miembros 
          : [...g.miembros, { id: currentUser.id, nombre: currentUser.nombre, email: currentUser.email, rol: 'estudiante' }];
        return {
          ...g,
          miembros: newMembers
        };
      }
      return g;
    });

    const updatedUser = {
      ...currentUser,
      grupoId: targetGroup.id,
      rol: 'estudiante'
    };

    setGroups(updatedGroups);
    setCurrentUser(updatedUser);
    setPendingGroupSwitch(null);

    announce(`Te has unido exitosamente al grupo: ${targetGroup.nombre}.`, 'polite');
  };

  // 6. Crear un nuevo grupo
  const createNewGroup = ({ nombre, descripcion, codigoInvitacion }) => {
    const newGroupId = `grp-${Date.now()}`;
    const newGroup = {
      id: newGroupId,
      nombre,
      descripcion,
      codigoInvitacion: codigoInvitacion || `COD-${Math.floor(1000 + Math.random() * 9000)}`,
      adminId: currentUser.id,
      solicitudesPendientes: [],
      miembros: [
        { id: currentUser.id, nombre: currentUser.nombre, email: currentUser.email, rol: 'admin' }
      ]
    };

    if (isAdmin && currentGroup) {
      setPendingGroupSwitch(newGroup);
      setIsSuccessionModalOpen(true);
      announce('Para crear una nueva comunidad, primero debes ceder la administración de tu grupo actual.', 'assertive');
      return;
    }

    const updatedGroups = groups.map(g => {
      if (g.id === currentUser.grupoId) {
        return {
          ...g,
          miembros: g.miembros.filter(m => m.id !== currentUser.id)
        };
      }
      return g;
    });

    const finalGroups = [...updatedGroups, newGroup];
    const updatedUser = {
      ...currentUser,
      grupoId: newGroupId,
      rol: 'admin'
    };

    setGroups(finalGroups);
    setCurrentUser(updatedUser);
    announce(`Comunidad "${nombre}" creada con éxito. Ahora eres el Administrador.`, 'assertive');
  };

  // 7. Acciones del Administrador: aprobar o rechazar solicitudes
  const approveJoinRequest = (applicantId) => {
    if (!isAdmin || !currentGroup) return;

    const applicant = currentGroup.solicitudesPendientes.find(a => a.id === applicantId);
    if (!applicant) return;

    const updatedGroups = groups.map(g => {
      if (g.id === currentGroup.id) {
        return {
          ...g,
          solicitudesPendientes: g.solicitudesPendientes.filter(a => a.id !== applicantId),
          miembros: [...g.miembros, { ...applicant, rol: 'estudiante' }]
        };
      }
      return g;
    });

    setGroups(updatedGroups);
    announce(`Solicitud de ${applicant.nombre} aprobada. Ahora es miembro del grupo.`, 'polite');
  };

  const rejectJoinRequest = (applicantId) => {
    if (!isAdmin || !currentGroup) return;

    const updatedGroups = groups.map(g => {
      if (g.id === currentGroup.id) {
        return {
          ...g,
          solicitudesPendientes: g.solicitudesPendientes.filter(a => a.id !== applicantId)
        };
      }
      return g;
    });

    setGroups(updatedGroups);
    announce(`Solicitud rechazada.`, 'polite');
  };

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
      requestJoinGroup,
      confirmGroupSwitch,
      cancelGroupSwitch: () => {
        setIsSwitchWarningOpen(false);
        setPendingGroupSwitch(null);
        announce('Cambio de grupo cancelado.', 'polite');
      },
      transferAdminRoleAndLeave,
      autoAssignSuccessorAndLeave,
      createNewGroup,
      approveJoinRequest,
      rejectJoinRequest,
      isSwitchWarningOpen,
      isSuccessionModalOpen,
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
