# PWA Project

A Progressive Web App built with React and Vite — installable on mobile and desktop, works offline, and deployed to GitHub Pages via GitHub Actions.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                              │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTPS
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              GitHub Pages (static hosting)                  │
│                                                             │
│   Vite-built bundle                                         │
│   React SPA  ──►  React Router (BrowserRouter)              │
│   Service Worker (Workbox)  ──►  Cache + Offline support    │
│   Web App Manifest  ──►  Home screen installation           │
└─────────────────────────┬───────────────────────────────────┘
                          │ fetch (when online)
                          ▼
┌─────────────────────────────────────────────────────────────┐
│               External API(s)  (optional)                   │
│                                                             │
│   TanStack Query — caching, loading states, offline-aware   │
└─────────────────────────────────────────────────────────────┘
```

## Stack

| Layer | Technology |
|---|---|
| UI | TypeScript · React · React Router |
| PWA | vite-plugin-pwa · Workbox |
| Styling | Tailwind CSS · shadcn/ui |
| Data fetching | TanStack Query |
| Build | Vite |
| Testing | Vitest · Testing Library · Lighthouse |
| Linting | ESLint · Prettier |
| Deployment | GitHub Actions → GitHub Pages |

## Key PWA capabilities

| Capability | Implementation |
|---|---|
| **Installable** | Web App Manifest + Service Worker + HTTPS |
| **Offline support** | Workbox precaching + runtime NetworkFirst caching |
| **Install prompt** | Custom `beforeinstallprompt` handler + iOS manual hint |
| **Update notification** | `registerType: 'prompt'` — user confirms before SW swap |
| **Safe area support** | `viewport-fit=cover` + `env(safe-area-inset-*)` |
| **Push notifications** | Web Push Protocol via external push service |

## Running the project

**Development** (no service worker):
```bash
npm install && npm run dev
```

**Test PWA features** (service worker + install prompt active):
```bash
npm run build && npm run preview
```

Deployment to GitHub Pages happens automatically on every push to `main`.

## Project structure

```
/
├── .github/workflows/deploy.yml
├── public/
│   ├── 404.html                  # SPA routing fallback
│   ├── manifest.webmanifest      # Web App Manifest
│   └── icons/                    # App icons (all sizes)
├── src/
│   ├── components/               # UI primitives and shared components
│   ├── features/                 # Feature-based modules
│   ├── hooks/                    # useNetworkStatus, useInstallPrompt, etc.
│   ├── pages/                    # Page-level route components
│   ├── providers/                # QueryProvider, ThemeProvider
│   ├── router/                   # Centralised route definitions
│   └── main.tsx
├── vite.config.ts
└── README.md
```
