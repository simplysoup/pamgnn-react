---
title: "Mobile Menu Close Button Overlaps Hamburger on Mobile"
date: 2026-07-28
module: Navbar
problem_type: ui_bug
component: frontend_stimulus
symptoms:
  - "Close button at right:24px shares hamburger's x-coordinate; elementFromPoint() returns BUTTON.mobile-menu-close instead of the overlay"
root_cause: logic_error
resolution_type: code_fix
severity: medium
tags:
  - mobile-navigation
  - hamburger-menu
  - touch-targets
  - close-button
  - spatial-overlap
---

# Mobile Menu Close Button Overlaps Hamburger on Mobile

## Problem

The `.mobile-menu-close` button (a "X" icon at `top:20px; right:24px` inside the mobile menu overlay) was positioned at the same horizontal location as the `.hamburger` button (pushed to the far-right of the navbar via `margin-left: auto` in a flex container). When the mobile menu opened, `document.elementFromPoint()` at the hamburger's center returned `BUTTON.mobile-menu-close` instead of `DIV.mobile-menu` (the overlay). Users tapping the hamburger area to close the menu would hit the close button instead.

## Symptoms

- On mobile viewports (≤991px), tapping the hamburger to close the mobile menu fires the close button instead — functionally works (both call `setOpen(false)`) but bypasses the hamburger's toggle behavior
- `document.elementFromPoint()` at hamburger center coordinates returns:
  ```js
  elementFromPoint(340, 35) → <button class="mobile-menu-close">
  // Should return <div class="mobile-menu">
  ```
- The close button and hamburger occupy overlapping viewport regions (~x:315-360), making it impossible for a normal tap to reach the hamburger when the menu is open

## What Didn't Work

- **Leaving the close button on the right side.** No amount of z-index tweaking on the mobile menu overlay could fix this — the close button is a child of the overlay, so it naturally paints on top.
- **Using `pointer-events: none` on the close button.** Would make it non-interactive entirely, breaking keyboard and screen-reader access.
- **Elevating the entire navbar above the mobile menu (`z-index: 99999`).** Created a new problem: the navbar logo (left side) intercepted taps on the close button (now on the left), breaking the close-button interaction. Stacking-context conflicts between fixed-position elements require more targeted approaches.
- **Changing the hamburger to `position: fixed`.** Took it out of the flex layout, requiring hardcoded coordinates that break across viewport sizes.

## Solution

Changed the close button's horizontal positioning from right-aligned to left-aligned. **One CSS change in `src/app/(frontend)/styles.css`** (line ~157):

**Before:**
```css
.mobile-menu-close {
  position: absolute;
  top: 20px;
  right: 24px;    /* overlapped hamburger */
  width: 36px;
  height: 36px;
}
```

**After:**
```css
.mobile-menu-close {
  position: absolute;
  top: 20px;
  left: 24px;     /* separated from hamburger */
  right: auto;    /* ensures no conflicting right value */
  width: 36px;
  height: 36px;
}
```

The close button now sits at x ≈ 24px (left side of the viewport, near the logo), while the hamburger remains at x ≈ 321–359px (far-right of the navbar). The hamburger toggle and the close button are now on opposite sides of the navbar.

## Why This Works

The root cause is a **layout overlap**: both the hamburger button (far-right via `margin-left: auto`) and the close button (`right: 24px`) occupied the same horizontal region of the viewport (~x:315-360 on a 375px-wide screen). The close button is a child of the full-screen `.mobile-menu` overlay (`z-index: 99997, position: fixed, inset: 0`), so it sits above the entire navbar (`z-index: 9998`). Tapping the hamburger's location while the menu is open always hits the close button first.

By moving the close button to the left side, both interactive elements have their own dedicated region. The hamburger's `onClick` toggle (`setOpen(v => !v)`) is reachable through the overlay, and the close button explicitly calls `setOpen(false)` from a separate position.

Verification after fix:
```js
const rect = document.querySelector('.hamburger').getBoundingClientRect();
const el = document.elementFromPoint(rect.left + rect.width/2, rect.top + rect.height/2);
el.classList.contains('mobile-menu'); // ✅ true — overlay, not close button
```

## Prevention

- When two UI elements toggle each other (hamburger opens menu, close button closes it), ensure they occupy **distinct viewport regions** to avoid spatial conflicts
- Use `document.elementFromPoint()` during E2E testing to verify no unintended element interception
- Add a Playwright assertion:
  ```ts
  const box = await page.locator('.hamburger').boundingBox();
  const topEl = await page.evaluate(({x, y}) => {
    const el = document.elementFromPoint(x, y);
    return el?.className || '';
  }, { x: box.x + box.width/2, y: box.y + box.height/2 });
  expect(topEl).not.toContain('mobile-menu-close');
  ```

## Related Issues

- `docs/solutions/ui-bugs/navbar-footer-scroll-effects.md` — First hamburger fix: removed inline `pointerEvents` on `<nav>` that blocked ALL navbar clicks
- `docs/solutions/ui-bugs/inline-style-override-breaks-css-position-fixed.md` — Second fix: removed inline `position: relative` that overrode CSS `position: fixed`

Both prior fixes addressed the same component but with different root causes. This is the third fix for hamburger menu interaction on mobile, addressing the close-button spatial overlap that remained after the other issues were resolved.
