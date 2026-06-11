/**
 * Fallback HTML generator — runs when ANTHROPIC_API_KEY / OPENAI_API_KEY is not set.
 * Produces the same 9-ad output as the full pipeline, hand-designing the HTML
 * from the Mariposa client brief.
 *
 * Usage: node src/scripts/generate-html-fallback.js mariposa
 */

import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLIENT_BASE = resolve(__dirname, '../../clients');

const LOGO_PATH   = 'file:///C:/Users/User/Meta-ad-generator-v2/meta-ad-generator-3/clients/mariposa/assets/logo-1-Logo_balts-3-scaled.png';
const HERO_PATH   = 'file:///C:/Users/User/Meta-ad-generator-v2/meta-ad-generator-3/clients/mariposa/assets/Beautiful-Woman-11-scaled.webp';

// ── Copy components (derived from client-brief.json, following components.md rules) ──

const HEADLINES = [
  'Āda mainās pēc 2 sesijām',
  'Optimas: IPL, RF un lāzers vienā',
  '95% klientu atgriežas regulāri',
];

const BULLETS = [
  'IPL, RF mikroadatas un lāzers vienā',
  '95% klientu atgriežas pēc pirmās sesijas',
  'Redzami rezultāti jau pēc 2 procedūrām',
  'Bezmaksas konsultācija, vērtība 40€',
  'Bez sāpēm, minimāla atveseļošanās',
  'Kalibrēts katram ādas tipam',
];

const BASE_TEXTS = [
  'Krēmi pigmentāciju nenovērš. Optimas strādā pie avota: IPL, RF un lāzers vienā protokolā. Rezultāti redzami jau pēc 2 sesijām.',
  'Lielākā daļa klientu redz atšķirību jau pēc pirmās procedūras. Optimas apvieno IPL, RF un lāzeru vienā platformā. Tava āda gaida šo risinājumu.',
  'Pirmā vizīte ir bez maksas, 40€ vērtībā. Tikai Mariposa Rīgā apvieno IPL, RF un lāzeru vienā protokolā. Piesakies un redzi atšķirību.',
];

const ON_IMAGE_TEXTS = [
  'Optimas ādas tehnoloģija',
  '95% klientu atgriežas',
  'Bezmaksas konsultācija tagad',
];

const CTA = 'Piesakies bezmaksas konsultācijai';

// Bullet index triplets per variation (from 2b-assemble.js)
const BULLET_COMBOS = [
  [0, 1, 2],
  [2, 3, 4],
  [4, 5, 0],
  [1, 3, 5],
  [0, 2, 4],
  [1, 2, 5],
  [0, 3, 4],
  [1, 4, 5],
  [0, 2, 5],
];

function assembleVariations() {
  return Array.from({ length: 9 }, (_, i) => ({
    index:         i + 1,
    headline:      HEADLINES[i % 3],
    bullets:       BULLET_COMBOS[i].map(bi => BULLETS[bi]),
    base_text:     BASE_TEXTS[Math.floor(i / 3)],
    on_image_text: ON_IMAGE_TEXTS[Math.floor(i / 3)],
    cta:           CTA,
  }));
}

// ── Layout A: Full-bleed editorial (photo bg + gradient overlay) ─────────────

