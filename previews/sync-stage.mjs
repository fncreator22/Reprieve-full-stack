import fs from 'fs';
import path from 'path';

const svg = fs.readFileSync(path.resolve('previews', 'reprieve-intercept.svg'), 'utf8');

const stageHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Reprieve Compound Risk Bento Stage</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      background: #06070a;
      width: 1920px;
      height: 1080px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    #stage {
      position: relative;
      width: 1920px;
      height: 1080px;
      background: radial-gradient(circle at 50% 50%, #110d22 0%, #07080d 60%, #040507 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Ambient deep aurora glow */
    .aurora-glow {
      position: absolute;
      width: 1200px;
      height: 750px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: radial-gradient(ellipse at center, rgba(91, 75, 224, 0.22) 0%, rgba(190, 18, 60, 0.1) 45%, transparent 75%);
      filter: blur(80px);
      pointer-events: none;
    }

    /* Perfectly centered Bento Rig */
    #camera-rig {
      position: relative;
      width: 1200px;
      height: 680px;
      display: flex;
      align-items: center;
      justify-content: center;
      transform-origin: center center;
      will-change: transform;
      filter: drop-shadow(0 30px 80px rgba(0, 0, 0, 0.95));
    }

    #camera-rig svg {
      width: 1200px;
      height: 680px;
      display: block;
    }
  </style>
</head>
<body>
  <div id="stage">
    <div class="aurora-glow"></div>
    <div id="camera-rig">
      ${svg}
    </div>
  </div>

  <script>
    const rig = document.getElementById('camera-rig');

    // Smooth subtle camera drift tied to the 5.0s cycle
    window.seekTime = function(t, duration = 5.0) {
      const progress = (t % duration) / duration;
      
      let scale = 1.0;
      let tx = 0;
      let ty = 0;

      if (progress < 0.08) {
        scale = 1.0;
      } else if (progress < 0.36) {
        const ease = (progress - 0.08) / 0.28;
        const f = ease * ease * (3 - 2 * ease);
        scale = 1.0 + f * 0.03;
        tx = -f * 12;
        ty = -f * 8;
      } else if (progress < 0.76) {
        scale = 1.03;
        tx = -12;
        ty = -8;
      } else if (progress < 0.92) {
        const ease = (progress - 0.76) / 0.16;
        const f = 1 - (ease * ease * (3 - 2 * ease));
        scale = 1.0 + f * 0.03;
        tx = -f * 12;
        ty = -f * 8;
      } else {
        scale = 1.0;
        tx = 0;
        ty = 0;
      }

      rig.style.transform = \`scale(\${scale}) translate(\${tx}px, \${ty}px)\`;
    };

    // Synchronize Camera Rig in lockstep with CSS animation clock
    let startTimestamp = null;
    function loop(timestamp) {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = (timestamp - startTimestamp) / 1000;
      window.seekTime(elapsed, 5.0);
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  </script>
</body>
</html>`;

fs.writeFileSync(path.resolve('previews', 'video-stage.html'), stageHtml);
console.log('Successfully synchronized inline previews/video-stage.html');
