import { X } from "lucide-react";
import type { InstallPlatform } from "../hooks/useInstallPrompt";

const STEPS: Record<InstallPlatform, { title: string; steps: string[] }> = {
  ios: {
    title: "Instalar no iPhone/iPad",
    steps: [
      "Toque no ícone de Compartilhar (□↑) na barra do navegador.",
      'Role a lista e toque em "Adicionar à Tela de Início".',
      'Toque em "Adicionar" no canto superior direito.',
    ],
  },
  android: {
    title: "Instalar no Android",
    steps: [
      "Toque no menu (⋮) no canto superior do navegador.",
      'Toque em "Instalar aplicativo" ou "Adicionar à tela inicial".',
      "Confirme a instalação.",
    ],
  },
  desktop: {
    title: "Instalar no computador",
    steps: [
      "Clique no ícone de instalação (⊕) na barra de endereço do navegador.",
      'Se não aparecer, abra o menu (⋮) e procure por "Instalar Patas Seguras".',
      "Confirme a instalação na janela que aparecer.",
    ],
  },
};

export default function InstallInstructionsModal({
  platform,
  onClose,
}: {
  platform: InstallPlatform;
  onClose: () => void;
}) {
  const { title, steps } = STEPS[platform];

  return (
    <div
      className="fixed inset-0 bg-black/40 z-[70] flex items-center justify-center px-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 max-w-sm w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer w-6 h-6 flex items-center justify-center"
        >
          <X size={18} />
        </button>
        <h2 className="text-lg font-medium mb-4">{title}</h2>
        <ol className="flex flex-col gap-3">
          {steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
              <span className="shrink-0 w-6 h-6 rounded-full bg-brand-50 text-brand-800 text-xs font-medium flex items-center justify-center">
                {i + 1}
              </span>
              <span className="leading-relaxed pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
