# Visual Diff Report: pamgnn.webflow.io vs 76.13.4.115

## Project Detail Page: `/project/comfortabull`

**Generated:** $(date -u +"%Y-%m-%d %H:%M UTC")
**Branch:** feat/project-page-motion
**Baseline:** df87bb4e

---

## Executive Summary

Our local Next.js/Payload implementation is structurally **more complete in some areas** (motion/animation, gallery modal, related projects, SEO metadata) but **significantly behind in visual content density** compared to the Webflow original. The Webflow version includes **7+ rich brand presentation images**, a **sidebar with client/role/tools metadata**, and **embedded process diagrams** that our version renders as plain text. The local page is ~100KB screenshot vs 4.4MB for Webflow — a ~44× visual content deficit.

---

## 1. Visual Screenshot Comparison

| Metric                |    Webflow Original     |       Local (Our Version)       |
| --------------------- | :---------------------: | :-----------------------------: |
| Viewport screenshot   |         675 KB          |              26 KB              |
| Full-page screenshot  |    4,411 KB (4.4 MB)    |             100 KB              |
| Images in page        |           16            | 5 (related cards) + 1 (gallery) |
| Unique content images | 8 detailed brand images |          1 cover image          |

**Key visual observation:** The Webflow version is image-heavy with responsive brand presentation images throughout; our version relies on text content with a single static cover image and no process/design images embedded in the body.

---

## 2. Layout Structure Comparison

### Webflow Page Layout (top → bottom)

```
┌─ NAVBAR ──────────────────────────────────────────┐
│  Logo + HOME / Works / WEB DESIGN / REEL / About / Contact  │
├─ SECTION ─────────────────────────────────────────┤
│  HEADLINE: "Comfortabull"                         │
│  Summary paragraph                                │
├─ PROJECT BODY ────────────────────────────────────┤
│  [IMAGE 1] Brand Presentation cover (1650px)      │
│  [VIDEO EMBED] (w-dyn-bind-empty — not populated) │
├─ GRID: DETAILS SIDEBAR ───────────────────────────┤
│  │  LEFT (sidebar):          │ RIGHT (content):   │
│  │  Client: Comfortabull     │ Rich text para     │
│  │  Category: Branding       │                    │
│  │  Role: Creative Direction │                    │
│  │  Tools: Clip Studio / PS  │                    │
│  │         / Illustrator     │                    │
├─ [IMAGE 2] Ideation sketch (1921px) ──────────────┤
├─ GRID: IDEATION ──────────────────────────────────┤
│  │  LEFT: "IDEATION" heading   │ RIGHT: 3 parags │
├─ [IMAGE 3] Third sketch (1921px) ─────────────────┤
├─ GRID: SIDE-BY-SIDE ──────────────────────────────┤
│  │  [IMAGE 4a] 550px wide      │ [IMAGE 4b] 747px│
├─ "NEXT UP: TYPEFACE" rich text ───────────────────┤
├─ [IMAGE 5] Typeface exploration (1921px) ─────────┤
├─ Social branding text ───────────────────────────┤
├─ GRID: SIDE-BY-SIDE ──────────────────────────────┤
│  │  [IMAGE 6a] 747px wide      │ [IMAGE 6b] 550px│
├─ RELATED PROJECTS (text-only links) ──────────────┤
├─ FOOTER ──────────────────────────────────────────┤
│  © 2026 Pamela Desplenter + Social links          │
└───────────────────────────────────────────────────┘
```

### Local Page Layout (top → bottom)

```
┌─ NAVBAR ──────────────────────────────────────────┐
│  Logo + HOME / Works / WEB DESIGN / REEL / About /  │
│         Contact + Hamburger menu                   │
├─ HERO (animated, bg: #141d37) ────────────────────┤
│  ← Back to work (animated)                        │
│  "Comfortabull" (letter-by-letter animation)      │
│  Optional cover image with parallax               │
├─ META SECTION ────────────────────────────────────┤
│  Category tags: identity, web-design              │
├─ GALLERY ─────────────────────────────────────────┤
│  [GALLERY TILE] cover image with fullscreen modal │
├─ CONTENT SECTION ─────────────────────────────────┤
│  PROJECT SUMMARY (word-by-word animation)         │
│  PROJECT BODY (text only, scroll-reveal)          │
├─ RELATED PROJECTS (4 cards with images) ──────────┤
│  Camp Brigitte | Vaughan FF | Dynastic | Shinee   │
├─ FOOTER ──────────────────────────────────────────┤
│  Social icons + © 2026 Pamela Desplenter          │
└───────────────────────────────────────────────────┘
```

---

## 3. Detailed Gap Analysis

### 3.1 — Project Hero & Header ✅ (Local wins)

