// Reprieve Architecture Safety Engine · Master 70s Video Storyboard Generator (Prompt-Free Directing Edition)
const fs = require('fs');
const path = require('path');

async function generateCleanMasterStoryboard() {
  const assetsDir = path.resolve(__dirname, '../../docs/video_assets');
  const outputHtmlPath = path.resolve(__dirname, '../../docs/video_storyboard.html');
  const outputMdPath = path.resolve(__dirname, '../../docs/VIDEO_STORYBOARD.md');

  const chunks = [
    {
      chunkNum: "01",
      title: "The Macro Code Waiver & The Status Flip",
      time: "00:00 – 00:10",
      frames: "Frames 0000 – 0600 (10.0s)",
      imageFile: "11_terminal_cli_scan.png",
      caption: "Macro IDE Code Editor showing the temporary auth waiver comment and status pill.",
      vo: "A temporary code waiver approved on Friday afternoon. To your sprint board, it’s just another harmless ticket.",
      visualDirection: "Simulated 85mm optical prime lens (f/1.8). Soft 3-point studio lighting with a delicate 1px white specular rim along the top card bevel. Unhurried forward push-in (1.00x to 1.04x). The code editor displays: '// FIXME: bypass auth check for load test (expires: +48h)'. The status badge quietly flips from 'In Review' to 'Approved'.",
      startingAnchor: "Extreme macro close-up on the code line at coordinate (x: 0, y: 0, z: 0).",
      endingAnchor: "Status badge settles on 'Approved'. The card begins a slow backward drift into the dark obsidian void at (x: 0, y: 0, z: -100).",
      audioFoley: "Warm analog Rhodes electric piano chord (C-minor 9th) fades in at -18 dB. Subtle Keychron mechanical switch tap (-12 dB). Low-pass sub-bass drone (-20 dB)."
    },
    {
      chunkNum: "02",
      title: "Spatial Pull-Out & The 3 Outage Case Studies",
      time: "00:10 – 00:20",
      frames: "Frames 0600 – 1200 (10.0s)",
      imageFile: "02_outage_case_studies.png",
      caption: "Interactive case studies displaying CrowdStrike, Square, and Change Healthcare public post-mortems.",
      vo: "To your microservice mesh... it's a silent multi-hop failure path waiting to take down checkout.",
      visualDirection: "Continuous camera pull-out (1.00x to 0.90x) using overdamped mass-spring-damper easing (damping: 28). The single waiver recedes into a dark multi-hop dependency mesh. Two distant tickets illuminate in amber. Disaster badges emerge in structured crimson: CrowdStrike (8.5M Systems), Square (24-Hour Outage), Change Healthcare ($1.6B Freeze).",
      startingAnchor: "Starts on the receding ticket from Chunk 01 at coordinate (x: 0, y: 0, z: -100).",
      endingAnchor: "A crimson failure line pulses across checkout-api → payments-gateway → card-token-vault, locking onto checkout-api as center pivot.",
      audioFoley: "Tactile switch click (-8 dB). Paper slide texture foley (-14 dB). Rhodes suspended chord shift."
    },
    {
      chunkNum: "03",
      title: "The Living FalkorDB Mesh & Avalanche Centrality",
      time: "00:20 – 00:30",
      frames: "Frames 1200 – 1800 (10.0s)",
      imageFile: "05_graph_canvas_explorer.png",
      caption: "Authentic 25-node live 3D Force Graph canvas of Northwind Pay with Day +18 temporal scrubber.",
      vo: "Meet Reprieve — the graph-native architecture safety engine. We model every waiver as a living promise in FalkorDB, computing avalanche centrality across your entire topology.",
      visualDirection: "The crimson failure line blossoms into the full 25-microservice Northwind Pay dependency canvas. Nodes float in obsidian space. The 30-Day Temporal Horizon Scrubber at the bottom slides smoothly to Day +18, illuminating overlapping collision vectors in vivid crimson (#ef4444) with avalanche badge 'P = 0.94'.",
      startingAnchor: "Starts on the glowing checkout-api cluster from Chunk 02.",
      endingAnchor: "Camera pushes forward (1.00x to 1.06x), centering on the Day +18 collision peak and the central violet beam.",
      audioFoley: "Cinematic 40Hz sub-bass impact hit (-12 dB). Warm melodic synth sequence begins. Tactile timeline ratchet clicks (-10 dB)."
    },
    {
      chunkNum: "04",
      title: "Developer Ergonomics — 11.8ms CLI AST Scanner",
      time: "00:30 – 00:40",
      frames: "Frames 1800 – 2400 (10.0s)",
      imageFile: "03_developer_surfaces_bento.png",
      caption: "Three native developer interfaces with live CLI terminal scan card.",
      vo: "Run local AST scans with zero login in under fifteen milliseconds.",
      visualDirection: "From the central beam, a sleek dark zsh terminal card locks into the left side of the frame. Cursor types 'npx reprieve scan --strict'. In 11.8 milliseconds, the terminal renders a green telemetry summary: 'AST Latency: 11.8ms · Invariant Rule R4 Blocked'. Right half of screen stays dark, primed for the PR gate.",
      startingAnchor: "Pans smoothly from the graph center into the left terminal window.",
      endingAnchor: "Terminal output completes with green checkmarks. Right side of screen remains empty in obsidian black.",
      audioFoley: "Keychron mechanical keyboard clatter (-10 dB). Digital chime on 11.8ms scan pass."
    },
    {
      chunkNum: "05",
      title: "GitHub Actions Pre-Merge Circuit Breaker",
      time: "00:40 – 00:50",
      frames: "Frames 2400 – 3000 (10.0s)",
      imageFile: "12_github_pr_gate.png",
      caption: "GitHub PR circuit breaker comment from @reprieve-bot blocking merge with proof path table.",
      vo: "Or let it block compound failure paths directly in your pull request before code ever merges.",
      visualDirection: "The right half of the frame receives a dark-mode GitHub Pull Request card: 'feat(payment): add load test bypass'. @reprieve-bot comments instantly with an alert banner: '⛔ Pull Request Blocked: 1 Compound Failure Invariant Triggered', displaying the shortest proof path table (checkout-api → payments-gateway → stripe).",
      startingAnchor: "Slides in from right border, completing the two-panel developer surface view.",
      endingAnchor: "Bot comment locks into place. A white Apple-style cursor enters from bottom right.",
      audioFoley: "Soft UI card slide foley (-12 dB). Subdued warning block chime (-8 dB)."
    },
    {
      chunkNum: "06",
      title: "Steward AI Agent & Grounded Tri-Planar Memory",
      time: "00:50 – 01:00",
      frames: "Frames 3000 – 3600 (10.0s)",
      imageFile: "08_steward_live_agent.png",
      caption: "Steward Live Copilot drawer with verified Groundedness Guard and ProposedAction card.",
      vo: "Steward, our on-call AI agent, recalls historical precedents across our three-graph memory — grounded strictly in mathematical proof paths.",
      visualDirection: "Cursor moves along a smooth cubic bezier curve into the Steward chat drawer. The chat send button depresses (scale: 0.95) with tactile spring rebound. Steward streams back the token response with tool inspection drawers and a ProposedAction approval card. Verified green badge glows: '✓ Groundedness Guard Active (0 Hallucinations)'.",
      startingAnchor: "Cursor enters the chat input at coordinate (x: 820, y: 640).",
      endingAnchor: "Response token stream completes. ProposedAction card illuminates in soft amber.",
      audioFoley: "Tactile mouse click (-6 dB). Digital token streaming soundscape (-16 dB)."
    },
    {
      chunkNum: "07",
      title: "Minimal Brand Resolution & Zero-Login Sandbox",
      time: "01:00 – 01:10",
      frames: "Frames 3601 – 4200 (10.0s)",
      imageFile: "13_brand_lockup.png",
      caption: "Obsidian brand lockup with zero-login pill and live demo URL.",
      vo: "Intercept compound risk before merge. Try the live sandbox today.",
      visualDirection: "The view pulls back smoothly into a centered obsidian frame with a soft radial violet glow (rgba(139,125,255,0.12)). Symmetrical typography reveals bold white wordmark 'REPRIEVE', tagline 'The Graph-Native Architecture Safety Engine', and glowing pill: 'npx reprieve scan --strict · 0 Login Required · frontend-six-neon-97.vercel.app'. A 1px specular light sweep glides across the logo bevel as the screen fades to black.",
      startingAnchor: "Pulls out from the Steward chat center into symmetrical wide framing.",
      endingAnchor: "Pristine centered obsidian brand card fading to pure black at 01:10.",
      audioFoley: "Warm Rhodes chord resolves to root key. Clean power-down switch click (-10 dB). Tail decay to total silence."
    }
  ];

  console.log('[1/3] Reading and encoding Base64 images for clean storyboard...');
  const base64Map = {};
  for (const chunk of chunks) {
    const p = path.join(assetsDir, chunk.imageFile);
    if (fs.existsSync(p)) {
      const b = fs.readFileSync(p);
      base64Map[chunk.imageFile] = `data:image/png;base64,${b.toString('base64')}`;
      console.log(`  ✓ Encoded ${chunk.imageFile}`);
    }
  }

  console.log('[2/3] Writing docs/video_storyboard.html (Prompt-Free Pure Directing)...');
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reprieve — Master Video Storyboard (70-Second Official Directing Edition)</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap');
    
    :root {
      --bg: #06070a;
      --card-bg: #0c0d12;
      --card-border: rgba(255, 255, 255, 0.08);
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --accent: #8b7dff;
      --danger: #ef4444;
      --success: #10b981;
      --amber: #fbbf24;
    }
    
    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      line-height: 1.6;
      padding: 40px 24px;
    }
    
    .container { max-width: 1200px; margin: 0 auto; }
    
    header {
      border-bottom: 1px solid var(--card-border);
      padding-bottom: 32px;
      margin-bottom: 40px;
    }
    
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(139, 125, 255, 0.12);
      color: #c4b5fd;
      border: 1px solid rgba(139, 125, 255, 0.3);
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      font-family: 'JetBrains Mono', monospace;
      margin-bottom: 16px;
    }
    
    h1 { font-size: 36px; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 10px; }
    .subtitle { font-size: 16px; color: var(--text-muted); max-width: 850px; }
    
    .actions { margin-top: 20px; display: flex; gap: 14px; }
    .btn {
      background: var(--accent);
      color: #fff;
      font-weight: 600;
      font-size: 14px;
      padding: 10px 20px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
    }
    .btn-secondary {
      background: rgba(255, 255, 255, 0.05);
      color: var(--text);
      border: 1px solid var(--card-border);
    }
    
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 40px;
    }
    
    .meta-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 8px;
      padding: 18px;
    }
    
    .meta-label { font-size: 11px; text-transform: uppercase; color: var(--text-muted); font-weight: 600; margin-bottom: 4px; }
    .meta-val { font-size: 16px; font-weight: 700; font-family: 'JetBrains Mono', monospace; color: var(--accent); }
    
    .chunk-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 44px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
      page-break-inside: avoid;
    }
    
    .chunk-header {
      padding: 18px 24px;
      background: #0f1118;
      border-bottom: 1px solid var(--card-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .chunk-title { font-size: 18px; font-weight: 700; display: flex; align-items: center; gap: 10px; }
    .chunk-num {
      background: var(--accent);
      color: #fff;
      font-size: 11px;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 4px;
      font-family: 'JetBrains Mono', monospace;
    }
    .chunk-timing { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--amber); font-weight: 600; }
    
    .image-container {
      width: 100%;
      background: #040508;
      border-bottom: 1px solid var(--card-border);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .image-container img {
      width: 100%;
      height: auto;
      max-height: 600px;
      object-fit: contain;
      display: block;
    }
    
    .chunk-body {
      padding: 24px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    
    .info-box {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      padding: 18px;
    }
    
    .info-heading {
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.05em;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .heading-vo { color: var(--accent); }
    .heading-vis { color: var(--success); }
    .heading-aud { color: var(--amber); }
    .heading-anchor { color: #38bdf8; }
    
    .vo-quote { font-size: 15px; font-weight: 600; line-height: 1.6; color: #f1f5f9; font-style: italic; }
    .spec-text { font-size: 13px; color: var(--text-muted); line-height: 1.6; }
    .anchor-text { font-size: 13px; font-family: 'JetBrains Mono', monospace; color: #cbd5e1; line-height: 1.5; }
    .img-tag { display: inline-block; background: rgba(56, 189, 248, 0.1); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); padding: 2px 8px; border-radius: 4px; font-size: 11px; font-family: 'JetBrains Mono', monospace; margin-top: 6px; }

    @media print {
      body { background: #000; color: #fff; padding: 0; }
      .actions { display: none; }
      .chunk-card { page-break-after: always; box-shadow: none; border: 1px solid #333; }
      .chunk-body { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="badge">REPRIEVE // OFFICIAL 70-SECOND MASTER STORYBOARD</div>
      <h1>Production Directing Guide & Scene Architecture</h1>
      <p class="subtitle">Complete 7-chunk directing specification for Reprieve's product commercial. Every 10-second chunk is paired with its exact authentic product screenshot, spatial In/Out anchors, soundscape cues, and spoken script.</p>
      <div class="actions">
        <button class="btn" onclick="window.print()">🖨️ Export to PDF / Print</button>
        <a class="btn btn-secondary" href="https://frontend-six-neon-97.vercel.app" target="_blank">🌐 Live Production Sandbox</a>
      </div>
    </header>
    
    <div class="meta-grid">
      <div class="meta-card">
        <div class="meta-label">Total Duration</div>
        <div class="meta-val">70.0s (7 Chunks @ 10s)</div>
      </div>
      <div class="meta-card">
        <div class="meta-label">Aesthetic Standard</div>
        <div class="meta-val">Apple Studio Design</div>
      </div>
      <div class="meta-card">
        <div class="meta-label">Frame Rate & Physics</div>
        <div class="meta-val">60 FPS (Mass-Spring)</div>
      </div>
      <div class="meta-card">
        <div class="meta-label">Active Image Assets</div>
        <div class="meta-val">7 Direct Mappings</div>
      </div>
    </div>
    
    <div class="chunks-list">
      ${chunks.map((c) => `
        <div class="chunk-card">
          <div class="chunk-header">
            <div class="chunk-title">
              <span class="chunk-num">CHUNK ${c.chunkNum}</span>
              <span>${c.title}</span>
            </div>
            <div class="chunk-timing">${c.time} · ${c.frames}</div>
          </div>
          <div class="image-container">
            <img src="${base64Map[c.imageFile] || ''}" alt="${c.title}" />
          </div>
          <div class="chunk-body">
            <div class="info-box" style="grid-column: span 2;">
              <div class="info-heading heading-vo">🎙️ Spoken Voiceover (Record as Single Master Audio Track)</div>
              <div class="vo-quote">"${c.vo}"</div>
            </div>
            <div class="info-box">
              <div class="info-heading heading-vis">🎥 Visual Direction & Cinematography</div>
              <div class="spec-text">${c.visualDirection}</div>
              <div class="img-tag">Assigned Asset: docs/video_assets/${c.imageFile}</div>
            </div>
            <div class="info-box">
              <div class="info-heading heading-aud">🔊 Audio, Music & Foley Cues</div>
              <div class="spec-text">${c.audioFoley}</div>
            </div>
            <div class="info-box">
              <div class="info-heading heading-anchor">🟢 Starting Point (In-Point Anchor)</div>
              <div class="anchor-text">${c.startingAnchor}</div>
            </div>
            <div class="info-box">
              <div class="info-heading heading-anchor">🔴 Ending Point (Out-Point Match-Cut)</div>
              <div class="anchor-text">${c.endingAnchor}</div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  </div>
</body>
</html>`;

  fs.writeFileSync(outputHtmlPath, htmlContent, 'utf-8');
  console.log(`  ✓ Updated HTML: ${outputHtmlPath}`);

  console.log('[3/3] Writing docs/VIDEO_STORYBOARD.md...');
  const mdContent = `# Reprieve — Master Video Directing Storyboard (70-Second Official Edition)
> **Master Resolution:** 1920 × 1080p @ 60.00 FPS  
> **Aesthetic Profile:** Apple Studio Design · WWDC Keynote Hardware Quality · Emil Kowalski Tactile Micro-Interactions  
> **Standalone PDF-Ready Document:** [\`docs/video_storyboard.html\`](file:///${outputHtmlPath.replace(/\\\\/g, '/')})

---

${chunks.map((c) => `
## Chunk ${c.chunkNum}: ${c.title}
* **Timestamp & Timing:** \`${c.time}\` · ${c.frames}
* **Assigned Production Asset:** [\`docs/video_assets/${c.imageFile}\`](video_assets/${c.imageFile}) (${c.caption})

![${c.title}](video_assets/${c.imageFile})

### 🎙️ Spoken Voiceover Script (Single Audio Spine)
> *"${c.vo}"*

### 🎥 Visual Choreography & Lighting
${c.visualDirection}

### 🔄 Spatial Match-Cut Continuity
* **🟢 Starting Point (In-Point Anchor):** \`${c.startingAnchor}\`
* **🔴 Ending Point (Out-Point Anchor):** \`${c.endingAnchor}\`

### 🔊 Audio, Music & Foley
${c.audioFoley}

---
`).join('\n')}
`;

  fs.writeFileSync(outputMdPath, mdContent, 'utf-8');
  console.log(`  ✓ Updated Markdown: ${outputMdPath}`);
}

generateCleanMasterStoryboard().catch((e) => {
  console.error(e);
  process.exit(1);
});
