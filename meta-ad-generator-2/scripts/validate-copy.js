#!/usr/bin/env node
/**
 * validate-copy.js
 * Validates ad-copy.json against Meta Ads specs and pipeline rules.
 *
 * Usage:
 *   node scripts/validate-copy.js clients/output/{client-slug}/copy/ad-copy.json
 *
 * Exit codes:
 *   0 — all sets pass
 *   1 — one or more sets have errors (pipeline should stop)
 */

const fs = require('fs');
const path = require('path');

// ── Meta character limits ────────────────────────────────────────────────────
const LIMITS = {
  headline:            { warn: 27, hard: 40 },
  description:         { warn: 27, hard: 30 },
  primary_text_short:  { warn: 125, hard: 150 },
  primary_text_long:   { warn: 500, hard: 600 },
  cta_text_on_image:   { warn: 20, hard: 25 },
  hook_words:          { warn: 10, hard: 12 },
};

// ── Banned decorative emojis (global rules) ──────────────────────────────────
const BANNED_EMOJIS = [
  '🔧','🤔','🏆','⭐','🌍','📰','👇','💡','🚀','🔥','💪','🎯',
  '📈','🤝','💼','🌟','✨','🎉','🏅','🥇','💯','👏','🙌','😊',
  '😍','🤩','👍','🙏','💫','⚡','🌈','🎨','🎭','🎪','🎬','📸',
];

