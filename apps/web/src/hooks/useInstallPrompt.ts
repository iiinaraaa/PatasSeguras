import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export type InstallPlatform = "ios" | "android" | "desktop";

function detectPlatform(): InstallPlatform {
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return "ios";
  if (/Android/.test(ua)) return "android";
  return "desktop";
}

// Hook compartilhado pelo InstallButton (Landing/Dashboard) e pelo item do menu
// hamburguer. O evento beforeinstallprompt só é disparado pelo navegador em
// certas condições (e às vezes nem dispara de novo na mesma sessão depois de
// dispensado) — por isso NUNCA escondemos a opção de instalar por falta dele;
// quando ele não está disponível, caímos no passo a passo manual por plataforma.
export function useInstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [platform, setPlatform] = useState<InstallPlatform>("desktop");

  useEffect(() => {
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
    setPlatform(detectPlatform());

    function handleBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  async function promptInstall(): Promise<"accepted" | "dismissed" | "unavailable"> {
    if (!installEvent) return "unavailable";
    await installEvent.prompt();
    const { outcome } = await installEvent.userChoice;
    if (outcome === "accepted") setInstallEvent(null);
    return outcome;
  }

  return {
    isStandalone,
    platform,
    canPromptNatively: !!installEvent,
    promptInstall,
  };
}
