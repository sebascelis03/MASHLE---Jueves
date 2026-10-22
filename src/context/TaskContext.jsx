import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { useAuthGroup } from './AuthGroupContext';
import { useA11y } from './A11yContext';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { currentGroup, currentUser } = useAuthGroup();
  const { announce } = useA11y();

  const [tasks, setTasks] = useState(() => storageService.getTasks());
  const [subjects, setSubjects] = useState(() => storageService.getSubjects());
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

  // Cambio rápido de estado de la tarea (Progresión de Tareas)
  const updateTaskStatus = (taskId, newStatus) => {
    const statusLabels = {
      pendiente: 'marcada como Pendiente',
      en_progreso: 'marcada como En Progreso',
      finalizada: 'marcada como Finalizada'
    };

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        announce(`Tarea "${t.titulo}" ${statusLabels[newStatus] || newStatus}.`, 'polite');
        return { ...t, estado: newStatus };
      }
      return t;
    }));
  };

  // Eliminar tarea
  const deleteTask = (taskId) => {
    const taskToDelete = tasks.find(t => t.id === taskId);
    setTasks(prev => prev.filter(t => t.id !== taskId));
    if (taskToDelete) {
      announce(`Tarea "${taskToDelete.titulo}" eliminada.`, 'assertive');
    }
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
      saveSubject
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