| Aspect           | Webflow                        | Local                         | Status                |
| ---------------- | ------------------------------ | ----------------------------- | --------------------- |
| Background color | `#141d37`                      | `#141d37`                     | ✅ Match              |
| Title            | `Comfortabull` (static h1)     | Animated letter-by-letter     | ✨ Local better       |
| Summary          | Below headline in same section | Separate summary component    | ⚠️ Different position |
| Back link        | Not present                    | "← Back to work" animated     | ✨ Local better       |
| Cover image      | Not shown in hero              | Optional parallax cover image | ✨ Local better       |
| Accent sweep     | Not present                    | Animated sweep overlay        | ✨ Local better       |

### 3.2 — Project Details / Metadata ⛔ (Major gap)

| Field    | Webflow                                   | Local                    |         Gap         |
| -------- | ----------------------------------------- | ------------------------ | :-----------------: |
| Client   | `Comfortabull` displayed                  | Not shown                |         ❌          |
| Category | `Branding`                                | `identity`, `web-design` | ⚠️ Different values |
| Role     | `Creative Direction, Full Brand Design`   | Not shown                |         ❌          |
| Tools    | Clip Studio, Photoshop, Illustrator icons | Not shown                |         ❌          |
| Layout   | 12-column grid (sidebar + content)        | Single-column            |         ❌          |

**Changes needed:**

- Add a `client` field to `StaticProject` type and display it in the meta section
- Add a `role` field with value from Webflow's "Our Role"
- Add tool icons (Clip Studio Paint, Photoshop, Illustrator)
- Redesign meta section as a 12-column grid with sidebar layout

### 3.3 — Content Images ⛔ (Critical gap)

| Position              | Webflow Image                              | Local      |
| --------------------- | ------------------------------------------ | ---------- |
| After headline        | Brand presentation cover (1650px)          | ❌ Missing |
| After ideation text   | Ideation sketch (1921px)                   | ❌ Missing |
| After third paragraph | Third sketch (1921px)                      | ❌ Missing |
| Side-by-side          | Two process images (550px + 747px)         | ❌ Missing |
| After typeface text   | Typeface exploration (1921px)              | ❌ Missing |
| After social text     | Two social branding images (747px + 550px) | ❌ Missing |

**Changes needed:**

- Add all 6+ brand presentation images to the static project data
- Create a new `ProjectMediaSection` component that can render:
  - Full-width single images with rounded corners
  - Side-by-side image grids (12-column split)
  - Content sections with sidebar metadata

### 3.4 — Content Body Layout ⚠️

| Aspect             | Webflow                                          | Local                  |
| ------------------ | ------------------------------------------------ | ---------------------- |
| Paragraph split    | 4 separate rich-text blocks                      | Single HTML string     |
| Interleaved images | Yes — images between text blocks                 | No — all text together |
| Section headings   | Sidebar headings "IDEATION", "NEXT UP: TYPEFACE" | Inline in content      |
| Full brand images  | 16 total images with srcset                      | 1 cover image          |

**Changes needed:**

- Split the `contentHtml` string into sections matching Webflow's layout
- Interleave images between text sections using a structured data model
- Add responsive image srcset support matching Webflow's sizes

### 3.5 — Related Projects ⚠️

| Aspect          | Webflow                                                                 | Local                                    |
| --------------- | ----------------------------------------------------------------------- | ---------------------------------------- |
| Style           | Text-only links in a list                                               | Image cards with overlay                 |
| Projects linked | Vaughan, Social Media, Shinee, Pearl, Dynastic, Camp Brigitte, Animated | Camp Brigitte, Vaughan, Dynastic, Shinee |
| Layout          | Single-column list                                                      | 4-card grid                              |

**Changes needed:**

- Webflow's related projects are just text links at the bottom — our card grid is visually richer ✅
- Update the related projects list to include all 7 projects

### 3.6 — Video Embed

| Aspect               | Webflow                                  | Local          |
| -------------------- | ---------------------------------------- | -------------- |
| Video embed location | After first image                        | ❌ Not present |
| State                | `w-dyn-bind-empty` (no video configured) | N/A            |
| **Action**           | No video needed (bind-empty)             | ✅ No action   |

### 3.7 — Motion & Animation ✅ (Local wins)

| Feature          | Webflow | Local                            |
| ---------------- | ------- | -------------------------------- |
| Letter animation | None    | ✅ Letter-by-letter title reveal |
| Scroll parallax  | None    | ✅ Hero image parallax           |
| Scroll reveal    | None    | ✅ Project summary word-by-word  |
| Scroll reveal    | None    | ✅ Body content fade-up          |
| Scroll reveal    | None    | ✅ Gallery tiles staggered       |
| Scroll reveal    | None    | ✅ Related cards staggered       |
| Hover effects    | None    | ✅ Gallery tile scale on hover   |
| Fullscreen modal | None    | ✅ Image gallery with lightbox   |

### 3.8 — Footer

| Aspect        | Webflow                              | Local                       |
| ------------- | ------------------------------------ | --------------------------- |
| Copyright     | © 2026 Pamela Desplenter             | ✅ Same                     |
| Social icons  | YouTube, Mail, LinkedIn, Vimeo (SVG) | ✅ Same                     |
| Bottom navbar | Has redundant nav with logo          | ❌ Not present (not needed) |

