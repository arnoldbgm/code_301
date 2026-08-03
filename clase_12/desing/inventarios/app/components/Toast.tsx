"use client";

import { createContext, useContext, useState, useCallback, useRef, ReactNode } from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counterRef = useRef(0);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = ++counterRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const iconMap: Record<ToastType, string> = {
    success: "check_circle",
    error: "error",
    info: "info",
  };

  const bgMap: Record<ToastType, string> = {
    success: "bg-inverse-surface",
    error: "bg-error",
    info: "bg-inverse-surface",
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-lg right-lg z-50 flex flex-col gap-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`${bgMap[toast.type]} text-inverse-on-surface px-lg py-sm rounded-lg shadow-xl text-sm flex items-center gap-sm animate-toast-in pointer-events-auto cursor-pointer`}
            onClick={() => removeToast(toast.id)}
          >
            <span className="material-symbols-outlined text-[20px]">
              {iconMap[toast.type]}
            </span>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
