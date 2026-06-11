/**
 * Veo 3.1 Lite Video Generator
 * Usage: node generate-video.js "<prompt>" <output.mp4> [aspect=9:16] [resolution=720p] [duration=8]
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const fs = require('fs');
const path = require('path');

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error('GEMINI_API_KEY missing'); process.exit(1); }

const MODEL = 'veo-3.1-lite-generate-preview';
const BASE = 'https://generativelanguage.googleapis.com/v1beta';

const [, , prompt, outPath, aspect = '9:16', resolution = '720p', duration = '8'] = process.argv;
if (!prompt || !outPath) { console.error('Usage: node generate-video.js "<prompt>" <output.mp4>'); process.exit(1); }

const headers = { 'x-goog-api-key': API_KEY, 'Content-Type': 'application/json' };

async function main() {
  console.log(`[${path.basename(outPath)}] submitting…`);
  const start = await fetch(`${BASE}/models/${MODEL}:predictLongRunning`, {
    method: 'POST', headers,
    body: JSON.stringify({
      instances: [{ prompt }],
      parameters: { aspectRatio: aspect, resolution, durationSeconds: Number(duration), personGeneration: 'allow_all' }
    })
  });
  if (!start.ok) { console.error(await start.text()); process.exit(1); }
  const { name } = await start.json();
  console.log(`[${path.basename(outPath)}] op=${name}`);

  let done = false, resp;
  for (let i = 0; i < 60 && !done; i++) {
    await new Promise(r => setTimeout(r, 10000));
    const poll = await fetch(`${BASE}/${name}`, { headers });
    const j = await poll.json();
    done = j.done;
    resp = j;
    console.log(`[${path.basename(outPath)}] poll ${i + 1}: done=${!!done}`);
  }
  if (!done) { console.error('Timeout'); process.exit(1); }
  if (resp.error) { console.error(JSON.stringify(resp.error)); process.exit(1); }

  const uri = resp.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri
    || resp.response?.videos?.[0]?.uri
    || resp.response?.generatedVideos?.[0]?.video?.uri;
  if (!uri) { console.error('No video uri:', JSON.stringify(resp.response).slice(0, 500)); process.exit(1); }

  const dl = await fetch(uri, { headers });
  if (!dl.ok) { console.error('Download failed:', await dl.text()); process.exit(1); }
  const buf = Buffer.from(await dl.arrayBuffer());
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, buf);
  fs.writeFileSync(outPath + '.json', JSON.stringify({ uri, operation: name, generatedAt: new Date().toISOString(), prompt }, null, 2));
  console.log(`[${path.basename(outPath)}] saved ${buf.length} bytes → ${outPath} (+ .json sidecar)`);
}
main().catch(e => { console.error(e); process.exit(1); });
