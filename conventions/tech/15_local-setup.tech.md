# Local Setup Convention

## Rule

The project must include a `README.md` at its root with clear instructions for running the project locally. The instructions must cover both the standard dev server and the production build preview (needed to test service worker and install prompt behaviour).

---

## When to apply

Apply this convention when:

- Creating a new project
- Changing environment variable requirements or startup commands
- Any existing `README.md` no longer reflects the actual setup process

---

## How to apply

The `README.md` must include a **Local Development** section covering:

1. **Prerequisites** — Node.js version, npm version
2. **Environment setup** — `.env` from `.env.example`
3. **Install dependencies**
4. **Start the dev server** — standard hot-reload dev mode
5. **Test PWA features** — production build preview (service worker, install prompt, offline)
6. **Useful commands** — tests, lint, build, Lighthouse

### Important: service workers in development

The service worker and install prompt **do not work in Vite's dev server** (`npm run dev`) because it runs over HTTP and does not serve the generated SW. To test PWA-specific features locally, always use the production build preview:

```bash
npm run build && npm run preview
```

The preview server runs at `http://localhost:4173`. The browser treats `localhost` as a secure origin, so the service worker registers and the install prompt appears.

---

## Relation to other conventions

- **`04_env-variables.tech.md`**: Setup must reference `.env.example`.
- **`05_service-worker.tech.md`**: SW only registers in the production build preview, not in the dev server.
- **`12_testing.tech.md`**: Lighthouse is run against the production build preview or the deployed URL.
- **`14_deploy.tech.md`**: Local setup and GitHub Pages deployment are separate — do not mix them.

---

## Examples

### Minimal `README.md` Local Development section

```markdown
## Local Development

### Prerequisites

- Node.js >= 20
- npm >= 10

### Environment setup

\`\`\`bash
cp .env.example .env
\`\`\`

### Install dependencies

\`\`\`bash
npm install
\`\`\`

### Start the dev server

\`\`\`bash
npm run dev
\`\`\`

The app is available at http://localhost:5173.

> **Note:** The service worker and install prompt are not active in dev mode.
> To test PWA features (offline support, install prompt, SW caching), use the production preview:

\`\`\`bash
npm run build && npm run preview
\`\`\`

### Useful commands

| Command | Description |
|---------|-------------|
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once (CI) |
| `npm run lint` | Lint source files |
| `npm run build` | Production build |
| `npx lighthouse http://localhost:4173` | Run Lighthouse audit against local preview |
```
