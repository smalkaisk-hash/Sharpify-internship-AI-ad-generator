// Fetch Pexels stock b-roll for solar + tiler ads.
// Saves MP4s to public/video/
import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import 'dotenv/config';

const KEY = process.env.PEXELS_API_KEY;
if (!KEY) throw new Error('PEXELS_API_KEY missing');

const OUT = path.resolve('public/video');
fs.mkdirSync(OUT, { recursive: true });

const SEARCHES = {
  solar: [
    'solar panel installation roof',
    'solar panels house',
    'electrician worker',
    'money calculator',
    'phone notification',
  ],
  tiler: [
    'tile installation',
    'ceramic tile laying',
    'construction worker hands',
    'bathroom renovation',
    'empty calendar',
  ],
};

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { Authorization: KEY } }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve(JSON.parse(data)));
      res.on('error', reject);
    });
  });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const doGet = (u) =>
      https.get(u, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return doGet(res.headers.location);
        }
        res.pipe(file);
        file.on('finish', () => file.close(() => resolve(dest)));
      }).on('error', reject);
    doGet(url);
  });
}

for (const [niche, queries] of Object.entries(SEARCHES)) {
  for (let i = 0; i < queries.length; i++) {
    const q = queries[i];
    const outFile = path.join(OUT, `${niche}-${i + 1}.mp4`);
    if (fs.existsSync(outFile)) {
      console.log('skip', outFile);
      continue;
    }
    const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(q)}&orientation=portrait&size=medium&per_page=3`;
    const res = await get(url);
    const vid = res.videos?.[0];
    if (!vid) {
      console.log('no result for', q);
      continue;
    }
    // pick an HD vertical file under 10MB
    const files = vid.video_files.sort((a, b) => (a.height || 0) - (b.height || 0));
    const pick = files.find((f) => f.height >= 1080) || files[files.length - 1];
    console.log('download', niche, i + 1, q, '→', pick.link);
    await download(pick.link, outFile);
  }
}
console.log('done');
