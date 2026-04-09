#!/usr/bin/env node

/**
 * Bridge Script: meta-ad-generator → Remotion
 *
 * Reads client-brief.json + brand-assets.json from the meta-ad-generator
 * output directory and produces a video-config.json for Remotion.
 *
 * Usage: node scripts/bridge-config.js <client-slug>
 * Example: node scripts/bridge-config.js naqaa-beauty
 */

const fs = require("fs");
const path = require("path");

const slug = process.argv[2];
if (!slug) {
  console.error("Usage: node scripts/bridge-config.js <client-slug>");
  process.exit(1);
}

const metaAdDir = path.join(__dirname, "..", "..", "meta-ad-generator", "output", slug, "brief");
const briefPath = path.join(metaAdDir, "client-brief.json");
const assetsPath = path.join(metaAdDir, "brand-assets.json");

if (!fs.existsSync(briefPath)) {
  console.error(`client-brief.json not found at: ${briefPath}`);
  process.exit(1);
}
if (!fs.existsSync(assetsPath)) {
  console.error(`brand-assets.json not found at: ${assetsPath}`);
  process.exit(1);
}

const brief = JSON.parse(fs.readFileSync(briefPath, "utf-8"));
const assets = JSON.parse(fs.readFileSync(assetsPath, "utf-8"));

// --- Copy product images ---
const imagesDir = path.join(metaAdDir, "images");
const destImagesDir = path.join(__dirname, "..", "public", "photos", slug);

if (fs.existsSync(imagesDir)) {
  fs.mkdirSync(destImagesDir, { recursive: true });
  const images = fs.readdirSync(imagesDir).filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f));
  images.forEach((img) => {
    const src = path.join(imagesDir, img);
    const dest = path.join(destImagesDir, img);
    if (!fs.existsSync(dest)) {
      fs.copyFileSync(src, dest);
      console.log(`  Copied: ${img}`);
    }
  });
  console.log(`Copied ${images.length} images to public/photos/${slug}/`);
}

// --- Build video config ---
const colors = assets.colors?.suggested || {};
const fonts = assets.typography?.suggested || {};
const content = assets.content || {};
const productImages = (assets.images?.products || []).map((p) => {
  // Convert "brief/images/product-foo.jpg" → "photos/{slug}/product-foo.jpg"
  const filename = path.basename(p);
  return `photos/${slug}/${filename}`;
});

const videoConfig = {
  brand: {
    name: brief.client_name || slug,
    colors: {
      primary: colors.primary || "#0097B2",
      secondary: colors.secondary || "#B8960C",
      accent: colors.accent || "#B8960C",
      background: colors.background || "#FFFFFF",
      text: colors.text || "#1A1A2E",
      ctaBg: colors.cta_bg || colors.accent || "#B8960C",
      ctaText: colors.cta_text || "#FFFFFF",
    },
    fonts: {
      heading: fonts.heading || "Playfair Display",
      body: fonts.body || "Inter",
    },
    tagline: content.tagline || null,
    website: brief.website || null,
  },
  format: "1:1",
  language: brief.language || "lv",
  // Provide raw data for Claude to compose scenes from
  rawData: {
    painPoints: brief.target_audience?.pain_points || [],
    desires: brief.target_audience?.desires || [],
    mainOffer: brief.offer?.main_offer || "",
    resultPromise: brief.offer?.result_promise || "",
    differentiators: brief.differentiator?.key_points || [],
    trustSignals: brief.trust_signals?.credentials || [],
    socialProof: brief.trust_signals?.social_proof || [],
    products: brief.products || {},
    bonuses: brief.bonuses || [],
    keyBenefits: content.key_benefits || [],
    mission: content.mission || "",
    tone: content.tone || "",
    productImages,
  },
};

// --- Write output ---
const outputDir = path.join(__dirname, "..", "public", "configs");
fs.mkdirSync(outputDir, { recursive: true });
const outputPath = path.join(outputDir, `${slug}.json`);
fs.writeFileSync(outputPath, JSON.stringify(videoConfig, null, 2));

console.log(`\nVideo config written to: public/configs/${slug}.json`);
console.log(`Brand: ${videoConfig.brand.name}`);
console.log(`Colors: primary=${videoConfig.brand.colors.primary}, accent=${videoConfig.brand.colors.accent}`);
console.log(`Fonts: ${videoConfig.brand.fonts.heading} / ${videoConfig.brand.fonts.body}`);
console.log(`Product images: ${productImages.length}`);
console.log(`\nReady! Open Remotion Studio to preview.`);
