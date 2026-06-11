/**
 * Local HTML ad generator — no API required.
 * Reads client-brief.json + brand-assets.json and outputs 5 complex HTML ads.
 *
 * Usage: node src/scripts/generate-html-local.js <client-slug>
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClientMemory } from './create-client-memory.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const slug = process.argv[2];
if (!slug) { console.error('Usage: node generate-html-local.js <client-slug>'); process.exit(1); }

const inputDir = resolve(__dirname, `../../clients/${slug}`);
const outDir   = resolve(__dirname, `../../clients/${slug}/output/html`);

const brief = JSON.parse(readFileSync(resolve(inputDir, 'client-brief.json'), 'utf8'));

let brand = { colors: {}, fonts: {} };
try { brand = JSON.parse(readFileSync(resolve(inputDir, 'brand-assets.json'), 'utf8')); }
catch { console.warn('  No brand-assets.json — using defaults'); }
mkdirSync(outDir, { recursive: true });
createClientMemory(slug);

// ─── Brand tokens ────────────────────────────────────────────────────────────

const C = {
  bg:     brand.colors?.primary    || '#0d0b09',
  light:  brand.colors?.secondary  || '#f5f0e8',
  accent: brand.colors?.accent     || '#c8a86a',
  muted:  brand.colors?.text_muted || '#7a6a5a',
  dark2:  '#1c1814',
  dark3:  '#090705',
};

const F = {
  heading: brand.fonts?.heading || 'Cormorant Garamond',
  body:    brand.fonts?.primary || 'Montserrat',
};

const GF = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(F.heading)}:ital,wght@0,300;0,600;0,700;1,300;1,600&family=${encodeURIComponent(F.body)}:wght@400;500;600&display=swap`;

const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`;

// ─── Copy from brief ─────────────────────────────────────────────────────────

const name      = brief.business_name || 'Brand';
const cta       = brief.cta_primary   || 'See If You Qualify';
const uvp       = brief.unique_value_proposition || 'Built for those who have already won.';
const admission = brief.admission?.split('.')[0] || 'By application only';

// ─── Shared CSS reset ────────────────────────────────────────────────────────

const reset = `
  @import url('${GF}');
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1080px;height:1080px;overflow:hidden;background:${C.bg};position:relative}
`;

// ═══════════════════════════════════════════════════════════════════════════════
// AD 1 — DIAGONAL SPLIT
// Complete statement headline | Stats panel on right with strong contrast
// ═══════════════════════════════════════════════════════════════════════════════

function template1() {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><style>${reset}

.noise{position:absolute;inset:0;opacity:0.04;background:${noise};background-size:300px 300px;pointer-events:none;z-index:1}

/* Right block — warm dark tone, clearly different from cool-dark left */
.right-block{
  position:absolute;top:0;right:0;width:520px;height:1080px;z-index:2;
  background:linear-gradient(170deg,#221e14 0%,#16130b 100%);
  clip-path:polygon(10% 0%,100% 0%,100% 100%,0% 100%)}

/* Accent glow inside right block */
.right-glow{
  position:absolute;top:0;right:0;width:520px;height:1080px;z-index:3;
  background:radial-gradient(ellipse 400px 550px at 60% 30%,${C.accent}38 0%,transparent 60%);
  clip-path:polygon(10% 0%,100% 0%,100% 100%,0% 100%)}

/* Fine grid on right block */
.right-grid{
  position:absolute;top:0;right:0;width:520px;height:1080px;z-index:3;
  clip-path:polygon(10% 0%,100% 0%,100% 100%,0% 100%);
  background-image:linear-gradient(${C.accent}1e 1px,transparent 1px),linear-gradient(90deg,${C.accent}1e 1px,transparent 1px);
  background-size:72px 72px}

/* Gold accent line tracing the diagonal edge */
.cut-line{
  position:absolute;top:0;z-index:5;width:4px;height:1120px;
  background:linear-gradient(to bottom,transparent 5%,${C.accent}bb 30%,${C.accent} 50%,${C.accent}bb 70%,transparent 95%);
  left:563px;transform:rotate(0.7deg);transform-origin:top center}

/* Left content */
.left{
  position:absolute;top:0;left:0;width:600px;height:1080px;z-index:6;
  display:flex;flex-direction:column;justify-content:center;padding:0 80px}

.eyebrow{font-family:'${F.body}',sans-serif;font-size:13px;font-weight:600;
  color:${C.accent};letter-spacing:7px;text-transform:uppercase;margin-bottom:36px}

.rule{width:52px;height:2px;background:${C.accent};margin-bottom:40px}

.headline{font-family:'${F.heading}',serif;font-size:72px;font-weight:700;
  line-height:1.0;color:${C.light};margin-bottom:20px;max-width:460px}
.headline em{color:${C.accent};font-style:normal;display:block}

.subhead{font-family:'${F.heading}',serif;font-size:24px;font-weight:300;
  font-style:italic;color:${C.muted};margin-bottom:48px;max-width:420px;line-height:1.5}

.cta{display:inline-block;background:${C.accent};color:${C.bg};
  padding:22px 52px;border-radius:4px;
  font-family:'${F.body}',sans-serif;font-size:16px;font-weight:600;
  letter-spacing:2.5px;text-transform:uppercase;
  box-shadow:0 8px 48px ${C.accent}55,0 2px 12px rgba(0,0,0,0.6);
  width:fit-content}

/* Right stats — large and legible */
.stats{
  position:absolute;top:0;right:0;width:470px;height:1080px;z-index:7;
  display:flex;flex-direction:column;justify-content:center;
  padding:0 64px 0 80px;gap:56px}

.stat{display:flex;flex-direction:column;gap:10px}

.stat-num{font-family:'${F.heading}',serif;font-size:80px;font-weight:700;
  color:${C.accent};line-height:1;letter-spacing:-2px}

.stat-label{font-family:'${F.body}',sans-serif;font-size:13px;font-weight:600;
  color:${C.light}99;letter-spacing:4px;text-transform:uppercase}

.stat-desc{font-size:16px;color:${C.light}55;line-height:1.5}

.stat-divider{width:40px;height:1px;background:${C.accent}44}

</style></head><body>
<div class="noise"></div>
<div class="right-block"></div>
<div class="right-glow"></div>
<div class="right-grid"></div>
<div class="cut-line"></div>

<div class="left">
  <div class="eyebrow">${name}</div>
  <div class="rule"></div>
  <h1 class="headline">After the exit —<br><em>what's next?</em></h1>
  <p class="subhead">Most founders reach the summit and find it quieter than expected.</p>
  <div class="cta">${cta}</div>
</div>

<div class="stats">
  <div class="stat">
    <div class="stat-num">270+</div>
    <div class="stat-label">Member Families</div>
    <div class="stat-desc">$25B+ in aggregate capital across Monaco and Dubai</div>
  </div>
  <div class="stat-divider"></div>
  <div class="stat">
    <div class="stat-num">+7</div>
    <div class="stat-label">Years Added</div>
    <div class="stat-desc">Harvard research on purpose and fulfilled longevity</div>
  </div>
  <div class="stat-divider"></div>
  <div class="stat">
    <div class="stat-num">110%</div>
    <div class="stat-label">ROI Last Year</div>
    <div class="stat-desc">Top 5 Angel Syndicate in Europe. Zero losses in 3 years.</div>
  </div>
</div>
</body></html>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// AD 2 — FULL-BLEED EDITORIAL
// Bold headline fills top half | Frosted info card properly sized at bottom
// ═══════════════════════════════════════════════════════════════════════════════

function template2() {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><style>${reset}

/* Layered gradient mesh background */
.base{position:absolute;inset:0;
  background:
    radial-gradient(ellipse 900px 700px at 15% 20%,${C.accent}1c 0%,transparent 55%),
    radial-gradient(ellipse 700px 600px at 90% 80%,${C.accent}14 0%,transparent 50%),
    conic-gradient(from 190deg at 55% 45%,${C.dark3} 0deg,${C.dark2} 100deg,${C.bg} 200deg,${C.dark3} 360deg)}

.noise{position:absolute;inset:0;opacity:0.05;background:${noise};background-size:300px 300px;z-index:1;mix-blend-mode:overlay}

/* Ghost large text — visible but atmospheric */
.ghost{
  position:absolute;bottom:-80px;right:-30px;z-index:1;
  font-family:'${F.heading}',serif;font-size:700px;font-weight:700;
  line-height:1;color:transparent;
  -webkit-text-stroke:2px ${C.accent}22;
  pointer-events:none;user-select:none}

/* Top accent rule */
.top-rule{position:absolute;top:72px;left:72px;right:72px;height:1px;z-index:3;
  background:linear-gradient(to right,${C.accent}66,${C.accent}22,transparent)}
.top-dot{position:absolute;top:68px;left:72px;width:9px;height:9px;
  background:${C.accent};border-radius:50%;z-index:4;
  box-shadow:0 0 12px ${C.accent}99}

/* Eyebrow bar */
.eyebrow-row{position:absolute;top:56px;left:100px;right:72px;z-index:5;
  display:flex;justify-content:space-between;align-items:center}
.eyebrow{font-family:'${F.body}',sans-serif;font-size:13px;font-weight:600;
  color:${C.accent};letter-spacing:7px;text-transform:uppercase}
.eyebrow-right{font-size:13px;color:${C.muted};letter-spacing:2px;font-style:italic}

/* Main headline — spans full upper half */
.headline-wrap{position:absolute;top:130px;left:72px;right:72px;z-index:5}
.headline{font-family:'${F.heading}',serif;font-size:136px;font-weight:700;
  line-height:0.92;color:${C.light};
  text-shadow:0 8px 80px rgba(0,0,0,0.8)}
.headline em{color:${C.accent};font-style:normal}

/* Accent line under headline */
.hl-rule{width:80px;height:3px;background:${C.accent};margin-top:40px;
  box-shadow:0 0 16px ${C.accent}88}

/* Mid pull-quote to fill void between headline and card */
.pull-quote{
  position:absolute;top:620px;left:72px;right:72px;z-index:5;
  font-family:'${F.heading}',serif;font-size:28px;font-weight:300;font-style:italic;
  color:${C.light}66;line-height:1.5;border-left:3px solid ${C.accent}66;padding-left:32px}

/* Frosted glass card — properly sized */
.card{
  position:absolute;bottom:148px;left:72px;right:72px;z-index:6;
  background:rgba(255,255,255,0.05);
  backdrop-filter:blur(24px) saturate(1.5);
  border:1px solid ${C.accent}30;
  border-radius:10px;padding:40px 52px;
  display:flex;gap:0;
  box-shadow:inset 0 1px 0 ${C.accent}22,0 24px 80px rgba(0,0,0,0.5)}

.card-col{flex:1;padding:0 36px;border-right:1px solid ${C.accent}20}
.card-col:first-child{padding-left:0}
.card-col:last-child{border-right:none}
.card-label{font-family:'${F.body}',sans-serif;font-size:12px;font-weight:600;
  color:${C.muted};letter-spacing:5px;text-transform:uppercase;margin-bottom:14px}
.card-value{font-family:'${F.heading}',serif;font-size:44px;font-weight:700;
  color:${C.accent};line-height:1;margin-bottom:10px}
.card-desc{font-size:16px;color:${C.light}66;line-height:1.5}

/* CTA row */
.cta-row{position:absolute;bottom:56px;left:72px;right:72px;z-index:6;
  display:flex;align-items:center;justify-content:space-between}
.cta{display:inline-block;background:${C.accent};color:${C.bg};
  padding:22px 56px;border-radius:4px;
  font-family:'${F.body}',sans-serif;font-size:17px;font-weight:600;
  letter-spacing:2px;text-transform:uppercase;
  box-shadow:0 0 60px ${C.accent}55}
.cta-note{font-family:'${F.heading}',serif;font-size:20px;font-style:italic;
  color:${C.light}55;max-width:480px;line-height:1.4}

</style></head><body>
<div class="base"></div>
<div class="noise"></div>
<div class="ghost">7</div>
<div class="top-dot"></div>
<div class="top-rule"></div>

<div class="eyebrow-row">
  <span class="eyebrow">${name}</span>
  <span class="eyebrow-right">${admission}</span>
</div>

<div class="headline-wrap">
  <h1 class="headline">What happens<br>after<br><em>you win?</em></h1>
  <div class="hl-rule"></div>
</div>

<div class="pull-quote">Most founders reach the summit<br>and find it quieter than expected.</div>

<div class="card">
  <div class="card-col">
    <div class="card-label">Member Families</div>
    <div class="card-value">270+</div>
    <div class="card-desc">$25B+ in aggregate capital</div>
  </div>
  <div class="card-col">
    <div class="card-label">Fulfilled Life</div>
    <div class="card-value">+7 yrs</div>
    <div class="card-desc">Harvard longitudinal research</div>
  </div>
  <div class="card-col">
    <div class="card-label">Investment ROI</div>
    <div class="card-value">110%</div>
    <div class="card-desc">Zero losses in 3 years</div>
  </div>
</div>

<div class="cta-row">
  <div class="cta">${cta}</div>
  <div class="cta-note">Not another business club —<br>the operating system for what's next.</div>
</div>
</body></html>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// AD 3 — BOTTOM PANEL SHOWCASE
// Bold testimonial quote fills top | Clean dark panel with 2 proof items
// ═══════════════════════════════════════════════════════════════════════════════

function template3() {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><style>${reset}

.base{position:absolute;inset:0;
  background:
    radial-gradient(ellipse 1000px 500px at 50% -5%,${C.accent}1a 0%,transparent 50%),
    linear-gradient(180deg,${C.dark2} 0%,${C.bg} 50%)}

.noise{position:absolute;inset:0;height:660px;opacity:0.04;background:${noise};background-size:300px 300px;z-index:1}

/* Rotated accent slab behind quote — clearly visible */
.accent-slab{
  position:absolute;top:295px;left:-100px;width:900px;height:120px;
  background:${C.accent};transform:rotate(-1.2deg);opacity:0.18;z-index:2}

/* Diagonal accent lines top right */
.lines{position:absolute;top:100px;right:72px;z-index:3;display:flex;flex-direction:column;gap:10px;align-items:flex-end}
.ln{height:2px;background:linear-gradient(to left,${C.accent}88,transparent);border-radius:1px}

/* Top content — quote zone */
.top{position:absolute;top:0;left:0;right:0;height:660px;z-index:4;
  display:flex;flex-direction:column;justify-content:center;padding:0 88px}

.eyebrow{font-family:'${F.body}',sans-serif;font-size:12px;font-weight:600;
  color:${C.accent};letter-spacing:7px;text-transform:uppercase;margin-bottom:36px}

/* Large quote mark as SVG — avoids font-rendering lottery */
.q-mark{display:block;width:80px;height:64px;margin-bottom:24px;opacity:0.7}

.quote{font-family:'${F.heading}',serif;font-size:66px;font-weight:600;
  line-height:1.05;color:${C.light};margin-bottom:32px;max-width:880px}
.quote em{font-style:italic;color:${C.accent}}

.attribution{font-family:'${F.body}',sans-serif;font-size:18px;
  color:${C.muted};letter-spacing:1px}

/* Separator */
.sep{position:absolute;top:660px;left:0;right:0;height:1px;z-index:5;
  background:linear-gradient(to right,transparent,${C.accent}77 25%,${C.accent}99 50%,${C.accent}77 75%,transparent)}
.sep-gem{position:absolute;top:655px;left:50%;transform:translateX(-50%);z-index:6;
  width:11px;height:11px;background:${C.accent};
  clip-path:polygon(50% 0%,100% 50%,50% 100%,0% 50%);
  box-shadow:0 0 14px ${C.accent}}

/* Bottom panel */
.panel{position:absolute;bottom:0;left:0;right:0;height:420px;z-index:4;
  background:${C.dark3};
  box-shadow:inset 0 1px 0 ${C.accent}33}

.panel-glow{position:absolute;bottom:0;left:0;right:0;height:420px;z-index:5;
  background:radial-gradient(ellipse 900px 280px at 50% 100%,${C.accent}12 0%,transparent 70%)}

/* Proof row — just 2 items, much larger text */
.proof-row{position:absolute;bottom:150px;left:0;right:0;z-index:7;
  display:flex}

.proof-item{flex:1;padding:0 72px;border-right:1px solid ${C.accent}22}
.proof-item:last-child{border-right:none}

.proof-name{font-family:'${F.heading}',serif;font-size:28px;font-weight:600;
  color:${C.light};margin-bottom:10px}
.proof-role{font-family:'${F.body}',sans-serif;font-size:15px;color:${C.accent};
  letter-spacing:1px;margin-bottom:18px;text-transform:uppercase}
.proof-quote{font-family:'${F.heading}',serif;font-size:22px;font-style:italic;
  color:${C.light}88;line-height:1.5}

/* CTA bar */
.cta-bar{position:absolute;bottom:0;left:0;right:0;height:120px;z-index:8;
  background:${C.accent}15;border-top:1px solid ${C.accent}44;
  display:flex;align-items:center;justify-content:space-between;padding:0 88px}
.cta-label{font-family:'${F.heading}',serif;font-size:24px;font-weight:300;
  font-style:italic;color:${C.light}77}
.cta{display:inline-block;background:${C.accent};color:${C.bg};
  padding:20px 52px;border-radius:4px;
  font-family:'${F.body}',sans-serif;font-size:16px;font-weight:600;
  letter-spacing:2.5px;text-transform:uppercase;
  box-shadow:0 0 48px ${C.accent}55}

</style></head><body>
<div class="base"></div>
<div class="noise"></div>
<div class="accent-slab"></div>
<div class="lines">
  <div class="ln" style="width:160px"></div>
  <div class="ln" style="width:100px;opacity:0.6"></div>
  <div class="ln" style="width:60px;opacity:0.3"></div>
</div>

<div class="top">
  <div class="eyebrow">${name}</div>
  <svg class="q-mark" viewBox="0 0 80 64" fill="${C.accent}">
    <path d="M0 38 C0 18 12 6 28 0 L32 8 C22 12 16 20 16 30 L16 30 C20 28 26 28 30 32 C34 36 34 44 30 50 C26 56 18 58 12 54 C4 50 0 44 0 38 Z"/>
    <path d="M44 38 C44 18 56 6 72 0 L76 8 C66 12 60 20 60 30 L60 30 C64 28 70 28 74 32 C78 36 78 44 74 50 C70 56 62 58 56 54 C48 50 44 44 44 38 Z"/>
  </svg>
  <h1 class="quote">There is nothing like this.<br>It's not a club.<br>It's a <em>new category.</em></h1>
  <div class="attribution">— Serge El Dfouni, Sunset Hospitality Group ($500M)</div>
</div>

<div class="sep"></div>
<div class="sep-gem"></div>
<div class="panel"></div>
<div class="panel-glow"></div>

<div class="proof-row">
  <div class="proof-item">
    <div class="proof-name">Brooks Newmark</div>
    <div class="proof-role">Apollo Management · Former UK Minister</div>
    <div class="proof-quote">"Listed a $2B AI firm on Nasdaq and found lifelong friendship — 3 years after joining."</div>
  </div>
  <div class="proof-item">
    <div class="proof-name">Elliot Limb</div>
    <div class="proof-role">UK / UAE Fintech Investor</div>
    <div class="proof-quote">"I came for the investments. I stayed because my family changed."</div>
  </div>
</div>

<div class="cta-bar">
  <div class="cta-label">10 families accepted per region, per month.</div>
  <div class="cta">${cta}</div>
</div>
</body></html>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// AD 4 — TYPOGRAPHIC POSTER
// Giant stat dominates | Clear hierarchy with no dead zones
// ═══════════════════════════════════════════════════════════════════════════════

function template4() {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><style>${reset}

.base{position:absolute;inset:0;
  background:
    radial-gradient(ellipse 800px 600px at 95% 5%,${C.accent}18 0%,transparent 50%),
    radial-gradient(ellipse 500px 400px at 0% 100%,${C.accent}0e 0%,transparent 45%),
    ${C.bg}}

.noise{position:absolute;inset:0;opacity:0.045;background:${noise};background-size:300px 300px;z-index:1}

/* Ghost stat — light enough to be atmospheric, visible enough to anchor */
.ghost-bg{
  position:absolute;top:-120px;right:-60px;z-index:1;
  font-family:'${F.heading}',serif;font-size:680px;font-weight:700;
  line-height:1;color:transparent;
  -webkit-text-stroke:2px ${C.accent}20;
  pointer-events:none;user-select:none}

/* Left vertical accent bar */
.v-bar{position:absolute;top:80px;left:72px;width:3px;height:920px;z-index:3;
  background:linear-gradient(to bottom,transparent,${C.accent} 20%,${C.accent} 80%,transparent)}

/* Rotated accent slabs */
.slab1{position:absolute;top:340px;left:-60px;width:760px;height:3px;
  background:linear-gradient(to right,${C.accent}dd,${C.accent}44,transparent);transform:rotate(-0.8deg);z-index:3}
.slab2{position:absolute;top:620px;left:-60px;width:900px;height:2px;
  background:linear-gradient(to right,${C.accent}99,${C.accent}22,transparent);transform:rotate(-0.8deg);z-index:3}

/* Content layout */
.content{position:absolute;inset:0;z-index:4;padding:88px 96px;
  display:flex;flex-direction:column;justify-content:space-between}

/* Top row */
.top-row{display:flex;justify-content:space-between;align-items:center}
.eyebrow{font-family:'${F.body}',sans-serif;font-size:13px;font-weight:600;
  color:${C.accent};letter-spacing:7px;text-transform:uppercase}
.tag{font-size:14px;color:${C.muted};letter-spacing:2px;font-style:italic;
  border:1px solid ${C.accent}44;padding:10px 22px;border-radius:2px}

/* Middle — stat block */
.mid{display:flex;flex-direction:column}

.stat-number{font-family:'${F.heading}',serif;font-size:220px;font-weight:700;
  color:${C.accent};line-height:0.85;letter-spacing:-6px;margin-bottom:0}

.stat-pct{font-size:100px;vertical-align:super;line-height:0}

.stat-label{font-family:'${F.body}',sans-serif;font-size:22px;font-weight:500;
  color:${C.light}88;letter-spacing:2px;text-transform:uppercase;
  margin-top:16px;margin-bottom:52px}

.headline{font-family:'${F.heading}',serif;font-size:58px;font-weight:600;
  line-height:1.1;color:${C.light};max-width:740px}
.headline em{font-style:italic;color:${C.accent}}

/* Bottom row */
.bottom-row{display:flex;align-items:flex-end;justify-content:space-between;gap:40px}
.source{font-family:'${F.heading}',serif;font-size:18px;font-style:italic;
  color:${C.muted};max-width:520px;line-height:1.6}
.cta{display:inline-block;background:transparent;color:${C.accent};
  border:2px solid ${C.accent};padding:20px 52px;border-radius:4px;
  font-family:'${F.body}',sans-serif;font-size:16px;font-weight:600;
  letter-spacing:2.5px;text-transform:uppercase;flex-shrink:0;
  box-shadow:0 0 32px ${C.accent}22,inset 0 0 32px ${C.accent}08}

</style></head><body>
<div class="base"></div>
<div class="noise"></div>
<div class="ghost-bg">70</div>
<div class="v-bar"></div>
<div class="slab1"></div>
<div class="slab2"></div>

<div class="content">
  <div class="top-row">
    <div class="eyebrow">${name}</div>
    <div class="tag">${admission}</div>
  </div>

  <div class="mid">
    <div class="stat-number">70<span class="stat-pct">%</span></div>
    <div class="stat-label">of founders without new goals</div>
    <h1 class="headline">experience chronic stress<br>after the exit.<br><em>The plateau is real.</em></h1>
  </div>

  <div class="bottom-row">
    <div class="source">Wharton longitudinal study on entrepreneur purpose and post-exit wellbeing. Harvard research: new goals add up to +7 years of fulfilled life.</div>
    <div class="cta">${cta}</div>
  </div>
</div>
</body></html>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// AD 5 — ASYMMETRIC GRID
// Stronger borders | Full text, no truncation | Proper font sizes throughout
// ═══════════════════════════════════════════════════════════════════════════════

function template5() {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><style>${reset}

.noise{position:absolute;inset:0;opacity:0.04;background:${noise};background-size:300px 300px;z-index:1}

/* Zone borders — solid and clearly visible */
.border-v{position:absolute;top:0;left:620px;width:1px;height:680px;z-index:10;
  background:${C.accent}cc}
.border-h{position:absolute;top:340px;left:620px;right:0;height:1px;z-index:10;
  background:${C.accent}99}
.border-bottom{position:absolute;top:680px;left:0;right:0;height:1px;z-index:10;
  background:${C.accent}bb}

/* Zone A — large left headline column */
.zone-a{position:absolute;top:0;left:0;width:620px;height:680px;z-index:2;
  background:linear-gradient(135deg,${C.dark2} 0%,${C.bg} 100%)}
.zone-a-glow{position:absolute;top:0;left:0;width:620px;height:680px;z-index:3;
  background:radial-gradient(ellipse 500px 450px at 25% 65%,${C.accent}1a 0%,transparent 60%)}

/* Zone B — top right */
.zone-b{position:absolute;top:0;left:620px;right:0;height:340px;z-index:2;
  background:${C.dark3}}
.zone-b-glow{position:absolute;top:0;left:620px;right:0;height:340px;z-index:3;
  background:radial-gradient(ellipse 300px 200px at 70% 30%,${C.accent}18 0%,transparent 65%)}

/* Zone C — bottom right */
.zone-c{position:absolute;top:340px;left:620px;right:0;height:340px;z-index:2;
  background:linear-gradient(160deg,${C.accent}14 0%,${C.dark3} 60%)}

/* Zone D — bottom strip full width */
.zone-d{position:absolute;bottom:0;left:0;right:0;height:400px;z-index:2;background:${C.dark3}}
.zone-d-glow{position:absolute;bottom:0;left:0;right:0;height:400px;z-index:3;
  background:radial-gradient(ellipse 1000px 200px at 50% 100%,${C.accent}0f 0%,transparent 70%)}

/* Zone A content */
.a{position:absolute;top:0;left:0;width:620px;height:680px;z-index:5;
  padding:64px 68px;display:flex;flex-direction:column;justify-content:space-between}
.a-rule{width:44px;height:2px;background:${C.accent};margin-bottom:4px}
.eyebrow{font-family:'${F.body}',sans-serif;font-size:12px;font-weight:600;
  color:${C.accent};letter-spacing:7px;text-transform:uppercase}
.a-headline{font-family:'${F.heading}',serif;font-size:86px;font-weight:700;
  line-height:0.96;color:${C.light}}
.a-headline em{color:${C.accent};font-style:normal;display:block}
.a-tagline{font-family:'${F.heading}',serif;font-size:21px;font-weight:300;
  font-style:italic;color:${C.light}66;line-height:1.45;max-width:460px;
  overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}

/* Zone B content */
.b{position:absolute;top:0;left:620px;right:0;height:340px;z-index:5;
  padding:44px 56px;display:flex;flex-direction:column;justify-content:space-between}
.zone-label{font-family:'${F.body}',sans-serif;font-size:11px;font-weight:600;
  color:${C.muted};letter-spacing:5px;text-transform:uppercase}
.b-stat{font-family:'${F.heading}',serif;font-size:100px;font-weight:700;
  color:${C.accent};line-height:1;letter-spacing:-3px}
.b-desc{font-family:'${F.body}',sans-serif;font-size:17px;color:${C.light}77;line-height:1.5}

/* Zone C content */
.c{position:absolute;top:340px;left:620px;right:0;height:340px;z-index:5;
  padding:44px 56px;display:flex;flex-direction:column;justify-content:space-between}
.c-stat{font-family:'${F.heading}',serif;font-size:80px;font-weight:700;
  color:${C.light};line-height:1;letter-spacing:-2px}
.c-sub{font-family:'${F.body}',sans-serif;font-size:17px;color:${C.accent};
  letter-spacing:1px;display:block;margin-top:4px}
.c-desc{font-family:'${F.body}',sans-serif;font-size:17px;color:${C.light}66;line-height:1.5}

/* Zone D content */
.d{position:absolute;bottom:0;left:0;right:0;height:400px;z-index:5;
  padding:44px 72px 52px;display:flex;flex-direction:column;justify-content:space-between}
.d-cols{display:flex;gap:0;flex:1;margin-bottom:32px}
.d-col{flex:1;padding:0 36px;border-right:1px solid ${C.accent}22}
.d-col:first-child{padding-left:0}
.d-col:last-child{border-right:none}
.d-col-head{font-family:'${F.body}',sans-serif;font-size:11px;font-weight:600;
  color:${C.accent};letter-spacing:5px;text-transform:uppercase;
  margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid ${C.accent}33}
.d-col-body{font-family:'${F.body}',sans-serif;font-size:18px;color:${C.light}77;line-height:1.6}

.d-bottom{display:flex;align-items:center;justify-content:space-between}
.d-note{font-family:'${F.heading}',serif;font-size:18px;font-style:italic;color:${C.muted}}
.cta{background:${C.accent};color:${C.bg};padding:22px 52px;border-radius:4px;
  font-family:'${F.body}',sans-serif;font-size:16px;font-weight:600;
  letter-spacing:2.5px;text-transform:uppercase;
  box-shadow:0 0 52px ${C.accent}55;flex-shrink:0}

</style></head><body>
<div class="noise"></div>
<div class="zone-a"></div><div class="zone-a-glow"></div>
<div class="zone-b"></div><div class="zone-b-glow"></div>
<div class="zone-c"></div>
<div class="zone-d"></div><div class="zone-d-glow"></div>
<div class="border-v"></div>
<div class="border-h"></div>
<div class="border-bottom"></div>

<div class="a">
  <div>
    <div class="a-rule"></div>
    <div class="eyebrow" style="margin-top:16px">${name}</div>
  </div>
  <h1 class="a-headline">The next<br>chapter<br><em>isn't built</em><br>alone.</h1>
  <p class="a-tagline">${uvp}</p>
</div>

<div class="b">
  <div class="zone-label">Fulfilled Years Added</div>
  <div class="b-stat">+7</div>
  <div class="b-desc">Harvard research on purpose-aligned<br>social networks and longevity.</div>
</div>

<div class="c">
  <div class="zone-label">Angel Syndicate ROI</div>
  <div class="c-stat">110%<span class="c-sub">last year</span></div>
  <div class="c-desc">Top 5 in Europe. Zero losses in 3 years.<br>Entry from $10,000.</div>
</div>

<div class="d">
  <div class="d-cols">
    <div class="d-col">
      <div class="d-col-head">Who Joins</div>
      <div class="d-col-body">Post-exit founders and wealth families. $5M+ liquid assets required.</div>
    </div>
    <div class="d-col">
      <div class="d-col-head">What You Get</div>
      <div class="d-col-body">20 private gatherings per year across Monaco and Dubai.</div>
    </div>
    <div class="d-col">
      <div class="d-col-head">The Network</div>
      <div class="d-col-body">270+ families. $25B+ capital. Marc Randolph. Mo Gawdat.</div>
    </div>
  </div>
  <div class="d-bottom">
    <div class="d-note">Featured in Fortune &amp; Business Insider. Founded 2019, Lausanne.</div>
    <div class="cta">${cta}</div>
  </div>
</div>
</body></html>`;
}

// ─── Write all templates ──────────────────────────────────────────────────────

const ads = [
  { name: 'ad-1-diagonal-split',  html: template1() },
  { name: 'ad-2-editorial',       html: template2() },
  { name: 'ad-3-bottom-panel',    html: template3() },
  { name: 'ad-4-typo-poster',     html: template4() },
  { name: 'ad-5-asymmetric-grid', html: template5() },
];

for (const ad of ads) {
  const fp = resolve(outDir, `${ad.name}.html`);
  writeFileSync(fp, ad.html, 'utf8');
  console.log(`  Saved: html/${ad.name}.html`);
}

console.log(`\nDone — ${ads.length} ads → ${outDir}`);
console.log(`Export: node src/steps/5-export.js ${slug} (outputs to clients/${slug}/output/png/)`);
