# Web App Manifest Convention

## Rule

Every PWA must have a `manifest.webmanifest` file in `public/`. The manifest defines how the app appears when installed on a device — its name, icons, colours, display mode, and orientation. All required fields must be present for the app to pass the browser's installability criteria.

---

## When to apply

Apply this convention when:

- Setting up the project for the first time
- Changing the app name, colours, or branding
- Adding or updating app icons

---

## How to apply

### File location

```
public/
└── manifest.webmanifest
```

### `public/manifest.webmanifest`

```json
{
  "name": "My App",
  "short_name": "App",
  "description": "A short description of what the app does.",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "background_color": "#ffffff",
  "theme_color": "#0f172a",
  "lang": "en",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-maskable-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "/icons/icon-maskable-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/mobile.png",
      "sizes": "390x844",
      "type": "image/png",
      "form_factor": "narrow",
      "label": "Home screen"
    },
    {
      "src": "/screenshots/desktop.png",
      "sizes": "1280x800",
      "type": "image/png",
      "form_factor": "wide",
      "label": "Home screen"
    }
  ]
}
```

### `index.html` — link the manifest

```html
<link rel="manifest" href="/manifest.webmanifest" />
<!-- Two theme-color tags so the browser picks the right toolbar colour before JS runs -->
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
<meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="apple-mobile-web-app-title" content="App" />
```

> iOS Safari does not read the manifest for installation — the `apple-mobile-web-app-*` meta tags are required for a correct home screen experience on iPhones.

> Use two `<meta name="theme-color">` tags with `media` queries instead of a single one — this lets the browser apply the correct toolbar colour on cold launch before `ThemeProvider` runs. See `03_styling.tech.md` for how `ThemeProvider` keeps these tags in sync at runtime.

### Key field rules

| Field | Rule |
|---|---|
| `display` | Use `standalone` — hides the browser chrome for an app-like feel |
| `start_url` | Must be `/` or the specific page the user should land on after install |
| `scope` | Must match or be a parent of `start_url` |
| `short_name` | Max 12 characters — used on home screen labels |
| `background_color` | Must match the splash screen background to avoid a flash on launch |
| `theme_color` | Sets the browser toolbar colour on Android Chrome; keep in sync with the `<meta name="theme-color">` tag |
| `orientation` | Use `portrait-primary` unless the app is inherently landscape (e.g. a game) |
| `screenshots` | Required by Chrome for the enhanced install dialog (richer install UI) |
| `icons` | Must include both `any` and `maskable` at 192 and 512 sizes — see `08_icons.tech.md` |

### Updating `start_url` for GitHub Pages

If deployed to a GitHub Pages project page (`/<repo-name>/`), `start_url` and `scope` must include the base path:

```json
{
  "start_url": "/my-repo/",
  "scope": "/my-repo/"
}
```

Inject this dynamically in CI or maintain a separate manifest template — see `14_deploy.tech.md`.

---

## Relation to other conventions

- **`08_icons.tech.md`**: Icon paths referenced in the manifest must match the sizes and formats defined there.
- **`14_deploy.tech.md`**: `start_url` and `scope` must be updated to include the base path when deploying to a GitHub Pages project page.
- **`07_mobile-ui.tech.md`**: `theme_color` and `background_color` must match the app's visual design.
- **`03_styling.tech.md`**: The `theme_color` values in the manifest and the `<meta name="theme-color">` tags must match the light/dark colour tokens defined there.

---

## Examples

### Installability checklist (Chrome DevTools → Application → Manifest)

- `name` present
- `icons` with at least one 192×192 `any` icon and one 512×512 icon
- `start_url` set
- `display` is `standalone`, `fullscreen`, or `minimal-ui`
- Served over HTTPS
- Service worker registered with a `fetch` handler
