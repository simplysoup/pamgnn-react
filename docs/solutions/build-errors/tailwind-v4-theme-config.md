---
title: "Tailwind CSS v4 silently ignores tailwind.config.ts — use @theme directive in CSS"
date: 2026-07-30
module: tailwind-css
problem_type: build_error
component: tooling
severity: critical
symptoms:
  - "All custom Tailwind colors (secondary, dark, ticker, bhover, backdrop) silently stopped resolving site-wide"
  - "Contact button appeared to disappear on hover — hover:text-white worked but hover:bg-secondary was a no-op"
  - "Ticker section bar had no background color (bg-ticker generated zero CSS)"
  - "Project card accent colors and border colors missing"
  - "No error or warning emitted at build time"
root_cause: config_error
resolution_type: config_change
tags:
  - tailwindcss
  - tailwind-v4
  - theme-config
  - css-configuration
  - nextjs
  - postcss
---

# Tailwind CSS v4 silently ignores tailwind.config.ts — use `@theme` directive in CSS

## Problem

After migrating from Docker Compose to bare-metal PM2, all custom Tailwind theme colors silently stopped resolving site-wide. The project's `tailwind.config.ts` defined custom colors (`secondary`, `dark`, `ticker`, etc.), font families (`exo`, `serif`, `sans`), border radii, and spacing values under `theme.extend`, but these values generated **zero CSS utility classes** in the production build. The site rendered with no custom backgrounds, text colors, borders, or hover states — every `bg-secondary`, `text-dark`, `border-secondary`, and `hover:bg-secondary` class was a no-op.

The build completed with zero errors or warnings, making the root cause difficult to find.

## Symptoms

- Site-wide custom colors missing — all elements relying on `bg-secondary`, `text-dark`, `bg-ticker`, etc. were transparent or inherited defaults
- Contact button appeared to "disappear" on hover: `hover:text-white` worked (white is a built-in Tailwind color), but `hover:bg-secondary` produced no background, so the text turned white on a transparent background
- Ticker bar had no pink-ish `#f4e5e4` background
- Project card accent colors and border colors didn't render
- Arrow circle icons inside buttons had no purple background
- `grep 'secondary' .next/static/chunks/*.css` returned 0 results — all custom color classes were absent from the built CSS bundle
- Build completed with zero errors or warnings

## What Didn't Work

- **Assuming `tailwind.config.ts` was active** — the file existed with correct Tailwind v3-style `theme.extend.colors` structure, but Tailwind v4 doesn't load it
- **Using plain `:root` CSS variables** — `--secondary: #4b1f44` in a `:root` block is just a CSS variable; Tailwind v4 doesn't auto-generate utility classes from arbitrary `:root` variables
- **Inspecting PostCSS config** — the `@tailwindcss/postcss` plugin was correctly configured in `postcss.config.ts`; the issue isn't the plugin but what it reads
- **Looking for build errors** — there were none; the failure was completely silent
- **Checking the NODE_ENV** — switching between development and production produced identical results; this wasn't a runtime environment issue
- **Verifying the standalone build output** — the `.next/` output existed and looked structurally correct (session history)

## Solution

Move all custom theme values from `tailwind.config.ts` into a `@theme` block in the CSS entry point (`src/app/globals.css`).

**Before** — `tailwind.config.ts` (silently ignored by v4):
```ts
const config: Config = {
  theme: {
    extend: {
      colors: {
        secondary: '#4b1f44',
        dark: '#12181a',
        ticker: '#f4e5e4',
        bhover: '#dbdcdd',
        backdrop: '#171d1f',
      },
      fontFamily: {
        exo: ['Exo', 'sans-serif'],
      },
      borderRadius: {
        card: '10px',
        pill: '50px',
      },
    },
  },
}
export default config
```

**Before** — `globals.css` (plain `:root` variables not recognized):
```css
@import 'tailwindcss';

:root {
  --secondary: #4b1f44;
  --dark: #12181a;
  --ticker: #f4e5e4;
}
```

