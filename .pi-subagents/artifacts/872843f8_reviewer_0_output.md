{
  "reviewer": "product-lens",
  "findings": [
    {
      "title": "U3 executes before blocking question Q1 is resolved",
      "severity": "P1",
      "section": "Implementation Units → U3",
      "why_it_matters": "U3's approach (KTD3: file rename) assumes image files are content-swapped on disk. If files contain their correct content and the mapping is wrong instead, the entire rename strategy is invalid — file rename would break correct images. The plan itself marks Q1 as '(blocking)' and states 'Resolution needed before U3 execution,' yet U3 is positioned as a concrete implementation unit with a file-rename approach encoded in KTD3. Implementing U3 before Q1 is resolved risks wasting effort or introducing new breakage.",
      "autofix_class": "gated_auto",
      "finding_type": "error",
      "suggested_fix": "Either resolve Q1 first and gate U3 on that answer, or restructure U3 to have two conditional sub-approaches (rename files vs. update mapping entries) with a pre-flight check step.",
      "confidence": 100,
      "evidence": [
        "Q1 (blocking). Confirm that the actual image files project-vaughan.jpg and project-dynastic.png are swapped on disk (file content) vs. just the mapping being wrong. Resolution needed before U3 execution.",
        "KTD3. Fix image swap via file rename, not mapping change. If the image files are content-swapped, rename the files on disk...",
        "U3. Approach: If confirmed: rename project-vaughan.jpg → project-vaughan-temp.jpg, rename project-dynastic.png → project-vaughan.jpg..."
      ]
    },
    {
      "title": "U4 hardcoded scroll ranges won't match 'Heyo! centered' across viewports",
      "severity": "P2",
      "section": "Implementation Units → U4",
      "why_it_matters": "The About section height varies dramatically between desktop (multi-paragraph text next to portrait + heading) and mobile (stacked layout with much more vertical scroll distance). The scrollYProgress ranges [0, 0.3, 0.5, 0.8] are hardcoded for a single viewport profile. When the section is taller (mobile), 'Heyo!' centers at a different scroll fraction, so the peak opacity/scale won't align with the heading. The plan's test scenario acknowledges this implicitly ('effect still works with adjusted scroll range') but U4 provides no mechanism for adjustment — it would require per-breakpoint tuning that isn't scoped or specified.",
      "autofix_class": "manual",
      "finding_type": "omission",
      "suggested_fix": "Either tie the peak to an intersection-observer event on the 'Heyo!' heading element (decoupling from viewport height), or explicitly scope responsive scroll ranges into the implementation spec with per-breakpoint values.",
      "confidence": 75,
      "evidence": [
        "U4. Approach: useTransform for opacity tied to scrollYProgress, range [0, 0.3, 0.5, 0.8] mapped to [0, 1, 1, 0]",
        "U4. Test Scenarios: Mobile viewport: effect still works with adjusted scroll range.",
        "R4. The About section circle must expand prominently as the user scrolls into the section, peak when the 'Heyo!' heading is roughly centered in the viewport, then fade out smoothly."
      ]
    },
    {
      "title": "pearl-earring image path change from .jpg to .webp is unexplained",
      "severity": "P3",
      "section": "Implementation Units → U1",
      "why_it_matters": "Works.tsx currently maps pearl-earring to /images/project-pearl-earring.jpg (which exists on disk alongside project-pearl-earring-gallery.webp). The plan proposes centralizing SLUG_IMAGES with pearl-earring → /images/project-pearl-earring-gallery.webp, changing the home-page card image. Neither file is documented as superior; the plan frames this as 'fill in missing' when pearl-earring already has a mapping. If the .webp has materially different crop/quality, this silently changes the visual on the home page without explicit review.",
      "autofix_class": "manual",
      "finding_type": "omission",
      "suggested_fix": "Add a brief rationale for choosing the .webp over the existing .jpg (e.g., 'the webp is higher resolution and consistent with gallery assets'), or keep the existing .jpg path for the centralized map.",
      "confidence": 50,
      "evidence": [
        "U1. Approach step 2: Fill in missing entries: shinee-love-sick → /images/project-shinee-preview.gif, pearl-earring → /images/project-pearl-earring-gallery.webp.",
        "Works.tsx local SLUG_IMAGES already includes: 'pearl-earring': '/images/project-pearl-earring.jpg'",
        "Both files exist on disk: project-pearl-earring.jpg and project-pearl-earring-gallery.webp"
      ]
    }
  ],
  "residual_risks": [
    "If Q1 resolves to 'files are NOT swapped,' U3's file-rename approach (KTD3) is invalid; the mapping entries in SLUG_IMAGES, STATIC_GALLERIES, and STATIC_ALL_PROJECTS would need correction instead, and the plan has no fallback path for that outcome beyond a brief note.",
    "The centralized SLUG_IMAGES module creates a new source of truth that must stay synchronized with both Payload CMS data and the /public/images/ directory. Without a lint rule or test asserting file existence for every mapping, drift between the map and disk can silently regress.",
    "Definition of Done includes manual visual inspection on desktop and mobile — this is a legitimate final check but cannot be automated, so it's a single point of failure in the verification pipeline."
  ],
  "deferred_questions": [
    "Q1 (from document): Are the actual image files project-vaughan.jpg and project-dynastic.png swapped on disk (file content), or is only the mapping wrong?",
    "Should the About circle animation's scroll ranges be empirically tested across the three primary breakpoints (mobile, tablet, desktop) with the actual rendered section height before shipping U4?"
  ]
}