import playwrightPkg from '../frontend/node_modules/@playwright/test/index.js';
const { chromium } = playwrightPkg;
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

async function main() {
  console.log('🎬 Starting Clean Reprieve Intercept Video Render (60 FPS, Seamless Loop)...');

  const previewsDir = path.resolve('previews');
  const tempRecordDir = path.resolve('previews', '_temp_record');

  if (!fs.existsSync(tempRecordDir)) {
    fs.mkdirSync(tempRecordDir, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: true,
    args: ['--enable-gpu', '--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: tempRecordDir,
      size: { width: 1920, height: 1080 }
    }
  });

  const page = await context.newPage();
  const fileUrl = 'file:///' + path.resolve('previews', 'video-stage.html').replace(/\\/g, '/');
  console.log('Loading stage:', fileUrl);
  await page.goto(fileUrl, { waitUntil: 'load' });

  console.log('Warming up layout pipeline on Cycle 1 (5.0s)...');
  await page.waitForTimeout(5000);

  console.log('Recording pristine Cycle 2 (5.0s, 300 frames @ 60 FPS)...');
  await page.waitForTimeout(5000);

  await page.close();
  await context.close();
  await browser.close();

  // Find recorded webm
  const files = fs.readdirSync(tempRecordDir).filter(f => f.endsWith('.webm'));
  if (files.length === 0) {
    throw new Error('No recorded video found in ' + tempRecordDir);
  }

  const recordedWebm = path.join(tempRecordDir, files[0]);
  const outputMp4 = path.join(previewsDir, 'reprieve-intercept.mp4');

  console.log('Encoding with ffmpeg to high-fidelity, seamless 5.0s MP4 (H.264 / 60 FPS)...');

  // Convert with ffmpeg: extract exactly the 5.00s pristine cycle
  // -pix_fmt yuv420p for universal compatibility, -movflags +faststart for web streaming, -crf 17 for visually lossless quality
  const ffmpegCmd = `ffmpeg -y -ss 00:00:05.000 -i "${recordedWebm}" -t 00:00:05.000 -c:v libx264 -pix_fmt yuv420p -r 60 -crf 17 -preset slow -movflags +faststart "${outputMp4}"`;
  execSync(ffmpegCmd, { stdio: 'inherit' });

  // Clean up temp
  fs.rmSync(tempRecordDir, { recursive: true, force: true });

  console.log('✨ Clean Video successfully rendered to:', outputMp4);
}

main().catch(err => {
  console.error('Render error:', err);
  process.exit(1);
});
