import React from 'react';

export default function Popup({ title, message, onClose, type = 'info' }) {
  if (!message && !title) return null;
  
  const borderColor = type === 'error' ? 'var(--danger, #ef4444)' : type === 'success' ? 'var(--success, #22c55e)' : 'var(--primary, #3b82f6)';
  
  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div 
        className="modal-content" 
        onClick={e => e.stopPropagation()} 
        style={{ 
          maxWidth: 400, 
          borderTop: `4px solid ${borderColor}`,
          textAlign: 'center'
        }}
      >
        {title && <h3 style={{ marginBottom: 12 }}>{title}</h3>}
        <p className="muted" style={{ marginBottom: 20 }}>{message}</p>
        <button className="btn btn-primary" onClick={onClose} style={{ minWidth: 100 }}>
          OK
        </button>
      </div>
    </div>
  );
}