**After** — `src/app/globals.css` with `@theme` (works):
```css
@import 'tailwindcss';

@theme {
  --color-secondary: #4b1f44;
  --color-dark: #12181a;
  --color-dark-2: #293033;
  --color-dark-70: rgba(18, 24, 26, 0.7);
  --color-dark-80: rgba(18, 24, 26, 0.8);
  --color-dark-90: rgba(18, 24, 26, 0.9);
  --color-ticker: #f4e5e4;
  --color-bhover: #dbdcdd;
  --color-backdrop: #171d1f;
  --color-white-50: rgba(255, 255, 255, 0.5);
  --font-exo: 'Exo', sans-serif;
  --font-serif: 'Playfair Display', serif;
  --font-sans: 'Urbanist', sans-serif;
  --radius-card: 10px;
  --radius-pill: 50px;
  --tracking-wide: 0.03em;
  --spacing-xs: 80px;
  --spacing-s: 110px;
  --spacing-m: 140px;
  --spacing-l: 200px;
}
```

Commit: `3d7884e` ("fix: register custom Tailwind colors with @theme directive for Tailwind v4")

## Why This Works

**Tailwind CSS v4 migrated from a JavaScript config file to a CSS-first configuration model.** The `@tailwindcss/postcss` plugin (used via `@import 'tailwindcss'`) no longer reads `tailwind.config.ts` — it reads theme values from the `@theme` directive in CSS. The `tailwind.config.ts` file is silently ignored; it produces no error because v3-style config files are not invalid, just unused by v4.

Key differences between v3 and v4 theme configuration:

| Concern | Tailwind v3 | Tailwind v4 |
|---------|-------------|-------------|
| Theme source of truth | `tailwind.config.js/ts` | `@theme` in CSS entry point |
| Color naming | `colors: { secondary: '...' }` | `--color-secondary: ...` |
| Font naming | `fontFamily: { exo: [...] }` | `--font-exo: ...` |
| Radius naming | `borderRadius: { card: '10px' }` | `--radius-card: 10px` |
| Prefix convention | Arbitrary JS object keys | `--color-*`, `--font-*`, `--radius-*`, `--spacing-*`, `--tracking-*` |
| Build error on missing theme | N/A (config is source of truth) | N/A — still compiles silently |

The `--color-*` prefix convention is part of Tailwind v4's design system. Each theme namespace maps to a CSS variable prefix that generates the corresponding utility classes:

| CSS variable prefix | Generates utilities | Example |
|---------------------|---------------------|---------|
| `--color-` | `bg-`, `text-`, `border-`, `hover:bg-`, etc. | `--color-secondary` → `bg-secondary`, `text-secondary` |
| `--font-` | `font-` | `--font-exo` → `font-exo` |
| `--radius-` | `rounded-` | `--radius-pill` → `rounded-pill` |
| `--spacing-` | `m-`, `p-`, `gap-` | `--spacing-xs` → `m-xs`, `p-xs` |
| `--tracking-` | `tracking-` | `--tracking-wide` → `tracking-wide` |

## Prevention

- On any project using Tailwind v4 (`tailwindcss@^4` in `package.json` + `@import 'tailwindcss'` in CSS), place all custom theme tokens in a `@theme` block, never in `tailwind.config.ts`
- After building, verify generated utility classes exist:
  ```bash
  grep -c 'bg-secondary' .next/static/chunks/*.css
  # Expected: non-zero (confirms the class was generated)
  ```
- Treat absence of expected utility classes as a build failure — Next.js will not warn about missing theme tokens (session history: this silent behavior was the most time-consuming aspect of debugging)
- The `tailwind.config.ts` file can be kept for reference but is dead code for v4; consider deleting it or adding a header comment once all tokens are migrated
- During code review, flag any PR that adds custom theme values to `tailwind.config.ts` instead of the `@theme` block

## Related

- Branch/commit: `refactor/architecture-cleanup`, commit `3d7884e` — fix that applied this solution (unmerged; SHA may change on squash merge)
- [Tailwind CSS v4: Configuration](https://tailwindcss.com/docs/configuration)
- [Tailwind CSS v4: Theme](https://tailwindcss.com/docs/theme)
- Tailwind CSS v4 Upgrade Guide (tailwindcss.com/docs/upgrade-guide)
