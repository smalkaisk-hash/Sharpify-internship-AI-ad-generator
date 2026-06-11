// Quick frame extraction via ffmpeg bundled with playwright install.
import { spawn } from 'node:child_process';
import path from 'node:path';
const FFMPEG = 'C:/Users/Ritvars Volfs/AppData/Local/ms-playwright/ffmpeg-1011/ffmpeg-win64.exe';
const [, , src, t, dest] = process.argv;
const args = ['-y', '-ss', t, '-i', src, '-frames:v', '1', dest];
console.log(FFMPEG, args.join(' '));
const p = spawn(FFMPEG, args, { stdio: 'inherit' });
p.on('exit', (code) => process.exit(code));
