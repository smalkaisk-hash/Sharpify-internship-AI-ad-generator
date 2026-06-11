"""
7 new structural shapes for the Meta ad pipeline.

  starburst  — 8-point star badge over full-bleed photo
  overlap    — circle photo bleeds behind text column; accent bar at junction
  diamond    — 45°-rotated square photo frame
  knockout   — SVG letter-mask: photo shows through the letter shape
  hexagon    — hexagonal clip-path photo frame
  scallop    — concave-arc (scalloped) panel edge over photo
  conic      — conic-gradient burst background, type-forward

All templates:
  - Accept (ctx: RenderContext, angle: int = 0) → str
  - Produce a complete 1080×1080 HTML string
  - Follow pipeline rules: hyphens:none, body≥22px, headline≥68px,
    CTA clearance≥150px, two-spacer flex, logo-zone align-self:flex-start,
    no secondary CTA, Raleway for Latvian body copy
"""
from __future__ import annotations

from adgen.render.context import RenderContext
from adgen.render.templates import _FONT_READY, _h, _get, _rot, _logo_tag

# Raleway = full Latvian glyph coverage; Jost/DM Sans do not have it.
_FONTS = (
    '<link href="https://fonts.googleapis.com/css2?family='
    "Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600"
    "&family=Raleway:wght@300;400;500;600"
    '&display=swap" rel="stylesheet">'
)

_RESET = (
    "*{margin:0;padding:0;box-sizing:border-box}"
    "*{hyphens:none;-webkit-hyphens:none}"
    "html,body{width:1080px;height:1080px;overflow:hidden}"
)

# 8-point starburst — 16 alternating points (outer 50%, inner 25%, 22.5° step)
_STARBURST = (
    "polygon(50% 0%,60% 27%,85% 15%,73% 40%,100% 50%,"
    "73% 60%,85% 85%,60% 73%,50% 100%,40% 73%,"
    "15% 85%,27% 60%,0% 50%,27% 40%,15% 15%,40% 27%)"
)

# Flat-top regular hexagon
_HEXAGON = "polygon(25% 0%,75% 0%,100% 50%,75% 100%,25% 100%,0% 50%)"

# 9 concave scallop arcs across 1080px, relative to a 550px-tall panel element.
# Each arc: 120px wide, peak 50px above element top edge.
_SCALLOP = (
    "path('M 0,50 Q 60,0 120,50 Q 180,0 240,50 Q 300,0 360,50 "
    "Q 420,0 480,50 Q 540,0 600,50 Q 660,0 720,50 "
    "Q 780,0 840,50 Q 900,0 960,50 Q 1020,0 1080,50 L 1080,550 L 0,550 Z')"
)


def _bullets_html(bullets: list[str]) -> str:
    """4 bullets → 2×2 flex-wrap grid; fewer → single column."""
    items = bullets[:4]
    rows = "".join(
        f'<div class="benefit brow"><span class="btext">{_h(b)}</span></div>'
        for b in items
    )
    if len(items) == 4:
        return f'<div class="benefits-grid">{rows}</div>'
    return f'<div class="benefits">{rows}</div>'