function layoutA(v) {
  const [b1, b2, b3] = v.bullets;
  return `<!DOCTYPE html>
<html lang="lv">
<head>
<meta charset="UTF-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;0,700;1,300;1,600&family=Montserrat:wght@300;400;500;600;700&display=swap');
* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: 1080px; height: 1080px; overflow: hidden; }
.ad { width: 1080px; height: 1080px; position: relative; }
.base {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 700px 600px at 80% 28%, rgba(201,146,122,0.13) 0%, transparent 56%),
    radial-gradient(ellipse 400px 350px at 8% 88%, rgba(201,146,122,0.06) 0%, transparent 52%),
    #13080d;
}
.noise {
  position: absolute; inset: 0; opacity: 0.038;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
.photo { position: absolute; inset: 0; width: 1080px; height: 1080px; object-fit: cover; object-position: 58% top; }
.overlay-l {
  position: absolute; inset: 0;
  background: linear-gradient(to right, rgba(19,8,13,0.97) 0%, rgba(19,8,13,0.90) 26%, rgba(19,8,13,0.62) 50%, rgba(19,8,13,0.28) 70%, rgba(19,8,13,0.20) 100%);
}
.overlay-b { position: absolute; inset: 0; background: linear-gradient(to top, rgba(19,8,13,0.80) 0%, transparent 30%); }
.content { position: absolute; inset: 0; padding: 62px 70px 160px; display: flex; flex-direction: column; justify-content: space-between; }
.top-bar { display: flex; align-items: flex-start; justify-content: space-between; }
.logo { height: 25px; width: auto; opacity: 0.88; filter: brightness(1.05); }
.corner-mark { width: 24px; height: 24px; border-top: 2px solid rgba(201,146,122,0.40); border-right: 2px solid rgba(201,146,122,0.40); flex-shrink: 0; }
.text-zone { max-width: 500px; }
.eyebrow-rule { width: 40px; height: 1.5px; background: #c9927a; margin-bottom: 18px; }
.on-image {
  font-family: 'Cormorant Garamond', serif;
  font-size: 82px; font-weight: 600; line-height: 1.0; color: #f5ede8;
  margin-bottom: 24px; letter-spacing: -0.5px;
}
.on-image em { color: #c9927a; font-style: italic; font-weight: 300; }
.base-text {
  font-family: 'Montserrat', sans-serif;
  font-size: 15px; font-weight: 300; line-height: 1.72;
  color: rgba(245,237,232,0.64); margin-bottom: 26px; max-width: 420px;
}
.bullets { list-style: none; margin-bottom: 34px; }
.bullets li {
  font-family: 'Montserrat', sans-serif; font-size: 13.5px; font-weight: 400;
  color: rgba(245,237,232,0.76); padding: 9px 0 9px 20px; position: relative;
  border-bottom: 1px solid rgba(201,146,122,0.14);
}
.bullets li:first-child { border-top: 1px solid rgba(201,146,122,0.14); }
.bullets li::before { content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 5px; height: 5px; border-radius: 50%; background: #c9927a; }
.rule-line { width: 380px; height: 1px; background: linear-gradient(to right, rgba(201,146,122,0.28), transparent); margin-bottom: 24px; }
.cta-btn {
  display: inline-block; background: #c9927a; color: #13080d;
  padding: 20px 44px; font-family: 'Montserrat', sans-serif;
  font-size: 11.5px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
  border-radius: 2px; box-shadow: 0 8px 36px rgba(201,146,122,0.42), 0 2px 10px rgba(0,0,0,0.55);
}
</style>
</head>
<body>
<div class="ad">
  <div class="base"></div>
  <div class="noise"></div>
  <img class="photo" src="${HERO_PATH}" alt="">
  <div class="overlay-l"></div>
  <div class="overlay-b"></div>
  <div class="content">
    <div class="top-bar">
      <img class="logo" src="${LOGO_PATH}" alt="Mariposa">
      <div class="corner-mark"></div>
    </div>
    <div class="text-zone">
      <div class="eyebrow-rule"></div>
      <h1 class="on-image">${formatOnImage(v.on_image_text)}</h1>
      <p class="base-text">${v.base_text}</p>
      <ul class="bullets">
        <li>${b1}</li>
        <li>${b2}</li>
        <li>${b3}</li>
      </ul>
      <div class="rule-line"></div>
      <a class="cta-btn">${v.cta}</a>
    </div>
  </div>
</div>
</body>
</html>`;
}

// ── Layout B: Diagonal split (photo right clipped, dark left panel) ───────────

