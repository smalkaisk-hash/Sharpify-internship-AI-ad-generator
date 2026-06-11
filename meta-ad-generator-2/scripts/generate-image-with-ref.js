/**
 * Gemini 2.5 Flash Image Preview (nano-banana) — image-to-image with reference
 *
 * Use when you need to place the ACTUAL product into a new scene/angle rather than
 * letting Imagen invent one. Text-only Imagen (generate-image.js) fabricates a
 * generic product; this one preserves product identity using a reference image.
 *
 * Usage:
 *   node scripts/generate-image-with-ref.js "<prompt>" "<ref-image-path>" "<output-path>"
 *
 * Example:
 *   node scripts/generate-image-with-ref.js "This robotic mower cutting grass on a manicured lawn at golden hour, low three-quarter angle, long shadows, cinematic" \
 *     "clients/output/fjdynamics-fl3000/brief/images/hero-2.png" \
 *     "clients/output/fjdynamics-fl3000/brief/images/inaction-1.png"
 *
 * Requires: GEMINI_API_KEY in .env file
 */

const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const API_KEY = process.env.GEMINI_API_KEY;
const prompt = process.argv[2];
const refPath = process.argv[3];
const outputPath = process.argv[4];

if (!API_KEY) {
  console.error('Error: GEMINI_API_KEY not found in .env');
  process.exit(1);
}

if (!prompt || !refPath || !outputPath) {
  console.error('Usage: node generate-image-with-ref.js "<prompt>" "<ref-image-path>" "<output-path>"');
  process.exit(1);
}

if (!fs.existsSync(refPath)) {
  console.error(`Reference image not found: ${refPath}`);
  process.exit(1);
}

function mimeFromExt(p) {
  const ext = path.extname(p).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.webp') return 'image/webp';
  return 'image/png';
}

async function generate() {
  const refBytes = fs.readFileSync(refPath);
  const refB64 = refBytes.toString('base64');
  const mime = mimeFromExt(refPath);

  console.log(`Generating with Gemini 2.5 Flash Image Preview...`);
  console.log(`  Reference: ${refPath} (${mime})`);
  console.log(`  Prompt: ${prompt.substring(0, 140)}${prompt.length > 140 ? '...' : ''}`);

  const model = process.env.GEMINI_IMAGE_MODEL || 'gemini-3-pro-image-preview';
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': API_KEY,
      },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [
            { text: prompt },
            { inlineData: { mimeType: mime, data: refB64 } }
          ]
        }],
        generationConfig: {
          responseModalities: ['IMAGE']
        }
      })
    }
  );

  if (!res.ok) {
    const body = await res.text();
    console.error(`API error ${res.status}:`, body.substring(0, 800));
    process.exit(1);
  }

  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts || [];
  const imgPart = parts.find(p => p.inlineData?.data);
  if (!imgPart) {
    console.error('No image in response. Dump:', JSON.stringify(data, null, 2).substring(0, 1000));
    process.exit(1);
  }

  const outBytes = Buffer.from(imgPart.inlineData.data, 'base64');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, outBytes);
  const sizeMB = (outBytes.length / 1024 / 1024).toFixed(2);
  console.log(`  Saved: ${outputPath} (${sizeMB} MB)`);
}

generate().catch(err => {
  console.error('Failed:', err.message);
  process.exit(1);
});
