# Icons Convention

## Rule

The app must provide icons in all required sizes for Android, iOS, and desktop installation. Every icon set must include both a standard (`any`) version and a **maskable** version with a safe zone for adaptive icon shapes on Android.

---

## When to apply

Apply this convention when:

- Setting up the project for the first time
- Changing the app logo or branding
- Adding platform-specific icon support

---

## How to apply

### Required icon files

All icons live in `public/icons/`:

```
public/
├── icons/
│   ├── icon-192x192.png          # Android home screen, manifest any
│   ├── icon-512x512.png          # Android splash, install dialog, manifest any
│   ├── icon-maskable-192x192.png # Android adaptive icon (any shape)
│   ├── icon-maskable-512x512.png # Android adaptive icon, large
│   └── apple-touch-icon.png      # iOS home screen (180x180)
└── favicon.ico                    # Browser tab (multi-size: 16, 32, 48)
```

### Icon specifications

| File | Size | Purpose | Notes |
|---|---|---|---|
| `icon-192x192.png` | 192×192 | Android home screen, Chromebook | Transparent or solid background |
| `icon-512x512.png` | 512×512 | Splash screen, install dialog | Transparent or solid background |
| `icon-maskable-192x192.png` | 192×192 | Android adaptive icon | Must have safe zone — see below |
| `icon-maskable-512x512.png` | 512×512 | Android adaptive icon, large | Must have safe zone — see below |
| `apple-touch-icon.png` | 180×180 | iOS/iPadOS home screen | Must have solid background, no transparency |
| `favicon.ico` | 16/32/48 combined | Browser tab | Use a multi-size `.ico` file |

### Maskable icon safe zone

Android clips maskable icons into various shapes (circle, squircle, etc.). The **safe zone** is a circle with diameter = **80% of the icon size** centred in the canvas. All meaningful content (logo, text) must be within this circle; the background can bleed to the edges.

```
512x512 maskable icon
┌────────────────────────────────┐  512px
│                                │
│      ┌──────────────────┐      │
│      │   safe zone      │      │  410px (80% of 512)
│      │   (logo here)    │      │
│      └──────────────────┘      │
│                                │
└────────────────────────────────┘
```

Use [maskable.app/editor](https://maskable.app/editor) to preview how your icon looks in different Android shapes.

### `index.html` — link icons

```html
<!-- Favicon -->
<link rel="icon" href="/favicon.ico" sizes="any" />
<link rel="icon" href="/icons/icon-192x192.png" type="image/png" />

<!-- iOS home screen -->
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />

<!-- Manifest (contains Android icons) -->
<link rel="manifest" href="/manifest.webmanifest" />
```

### `manifest.webmanifest` — icons array

```json
"icons": [
  { "src": "/icons/icon-192x192.png",          "sizes": "192x192", "type": "image/png", "purpose": "any" },
  { "src": "/icons/icon-512x512.png",          "sizes": "512x512", "type": "image/png", "purpose": "any" },
  { "src": "/icons/icon-maskable-192x192.png", "sizes": "192x192", "type": "image/png", "purpose": "maskable" },
  { "src": "/icons/icon-maskable-512x512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
]
```

### Generating icons

Use a tool such as [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator) to produce all required sizes from a single source SVG:

```bash
npx pwa-asset-generator logo.svg public/icons --manifest public/manifest.webmanifest --index index.html
```

### Rules

- Never use the same image for both `any` and `maskable` — they have different composition requirements.
- The `apple-touch-icon` must have a **solid background** (no transparency) — iOS renders transparency as black.
- Icon filenames must not include query strings or hashes — they are referenced directly in the manifest and `index.html`.

---

## Relation to other conventions

- **`04_manifest.tech.md`**: The icon paths used here must match those listed in `manifest.webmanifest`.
- **`07_mobile-ui.tech.md`**: The `background_color` in the manifest and the splash screen background must match so there is no colour flash during app launch.
