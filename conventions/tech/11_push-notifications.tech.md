# Push Notifications Convention

## Rule

Push notifications are opt-in. Permission must only be requested after a user action — never on page load. Notification content must be relevant and actionable. The app must handle the case where permission is denied gracefully.

---

## When to apply

Apply this convention when:

- Adding push notification support to the app
- Designing the permission request UX

---

## How to apply

### Overview

Push notifications in a PWA require three pieces:

1. **Permission** — the user grants notification permission in the browser
2. **Push subscription** — the browser registers with a push service and returns a `PushSubscription`
3. **Push server** — a backend service sends push messages to the push service (out of scope for a static app — requires an external service such as Firebase Cloud Messaging, OneSignal, or a custom server)

> **Static hosting note:** A static GitHub Pages app cannot send push notifications on its own. An external push service (e.g. Firebase Cloud Messaging) is required to trigger notifications server-side. This convention covers the browser-side implementation only.

### Permission request — `src/hooks/usePushNotifications.ts`

```typescript
import { useState } from 'react';

export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  const requestPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) return false;
    const result = await Notification.requestPermission();
    setPermission(result);
    return result === 'granted';
  };

  return { permission, requestPermission, isSupported: 'Notification' in window };
}
```

### When to request permission

- **Trigger on a meaningful user action** — e.g. after the user enables a "Notify me about updates" toggle in settings, not on first page load.
- Show a primer screen explaining *why* notifications are useful before calling `requestPermission`.
- If the user denies, do not ask again. Show a link to browser settings so they can re-enable manually.

```typescript
function NotificationSettings() {
  const { permission, requestPermission } = usePushNotifications();

  if (permission === 'denied') {
    return <p className="text-sm text-muted-foreground">Notifications are blocked. Enable them in your browser settings.</p>;
  }

  if (permission === 'granted') {
    return <p className="text-sm text-green-600">Notifications are enabled.</p>;
  }

  return (
    <button className="min-h-12 ..." onClick={requestPermission}>
      Enable notifications
    </button>
  );
}
```

### VAPID keys (for Web Push Protocol)

If using a self-hosted push server, generate VAPID keys:

```bash
npx web-push generate-vapid-keys
```

Store the **public key** in `.env`:

```
VITE_VAPID_PUBLIC_KEY=<your-public-key>
```

The **private key** must never be committed or exposed to the browser — it stays on the server.

### Subscribing to push — browser side

```typescript
const registration = await navigator.serviceWorker.ready;
const subscription = await registration.pushManager.subscribe({
  userVisibleOnly: true,
  applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
});
// Send `subscription` to your push server to store it
```

### Rules

- Never call `Notification.requestPermission()` without a prior user gesture.
- Always check `'Notification' in window` before using the API — it is not available in all browsers or contexts.
- Never show notifications that are purely promotional — only send actionable, user-requested updates.
- Handle all three permission states: `default`, `granted`, `denied`.

---

## Relation to other conventions

- **`05_service-worker.tech.md`**: The service worker must handle `push` events to display notifications when the app is in the background.
- **`07_mobile-ui.tech.md`**: Permission request UI (buttons, modals) must follow touch target and safe area requirements.
- **`14_deploy.tech.md`**: `VITE_VAPID_PUBLIC_KEY` is a build-time variable — add it to `.env.example` and inject it in the GitHub Actions workflow.
