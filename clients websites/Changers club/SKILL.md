---
name: changer-design
description: Use this skill to generate well-branded interfaces and assets for Changer Club, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

Changer Club is a private UHNW membership club ("Be wealthy, not just rich"). The brand register is dark, restrained, gold-accented, serif-led, equal-to-equal in voice. Every artifact you produce must pass the question from the Dynasty VSL brief: *would a 60-year-old with $20M liquid, sitting on his sofa in Monaco with his wife next to him, watch this without rolling his eyes?*

Before producing anything:
1. Read `README.md` end-to-end. The CONTENT FUNDAMENTALS, VISUAL FOUNDATIONS and ICONOGRAPHY sections are non-negotiable.
2. Read `assets/dynasty-vsl.txt` if you are writing copy. It is the most authoritative voice document in this skill.
3. Pull tokens from `colors_and_type.css` rather than hard-coding hex values or font names.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out of `assets/` and `ui_kits/` and create static HTML files for the user to view. The site UI kit in `ui_kits/website/` is component-modular — lift `Hero.jsx`, `Nav.jsx`, `ApplicationForm.jsx`, `Button.jsx` etc directly. The `slides/` deck demonstrates the editorial system applied at 1920×1080 — copy slide markup verbatim and replace the copy.

If working on production code, copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design (web page, social tile, deck, email, application funnel, ad creative), ask whether the audience is Monaco/Dubai/global, and act as an expert designer who outputs HTML artifacts or production code, depending on the need.

Forbidden defaults — applies to every output:
- No emoji. No exclamation marks. No animated logos.
- No bluish-purple gradients. No teal-orange grade. No drone shots.
- No rounded SaaS cards (8/12/16px radius). Sharp by default; pill (999px) only for the gold CTA.
- No "Unlock / Discover / Supercharge / Elevate" copy register.
- No statistics on screen during the most emotional copy line.
