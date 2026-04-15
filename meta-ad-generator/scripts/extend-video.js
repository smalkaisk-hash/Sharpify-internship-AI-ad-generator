/**
 * Veo 3.1 Video Extension — continues an existing mp4 by 7s
 * Usage: node extend-video.js <input.mp4> "<prompt>" <output.mp4> [model=veo-3.1-lite-generate-preview]
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const fs = require('fs');
const path = require('path');

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error('GEMINI_API_KEY missing'); process.exit(1); }

const BASE = 'https://generativelanguage.googleapis.com/v1beta';
const [, , inPath, prompt, outPath, model = 'veo-3.1-lite-generate-preview'] = process.argv;
if (!inPath || !prompt || !outPath) { console.error('Usage: node extend-video.js <input.mp4> "<prompt>" <output.mp4>'); process.exit(1); }

const headers = { 'x-goog-api-key': API_KEY, 'Content-Type': 'application/json' };
const name = path.basename(outPath);

async function main() {
  const sidecar = inPath + '.json';
  if (!fs.existsSync(sidecar)) { console.error(`Missing ${sidecar} — extension needs the original Veo uri. Re-generate with latest generate-video.js.`); process.exit(1); }
  const { uri } = JSON.parse(fs.readFileSync(sidecar, 'utf8'));
  console.log(`[${name}] input uri=${uri.slice(0, 80)}…, model=${model}`);

  const start = await fetch(`${BASE}/models/${model}:predictLongRunning`, {
    method: 'POST', headers,
    body: JSON.stringify({
      instances: [{ prompt, video: { uri } }],
      parameters: { resolution: '720p' }
    })
  });
  if (!start.ok) { console.error(await start.text()); process.exit(1); }
  const { name: op } = await start.json();
  console.log(`[${name}] op=${op}`);

  let resp, done = false;
  for (let i = 0; i < 90 && !done; i++) {
    await new Promise(r => setTimeout(r, 10000));
    resp = await (await fetch(`${BASE}/${op}`, { headers })).json();
    done = resp.done;
    console.log(`[${name}] poll ${i + 1}: done=${!!done}`);
  }
  if (!done) { console.error('Timeout'); process.exit(1); }
  if (resp.error) { console.error(JSON.stringify(resp.error)); process.exit(1); }

  const outUri = resp.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri
    || resp.response?.videos?.[0]?.uri
    || resp.response?.generatedVideos?.[0]?.video?.uri;
  if (!outUri) { console.error('No video uri:', JSON.stringify(resp.response).slice(0, 600)); process.exit(1); }

  const dl = await fetch(outUri, { headers });
  const buf = Buffer.from(await dl.arrayBuffer());
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, buf);
  fs.writeFileSync(outPath + '.json', JSON.stringify({ uri: outUri, operation: op, generatedAt: new Date().toISOString(), prompt, extendedFrom: inPath }, null, 2));
  console.log(`[${name}] saved ${buf.length} bytes → ${outPath}`);
}
main().catch(e => { console.error(e); process.exit(1); });
