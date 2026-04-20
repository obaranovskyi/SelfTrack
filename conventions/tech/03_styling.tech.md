# Styling Convention

## Rule

**Tailwind CSS** is the primary styling framework. **shadcn/ui** provides the base component primitives. The application must support both **light** and **dark** themes via CSS variables and Tailwind's `dark:` variant. As a PWA, the `<meta name="theme-color">` tag must also respond to the active theme.

---

## When to apply

Apply this convention when:

- Adding or modifying any UI component
- Setting up the project for the first time
- Adding a new shadcn/ui component
- Updating the app colour scheme or branding

---

## How to apply

### Tailwind CSS

All styling must use Tailwind utility classes. Avoid writing custom CSS except for:
- CSS variables used by shadcn/ui (defined in `src/index.css`)
- Keyframe animations that cannot be expressed with Tailwind utilities

#### `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',           // toggle dark mode via a class on <html>
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // shadcn/ui semantic tokens — keep in sync with src/index.css
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        // ... other shadcn tokens
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
```

### shadcn/ui

shadcn/ui components are generated into `src/components/ui/`. **Do not edit these files manually** — they are owned by the shadcn CLI. Customise behaviour via composition in `src/components/common/` or within the relevant feature folder.

Add a new component:

```bash
npx shadcn-ui@latest add <component-name>
```

### Dark / light theme

Theme switching is controlled by toggling the `dark` class on the `<html>` element. The current preference must be persisted in `localStorage` and respected on initial load to avoid a flash of incorrect theme.

#### `src/providers/ThemeProvider.tsx`

```typescript
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
}>({ theme: 'system', setTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem('theme') as Theme) ?? 'system'
  );

  useEffect(() => {
    const root = document.documentElement;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = theme === 'dark' || (theme === 'system' && prefersDark);
    root.classList.toggle('dark', isDark);
    localStorage.setItem('theme', theme);

    // Keep the PWA theme-color meta tag in sync with the active theme
    document
      .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
      .forEach((el) => {
        const media = el.getAttribute('media') ?? '';
        if (media.includes('dark')) {
          el.setAttribute('content', isDark ? '#0f172a' : '#ffffff');
        } else {
          el.setAttribute('content', isDark ? '#ffffff' : '#0f172a');
        }
      });
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeState }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

Wrap the app in `ThemeProvider` inside `src/main.tsx` or `src/providers/`.

### PWA `theme-color` meta tags

The browser toolbar and system chrome colour must reflect the active theme. Use two `<meta name="theme-color">` tags with `media` queries so the browser picks the correct colour before JavaScript runs, avoiding a visible flash on cold launch:

#### `index.html`

```html
<!-- light mode toolbar colour -->
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
<!-- dark mode toolbar colour -->
<meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)" />
```

> These values must be kept in sync with the `background_color` and `theme_color` fields in `public/manifest.webmanifest` (see `04_manifest.tech.md`).

### `cn` utility

Use the `cn` helper (from `clsx` + `tailwind-merge`) for conditional class names:

```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## Relation to other conventions

- **`02_app-architecture.tech.md`**: `tailwind.config.ts` lives at the project root; `src/components/ui/` is reserved for shadcn primitives; `src/lib/` contains the `cn` utility; `src/providers/` contains `ThemeProvider`.
- **`04_manifest.tech.md`**: `theme_color` and `background_color` in the manifest must match the light/dark colour values used in the `<meta name="theme-color">` tags.
- **`07_mobile-ui.tech.md`**: Safe area insets and status bar styles defined there interact with the active theme colour.

---

## Examples

### Correct: conditional classes with `cn`

```typescript
<button className={cn('px-4 py-2 rounded', isActive && 'bg-primary text-primary-foreground')}>
  Click me
</button>
```

### Correct: dark-mode variant

```typescript
<div className="bg-background text-foreground dark:bg-slate-900 dark:text-slate-100">
  Content
</div>
```

### Incorrect: inline style or custom CSS class for something Tailwind covers

```typescript
<button style={{ padding: '8px 16px' }}>Click me</button>
```
