# Install Prompt Convention

## Rule

The app must surface a custom install prompt so users can add it to their home screen. The browser's default mini-infobar must be suppressed in favour of an in-app install button or banner that fits the app's design. The prompt must only be shown when the app is not already installed and the browser supports installation.

---

## When to apply

Apply this convention when:

- Setting up the project for the first time
- Designing the install UX

---

## How to apply

### How browser install works

1. Browser fires `beforeinstallprompt` when installation criteria are met (HTTPS, manifest, SW with `fetch` handler).
2. Call `event.preventDefault()` to suppress the default mini-infobar.
3. Store the event; show your custom install UI.
4. On user confirmation, call `event.prompt()`.
5. Listen to `appinstalled` to hide the install UI after installation.

### `src/hooks/useInstallPrompt.ts`

```typescript
import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function useInstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Already running in standalone mode — already installed
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true;
    if (standalone) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setPromptEvent(e as BeforeInstallPromptEvent);
    };
    const installedHandler = () => setIsInstalled(true);

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', installedHandler);
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const install = async () => {
    if (!promptEvent) return;
    await promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    if (outcome === 'accepted') setIsInstalled(true);
    setPromptEvent(null);
  };

  const canInstall = !isInstalled && promptEvent !== null;
  return { canInstall, install };
}
```

### `src/components/common/InstallBanner.tsx`

Show a dismissible install banner (e.g. fixed at the bottom of the screen):

```typescript
import { useState } from 'react';
import { useInstallPrompt } from '../../hooks/useInstallPrompt';

export function InstallBanner() {
  const { canInstall, install } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(false);

  if (!canInstall || dismissed) return null;

  return (
    <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+1rem)] left-4 right-4 md:left-auto md:w-80 bg-background border rounded-xl shadow-lg p-4 flex items-center justify-between gap-4 z-40">
      <div>
        <p className="text-sm font-medium">Install App</p>
        <p className="text-xs text-muted-foreground">Add to your home screen for the best experience.</p>
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          className="text-xs text-muted-foreground min-h-12 px-3"
          onClick={() => setDismissed(true)}
        >
          Not now
        </button>
        <button
          className="text-xs font-medium text-primary min-h-12 px-3"
          onClick={install}
        >
          Install
        </button>
      </div>
    </div>
  );
}
```

### iOS — no `beforeinstallprompt`

iOS Safari does not fire `beforeinstallprompt`. Show a static tooltip explaining the manual install steps when the user is on iOS Safari and not yet in standalone mode:

```typescript
const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
const isInStandaloneMode = (navigator as any).standalone === true;
const showIosHint = isIos && !isInStandaloneMode;
```

iOS install instructions to surface in the UI:
1. Tap the **Share** button ( ) in Safari
2. Tap **Add to Home Screen**

### Rules

- Never call `event.prompt()` without a user gesture (button tap) — browsers will ignore it.
- Hide all install UI once `appinstalled` fires or when the app is already running in `standalone` mode.
- The install banner must respect safe area insets (position above the home indicator on iPhone).
- Touch targets in the install banner must be at least 48px — see `07_mobile-ui.tech.md`.

---

## Relation to other conventions

- **`04_manifest.tech.md`**: A valid manifest is required before the browser fires `beforeinstallprompt`.
- **`05_service-worker.tech.md`**: A registered SW with a `fetch` handler is required for installability.
- **`07_mobile-ui.tech.md`**: The install banner must use safe area insets and meet touch target requirements.

---

## Examples

### Correct: prompt triggered on button tap

```typescript
<button onClick={install}>Install App</button>
```

### Incorrect: prompt triggered on page load without user gesture

```typescript
useEffect(() => { promptEvent?.prompt(); }, [promptEvent]);  // ignored by browser
```
