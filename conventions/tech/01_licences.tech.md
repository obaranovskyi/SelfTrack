# Licences Convention

## Rule

Only libraries, frameworks, and tools with permissive open-source licences may be used in this project. All dependencies must be free to use in commercial projects without requiring payment, royalties, or open-sourcing of proprietary code.

---

## When to apply

Apply this convention when:

- Adding a new dependency to `package.json`
- Evaluating a third-party library or tool
- Reviewing existing dependencies

---

## How to apply

### Permitted licences

| Licence | Requires attribution | Requires sharing changes |
|---|---|---|
| **MIT** | Yes (in distribution) | No |
| **BSD 2-Clause / 3-Clause** | Yes (in distribution) | No |
| **Apache 2.0** | Yes (in distribution) | No |
| **ISC** | Yes (in distribution) | No |

### Prohibited licences

| Licence | Reason |
|---|---|
| **GPL / LGPL / AGPL** | Requires open-sourcing code that links to or uses the library |
| **SSPL** | Requires open-sourcing the entire service stack |
| **Commons Clause** | Restricts commercial sale |
| **Proprietary / commercial** | Requires payment or a commercial licence agreement |

### How to check a licence

```bash
npm info <package-name> license
npx license-checker --summary
```

---

## Relation to other conventions

- **`02_app-architecture.tech.md`**: All npm dependencies in `package.json` must comply with this convention.

---

## Examples

### Approved

| Package | Licence |
|---|---|
| `react` | MIT |
| `vite-plugin-pwa` | MIT |
| `workbox-window` | MIT |
| `tailwindcss` | MIT |