// ── Phrases flagged by 7-anti-ai-slop ────────────────────────────────────────
const SLOP_PHRASES = [
  'delve into', 'unlock', 'unleash', 'seamless', 'game-changer', 'game changer',
  'cutting-edge', 'cutting edge', 'state-of-the-art', 'best-in-class', 'world-class',
  'innovative solution', 'robust', 'leverage', 'synergy', 'paradigm', 'disrupt',
  'transform your', 'revolutionize', 'take your .* to the next level',
  'look no further', 'don\'t miss out', 'limited time', 'act now',
  'in today\'s fast-paced', 'in the modern world', 'in this day and age',
  'needless to say', 'it goes without saying', 'it\'s no secret',
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function findBannedEmojis(text) {
  return BANNED_EMOJIS.filter(e => text.includes(e));
}

function findSlopPhrases(text) {
  return SLOP_PHRASES.filter(p => {
    try {
      return new RegExp(p, 'i').test(text);
    } catch {
      return text.toLowerCase().includes(p.toLowerCase());
    }
  });
}

function checkLimit(value, field, errors, warnings) {
  if (!value) return;
  const len = value.length;
  const limit = LIMITS[field];
  if (!limit) return;
  if (len > limit.hard) {
    errors.push(`${field}: ${len} chars — OVER hard limit of ${limit.hard}`);
  } else if (len > limit.warn) {
    warnings.push(`${field}: ${len} chars — over recommended ${limit.warn} (truncated in feed)`);
  }
}

function validateSet(ad, index) {
  const errors = [];
  const warnings = [];
  const id = ad.id || `ad-${index + 1}`;

  // Headline
  checkLimit(ad.headline, 'headline', errors, warnings);
  if (ad.headline && /[^\w\s\-–—.,!?'"()À-žĀ-ž€]/.test(ad.headline) === false) {
    // no emoji in headline — this is fine, just checking
  }
  const headlineEmoji = ad.headline ? findBannedEmojis(ad.headline) : [];
  if (headlineEmoji.length) errors.push(`headline contains banned emoji: ${headlineEmoji.join(' ')}`);

  // Description
  checkLimit(ad.description, 'description', errors, warnings);

  // Primary text short
  if (ad.primary_text?.short) {
    checkLimit(ad.primary_text.short, 'primary_text_short', errors, warnings);
    const slop = findSlopPhrases(ad.primary_text.short);
    if (slop.length) warnings.push(`primary_text.short contains slop phrases: "${slop.join('", "')}"`);
    const emoji = findBannedEmojis(ad.primary_text.short);
    if (emoji.length) errors.push(`primary_text.short contains banned emoji: ${emoji.join(' ')}`);
  } else {
    errors.push('primary_text.short is missing');
  }

  // Primary text long
  if (ad.primary_text?.long) {
    checkLimit(ad.primary_text.long, 'primary_text_long', errors, warnings);
    const slop = findSlopPhrases(ad.primary_text.long);
    if (slop.length) warnings.push(`primary_text.long contains slop phrases: "${slop.join('", "')}"`);
    const emoji = findBannedEmojis(ad.primary_text.long);
    if (emoji.length) errors.push(`primary_text.long contains banned emoji: ${emoji.join(' ')}`);
  }

  // Hook word count (first line of primary_text.short)
  if (ad.primary_text?.short) {
    const hook = ad.primary_text.short.split('\n')[0];
    const wordCount = countWords(hook);
    if (wordCount > LIMITS.hook_words.hard) {
      warnings.push(`hook is ${wordCount} words — should be ≤${LIMITS.hook_words.warn} words for scroll-stop impact`);
    }
  }

  // CTA text on image
  checkLimit(ad.cta_text_on_image, 'cta_text_on_image', errors, warnings);

  // Required fields
  if (!ad.framework) errors.push('framework is missing');
  if (!ad.layout_recommendation) errors.push('layout_recommendation is missing');
  if (!ad.cta_button) warnings.push('cta_button is missing (Meta CTA label)');
  if (!ad.hook_type) warnings.push('hook_type is missing');

  return { id, errors, warnings };
}

function validateDuplicates(copySets) {
  const headlines = copySets.map(a => a.headline?.toLowerCase().trim());
  const primaryShorts = copySets.map(a => a.primary_text?.short?.toLowerCase().trim());
  const issues = [];

  headlines.forEach((h, i) => {
    if (!h) return;
    headlines.forEach((h2, j) => {
      if (i < j && h === h2) {
        issues.push(`Duplicate headline on ad-${i+1} and ad-${j+1}: "${copySets[i].headline}"`);
      }
    });
  });

  primaryShorts.forEach((p, i) => {
    if (!p) return;
    primaryShorts.forEach((p2, j) => {
      if (i < j && p === p2) {
        issues.push(`Duplicate primary_text.short on ad-${i+1} and ad-${j+1}`);
      }
    });
  });

  return issues;
}

// ── Main ─────────────────────────────────────────────────────────────────────

function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Usage: node scripts/validate-copy.js <path-to-ad-copy.json>');
    process.exit(1);
  }

  const absPath = path.resolve(filePath);
  if (!fs.existsSync(absPath)) {
    console.error(`File not found: ${absPath}`);
    process.exit(1);
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(absPath, 'utf8'));
  } catch (e) {
    console.error(`Invalid JSON: ${e.message}`);
    process.exit(1);
  }

  if (!data.copy_sets || !Array.isArray(data.copy_sets)) {
    console.error('ad-copy.json must have a copy_sets array');
    process.exit(1);
  }

  console.log(`\n── COPY VALIDATION ─────────────────────────────────────────`);
  console.log(`   Client: ${data.client_name || 'unknown'}`);
  console.log(`   Language: ${data.language || 'unknown'}`);
  console.log(`   Ad type: ${data.ad_type || 'unknown'}`);
  console.log(`   Sets: ${data.copy_sets.length}`);
  console.log(`────────────────────────────────────────────────────────────\n`);

  let totalErrors = 0;
  let totalWarnings = 0;

  data.copy_sets.forEach((ad, i) => {
    const { id, errors, warnings } = validateSet(ad, i);
    const status = errors.length ? '✗ FAIL' : warnings.length ? '⚠ WARN' : '✓ PASS';
    console.log(`${status}  ${id}  [${ad.framework || '?'}]  "${ad.headline || '(no headline)'}"`);
    errors.forEach(e => console.log(`       ERROR: ${e}`));
    warnings.forEach(w => console.log(`       warn:  ${w}`));
    totalErrors += errors.length;
    totalWarnings += warnings.length;
  });

  // Duplicate check across all sets
  const dupeIssues = validateDuplicates(data.copy_sets);
  if (dupeIssues.length) {
    console.log(`\n── DUPLICATE CHECK ──`);
    dupeIssues.forEach(d => console.log(`   ERROR: ${d}`));
    totalErrors += dupeIssues.length;
  }

  // Layout variety check
  const layouts = data.copy_sets.map(a => a.layout_recommendation).filter(Boolean);
  const uniqueLayouts = new Set(layouts);
  if (uniqueLayouts.size < layouts.length) {
    console.log(`\n── VARIETY CHECK ──`);
    console.log(`   warn: Only ${uniqueLayouts.size} unique layouts for ${layouts.length} ads — increase template variety`);
    totalWarnings++;
  }

  console.log(`\n────────────────────────────────────────────────────────────`);
  if (totalErrors > 0) {
    // Remove stale stamp if it exists — copy changed and is now invalid
    const staleStamp = path.join(path.dirname(copyFilePath), '.copy-validated');
    if (fs.existsSync(staleStamp)) fs.unlinkSync(staleStamp);
    console.log(`   RESULT: ${totalErrors} error(s), ${totalWarnings} warning(s) — FIX ERRORS BEFORE PROCEEDING`);
    process.exit(1);
  } else if (totalWarnings > 0) {
    writeStamp(copyFilePath);
    console.log(`   RESULT: 0 errors, ${totalWarnings} warning(s) — review warnings then proceed`);
    process.exit(0);
  } else {
    writeStamp(copyFilePath);
    console.log(`   RESULT: All ${data.copy_sets.length} sets passed ✓`);
    process.exit(0);
  }
}

function writeStamp(copyFilePath) {
  const stampPath = path.join(path.dirname(copyFilePath), '.copy-validated');
  fs.writeFileSync(stampPath, new Date().toISOString());
}

main();
