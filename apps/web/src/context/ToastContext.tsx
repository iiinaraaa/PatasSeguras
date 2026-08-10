import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import Toast from "../components/Toast";

interface ToastContextType {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setMessage(msg);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message && <Toast message={message} onClose={() => setMessage(null)} />}
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- hook fica junto do provider de propósito (padrão comum de contexto+hook)
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast deve ser usado dentro de ToastProvider");
  return ctx;
}
