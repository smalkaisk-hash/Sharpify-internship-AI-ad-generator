// Kie Veo 3 video generation via REST.
// Usage: node gen-veo.mjs "<prompt>" <output-name>
import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import 'dotenv/config';

const KEY = process.env.KIE_API_KEY;
if (!KEY) throw new Error('KIE_API_KEY missing');

const [, , PROMPT, NAME] = process.argv;
if (!PROMPT || !NAME) {
  console.error('Usage: node gen-veo.mjs "<prompt>" <output-name>');
  process.exit(1);
}

const OUT = path.resolve('public/video');
fs.mkdirSync(OUT, { recursive: true });

function post(url, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      url,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${KEY}`,
          'Content-Type': 'application/json',
        },
      },
      (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => resolve(JSON.parse(data)));
        res.on('error', reject);
      }
    );
    req.on('error', reject);
    req.write(JSON.stringify(body));
    req.end();
  });
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { Authorization: `Bearer ${KEY}` } }, (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => resolve(JSON.parse(data)));
        res.on('error', reject);
      })
      .on('error', reject);
  });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const doGet = (u) =>
      https
        .get(u, (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            return doGet(res.headers.location);
          }
          res.pipe(file);
          file.on('finish', () => file.close(() => resolve(dest)));
        })
        .on('error', reject);
    doGet(url);
  });
}

console.log('submitting veo task...');
const MODEL = process.env.VEO_MODEL || 'veo3_fast';
const submit = await post('https://api.kie.ai/api/v1/veo/generate', {
  prompt: PROMPT,
  model: MODEL,
  aspect_ratio: '9:16',
  resolution: '720p',
});

console.log('submit response:', JSON.stringify(submit).slice(0, 300));

const taskId = submit?.data?.taskId;
if (!taskId) {
  console.error('no taskId');
  process.exit(2);
}
console.log('task id:', taskId);

const outFile = path.join(OUT, `${NAME}.mp4`);

for (let i = 0; i < 60; i++) {
  await new Promise((r) => setTimeout(r, 10000));
  const s = await getJson(`https://api.kie.ai/api/v1/veo/record-info?taskId=${taskId}`);
  const flag = s?.data?.successFlag;
  const t = new Date().toISOString().slice(11, 19);
  console.log(`[${t}] poll ${i + 1}: flag=${flag} code=${s?.code}`);
  if (flag === 1) {
    const url = s.data.response?.resultUrls?.[0] || s.data.response?.fullResultUrls?.[0];
    console.log('download', url);
    await download(url, outFile);
    console.log('saved', outFile);
    process.exit(0);
  }
  if (flag === 2 || flag === 3) {
    console.error('generation failed:', s.data.errorMessage);
    process.exit(3);
  }
}
console.error('timeout waiting for veo');
process.exit(4);
