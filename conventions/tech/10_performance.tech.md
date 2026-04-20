# Performance Convention

## Rule

The app must meet **Core Web Vitals** thresholds and be optimised for mobile devices — slower CPUs, variable networks, and limited memory. Lighthouse PWA score must be **100** and performance score must be **≥ 90** on mobile.

---

## When to apply

Apply this convention when:

- Adding new features or dependencies
- Noticing slow load times or janky interactions
- Preparing for a production release

---

## How to apply

### Core Web Vitals targets

| Metric | Target | What it measures |
|---|---|---|
| **LCP** (Largest Contentful Paint) | ≤ 2.5 s | Perceived load speed — when the main content is visible |
| **INP** (Interaction to Next Paint) | ≤ 200 ms | Responsiveness to taps and clicks |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | Visual stability — elements not jumping around |

### Code splitting and lazy loading

Every route must be lazy-loaded so the initial bundle only contains what the user needs on first load:

```typescript
// src/router/index.tsx
import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';

const HomePage = lazy(() => import('../pages/HomePage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Suspense fallback={<PageSkeleton />}><HomePage /></Suspense>,
    },
    {
      path: '/about',
      element: <Suspense fallback={<PageSkeleton />}><AboutPage /></Suspense>,
    },
  ],
  { basename: import.meta.env.BASE_URL }
);
```

Heavy third-party libraries (charts, rich-text editors, date pickers) must also be lazy-loaded if not used on the initial route.

### Images

- Use **WebP** or **AVIF** for all raster images — smaller file sizes with equivalent quality.
- Always provide explicit `width` and `height` attributes to prevent layout shift (CLS).
- Use `loading="lazy"` for below-the-fold images.
- Use `fetchpriority="high"` on the LCP image (the hero or above-the-fold image).

```typescript
// Hero image — load eagerly, high priority
<img src="hero.webp" width={800} height={400} fetchpriority="high" alt="..." />

// Below-fold image — lazy
<img src="photo.webp" width={400} height={300} loading="lazy" alt="..." />
```

### Bundle size

- Run `npm run build -- --report` (or `npx vite-bundle-visualizer`) to inspect the bundle.
- No single chunk should exceed **200 KB gzipped**.
- Avoid importing entire libraries when only one utility is needed (e.g. import `{ format }` from `date-fns`, not `date-fns` entirely).

### Font loading

- Prefer **variable fonts** (one file for all weights).
- Use `font-display: swap` to prevent invisible text during font load.
- Preload the primary font file:

```html
<link rel="preload" href="/fonts/inter-variable.woff2" as="font" type="font/woff2" crossorigin />
```

### Avoid layout shift

- Reserve space for async-loaded content (images, ads, embeds) with fixed dimensions or aspect-ratio containers.
- Do not insert content above existing content after page load.

```typescript
// Correct: aspect-ratio container prevents CLS while image loads
<div className="aspect-video w-full overflow-hidden rounded-lg">
  <img src="..." className="w-full h-full object-cover" loading="lazy" />
</div>
```

### Reduce JavaScript execution time on mobile

- Avoid synchronous work in the main thread (no large loops, JSON parsing of huge payloads on render).
- Debounce scroll and resize handlers.
- Use `useMemo` and `useCallback` for expensive computations — but only when profiling confirms a real bottleneck.

---

## Relation to other conventions

- **`05_service-worker.tech.md`**: Precaching the app shell eliminates network round trips for repeat visits — the biggest single performance improvement for a PWA.
- **`12_testing.tech.md`**: Lighthouse is the authoritative tool for measuring these targets.
- **`07_mobile-ui.tech.md`**: Mobile-first layouts naturally produce leaner CSS; avoid desktop-first overrides that ship unused styles to mobile.
