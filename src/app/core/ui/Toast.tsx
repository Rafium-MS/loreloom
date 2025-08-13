import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Toast {
  id: number;
  type: 'success' | 'error';
  message: string;
}

interface ToastContextValue {
  addToast: (toast: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue>({ addToast: () => {} });

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Date.now();
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => removeToast(id), 3000);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`px-4 py-2 rounded text-white shadow-lg ${
              t.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

export default ToastProvider;