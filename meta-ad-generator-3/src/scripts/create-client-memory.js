/**
 * Creates or updates a Claude memory file for a client.
 * Captures: name, slug, website, logo path, assets dir, brand file, output dir.
 *
 * Importable:  import { createClientMemory } from './create-client-memory.js';
 *              await createClientMemory(slug);
 *
 * CLI:         node src/scripts/create-client-memory.js <client-slug>
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const MEMORY_DIR  = resolve('C:/Users/User/.claude/projects/c--Users-User-Meta-ad-generator-v2/memory');
const MEMORY_INDEX = resolve(MEMORY_DIR, 'MEMORY.md');

export function createClientMemory(slug) {
  const inputDir  = resolve(__dirname, `../../clients/${slug}`);
  const outputDir = resolve(__dirname, `../../clients/${slug}/output`);
  const assetsDir = resolve(inputDir, 'assets');

  const briefPath     = resolve(inputDir, 'client-brief.json');
  const brandPath     = resolve(inputDir, 'brand-assets.json');
  const manifestPath  = resolve(inputDir, 'assets-manifest.json');

  if (!existsSync(briefPath)) {
    console.warn(`  create-client-memory: no client-brief.json for "${slug}" — skipping`);
    return;
  }

  const brief = JSON.parse(readFileSync(briefPath, 'utf8'));
  const name  = brief.business_name || slug;

  // Find logo from assets manifest if available
  let logoPath = null;
  if (existsSync(manifestPath)) {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    const logoAsset = manifest.assets?.find(a => a.category === 'logo') ||
                      manifest.assets?.find(a => a.category === 'favicon');
    if (logoAsset) {
      logoPath = resolve(assetsDir, logoAsset.filename).replace(/\\/g, '/');
    }
  }

  const website   = brief.website || null;
  const hasBrand  = existsSync(brandPath);
  const hasAssets = existsSync(assetsDir);

  // ── Build memory body ──────────────────────────────────────────────────────
  const lines = [
    `**Business:** ${name}`,
    `**Slug:** ${slug}`,
    `**Product type:** ${brief.product_type || 'unknown'}`,
    `**CTA:** ${brief.cta_primary || '—'}`,
    '',
    `**Website:** ${website || '(not set — add "website" to client-brief.json)'}`,
    `**Logo:** ${logoPath || '(not scraped yet — run: node src/scripts/scrape-assets.js ' + slug + ')'}`,
    '',
    '**Paths:**',
    `- Brief:        meta-ad-generator-3/clients/${slug}/client-brief.json`,
    `- Brand assets: ${hasBrand  ? `meta-ad-generator-3/clients/${slug}/brand-assets.json`  : '(not generated)'}`,
    `- Assets dir:   ${hasAssets ? `meta-ad-generator-3/clients/${slug}/assets/`            : '(not scraped yet)'}`,
    `- Manifest:     ${existsSync(manifestPath) ? `meta-ad-generator-3/clients/${slug}/assets-manifest.json` : '(not scraped yet)'}`,
    `- Output dir:   meta-ad-generator-3/clients/${slug}/output/`,
    '',
    '**Why:** Auto-created so future sessions can locate brand assets, logo, and website without re-reading the brief.',
    '**How to apply:** When working on this client, check the paths above for logo and brand assets before generating images or referencing brand colors.',
  ];

  const body = lines.join('\n');

  const memoryFile = resolve(MEMORY_DIR, `client_${slug}.md`);
  const content = `---
name: ${name} — client assets
description: Paths and metadata for ${name} (${slug}) — website, logo, brand assets, output dir
type: project
---

${body}
`;

  writeFileSync(memoryFile, content, 'utf8');
  console.log(`  Memory saved: memory/client_${slug}.md`);

  // ── Also write visible copy into both client folders ──────────────────────
  const clientContent = `# ${name} — Client Memory\n\n${body}\n`;
  writeFileSync(resolve(inputDir, 'client-memory.md'), clientContent, 'utf8');
  console.log(`  Visible copy: meta-ad-generator-3/clients/${slug}/client-memory.md`);

  // Write into the generator output folder too (meta-ad-generator-3/output/<slug>/)
  mkdirSync(outputDir, { recursive: true });
  writeFileSync(resolve(outputDir, 'client-memory.md'), clientContent, 'utf8');
  console.log(`  Visible copy: meta-ad-generator-3/output/${slug}/client-memory.md`);

  // ── Update MEMORY.md index ─────────────────────────────────────────────────
  const entryLine = `- [${name} — client assets](client_${slug}.md) — Website, logo path, brand assets, and output dir for ${name}`;
  const markerKey = `client_${slug}.md`;

  if (existsSync(MEMORY_INDEX)) {
    let index = readFileSync(MEMORY_INDEX, 'utf8');
    if (index.includes(markerKey)) {
      // Replace existing line
      index = index.replace(/^- \[.*?\]\(client_${slug}\.md\).*$/m, entryLine);
      // Fallback: replace by marker match
      const re = new RegExp(`^- \\[.*?\\]\\(${markerKey}\\).*$`, 'm');
      index = index.replace(re, entryLine);
    } else {
      index = index.trimEnd() + '\n' + entryLine + '\n';
    }
    writeFileSync(MEMORY_INDEX, index, 'utf8');
  } else {
    writeFileSync(MEMORY_INDEX, `# Memory Index\n\n${entryLine}\n`, 'utf8');
  }

  console.log(`  MEMORY.md updated with entry for ${name}`);
}

// CLI mode
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const slug = process.argv[2];
  if (!slug) { console.error('Usage: node src/scripts/create-client-memory.js <client-slug>'); process.exit(1); }
  createClientMemory(slug);
}
