#!/usr/bin/env python3
"""Build a one-page gallery of the whole section library for browsing/demo.

    python3 preview.py [theme.css] > gallery.html

Mounts every sections/*.html fragment (skipping _base and the scroll-video
sub-pipeline stub) into the _base scaffold with the given theme (default:
theme-tokens.css). Each section gets a slim label bar so you can tell
templates apart while scrolling.
"""
import re
import sys
from pathlib import Path

HERE = Path(__file__).parent
SECTIONS = HERE / "sections"
SKIP = {"_base.html", "hero-scroll-video.html"}
ORDER = [
    "hero-type.html", "hero-split.html", "logo-marquee.html",
    "feature-bento.html", "narrative-pin-steps.html", "stats-counter.html",
    "narrative-parallax.html", "horizontal-scroll.html",
    "testimonial-cards.html", "quote-card.html", "cta-final.html",
    "footer.html",
]

theme = Path(sys.argv[1]) if len(sys.argv) > 1 else HERE / "theme-tokens.css"
base = (SECTIONS / "_base.html").read_text()

names = ORDER + sorted(
    p.name for p in SECTIONS.glob("*.html")
    if p.name not in SKIP and p.name not in ORDER
)

PLACEHOLDER = (
    "data:image/svg+xml,"
    "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 3'%3E"
    "%3Crect width='4' height='3' fill='%238A7BB5'/%3E%3C/svg%3E"
)

parts = []
for name in names:
    frag = (SECTIONS / name).read_text()
    frag = re.sub(r"<!-- st:meta.*?-->", "", frag, flags=re.S).strip()
    frag = re.sub(r'src="assets/[^"]+"', f'src="{PLACEHOLDER}"', frag)
    parts.append(
        f'<div class="st-gallery-label"><span>{name}</span></div>\n{frag}'
    )

label_css = """
  <style>
    .st-gallery-label{position:sticky;top:0;z-index:900;display:flex;justify-content:center;pointer-events:none}
    .st-gallery-label span{font:700 12px/1 var(--st-font-mono);letter-spacing:.08em;
      background:var(--st-ink);color:var(--st-ink-inv);padding:6px 14px;border-radius:0 0 10px 10px}
  </style>
"""

html = base.replace("PROJECT_TITLE", "site-world — section gallery")
html = html.replace("PROJECT_DESCRIPTION", "Every section template, one page.")
html = html.replace('<link rel="stylesheet" href="theme.css" />',
                    '<style id="st-theme">\n' + theme.read_text() + "\n</style>" + label_css)
html = html.replace("<!-- sections go here, in blueprint order -->",
                    "\n\n".join(parts))
sys.stdout.write(html)
