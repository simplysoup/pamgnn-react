---
title: 'Inline `position: relative` overrides CSS `position: fixed` and breaks scroll behavior'
date: 2026-07-28
category: ui-bugs
module: frontend
problem_type: ui_bug
component: tooling
symptoms:
  - Navbar scrolls with the page instead of staying fixed at the top
  - Hamburger button is not clickable on mobile/tablet viewports
  - Navbar background color and opacity transitions do not update on scroll
  - Hover effects on mobile nav links get stuck after tapping on touch devices
root_cause: config_error
resolution_type: code_fix
severity: high
tags:
  - navbar
  - css
  - inline-styles
  - position-fixed
  - pointer-events
  - stacking-context
  - mobile-menu
---

# Inline `position: relative` overrides CSS `position: fixed` and breaks scroll behavior

## Problem

After modifying the navbar component to fix mobile menu z-index issues, inline `position: relative` and `pointer-events: auto` styles were added to support elements. These inline overrides conflicted with the existing CSS class rules:

- `position: relative` on `<nav>` overrode the CSS class `position: fixed`, causing the navbar to scroll with the page
- `pointer-events: auto` on `.navbar-shell` overrode the CSS `pointer-events: none`, making the decorative shell intercept all clicks — including the hamburger button
- `.mobile-nav-link:hover` and `.mobile-menu-close:hover` applied on touch devices where hover states get stuck after tapping

## Solution

Removed the conflicting inline style rules and wrapped touch-only hover effects in a `@media (hover: hover)` query.

### What changed

**Navbar.tsx** — Removed `position: 'relative'` and `pointerEvents` from inline styles:

**Before** — inline `position: relative` and `pointerEvents` added as fix:

```tsx
<nav className="navbar" style={{ width: shellWidth, position: 'relative', zIndex: 10000 }}>
<div className="navbar-shell" style={{ backgroundColor, boxShadow, opacity: shellOpacity, pointerEvents: open ? 'none' : 'auto' }} />
```

**After** — position and pointerEvents removed, CSS class rules apply (now using Tailwind utility classes):

```tsx
<nav className="fixed top-0 left-1/2 -translate-x-1/2 z-[9998] h-[88px] mt-3 flex items-center justify-center transition-[width] duration-300" style={{ width: shellWidth, zIndex: 10000 }}>
<div className="absolute inset-0 rounded-[20px] backdrop-blur-[8px] pointer-events-none" style={{ backgroundColor, boxShadow, opacity: shellOpacity }} />
```

Note: The `position: fixed` is now expressed as the Tailwind `fixed` utility class, not a CSS class rule. The `pointer-events: none` on the shell div is set via the Tailwind `pointer-events-none` utility class.

The hover effects are now handled via Tailwind utilities directly on the elements, with the hover media query condition applied through Tailwind's `hover:` prefix (which respects `@media (hover: hover)` at the browser level):

```tsx
<Link ... className="hover:opacity-70 ...">
<button ... className="hover:bg-bhover ...">
```

## Why This Works

CSS specificity ranks inline styles above class-based rules. Adding `position: 'relative'` as an inline style silently overrode the `.navbar { position: fixed; }` from the stylesheet — the navbar lost its fixed positioning and scrolled with the page. Similarly, `pointer-events: auto` on the shell overrode the CSS `pointer-events: none` that was designed to let clicks pass through the decorative background.

The `@media (hover: hover)` query restricts hover effects to devices with a primary input that supports hover (i.e., desktop mice), preventing the stuck-hover problem common on touch devices.

## Prevention

1. **Never add `position` as an inline style** unless explicitly overriding a class-based position. Inline `position` will silently clobber the CSS class value with no build-time or lint warning.
2. **Check for existing CSS `pointer-events` rules before adding inline overrides.** The CSS class already had `pointer-events: none` — the inline `auto` was unnecessary and broke click targets.
3. **Use `@media (hover: hover)` for hover effects on interactive elements** that also appear on touch devices. This prevents stuck hover states (iOS Safari in particular persists `:hover` after a tap).
4. **When adding inline styles to a component, grep the CSS class for existing declarations first** to avoid silent overrides.
