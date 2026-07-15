# QA rubric — self-review of the screenshots

Run after `qa-harness.mjs` passes its automated checks. Look at the ACTUAL
full-page screenshots (desktop, phone, reduced-motion) and score each dimension
**against the brief doc** 1–5. Ship only when every dimension ≥ 4; anything
lower gets a written fix note, the fix, and a re-run. Report the scorecard to
the user.

| # | Dimension | What 5 looks like | Common failures to hunt |
|---|---|---|---|
| 1 | Brief fit | A stranger could state the page's one job after 5s of the hero | generic headline; CTA asks for the wrong thing |
| 2 | Hierarchy | Eye lands: headline → proof → CTA, in order, on every band | two elements shouting at once; body text sized like UI chrome |
| 3 | Rhythm | Consistent section gaps; light/dark bands alternate with intent | one flat sheet of same-background sections; random paddings |
| 4 | Type discipline | 2 families max; sizes only from the token scale | ad-hoc font-size; display font used for body |
| 5 | Color discipline | Token colors only; accent means "act here", nowhere else | accent used decoratively everywhere; **any grey-text hierarchy (banned)** |
| 6 | Motion taste | Motion explains or rewards; nothing loops forever in view | reveal-everything; parallax on text; three things animating at once |
| 7 | Mobile truth | Phone shot reads as designed-for-phone, not shrunk | 2-col squeezed to unreadable; rail cards wider than viewport |
| 8 | Reduced-motion | Settled states, fully readable, nothing missing | content that only appears via animation is absent |
| 9 | Content honesty | Copy is specific to the subject; numbers are real or marked DRAFT | lorem, placeholder images left in, fake stats presented as real |
| 10 | Weight | `weightKB` within budget: ≤ 1.5MB page, ≤ 6MB with video hero | uncompressed PNGs; full-res video where frames would do |

Fix-note format (append to the brief doc):
`[dim 6] hero float loop distracts from headline → stop after 3 iterations → re-shot: pass`
