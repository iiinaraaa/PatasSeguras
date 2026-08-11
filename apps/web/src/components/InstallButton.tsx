import { useEffect, useState } from "react";
import { Download, Share, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isIOSDevice() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

export default function InstallButton({ className = "" }: { className?: string }) {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
    setIsIOS(isIOSDevice());

    function handleBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  if (isStandalone) return null;
  if (!isIOS && !installEvent) return null;

  async function handleClick() {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }
    if (!installEvent) return;
    await installEvent.prompt();
    const { outcome } = await installEvent.userChoice;
    if (outcome === "accepted") {
      setInstallEvent(null);
    }
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={`flex items-center justify-center gap-2 px-5 h-11 rounded-full font-medium bg-brand-600 text-white hover:bg-brand-800 transition cursor-pointer ${className}`}
      >
        <Download size={16} />
        Instalar app
      </button>

      {showIOSModal && (
        <div
          className="fixed inset-0 bg-black/40 z-[70] flex items-center justify-center px-6"
          onClick={() => setShowIOSModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-sm w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowIOSModal(false)}
              aria-label="Fechar"
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer w-6 h-6 flex items-center justify-center"
            >
              <X size={18} />
            </button>
            <h2 className="text-lg font-medium mb-3">Instalar o app</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Toque no ícone de Compartilhar (<Share size={14} className="inline -mt-0.5" />) na
              barra do navegador, depois em <strong>"Adicionar à Tela de Início"</strong>.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
