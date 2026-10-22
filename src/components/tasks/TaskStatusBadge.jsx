import React from 'react';
import { Clock, PlayCircle, CheckCircle2 } from 'lucide-react';

export const TaskStatusBadge = ({ estado }) => {
  if (estado === 'finalizada') {
    return (
      <span className="badge badge-completed" role="status" aria-label="Estado: Finalizada">
        <CheckCircle2 size={13} aria-hidden="true" />
        <span>Finalizada</span>
      </span>
    );
  }

  if (estado === 'en_progreso') {
    return (
      <span className="badge badge-progress" role="status" aria-label="Estado: En Progreso">
        <PlayCircle size={13} aria-hidden="true" />
        <span>En Progreso</span>
      </span>
    );
  }

  // Default: pendiente
  return (
    <span className="badge badge-pending" role="status" aria-label="Estado: Pendiente">
      <Clock size={13} aria-hidden="true" />
      <span>Pendiente</span>
    </span>
  );
};
