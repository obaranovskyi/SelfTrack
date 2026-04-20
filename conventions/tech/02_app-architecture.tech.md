# App Architecture Convention

## Overview

This document defines the folder structure and tooling setup for the PWA application.

**Stack:** TypeScript · React · Vite · vite-plugin-pwa · Workbox · React Router · TanStack Query · Tailwind CSS · shadcn/ui

The application is a Progressive Web App — it is installable on mobile and desktop, works offline, and is served over HTTPS. There is no backend; all data comes from external APIs.

---

## Project structure

```
/
├── public/
│   ├── 404.html               # SPA routing fallback (same trick as any static SPA on GitHub Pages)
│   ├── favicon.ico
│   └── icons/                 # App icons — see 08_icons.tech.md
│       ├── icon-192x192.png
│       ├── icon-512x512.png
│       ├── icon-maskable-192x192.png
│       ├── icon-maskable-512x512.png
│       └── apple-touch-icon.png
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ui/                # shadcn-generated primitives (do not edit manually)
│   │   └── common/            # Shared, reusable components
│   ├── features/
│   │   └── <feature-name>/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── services/
│   │       ├── types.ts
│   │       └── index.ts
│   ├── hooks/
│   ├── lib/                   # Utility functions (cn, etc.)
│   ├── pages/
│   ├── providers/             # QueryProvider, ThemeProvider, etc.
│   ├── router/                # Route definitions
│   ├── service-worker/        # Custom SW logic (if extending the generated SW)
│   ├── types/
│   └── main.tsx
├── .env.example
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

### `vite.config.ts` — PWA plugin setup

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',        // prompt user before updating SW — see 05_service-worker.tech.md
      includeAssets: ['favicon.ico', 'icons/*.png'],
      manifest: false,               // manifest is defined separately in public/manifest.webmanifest
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
    }),
  ],
  base: process.env.VITE_BASE_PATH ?? '/',
});
```

> Setting `manifest: false` keeps the manifest as a separate file under `public/` (see `04_manifest.tech.md`) which is easier to maintain and audit.

### Notes

- **Routing:** Use `createBrowserRouter` from React Router with `basename: import.meta.env.BASE_URL`. The `public/404.html` redirect trick handles deep links on static hosts (GitHub Pages).
- **Styling:** Tailwind CSS with `darkMode: 'class'`. Supports light and dark themes — see `03_styling.tech.md`.
- **No backend, no Docker.** The app is fully client-side.
- **HTTPS is required** for service workers and install prompts to function. See `14_deploy.tech.md`.
