import React from 'react';
import { useA11y } from '../../context/A11yContext';

export const LiveAnnouncer = () => {
  const { announcement } = useA11y();

  return (
    <div className="sr-only">
      {/* Región amable para avisos estándar (cambios de vista, tareas, filtros) */}
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
        id="a11y-announcer-polite"
      >
        {announcement.priority === 'polite' ? announcement.message : ''}
      </div>

      {/* Región asertiva para avisos críticos (cambios de rol, advertencias de expulsión, errores) */}
      <div 
        role="alert" 
        aria-live="assertive" 
        aria-atomic="true"
        id="a11y-announcer-assertive"
      >
        {announcement.priority === 'assertive' ? announcement.message : ''}
      </div>
    </div>
  );
};
