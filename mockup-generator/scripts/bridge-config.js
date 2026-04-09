#!/usr/bin/env node

/**
 * Bridge Script: meta-ad-generator → Mockup Generator
 *
 * Reads client-brief.json + brand-assets.json from the meta-ad-generator
 * output directory and produces a mockup-config.json for the mockup pipeline.
 *
 * Usage: node scripts/bridge-config.js <client-slug>
 * Example: node scripts/bridge-config.js naqaa-beauty
 */

const fs = require('fs');
const path = require('path');

const slug = process.argv[2];
if (!slug) {
  console.error('Usage: node scripts/bridge-config.js <client-slug>');
  process.exit(1);
}

const metaAdDir = path.join(__dirname, '..', '..', 'meta-ad-generator', 'output', slug, 'brief');
const briefPath = path.join(metaAdDir, 'client-brief.json');
const assetsPath = path.join(metaAdDir, 'brand-assets.json');

if (!fs.existsSync(briefPath)) {
  console.error(`client-brief.json not found at: ${briefPath}`);
  process.exit(1);
}
if (!fs.existsSync(assetsPath)) {
  console.error(`brand-assets.json not found at: ${assetsPath}`);
  process.exit(1);
}

const brief = JSON.parse(fs.readFileSync(briefPath, 'utf-8'));
const assets = JSON.parse(fs.readFileSync(assetsPath, 'utf-8'));

// --- Extract brand data ---
const colors = assets.colors?.suggested || {};
const fonts = assets.typography?.suggested || {};
const content = assets.content || {};

const mockupConfig = {
  client_name: brief.client_name || slug,
  website: brief.website || null,
  language: brief.language || 'lv',
  brand: {
    colors: {
      primary: colors.primary || '#10b981',
      secondary: colors.secondary || '#6366f1',
      accent: colors.accent || '#10b981',
      background: colors.background || '#0f172a',
      text: colors.text || '#ffffff',
    },
    fonts: {
      heading: fonts.heading || 'Montserrat',
      body: fonts.body || 'Inter',
    },
  },
  content: {
    tagline: content.tagline || null,
    key_benefits: content.key_benefits || [],
    mission: content.mission || '',
  },
  screenshots: {
    desktop: `screenshots/desktop.png`,
    mobile: `screenshots/mobile.png`,
    tablet: `screenshots/tablet.png`,
  },
};

// --- Write output ---
const outputDir = path.join(__dirname, '..', 'output', slug);
fs.mkdirSync(outputDir, { recursive: true });
const outputPath = path.join(outputDir, 'mockup-config.json');
fs.writeFileSync(outputPath, JSON.stringify(mockupConfig, null, 2));

console.log(`\nMockup config written to: output/${slug}/mockup-config.json`);
console.log(`Brand: ${mockupConfig.client_name}`);
console.log(`Colors: primary=${mockupConfig.brand.colors.primary}, accent=${mockupConfig.brand.colors.accent}`);
console.log(`Website: ${mockupConfig.website}`);
console.log(`\nNext steps:`);
console.log(`  1. Capture screenshots: node scripts/capture-screenshot.js ${mockupConfig.website} output/${slug}/screenshots/`);
console.log(`  2. Create mockup HTML from templates`);
console.log(`  3. Export: node scripts/export-mockup.js output/${slug}/html/ output/${slug}/png/`);
