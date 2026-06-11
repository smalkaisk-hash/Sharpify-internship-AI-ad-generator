/**
 * Meta Ad Generator 3 — component-based pipeline
 *
 * Usage:
 *   node src/pipeline.js <client-slug>
 *   node src/pipeline.js mariposa
 *   node src/pipeline.js changer-club
 *
 * Reads:  clients/<slug>/client-brief.json
 *         clients/<slug>/brand-assets.json
 *
 * Writes: clients/<slug>/output/html/ad-N.html
 *         clients/<slug>/output/png/ad-N.png
 *         clients/<slug>/output/ad-generation-v3.json
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

import { buildClientContext } from './context-builder.js';
import { generateComponents } from './steps/2-copy.js';
import { refineComponents } from './steps/3-refine.js';
import { assembleVariations } from './steps/2b-assemble.js';
import { selectTemplates } from './steps/3b-select-template.js';
import { generateHtml } from './steps/4-html.js';
import { exportPngs } from './steps/5-export.js';
import { COPY_MODEL, DESIGN_MODEL } from './client.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLIENT_BASE = resolve(__dirname, '../clients');

async function run(clientSlug) {
  const inputDir  = resolve(CLIENT_BASE, clientSlug);
  const outputDir = resolve(CLIENT_BASE, clientSlug, 'output');

  if (!existsSync(inputDir)) {
    throw new Error(`Client folder not found: ${inputDir}`);
  }

  const briefPath = resolve(inputDir, 'client-brief.json');
  const brandPath = resolve(inputDir, 'brand-assets.json');

  if (!existsSync(briefPath)) {
    throw new Error(`Missing client-brief.json — run step 1 (1-client-intake) first`);
  }

  const brief = JSON.parse(readFileSync(briefPath, 'utf8'));
  const brandAssets = existsSync(brandPath)
    ? JSON.parse(readFileSync(brandPath, 'utf8'))
    : {};

  if (!existsSync(brandPath)) {
    console.warn('Warning: brand-assets.json not found — using default colors/fonts');
  }

  const ctx = buildClientContext(brief, brandAssets);

  console.log('━'.repeat(60));
  console.log(`Client:   ${ctx.business_name}`);
  console.log(`Product:  ${ctx.product}`);
  console.log(`Audience: ${ctx.audience}`);
  console.log(`Type:     ${ctx.product_type}`);
  console.log(`Output:   ${outputDir}`);
  console.log('━'.repeat(60));

  // ── Pipeline ──────────────────────────────────────────────
  const components   = await generateComponents(ctx);
  const refined      = await refineComponents(components);
  const variations   = assembleVariations(refined);
  const templatePaths = await selectTemplates(variations, ctx);
  const htmlFiles    = await generateHtml(variations, ctx, outputDir, templatePaths);
  const pngFiles     = await exportPngs(htmlFiles, outputDir);
  // ─────────────────────────────────────────────────────────

  const metadata = {
    generator: 'meta-ad-generator-3',
    generated_at: new Date().toISOString(),
    client: ctx.business_name,
    model_copy: COPY_MODEL,
    model_design: DESIGN_MODEL,
    components: {
      headlines: refined.headlines,
      bullets: refined.bullets,
      base_texts: refined.base_texts,
      on_image_texts: refined.on_image_texts,
      cta: refined.cta,
    },
    ads: variations.map((v, i) => ({
      index: v.index,
      headline: v.headline,
      bullets: v.bullets,
      base_text: v.base_text,
      on_image_text: v.on_image_text,
      cta: v.cta,
      template: templatePaths[i] ? templatePaths[i].split(/[\\/]/).pop() : null,
      html_file: htmlFiles[i]?.filename || null,
      png_file: pngFiles[i]?.filename || null,
    })),
  };

  writeFileSync(
    resolve(outputDir, 'ad-generation-v3.json'),
    JSON.stringify(metadata, null, 2),
    'utf8',
  );

  console.log('\n' + '━'.repeat(60));
  console.log(`Done — ${pngFiles.length} ads generated for ${ctx.business_name}`);
  console.log(`Output: ${outputDir}`);
  console.log('━'.repeat(60));
}

const clientSlug = process.argv[2];

if (!clientSlug) {
  console.error('Usage: node src/pipeline.js <client-slug>');
  console.error('Example: node src/pipeline.js mariposa');
  process.exit(1);
}

run(clientSlug).catch(err => {
  console.error('\nPipeline error:', err.message);
  process.exit(1);
});
