# Testing Convention

## Rule

The project must have automated unit and component tests via **Vitest** and **Testing Library**, and pass all PWA criteria verified via **Lighthouse**. The Lighthouse PWA score must be **100** and the performance score must be **≥ 90** on mobile before any production release.

---

## When to apply

Apply this convention when:

- Adding a new component, hook, or utility
- Fixing a bug (add a regression test)
- Preparing a production release (run Lighthouse)

---

## How to apply

### Unit and component tests — Vitest + Testing Library

#### Test structure

Tests are co-located in `__tests__/` directories next to the source they cover:

```
src/
├── hooks/
│   ├── useNetworkStatus.ts
│   └── __tests__/
│       └── useNetworkStatus.test.ts
├── components/common/
│   ├── OfflineBanner.tsx
│   └── __tests__/
│       └── OfflineBanner.test.tsx
```

#### Dependencies

```
vitest
@testing-library/react
@testing-library/jest-dom
@testing-library/user-event
jsdom
```

#### `vite.config.ts`

```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
```

#### `src/test/setup.ts`

```typescript
import '@testing-library/jest-dom';
```

#### Mocking PWA APIs

Service worker APIs and browser install APIs are not available in jsdom. Mock them per test:

```typescript
// Mock navigator.onLine
Object.defineProperty(navigator, 'onLine', { value: false, writable: true });

// Mock beforeinstallprompt
const mockPromptEvent = { preventDefault: vi.fn(), prompt: vi.fn().mockResolvedValue(undefined), userChoice: Promise.resolve({ outcome: 'accepted' }) };
window.dispatchEvent(Object.assign(new Event('beforeinstallprompt'), mockPromptEvent));
```

#### Running tests

```bash
npm run test        # watch mode
npm run test:run    # single run (CI)
```

---

### Lighthouse audit

Lighthouse is the authoritative tool for validating PWA installation criteria, performance, and accessibility.

#### Run Lighthouse

```bash
# Against the production deployment
npx lighthouse https://<your-github-pages-url> --output html --output-path report.html --preset mobile

# Against a local production build (requires HTTPS — use mkcert or the --ignore-certificate-errors flag for local)
npm run build && npm run preview
npx lighthouse http://localhost:4173 --output html --output-path report.html
```

#### Required scores before release

| Category | Minimum score |
|---|---|
| **PWA** | 100 |
| **Performance** | ≥ 90 (mobile) |
| **Accessibility** | ≥ 90 |
| **Best Practices** | ≥ 90 |

#### PWA checklist items (must all pass)

- App can be installed (manifest + SW + HTTPS)
- `start_url` responds with 200 when offline
- Service worker controls page on load
- Manifest has `name`, `short_name`, icons (192 and 512), `start_url`, `display`
- `<meta name="theme-color">` is set
- `<meta name="viewport">` is set with `width` or `initial-scale`
- Page does not use deprecated APIs

---

## Relation to other conventions

- **`04_manifest.tech.md`**: Lighthouse validates manifest completeness.
- **`05_service-worker.tech.md`**: Lighthouse validates SW registration and offline behaviour.
- **`10_performance.tech.md`**: Lighthouse performance score validates Core Web Vitals targets.
- **`08_icons.tech.md`**: Lighthouse checks for the presence of a 512×512 icon.
