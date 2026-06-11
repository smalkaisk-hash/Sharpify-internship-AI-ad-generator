/**
 * Generates palettes-neutral.md from scraped-pastel-colors.json.
 * For each palette: sorts swatches by luminance, assigns functional roles,
 * calculates contrast ratios, and writes structured markdown.
 *
 * Usage: node src/scripts/generate-palette-md.js
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Luminance & contrast ──────────────────────────────────────────────────

function linearize(c) {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function luminance(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

function contrast(hexA, hexB) {
  const la = luminance(hexA);
  const lb = luminance(hexB);
  const lighter = Math.max(la, lb);
  const darker  = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

function fmtContrast(ratio) {
  return ratio.toFixed(1) + ':1';
}

function fmtL(hex) {
  return 'L≈' + luminance(hex).toFixed(2);
}

// ─── Category tags ─────────────────────────────────────────────────────────
// Heuristic: map palette name keywords → "Use for" label

const CATEGORY_MAP = [
  [/lavender|lilac|wisteria|amethyst|grape|violet|purple/i, 'botanical beauty, floral branding, spa, wellness'],
  [/rose|blush|petal|blossom|cherry|peony|floral/i,        'beauty, skincare, floral, feminine lifestyle'],
  [/mint|minty|sage|garden|meadow|green|fern|botanical/i,  'organic beauty, wellness, natural food, sustainability'],
  [/ocean|sea|aqua|teal|coral|tide|surf|nautical|beach|pearl|salt/i, 'coastal lifestyle, wellness, travel, clean beauty'],
  [/pastel|soft|gentle|subtle|whisper|serene|calm|dream/i, 'light lifestyle editorial, wellness, home goods'],
  [/gold|peach|warm|lemon|citrine|honey|caramel|sorbet/i,  'artisan food, warm editorial, natural skincare'],
  [/candy|sugar|cupcake|macaron|cotton|milkshake|lemonade/i, 'confectionery, gifting, playful lifestyle, children'],
  [/ballet|ballerina|rococo|victorian|romance|belle/i,     'luxury beauty, premium fashion, editorial'],
  [/spring|fresh|bloom|garden|floral|flower/i,             'seasonal campaigns, fresh produce, floristry'],
];

function categoryFor(name) {
  for (const [re, label] of CATEGORY_MAP) {
    if (re.test(name)) return label;
  }
  return 'lifestyle editorial, light-theme campaigns';
}

// ─── Swatch name by position ───────────────────────────────────────────────

function swatchName(idx, total) {
  if (total === 2) return idx === 0 ? 'Light'  : 'Dark';
  if (total === 3) {
    return ['Light', 'Mid', 'Dark'][idx];
  }
  if (total === 4) {
    return ['Lightest', 'Light Mid', 'Dark Mid', 'Darkest'][idx];
  }
  return ['Lightest', 'Light Mid', 'Mid', 'Dark Mid', 'Darkest', 'Deep', 'Deepest'][idx] || `Swatch ${idx + 1}`;
}

// ─── Generate markdown for one palette ────────────────────────────────────

function paletteBlock(palette) {
  const hexes = palette.hexes;

  // Sort by luminance descending (lightest first)
  const sorted = [...hexes]
    .map(h => ({ hex: h, L: luminance(h) }))
    .sort((a, b) => b.L - a.L);

  const lightest = sorted[0];
  const darkest  = sorted[sorted.length - 1];
  const ratio    = contrast(lightest.hex, darkest.hex);
  const passAA   = ratio >= 4.5;
  const passLarge= ratio >= 3.0;
  const mark     = passAA ? '✓' : passLarge ? '(large only)' : '✗';

  const useFor = categoryFor(palette.name);

  const lines = [];
  lines.push(`## ${palette.name}`);
  lines.push('');

  // Theme/mood line
  const temp = lightest.L > 0.7 ? 'Light' : 'Mid';
  lines.push(`**Theme:** ${temp} — **Use for:** ${useFor}`);
  lines.push('');

  // Swatch table
  lines.push('| Swatch | Hex | Luminance |');
  lines.push('|---|---|---|');
  sorted.forEach((s, i) => {
    lines.push(`| ${swatchName(i, sorted.length)} | \`${s.hex}\` | ${fmtL(s.hex)} |`);
  });
  lines.push('');

  // Role table
  lines.push('| Role | Value |');
  lines.push('|---|---|');
  lines.push(`| Base | \`${lightest.hex}\` |`);

  // Mid/accent swatches (everything between lightest and darkest)
  const mids = sorted.slice(1, -1);
  if (mids.length === 1) {
    lines.push(`| Accent (decorative only) | \`${mids[0].hex}\` |`);
  } else {
    mids.forEach((m, i) => {
      lines.push(`| ${i === 0 ? 'Second tone' : 'Accent'} (decorative only) | \`${m.hex}\` |`);
    });
  }

  lines.push(`| **Text + CTA button** | \`${darkest.hex}\` |`);

  if (passAA) {
    lines.push(`| **Body text hex** | \`${darkest.hex}\` (${fmtContrast(ratio)} on base ✓) |`);
    lines.push(`| **CTA text** | \`${lightest.hex}\` (${fmtContrast(ratio)} on \`${darkest.hex}\` ✓) |`);
  } else if (passLarge) {
    lines.push(`| **Body text hex** | \`${darkest.hex}\` (${fmtContrast(ratio)} — large text only) |`);
    lines.push(`| **CTA text** | \`${lightest.hex}\` (${fmtContrast(ratio)} — large text only) |`);
  } else {
    lines.push(`| Body text | ⚠ insufficient contrast (${fmtContrast(ratio)}) — decorative use only |`);
  }

  // Glow / atmosphere
  const accentHex = mids.length > 0 ? mids[Math.floor(mids.length / 2)].hex : darkest.hex;
  const ar = parseInt(accentHex.slice(1, 3), 16);
  const ag = parseInt(accentHex.slice(3, 5), 16);
  const ab = parseInt(accentHex.slice(5, 7), 16);
  lines.push(`| Accent glow | \`rgba(${ar},${ag},${ab},0.26)\` |`);
  lines.push(`| Atmosphere | \`rgba(${ar},${ag},${ab},0.10)\` |`);
  lines.push('');

  return lines.join('\n');
}

// ─── Main ──────────────────────────────────────────────────────────────────

const dataPath  = resolve(__dirname, '../../scraped-pastel-colors.json');
const outPath   = resolve(__dirname, '../data/palettes-neutral.md');

const data = JSON.parse(readFileSync(dataPath, 'utf8'));

const header = `# Pastel Palettes

Scraped from ${data.source} on ${data.scraped_at.slice(0, 10)}.
${data.total_palettes} palettes — ${data.total_hex_codes} hex codes.

**Structural rule:** Within each palette, swatches are sorted light → dark by relative luminance. The lightest swatch is the \`Base\`. The darkest is \`Text + CTA button\`. Mid-luminance swatches (between lightest and darkest) fall in a zone where neither in-palette light nor dark text achieves reliable WCAG AA contrast — mark these **decorative only** (rules, borders, atmosphere, box-shadow). See §14 of color-theory.md for the contrast decision rule.

**Contrast rating:** ✓ = ≥4.5:1 (WCAG AA full) | (large only) = 3.0–4.5:1 (large text / UI only) | ⚠ = <3.0:1 (decorative only)

---

`;

const blocks = data.palettes.map(paletteBlock).join('---\n\n');

const md = header + blocks;

writeFileSync(outPath, md, 'utf8');

// Stats
const passing    = data.palettes.filter(p => {
  const sorted = [...p.hexes].map(h => ({ hex: h, L: luminance(h) })).sort((a, b) => b.L - a.L);
  return contrast(sorted[0].hex, sorted[sorted.length - 1].hex) >= 4.5;
}).length;
const largePassing = data.palettes.filter(p => {
  const sorted = [...p.hexes].map(h => ({ hex: h, L: luminance(h) })).sort((a, b) => b.L - a.L);
  const r = contrast(sorted[0].hex, sorted[sorted.length - 1].hex);
  return r >= 3.0 && r < 4.5;
}).length;
const failing = data.palettes.length - passing - largePassing;

console.log(`\nGenerated palettes-neutral.md`);
console.log(`  ${data.total_palettes} palettes, ${data.total_hex_codes} hex codes`);
console.log(`  ✓  WCAG AA (≥4.5:1): ${passing}`);
console.log(`  ~  Large text only (3–4.5:1): ${largePassing}`);
console.log(`  ⚠  Decorative only (<3:1): ${failing}`);
console.log(`\nOutput: ${outPath}`);
