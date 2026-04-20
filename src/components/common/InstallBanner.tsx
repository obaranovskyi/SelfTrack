import { useState } from "react";
import { useInstallPrompt } from "../../hooks/useInstallPrompt";

export function InstallBanner() {
  const { canInstall, install } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(false);

  if (!canInstall || dismissed) return null;

  return (
    <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+1rem)] left-4 right-4 md:left-auto md:w-80 bg-card border border-border rounded-xl shadow-lg p-4 flex items-center justify-between gap-4 z-40">
      <div>
        <p className="text-sm font-medium text-foreground">Install SelfTrack</p>
        <p className="text-xs text-muted-foreground">Add to your home screen for the best experience.</p>
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          className="text-xs text-muted-foreground min-h-12 px-3 touch-manipulation"
          onClick={() => setDismissed(true)}
        >
          Not now
        </button>
        <button
          className="text-xs font-medium text-primary min-h-12 px-3 touch-manipulation"
          onClick={install}
        >
          Install
        </button>
      </div>
    </div>
  );
}
