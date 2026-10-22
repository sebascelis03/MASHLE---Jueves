import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { useAuthGroup } from './AuthGroupContext';
import { useA11y } from './A11yContext';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { currentGroup, currentUser, isAdmin } = useAuthGroup();
  const { announce } = useA11y();

  const [tasks, setTasks] = useState(() => storageService.getTasks());
  const [subjects, setSubjects] = useState(() => storageService.getSubjects());
  // Seguimiento individual: { "[userId]_[taskId]": { realizada, notasPersonales, fechaActualizacion } }
  const [userProgress, setUserProgress] = useState(() => storageService.getUserProgress());
  const [filterStatus, setFilterStatus] = useState('todos'); // 'todos' | 'pendiente' | 'en_progreso' | 'finalizada'
  const [filterSubject, setFilterSubject] = useState('todas');
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

  // Filtrar tareas pertenecientes al grupo actual
  const currentGroupTasks = tasks.filter(t => t.grupoId === currentGroup?.id);
  const currentGroupSubjects = subjects.filter(s => s.grupoId === currentGroup?.id);

  // Tareas filtradas por vista/criterio
  const filteredTasks = currentGroupTasks.filter(task => {
    const matchesStatus = filterStatus === 'todos' || task.estado === filterStatus;
    const matchesSubject = filterSubject === 'todas' || task.materiaId === filterSubject;
    return matchesStatus && matchesSubject;
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
        estado: taskData.estado || 'pendiente'
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
    announce(`Tarea "${task.titulo}" ${statusLabels[newStatus] || newStatus}.`, 'polite');
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

  const getMyProgress = (taskId) => {
    const entry = currentUser ? userProgress[progressKey(currentUser.id, taskId)] : null;
    return {
      realizada: Boolean(entry?.realizada),
      notasPersonales: entry?.notasPersonales || '',
      fechaActualizacion: entry?.fechaActualizacion || null
    };
  };

  const updateMyProgress = (taskId, patch) => {
    if (!currentUser) return;
    const key = progressKey(currentUser.id, taskId);
    setUserProgress(prev => ({
      ...prev,
      [key]: {
        realizada: Boolean(prev[key]?.realizada),
        notasPersonales: prev[key]?.notasPersonales || '',
        ...patch,
        fechaActualizacion: new Date().toISOString()
      }
    }));
  };

  // "Ya la realicé" (true) / "No la he realizado" (false)
  const setMyTaskDone = (taskId, realizada) => {
    const task = tasks.find(t => t.id === taskId);
    updateMyProgress(taskId, { realizada });
    announce(
      realizada
        ? `Marcaste la tarea "${task?.titulo}" como realizada.`
        : `Marcaste la tarea "${task?.titulo}" como no realizada.`,
      'polite'
    );
  };

  const saveMyNotes = (taskId, notasPersonales) => {
    const task = tasks.find(t => t.id === taskId);
    updateMyProgress(taskId, { notasPersonales });
    announce(`Notas personales guardadas para "${task?.titulo}".`, 'polite');
  };

  // Métrica para el administrador: cuántos miembros del salón realizaron la tarea
  const getTaskCompletion = (taskId) => {
    const members = currentGroup?.miembros || [];
    const done = members.filter(m => userProgress[progressKey(m.id, taskId)]?.realizada).length;
    return { done, total: members.length };
  };

  // Crear o actualizar materia (incluyendo enlace de WhatsApp directo)
  const saveSubject = (subjectData) => {
    if (!currentGroup) return;

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
