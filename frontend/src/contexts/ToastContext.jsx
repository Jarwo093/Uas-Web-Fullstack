import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(undefined);

let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts(prev =>
      prev.map(t => t.id === id ? { ...t, exiting: true } : t)
    );
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 200);
  }, []);

  const addToast = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, type, title, message, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, [removeToast]);

  const toast = useMemo(() => ({
    success: (title, message) => addToast({ type: 'success', title, message }),
    error:   (title, message) => addToast({ type: 'error', title, message }),
    warning: (title, message) => addToast({ type: 'warning', title, message }),
    info:    (title, message) => addToast({ type: 'info', title, message }),
  }), [addToast]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const iconMap = {
  success: CheckCircle,
  error:   AlertCircle,
  warning: AlertTriangle,
  info:    Info,
};

const ToastContainer = ({ toasts, onClose }) => {
  return (
    <div className="toast-container">
      {toasts.map(toast => {
        const Icon = iconMap[toast.type] || Info;
        return (
          <div
            key={toast.id}
            className={`toast toast-${toast.type} ${toast.exiting ? 'toast-exit' : ''}`}
          >
            <Icon className="toast-icon" size={20} />
            <div className="toast-body">
              <div className="toast-title">{toast.title}</div>
              {toast.message && <div className="toast-message">{toast.message}</div>}
            </div>
            <button className="toast-close" onClick={() => onClose(toast.id)}>
              <X size={16} />
            </button>
            {toast.duration > 0 && (
              <div
                className="toast-progress"
                style={{ animationDuration: `${toast.duration}ms` }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
