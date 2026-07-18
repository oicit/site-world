# site-world

An agent skill — for Claude Code, Codex, and any `SKILL.md`-compatible agent —
that builds **complete, agency-grade websites** through an enforced pipeline,
and ships nothing that hasn't passed a screenshot-driven QA loop.

**Demo: [oicit.github.io/site-world](https://oicit.github.io/site-world/)** —
the skill's own landing page, assembled by the skill from its own section
library ([source](docs/index.html)), gated by its own QA harness.

Output is always **plain static HTML/CSS/JS**. No framework, no platform, no
lock-in — drop the folder on any static host.

## How this is different

Plenty of tools "build websites". They fall into three families, and site-world
deliberately isn't any of them:

| Family | What you get | The gap |
|---|---|---|
| AI site generators (v0, Lovable, bolt…) | a one-shot codegen of the whole site | quality is a dice roll per prompt; style drifts section to section; output is framework-locked |
| Component libraries (shadcn, Tailwind UI…) | good parts | no process — *you* are still the art director, assembler, and QA; framework-bound |
| Templates | a fixed design | content swap only; the design can't recompose to your brief |

site-world is a **process with gates**, not a generator:

1. **Taste is decided once, then enforced mechanically.** You pick one of three
   style tiles; the winner is frozen into `theme.css` design tokens. From that
   moment sections may only reference tokens — the QA harness literally greps
   for raw hex values and fails the build. Style cannot drift, because drift is
   a detectable error, not a vibe.
2. **Sections are assembled, not improvised.** Pages are composed from a
   library of self-contained templates — zero-dependency vanilla JS/CSS, scoped
   class prefixes, `prefers-reduced-motion` fallbacks, mobile behavior, CJK-aware
   text effects — each one already debugged. Codegen roulette is replaced by
   verified parts.
3. **Nothing ships without the QA loop.** A Playwright harness takes full-page
   screenshots at desktop/phone widths plus a reduced-motion pass, checks
   horizontal overflow, console errors, token violations, and page weight; then
   the agent scores the screenshots against a 10-dimension rubric (hierarchy,
   rhythm, motion taste, content honesty…) and iterates until every dimension
   passes. The rubric is a file you can read and edit, not a black box.
4. **The library compounds — it's yours.** Step 7 of the pipeline is
   *harvesting*: after each real project, new or improved sections go back into
   the library with metadata. Your 10th site is better than your 1st because
   your library got thicker. A one-shot generator starts from zero every time.
5. **Agent-native, human as art director.** The skill interviews for a creative
   brief, proposes, and executes — but the two taste decisions (style tile,
   page blueprint) are always yours. It also composes other installed skills
   when present: GSAP skills for motion, image-generation skills for assets,
   [scroll-world](https://github.com/oso95/scroll-world) for a scroll-scrubbed
   video hero.

## Install

### Claude Code — as a plugin (recommended)

```
/plugin marketplace add oicit/site-world
/plugin install site-world@site-world
```

Then ask for a website ("build me a landing page for …") or let the skill
trigger on "fancy website", "官网", "高端落地页", etc.

### Manually (drop-in skill)

```bash
git clone https://github.com/oicit/site-world
cp -R site-world/skills/site-world ~/.claude/skills/   # Claude Code
cp -R site-world/skills/site-world ~/.codex/skills/    # Codex
```

## The pipeline

```
brief interview ──► 3 style tiles ──► theme.css tokens (frozen)
      │                  ▲ you pick one
      ▼
page blueprint from the section catalog   ◄── you cut/reorder
      ▼
assets (image-gen / scroll-world video, one shared style)
      ▼
assembly: sections reskinned through tokens ONLY
      ▼
QA loop: playwright screenshots ──► rubric score ──► fix ──► repeat
      ▼                                   (every dimension ≥ 4/5)
static site + scorecard
```

## What's in the box

```
skills/site-world/
├── SKILL.md                     the pipeline + non-negotiable design rules
└── references/
    ├── theme-tokens.css         the token contract every theme must fill
    ├── style-tile-template.html generate 3 variants, user picks one
    ├── qa-harness.mjs           playwright: shots + overflow/console/token/weight checks
    ├── qa-rubric.md             the 10-dimension scored self-review
    ├── preview.py               renders the whole library as one gallery page
    └── sections/                the library (self-contained, token-only)
        ├── INDEX.md             catalog + composition rules
        ├── _base.html           scaffold: reset, tokens, shared reveal observer
        ├── hero-type / hero-split / hero-scroll-video
        ├── narrative-pin-steps / narrative-parallax
        ├── feature-bento / horizontal-scroll
        ├── stats-counter / quote-card / logo-marquee / testimonial-cards
        └── cta-final / footer
```

Browse the library:

```bash
cd skills/site-world/references && python3 preview.py > gallery.html && open gallery.html
```

Run QA against any page:

```bash
npm i playwright && npx playwright install chromium
node skills/site-world/references/qa-harness.mjs http://localhost:8000 qa-out
```

## Design rules the skill enforces

- No grey-text hierarchy (weight, size, real hues, and spacing instead —
  `--st-ink-2` is a hue, never a grey)
- Token-only styling after the tile freeze (audited, not requested)
- Every animation degrades under `prefers-reduced-motion`
- No horizontal overflow, ever (measured at two widths)
- Transform/opacity animations only — layout never jumps
- Real draft copy from the brief, never lorem

## Growing your library

After a project ships, harvest anything new back into
`references/sections/` — an `st:meta` header (purpose / interaction / mobile /
source project), token-only styling, a row in `INDEX.md`. That compounding
library is the point of the skill.

## License

MIT
