import { AnimatePresence, motion } from "framer-motion";
import { createContext, useContext, useMemo, useState } from "react";
import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";

const ToastContext = createContext(null);
const icons = { success: CheckCircle2, error: TriangleAlert, info: Info };

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "info") => {
    const id = crypto.randomUUID();
    setToasts((items) => [...items, { id, message, type }]);
    window.setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 3600);
  };

  const value = useMemo(() => ({ showToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-stack">
        <AnimatePresence>
          {toasts.map((toast) => {
            const Icon = icons[toast.type] || Info;
            return (
              <motion.div
                className={`toast toast-${toast.type}`}
                key={toast.id}
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.96 }}
              >
                <Icon size={18} />
                <span>{toast.message}</span>
                <button onClick={() => setToasts((items) => items.filter((item) => item.id !== toast.id))} aria-label="Dismiss toast">
                  <X size={16} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
