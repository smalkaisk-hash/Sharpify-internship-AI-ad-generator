#!/usr/bin/env node
/**
 * check-copy.js — Copy duplication checker for HTML ads
 *
 * Usage:
 *   node scripts/check-copy.js <html-directory>
 *
 * Extracts copy from each ad by CSS slot, prints a clean breakdown,
 * and flags any content that overlaps across slots.
 */

const fs   = require('fs');
const path = require('path');

const inputDir = process.argv[2];
if (!inputDir) {
  console.error('Usage: node check-copy.js <html-directory>');
  process.exit(1);
}

// ─── Slot definitions ─────────────────────────────────────────────────────────
// Each slot has a role. Two slots sharing content = a problem.
const SLOTS = [
  { name: 'EYEBROW',  classes: ['eyebrow'] },
  { name: 'HEADLINE', classes: ['headline'] },
  { name: 'SUB',      classes: ['sub'] },
  { name: 'BULLETS',  classes: ['btext'] },
  { name: 'STATS',    classes: ['stat-num', 'stat-lbl'] },
  { name: 'CTA',      classes: ['cta'] },
  { name: 'TAG',      classes: ['tag', 'card-label', 'arch-logo-name', 'tag-text'] },
];

// ─── Extraction ───────────────────────────────────────────────────────────────
function extractByClasses(html, classes) {
  const results = [];
  for (const cls of classes) {
    // Require cls to be a standalone class token — not a suffix like logo-sub matching "sub"
    // Pattern: cls must be at the start of the attribute value OR preceded by whitespace
    const re = new RegExp(
      `<[a-z][^>]*\\bclass="(?:[^"]*\\s)?${cls}(?:\\s[^"]*)?"[^>]*>([\\s\\S]*?)<\\/`,
      'gi'
    );
    let m;
    while ((m = re.exec(html)) !== null) {
      const text = m[1]
        .replace(/<br\s*\/?>/gi, ' ')
        .replace(/<[^>]+>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      if (text && text.length > 1) results.push(text);
    }
  }
  return [...new Set(results)];
}

// ─── Duplication detection ────────────────────────────────────────────────────
function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^\wāčēģīķļņšūž\s·\-]/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Returns the overlapping phrase if a 2+ word sequence from A appears in B
function findOverlap(a, b) {
  const na = normalize(a);
  const nb = normalize(b);
  if (!na || !nb) return null;
  const words = na.split(' ');
  const MIN_WORDS = 2;
  for (let len = words.length; len >= MIN_WORDS; len--) {
    for (let i = 0; i <= words.length - len; i++) {
      const phrase = words.slice(i, i + len).join(' ');
      // Skip trivial common words
      if (/^(un|vai|ar|uz|no|ir|ka|kas|par|pie|tā|tas|šī|šis|ko|kā)$/.test(phrase)) continue;
      if (nb.includes(phrase)) return phrase;
    }
  }
  return null;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const files = fs.readdirSync(path.resolve(inputDir))
  .filter(f => f.endsWith('.html'))
  .sort();

if (files.length === 0) {
  console.log('No HTML files found in', inputDir);
  process.exit(0);
}

let totalIssues = 0;

for (const file of files) {
  const html = fs.readFileSync(path.join(path.resolve(inputDir), file), 'utf8');

  const slots = SLOTS.map(slot => ({
    name:  slot.name,
    texts: extractByClasses(html, slot.classes),
  })).filter(s => s.texts.length > 0);

  console.log(`\n${'─'.repeat(62)}`);
  console.log(`  ${file}`);
  console.log('─'.repeat(62));

  // Print each slot's copy
  for (const slot of slots) {
    const label = slot.name.padEnd(10);
    slot.texts.forEach((t, i) => {
      console.log(`  ${i === 0 ? label : ' '.repeat(10)}  ${t}`);
    });
  }

  // Cross-slot duplication check
  const flags = [];
  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      for (const ta of slots[i].texts) {
        for (const tb of slots[j].texts) {
          const overlap = findOverlap(ta, tb);
          if (overlap) {
            flags.push(`  ⚠  ${slots[i].name} ↔ ${slots[j].name}: "${overlap}"`);
          }
        }
      }
    }
  }

  console.log('');
  if (flags.length > 0) {
    flags.forEach(f => console.log(f));
    totalIssues += flags.length;
  } else {
    console.log('  ✓  No duplication');
  }
}

console.log(`\n${'═'.repeat(62)}`);
if (totalIssues > 0) {
  console.log(`  ⚠  ${totalIssues} flag(s) found — review before exporting`);
} else {
  console.log('  ✓  All ads clean');
}
console.log('═'.repeat(62) + '\n');

process.exit(totalIssues > 0 ? 1 : 0);
