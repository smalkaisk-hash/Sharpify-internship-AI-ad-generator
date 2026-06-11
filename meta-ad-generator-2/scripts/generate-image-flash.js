/**
 * Gemini 2.0 Flash Image Generator
 * Uses generateContent endpoint with IMAGE response modality
 *
 * Usage: node scripts/generate-image-flash.js "<prompt>" "<output-path>"
 */

const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const API_KEY = process.env.GEMINI_API_KEY;
const prompt = process.argv[2];
const outputPath = process.argv[3];

if (!API_KEY) { console.error('Error: GEMINI_API_KEY not found in .env'); process.exit(1); }
if (!prompt || !outputPath) { console.error('Usage: node generate-image-flash.js "<prompt>" "<output-path>"'); process.exit(1); }

async function generateImage() {
  console.log(`Generating with Gemini 2.0 Flash...`);
  console.log(`Prompt: ${prompt.substring(0, 120)}`);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseModalities: ['IMAGE', 'TEXT'] }
      })
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error(`API Error (${response.status}):`, error);
    process.exit(1);
  }

  const data = await response.json();
  const parts = data.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find(p => p.inlineData?.mimeType?.startsWith('image/'));

  if (!imagePart) {
    console.error('No image in response');
    console.log('Response:', JSON.stringify(data, null, 2).substring(0, 800));
    process.exit(1);
  }

  const buf = Buffer.from(imagePart.inlineData.data, 'base64');
  const dir = path.dirname(path.resolve(outputPath));
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.resolve(outputPath), buf);
  console.log(`  Saved: ${outputPath} (${(buf.length / 1024).toFixed(0)} KB)`);
}

generateImage().catch(err => { console.error('Failed:', err.message); process.exit(1); });
