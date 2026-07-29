{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "reviewer": "design-lens",
  "findings": [
    {
      "title": "No `prefers-reduced-motion` guard for scroll-driven animation (U4)",
      "severity": "P1",
      "section": "U4 — About circle scroll expansion + fade",
      "why_it_matters": "The plan specifies scale (0.6→1.15→0.85) and opacity (0→1→0) transforms driven by scroll position. Without a `prefers-reduced-motion` guard, these animations fire regardless of user OS-level motion preferences, which can cause vestibular discomfort. The `framer-motion` library already exports `useReducedMotion()` — this is a trivial omission with an easy fix, but skipping it is an accessibility violation.",
      "finding_type": "omission",
      "autofix_class": "gated_auto",
      "suggested_fix": "Add `const prefersReduced = useReducedMotion()` in About.tsx. When true, set scale to 1 and opacity to 1 (peak value), skipping all transform animation. Test by enabling 'Reduce motion' in OS settings and verifying the circle renders static.",
      "confidence": 100,
      "evidence": [
        "Add a larger scale range (0.6 → 1.15 → 0.85) with opacity (0 → 1 → 0) for dramatic entrance/exit.",
        "The plan's Test Scenarios for U4 describe scroll-driven animation behavior without any mention of respecting user motion preferences.",
        "The existing About.tsx already imports from framer-motion and uses useScroll/useTransform, making useReducedMotion a zero-dependency addition."
      ]
    },
    {
      "title": "No image loading, empty, or error interaction states specified across image-heavy units (U1, U2, U3)",
      "severity": "P1",
      "section": "U1, U2, U3 — all image-rendering units",
      "why_it_matters": "The plan addresses data availability (CMS has coverImage vs. static fallback) but is silent on rendering states: loading spinners/skeletons while images fetch, broken-image placeholders on 404, and zero-image gallery state. U2 moves the gallery above the fold — if the gallery is empty or images fail to load, the user's first impression is either a blank section or broken-image icons. Without spec guidance, implementers will either block (waiting for design direction) or guess (producing inconsistent UX).",
      "finding_type": "omission",
      "autofix_class": "manual",
      "suggested_fix": "Add interaction-state specifications per unit: (a) U1 — loading skeleton with accent-color background for cover images in ProjectRelated cards, broken-image fallback using the project's accentColor as a solid swatch; (b) U2 — zero-state: when galleryImages.length === 0, do not render the gallery section at all (currently gated by the conditional but the reordering means this gate sits closer to the hero); (c) U3 — same as U1 for Vaughn/Dynastic images. Add 'broken image URL' and 'slow network' test scenarios.",
      "confidence": 75,
      "evidence": [
        "CMS-provided cover images take precedence over static fallbacks. (U1 approach — data fallback only, no render-state guidance)",
        "On any project detail page (e.g., /project/comfortabull), the gallery grid appears above the summary text and body content. (U2 test scenario — success state only)",
        "All four U1 test scenarios and all four U2 test scenarios describe only success-state renders. No scenario addresses loading, network failure, or zero-image conditions.",
        "ProjectRelated.tsx currently renders nothing (not even a placeholder) when coverImage is null — just the accent-color background with overlay text."
      ]
    },
    {
      "title": "No hover/focus interaction states defined for transparent footer social icons (U5)",
      "severity": "P2",
      "section": "U5 — Footer social icons transparent + nav links render",
      "why_it_matters": "U5 changes `.footer .sc-link` from `rgba(255,255,255,0.15)` to `transparent`. The existing hover state (`rgba(255,255,255,0.35)`) remains, but the plan doesn't confirm whether it still provides sufficient affordance against a transparent default. On the dark gradient footer, a fully transparent circle with only a white SVG icon loses the interactive shape cue that the pill background previously provided. Focus-visible styles for keyboard tab navigation are entirely absent from the spec.",
      "finding_type": "omission",
      "autofix_class": "manual",
      "suggested_fix": "Define explicit hover style for the transparent state: e.g., `background: rgba(255,255,255,0.12)` on hover (subtle but discernible) or a 10% scale-up with CSS transition. Add `.footer .sc-link:focus-visible { outline: 2px solid var(--white); outline-offset: 2px; }` for keyboard users. Add a test scenario: 'Tab-navigating through footer icons shows visible focus rings.'",
      "confidence": 75,
      "evidence": [
        "Override `.footer .sc-link` background to `transparent` and set SVG color to `var(--white)`. (U5 approach — default state only)",
        "The existing CSS `.footer .sc-link:hover { background-color: rgba(255, 255, 255, 0.35); }` and `.sc-link:hover { background-color: var(--secondary); }` exist but the plan doesn't re-evaluate hover affordance after the default becomes transparent.",
        "U5 Test Scenarios mention only default rendering ('Footer social icons have transparent backgrounds') and nav-link rendering — no interactive state testing."
      ]
    },
    {
      "title": "Gallery-before-text reorder doesn't address screen-reader semantic reading order (U2)",
      "severity": "P2",
      "section": "U2 — Reorder project page: gallery before text",
      "why_it_matters": "Swapping JSX blocks changes both visual and DOM order identically. On a project like Comfortabull with 6+ gallery images, a screen reader user will hear repeated image alt text (currently `alt: title` — the project name, e.g., 'Comfortabull, Comfortabull, Comfortabull...') before reaching the summary text that explains what the project is. A visually-hidden section heading or aria-label on the gallery could orient assistive-tech users.",
      "finding_type": "omission",
      "autofix_class": "manual",
      "suggested_fix": "Add a visually-hidden heading above the gallery section: `<h2 className='sr-only'>Project Gallery</h2>` so screen-reader users can skip past images if desired. Or add `aria-label='Project image gallery'` to the gallery section element. Add a manual screen-reader smoke test note to the verification contract.",
      "confidence": 50,
      "evidence": [
        "Swap the order of the `<ProjectGallery>` and `<ProjectContent>` JSX blocks in the return statement. The new order becomes: Hero → Meta → Gallery → Content (Summary + Body/StaticBody) → Related. (U2 approach)",
        "The current page.tsx sets `alt: title` for every gallery image — repeated identical alt text per image.",
        "No mention of screen-reader, keyboard navigation, or focus-order considerations in the U2 approach or test scenarios."
      ]
    },
    {
      "title": "About circle animation parameters lack design rationale (U4)",
      "severity": "P3",
      "section": "U4 — About circle scroll expansion + fade",
      "why_it_matters": "The plan specifies precise numeric breakpoints (scale 0.6→1.15→0.85, opacity at progress [0, 0.3, 0.5, 0.8]) without explaining the design intent behind each value. During visual QA, a reviewer can only confirm the numbers were transcribed correctly — they can't validate that 1.15 is the 'right' peak or that 0.85 exit scale achieves the intended effect. This isn't an implementation blocker, but it weakens the plan as a design artifact.",
      "finding_type": "omission",
      "autofix_class": "manual",
      "suggested_fix": "Add brief design rationale: 'Peak scale 1.15 chosen to provide noticeable expansion without overflow on mobile (540px circle at 1.15 ≈ 621px, fits within typical mobile section widths). Exit scale 0.85 prevents instant disappearance — the circle recedes gently as it fades, mirroring the entrance.'",
      "confidence": 50,
      "evidence": [
        "Add a larger scale range (0.6 → 1.15 → 0.85) with opacity (0 → 1 → 0) for dramatic entrance/exit. (U4 approach)",
        "The plan describes 'dramatic entrance/exit' as the goal but provides only numeric parameters with no reasoning connecting the parameters to the effect."
      ]
    }
  ],
  "residual_risks": [
    "Q1 (blocking): Image file content swap for Vaughn/Dynastic is unconfirmed — U3 cannot proceed until someone visually inspects `public/images/project-vaughan.jpg` and `public/images/project-dynastic.png`.",
    "CSS `.about-section` has its own `overflow: hidden` at line 497 of styles.css. The plan removes overflow from the inner `div` (inline style) but does not address the section-level overflow — the expanding circle may still clip at section top/bottom edges unless both are removed.",
    "Manual visual QA gates depend on human availability. No automated visual regression testing (e.g., Percy, Chromatic) is in the verification contract.",
    "The plan's Sequencing section says 'U4 (image swap file rename must happen before U1 tests pass)' but U4 is the About circle animation; U3 is the image swap. This typo could confuse implementers following the recommended order.",
    "Cross-browser verification covers chromium + firefox desktop only. Safari — disproportionately popular among designers and portfolio-site visitors — is not included.",
    "The `STATIC_ALL_PROJECTS` array in page.tsx is missing `coverImage` entries for `shinee-love-sick` and `pearl-earring`. U1's approach adds static fallback via the shared module, but until U1 lands, these projects have no cover images in the related section. The plan doesn't flag this as a pre-existing issue in U1's test scenarios."
  ],
  "deferred_questions": [
    "Q2 (from document): Are nav links intentionally omitted from the footer or was this an oversight? Plan resolves as 'oversight' and renders them per existing CSS — this resolution is reasonable given the CSS classes already exist.",
    "Should the gallery reorder (U2) apply to mobile viewports? The plan says 'Mobile and desktop viewports render the new order correctly' but the existing mobile layout may already collapse gallery and content into a single scroll flow where reordering has different UX implications."
  ]
}