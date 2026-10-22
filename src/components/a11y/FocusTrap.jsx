import React, { useEffect, useRef } from 'react';

export const FocusTrap = ({ children, onClose, active = true, role = 'dialog', ariaLabel, ariaDescribedBy }) => {
  const containerRef = useRef(null);
  const previouslyFocusedElementRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    // Guardar elemento enfocado anteriormente para restaurar al cerrar
    previouslyFocusedElementRef.current = document.activeElement;

    const container = containerRef.current;
    if (!container) return;

    // Obtener elementos interactivos
    const getFocusableElements = () => {
      return container.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
    };

    const focusable = getFocusableElements();
    if (focusable.length > 0) {
      // Enfocar el primer elemento interactivo o el modal
      setTimeout(() => {
        focusable[0].focus();
      }, 50);
    }

    const handleKeyDown = (e) => {
      // Cerrar con Escape
      if (e.key === 'Escape' && onClose) {
        e.preventDefault();
        onClose();
        return;
      }

      // Atrapamiento de foco con tecla Tab
      if (e.key === 'Tab') {
        const focusableElements = Array.from(getFocusableElements());
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab hacia atrás
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab hacia adelante
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Restaurar foco al elemento disparador
      if (previouslyFocusedElementRef.current && previouslyFocusedElementRef.current.focus) {
        previouslyFocusedElementRef.current.focus();
      }
    };
  }, [active, onClose]);

  return (
    <div
      ref={containerRef}
      role={role}
      aria-modal="true"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      className="focus-trap-container"
      tabIndex={-1}
      style={{ outline: 'none' }}
    >
      {children}
    </div>
  );
};
