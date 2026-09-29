import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '520px',
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div
        className="modal-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="modal-content" style={{ maxWidth }}>
        {/* Header */}
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="modal-close"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
