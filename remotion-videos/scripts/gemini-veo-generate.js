#!/usr/bin/env node
/**
 * Generate a video via the Gemini API (Veo 3 Fast), poll the long-running
 * operation, and download the MP4 to disk.
 *
 * Usage:
 *   GEMINI_API_KEY=... node scripts/gemini-veo-generate.js \
 *     --prompt "..."  \
 *     --out public/videos/foo.mp4 \
 *     --aspect 9:16 \
 *     --model veo-3.0-fast-generate-001
 */
const fs = require("fs");
const path = require("path");

function arg(name, def) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : def;
}

const KEY = process.env.GEMINI_API_KEY;
if (!KEY) {
  console.error("GEMINI_API_KEY not set");
  process.exit(1);
}

const PROMPT = arg("prompt");
const OUT = arg("out", "out/veo.mp4");
const ASPECT = arg("aspect", "9:16");
const MODEL = arg("model", "veo-3.0-fast-generate-001");
const DURATION = parseInt(arg("duration", "8"), 10);

if (!PROMPT) {
  console.error("--prompt is required");
  process.exit(1);
}

const BASE = "https://generativelanguage.googleapis.com/v1beta";

async function main() {
  console.log(`[veo] model=${MODEL} aspect=${ASPECT} duration=${DURATION}s`);
  console.log(`[veo] prompt: ${PROMPT.slice(0, 120)}${PROMPT.length > 120 ? "…" : ""}`);

  // Step 1: kick off generation
  const kickoffUrl = `${BASE}/models/${MODEL}:predictLongRunning?key=${KEY}`;
  const body = {
    instances: [{ prompt: PROMPT }],
    parameters: {
      aspectRatio: ASPECT,
      durationSeconds: DURATION,
      personGeneration: "allow_all",
    },
  };
  const kickoff = await fetch(kickoffUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const kickoffJson = await kickoff.json();
  if (!kickoff.ok) {
    console.error("[veo] kickoff failed:", JSON.stringify(kickoffJson, null, 2));
    process.exit(2);
  }
  const opName = kickoffJson.name;
  console.log(`[veo] operation started: ${opName}`);

  // Step 2: poll until done (max 10 minutes)
  const start = Date.now();
  let op;
  while (true) {
    await new Promise((r) => setTimeout(r, 8000));
    const pollUrl = `${BASE}/${opName}?key=${KEY}`;
    const pr = await fetch(pollUrl);
    op = await pr.json();
    const elapsed = Math.round((Date.now() - start) / 1000);
    console.log(
      `[veo] polling (${elapsed}s) done=${!!op.done}${op.error ? " ERROR" : ""}`
    );
    if (op.error) {
      console.error("[veo] operation errored:", JSON.stringify(op.error, null, 2));
      process.exit(3);
    }
    if (op.done) break;
    if (Date.now() - start > 10 * 60 * 1000) {
      console.error("[veo] timed out after 10 min");
      process.exit(4);
    }
  }

  // Step 3: extract the generated video URI — handle multiple known shapes
  const resp = op.response || {};
  const videoUri =
    resp.generateVideoResponse?.generatedSamples?.[0]?.video?.uri ||
    resp.generatedVideos?.[0]?.video?.uri ||
    resp.generatedSamples?.[0]?.video?.uri ||
    resp.generatedVideos?.[0]?.uri;
  if (!videoUri) {
    console.error(
      "[veo] couldn't find video URI in response. Dumping shape:"
    );
    console.error(JSON.stringify(resp, null, 2).slice(0, 2000));
    process.exit(5);
  }

  // Step 4: download the MP4
  const dlUrl = videoUri.includes("?") ? `${videoUri}&key=${KEY}` : `${videoUri}?key=${KEY}`;
  console.log(`[veo] downloading: ${videoUri.slice(0, 120)}...`);
  const dr = await fetch(dlUrl);
  if (!dr.ok) {
    console.error(`[veo] download failed: ${dr.status} ${dr.statusText}`);
    const body = await dr.text();
    console.error(body.slice(0, 1000));
    process.exit(6);
  }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  const buf = Buffer.from(await dr.arrayBuffer());
  fs.writeFileSync(OUT, buf);
  console.log(`[veo] saved: ${OUT} (${(buf.length / 1024 / 1024).toFixed(1)} MB)`);
}

main().catch((e) => {
  console.error("[veo] fatal:", e);
  process.exit(10);
});