# ─────────────────────────────────────────────────────────────────────────────
# 1. STARBURST — full-bleed photo + 8-point badge showing a key stat
# ─────────────────────────────────────────────────────────────────────────────
def tpl_starburst(ctx: RenderContext, angle: int = 0) -> str:
    photo = ctx.photo_url()
    hl = _rot(ctx.headlines, 0, angle)
    eyebrow = _get(ctx.base_texts, 0, "")
    stat = _get(ctx.on_image_texts, 0) or _get(ctx.base_texts, 1, "95%")
    stat_lbl = _get(ctx.on_image_texts, 1) or _get(ctx.base_texts, 2, "")
    a1, bg, base = ctx.accent, ctx.text_cta_bg, ctx.base

    return f"""<!DOCTYPE html>
<html lang="{_h(ctx.language)}">
<head><meta charset="UTF-8">{_FONTS}
<style>
{_RESET}
.ad{{width:1080px;height:1080px;position:relative;overflow:hidden;background:{bg}}}
.photo{{position:absolute;inset:0;z-index:0}}
.photo img{{width:100%;height:100%;object-fit:cover;object-position:65% 50%}}
.scrim{{position:absolute;top:0;left:0;width:320px;height:320px;z-index:1;
  background:radial-gradient(ellipse at top left,{bg}cc 0%,transparent 70%)}}
.grad{{position:absolute;inset:0;z-index:1;
  background:linear-gradient(90deg,{bg} 0%,{bg}ee 40%,{bg}66 62%,transparent 100%)}}
.col{{position:absolute;left:0;top:0;bottom:0;width:580px;
  display:flex;flex-direction:column;padding:64px 48px 160px 72px;z-index:10}}
.logo-zone{{align-self:flex-start;flex-shrink:0}}
.spacer{{flex:1;min-height:0}}
.eyebrow{{font-family:'Raleway',sans-serif;font-size:20px;font-weight:400;
  letter-spacing:0.22em;text-transform:uppercase;color:{a1};margin-bottom:16px;flex-shrink:0}}
.hd{{font-family:'Cormorant Garamond',serif;font-size:80px;line-height:0.92;
  font-weight:600;font-style:italic;color:{base};margin-bottom:20px;flex-shrink:0}}
.rule{{height:1px;background:linear-gradient(90deg,{a1}88,transparent);
  margin-bottom:18px;flex-shrink:0}}
.benefits,.benefits-grid{{display:flex;flex-wrap:wrap;gap:12px;flex-shrink:0}}
.benefit,.brow{{display:flex;align-items:flex-start;gap:10px;
  width:calc(50% - 6px)}}
.btext{{font-family:'Raleway',sans-serif;font-size:22px;font-weight:400;
  line-height:1.28;color:rgba(255,255,255,0.82)}}
.spacer2{{height:28px;flex-shrink:0}}
.cta{{align-self:flex-start;flex-shrink:0;font-family:'Raleway',sans-serif;
  font-size:22px;font-weight:600;color:{ctx.cta_text};background:{a1};
  padding:22px 44px;border-radius:4px;letter-spacing:0.04em}}
.burst-wrap{{position:absolute;right:72px;bottom:220px;width:240px;height:240px;z-index:20}}
.burst{{width:100%;height:100%;clip-path:{_STARBURST};
  background:{a1};display:flex;flex-direction:column;
  align-items:center;justify-content:center;gap:4px}}
.burst-num{{font-family:'Cormorant Garamond',serif;font-size:68px;font-weight:600;
  font-style:italic;color:#fff;line-height:1}}
.burst-lbl{{font-family:'Raleway',sans-serif;font-size:16px;font-weight:500;
  color:rgba(255,255,255,0.88);text-align:center;max-width:130px;
  line-height:1.2;padding:0 8px}}
/* bullet-style-start */
/* bullet-style-end */
</style>{_FONT_READY}
</head><body><div class="ad">
  <div class="photo"><img src="{photo}" alt=""></div>
  <div class="scrim"></div>
  <div class="grad"></div>
  <div class="col">
    <div class="logo-zone">{_logo_tag(ctx, extra_css="filter:drop-shadow(0 0 12px rgba(0,0,0,0.55));")}</div>
    <div class="spacer"></div>
    {"<div class='eyebrow'>" + _h(eyebrow) + "</div>" if eyebrow else ""}
    <div class="hd">{_h(hl)}</div>
    <div class="rule"></div>
    {_bullets_html(ctx.bullets)}
    <div class="spacer2"></div>
    <a class="cta">{_h(ctx.cta)}</a>
  </div>
  <div class="burst-wrap">
    <div class="burst">
      <span class="burst-num">{_h(stat)}</span>
      {"<span class='burst-lbl'>" + _h(stat_lbl) + "</span>" if stat_lbl else ""}
    </div>
  </div>
</div></body></html>"""


