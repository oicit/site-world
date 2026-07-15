---
name: site-world
description: >
  Build a complete, agency-grade website — not just a hero. Runs a structured
  pipeline: creative-brief interview → pick-one-of-three style tiles → page
  blueprint from a curated section library → asset generation → token-driven
  assembly with GSAP motion → a screenshot-driven QA loop that iterates until
  the page passes a scored rubric. Composes the other installed skills
  (ui-design, gsap-*, imagen, scroll-world for video heroes). Use when the user
  wants a "fancy website", "high-end landing page", "agency-quality site",
  "官网", "高端落地页", a portfolio, a product-launch page, or a full site
  where scroll-world alone (one video hero) isn't enough.
allowed-tools: Bash, Read, Write, Edit, AskUserQuestion, Skill
---

# site-world

Produces a complete premium website as **clean static code** (HTML/CSS/JS +
optional GSAP). The value is not "generating HTML" — Claude can always do that.
The value is three disciplines this skill enforces:

1. **Taste is decided once, up front** — an approved style tile becomes
   `theme.css` design tokens, and every section may only reference tokens.
2. **Sections are assembled, not improvised** — from a curated library of
   self-contained, battle-tested templates (`references/sections/`).
3. **Nothing ships without the QA loop** — full-page screenshots, scored
   against a rubric, iterated until it passes.

Companion skills — check what's installed, use what's there, degrade gracefully
when it isn't (none are hard requirements): `gsap-core` / `gsap-scrolltrigger` /
`gsap-timeline` (motion), an image-generation skill (e.g. `imagen`) for assets,
`scroll-world` (scroll-scrubbed video hero — generated or user footage),
`webapp-testing` (Playwright), plus any personal effect/pattern library skill
the user keeps.

---

## Non-negotiable design rules

These override anything a template or model instinct suggests:

- **No grey-text hierarchy.** Never use grey text colors (#666…#ccc) or opacity
  on text to signal "secondary". Hierarchy comes from font size, weight, real
  secondary *hues*, color blocks/backgrounds, and spacing. (`--st-ink-2` is a
  hue-shifted color, not a grey.)
- **Token-only styling.** After the style tile is frozen, no raw hex/font names
  inside sections — only `var(--st-*)`. A grep for `#[0-9a-fA-F]{3,6}` outside
  `theme.css` must come back empty (QA checks this).
- **Motion must degrade.** Every animation respects
  `prefers-reduced-motion: reduce` (show the settled state, skip the show).
- **No horizontal overflow, ever.** Wide content scrolls inside its own
  container. QA measures `document.documentElement.scrollWidth`.
- **The body never jumps.** Transform/opacity animations only; no animating
  layout properties (top/left/width/height/margin).
- **Real content beats lorem.** If the user hasn't supplied copy, write real,
  specific draft copy from the brief and mark it clearly for their review.

---

## Step 1 — Creative brief (interview)

Ask openly (plain prose, not multiple-choice) for: the subject and one-line
pitch; the audience; the single job of the page (convert / showcase / narrate);
tone words; any reference sites they admire (fetch and study them if given);
existing brand assets (logo, palette, fonts, footage). Default what you can,
ask only what you can't.

**Write the brief to a file as you go** — `docs/specs/YYYY-MM-DD-<project>-brief.md`
in the user's project — covering: pitch, audience, page job, tone words,
references + what to steal from each, asset inventory, and the section wishlist.
Every later step scores against this document.

## Step 2 — Style tiles (pick one of three)

Generate **three** contrasting style tiles from
`references/style-tile-template.html` — each a self-contained HTML page with
its candidate tokens filled in: font pairing, palette swatches, radius/shadow
language, motion words, and one fully-styled sample section so the tile is
judged as a *page*, not a color chart. Name them by their personality (e.g.
"Editorial Serif", "Neo-Brutal", "Soft Tech"), serve the folder, let the user
open all three, then ask which one wins (`AskUserQuestion`; offer "mix: X's
type + Y's palette" as a valid answer).

Freeze the winner as `theme.css`. Contract in
`references/theme-tokens.css` — copy it, fill the values, never add tokens
mid-build without noting them in the brief doc.

## Step 3 — Page blueprint

Read `references/sections/INDEX.md` (the catalog: what each template is for,
its interaction, mobile behavior). Propose an ordered blueprint derived from
the page's job — typically: hero → narrative/feature sections → proof →
final CTA → footer. For each slot name the template, the content it needs, and
the motion notes. **Append the blueprint to the brief doc**, show the user the
one-screen summary, and let them cut/reorder before any assembly. A video
fly-through hero = invoke `scroll-world` for that slot (it stays a standalone
sub-pipeline; embed its output as the hero).

## Step 4 — Assets

Batch-generate what the blueprint needs before assembly: images via `imagen` /
`baoyu-image-gen` (one shared style preamble per project — same discipline as
scroll-world's world-cohesion rule), video/frames via `scroll-world`'s
pipeline, knockouts via its `knockout.py`. Run a consistent grade/palette over
everything. Keep sources; export web sizes (WebP, ≤200KB per image unless
full-bleed).

## Step 5 — Assemble

Scaffold: `index.html` + `theme.css` + `site.js` + `assets/`. Then per blueprint
slot: copy the section template, reskin **through tokens only**, replace
content, wire motion. GSAP usage follows the `gsap-*` skills (registration,
cleanup, `matchMedia` for reduced-motion/responsive variants); sections that
ship with vanilla IntersectionObserver reveals need no GSAP — don't add it
where it buys nothing. Keep each section's CSS/JS scoped by its `st-<name>`
class prefix so sections stay portable.

## Step 6 — QA loop (do not ship without it)

Run `references/qa-harness.mjs` (Playwright): full-page scroll screenshots at
desktop + phone widths, reduced-motion pass, console-error capture, horizontal
overflow check, raw-hex token audit, and a weight budget. Then **self-review
the screenshots against `references/qa-rubric.md`**, scoring each dimension
against the brief doc. Fix, re-run, repeat until every dimension passes. Report
the final scorecard to the user with the screenshots.

## Step 7 — Harvest (grow the library)

After a project ships, harvest anything new or improved back into
`references/sections/` as a self-contained template (meta comment header:
purpose, interaction, mobile behavior, source project) and add its row to
`INDEX.md`. The library compounding over real projects is the moat — never
skip this step.

## References

- `references/theme-tokens.css` — the token contract every theme must fill.
- `references/style-tile-template.html` — single style-tile page with
  placeholder tokens; generate three variants from it.
- `references/sections/INDEX.md` — the section catalog (browse before
  blueprinting); `references/sections/*.html` — the templates themselves.
- `references/preview.py` — builds a one-page gallery of the whole section
  library with a chosen theme (`python3 preview.py [theme.css] > gallery.html`)
  for browsing or client demos.
- `references/qa-harness.mjs` — Playwright QA runner (screenshots + automated
  checks). `node qa-harness.mjs <url> [outdir]`.
- `references/qa-rubric.md` — the scored self-review rubric; a page ships only
  when every dimension passes.
