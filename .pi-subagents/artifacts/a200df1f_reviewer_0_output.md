Now I have all findings compiled. Here is the structured review:

## Review

### Correct (what is already good)

- **Type definitions** (`src/types/content-sections.ts`): The discriminated union is clean, well-typed, and matches plan R1–R7 exactly. Each subtype has the required fields. ✓
- **Component architecture** (`StructuredBody.tsx`): Entry point correctly dispatches by `section.type` discriminator. The pattern supports extending with new section types (just add a case). ✓
- **SectionText** (`SectionText.tsx`): Correctly handles all three heading variants (none, `h2`, `sidebar`). Scroll-reveal animation using `useInView` with `once: true` matches the project's existing animation language. ✓
- **SectionDetailsGrid** (`SectionDetailsGrid.tsx`): The 12-column grid layout (span-3 sidebar + span-9 content) matches plan R15. Tool icon lookup via `TOOL_ICONS` map is clean and extensible. Nested section rendering via `NestedSection` supports composability per KTD2. ✓
- **Backward compatibility** (`page.tsx`): The fallback logic is correct — `sections` takes priority, then `StaticBody` with `contentHtml`, then nothing. The render condition `{!sections && contentHtml && !content ? ...}` correctly excludes structured projects from rendering static HTML. ✓
- **Comfortabull static data**: All 8 Webflow CDN images are present in `public/images/project-comfortabull/` (verified). Three tool icons in `public/images/tools/`. Meta data includes client, role, tools, and categories updated to `['branding']` per R10. ✓
- **TypeScript compilation**: `npx tsc --noEmit` passes with zero errors across all new code. ✓
- **CSS layout primitives**: The CSS for `.content-grid-12`, `.content-sidebar`, `.content-main`, side-by-side grid, sidebar details, and heading styles are all well-structured and complete. ✓
- **Image files**: All 8 comfortabull images and 3 tool icons exist on disk with correct filenames. ✓

### Blocker (critical — must be resolved before proceeding)

1. **`src/components/project/SectionFullWidthImage.tsx:17`** — Invalid CSS `aspect-ratio` value. The expression `width ? \`${width} / auto\` : '16 / 9'` produces strings like `"1650 / auto"`. CSS `aspect-ratio` does not accept `auto` as a ratio divisor; valid syntax is `auto | <number> | <number> / <number> | auto <ratio>`. The value `1650 / auto` is invalid, browsers ignore the declaration, and the `position: relative` container collapses to 0 height. All `<Image fill>` images in `SectionFullWidthImage` will be invisible.
   - **Suggested fix**: Add `height` to the `SectionFullWidthImage` type (and `ImageSection` type for side-by-side), store both dimensions in seed data, compute `aspectRatio = width / height` as a numeric expression. Actual image dimensions are known: 1650×1275, 1921×1081, 1081×1081, 1001×1001, 1921×1080.
   - **Requires verification**: YES

2. **`src/app/(frontend)/styles.css` lines 1577 vs 1583** — CSS cascade bug: mobile `.content-section { padding: 40px 0; }` is defined inside the `@media (max-width: 767px)` block (line 1577), but the base `.content-section { padding: 60px 0; }` is defined AFTER it (line 1583). Both have identical selector specificity (single class). Because the base rule comes later in the stylesheet, it wins the cascade on **all** viewport sizes, defeating the mobile override. On mobile, sections will have 60px padding instead of the intended 40px.
   - **Suggested fix**: Move the mobile `.content-section` rule after line 1583's base rule (either outside the media query block and into a separate mobile override after the content-section block, or restructure the media query to appear after all base rules).
   - **Requires verification**: YES

### Note (observation or follow-up)

3. **`src/app/(frontend)/project/[slug]/page.tsx` lines 332–373** — Duplicate metadata rendering for Comfortabull. The page renders a `project-meta-section` showing categories (`['branding']`) and client (`'Comfortabull'`) from the project-level data. The first section in the `sections` array is a `detailsGrid` that also renders a sidebar showing Client, Category, Our Role, and Tools. This creates visual redundancy. The plan doesn't explicitly address whether `project-meta-section` should be hidden when `sections` is present. Consider hiding `project-meta-section` when structured sections are available, or accept the redundancy if the sidebar serves as a different visual presentation (detail grid vs. quick summary).

4. **`src/components/project/SectionDetailsGrid.tsx` line 68** — Tool icon alt text uses slug strings (`alt={slug}` → "clip-studio", "photoshop", "illustrator"). Acceptable for 28×28 decorative icons, but if accessibility is a concern, use human-readable names like "Clip Studio Paint", "Adobe Photoshop", "Adobe Illustrator".

5. **`src/components/project/StructuredBody.tsx` line 24** — Uses array index as React key (`key={index}`). Acceptable for static, non-reordered content (Comfortabull's section order never changes). Not a bug, but worth noting if dynamic reordering is ever added.

6. **`src/components/project/SectionDetailsGrid.tsx` lines 46–54** — `NestedSection` component passes `key={index}` to each rendered child. The caller also passes `key={i}` on `NestedSection`. Both keys exist; the outer key is sufficient for React reconciliation. The inner key is redundant but harmless.

7. **`src/app/(frontend)/project/[slug]/page.tsx` lines 396–398** — The render condition for `StaticBody` is `!sections && contentHtml && !content`. This means if a CMS project has both `content` (RichText) and `sections` set, only `StructuredBody` renders and `ProjectBody` for rich text content is also suppressed. Currently no CMS projects have `sections`, so this is theoretical. When CMS block-based sections are added, content migration or a combined render should be considered.

8. **`src/types/content-sections.ts`** — No `height` field in `SectionFullWidthImage` or `ImageSection`. The plan (R4) specifies `width` for aspect ratio, but CSS `aspect-ratio` requires both dimensions to compute a ratio. Either the plan's design needs revision to add `height`, or the implementation must use a different approach (e.g., Next.js intrinsic dimensions without `fill`, or a fixed 16/9 default fallback). This is the root cause of Blocker #1.

---

## Acceptance Report