# ─────────────────────────────────────────────────────────────────────────────
# 2. OVERLAP — circle photo bleeds behind text column; accent bar at junction
# ─────────────────────────────────────────────────────────────────────────────
def tpl_overlap(ctx: RenderContext, angle: int = 0) -> str:
    photo = ctx.photo_url()
    hl = _rot(ctx.headlines, 0, angle)
    eyebrow = _get(ctx.base_texts, 0, "")
    a1, a2, bg, base = ctx.accent, ctx.accent2, ctx.base, ctx.text_cta_bg

    # Accent bar straddles the text/photo boundary at x≈500px
    # Circle: 600px dia, center at x=800, left edge at x=500 → bleeds 40px into col
    return f"""<!DOCTYPE html>
<html lang="{_h(ctx.language)}">
<head><meta charset="UTF-8">{_FONTS}
<style>
{_RESET}
.ad{{width:1080px;height:1080px;position:relative;overflow:hidden;background:{bg}}}
/* circle photo — z=1, left edge at x≈500 (bleeds behind text column) */
.circle-frame{{position:absolute;right:40px;top:50%;transform:translateY(-50%);
  width:600px;height:600px;border-radius:50%;overflow:hidden;z-index:1;
  filter:drop-shadow(0 24px 64px rgba(0,0,0,0.22))}}
.circle-frame img{{width:100%;height:100%;object-fit:cover;object-position:50% 20%}}
/* decorative ring around circle */
.circle-ring{{position:absolute;right:26px;top:50%;transform:translateY(-50%);
  width:628px;height:628px;border-radius:50%;
  border:2px solid {a1};opacity:0.45;z-index:0}}
/* accent junction bar — crosses both column and photo regions at z=5 */
.junction-bar{{position:absolute;left:460px;top:50%;transform:translateY(-50%);
  width:12px;height:280px;border-radius:6px;
  background:linear-gradient(180deg,transparent,{a1} 20%,{a1} 80%,transparent);
  z-index:5}}
/* second small accent circle floating at mid-junction */
.junction-dot{{position:absolute;left:452px;top:50%;transform:translateY(-50%);
  width:28px;height:28px;border-radius:50%;background:{a1};z-index:6}}
/* text column — z=10, width=460px; circle bleeds 40px behind it */
.col{{position:absolute;left:0;top:0;bottom:0;width:480px;
  display:flex;flex-direction:column;padding:64px 56px 160px 72px;z-index:10}}
.logo-zone{{align-self:flex-start;flex-shrink:0}}
.spacer{{flex:1;min-height:0}}
.eyebrow{{font-family:'Raleway',sans-serif;font-size:20px;font-weight:400;
  letter-spacing:0.22em;text-transform:uppercase;color:{a1};margin-bottom:16px;flex-shrink:0}}
.hd{{font-family:'Cormorant Garamond',serif;font-size:78px;line-height:0.92;
  font-weight:600;font-style:italic;color:{base};margin-bottom:20px;flex-shrink:0}}
.rule{{height:1px;background:linear-gradient(90deg,{a1}88,transparent);
  margin-bottom:18px;flex-shrink:0}}
.benefits,.benefits-grid{{display:flex;flex-wrap:wrap;gap:12px;flex-shrink:0}}
.benefit,.brow{{display:flex;align-items:flex-start;gap:10px;
  width:calc(50% - 6px)}}
.btext{{font-family:'Raleway',sans-serif;font-size:22px;font-weight:400;
  line-height:1.28;color:rgba(255,255,255,0.82)}}
.spacer2{{height:28px;flex-shrink:0}}
.cta{{align-self:flex-start;flex-shrink:0;font-family:'Raleway',sans-serif;
  font-size:22px;font-weight:600;color:{ctx.cta_text};background:{a1};
  padding:22px 44px;border-radius:4px;letter-spacing:0.04em}}
/* bullet-style-start */
/* bullet-style-end */
</style>{_FONT_READY}
</head><body><div class="ad">
  <div class="circle-ring"></div>
  <div class="circle-frame"><img src="{photo}" alt=""></div>
  <div class="junction-bar"></div>
  <div class="junction-dot"></div>
  <div class="col">
    <div class="logo-zone">{_logo_tag(ctx, extra_css="filter:brightness(0);opacity:0.0;" if not bg.startswith("#") else "")}</div>
    <div class="spacer"></div>
    {"<div class='eyebrow'>" + _h(eyebrow) + "</div>" if eyebrow else ""}
    <div class="hd">{_h(hl)}</div>
    <div class="rule"></div>
    {_bullets_html(ctx.bullets)}
    <div class="spacer2"></div>
    <a class="cta">{_h(ctx.cta)}</a>
  </div>
</div></body></html>"""


