{
  "reviewer": "ce-doc-review-coherence",
  "findings": [
    {
      "title": "Sequencing caveat references wrong U-ID (U4 instead of U3)",
      "severity": "P1",
      "section": "Planning Contract > Sequencing",
      "why_it_matters": "An implementer reading the caveat about U4 ('image swap file rename') would look at the About circle unit instead of the Vaughn/Dynastic image swap unit. The caveat's parenthetical description unambiguously describes U3, but the U-ID says U4.",
      "finding_type": "error",
      "autofix_class": "safe_auto",
      "suggested_fix": "Change 'except U4' to 'except U3' in the Sequencing section.",
      "confidence": 100,
      "evidence": [
        "Sequencing: 'Units are independent and can run in any order except U4 (image swap file rename must happen before U1 tests pass if the swapped file is the test subject).'",
        "Unit Index table: U3 = 'Fix Vaughn / Dynastic image swap', U4 = 'About circle scroll expansion + fade'"
      ]
    },
    {
      "title": "Recommended order contradicts independence constraint after U-ID correction",
      "severity": "P1",
      "section": "Planning Contract > Sequencing",
      "why_it_matters": "Even after correcting U4→U3, the caveat says U3 must precede U1 (image swap before preview-image tests). But the recommended order runs U1 at position 2 and U3 at position 3 — meaning U1 executes before U3. An implementer following the recommended order would hit test failures because the image files are still swapped when U1's tests run.",
      "finding_type": "error",
      "autofix_class": "gated_auto",
      "suggested_fix": "Either (a) swap U1 and U3 in the recommended order so U3 runs before U1, or (b) remove the caveat and note that U1 tests touching Vaughn/Dynastic should be written defensively or deferred until after U3 lands.",
      "confidence": 100,
      "evidence": [
        "Caveat (corrected): 'Units are independent and can run in any order except U3 (image swap file rename must happen before U1 tests pass if the swapped file is the test subject).'",
        "Recommended order: '1. U5 ... 2. U1 (Preview images) ... 3. U3 (Image swap) ...'"
      ]
    },
    {
      "title": "Nav-link footer rendering listed as both Deferred and In-scope",
      "severity": "P0",
      "section": "Product Contract > Scope Boundaries",
      "why_it_matters": "The 'Deferred for later' bullet includes nav-link footer rendering, but the parenthetical says it is 'treated as a companion fix' and U5's implementation explicitly includes it (adding footer-bottom JSX with navLinks). An implementer could reasonably read this as 'nav links are deferred' and skip the U5 nav-link work, or as 'nav links are in scope' and implement them. The document contradicts itself on whether this work is deferred or active.",
      "finding_type": "error",
      "autofix_class": "safe_auto",
      "suggested_fix": "Move the nav-link rendering item from 'Deferred for later' to 'In scope' in the Scope Boundaries list, since R5 and U5 both treat it as active work.",
      "confidence": 100,
      "evidence": [
        "Scope Boundaries / Deferred for later: 'nav-link missing-footer rendering is treated as a companion fix to the footer styling issue (the links are defined but never rendered).'",
        "R5: 'Nav links (HOME, WORKS, ABOUT, CONTACT) must also render in the footer below the copyright row.'",
        "U5 approach step 2: 'add a footer-bottom JSX block after the social icons row, rendering the navLinks array'"
      ]
    },
    {
      "title": "U3 fallback path depends on U1 artifact but Unit Index declares no dependency",
      "severity": "P2",
      "section": "Implementation Units > U3",
      "why_it_matters": "U3's fallback approach references SLUG_IMAGES, STATIC_GALLERIES, and STATIC_ALL_PROJECTS. SLUG_IMAGES is created by U1. If an implementer runs U3 before U1 and hits the fallback path (files not swapped), they would reference a symbol that doesn't exist yet. The dependency is conditional but real.",
      "finding_type": "omission",
      "autofix_class": "safe_auto",
      "suggested_fix": "Add 'U1' to U3's Depends On column in the Unit Index, or add a note that the fallback path can only be executed after U1 lands.",
      "confidence": 100,
      "evidence": [
        "U3 Note: 'If inspection reveals the files are NOT swapped but the mapping is wrong, fall back to updating the mapping entries in SLUG_IMAGES, STATIC_GALLERIES, and STATIC_ALL_PROJECTS instead.'",
        "U1 approach step 1: 'Create src/lib/project-images.ts exporting a SLUG_IMAGES: Record<string, string> map'",
        "Unit Index: U3 Depends On: '—' (none)"
      ]
    },
    {
      "title": "KTD4 scale range (3 values) disagrees with U4 scale mapping (4 values)",
      "severity": "P3",
      "section": "Planning Contract > KTD4 vs Implementation Units > U4",
      "why_it_matters": "KTD4 documents a 3-value scale range (0.6 → 1.15 → 0.85) but U4's implementation uses a 4-value mapping [0.6, 1.15, 0.85, 0.6]. The fourth value (0.6 at scroll range 0.8) describes the final collapsed scale. An implementer reading only KTD4 and the approach could miss the final shrink-back. Not harmful to correctness (U4 is the authoritative detail) but a careful reader could be confused about whether the 3-value or 4-value shape is intended.",
      "finding_type": "error",
      "autofix_class": "safe_auto",
      "suggested_fix": "Update KTD4 to read 'scale range (0.6 → 1.15 → 0.85 → 0.6)' to match the 4-value mapping in U4.",
      "confidence": 75,
      "evidence": [
        "KTD4: 'Add a larger scale range (0.6 → 1.15 → 0.85) with opacity (0 → 1 → 0) for dramatic entrance/exit.'",
        "U4 approach: 'range [0, 0.3, 0.5, 0.8] mapped to [0.6, 1.15, 0.85, 0.6]'"
      ]
    }
  ],
  "residual_risks": [
    "R4 requirement says circle must peak when 'Heyo!' heading is roughly centered in viewport, but U4 maps scroll behavior to abstract scrollYProgress ranges [0, 0.3, 0.5, 0.8] with no explicit tie to the heading's viewport position. If scrollYProgress 0.3–0.5 does not correspond to 'Heyo! centered' in the actual layout, the requirement and implementation would diverge — but without measuring the live page this is speculative.",
    "R4 requires 'must not be visibly clipped by section edges' but U4 only removes overflow:hidden from one inner div. If parent containers also clip, the fix may be insufficient. Cannot verify from document alone — depends on actual CSS cascade in styles.css."
  ],
  "deferred_questions": []
}