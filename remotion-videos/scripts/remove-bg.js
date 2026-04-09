#!/usr/bin/env node

/**
 * Remove white/light backgrounds from PNG images using sharp.
 * Makes near-white pixels transparent with a soft edge.
 *
 * Usage: node scripts/remove-bg.js <input-dir> <output-dir>
 */

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const inputDir = process.argv[2] || "C:/Users/Ritvars Volfs/Downloads/Sharpify logo";
const outputDir = process.argv[3] || path.join(__dirname, "..", "public", "photos", "sharpify", "cropped");

fs.mkdirSync(outputDir, { recursive: true });

const THRESHOLD = 240; // Pixels with R,G,B all above this → transparent

async function removeWhiteBg(inputPath, outputPath) {
  const image = sharp(inputPath);
  const { width, height, channels } = await image.metadata();

  // Get raw pixel data
  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixelCount = info.width * info.height;

  for (let i = 0; i < pixelCount; i++) {
    const offset = i * 4;
    const r = data[offset];
    const g = data[offset + 1];
    const b = data[offset + 2];

    // If pixel is near-white, make transparent
    if (r > THRESHOLD && g > THRESHOLD && b > THRESHOLD) {
      data[offset + 3] = 0; // fully transparent
    }
    // Soft edge: semi-white pixels get partial transparency
    else if (r > 220 && g > 220 && b > 220) {
      const avg = (r + g + b) / 3;
      const alpha = Math.round(255 * (1 - (avg - 220) / (255 - 220)));
      data[offset + 3] = Math.min(data[offset + 3], alpha);
    }
  }

  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile(outputPath);
}

async function main() {
  const files = fs.readdirSync(inputDir).filter((f) => f.endsWith(".png"));
  console.log(`Processing ${files.length} images...`);

  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file);
    try {
      await removeWhiteBg(inputPath, outputPath);
      console.log(`  ✓ ${file}`);
    } catch (err) {
      console.error(`  ✗ ${file}: ${err.message}`);
    }
  }

  console.log(`\nDone! Cropped images saved to: ${outputDir}`);
}

main();