# ─────────────────────────────────────────────────────────────────────────────
# 3. DIAMOND — 45°-rotated square photo frame
# ─────────────────────────────────────────────────────────────────────────────
def tpl_diamond(ctx: RenderContext, angle: int = 0) -> str:
    photo = ctx.photo_url()
    hl = _rot(ctx.headlines, 0, angle)
    eyebrow = _get(ctx.base_texts, 0, "")
    a1, base, bg_dark = ctx.accent, ctx.base, ctx.text_cta_bg

    # Diamond center at x=800, y=540
    # 380×380 CSS box rotated 45° → visual diamond 537px wide
    # Leftmost visual point at x=800-269=531; text col width=440 → 91px gap ✓
    return f"""<!DOCTYPE html>
<html lang="{_h(ctx.language)}">
<head><meta charset="UTF-8">{_FONTS}
<style>
{_RESET}
.ad{{width:1080px;height:1080px;position:relative;overflow:hidden;background:{base}}}
/* decorative diamond ring — slightly larger, behind photo frame */
.diamond-ring{{position:absolute;left:612px;top:321px;
  width:408px;height:408px;
  border:2px solid {a1};opacity:0.50;
  transform:rotate(45deg);z-index:1}}
/* diamond photo frame — 380px rotated square */
.diamond-outer{{position:absolute;left:620px;top:350px;
  width:360px;height:360px;
  transform:rotate(45deg);overflow:hidden;z-index:2}}
.diamond-outer img{{
  width:100%;height:100%;object-fit:cover;
  transform:rotate(-45deg) scale(1.42);
  transform-origin:center}}
/* text column — width 440px, 91px gap from leftmost diamond point */
.col{{position:absolute;left:0;top:0;bottom:0;width:440px;
  display:flex;flex-direction:column;padding:64px 48px 160px 72px;z-index:10}}
.logo-zone{{align-self:flex-start;flex-shrink:0}}
.spacer{{flex:1;min-height:0}}
.eyebrow{{font-family:'Raleway',sans-serif;font-size:20px;font-weight:400;
  letter-spacing:0.22em;text-transform:uppercase;color:{a1};margin-bottom:16px;flex-shrink:0}}
.hd{{font-family:'Cormorant Garamond',serif;font-size:78px;line-height:0.92;
  font-weight:600;font-style:italic;color:{bg_dark};margin-bottom:20px;flex-shrink:0}}
.rule{{height:1px;background:linear-gradient(90deg,{a1}88,transparent);
  margin-bottom:18px;flex-shrink:0}}
.benefits,.benefits-grid{{display:flex;flex-wrap:wrap;gap:12px;flex-shrink:0}}
.benefit,.brow{{display:flex;align-items:flex-start;gap:10px;
  width:calc(50% - 6px)}}
.btext{{font-family:'Raleway',sans-serif;font-size:22px;font-weight:400;
  line-height:1.28;color:{bg_dark};opacity:0.78}}
.spacer2{{height:28px;flex-shrink:0}}
.cta{{align-self:flex-start;flex-shrink:0;font-family:'Raleway',sans-serif;
  font-size:22px;font-weight:600;color:{ctx.cta_text};background:{a1};
  padding:22px 44px;border-radius:4px;letter-spacing:0.04em}}
/* bullet-style-start */
/* bullet-style-end */
</style>{_FONT_READY}
</head><body><div class="ad">
  <div class="diamond-ring"></div>
  <div class="diamond-outer"><img src="{photo}" alt=""></div>
  <div class="col">
    <div class="logo-zone">{_logo_tag(ctx, extra_css="filter:brightness(0);opacity:0.70;")}</div>
    <div class="spacer"></div>
    {"<div class='eyebrow'>" + _h(eyebrow) + "</div>" if eyebrow else ""}
    <div class="hd">{_h(hl)}</div>
    <div class="rule"></div>
    {_bullets_html(ctx.bullets)}
    <div class="spacer2"></div>
    <a class="cta">{_h(ctx.cta)}</a>
  </div>
</div></body></html>"""


