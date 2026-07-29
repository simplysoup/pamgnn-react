{
  "reviewer": "systems-architect-reviewer",
  "findings": [
    {
      "title": "U5: CSS color/fill/stroke won't affect <img>-based SVGs in Footer",
      "severity": "P1",
      "section": "U5. Footer: social icons transparent + nav links render",
      "why_it_matters": "The Footer renders social icons via <img> tags, not inline SVGs. CSS rules like `.footer .sc-link svg { color: var(--white); }` or `fill: var(--white)` cannot style SVGs loaded through <img> elements — the SVG is in a separate document context where parent CSS does not apply. The implementer will apply the suggested CSS, see no visual change, and need to invent a working approach (e.g., CSS filter or inline SVG conversion) that the plan doesn't specify.",
      "finding_type": "error",
      "autofix_class": "manual",
      "suggested_fix": "Replace the CSS approach with either: (a) `filter: brightness(0) invert(1)` on the <img> elements to turn dark SVGs white, or (b) convert social icons to inline SVGs that inherit `currentColor` from the parent <a>. Specify which approach to use.",
      "confidence": 100,
      "evidence": [
        "Footer.tsx renders social icons as: `<img src={icon} alt={label} width={18} height={18} />`",
        "Plan U5 suggests: `.footer .sc-link svg { color: var(--white); }` (or `fill: var(--white); stroke: var(--white)`)",
        "Browser behavior: SVGs loaded via <img> are rendered in an isolated document context; parent-document CSS selectors (including `svg`) do not match them",
        "The existing `.sc-link { color: var(--white); }` at styles.css:648 already doesn't affect <img>-based SVGs — confirming the underlying mechanics"
      ]
    },
    {
      "title": "U4: Outer .about-section overflow:hidden will still clip the circle",
      "severity": "P1",
      "section": "U4. About circle scroll expansion + fade",
      "why_it_matters": "Requirement R4 states the circle 'must not be visibly clipped by section edges.' The plan's approach only removes `overflow: hidden` from the inner `<div style={{ overflow: 'hidden' }}>` in About.tsx, but the CSS rule `.about-section { overflow: hidden; }` at styles.css:495-498 also clips overflow. Removing one without the other means the expanding circle will still be clipped by the section boundary, and the requirement will not be met.",
      "finding_type": "omission",
      "autofix_class": "safe_auto",
      "suggested_fix": "Add to U4 approach: also remove or override `overflow: hidden` from the `.about-section` CSS rule in styles.css (line 495-498). Consider whether removing it has side effects on other content — if so, use `overflow: visible` scoped to the section.",
      "confidence": 100,
      "evidence": [
        "styles.css:495-498: `.about-section { position: relative; overflow: hidden; }`",
        "About.tsx: `<div style={{ position: 'relative', overflow: 'hidden' }}>` — inner div has inline overflow:hidden",
        "Plan U4 approach: 'remove `overflow: hidden` from the inner `div` wrapping the circle' — only addresses the inline style, not the CSS class",
        "Plan requirement R4: 'It must not be visibly clipped by section edges'"
      ]
    },
    {
      "title": "Sequencing section uses wrong U-ID for image swap dependency",
      "severity": "P2",
      "section": "Sequencing",
      "why_it_matters": "The Sequencing paragraph states 'Units are independent and can run in any order except U4 (image swap file rename must happen before U1 tests pass…)' but per the Unit Index, U4 is 'About circle scroll expansion + fade' while U3 is 'Fix Vaughn / Dynastic image swap.' An implementer following the sequencing guidance could misorder the units or apply the dependency constraint to the wrong unit.",
      "finding_type": "error",
      "autofix_class": "safe_auto",
      "suggested_fix": "Replace 'U4 (image swap)' with 'U3 (image swap)' in the Sequencing paragraph.",
      "confidence": 100,
      "evidence": [
        "Plan Sequencing: 'except U4 (image swap file rename must happen before U1 tests pass if the swapped file is the test subject)'",
        "Plan Unit Index: 'U3 | Fix Vaughn / Dynastic image swap'",
        "Plan Unit Index: 'U4 | About circle scroll expansion + fade'"
      ]
    },
    {
      "title": "U3 fallback note references constants that U1 may relocate",
      "severity": "P2",
      "section": "U3. Fix Vaughn / Dynastic image swap",
      "why_it_matters": "U3's fallback note says to update 'the mapping entries in `SLUG_IMAGES`, `STATIC_GALLERIES`, and `STATIC_ALL_PROJECTS`' if files aren't content-swapped. After U1 executes, `SLUG_IMAGES` moves from Works.tsx to the new `src/lib/project-images.ts`, and `STATIC_ALL_PROJECTS` may import from it. The fallback note doesn't specify which files to edit, so if U3 runs after U1, an implementer following the note literally could look for the old locations and not find the constants.",
      "finding_type": "omission",
      "autofix_class": "manual",
      "suggested_fix": "Add a coordination note: if U3 runs after U1, update `SLUG_IMAGES` in `src/lib/project-images.ts` and adjust `STATIC_GALLERIES`/`STATIC_ALL_PROJECTS` in `page.tsx` accordingly. If U3 runs before U1, the original locations are correct.",
      "confidence": 75,
      "evidence": [
        "Plan U3 Note: 'fall back to updating the mapping entries in `SLUG_IMAGES`, `STATIC_GALLERIES`, and `STATIC_ALL_PROJECTS` instead'",
        "Plan U1: creates `src/lib/project-images.ts` and removes local `SLUG_IMAGES` from Works.tsx",
        "No coordination note between U1 and U3 regarding the fallback path"
      ]
    }
  ],
  "residual_risks": [
    "After U4 removes overflow:hidden from both .about-section CSS and the inner div, the expanding circle may extend into adjacent sections (hero above, footer/ticker below) and overlap other content. No containment strategy is specified.",
    "The plan assumes the Vaughn/Dynastic image files are content-swapped. If they are not, the fallback mapping change must be coordinated with U1's centralized module. The implementer must verify file contents before U3.",
    "The existing Playwright test suite (tests/e2e/frontend.e2e.spec.ts) contains only a trivial homepage title check. The new e2e tests described per unit will be the first substantive tests for these features and have no existing patterns to follow.",
    "U1 changes pearl-earring cover image from the existing /images/project-pearl-earring.jpg (in Works.tsx) to /images/project-pearl-earring-gallery.webp (the gallery image). This is presented as 'fill in missing' but is actually a file change that may affect image quality or cropping. No rationale is provided."
  ],
  "deferred_questions": [
    "Q1 (from plan, blocking): Are project-vaughan.jpg and project-dynastic.png actually content-swapped on disk? Resolution needed before U3 execution.",
    "Q2 (from plan, deferred): Were the nav links intentionally omitted from the footer or was this an oversight during migration? Plan treats it as oversight."
  ]
}