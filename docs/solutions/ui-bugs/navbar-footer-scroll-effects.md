---
title: "Navbar hamburger, footer colors, and scroll effects fixes"
date: 2026-07-27
category: ui-bugs
module: layout
problem_type: ui_bug
component: frontend_stimulus
symptoms:
  - "Hamburger menu button not clickable on mobile (homepage) — taps do nothing"
  - "Social link circles invisible against dark footer background"
  - "Lottie wavy background animation hidden behind banner image (same z-index)"
  - "Floating decorative balls hidden on mobile (display: none at ≤ 767px)"
  - "Navbar width, background, and opacity changes snap instantly on scroll with no transition"
root_cause: missing_tooling
resolution_type: code_fix
severity: medium
tags:
  - navbar
  - hamburger
  - footer
  - lottie
  - css-transitions
  - pointer-events
  - z-index
  - mobile
---

# Navbar hamburger, footer colors, and scroll effects fixes

## Problem

Multiple UI components on the homepage were broken or invisible:
- The hamburger menu button didn't respond to taps on mobile because the entire navbar had `pointer-events: none` at the top of the page
- Social link icons in the footer were invisible (dark icons on dark background)
- The Lottie wavy background animation was hidden behind the banner image at the same z-index
- Decorative floating balls were removed on mobile instead of being resized
- The navbar's scroll-driven width/opacity changes had no CSS transitions, making them snap instantly

## Symptoms

- Tapping the hamburger icon on mobile (viewport ≤ 991px) produces no visual response and the menu never opens
- Social icons (YouTube, email, LinkedIn, Vimeo) appear as empty dark circles on the dark footer gradient
- Hero section appears without the wavy Lottie animation visible
- On mobile, no floating balls are visible at all
- Scrolling the page produces an instant snap of the navbar width and background rather than a smooth transition

## What Didn't Work

- **Removing only `pointer-events` from `<nav>` inline style** (first fix attempt): This was necessary but insufficient. The CSS transitions were also missing, so any scroll-driven changes appeared instantly without visual feedback, making the header feel broken.
- **Focusing only on the hamburger state toggling**: The `onClick` handler and React state were correct (`setOpen(v => !v)`). The problem was entirely CSS/pointer-event blocking, not component logic.

## Solution

Four changes in two files:

### 1. `src/components/layout/Navbar.tsx` — Remove `pointer-events: none` from `<nav>`

**Before:**
```tsx
<nav
  className="navbar"
  style={{
    width: shellWidth,
    pointerEvents: isHomePage && heroProgress < 0.08 ? 'none' : 'auto',
  }}
>
```

**After:**
```tsx
<nav className="fixed top-0 left-1/2 -translate-x-1/2 z-[9998] h-[88px] mt-3 flex items-center justify-center transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
  style={{ width: shellWidth }}
>
```

The `navbar-shell` div below has `pointer-events: none` as an inline style, so the background remains non-interactive. But the hamburger button, logo, and other children now receive clicks at all scroll positions.

### 2. Transition on the `<nav>` element — Added transition via Tailwind utility class

The transition is now applied as a Tailwind utility class on the `<nav>` element:

```tsx
<nav className="... transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]" ...>
```

And the `navbar-shell` div uses inline styles for its transition on `background-color` and `opacity`, since those values are computed dynamically from scroll progress.

### 3. `src/components/layout/Footer.tsx` — Footer social link colors

The social links originally had `background-color: var(--dark)` making them invisible on the dark footer gradient. The fix adds a semi-transparent light background and hover state via Tailwind classes:

```tsx
<Link ... className="... bg-white/15 hover:bg-white/35 ...">
```

### 4. Lottie z-index and ball visibility

The Lottie full-screen container now uses `z-1 opacity-50 mix-blend-hard-light` Tailwind classes (z-index 1 so it renders above the banner image).

The floating decorative balls use responsive Tailwind classes rather than `display: none` on mobile. The balls use size classes like `w-[5vw] max-w-24 min-w-11` that scale down naturally on smaller viewports, avoiding text overlap without hiding them entirely.

## Why This Works

1. **`pointer-events: none`** on the `<nav>` was blocking all interaction at the top of the homepage (where `heroProgress < 0.08`). The `.navbar-shell` already had `pointer-events: none` in CSS for the glass backdrop — the extra inline `pointer-events: none` on the nav element was redundant and destructive, preventing clicks on the hamburger, logo, and all nav links.

2. **Missing CSS transitions** meant the Navbar's scroll-based width (100% → 95%) and background opacity (0 → 1) changes snapped instantly. The framework was calculating correct values, but with no transition property, each frame jumped to the target immediately — indistinguishable from broken behavior.

3. **Footer `.sc-link`** had `background-color: var(--dark)` (#12181a) — the same value as the footer's dark gradient. The icons (black SVGs on dark circles) were invisible. The fix uses a light semi-transparent background visible against the dark footer.

4. **Lottie z-index: 0** placed it at the same stacking level as `.hero-background`. Since the banner came later in DOM order, it rendered on top. Changing to z-index: 1 puts the Lottie above the banner.

5. **Floating balls were hidden** on mobile via `display: none` instead of being scaled down. Replacing with proportional `vw` sizing keeps them visible without overlapping hero text.

## Prevention

- When adding `pointer-events: none` on a container with interactive children, ensure it targets only the decorative backdrop element — never the interactive container itself.
- CSS transition hints left as comments are dead code that will never be activated. Either enable them or remove the comments.
- When using SVG icons on a dark background, ensure the icon wrapper has adequate contrast against the background.
- Check z-index stacking order when multiple absolutely-positioned elements overlap — the DOM order creates implicit stacking at the same z-index level.
- For responsive design, prefer proportional sizing (vw/%) over `display: none` for decorative elements that can be scaled down instead of hidden.
