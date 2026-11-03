import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose, duration = 4000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const isSuccess = type === 'success';
  const isError = type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 max-w-md">
      <div className="flex-shrink-0">
        {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
        {isError && <AlertCircle className="w-5 h-5 text-rose-500" />}
        {!isSuccess && !isError && <Info className="w-5 h-5 text-indigo-500" />}
      </div>
      <p className="text-sm font-medium flex-1">{message}</p>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
