import { useState } from "react";
import { Download } from "lucide-react";
import { useInstallPrompt } from "../hooks/useInstallPrompt";
import InstallInstructionsModal from "./InstallInstructionsModal";

export default function InstallMenuItem({ onNavigate }: { onNavigate?: () => void }) {
  const { isStandalone, platform, canPromptNatively, promptInstall } = useInstallPrompt();
  const [showModal, setShowModal] = useState(false);

  if (isStandalone) return null;

  async function handleClick() {
    onNavigate?.();
    if (canPromptNatively) {
      const outcome = await promptInstall();
      if (outcome === "unavailable") setShowModal(true);
      return;
    }
    setShowModal(true);
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="flex items-center gap-2.5 px-3 py-3 md:py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 cursor-pointer text-left"
      >
        <Download size={17} />
        Instalar App
      </button>

      {showModal && (
        <InstallInstructionsModal platform={platform} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
