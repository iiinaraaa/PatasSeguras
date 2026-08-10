import { useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";

export interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed top-5 left-5 right-5 sm:left-auto z-[60] flex items-center gap-3 bg-white border border-gray-200 rounded-2xl shadow-lg px-4 py-3 sm:max-w-sm">
      <CheckCircle2 size={20} className="text-brand-600 shrink-0" />
      <p className="text-sm font-medium flex-1">{message}</p>
      <button
        onClick={onClose}
        aria-label="Fechar"
        className="text-gray-400 hover:text-gray-600 cursor-pointer shrink-0 w-6 h-6 flex items-center justify-center"
      >
        <X size={16} />
      </button>
    </div>
  );
}