# ─────────────────────────────────────────────────────────────────────────────
# 4. KNOCKOUT — SVG letter-mask: photo visible only through the letter shape
# ─────────────────────────────────────────────────────────────────────────────
def tpl_knockout(ctx: RenderContext, angle: int = 0) -> str:
    photo = ctx.photo_url()
    hl = _rot(ctx.headlines, 1, angle)
    eyebrow = _get(ctx.base_texts, 0, "")
    # Use first letter of short brand name as the knockout glyph
    letter = (ctx.short_name[0].upper()) if ctx.short_name else "A"
    a1, bg, base = ctx.accent, ctx.text_cta_bg, ctx.base

    return f"""<!DOCTYPE html>
<html lang="{_h(ctx.language)}">
<head><meta charset="UTF-8">{_FONTS}
<style>
{_RESET}
.ad{{width:1080px;height:1080px;position:relative;overflow:hidden;background:{bg}}}
/* SVG knockout occupies top 520px; photo shows through letter shape */
.knockout-svg{{position:absolute;top:0;left:0;z-index:1;
  filter:drop-shadow(0 12px 48px rgba(0,0,0,0.35))}}
/* thin accent rule below knockout zone */
.ko-rule{{position:absolute;top:520px;left:72px;right:72px;height:1px;
  background:linear-gradient(90deg,transparent,{a1} 20%,{a1} 80%,transparent);
  z-index:3}}
/* content zone below knockout */
.content{{position:absolute;top:540px;left:0;right:0;bottom:0;
  display:flex;flex-direction:column;
  align-items:center;padding:32px 120px 160px;z-index:10}}
.logo-zone{{align-self:flex-start;position:absolute;top:36px;left:72px;z-index:20}}
.eyebrow{{font-family:'Raleway',sans-serif;font-size:20px;font-weight:400;
  letter-spacing:0.22em;text-transform:uppercase;color:{a1};
  margin-bottom:14px;flex-shrink:0;text-align:center}}
.hd{{font-family:'Cormorant Garamond',serif;font-size:76px;line-height:0.94;
  font-weight:600;font-style:italic;color:{base};
  margin-bottom:20px;flex-shrink:0;text-align:center}}
.rule{{height:1px;width:240px;background:{a1}88;margin-bottom:18px;flex-shrink:0}}
.benefits,.benefits-grid{{display:flex;flex-wrap:wrap;gap:12px;flex-shrink:0;
  justify-content:center}}
.benefit,.brow{{display:flex;align-items:flex-start;gap:10px;
  width:calc(50% - 6px)}}
.btext{{font-family:'Raleway',sans-serif;font-size:22px;font-weight:400;
  line-height:1.28;color:rgba(255,255,255,0.82)}}
.spacer{{flex:1;min-height:0}}
.cta{{flex-shrink:0;font-family:'Raleway',sans-serif;
  font-size:22px;font-weight:600;color:{ctx.cta_text};background:{a1};
  padding:22px 44px;border-radius:4px;letter-spacing:0.04em}}
/* bullet-style-start */
/* bullet-style-end */
</style>{_FONT_READY}
</head><body><div class="ad">
  <svg class="knockout-svg" width="1080" height="520"
       xmlns="http://www.w3.org/2000/svg">
    <defs>
      <clipPath id="letter-clip">
        <text x="540" y="490"
              font-family="'Cormorant Garamond', Georgia, serif"
              font-size="560" font-weight="600" font-style="italic"
              text-anchor="middle">{_h(letter)}</text>
      </clipPath>
    </defs>
    <image clip-path="url(#letter-clip)"
           href="{photo}"
           x="-120" y="-60" width="1320" height="660"
           preserveAspectRatio="xMidYMid slice"/>
  </svg>
  <div class="ko-rule"></div>
  <div class="logo-zone">{_logo_tag(ctx, extra_css="filter:drop-shadow(0 0 10px rgba(0,0,0,0.5));")}</div>
  <div class="content">
    {"<div class='eyebrow'>" + _h(eyebrow) + "</div>" if eyebrow else ""}
    <div class="hd">{_h(hl)}</div>
    <div class="rule"></div>
    {_bullets_html(ctx.bullets)}
    <div class="spacer"></div>
    <a class="cta">{_h(ctx.cta)}</a>
  </div>
</div></body></html>"""


