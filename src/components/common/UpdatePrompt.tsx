import { useState } from "react";
import { registerSW } from "virtual:pwa-register";

export function UpdatePrompt() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [updateSW] = useState(() =>
    registerSW({
      onNeedRefresh: () => setNeedRefresh(true),
    })
  );

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:w-80 bg-card border border-border rounded-lg shadow-lg p-4 flex items-center justify-between gap-4 z-50">
      <p className="text-sm text-foreground">A new version is available.</p>
      <div className="flex gap-3 shrink-0">
        <button
          className="text-sm text-muted-foreground min-h-12 px-3 touch-manipulation"
          onClick={() => setNeedRefresh(false)}
        >
          Later
        </button>
        <button
          className="text-sm font-medium text-primary min-h-12 px-3 touch-manipulation"
          onClick={() => updateSW(true)}
        >
          Update
        </button>
      </div>
    </div>
  );
}