function layoutB(v) {
  const [b1, b2, b3] = v.bullets;
  return `<!DOCTYPE html>
<html lang="lv">
<head>
<meta charset="UTF-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;0,700;1,400;1,600&family=Montserrat:wght@300;400;500;600;700&display=swap');
* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: 1080px; height: 1080px; overflow: hidden; background: #13080d; }
.ad { width: 1080px; height: 1080px; position: relative; }
.base {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 500px 800px at 18% 50%, rgba(201,146,122,0.07) 0%, transparent 55%),
    #13080d;
}
.noise {
  position: absolute; inset: 0; opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
.photo-wrap { position: absolute; top: 0; right: 0; width: 620px; height: 1080px; clip-path: polygon(12% 0%, 100% 0%, 100% 100%, 0% 100%); overflow: hidden; }
.photo { width: 620px; height: 1080px; object-fit: cover; object-position: 38% top; }
.photo-fade { position: absolute; inset: 0; background: linear-gradient(to right, rgba(19,8,13,0.96) 0%, rgba(19,8,13,0.28) 36%, transparent 65%); }
.panel {
  position: absolute; left: 0; top: 0; width: 520px; height: 1080px;
  display: flex; flex-direction: column; padding: 64px 64px 160px 72px;
}
.logo { height: 24px; width: auto; opacity: 0.88; filter: brightness(1.05); margin-bottom: auto; }
.accent-strip {
  position: absolute; top: 0; left: 460px; width: 6px; height: 1080px;
  background: linear-gradient(to bottom, transparent, rgba(201,146,122,0.18) 30%, rgba(201,146,122,0.28) 50%, rgba(201,146,122,0.18) 70%, transparent);
}
.body { flex: 1; display: flex; flex-direction: column; justify-content: center; padding-bottom: 16px; max-height: 820px; }
.accent-bar { width: 44px; height: 2px; background: #c9927a; margin-bottom: 28px; }
.on-image {
  font-family: 'Cormorant Garamond', serif;
  font-size: 68px; font-weight: 700; line-height: 1.05; color: #f5ede8;
  margin-bottom: 20px; letter-spacing: -0.3px;
}
.on-image em { color: #c9927a; font-style: italic; font-weight: 300; }
.base-text {
  font-family: 'Montserrat', sans-serif;
  font-size: 14.5px; font-weight: 300; line-height: 1.75;
  color: rgba(245,237,232,0.65); margin-bottom: 28px; max-width: 360px;
}
.bullets { list-style: none; margin-bottom: 40px; }
.bullets li {
  font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 400;
  color: rgba(245,237,232,0.78); padding: 10px 0 10px 22px; position: relative;
  border-bottom: 1px solid rgba(201,146,122,0.16);
}
.bullets li:first-child { border-top: 1px solid rgba(201,146,122,0.16); }
.bullets li::before { content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 5px; height: 5px; border-radius: 50%; background: #c9927a; }
.bottom-bar { display: flex; flex-direction: column; gap: 0; }
.cta-btn {
  display: inline-block; background: #c9927a; color: #13080d;
  padding: 19px 40px; font-family: 'Montserrat', sans-serif;
  font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
  border-radius: 2px; box-shadow: 0 8px 32px rgba(201,146,122,0.40), 0 2px 8px rgba(0,0,0,0.50); width: fit-content;
}
</style>
</head>
<body>
<div class="ad">
  <div class="base"></div>
  <div class="noise"></div>
  <div class="photo-wrap">
    <img class="photo" src="${HERO_PATH}" alt="">
    <div class="photo-fade"></div>
  </div>
  <div class="accent-strip"></div>
  <div class="panel">
    <img class="logo" src="${LOGO_PATH}" alt="Mariposa">
    <div class="body">
      <div class="accent-bar"></div>
      <h1 class="on-image">${formatOnImage(v.on_image_text)}</h1>
      <p class="base-text">${v.base_text}</p>
      <ul class="bullets">
        <li>${b1}</li>
        <li>${b2}</li>
        <li>${b3}</li>
      </ul>
      <div class="bottom-bar">
        <a class="cta-btn">${v.cta}</a>
      </div>
    </div>
  </div>
</div>
</body>
</html>`;
}

// ── Layout C: Typographic poster (bold typography, geometric shapes, no photo) ──

