import { createContext, useCallback, useMemo, useState } from 'react';
import { CheckCircle2, XCircle, Info } from 'lucide-react';

export const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((message, type = 'default') => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => remove(id), 3200);
  }, [remove]);

  const toast = useMemo(() => ({
    show: (msg) => push(msg, 'default'),
    success: (msg) => push(msg, 'success'),
    error: (msg) => push(msg, 'error'),
  }), [push]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-stack" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            {t.type === 'success' && <CheckCircle2 size={17} />}
            {t.type === 'error' && <XCircle size={17} />}
            {t.type === 'default' && <Info size={17} />}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastContext;
