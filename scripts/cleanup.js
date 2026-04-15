#!/usr/bin/env node
/**
 * Cleanup: archives old generated outputs into per-brand zips under storage/.
 *
 * Usage:
 *   node scripts/cleanup.js                 # archive files older than 7 days
 *   node scripts/cleanup.js --days 14       # custom age threshold
 *   node scripts/cleanup.js --dry-run       # show what would be archived
 *   node scripts/cleanup.js recover <brand> # restore <brand>.zip back into the repo
 */

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const unzipper = require('unzipper');

const REPO_ROOT = path.resolve(__dirname, '..');
const STORAGE_DIR = path.join(REPO_ROOT, 'storage');
const OUTPUT_DIR = path.join(REPO_ROOT, 'meta-ad-generator', 'output');
const REMOTION_OUT = path.join(REPO_ROOT, 'remotion-videos', 'out');
const ROOT_ASSET_EXTS = new Set(['.png', '.jpg', '.jpeg', '.mov', '.mp4']);

const args = process.argv.slice(2);

if (args[0] === 'recover') {
  recover(args[1]).catch((err) => { console.error(err); process.exit(1); });
} else {
  const daysIdx = args.indexOf('--days');
  const days = daysIdx !== -1 ? parseInt(args[daysIdx + 1], 10) : 7;
  const dryRun = args.includes('--dry-run');
  cleanup({ days, dryRun }).catch((err) => { console.error(err); process.exit(1); });
}

function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

function brandFromVideoName(filename) {
  const base = path.basename(filename, path.extname(filename));
  const m = base.match(/^(.+?)-v\d+/);
  return m ? m[1] : null;
}

function brandFromRootAsset(filename) {
  const base = path.basename(filename, path.extname(filename));
  // Try `<brand>-vN-...` then `<brand>-...` (first segment).
  const versioned = base.match(/^(.+?)-v\d+/);
  if (versioned) return versioned[1];
  const dashed = base.match(/^([a-z0-9]+)/i);
  return dashed ? dashed[1] : null;
}

function collectByBrand(days) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const byBrand = new Map();

  if (fs.existsSync(OUTPUT_DIR)) {
    for (const brand of fs.readdirSync(OUTPUT_DIR)) {
      const brandDir = path.join(OUTPUT_DIR, brand);
      if (!fs.statSync(brandDir).isDirectory()) continue;
      for (const file of walk(brandDir)) {
        if (fs.statSync(file).mtimeMs < cutoff) {
          if (!byBrand.has(brand)) byBrand.set(brand, []);
          byBrand.get(brand).push(file);
        }
      }
    }
  }

  // Loose root-level generated assets (png, jpg, mov, mp4 only — never code/state files).
  // Always archived regardless of age — they shouldn't accumulate in repo root.
  for (const entry of fs.readdirSync(REPO_ROOT, { withFileTypes: true })) {
    if (!entry.isFile()) continue;
    const ext = path.extname(entry.name).toLowerCase();
    if (!ROOT_ASSET_EXTS.has(ext)) continue;
    const full = path.join(REPO_ROOT, entry.name);
    const brand = brandFromRootAsset(entry.name) || 'root-assets';
    if (!byBrand.has(brand)) byBrand.set(brand, []);
    byBrand.get(brand).push(full);
  }

  if (fs.existsSync(REMOTION_OUT)) {
    for (const file of walk(REMOTION_OUT)) {
      if (fs.statSync(file).mtimeMs >= cutoff) continue;
      const brand = brandFromVideoName(file) || 'remotion-renders';
      if (!byBrand.has(brand)) byBrand.set(brand, []);
      byBrand.get(brand).push(file);
    }
  }

  return byBrand;
}

async function appendToZip(zipPath, files) {
  const tmpPath = zipPath + '.tmp';
  const existingEntries = new Set();

  if (fs.existsSync(zipPath)) {
    const directory = await unzipper.Open.file(zipPath);
    for (const e of directory.files) existingEntries.add(e.path);
  }

  await new Promise((resolve, reject) => {
    const output = fs.createWriteStream(tmpPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    output.on('close', resolve);
    archive.on('error', reject);
    archive.pipe(output);

    if (fs.existsSync(zipPath)) {
      // Re-stream existing entries into the new zip.
      // Use unzipper's stream to read each file and re-add.
      // For simplicity & correctness, do this synchronously per entry below.
    }

    const finalize = async () => {
      if (fs.existsSync(zipPath)) {
        const directory = await unzipper.Open.file(zipPath);
        for (const entry of directory.files) {
          if (entry.type !== 'File') continue;
          const buf = await entry.buffer();
          archive.append(buf, { name: entry.path });
        }
      }
      for (const f of files) {
        const rel = path.relative(REPO_ROOT, f).replace(/\\/g, '/');
        if (existingEntries.has(rel)) continue;
        archive.append(fs.createReadStream(f), { name: rel });
      }
      archive.finalize();
    };
    finalize().catch(reject);
  });

  fs.renameSync(tmpPath, zipPath);
}

function fmtMB(bytes) { return (bytes / (1024 * 1024)).toFixed(1) + ' MB'; }

async function cleanup({ days, dryRun }) {
  console.log(`Scanning for files older than ${days} days...${dryRun ? ' (dry run)' : ''}`);
  const byBrand = collectByBrand(days);

  if (byBrand.size === 0) {
    console.log('Nothing to archive.');
    return;
  }

  if (!dryRun && !fs.existsSync(STORAGE_DIR)) fs.mkdirSync(STORAGE_DIR, { recursive: true });

  let totalBytes = 0;
  let totalFiles = 0;

  for (const [brand, files] of byBrand) {
    const bytes = files.reduce((s, f) => s + fs.statSync(f).size, 0);
    totalBytes += bytes;
    totalFiles += files.length;
    console.log(`  ${brand}: ${files.length} files, ${fmtMB(bytes)}`);

    if (dryRun) continue;

    const zipPath = path.join(STORAGE_DIR, `${brand}.zip`);
    await appendToZip(zipPath, files);
    for (const f of files) fs.unlinkSync(f);
    // Clean up empty dirs left behind.
    pruneEmptyDirs(OUTPUT_DIR);
  }

  console.log(`\n${dryRun ? 'Would archive' : 'Archived'}: ${totalFiles} files, ${fmtMB(totalBytes)}`);
}

function pruneEmptyDirs(root) {
  if (!fs.existsSync(root)) return;
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const full = path.join(root, entry.name);
    pruneEmptyDirs(full);
    try {
      if (fs.readdirSync(full).length === 0) fs.rmdirSync(full);
    } catch {}
  }
}

async function recover(brand) {
  if (!brand) { console.error('Usage: cleanup.js recover <brand>'); process.exit(1); }
  const zipPath = path.join(STORAGE_DIR, `${brand}.zip`);
  if (!fs.existsSync(zipPath)) { console.error(`No archive at ${zipPath}`); process.exit(1); }

  console.log(`Restoring ${brand} from ${zipPath}...`);
  const directory = await unzipper.Open.file(zipPath);
  let count = 0;
  for (const entry of directory.files) {
    if (entry.type !== 'File') continue;
    const dest = path.join(REPO_ROOT, entry.path);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    await new Promise((resolve, reject) => {
      entry.stream().pipe(fs.createWriteStream(dest)).on('finish', resolve).on('error', reject);
    });
    count++;
  }
  console.log(`Restored ${count} files.`);
}