function layoutC(v) {
  const [b1, b2, b3] = v.bullets;
  return `<!DOCTYPE html>
<html lang="lv">
<head>
<meta charset="UTF-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;0,700;1,300;1,600&family=Montserrat:wght@300;400;500;600;700&display=swap');
* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: 1080px; height: 1080px; overflow: hidden; }
.ad { width: 1080px; height: 1080px; position: relative; overflow: hidden; }
.base {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 800px 600px at 60% 35%, rgba(201,146,122,0.10) 0%, transparent 58%),
    radial-gradient(ellipse 500px 400px at 5% 80%, rgba(201,146,122,0.07) 0%, transparent 55%),
    #13080d;
}
.noise {
  position: absolute; inset: 0; opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
.geo-block {
  position: absolute; top: 220px; left: -40px; width: 1160px; height: 280px;
  background: rgba(201,146,122,0.06); transform: rotate(-2deg);
  border-top: 1px solid rgba(201,146,122,0.18); border-bottom: 1px solid rgba(201,146,122,0.18);
}
.geo-line-top { position: absolute; top: 60px; left: 72px; width: 180px; height: 2px; background: linear-gradient(to right, #c9927a, transparent); }
.geo-line-bot { position: absolute; bottom: 220px; right: 72px; width: 120px; height: 1px; background: linear-gradient(to left, rgba(201,146,122,0.50), transparent); }
.corner-tl { position: absolute; top: 52px; left: 52px; width: 28px; height: 28px; border-top: 2px solid rgba(201,146,122,0.40); border-left: 2px solid rgba(201,146,122,0.40); }
.corner-br { position: absolute; bottom: 52px; right: 52px; width: 28px; height: 28px; border-bottom: 2px solid rgba(201,146,122,0.40); border-right: 2px solid rgba(201,146,122,0.40); }
.content { position: absolute; inset: 0; padding: 70px 88px 160px; display: flex; flex-direction: column; }
.top-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 60px; }
.logo { height: 22px; width: auto; opacity: 0.85; filter: brightness(1.05); }
.logo-rule { flex: 1; height: 1px; background: linear-gradient(to right, transparent, rgba(201,146,122,0.25), transparent); margin: 0 28px; }
.dot-cluster { display: flex; gap: 6px; align-items: center; }
.dot { width: 4px; height: 4px; border-radius: 50%; background: rgba(201,146,122,0.45); }
.dot.lg { width: 6px; height: 6px; background: #c9927a; }
.on-image {
  font-family: 'Cormorant Garamond', serif;
  font-size: 100px; font-weight: 700; line-height: 0.95; color: #f5ede8;
  margin-bottom: 36px; letter-spacing: -1px; max-width: 900px;
}
.on-image em { color: #c9927a; font-style: italic; font-weight: 300; }
.base-text {
  font-family: 'Montserrat', sans-serif;
  font-size: 16px; font-weight: 300; line-height: 1.70;
  color: rgba(245,237,232,0.64); margin-bottom: 32px; max-width: 760px;
}
.bullets-row { display: flex; gap: 24px; margin-bottom: 44px; flex-wrap: wrap; }
.bullet-item { display: flex; align-items: flex-start; gap: 10px; max-width: 268px; }
.bullet-dot { width: 5px; height: 5px; border-radius: 50%; background: #c9927a; margin-top: 8px; flex-shrink: 0; }
.bullet-item span { font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 400; color: rgba(245,237,232,0.76); line-height: 1.5; }
.cta-zone { display: flex; align-items: center; gap: 28px; }
.cta-btn {
  display: inline-block; background: #c9927a; color: #13080d;
  padding: 20px 48px; font-family: 'Montserrat', sans-serif;
  font-size: 11.5px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
  border-radius: 2px; box-shadow: 0 8px 36px rgba(201,146,122,0.42), 0 2px 10px rgba(0,0,0,0.55);
}
.cta-sub { font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 400; color: rgba(245,237,232,0.38); letter-spacing: 1px; }
</style>
</head>
<body>
<div class="ad">
  <div class="base"></div>
  <div class="noise"></div>
  <div class="geo-block"></div>
  <div class="geo-line-top"></div>
  <div class="geo-line-bot"></div>
  <div class="corner-tl"></div>
  <div class="corner-br"></div>
  <div class="content">
    <div class="top-bar">
      <img class="logo" src="${LOGO_PATH}" alt="Mariposa">
      <div class="logo-rule"></div>
      <div class="dot-cluster">
        <div class="dot"></div>
        <div class="dot lg"></div>
        <div class="dot"></div>
      </div>
    </div>
    <h1 class="on-image">${formatOnImage(v.on_image_text)}</h1>
    <p class="base-text">${v.base_text}</p>
    <div class="bullets-row">
      <div class="bullet-item"><div class="bullet-dot"></div><span>${b1}</span></div>
      <div class="bullet-item"><div class="bullet-dot"></div><span>${b2}</span></div>
      <div class="bullet-item"><div class="bullet-dot"></div><span>${b3}</span></div>
    </div>
    <div class="cta-zone">
      <a class="cta-btn">${v.cta}</a>
      <span class="cta-sub">mariposa.lv</span>
    </div>
  </div>
</div>
</body>
</html>`;
}

// ── Helper: split on_image_text at natural boundary for editorial italic ──────

function formatOnImage(text) {
  const words = text.split(' ');
  const mid = Math.ceil(words.length / 2);
  const first = words.slice(0, mid).join(' ');
  const rest  = words.slice(mid).join(' ');
  if (!rest) return text;
  return `${first}<br><em>${rest}</em>`;
}

// ── Layout assignment: A=1,4,7 | B=2,5,8 | C=3,6,9 ─────────────────────────

const LAYOUTS = [layoutA, layoutB, layoutC, layoutA, layoutB, layoutC, layoutA, layoutB, layoutC];

// ── Main ─────────────────────────────────────────────────────────────────────

const clientSlug = process.argv[2] || 'mariposa';
const outputDir  = resolve(CLIENT_BASE, clientSlug, 'output');
const htmlDir    = resolve(outputDir, 'html');

mkdirSync(htmlDir, { recursive: true });

const variations = assembleVariations();

for (const v of variations) {
  const layoutFn  = LAYOUTS[v.index - 1];
  const html      = layoutFn(v);
  const filename  = `ad-${v.index}.html`;
  const filepath  = resolve(htmlDir, filename);
  writeFileSync(filepath, html, 'utf8');
  console.log(`Wrote: ${filename}  [Layout ${['A','B','C','A','B','C','A','B','C'][v.index-1]}]  "${v.on_image_text}" / "${v.headline}"`);
}

console.log(`\nDone — ${variations.length} HTML files in ${htmlDir}`);
