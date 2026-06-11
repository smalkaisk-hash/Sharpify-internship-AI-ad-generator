#!/usr/bin/env node
/**
 * validate-output.js
 * Verifies exported PNG ads meet Meta Ads requirements.
 * Checks dimensions (1080x1080), file size, and file count vs expected.
 *
 * Usage:
 *   node scripts/validate-output.js <png-dir> [expected-count]
 *
 * Examples:
 *   node scripts/validate-output.js clients/output/naqaa-beauty/png
 *   node scripts/validate-output.js clients/output/naqaa-beauty/png 8
 *
 * Exit codes:
 *   0 — all PNGs pass
 *   1 — one or more PNGs fail (pipeline should not proceed to Meta upload)
 */

const fs = require('fs');
const path = require('path');

// ── Thresholds ────────────────────────────────────────────────────────────────
const MIN_FILE_SIZE_BYTES = 50 * 1024;        // 50 KB — below this = blank/broken render
const WARN_FILE_SIZE_BYTES = 200 * 1024;      // 200 KB — warn if suspiciously small
const MAX_FILE_SIZE_BYTES = 30 * 1024 * 1024; // 30 MB — Meta hard limit
const RECOMMENDED_MAX_BYTES = 2 * 1024 * 1024; // 2 MB — Meta recommendation
const EXPECTED_WIDTH = 1080;
const EXPECTED_HEIGHT = 1080;

// ── PNG dimension reader (pure Node, no deps) ─────────────────────────────────
// PNG dimensions are stored at bytes 16-24 of the file header.
function readPngDimensions(filePath) {
  const PNG_HEADER = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  const fd = fs.openSync(filePath, 'r');
  const header = Buffer.alloc(24);
  fs.readSync(fd, header, 0, 24, 0);
  fs.closeSync(fd);

  // Verify PNG magic bytes
  for (let i = 0; i < 8; i++) {
    if (header[i] !== PNG_HEADER[i]) {
      throw new Error('Not a valid PNG file');
    }
  }

  const width = header.readUInt32BE(16);
  const height = header.readUInt32BE(20);
  return { width, height };
}

// ── Validate a single PNG ─────────────────────────────────────────────────────
function validatePng(filePath) {
  const errors = [];
  const warnings = [];
  const stat = fs.statSync(filePath);
  const sizeBytes = stat.size;
  const sizeMB = (sizeBytes / (1024 * 1024)).toFixed(2);
  const sizeKB = (sizeBytes / 1024).toFixed(1);

  // File size checks
  if (sizeBytes < MIN_FILE_SIZE_BYTES) {
    errors.push(`File is only ${sizeKB} KB — likely a blank or broken render (min: 50 KB)`);
  } else if (sizeBytes < WARN_FILE_SIZE_BYTES) {
    warnings.push(`File is ${sizeKB} KB — suspiciously small, check for missing images/fonts`);
  }

  if (sizeBytes > MAX_FILE_SIZE_BYTES) {
    errors.push(`File is ${sizeMB} MB — exceeds Meta's 30 MB hard limit`);
  } else if (sizeBytes > RECOMMENDED_MAX_BYTES) {
    warnings.push(`File is ${sizeMB} MB — over recommended 2 MB (Meta may compress heavily)`);
  }

  // Dimension check
  try {
    const { width, height } = readPngDimensions(filePath);
    if (width !== EXPECTED_WIDTH || height !== EXPECTED_HEIGHT) {
      errors.push(`Dimensions are ${width}x${height} — expected ${EXPECTED_WIDTH}x${EXPECTED_HEIGHT}`);
    }
  } catch (e) {
    errors.push(`Could not read PNG dimensions: ${e.message}`);
  }

  return { errors, warnings, sizeBytes };
}

// ── Main ──────────────────────────────────────────────────────────────────────
function main() {
  const pngDir = process.argv[2];
  const expectedCount = process.argv[3] ? parseInt(process.argv[3], 10) : null;

  if (!pngDir) {
    console.error('Usage: node scripts/validate-output.js <png-dir> [expected-count]');
    process.exit(1);
  }

  const absDir = path.resolve(pngDir);
  if (!fs.existsSync(absDir)) {
    console.error(`Directory not found: ${absDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(absDir)
    .filter(f => f.toLowerCase().endsWith('.png'))
    .sort();

  console.log(`\n── OUTPUT VALIDATION ────────────────────────────────────────`);
  console.log(`   Directory: ${absDir}`);
  console.log(`   PNG files found: ${files.length}${expectedCount !== null ? ` (expected ${expectedCount})` : ''}`);
  console.log(`────────────────────────────────────────────────────────────\n`);

  if (files.length === 0) {
    console.error('   ERROR: No PNG files found in directory');
    process.exit(1);
  }

  let totalErrors = 0;
  let totalWarnings = 0;

  files.forEach(file => {
    const filePath = path.join(absDir, file);
    const { errors, warnings, sizeBytes } = validatePng(filePath);
    const sizeStr = sizeBytes >= 1024 * 1024
      ? `${(sizeBytes / (1024 * 1024)).toFixed(2)} MB`
      : `${(sizeBytes / 1024).toFixed(1)} KB`;

    const status = errors.length ? '✗ FAIL' : warnings.length ? '⚠ WARN' : '✓ PASS';
    console.log(`${status}  ${file}  [${sizeStr}]`);
    errors.forEach(e => console.log(`       ERROR: ${e}`));
    warnings.forEach(w => console.log(`       warn:  ${w}`));
    totalErrors += errors.length;
    totalWarnings += warnings.length;
  });

  // Count mismatch check
  if (expectedCount !== null && files.length !== expectedCount) {
    const diff = expectedCount - files.length;
    console.log(`\n── COUNT CHECK ──`);
    if (diff > 0) {
      console.error(`   ERROR: Missing ${diff} PNG(s) — expected ${expectedCount}, found ${files.length}`);
      totalErrors++;
    } else {
      console.log(`   warn: Found ${Math.abs(diff)} extra PNG(s) vs expected ${expectedCount}`);
      totalWarnings++;
    }
  }

  console.log(`\n────────────────────────────────────────────────────────────`);
  if (totalErrors > 0) {
    console.log(`   RESULT: ${totalErrors} error(s), ${totalWarnings} warning(s) — DO NOT UPLOAD TO META`);
    process.exit(1);
  } else if (totalWarnings > 0) {
    console.log(`   RESULT: 0 errors, ${totalWarnings} warning(s) — review warnings, then upload`);
    process.exit(0);
  } else {
    console.log(`   RESULT: All ${files.length} PNG(s) passed ✓ — ready for Meta upload`);
    process.exit(0);
  }
}

main();