# ─────────────────────────────────────────────────────────────────────────────
# 5. HEXAGON — flat-top hexagonal photo frame with decorative outline
# ─────────────────────────────────────────────────────────────────────────────
def tpl_hexagon(ctx: RenderContext, angle: int = 0) -> str:
    photo = ctx.photo_url()
    hl = _rot(ctx.headlines, 0, angle)
    eyebrow = _get(ctx.base_texts, 0, "")
    a1, bg, base = ctx.accent, ctx.text_cta_bg, ctx.base

    # Hexagon: 520×590px (wider than tall for flat-top hex)
    # Right:60px → left edge of hex bounding box at x=1080-60-520=500
    # 80px clearance: text col max width = 500-80 = 420px
    return f"""<!DOCTYPE html>
<html lang="{_h(ctx.language)}">
<head><meta charset="UTF-8">{_FONTS}
<style>
{_RESET}
.ad{{width:1080px;height:1080px;position:relative;overflow:hidden;background:{bg}}}
/* decorative hex outline — same clip-path on a tinted background div, slightly larger */
.hex-ring{{position:absolute;right:46px;top:50%;transform:translateY(-50%);
  width:548px;height:618px;
  clip-path:{_HEXAGON};
  background:{a1};opacity:0.22;z-index:0}}
/* hexagon photo frame */
.hex-frame{{position:absolute;right:60px;top:50%;transform:translateY(-50%);
  width:520px;height:590px;
  clip-path:{_HEXAGON};overflow:hidden;z-index:1;
  filter:drop-shadow(0 24px 56px rgba(0,0,0,0.28))}}
.hex-frame img{{width:100%;height:100%;object-fit:cover;object-position:50% 18%}}
/* text column */
.col{{position:absolute;left:0;top:0;bottom:0;width:420px;
  display:flex;flex-direction:column;padding:64px 48px 160px 72px;z-index:10}}
.logo-zone{{align-self:flex-start;flex-shrink:0}}
.spacer{{flex:1;min-height:0}}
.eyebrow{{font-family:'Raleway',sans-serif;font-size:20px;font-weight:400;
  letter-spacing:0.22em;text-transform:uppercase;color:{a1};margin-bottom:16px;flex-shrink:0}}
.hd{{font-family:'Cormorant Garamond',serif;font-size:76px;line-height:0.92;
  font-weight:600;font-style:italic;color:{base};margin-bottom:20px;flex-shrink:0}}
.rule{{height:1px;background:linear-gradient(90deg,{a1}88,transparent);
  margin-bottom:18px;flex-shrink:0}}
.benefits,.benefits-grid{{display:flex;flex-wrap:wrap;gap:12px;flex-shrink:0}}
.benefit,.brow{{display:flex;align-items:flex-start;gap:10px;
  width:calc(50% - 6px)}}
.btext{{font-family:'Raleway',sans-serif;font-size:22px;font-weight:400;
  line-height:1.28;color:rgba(255,255,255,0.82)}}
.spacer2{{height:28px;flex-shrink:0}}
.cta{{align-self:flex-start;flex-shrink:0;font-family:'Raleway',sans-serif;
  font-size:22px;font-weight:600;color:{ctx.cta_text};background:{a1};
  padding:22px 44px;border-radius:4px;letter-spacing:0.04em}}
/* bullet-style-start */
/* bullet-style-end */
</style>{_FONT_READY}
</head><body><div class="ad">
  <div class="hex-ring"></div>
  <div class="hex-frame"><img src="{photo}" alt=""></div>
  <div class="col">
    <div class="logo-zone">{_logo_tag(ctx)}</div>
    <div class="spacer"></div>
    {"<div class='eyebrow'>" + _h(eyebrow) + "</div>" if eyebrow else ""}
    <div class="hd">{_h(hl)}</div>
    <div class="rule"></div>
    {_bullets_html(ctx.bullets)}
    <div class="spacer2"></div>
    <a class="cta">{_h(ctx.cta)}</a>
  </div>
</div></body></html>"""


