import { createContext, useContext, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const ToastContext = createContext<{
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
} | null>(null);

interface ToastsProviderProps {
  children: React.ReactNode;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

const ToastContainer = ({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) => {
  return createPortal(
    <div id="toast-container" className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast--${toast.type}`}>
          <span>{toast.message}</span>
          <button type="button" className="toast__close" onClick={() => removeToast(toast.id)}>
            X
          </button>
        </div>
      ))}
    </div>,
    document.body
  );
}

export const ToastsProvider = ({ children }: ToastsProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastTimeoutRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const showToast = (message: string, type: 'success' | 'error' | 'info', delay: number = 3000) => {
    const id = crypto.randomUUID();
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);
    const timeoutId = setTimeout(() => { removeToast(id) }, delay);
    toastTimeoutRef.current.set(id, timeoutId);
  }

  const removeToast = (id: string) => {
    const timeoutId = toastTimeoutRef.current.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      toastTimeoutRef.current.delete(id);
    }

    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }

  const success = (message: string) => showToast(message, 'success');
  const error = (message: string) => showToast(message, 'error');
  const info = (message: string) => showToast(message, 'info');

  return (
    <ToastContext.Provider value={{ success, error, info }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
};

export const useToasts = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToasts must be used within a ToastsProvider');
  }
  return context;
}
