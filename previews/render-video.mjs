import { chromium } from '../frontend/node_modules/@playwright/test/index.js';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

async function main() {
  console.log('🎬 Starting Reprieve Intercept Video Render...');

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

  await page.goto(fileUrl, { waitUntil: 'networkidle' });

  // Record for 7.5 seconds (one full cinematic loop)
  const duration = 7.5;
  const fps = 60;
  const totalFrames = Math.floor(duration * fps);

  console.log(`Recording ${duration}s playback at 60 FPS...`);
  
  // We advance the camera push-in and let SVG animate
  for (let i = 0; i <= totalFrames; i++) {
    const t = i / fps;
    await page.evaluate((currT) => {
      if (window.seekTime) window.seekTime(currT);
    }, t);
    // wait 16ms to match 60fps real-time recording
    await page.waitForTimeout(16);
  }

  await page.close();
  await context.close();
  await browser.close();

  // Find the recorded video
  const files = fs.readdirSync(tempRecordDir).filter(f => f.endsWith('.webm'));
  if (files.length === 0) {
    throw new Error('No recorded video found in ' + tempRecordDir);
  }

  const recordedWebm = path.join(tempRecordDir, files[0]);
  const outputMp4 = path.join(previewsDir, 'reprieve-intercept.mp4');

  console.log('Converting recorded file with ffmpeg to broadcast MP4 (H.264 / 60 FPS):', outputMp4);

  // Encode with ffmpeg
  const ffmpegCmd = `ffmpeg -y -i "${recordedWebm}" -c:v libx264 -pix_fmt yuv420p -r 60 -crf 18 -preset fast "${outputMp4}"`;
  execSync(ffmpegCmd, { stdio: 'inherit' });

  // Clean up temp dir
  fs.rmSync(tempRecordDir, { recursive: true, force: true });

  console.log('✨ Video successfully rendered to:', outputMp4);
}

main().catch(err => {
  console.error('Render error:', err);
  process.exit(1);
});