# ─────────────────────────────────────────────────────────────────────────────
# 6. SCALLOP — concave-arc panel edge over full-bleed photo
# ─────────────────────────────────────────────────────────────────────────────
def tpl_scallop(ctx: RenderContext, angle: int = 0) -> str:
    photo = ctx.photo_url()
    hl = _rot(ctx.headlines, 0, angle)
    eyebrow = _get(ctx.base_texts, 0, "")
    a1, bg, base = ctx.accent, ctx.text_cta_bg, ctx.base

    # Scalloped panel: height=550px, bottom:0 → top at y=530 (50px for arc peaks)
    # Content inside panel starts at y≈80px (within panel) = canvas y≈610
    # CTA at bottom with padding-bottom:160px inside panel
    return f"""<!DOCTYPE html>
<html lang="{_h(ctx.language)}">
<head><meta charset="UTF-8">{_FONTS}
<style>
{_RESET}
.ad{{width:1080px;height:1080px;position:relative;overflow:hidden;background:{bg}}}
/* full-bleed photo behind everything */
.photo{{position:absolute;inset:0;z-index:0}}
.photo img{{width:100%;height:100%;object-fit:cover;object-position:50% 20%}}
/* corner scrim for logo readability */
.scrim{{position:absolute;top:0;left:0;width:300px;height:280px;z-index:1;
  background:radial-gradient(ellipse at top left,{bg}bb 0%,transparent 70%)}}
/* scalloped dark panel */
.panel{{position:absolute;bottom:0;left:0;right:0;height:550px;
  clip-path:{_SCALLOP};
  background:{bg};z-index:2}}
/* thin accent line tracing the scallop peaks */
.panel-edge{{position:absolute;bottom:500px;left:0;right:0;height:52px;
  clip-path:{_SCALLOP};
  background:transparent;
  outline:2px solid {a1};
  opacity:0.40;z-index:3}}
/* content inside panel — two-spacer flex column */
.panel-col{{position:absolute;bottom:0;left:0;right:0;height:490px;
  display:flex;flex-direction:column;
  align-items:flex-start;
  padding:40px 72px 160px 72px;z-index:10}}
.eyebrow{{font-family:'Raleway',sans-serif;font-size:20px;font-weight:400;
  letter-spacing:0.22em;text-transform:uppercase;color:{a1};
  margin-bottom:14px;flex-shrink:0}}
.hd{{font-family:'Cormorant Garamond',serif;font-size:78px;line-height:0.92;
  font-weight:600;font-style:italic;color:{base};
  margin-bottom:18px;flex-shrink:0}}
.rule{{height:1px;background:linear-gradient(90deg,{a1}88,transparent);
  margin-bottom:18px;flex-shrink:0;width:100%}}
.benefits,.benefits-grid{{display:flex;flex-wrap:wrap;gap:12px;flex-shrink:0}}
.benefit,.brow{{display:flex;align-items:flex-start;gap:10px;
  width:calc(50% - 6px)}}
.btext{{font-family:'Raleway',sans-serif;font-size:22px;font-weight:400;
  line-height:1.28;color:rgba(255,255,255,0.82)}}
.spacer{{flex:1;min-height:0}}
.cta{{flex-shrink:0;font-family:'Raleway',sans-serif;
  font-size:22px;font-weight:600;color:{ctx.cta_text};background:{a1};
  padding:22px 44px;border-radius:4px;letter-spacing:0.04em}}
.logo-zone{{position:absolute;top:52px;left:72px;z-index:20;align-self:flex-start}}
/* bullet-style-start */
/* bullet-style-end */
</style>{_FONT_READY}
</head><body><div class="ad">
  <div class="photo"><img src="{photo}" alt=""></div>
  <div class="scrim"></div>
  <div class="panel"></div>
  <div class="logo-zone">{_logo_tag(ctx, extra_css="filter:drop-shadow(0 0 12px rgba(0,0,0,0.55));")}</div>
  <div class="panel-col">
    {"<div class='eyebrow'>" + _h(eyebrow) + "</div>" if eyebrow else ""}
    <div class="hd">{_h(hl)}</div>
    <div class="rule"></div>
    {_bullets_html(ctx.bullets)}
    <div class="spacer"></div>
    <a class="cta">{_h(ctx.cta)}</a>
  </div>
</div></body></html>"""


