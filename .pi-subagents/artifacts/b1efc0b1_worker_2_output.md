```json
{
  "reviewer": "design-lens",
  "findings": [
    {
      "title": "Missing focus management in mobile menu overlay",
      "severity": "P1",
      "section": "IU-1: Fix Hamburger Menu",
      "why_it_matters": "Keyboard and screen reader users tabbing through the open mobile menu will reach elements behind the full-screen overlay, breaking the modal isolation and causing disorientation. The plan's `pointer-events: none` fix prevents mouse interaction with background elements but does not trap keyboard focus. Implementers who miss this will ship an accessibility regression.",
      "finding_type": "omission",
      "autofix_class": "gated_auto",
      "suggested_fix": "Add a focus-trap mechanism to the mobile-menu overlay: on open, focus the close button or first nav link; on Tab at last item, cycle back to first. Use `aria-hidden` on background content and `inert` attribute or equivalent when the menu is open.",
      "confidence": 75,
      "evidence": [
        "Plan text: 'Add `pointer-events: none` style to `.navbar-shell` when `open === true`' — only addresses mouse click-through, not keyboard focus.",
        "The mobile-menu is `position: fixed; z-index: 99997` but no focus management is mentioned anywhere in IU-1's changes or test scenarios."
      ]
    },
    {
      "title": "No empty or error state for scraped HTML content rendering",
      "severity": "P1",
      "section": "IU-3: Add Static Body Content Renderer",
      "why_it_matters": "The plan commits to rendering scraped Webflow HTML via `dangerouslySetInnerHTML` but defines no behavior for malformed HTML, empty strings, or content that references missing CDN images. Without an empty-state or error-state specification, implementers will either show a blank section with no user feedback or silently break the layout.",
      "finding_type": "omission",
      "autofix_class": "gated_auto",
      "suggested_fix": "Define: (a) when `contentHtml` is empty or null, render nothing (the section is omitted entirely, consistent with existing `content ? ... : null` pattern); (b) add an `onError` handler on `<img>` elements within the rendered HTML to show a styled placeholder or hide the broken image.",
      "confidence": 75,
      "evidence": [
        "IU-3 changes: 'Create StaticBody component ... that renders HTML content via dangerouslySetInnerHTML' — no mention of content-absent or render-failure states.",
        "Existing project page pattern: `{content ? <ProjectBody content={content} /> : null}` — the null path is the implicit empty state. The plan should make this explicit for the new StaticBody."
      ]
    },
    {
      "title": "Missing keyboard navigation for hash-link mobile menu items",
      "severity": "P1",
      "section": "IU-1: Fix Hamburger Menu",
      "why_it_matters": "The plan adds custom `onClick` handlers for `/#works`, `/#about`, `/#contact` links that first navigate to `/` then scroll. While `<a>` elements natively handle Enter key activation, the custom scroll-after-navigation logic (calling `scrollIntoView` or similar after route change) may break or double-fire on keyboard activation depending on how the handler is wired. Implementers need an explicit keyboard path.",
      "finding_type": "omission",
      "autofix_class": "gated_auto",
      "suggested_fix": "Keep the hash-link navigation as `<a href=\"/#works\">` elements so native keyboard activation works. The custom scroll logic should be in a `useEffect` that reads the hash from `window.location.hash` after route change and scrolls — this works for both click and keyboard activation identically.",
      "confidence": 75,
      "evidence": [
        "IU-1 changes: 'Update the onClick handler for hash-link mobile menu items: when navigating to /#works, /#about, or /#contact from a non-homepage route, first navigate to `/` then scroll to the section' — the scroll logic is only described as an onClick handler, not as a post-navigation effect.",
        "Using onClick for scroll-after-navigation is fragile on keyboard activation because the route change has not completed when the click handler returns."
      ]
    },
    {
      "title": "Missing gallery image error handling",
      "severity": "P2",
      "section": "IU-5: Download Gallery Images",
      "why_it_matters": "The plan's own Risk #1 acknowledges Webflow CDN images may have hotlink protection. When gallery images fail to load (403, broken path, or image doesn't exist at downloaded path), the existing `ProjectGallery` component shows nothing — tiles render with a loading-size container and missing alt text. The plan should define a fallback (styled placeholder, color swatch from accentColor, or hidden tile) so the gallery doesn't render broken image icons.",
      "finding_type": "omission",
      "autofix_class": "gated_auto",
      "suggested_fix": "Use Next.js Image `onError` callback to swap broken gallery images to a styled placeholder div using the project's accentColor as background, consistent with the existing `{coverUrl ? <Image ... /> : <div style={{backgroundColor: color}} />}` pattern in Works.tsx.",
      "confidence": 75,
      "evidence": [
        "IU-5 lists images to download but specifies no fallback behavior for download failures or broken paths.",
        "Risks section: 'Webflow CDN images may have hotlink protection' — acknowledged risk with no mitigation in any IU."
      ]
    },
    {
      "title": "Vague metadata placement for category tags, tools, and client name",
      "severity": "P2",
      "section": "IU-4: Display Project Metadata",
      "why_it_matters": "The plan says 'Show category tags on the project detail page (below title or in the content area)' — two different placements produce different reading experiences. Below the hero title makes them primary navigation cues; embedded in the content area makes them secondary meta-information. The implementer needs a single decision to avoid guesswork and rework.",
      "finding_type": "omission",
      "autofix_class": "manual",
      "suggested_fix": null,
      "confidence": 50,
      "evidence": [
        "IU-4 changes: 'Show category tags on the project detail page (below title or in the content area)' — the 'or' leaves two viable but meaningfully different placements unresolved.",
        "The Webflow reference page shows metadata (category, tools) in a sidebar-like area on some projects and in the page structure on others. A single decision is needed."
      ]
    },
    {
      "title": "No loading state specified for cross-page hash navigation",
      "severity": "P2",
      "section": "IU-1: Fix Hamburger Menu",
      "why_it_matters": "When a user on a project page taps 'Works' or 'Contact' in the mobile menu, the application navigates to `/` and then scrolls to the section. During the page transition, the user sees a brief loading/rendering flash. The plan doesn't specify what this transition looks like — whether the mobile menu should remain visible during navigation, whether there's a loading indicator, or whether the scroll should be instant or smooth.",
      "finding_type": "omission",
      "autofix_class": "manual",
      "suggested_fix": null,
      "confidence": 50,
      "evidence": [
        "IU-1: 'Update the onClick handler for hash-link mobile menu items: when navigating to /#works, /#about, or /#contact from a non-homepage route, first navigate to `/` then scroll to the section' — no mention of transition state or what user sees during navigation.",
        "The menu already closes on pathname change (useEffect), so the user would see the menu dismiss → brief homepage flash → scroll. This intermediate state is not addressed."
      ]
    }
  ],
  "residual_risks": [
    "Raw HTML from Webflow (scraped content) may include inline styles, span classes, and formatting that clash with the project's Tailwind/CSS design system — acknowledged as Risk #3 but may require more iteration than estimated.",
    "Tool/software icon sources are not specified — whether they'll be SVGs from public/images/, unicode/text badges, or downloaded from Webflow CDN. The plan lists icon names but not their asset source."
  ],
  "deferred_questions": [
    "Should category tags be displayed as colored pills, text labels, or icon+text combos? (Affects IU-4 styling scope.)",
    "Should tools/software names use official vector icons (downloaded) or styled text badges? (Affects IU-5 asset list.)"
  ]
}
```