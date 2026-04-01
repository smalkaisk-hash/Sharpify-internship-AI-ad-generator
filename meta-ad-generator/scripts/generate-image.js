/**
 * Gemini Image Generator — Generates ad images from text prompts
 *
 * Usage: node scripts/generate-image.js "<prompt>" "<output-path>"
 * Example: node scripts/generate-image.js "A robotic lawn mower on a football field" "output/fjdynamics-b2b/png/ad-extra-01.png"
 *
 * Requires: GEMINI_API_KEY in .env file
 */

const fs = require('fs');
const path = require('path');

// Load .env from project root
const envPath = path.resolve(__dirname, '../../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, ...vals] = line.split('=');
    if (key && vals.length) process.env[key.trim()] = vals.join('=').trim();
  });
}

const API_KEY = process.env.GEMINI_API_KEY;
const prompt = process.argv[2];
const outputPath = process.argv[3];

if (!API_KEY) {
  console.error('Error: GEMINI_API_KEY not found in .env');
  process.exit(1);
}

if (!prompt || !outputPath) {
  console.error('Usage: node generate-image.js "<prompt>" "<output-path>"');
  process.exit(1);
}

async function generateImage() {
  console.log(`Generating image with Imagen 4...`);
  console.log(`Prompt: ${prompt.substring(0, 100)}...`);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instances: [{ prompt: prompt }],
        parameters: {
          sampleCount: 1,
          aspectRatio: "1:1"
        }
      })
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error(`API Error (${response.status}):`, error);
    process.exit(1);
  }

  const data = await response.json();

  // Imagen returns predictions with bytesBase64Encoded
  const predictions = data.predictions || [];
  if (predictions.length > 0 && predictions[0].bytesBase64Encoded) {
    const imageBuffer = Buffer.from(predictions[0].bytesBase64Encoded, 'base64');
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(outputPath, imageBuffer);
    const sizeMB = (imageBuffer.length / 1024 / 1024).toFixed(2);
    console.log(`  Saved: ${outputPath} (${sizeMB} MB)`);
    return;
  }

  console.error('No image found in Imagen response');
  console.log('Response:', JSON.stringify(data, null, 2).substring(0, 1000));
  process.exit(1);
}

generateImage().catch(err => {
  console.error('Failed:', err.message);
  process.exit(1);
});
