# Deploy Convention

## Rule

The app is deployed to **GitHub Pages** via GitHub Actions. Deployment triggers on every push to `main`. **HTTPS is mandatory** — service workers and install prompts only function on secure origins (`https://` or `localhost`). GitHub Pages provides HTTPS automatically.

---

## When to apply

Apply this convention when:

- Setting up the project for the first time
- Changing the repository name (requires updating `start_url`, `scope`, and `VITE_BASE_PATH`)
- Modifying the deployment workflow

---

## How to apply

### GitHub Pages settings

Set the GitHub Pages source to **GitHub Actions** in the repository settings (not the `gh-pages` branch).

### GitHub Actions workflow — `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          VITE_BASE_PATH: /${{ github.event.repository.name }}

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Manifest `start_url` and `scope` for project pages

When deployed to a GitHub Pages project page (`https://<user>.github.io/<repo>`), the manifest `start_url` and `scope` must include the base path — otherwise the installed app will fail to load.

Use a build-time script or maintain a separate manifest template that injects `VITE_BASE_PATH`:

**Option A — static manifest with hardcoded base path** (simple, update manually when renaming the repo):

```json
{
  "start_url": "/my-repo/",
  "scope": "/my-repo/"
}
```

**Option B — generate the manifest at build time** using a Vite plugin or a `prebuild` script that replaces a placeholder:

```json
{
  "start_url": "__BASE_PATH__/",
  "scope": "__BASE_PATH__/"
}
```

```bash
# package.json
"prebuild": "sed -i 's|__BASE_PATH__|'$VITE_BASE_PATH'|g' public/manifest.webmanifest"
```

### Service worker scope

The generated service worker inherits its scope from the `base` in `vite.config.ts`. No additional configuration is needed — `vite-plugin-pwa` handles this automatically when `base` is set.

### HTTPS requirement summary

| Environment | HTTPS | Service worker works | Install prompt works |
|---|---|---|---|
| GitHub Pages | Yes (automatic) | Yes | Yes |
| `localhost` (dev) | No (exception) | Yes | No |
| Custom domain (HTTP) | No | No | No |

Custom domains on GitHub Pages support HTTPS — enable it in the repository Pages settings.

### Rules

- Never deploy to a plain HTTP custom domain — service workers will not register and the app cannot be installed.
- Never commit the `dist/` folder — the workflow builds and deploys it automatically.
- After renaming the repository, update `start_url` and `scope` in `manifest.webmanifest` before the next deployment.

---

## Relation to other conventions

- **`04_manifest.tech.md`**: `start_url` and `scope` must match the deployment base path.
- **`05_service-worker.tech.md`**: The SW only registers on HTTPS (plus `localhost`).
- **`02_app-architecture.tech.md`**: `VITE_BASE_PATH` is consumed by `vite.config.ts` for the Vite `base` setting.
