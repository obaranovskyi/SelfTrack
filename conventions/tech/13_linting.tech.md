# Linting & Formatting Convention

## Rule

The project must enforce consistent code style via ESLint and Prettier. These tools must be configured at the project root and runnable with a single command.

---

## When to apply

Apply this convention when:

- Setting up the project for the first time
- Adding new tooling config files
- Resolving linting or formatting errors in CI

---

## How to apply

### Tools

| Tool | Purpose |
|---|---|
| **ESLint** | Linting (TypeScript, React rules) |
| **Prettier** | Code formatting |

### `.eslintrc.json`

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ]
}
```

### `.prettierrc`

```json
{
  "semi": true,
  "singleQuote": false,
  "printWidth": 100,
  "trailingComma": "es5"
}
```

### `package.json` scripts

```json
{
  "scripts": {
    "lint": "eslint src --ext .ts,.tsx",
    "format": "prettier --write src",
    "format:check": "prettier --check src"
  }
}
```

### Commands

```bash
npm run lint            # lint
npm run format          # format
npm run format:check    # format check (CI)
```

---

## Relation to other conventions

- **`02_app-architecture.tech.md`**: ESLint and Prettier configs belong at the project root alongside `package.json`.
