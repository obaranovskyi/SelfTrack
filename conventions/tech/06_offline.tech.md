# Offline UX Convention

## Rule

The app must communicate its network state and update availability clearly to the user. When offline, cached content must still be shown. When a new service worker version is available, the user must be prompted — never silently updated.

---

## When to apply

Apply this convention when:

- Setting up the project for the first time
- Adding new features that have offline implications
- Implementing the update notification UI

---

## How to apply

### Network state — `src/hooks/useNetworkStatus.ts`

```typescript
import { useEffect, useState } from 'react';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  return isOnline;
}
```

### Offline banner — `src/components/common/OfflineBanner.tsx`

Show a non-intrusive banner at the top of the screen when the device has no connection:

```typescript
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

export function OfflineBanner() {
  const isOnline = useNetworkStatus();
  if (isOnline) return null;
  return (
    <div className="w-full bg-yellow-500 text-yellow-950 text-sm text-center py-2 px-4">
      You are offline. Some content may be unavailable.
    </div>
  );
}
```

Place `<OfflineBanner />` at the top of the app shell layout so it appears on every page.

### Update prompt — `src/components/common/UpdatePrompt.tsx`

When the service worker has a new version ready, show a dismissible toast or banner:

```typescript
import { useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

export function UpdatePrompt() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [updateSW] = useState(() =>
    registerSW({
      onNeedRefresh: () => setNeedRefresh(true),
    })
  );

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:w-80 bg-background border rounded-lg shadow-lg p-4 flex items-center justify-between gap-4 z-50">
      <p className="text-sm">A new version is available.</p>
      <div className="flex gap-2 shrink-0">
        <button
          className="text-sm text-muted-foreground"
          onClick={() => setNeedRefresh(false)}
        >
          Later
        </button>
        <button
          className="text-sm font-medium text-primary"
          onClick={() => updateSW(true)}
        >
          Update
        </button>
      </div>
    </div>
  );
}
```

Place `<UpdatePrompt />` in the app root, outside any route, so it appears on every page.

### Offline fallback page

For pages that are not cached (e.g. dynamically generated content), the service worker's fallback must render a helpful offline page rather than a browser error.

Configure in `vite.config.ts`:

```typescript
VitePWA({
  workbox: {
    navigateFallback: '/index.html',   // SPA fallback — React Router handles the 404 route
  }
})
```

The `NotFoundPage` or a dedicated `OfflinePage` component must explain that the content is unavailable offline and provide a link back to cached content.

### Rules

- Never let the app silently go blank or show a browser error when offline — always show something meaningful.
- The offline banner must be visible but not block content interaction.
- The update prompt must offer a way to dismiss it — never force an immediate reload.
- Do not use `registerType: 'autoUpdate'` — see `05_service-worker.tech.md`.

---

## Relation to other conventions

- **`05_service-worker.tech.md`**: The `onNeedRefresh` and `onOfflineReady` callbacks are defined there; this convention defines the UI that responds to them.
- **`07_mobile-ui.tech.md`**: The offline banner and update prompt must respect safe area insets and not overlap with system UI on mobile.

---

## Examples

### Correct: offline banner visible, content still rendered from cache

The user loses connection mid-session. The yellow banner appears at the top; cached pages continue to work normally.

### Incorrect: blank screen when offline

The app renders nothing because the data fetch failed and no loading/error state was handled for the offline case.
