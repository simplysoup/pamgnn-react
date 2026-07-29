## Session History Synthesis: Hamburger Menu Fix

### What was tried before

- **Pre-existing state before any AI work**: The Navbar component had `pointerEvents: isHomePage && heroProgress < 0.08 ? 'none' : 'auto'` on the `<nav>` element. At the top of the homepage, the *entire navbar* was non-interactive, blocking hamburger clicks. This was committed in pre-existing sidebar changes (visible in session 019fa510 git diff).

- **Session 019fa510 (Initial motion implementation)**: Navbar.tsx was modified as part of "pre-existing sidebar changes" alongside Footer, Hero, Works. These changes introduced the `pointerEvents` guard that blocked the hamburger.

- **Session 019fa671 (First hamburger debug – 01:58–03:39)**: Root cause identified as the `pointerEvents` logic on `<nav>`. Removed `pointerEvents` from the inline style. Also discovered CSS transitions were only commented-out placeholder hints — uncommented them (`transition: width 0.3s ease` on `.navbar`, `transition: background-color 0.3s ease, opacity 0.3s ease` on `.navbar-shell`). Created `docs/solutions/ui-bugs/navbar-footer-scroll-effects.md`.

- **Session 019fa812 (Second hamburger debug – 09:33–10:26)**: Four rounds of iteration on the same issue. Fixed sequence:
  1. IU-1: Added `position: relative; zIndex: 10000`, `pointerEvents: open ? 'none' : 'auto'` on shell, focus-trap, hash navigation
  2. User reported broken: Position relative overrode CSS `position: fixed` → removed `position: relative`
  3. User reported still broken: Duplicate `opacity` line found → cleaned
  4. User reported still broken: Playwright tests confirmed hamburger had zero dimensions, CSS chunk serving 500 → server restart
  5. User reported still broken on mobile: Final analysis found `pointerEvents: 'none'` on navbar-shell was still intercepting clicks → removed, wrapped hover effects in `@media (hover: hover)`

### What didn't work

| Approach | Why it failed |
|----------|---------------|
| `position: 'relative'` inline style on `<nav>` | Overrode CSS `position: fixed`, breaking the fixed navbar entirely |
| `pointerEvents: open ? 'none' : 'auto'` on `.navbar-shell` | Overrode `.navbar-shell` CSS `pointer-events: none` rule, letting the shell intercept all clicks (hamburger, logo, links) |
| Original `pointerEvents: isHomePage && heroProgress < 0.08 ? 'none' : 'auto'` on `<nav>` | Blocked all navbar clicks at the top of the homepage, making hamburger unreachable |
| `outline: 'none'` on gallery tile buttons | Removed visible focus indicator for keyboard users |
| Removing `.next` cache while dev server was running | Corrupted Turbopack cache, causing CSS chunk to return 500 |
| CSS hover effects on `.mobile-nav-link` and `.mobile-menu-close` without media query | On touch devices, hover states get stuck after tap |

### Key decisions

1. **Remove ALL inline `pointerEvents` from both `<nav>` and `.navbar-shell`** — let the CSS `pointer-events: none` on `.navbar-shell` handle the event routing unimpeded
2. **Use CSS `position: fixed` exclusively** — no inline style overrides for layout properties that conflict with stylesheet rules
3. **Enable CSS transitions** — the placeholders `/* EASING: ... */` comments in `styles.css` were never activated; uncommented them as live `transition` rules
4. **Wrap mobile hover effects in `@media (hover: hover)`** — prevents stuck hover states on touch devices
5. **Remove `zIndex: 10000` from inline `<nav>` style** — CSS already sets `z-index: 9998` which is sufficient; inline override was unnecessary
6. **Hash navigation via `useEffect`** — scrolls to `/#works`, `/#about`, `/#contact` after route change for both click and keyboard navigation

### Related context

- **Sidebar pre-existing changes** — The Hamburger bug was introduced through side-effect changes in Navbar.tsx committed alongside the initial motion work (session 019fa510), not as a deliberate change to menu behavior.
- **CSS architecture** — The navbar's CSS in `styles.css` had unused `pointer-events: none` on `.navbar-shell` and commented-out transition placeholders. The CSS was written expecting certain behaviors that were never wired up.
- **Footer social icons** — Also broken in the same round: `.sc-link` used `var(--dark)` (#12181a) on the dark footer gradient, making them invisible. Fixed separately.
- **Documentation created** — Two solution docs captured the learnings: `docs/solutions/ui-bugs/navbar-footer-scroll-effects.md` and `docs/solutions/ui-bugs/inline-style-override-breaks-css-position-fixed.md`.
- **Impact of the original `pointerEvents` guard** — The `heroProgress < 0.08` threshold meant the navbar was only non-interactive for the first ~8% of scroll on the homepage, which made the bug intermittent and harder to diagnose consistently. On project pages (where heroProgress is undefined/fixed), the hamburger worked fine, which explained inconsistent user reports.