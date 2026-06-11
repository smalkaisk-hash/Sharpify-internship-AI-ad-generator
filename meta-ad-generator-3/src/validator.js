// Structural validator for the components pipeline.
// Quality (slop, tone, language) is handled by the refiner prompt — not here.
// This validator catches things that are always wrong regardless of language:
// character limits, field counts, dashes, empty fields, filler question openers.

// English filler openers — only checked when copy appears to be English.
// For other languages, the refiner prompt handles this semantically.
const ENGLISH_FILLER_OPENERS = [
  'are you ', 'do you ', 'have you ', 'imagine if ', 'imagine you ', 'what if you ',
];

// Language-agnostic vague descriptor check (Latvian + English equivalents).
// These signal generic AI copy — the refiner should replace with concrete facts.
const VAGUE_WORDS = [
  'efektīvs', 'efektīva', 'efektīvi', 'labs', 'laba', 'labi',
  'viegls', 'viegla', 'viegli', 'ātrs', 'ātra', 'ātri',
  'moderns', 'moderna', 'moderni', 'inovatīvs', 'inovatīva',
  'profesionāls', 'profesionāla', 'kvalitatīvs', 'kvalitatīva',
  'effective', 'professional', 'quality', 'amazing', 'seamless', 'innovative',
];

function looksEnglish(text) {
  // Simple heuristic: if the text contains common English function words, treat as English
  return /\b(you|your|the|is|are|we|our|this|that|it|with|for|and|but)\b/i.test(text);
}

export function validateComponents(components) {
  const issues = [];

  const allFields = [
    ...(components.headlines || []),
    ...(components.bullets || []),
    ...(components.base_texts || []),
    ...(components.on_image_texts || []),
  ];

  // Field count checks
  if (!components.headlines || components.headlines.length !== 3) {
    issues.push(`Expected 3 headlines, got ${components.headlines?.length ?? 0}`);
  }
  if (!components.bullets || components.bullets.length !== 6) {
    issues.push(`Expected 6 bullets, got ${components.bullets?.length ?? 0}`);
  }
  if (!components.base_texts || components.base_texts.length !== 3) {
    issues.push(`Expected 3 base_texts, got ${components.base_texts?.length ?? 0}`);
  }
  if (!components.on_image_texts || components.on_image_texts.length !== 3) {
    issues.push(`Expected 3 on_image_texts, got ${components.on_image_texts?.length ?? 0}`);
  }

  // Empty field check
  for (const field of allFields) {
    if (!field || field.trim().length === 0) {
      issues.push(`Empty field found in components`);
    }
  }

  // Dash rule — language-agnostic, applies to all copy
  for (const field of allFields) {
    if (/ — /.test(field) || / - /.test(field)) {
      issues.push(`Dash used as punctuation in: "${field.slice(0, 60)}"`);
    }
  }

  // Character limits
  (components.headlines || []).forEach((h, i) => {
    if (h.length > 40) issues.push(`Headline ${i + 1} is ${h.length} chars (limit 40): "${h}"`);
  });

  (components.bullets || []).forEach((b, i) => {
    if (b.length > 60) issues.push(`Bullet ${i + 1} is ${b.length} chars (limit 60): "${b}"`);
  });

  (components.base_texts || []).forEach((bt, i) => {
    if (bt.length > 220) issues.push(`Base text ${i + 1} is ${bt.length} chars (limit 220)`);
  });

  (components.on_image_texts || []).forEach((oit, i) => {
    if (oit.length > 30) issues.push(`On-image text ${i + 1} is ${oit.length} chars (limit 30): "${oit}"`);
  });

  // Filler question openers — English only (other languages handled by refiner prompt)
  (components.base_texts || []).forEach((bt, i) => {
    if (looksEnglish(bt)) {
      const lower = bt.toLowerCase();
      for (const opener of ENGLISH_FILLER_OPENERS) {
        if (lower.startsWith(opener)) {
          issues.push(`Base text ${i + 1} starts with filler opener: "${opener.trim()}"`);
          break;
        }
      }
    }
  });

  // On-image text / base_text first-word overlap — same opening word is redundant
  (components.on_image_texts || []).forEach((oit, i) => {
    const bt = (components.base_texts || [])[i];
    if (!oit || !bt) return;
    const firstWord = (s) => s.trim().split(/\s+/)[0].toLowerCase().replace(/[^\p{L}]/gu, '');
    const oitFirst = firstWord(oit);
    const btFirst  = firstWord(bt);
    if (oitFirst && btFirst && oitFirst === btFirst) {
      issues.push(`on_image_text ${i + 1} and base_text ${i + 1} both open with "${oitFirst}" — rewrite base_text opening to enter from a different angle`);
    }
  });

  // Vague descriptor check — language-agnostic
  for (const field of allFields) {
    const words = field.toLowerCase().split(/\W+/);
    for (const vague of VAGUE_WORDS) {
      if (words.includes(vague)) {
        issues.push(`Vague word "${vague}" found in: "${field.slice(0, 60)}" — replace with a concrete fact`);
        break;
      }
    }
  }

  return { valid: issues.length === 0, issues };
}
