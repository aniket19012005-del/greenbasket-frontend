import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, children, footer, width = 480 }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog" aria-modal="true" aria-label={title}
      style={{ position: 'fixed', inset: 0, background: 'rgba(15,36,29,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{ width: '100%', maxWidth: width, maxHeight: '85vh', overflowY: 'auto', padding: 24 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <h3 style={{ fontSize: 17 }}>{title}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close dialog"><X size={18} /></button>
        </div>
        {children}
        {footer && <div className="form-actions">{footer}</div>}
      </div>
    </div>
  );
}
