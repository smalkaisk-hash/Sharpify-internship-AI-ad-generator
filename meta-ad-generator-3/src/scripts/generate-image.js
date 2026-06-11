/**
 * Gemini Imagen 4 — generate a square image from a text prompt.
 *
 * Importable:  import { generateImage } from './scripts/generate-image.js';
 *              await generateImage(prompt, outputPath);
 *
 * CLI:         node src/scripts/generate-image.js "<prompt>" "<output-path>"
 *
 * Requires: GEMINI_API_KEY in root .env
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
const localEnv = resolve(__dirname, '../../.env');
const rootEnv  = resolve(__dirname, '../../../.env');
dotenv.config({ path: existsSync(localEnv) ? localEnv : rootEnv });

const API_KEY = process.env.GEMINI_API_KEY;
const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict';

/**
 * Generate a 1:1 image via Gemini Imagen 4 and save it to disk.
 * Retries once on failure before throwing.
 */
export async function generateImage(prompt, outputPath) {
  if (!API_KEY) throw new Error('GEMINI_API_KEY not set in .env');

  console.log(`  Generating image: "${prompt.slice(0, 80)}..."`);

  for (let attempt = 1; attempt <= 2; attempt++) {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': API_KEY,
      },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: { sampleCount: 1, aspectRatio: '1:1' },
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      if (attempt === 1) {
        console.warn(`  Imagen attempt ${attempt} failed (${response.status}) — retrying...`);
        continue;
      }
      throw new Error(`Imagen API error (${response.status}): ${text.slice(0, 300)}`);
    }

    const data = await response.json();
    const encoded = data.predictions?.[0]?.bytesBase64Encoded;

    if (!encoded) {
      if (attempt === 1) { console.warn('  No image in response — retrying...'); continue; }
      throw new Error('Imagen returned no image data.');
    }

    const buffer = Buffer.from(encoded, 'base64');
    const dir = dirname(outputPath);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(outputPath, buffer);

    const sizeMB = (buffer.length / 1024 / 1024).toFixed(2);
    console.log(`  Saved: ${outputPath} (${sizeMB} MB)`);
    return outputPath;
  }
}

// CLI mode
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const prompt = process.argv[2];
  const outputPath = process.argv[3];

  if (!prompt || !outputPath) {
    console.error('Usage: node src/scripts/generate-image.js "<prompt>" "<output-path>"');
    process.exit(1);
  }

  generateImage(prompt, outputPath).catch(err => {
    console.error('Failed:', err.message);
    process.exit(1);
  });
}
