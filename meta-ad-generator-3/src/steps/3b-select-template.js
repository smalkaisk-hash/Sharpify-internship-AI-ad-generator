/**
 * Step 3b — Template Selection
 *
 * For each refined ad, samples N template pages from template-pages/,
 * sends them to the model as vision images, and asks it to pick the best
 * layout fit based on the copy framework and product type.
 *
 * Returns an array of absolute template image paths, one per ad.
 */

import anthropic, { DESIGN_MODEL } from '../client.js';
import { readFileSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATE_DIR = resolve(__dirname, '../../../template-pages');
const SAMPLES_PER_AD = 12; // how many template images to show the model per ad

function loadTemplateList() {
  return readdirSync(TEMPLATE_DIR)
    .filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f))
    .sort()
    .map(f => resolve(TEMPLATE_DIR, f));
}

function sampleTemplates(allPaths, adIndex) {
  const total = allPaths.length;
  const n = Math.min(SAMPLES_PER_AD, total);
  const step = Math.floor(total / n);
  // Offset the starting point per ad so each ad sees different templates
  const offset = (adIndex * Math.ceil(total / 4)) % step;
  const selected = [];
  for (let i = 0; i < n; i++) {
    selected.push(allPaths[(offset + i * step) % total]);
  }
  return selected;
}

function toBase64(filepath) {
  return readFileSync(filepath).toString('base64');
}

function getMediaType(filepath) {
  const ext = filepath.split('.').pop().toLowerCase();
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
  if (ext === 'webp') return 'image/webp';
  if (ext === 'gif') return 'image/gif';
  return 'image/png';
}

function buildSelectionPrompt(variation, ctx, samplePaths) {
  const lines = [
    `You are selecting an ad layout template.`,
    ``,
    `AD DETAILS:`,
    `- Business: ${ctx.business_name}`,
    `- Product type: ${ctx.product_type} (${ctx.product_type === 'tangible' ? 'physical product' : 'service/intangible'})`,
    `- On-image text: "${variation.on_image_text}"`,
    `- Headline: "${variation.headline}"`,
    `- Bullets: ${variation.bullets.length} bullet points`,
    ``,
    `TEMPLATES (shown in order, numbered 1 to ${samplePaths.length}):`,
    `Review all ${samplePaths.length} template images carefully.`,
    ``,
    `Pick the single template whose LAYOUT STRUCTURE (not colors or text) best suits this ad.`,
    `Consider: text hierarchy, use of space, visual weight, bullet list accommodation.`,
    ``,
    `Respond with ONLY a JSON object, nothing else:`,
    `{"selected": <number 1-${samplePaths.length}>, "reason": "<one sentence>"}`,
  ];
  return lines.join('\n');
}

export async function selectTemplates(variations, ctx) {
  console.log('\nStep 3b: Selecting layout templates...');

  const allTemplates = loadTemplateList();
  if (allTemplates.length === 0) {
    console.warn('  Warning: no templates found in template-pages/ — skipping template selection');
    return variations.map(() => null);
  }

  console.log(`  Template library: ${allTemplates.length} pages`);

  const selectedPaths = [];

  for (let i = 0; i < variations.length; i++) {
    const variation = variations[i];
    const adIndex = variation.index;

    const samplePaths = sampleTemplates(allTemplates, i);
    console.log(`  Ad ${adIndex}: evaluating ${samplePaths.length} templates...`);

    const imageContent = samplePaths.map(p => ({
      type: 'image',
      source: { type: 'base64', media_type: getMediaType(p), data: toBase64(p) },
    }));

    const response = await anthropic.messages.create({
      model: DESIGN_MODEL,
      max_tokens: 150,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: buildSelectionPrompt(variation, ctx, samplePaths) },
            ...imageContent,
          ],
        },
      ],
    });

    let selectedPath = null;
    try {
      const raw = response.content[0]?.text || '';
      const cleaned = raw.replace(/^```(?:json)?\s*/m, '').replace(/\s*```\s*$/m, '').trim();
      const parsed = JSON.parse(cleaned);
      const idx = parseInt(parsed.selected);
      if (idx >= 1 && idx <= samplePaths.length) {
        selectedPath = samplePaths[idx - 1];
        const templateName = selectedPath.split(/[\\/]/).pop();
        console.log(`  Ad ${adIndex}: selected template ${templateName} — ${parsed.reason}`);
      }
    } catch {
      console.warn(`  Ad ${adIndex}: template selection parse failed — using first sample as fallback`);
      selectedPath = samplePaths[0];
    }

    selectedPaths.push(selectedPath);
  }

  return selectedPaths;
}
