import anthropic, { DESIGN_MODEL } from '../client.js';
import { DESIGNER_SYSTEM_PROMPT } from '../prompts/copywriter.js';
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

export async function generateHtml(variations, clientContext, outputDir, templatePaths = []) {
  console.log('\nStep 4: Generating HTML ads...');

  mkdirSync(resolve(outputDir, 'html'), { recursive: true });

  const logoDataUri  = resolveAssetDataUri(clientContext.logo_url);
  const heroImages   = clientContext.hero_images || [];

  const htmlFiles = [];

  for (let i = 0; i < variations.length; i++) {
    const variation    = variations[i];
    const adIndex      = variation.index;
    const templatePath = templatePaths[i] || null;

    // Rotate through available images so each variation gets a different photo
    const heroImagePath = heroImages.length > 0
      ? heroImages[i % heroImages.length]
      : null;

    console.log(`  Designing ad ${adIndex}${heroImagePath ? ` (image ${(i % heroImages.length) + 1}/${heroImages.length})` : ''}...`);

    const { system, messages } = buildMessages(variation, clientContext, templatePath, logoDataUri, heroImagePath);

    const response = await anthropic.messages.create({
      model: DESIGN_MODEL,
      max_tokens: 4096,
      system,
      messages,
    });

    const text = response.content[0]?.text || '';

    let html = text
      .replace(/^```(?:html)?\s*/m, '')
      .replace(/\s*```\s*$/m, '')
      .trim();

    if (!html.toLowerCase().startsWith('<!doctype') && !html.toLowerCase().startsWith('<html')) {
      html = `<!DOCTYPE html>\n${html}`;
    }

    html = sanitizeHtml(html);

    const filename = `ad-${adIndex}.html`;
    const filepath = resolve(outputDir, 'html', filename);

    writeFileSync(filepath, html, 'utf8');
    htmlFiles.push({ filename, filepath, variation, index: adIndex });
    console.log(`  Saved: html/${filename}`);
  }

  return htmlFiles;
}

function resolveAssetDataUri(filePath) {
  if (!filePath || !existsSync(filePath)) return null;
  try {
    const ext  = filePath.split('.').pop().toLowerCase();
    const mime = ext === 'svg' ? 'image/svg+xml'
               : ext === 'webp' ? 'image/webp'
               : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg'
               : 'image/png';
    const b64 = readFileSync(filePath).toString('base64');
    return `data:${mime};base64,${b64}`;
  } catch {
    return null;
  }
}

function loadImageForAnthropic(filePath) {
  if (!filePath || !existsSync(filePath)) return null;
  try {
    const ext = filePath.split('.').pop().toLowerCase();
    const mediaType = ext === 'webp' ? 'image/webp'
                    : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg'
                    : ext === 'gif' ? 'image/gif'
                    : 'image/png';
    const data = readFileSync(filePath).toString('base64');
    return { mediaType, data };
  } catch {
    return null;
  }
}

function buildMessages(variation, ctx, templatePath, logoDataUri, heroImagePath) {
  const briefText = buildDesignBrief(variation, ctx, !!templatePath, logoDataUri, !!heroImagePath);

  const userContent = [];

  if (templatePath && existsSync(templatePath)) {
    const templateImg = loadImageForAnthropic(templatePath);
    const templateName = templatePath.split(/[\\/]/).pop();
    userContent.push({
      type: 'text',
      text: `The image below is your layout reference template (${templateName}).\n\nStudy its structure: text placement, visual hierarchy, spacing, and composition.\nReplicate this exact layout structure in your HTML — apply the client brand colors, fonts, and copy below, but preserve the layout geometry.\n\n${briefText}`,
    });
    if (templateImg) {
      userContent.push({
        type: 'image',
        source: { type: 'base64', media_type: templateImg.mediaType, data: templateImg.data },
      });
    }
  } else {
    userContent.push({ type: 'text', text: briefText });
  }

  // Attach hero image as a vision reference if available
  if (heroImagePath && existsSync(heroImagePath)) {
    const heroImg = loadImageForAnthropic(heroImagePath);
    if (heroImg) {
      userContent.push({ type: 'text', text: 'CLIENT PHOTO ASSET — use this as your hero image:' });
      userContent.push({
        type: 'image',
        source: { type: 'base64', media_type: heroImg.mediaType, data: heroImg.data },
      });
    }
  }

  const systemBlocks = [{ type: 'text', text: DESIGNER_SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }];

  // Simple text-only path (no vision content)
  if (userContent.length === 1 && userContent[0].type === 'text') {
    return {
      system: systemBlocks,
      messages: [{ role: 'user', content: userContent[0].text }],
    };
  }

  return {
    system: systemBlocks,
    messages: [{ role: 'user', content: userContent }],
  };
}

// Enforce the no-dash rule (refiner.md rule 2) on the generated HTML.
// CSS calc() and attribute values never use " — " or &mdash; entities, so these
// replacements are safe against false positives in style blocks.
function sanitizeHtml(html) {
  return html
    .replace(/ — /g,       '. ')
    .replace(/ – /g,       '. ')
    .replace(/&mdash;/gi,  '. ')
    .replace(/&#8212;/g,   '. ')
    .replace(/&#x2014;/gi, '. ');
}

function buildDesignBrief(variation, ctx, hasTemplate, logoDataUri, hasHeroImage) {
  const bulletList = variation.bullets.map(b => `  • ${b}`).join('\n');

  return `${hasTemplate ? 'CONTENT TO PLACE INTO THE TEMPLATE LAYOUT:' : 'Design a 1080×1080px Meta ad with these exact requirements:'}

ON-IMAGE TEXT:
  Brand:         ${ctx.business_name}
  On-image text: "${variation.on_image_text}"
  Base text:     "${variation.base_text}"
  Bullets:
${bulletList}
  CTA button:    "${variation.cta}"

BRAND COLORS:
  Primary:   ${ctx.primary_color}
  Secondary: ${ctx.secondary_color}
  Accent:    ${ctx.accent_color}

BRAND FONTS (use these or find Google Fonts equivalents):
  Primary: ${ctx.heading_font}

LOGO: ${logoDataUri ? `embed using <img src="${logoDataUri}" /> — place top of ad, small` : 'none provided'}

CLIENT PHOTO ASSET: ${hasHeroImage ? 'provided below as a vision image — use it' : 'none — use typography and color blocking only'}

PRODUCT TYPE: ${ctx.product_type}
${ctx.product_type === 'tangible' ? '→ Physical product: show strong product context' : hasHeroImage ? '→ Service with client photo: use the provided photo as the hero visual' : '→ Service/digital: bold typography + color blocking, no stock photos'}

${hasTemplate
  ? 'Canvas size: 1080×1080px. Apply brand colors and copy to the template layout above. Return only the complete HTML document.'
  : 'Design a distinctive, high-converting 1080×1080px ad. Make a strong visual choice — do not default to a generic layout. Return only the complete HTML document.'}`;
}