---

## 4. Priority Action Items

### 🔴 P0 — Must fix to match Webflow

1. **Add all 8 content images to `/project/comfortabull`**
   - Source: Webflow CDN at `https://cdn.prod.website-files.com/6a3793b7f517f1fa0da5a7c7/`
   - Images: brand presentation cover, 4 process/ideation sketches, 2 typeface exploration images, social branding images
   - Download and store in `/public/images/project-comfortabull/`

2. **Structured content model for interleaved images**
   - Replace single `contentHtml: string` with a section array:
     ```ts
     type ContentSection =
       | { type: 'text'; html: string }
       | { type: 'image'; src: string; alt: string; width?: number }
       | { type: 'grid'; columns: { type: 'sidebar' | 'content'; children: ContentSection[] } }
       | {
           type: 'side-by-side'
           left: { src: string; width: number }
           right: { src: string; width: number }
         }
     ```

3. **Project details sidebar**
   - Add Client, Category, Our Role fields
   - Add tool icons for Clip Studio Paint, Photoshop, Illustrator
   - Implement 12-column grid layout matching Webflow's `grid-12-columns`

### 🟡 P1 — Should fix

4. **Section headings as sidebar labels**
   - Convert "IDEATION" into a sidebar heading (matching Webflow's layout)
   - Same for "NEXT UP: TYPEFACE" (currently inline H2)

5. **Meta section refinement**
   - Change category from `['identity', 'web-design']` to match Webflow's `Branding`
   - Add client display

6. **Related projects format**
   - Keep our card design (better than Webflow's text links)
   - Ensure all projects are linked

### 🟢 P2 — Nice to have

7. **Responsive image optimization**
   - Add Webflow-style srcset with multiple breakpoints (500w, 800w, 1080w, 1600w)

---

## 5. Data Extraction for Image Download

The following images need to be downloaded from Webflow CDN:

| #   | Filename                                          | URL (CDN)                  | Width  |
| --- | ------------------------------------------------- | -------------------------- | :----: |
| 1   | `ComfortaBull-BrandPresentation-v6_page-0001.jpg` | `6a440d391823155e53e0b4d5` | 1650px |
| 2   | `second img-100.jpg`                              | `6a3c295350d3c83fdabe45f5` | 1921px |
| 3   | `third img-100.jpg`                               | `6a3c295b1bc2ba6dc3061aef` | 1921px |
| 4   | `third pt1-100.jpg`                               | `6a3c2964780c0a7f2c074059` | 1081px |
| 5   | `third pt2-100.jpg`                               | `6a3c2961850ff71ddfe47ece` | 1001px |
| 6   | `fourth img-100.jpg`                              | `6a3c296d9b2da7a01db6441e` | 1921px |
| 7   | `fourth pt2-100.jpg`                              | `6a3c24c89eaf2212afc3b7b3` | 1001px |
| 8   | `fourth pt1-100.jpg`                              | `6a3c24db1a546dee7ff9eb34` | 1081px |

CDN prefix: `https://cdn.prod.website-files.com/6a3793b7f517f1fa0da5a7c7/`

---

## 6. Screenshot Evidence

Files captured during this audit:

| File                    | Description                      |  Size  |
| ----------------------- | -------------------------------- | :----: |
| `webflow-viewport0.png` | Webflow at 1440×900 viewport     | 675 KB |
| `webflow-full.png`      | Webflow full-page (10000px tall) | 4.4 MB |
| `local-viewport0.png`   | Local at 1440×900 viewport       | 26 KB  |
| `local-full.png`        | Local full-page (10000px tall)   | 100 KB |
| `wf-cover.jpg`          | Webflow brand presentation cover | 1.8 MB |
| `wf-img2.jpg`           | Webflow ideation sketch          | 1.5 MB |

> **Note:** Local page screenshots are small (~26-100 KB) because the Next.js page renders mostly text without the content images that give the Webflow version its visual density.

---

## 7. Technical Differences Summary

| Category         | Webflow                  | Local (Next.js)                  |
| ---------------- | ------------------------ | -------------------------------- |
| Platform         | Webflow CMS              | Next.js + Payload CMS            |
| Navigation       | Webflow native (`w-nav`) | Custom React navbar              |
| Responsive       | Webflow auto-responsive  | Custom CSS with breakpoints      |
| Images           | CDN with srcset          | Next.js Image with optimization  |
| Motion           | None (static page)       | Framer Motion animations         |
| Content model    | CMS collection fields    | Static TypeScript data + Payload |
| SEO meta         | Minimal                  | Full meta with description       |
| Related projects | Text list                | Image cards with overlays        |
| Gallery          | No gallery               | Full image gallery with modal    |
| Video            | Empty embed slot         | Not implemented                  |

---

_This report was generated by visually comparing screenshots and HTML structure between the Webflow original and the local Next.js implementation._
