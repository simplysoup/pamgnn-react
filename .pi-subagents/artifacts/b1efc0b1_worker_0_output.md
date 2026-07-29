## Review Complete — 6 Findings

**Review Team:** coherence-reviewer, feasibility-reviewer, design-lens-reviewer, scope-guardian-reviewer

### safe_auto (2 — ready to apply silently):
1. **Content audit miscount** — "5 of 8 projects" → "6 of 8 projects" (dynastic-wealth has a gallery entry)
2. **IU-2 file path** — Remove non-existent `src/components/project/ProjectPage.tsx`

### Manual (4 — need a decision):
3. **Hash navigation "or" fork** — Plan has two alternatives (onClick vs scrollBehavior). Pick one approach.
4. **HTML sanitization** — `dangerouslySetInnerHTML` on Webflow content needs sanitization (DOMPurify, stripping classes, or explicit CSS reset).
5. **"Back to work" link** — Should this be in IU-1 test scenarios? (minor)
6. **IU-3 priority** — Currently P1, but it's a prerequisite for content rendering. Recommend P0 or note dependency rationale.

---

**How would you like to proceed?**

1. **Apply safe_auto fixes + proceed** — Fix gallery count and file path, continue with plan as-is
2. **Walk through findings one by one** — Review each finding individually  
3. **Auto-resolve with best judgment** — Apply safe_auto fixes and use best judgment on the rest
4. **Append to Open Questions** — Add findings to plan's Open Questions, proceed
5. **Other** — Something else