# ─────────────────────────────────────────────────────────────────────────────
# 7. CONIC — conic-gradient burst background, type-forward, optional photo inset
# ─────────────────────────────────────────────────────────────────────────────
def tpl_conic(ctx: RenderContext, angle: int = 0) -> str:
    photo = ctx.photo_url()
    hl = _rot(ctx.headlines, 0, angle)
    eyebrow = _get(ctx.base_texts, 0, "")
    a1, a2, bg, base = ctx.accent, ctx.accent2, ctx.text_cta_bg, ctx.base

    # Tinted variant of bg for the burst — echo brand hue
    return f"""<!DOCTYPE html>
<html lang="{_h(ctx.language)}">
<head><meta charset="UTF-8">{_FONTS}
<style>
{_RESET}
.ad{{width:1080px;height:1080px;position:relative;overflow:hidden;
  background:conic-gradient(
    from 210deg at 82% 18%,
    {a1} 0deg,
    {bg} 55deg,
    {bg} 200deg,
    {a2} 270deg,
    {bg} 310deg,
    {a1} 360deg
  )}}
/* radial vignette to soften the burst */
.vignette{{position:absolute;inset:0;z-index:1;
  background:radial-gradient(ellipse 90% 90% at 50% 50%,transparent 40%,{bg}88 100%)}}
/* photo inset circle — top-right, shows product/person */
{"" if not photo else f'''.photo-inset{{position:absolute;top:64px;right:64px;
  width:220px;height:220px;border-radius:50%;overflow:hidden;z-index:3;
  border:3px solid {a1};
  filter:drop-shadow(0 12px 32px rgba(0,0,0,0.30))}}
.photo-inset img{{width:100%;height:100%;object-fit:cover;object-position:50% 15%}}'''}
/* centered content column */
.col{{position:absolute;left:0;right:0;top:0;bottom:0;
  display:flex;flex-direction:column;
  align-items:flex-start;
  padding:72px 120px 160px 80px;z-index:10}}
.logo-zone{{align-self:flex-start;flex-shrink:0}}
.spacer{{flex:1;min-height:0}}
.eyebrow{{font-family:'Raleway',sans-serif;font-size:20px;font-weight:400;
  letter-spacing:0.22em;text-transform:uppercase;color:{a1};
  margin-bottom:16px;flex-shrink:0}}
.hd{{font-family:'Cormorant Garamond',serif;font-size:84px;line-height:0.92;
  font-weight:600;font-style:italic;color:{base};
  margin-bottom:20px;flex-shrink:0;max-width:840px}}
.rule{{height:1px;width:280px;
  background:linear-gradient(90deg,{a1},transparent);
  margin-bottom:20px;flex-shrink:0}}
.benefits,.benefits-grid{{display:flex;flex-wrap:wrap;gap:12px;flex-shrink:0}}
.benefit,.brow{{display:flex;align-items:flex-start;gap:10px;
  width:calc(50% - 6px)}}
.btext{{font-family:'Raleway',sans-serif;font-size:22px;font-weight:400;
  line-height:1.28;color:rgba(255,255,255,0.82)}}
.spacer2{{height:28px;flex-shrink:0}}
.cta{{align-self:flex-start;flex-shrink:0;font-family:'Raleway',sans-serif;
  font-size:22px;font-weight:600;color:{ctx.cta_text};background:{a1};
  padding:22px 44px;border-radius:4px;letter-spacing:0.04em}}
/* bullet-style-start */
/* bullet-style-end */
</style>{_FONT_READY}
</head><body><div class="ad">
  <div class="vignette"></div>
  {"<div class='photo-inset'><img src='" + photo + "' alt=''></div>" if photo else ""}
  <div class="col">
    <div class="logo-zone">{_logo_tag(ctx)}</div>
    <div class="spacer"></div>
    {"<div class='eyebrow'>" + _h(eyebrow) + "</div>" if eyebrow else ""}
    <div class="hd">{_h(hl)}</div>
    <div class="rule"></div>
    {_bullets_html(ctx.bullets)}
    <div class="spacer2"></div>
    <a class="cta">{_h(ctx.cta)}</a>
  </div>
</div></body></html>"""


# ─────────────────────────────────────────────────────────────────────────────
# Registry — (slug, function) pairs used by the generate-shapes CLI command
# ─────────────────────────────────────────────────────────────────────────────
TEMPLATES: list[tuple[str, object]] = [
    ("starburst", tpl_starburst),
    ("overlap",   tpl_overlap),
    ("diamond",   tpl_diamond),
    ("knockout",  tpl_knockout),
    ("hexagon",   tpl_hexagon),
    ("scallop",   tpl_scallop),
    ("conic",     tpl_conic),
]
