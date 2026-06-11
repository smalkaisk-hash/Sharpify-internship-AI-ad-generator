# Changer Club — Website UI Kit

A high-fidelity recreation of the Changer Club marketing site, built from the four social tiles + the Dynasty VSL brief (the only source-of-truth visual references we were given). No live site exists yet to copy from, so this is our best-faith reconstruction of the intended brand register applied to a marketing site.

## Files

| File                    | What's inside                                        |
| ----------------------- | --------------------------------------------------- |
| `index.html`            | Interactive single-page recreation: hero → programme → proof → mechanism → application |
| `Nav.jsx`               | Fixed top navigation with gold-rule on scroll       |
| `Hero.jsx`              | Photographic hero with hard split + italic gold display |
| `PressWall.jsx`         | Fortune / BI / Nebelspalter / Khaleej Times row     |
| `ProgrammeSteps.jsx`    | "First / Second / Third" enumeration from VSL §2     |
| `MemberQuote.jsx`       | Brooks Newmark-style pull quote                     |
| `StatRow.jsx`           | 270 / €25b / 50                                      |
| `MechanismBlock.jsx`    | "Other clubs offer champagne, we teach the room"    |
| `ApplicationForm.jsx`   | Qualification form with underline inputs + gold CTA |
| `Footer.jsx`            | Wordmark + chapters + tagline                       |
| `Button.jsx`            | Gold pill CTA + ghost variant                       |

## Click-through behaviour

- **Apply** anywhere → smooth-scrolls to `#apply` section
- **Form**: name → liquid-assets → chapter → submit → reveals "Application received. We will be in touch." (single calm sentence, per voice rules)
- All hover states match the design system: gold lightens, cream → gold on links, no scale changes.

## What we did NOT do

- Did not invent additional sections (member directory, blog, events list). The brand has not exposed those publicly to us.
- Did not draw illustrations for any section. Where a photo would normally live and we don't have the right one, we use the existing social tile crops.
- Did not add testimonials beyond Brooks Newmark, who is the only named member proof point in the source.
