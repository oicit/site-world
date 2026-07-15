# Section catalog

Browse this before blueprinting (SKILL Step 3). Every template is
self-contained (scoped CSS + idempotent JS), token-only (`--st-*`), respects
reduced-motion, and never overflows horizontally. `_base.html` is the scaffold
they all mount into (provides `.st-wrap`, `.st-reveal`, the shared observer).

| Template | Slot | Use when | Interaction |
|---|---|---|---|
| `_base.html` | scaffold | always — start here | shared reveal observer |
| `hero-type.html` | hero | strong verbal identity, no hero art | staggered line rise on load |
| `hero-split.html` | hero | strong hero image / product render | reveal + slow float |
| `hero-scroll-video.html` | hero | cinematic fly-through (scroll-world sub-pipeline) | scroll-scrubbed video |
| `narrative-pin-steps.html` | story | how-it-works, process, 3–5 beats | sticky stage, visuals swap per step |
| `narrative-parallax.html` | breather | statement between dense sections | layered rAF parallax |
| `feature-bento.html` | features | 4–7 features, one flagship | staggered cells, hover lift |
| `stats-counter.html` | proof | numbers are the argument | count-up on entry |
| `quote-card.html` | peak | ONE emotional line per page | word-by-word rise (CJK-aware) |
| `logo-marquee.html` | proof | 5+ recognizable logos | CSS infinite marquee, hover pause |
| `horizontal-scroll.html` | gallery | lineup / timeline / portfolio pieces | snap rail, drag on desktop |
| `testimonial-cards.html` | proof | 2–3 short quotes with faces | staggered reveal |
| `cta-final.html` | close | always, second-to-last | subtle pulse ×3 |
| `footer.html` | footer | always | none, deliberately |

Composition rules of thumb:
- One hero, one `quote-card` max, `cta-final` + `footer` always last.
- Alternate density: dense (bento/rail) → breather (parallax/quote) → dense.
- Bands own their backgrounds (`--st-bg` / `--st-surface-2` / `--st-ink`);
  aim for a light–dark rhythm down the page, not one flat sheet.
- 5–8 sections is a complete page. More than 9 means the brief is unfocused.

Harvesting (SKILL Step 7): new template = this file's row + a `st:meta` header
(purpose / interaction / mobile / source project) + token-only styling.
