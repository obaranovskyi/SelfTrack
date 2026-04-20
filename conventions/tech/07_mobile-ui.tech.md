# Mobile UI Convention

## Rule

The app is designed **mobile-first**. All layouts, touch targets, typography, and spacing must work correctly on small screens before being adapted for larger ones. Safe area insets, viewport configuration, and gesture handling must be correct so the app looks and feels native when installed.

---

## When to apply

Apply this convention when:

- Building any UI component
- Setting up the project for the first time
- Adding gestures or touch interactions

---

## How to apply

### Viewport — `index.html`

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, viewport-fit=cover"
/>
```

- `width=device-width` — layout at the device's logical width
- `initial-scale=1.0` — no zoom on load
- `viewport-fit=cover` — extend layout into the notch/dynamic island area (required for safe area support)
- **Never add `user-scalable=no` or `maximum-scale=1`** — they break accessibility for users who need to zoom

### Safe area insets

On notched devices (iPhone X and later, Android with cutouts), system UI can overlap app content. Use CSS environment variables to add padding:

```css
/* src/index.css */
:root {
  --sat: env(safe-area-inset-top);
  --sar: env(safe-area-inset-right);
  --sab: env(safe-area-inset-bottom);
  --sal: env(safe-area-inset-left);
}
```

Apply to the app shell:

```typescript
// App shell layout — outer wrapper
<div className="min-h-svh flex flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
  ...
</div>
```

Key areas that must account for safe areas:
- Fixed headers and navigation bars (`top` + inset-top)
- Bottom navigation / tab bars (`bottom` + inset-bottom)
- Full-screen modals and sheets
- Floating action buttons

### Touch targets

Every interactive element must be large enough to tap reliably:

| Guideline | Minimum size |
|---|---|
| Apple HIG | 44 × 44 pt |
| Material Design | 48 × 48 dp |
| **This project** | **48 × 48 px** (use the larger value for cross-platform safety) |

```typescript
// Correct — explicit minimum touch target
<button className="min-h-12 min-w-12 flex items-center justify-center px-4">
  Tap me
</button>
```

Avoid touch targets smaller than 48px even if the visible label is smaller — use padding to expand the hit area.

### Typography

- Body text minimum: **16px** — prevents iOS Safari from auto-zooming on form focus
- Line height: at least `1.5` for readability on small screens
- Avoid fixed pixel widths on text containers — use `max-w-*` and let text reflow

```typescript
// Correct: text scales naturally
<p className="text-base leading-relaxed max-w-prose">...</p>
```

### Form inputs — prevent iOS zoom

iOS Safari zooms the page when a focused `<input>` has a font size smaller than 16px. Always set:

```typescript
<input className="text-base ..." />  // text-base = 16px in Tailwind
```

Or globally in `src/index.css`:

```css
input, select, textarea {
  font-size: 16px;
}
```

### Mobile-first Tailwind breakpoints

Write base styles for mobile, then override for larger screens:

```typescript
// Correct: mobile-first
<div className="flex flex-col gap-4 p-4 md:flex-row md:gap-8 md:p-8">

// Incorrect: desktop-first (requires overrides to undo)
<div className="flex flex-row gap-8 p-8 sm:flex-col sm:gap-4 sm:p-4">
```

### Gestures

- Use `touch-action: manipulation` on buttons and links to remove the 300ms tap delay on older browsers
- Use `touch-action: pan-y` on horizontally scrollable containers to allow vertical scrolling while enabling horizontal swipe

```typescript
<button className="touch-manipulation ...">Tap me</button>
<div className="overflow-x-auto [touch-action:pan-y]">...</div>
```

### Standalone mode detection

When installed, the app runs in `standalone` display mode. Adjust UI accordingly (e.g. hide a "download the app" banner):

```typescript
const isStandalone = window.matchMedia('(display-mode: standalone)').matches
  || (navigator as any).standalone === true;  // iOS Safari
```

---

## Relation to other conventions

- **`04_manifest.tech.md`**: `display: standalone` in the manifest triggers standalone mode; this convention handles the UI adjustments that follow.
- **`06_offline.tech.md`**: The offline banner and update prompt must respect safe area insets.
- **`08_icons.tech.md`**: Icons and splash screens must match the `background_color` defined in the manifest to avoid a flash on launch.
- **`10_performance.tech.md`**: Mobile-first means optimising for slower CPUs and networks — performance conventions complement the layout rules here.

---

## Examples

### Correct: bottom nav with safe area

```typescript
<nav className="fixed bottom-0 left-0 right-0 pb-[env(safe-area-inset-bottom)] bg-background border-t flex justify-around">
  ...
</nav>
```

### Incorrect: bottom nav cut off by home indicator on iPhone

```typescript
<nav className="fixed bottom-0 left-0 right-0 bg-background border-t flex justify-around">
  // No safe area padding — home indicator overlaps last item
</nav>
```
