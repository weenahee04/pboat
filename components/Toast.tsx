import React, { useEffect } from 'react';
import { ToastMessage } from '../types';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-20 right-4 z-[60] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const styles = {
    success: 'bg-green-900/90 border-green-500/50 text-green-100',
    error: 'bg-red-900/90 border-red-500/50 text-red-100',
    info: 'bg-gray-800/90 border-gray-500/50 text-gray-100',
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-gray-400" />,
  };

  return (
    <div 
      className={`pointer-events-auto min-w-[300px] p-4 rounded-sm border shadow-xl flex items-start gap-3 animate-fade-in backdrop-blur-md ${styles[toast.type]}`}
    >
      <div className="mt-0.5">{icons[toast.type]}</div>
      <div className="flex-1">
        <p className="text-sm font-medium">{toast.message}</p>
      </div>
      <button onClick={() => onRemove(toast.id)} className="opacity-60 hover:opacity-100">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;