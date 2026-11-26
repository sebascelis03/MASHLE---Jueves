import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { useAuthGroup } from './AuthGroupContext';
import { useA11y } from './A11yContext';

const TaskContext = createContext();

const PRIORITY_WEIGHT = {
  alta: 3,
  media: 2,
  baja: 1
};

export const TaskProvider = ({ children }) => {
  const { currentGroup, currentUser, isAdmin } = useAuthGroup();
  const { announce } = useA11y();

  const [tasks, setTasks] = useState(() => storageService.getTasks());
  const [subjects, setSubjects] = useState(() => storageService.getSubjects());
  // Seguimiento individual:
  // { "[userId]_[taskId]": { estadoPersonal: 'pendiente'|'en_progreso'|'finalizada', realizada: boolean, notasPersonales: string, fechaActualizacion: string } }
  const [userProgress, setUserProgress] = useState(() => storageService.getUserProgress());
  const [filterStatus, setFilterStatus] = useState('todos'); // 'todos' | 'pendiente' | 'en_progreso' | 'finalizada'
  const [filterSubject, setFilterSubject] = useState('todas');
  const [filterPriority, setFilterPriority] = useState('todas'); // 'todas' | 'alta' | 'media' | 'baja'
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Guardar cambios en el almacenamiento local
  useEffect(() => {
    storageService.saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    storageService.saveSubjects(subjects);
  }, [subjects]);

  useEffect(() => {
    storageService.saveUserProgress(userProgress);
  }, [userProgress]);

  // Escuchar recarga global cuando se carga el Escenario Demo o se reinician datos
  useEffect(() => {
    const handleDataReload = () => {
      setTasks(storageService.getTasks());
      setSubjects(storageService.getSubjects());
      setUserProgress(storageService.getUserProgress());
      setFilterStatus('todos');
      setFilterSubject('todas');
      setFilterPriority('todas');
    };
    window.addEventListener('cal_estudiantil_data_reload', handleDataReload);
    return () => window.removeEventListener('cal_estudiantil_data_reload', handleDataReload);
  }, []);

  // Filtrar y ordenar tareas pertenecientes al grupo actual (por fecha/hora más próxima y luego mayor prioridad)
  const currentGroupTasks = tasks
    .filter(t => t.grupoId === currentGroup?.id)
    .sort((a, b) => {
      const dateA = `${a.fechaEntrega || '9999-12-31'}T${a.horaEntrega || '23:59'}`;
      const dateB = `${b.fechaEntrega || '9999-12-31'}T${b.horaEntrega || '23:59'}`;
      if (dateA !== dateB) return dateA.localeCompare(dateB);
      const prioA = PRIORITY_WEIGHT[a.prioridad || 'media'] || 2;
      const prioB = PRIORITY_WEIGHT[b.prioridad || 'media'] || 2;
      return prioB - prioA;
    });

  const currentGroupSubjects = subjects.filter(s => s.grupoId === currentGroup?.id);

  // Tareas filtradas por materia, estado oficial y prioridad
  const filteredTasks = currentGroupTasks.filter(task => {
    const matchesStatus = filterStatus === 'todos' || task.estado === filterStatus;
    const matchesSubject = filterSubject === 'todas' || task.materiaId === filterSubject;
    const matchesPriority = filterPriority === 'todas' || (task.prioridad || 'media') === filterPriority;
    return matchesStatus && matchesSubject && matchesPriority;
  });

  // Crear o actualizar tarea
  const saveTask = (taskData) => {
    if (!currentGroup || !currentUser) return;
    if (!isAdmin) {
      announce('Solo el administrador del grupo puede crear o editar tareas oficiales.', 'assertive');
      return;
    }

    if (taskData.id) {
      // Actualizar
      const updated = tasks.map(t => t.id === taskData.id ? { ...t, ...taskData } : t);
      setTasks(updated);
      announce(`Tarea "${taskData.titulo}" actualizada correctamente.`, 'polite');
    } else {
      // Crear nueva
      const newTask = {
        ...taskData,
        id: `tsk-${Date.now()}`,
        grupoId: currentGroup.id,
        creadorId: currentUser.id,
        estado: taskData.estado || 'pendiente',
        prioridad: taskData.prioridad || 'media'
      };
      setTasks(prev => [newTask, ...prev]);
      announce(`Tarea "${newTask.titulo}" creada para el ${newTask.fechaEntrega}.`, 'polite');
    }

    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  // Estado OFICIAL de la tarea (solo administrador). Los estudiantes usan su seguimiento personal.
  const updateTaskStatus = (taskId, newStatus) => {
    if (!isAdmin) {
      announce('Solo el administrador puede cambiar el estado oficial de la tarea.', 'assertive');
      return;
    }

    const statusLabels = {
      pendiente: 'marcada como Pendiente',
      en_progreso: 'marcada como En Progreso',
      finalizada: 'marcada como Finalizada'
    };

    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setTasks(prev => prev.map(t => (t.id === taskId ? { ...t, estado: newStatus } : t)));
    announce(`Estado oficial de la tarea "${task.titulo}" ${statusLabels[newStatus] || newStatus}.`, 'polite');
  };

  // Eliminar tarea (solo administrador)
  const deleteTask = (taskId) => {
    if (!isAdmin) {
      announce('Solo el administrador puede eliminar tareas del salón.', 'assertive');
      return;
    }

    const taskToDelete = tasks.find(t => t.id === taskId);
    setTasks(prev => prev.filter(t => t.id !== taskId));
    // Limpiar el seguimiento individual asociado a la tarea eliminada
    setUserProgress(prev => {
      const next = {};
      Object.keys(prev).forEach(key => {
        if (!key.endsWith(`_${taskId}`)) next[key] = prev[key];
      });
      return next;
    });
    if (taskToDelete) {
      announce(`Tarea "${taskToDelete.titulo}" eliminada.`, 'assertive');
    }
  };

  /* ------------------ Seguimiento individual del estudiante ------------------ */
  const progressKey = (userId, taskId) => `${userId}_${taskId}`;

  const resolvePersonalStatus = (entry) => {
    if (!entry) return 'pendiente';
    if (entry.estadoPersonal === 'pendiente' || entry.estadoPersonal === 'en_progreso' || entry.estadoPersonal === 'finalizada') {
      return entry.estadoPersonal;
    }
    return entry.realizada ? 'finalizada' : 'pendiente';
  };

  const getMyProgress = (taskId) => {
    const entry = currentUser ? userProgress[progressKey(currentUser.id, taskId)] : null;
    const estadoPersonal = resolvePersonalStatus(entry);
    return {
      estadoPersonal,
      realizada: estadoPersonal === 'finalizada',
      notasPersonales: entry?.notasPersonales || '',
      fechaActualizacion: entry?.fechaActualizacion || null
    };
  };

  const updateMyProgress = (taskId, patch) => {
    if (!currentUser) return;
    const key = progressKey(currentUser.id, taskId);
    setUserProgress(prev => {
      const currentEntry = prev[key];
      const nextStatus =
        patch.estadoPersonal ??
        (typeof patch.realizada === 'boolean'
          ? (patch.realizada ? 'finalizada' : 'pendiente')
          : resolvePersonalStatus(currentEntry));

      return {
        ...prev,
        [key]: {
          notasPersonales: currentEntry?.notasPersonales || '',
          ...patch,
          estadoPersonal: nextStatus,
          realizada: nextStatus === 'finalizada',
          fechaActualizacion: new Date().toISOString()
        }
      };
    });
  };

  // Cambiar estado personal entre los 3 estados del Tablero Scrum ('pendiente' | 'en_progreso' | 'finalizada')
  const setMyTaskStatus = (taskId, estadoPersonal) => {
    const task = tasks.find(t => t.id === taskId);
    updateMyProgress(taskId, { estadoPersonal });
    const labels = {
      pendiente: 'Por realizar (Pendiente)',
      en_progreso: 'En progreso',
      finalizada: 'Realizada (Finalizada)'
    };
    announce(
      `Tu estado personal en "${task?.titulo}" cambió a: ${labels[estadoPersonal] || estadoPersonal}.`,
      'polite'
    );
  };

  // Compatibilidad directa booleana ("Ya la realicé" / "No la he realizado")
  const setMyTaskDone = (taskId, realizada) => {
    setMyTaskStatus(taskId, realizada ? 'finalizada' : 'pendiente');
  };

  const saveMyNotes = (taskId, notasPersonales) => {
    const task = tasks.find(t => t.id === taskId);
    updateMyProgress(taskId, { notasPersonales });
    announce(`Notas personales guardadas para "${task?.titulo}".`, 'polite');
  };

  // Métrica y desglose nominal para el administrador: estado de cada miembro del salón en la tarea
  const getTaskCompletion = (taskId) => {
    const members = currentGroup?.miembros || [];
    const membersBreakdown = members.map(m => {
      const entry = userProgress[progressKey(m.id, taskId)];
      const estadoPersonal = resolvePersonalStatus(entry);
      return {
        id: m.id,
        nombre: m.nombre,
        email: m.email,
        rol: m.rol,
        estadoPersonal,
        realizada: estadoPersonal === 'finalizada',
        fechaActualizacion: entry?.fechaActualizacion || null
      };
    });

    const done = membersBreakdown.filter(m => m.estadoPersonal === 'finalizada').length;
    const inProgress = membersBreakdown.filter(m => m.estadoPersonal === 'en_progreso').length;
    const pending = membersBreakdown.filter(m => m.estadoPersonal === 'pendiente').length;

    return {
      done,
      inProgress,
      pending,
      total: members.length,
      membersBreakdown
    };
  };

  // Crear o actualizar materia (incluyendo enlace de WhatsApp directo)
  const saveSubject = (subjectData) => {
    if (!currentGroup) return;
    if (!isAdmin) {
      announce('Solo el administrador puede crear o editar materias del grupo.', 'assertive');
      return;
    }

    if (subjectData.id) {
      setSubjects(prev => prev.map(s => s.id === subjectData.id ? { ...s, ...subjectData } : s));
      announce(`Materia "${subjectData.nombre}" actualizada.`, 'polite');
    } else {
      const newSubject = {
        ...subjectData,
        id: `mat-${Date.now()}`,
        grupoId: currentGroup.id
      };
      setSubjects(prev => [...prev, newSubject]);
      announce(`Materia "${newSubject.nombre}" agregada al grupo.`, 'polite');
    }
  };

  const deleteSubject = (subjectId) => {
    if (!isAdmin) {
      announce('Solo el administrador puede eliminar materias.', 'assertive');
      return;
    }
    const subj = subjects.find(s => s.id === subjectId);
    setSubjects(prev => prev.filter(s => s.id !== subjectId));
    // Desasociar tareas que apuntaban a la materia eliminada para que no queden huérfanas
    setTasks(prev =>
      prev.map(t => (t.materiaId === subjectId ? { ...t, materiaId: '' } : t))
    );
    if (filterSubject === subjectId) {
      setFilterSubject('todas');
    }
    if (subj) {
      announce(`Materia "${subj.nombre}" eliminada.`, 'assertive');
    }
  };

  return (
    <TaskContext.Provider value={{
      tasks: currentGroupTasks,
      filteredTasks,
      subjects: currentGroupSubjects,
      filterStatus,
      setFilterStatus,
      filterSubject,
      setFilterSubject,
      filterPriority,
      setFilterPriority,
      selectedDate,
      setSelectedDate,
      isTaskModalOpen,
      setIsTaskModalOpen,
      editingTask,
      setEditingTask,
      saveTask,
      updateTaskStatus,
      deleteTask,
      saveSubject,
      deleteSubject,
      canManageTasks: isAdmin,
      getMyProgress,
      setMyTaskStatus,
      setMyTaskDone,
      saveMyNotes,
      getTaskCompletion
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks debe usarse dentro de un TaskProvider');
  }
  return context;
};
