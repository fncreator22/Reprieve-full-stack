// Reprieve Architecture Safety Engine · Self-Contained Storyboard Document Generator
const fs = require('fs');
const path = require('path');

async function generateSelfContainedStoryboard() {
  const assetsDir = path.resolve(__dirname, '../../docs/video_assets');
  const outputHtmlPath = path.resolve(__dirname, '../../docs/video_storyboard.html');
  const outputMdPath = path.resolve(__dirname, '../../docs/VIDEO_STORYBOARD.md');

  const scenes = [
    {
      sceneNum: "01",
      title: "The Macro Opening — The Illusion of 'Harmless'",
      time: "00:00 – 00:07",
      frames: "Frames 0000 – 0420 (7.0s)",
      imageFile: "11_terminal_cli_scan.png",
      caption: "Macro close-up on IDE code waiver and terminal circuit breaker execution.",
      vo: "A temporary code waiver approved on Friday afternoon. To your sprint board, it’s just another harmless ticket.",
      visual: "Simulated 85mm macro lens (f/1.8). Studio key light grazes top card bevel. Cursor blinks with smooth cubic falloff over `// FIXME: bypass auth check for load test`.",
      audio: "Warm analog Rhodes electric piano chord pad (C-minor 9th) fades in at -18 dB. Keychron mechanical keycap tap (-12 dB). Low-pass sub-bass drone (-20 dB)."
    },
    {
      sceneNum: "02",
      title: "Spatial Pull-Out — The Compound Failure Path",
      time: "00:07 – 00:16",
      frames: "Frames 0421 – 0960 (9.0s)",
      imageFile: "02_outage_case_studies.png",
      caption: "Interactive case studies displaying CrowdStrike, Square, and Change Healthcare public post-mortems.",
      vo: "To your microservice mesh... it's a silent multi-hop failure path waiting to take down checkout.",
      visual: "Overdamped mass-spring camera tracking pull-out (1.03x to 0.95x). Single ticket recedes into multi-hop dependency chain. Disaster loss figures glow in structured crimson.",
      audio: "Soft tactile switch click (-8 dB). Paper slide texture foley (-14 dB). Rhodes chord suspends with subtle tension."
    },
    {
      sceneNum: "03",
      title: "The Shift to Reprieve — Living FalkorDB Risk Mesh",
      time: "00:16 – 00:30",
      frames: "Frames 0961 – 1800 (14.0s)",
      imageFile: "05_graph_canvas_explorer.png",
      caption: "Authentic 3D force graph of Northwind Pay with 25 services and Day +18 collision peak.",
      vo: "Meet Reprieve — the graph-native architecture safety engine. We model every waiver, test skip, and orphan control as a living promise in FalkorDB, computing avalanche centrality across your entire topology.",
      visual: "Camera glides into the live 25-microservice force graph canvas. 30-Day Temporal Horizon Scrubber slides to Day +18, illuminating overlapping failure paths in crimson.",
      audio: "Cinematic 40Hz sub-bass impact hit (-12 dB). Warm melodic synth sequence begins. Tactile timeline ratchet clicks (-10 dB)."
    },
    {
      sceneNum: "04",
      title: "Executive Architecture Telemetry & Invariant Alerts",
      time: "00:20 – 00:30 (Context Shot)",
      frames: "Detail View",
      imageFile: "04_dashboard_home.png",
      caption: "Live Northwind Pay executive dashboard with 84/100 risk score and 37 active waivers.",
      vo: "Continuous deterministic scanning calculates blast radius, ghost owners, and broken compensating controls in real time.",
      visual: "Full dashboard viewport displaying live Avalanche Risk Score (84/100), Active Exceptions (37), and top at-risk services.",
      audio: "Soft ambient digital pulse (-22 dB). Subdued data flow texture."
    },
    {
      sceneNum: "05",
      title: "Shortest Proof Path Graph Reasoning",
      time: "00:25 – 00:32 (Detail Shot)",
      frames: "Detail View",
      imageFile: "06_alerts_catalog.png",
      caption: "Live alert catalog showing computed Shortest Proof Path across microservice hops.",
      vo: "Reprieve doesn’t guess. It proves root cause by tracing the deterministic topological path from ingress to database.",
      visual: "Alert detail card for Rule R4 (Service Concentration on checkout-api), proving reachability through payments-gateway to card-token-vault.",
      audio: "Crisp UI notification ping (-14 dB)."
    },
    {
      sceneNum: "06",
      title: "Developer Ergonomics — 11.8ms CLI AST Scanner",
      time: "00:30 – 00:40",
      frames: "Frames 1801 – 2400 (10.0s)",
      imageFile: "03_developer_surfaces_bento.png",
      caption: "Three native interfaces: Local CLI AST Scanner, Model Context Protocol (MCP), and GitHub CI Gate.",
      vo: "Run local AST scans with zero login in under fifteen milliseconds.",
      visual: "Split focus on developer surfaces bento grid. Local scanner parses 1,420 nodes in 11.8 milliseconds without requiring an account.",
      audio: "Keychron mechanical keyboard clatter (-10 dB). Digital chime on scan pass."
    },
    {
      sceneNum: "07",
      title: "GitHub Actions Pre-Merge Circuit Breaker",
      time: "00:40 – 00:45",
      frames: "Frames 2401 – 2700 (5.0s)",
      imageFile: "12_github_pr_gate.png",
      caption: "Automated PR blocking comment from @reprieve-bot with shortest proof path table.",
      vo: "Or let it block compound failure paths directly in your pull request before code ever merges.",
      visual: "GitHub pull request card intercepted by Reprieve bot, blocking merge with clear architectural reason.",
      audio: "Soft UI block chime (-8 dB)."
    },
    {
      sceneNum: "08",
      title: "Steward AI Agent & Grounded Tri-Planar Memory",
      time: "00:45 – 01:00",
      frames: "Frames 2701 – 3600 (15.0s)",
      imageFile: "08_steward_live_agent.png",
      caption: "Steward conversational safety copilot with Groundedness Guard and ProposedAction approval card.",
      vo: "Steward, our on-call AI agent, recalls historical precedents across our three-graph memory — grounded strictly in mathematical proof paths, with zero AI hallucinations.",
      visual: "Cursor presses send button with tactile recoil. Steward streams response with tool inspection drawer and ProposedAction card. Groundedness badge verified green.",
      audio: "Tactile mouse click (-6 dB). Digital token streaming soundscape (-16 dB)."
    },
    {
      sceneNum: "09",
      title: "Connected Tooling & Enterprise Ecosystem",
      time: "Technical Demo",
      frames: "Ecosystem View",
      imageFile: "10_integrations_hub.png",
      caption: "Integrations hub showing Slack, Maileroo, GitHub Actions, FalkorDB, and MCP.",
      vo: "Deeply connected to your existing stack: from Slack incident broadcasts to signed enterprise HMAC webhooks.",
      visual: "Grid of 6 connected integrations with green live health status dots.",
      audio: "Warm Rhodes synth flourish (-18 dB)."
    },
    {
      sceneNum: "10",
      title: "Minimal Brand Resolution & Zero-Login Sandbox",
      time: "01:00 – 01:10",
      frames: "Frames 3601 – 4200 (10.0s)",
      imageFile: "13_brand_lockup.png",
      caption: "Obsidian brand lockup with zero-login badge and live demo URL.",
      vo: "Intercept compound risk before merge. Try the live sandbox today.",
      visual: "Obsidian brand lockup with glowing pill: `npx reprieve scan --strict` · `0 Login Required` · `frontend-six-neon-97.vercel.app`.",
      audio: "Rhodes chord resolves to root tonic. Clean power-down click (-10 dB). Tail decay to silence."
    }
  ];

  console.log('[1/3] Converting images to Base64 data URIs for self-contained embedding...');
  const base64Map = {};
  for (const scene of scenes) {
    const imgPath = path.join(assetsDir, scene.imageFile);
    if (fs.existsSync(imgPath)) {
      const buffer = fs.readFileSync(imgPath);
      base64Map[scene.imageFile] = `data:image/png;base64,${buffer.toString('base64')}`;
      console.log(`  ✓ Embedded ${scene.imageFile} (${Math.round(buffer.length / 1024)} KB)`);
    } else {
      console.warn(`  ✗ Missing ${scene.imageFile}`);
    }
  }

  console.log('[2/3] Generating self-contained HTML document...');
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reprieve — Video Storyboard & Complete Production Blueprint</title>
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
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    header {
      border-bottom: 1px solid var(--card-border);
      padding-bottom: 32px;
      margin-bottom: 48px;
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
    
    h1 {
      font-size: 40px;
      font-weight: 800;
      letter-spacing: -0.03em;
      margin-bottom: 12px;
    }
    
    .subtitle {
      font-size: 18px;
      color: var(--text-muted);
      max-width: 800px;
    }
    
    .actions {
      margin-top: 24px;
      display: flex;
      gap: 16px;
    }
    
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
      margin-bottom: 48px;
    }
    
    .meta-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 8px;
      padding: 20px;
    }
    
    .meta-label {
      font-size: 12px;
      text-transform: uppercase;
      color: var(--text-muted);
      font-weight: 600;
      letter-spacing: 0.05em;
      margin-bottom: 6px;
    }
    
    .meta-val {
      font-size: 18px;
      font-weight: 700;
      font-family: 'JetBrains Mono', monospace;
      color: var(--accent);
    }
    
    .scene-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 48px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
      page-break-inside: avoid;
    }
    
    .scene-header {
      padding: 20px 28px;
      background: #0f1118;
      border-bottom: 1px solid var(--card-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .scene-title {
      font-size: 20px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .scene-num {
      background: var(--accent);
      color: #fff;
      font-size: 12px;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 4px;
      font-family: 'JetBrains Mono', monospace;
    }
    
    .scene-timing {
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      color: var(--amber);
      font-weight: 600;
    }
    
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
      max-height: 650px;
      object-fit: contain;
      display: block;
    }
    
    .scene-body {
      padding: 28px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }
    
    .info-box {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      padding: 20px;
    }
    
    .info-heading {
      font-size: 12px;
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
    
    .vo-quote {
      font-size: 16px;
      font-weight: 600;
      line-height: 1.6;
      color: #f1f5f9;
      font-style: italic;
    }
    
    .spec-text {
      font-size: 14px;
      color: var(--text-muted);
      line-height: 1.6;
    }
    
    .prompt-box {
      background: #0f1118;
      border: 1px solid var(--accent);
      border-radius: 12px;
      padding: 32px;
      margin-top: 60px;
    }
    
    .prompt-box pre {
      background: #06070a;
      border: 1px solid var(--card-border);
      border-radius: 8px;
      padding: 20px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      color: #cbd5e1;
      white-space: pre-wrap;
      overflow-x: auto;
      margin-top: 16px;
      line-height: 1.6;
    }
    
    @media print {
      body { background: #000; color: #fff; padding: 0; }
      .actions { display: none; }
      .scene-card { page-break-after: always; box-shadow: none; border: 1px solid #333; }
      .scene-body { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="badge">REPRIEVE // MASTER VIDEO PRODUCTION BLUEPRINT</div>
      <h1>Official Product Storyboard & Shot Directory</h1>
      <p class="subtitle">Complete scene-by-scene script, cinematography vectors, acoustic sound design, and all 100% hydrated production screenshots embedded directly inside this document.</p>
      <div class="actions">
        <button class="btn" onclick="window.print()">🖨️ Export to PDF / Print</button>
        <a class="btn btn-secondary" href="https://frontend-six-neon-97.vercel.app" target="_blank">🌐 Open Live Sandbox</a>
      </div>
    </header>
    
    <div class="meta-grid">
      <div class="meta-card">
        <div class="meta-label">Master Resolution</div>
        <div class="meta-val">1920 × 1080 @ 60 FPS</div>
      </div>
      <div class="meta-card">
        <div class="meta-label">Aesthetic Profile</div>
        <div class="meta-val">Apple Studio Design</div>
      </div>
      <div class="meta-card">
        <div class="meta-label">Spoken Pacing</div>
        <div class="meta-val">130 WPM (Unrushed)</div>
      </div>
      <div class="meta-card">
        <div class="meta-label">Embedded Images</div>
        <div class="meta-val">${scenes.length} Hi-Res Scenes</div>
      </div>
    </div>
    
    <div class="scenes-list">
      ${scenes.map((scene) => `
        <div class="scene-card">
          <div class="scene-header">
            <div class="scene-title">
              <span class="scene-num">SCENE ${scene.sceneNum}</span>
              <span>${scene.title}</span>
            </div>
            <div class="scene-timing">${scene.time} · ${scene.frames}</div>
          </div>
          <div class="image-container">
            <img src="${base64Map[scene.imageFile] || ''}" alt="${scene.title}" />
          </div>
          <div class="scene-body">
            <div class="info-box" style="grid-column: span 2;">
              <div class="info-heading heading-vo">🎙️ Spoken Voiceover Script</div>
              <div class="vo-quote">"${scene.vo}"</div>
            </div>
            <div class="info-box">
              <div class="info-heading heading-vis">🎥 Visual Direction & Cinematography</div>
              <div class="spec-text">${scene.visual}</div>
              <div style="margin-top: 10px; font-size: 12px; color: #64748b; font-family: monospace;">Source: ${scene.imageFile} (${scene.caption})</div>
            </div>
            <div class="info-box">
              <div class="info-heading heading-aud">🔊 Audio, Music & Foley Design</div>
              <div class="spec-text">${scene.audio}</div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
    
    <div class="prompt-box">
      <h2 style="font-size: 24px; font-weight: 800; margin-bottom: 8px;">Master AI Video Generation Prompt (30-Second Benchmark)</h2>
      <p style="color: var(--text-muted); font-size: 14px;">Copy and paste this prompt directly into Gemini 4 / Veo / video synthesis engines for immediate test rendering:</p>
      <pre>PROMPT: 30-Second Product Launch Commercial — Reprieve (Graph-Native Architecture Safety Engine)

CINEMATOGRAPHY & LIGHTING:
- Style: Apple Design System, WWDC product reveal, high-end developer tool commercial. Clean, restrained, dark-mode studio aesthetic.
- Color Palette: Matte obsidian black (#0c0d12), raised charcoal card surface (#12141c), 1px white bevel rim light (rgba(255,255,255,0.08)), luminous FalkorDB violet (#8b7dff), catastrophe red (#ef4444), passing emerald (#10b981).
- Camera & Lens: Simulated 85mm prime lens with shallow depth-of-field and soft optical bokeh. Mass-spring-damper camera physics with organic deceleration (zero linear robotic pans, zero strobe flashes, zero chaotic cyber-glitches).
- Frame Rate & Resolution: 1920x1080 60 FPS, pin-sharp monospace code typography and high-contrast UI borders.

SCENE SEQUENCE (30 SECONDS TOTAL):

SHOT 1 (00:00 - 00:07) — THE MACRO WAIVER:
Extreme macro close-up on a floating dark graphite code card under soft 3-point studio lighting. An elegant monospace code editor displays: "// FIXME: bypass auth check for load test (expires: +48h)". A cursor blinks with smooth cubic falloff. Above it, a minimal dark status badge transitions from "Review" to "Approved". Subtle camera push-in from 1.0x to 1.04x. The top bevel of the card catches a delicate studio rim reflection.

SHOT 2 (00:07 - 00:15) — THE LIVING GRAPH CANVAS & SCRUBBER:
The camera pulls smoothly out with spatial continuity into an expansive 3D microservice graph canvas (FalkorDB engine). 25 dark nodes with glowing labels (checkout-api, payments-gateway, card-token-vault) float in an obsidian space connected by delicate luminous threads. At the bottom, a sleek frosted-glass timeline slider ("30-Day Temporal Horizon Scrubber") smoothly slides from T+0 to Day +18. Exactly at Day +18, three overlapping exception vectors pulse in vivid crimson (#ef4444), revealing a multi-hop compound failure chain.

SHOT 3 (00:15 - 00:23) — ZERO-LOGIN CLI & GITHUB PR GATE:
Seamless split-focus transition. On the left, a minimal zsh terminal window executes "npx reprieve scan --strict", parsing 1,420 AST nodes with green telemetry readout: "11.8ms AST Latency · Blocked Rule R4". On the right, a pristine dark-mode GitHub Pull Request card appears, showing an automated comment from "reprieve-bot" with an alert banner: "Pull Request Blocked: 1 Compound Failure Invariant Triggered", displaying the shortest proof path table (checkout-api -> payments-gateway -> stripe).

SHOT 4 (00:23 - 00:30) — STEWARD AI & MINIMAL BRAND RESOLUTION:
A realistic mouse cursor glides along a smooth cubic bezier curve, pressing a violet chat button with tactile scale depression (scale: 0.95). A conversational AI drawer ("Steward") streams back a grounded proof path with a green badge: "✓ Groundedness Guard Active (0 Hallucinations)". The camera tracks smoothly back to center, resolving into a symmetrical obsidian brand lockup: Bold white sans-serif wordmark "REPRIEVE", tagline "The Graph-Native Architecture Safety Engine", with a glowing pill: "npx reprieve scan --strict · 0 Login Required". A subtle light sweep glides across the logo bevel as the scene fades to pure obsidian.

AUDIO & FOLEY CUES:
- Music: Warm analog Rhodes electric piano chord pad (C-minor 9th) fading in, deep 40Hz sub-bass foundation, gentle melodic progression.
- Foley: Keychron mechanical switch click at 00:01, tactile slider ratchet click at 00:10, crisp keyboard clatter at 00:16, soft mouse button click at 00:24.
- Voice: Calm, authoritative, confident 130 WPM tech narration.</pre>
    </div>
  </div>
</body>
</html>`;

  fs.writeFileSync(outputHtmlPath, htmlContent, 'utf-8');
  console.log(`  ✓ Successfully generated self-contained HTML: ${outputHtmlPath} (${Math.round(htmlContent.length / 1024)} KB)`);

  console.log('[3/3] Generating Markdown storyboard: docs/VIDEO_STORYBOARD.md...');
  const mdContent = `# Reprieve — Master Video Storyboard & Production Blueprint
> **Format:** Self-Contained Documentation & Production Directing Guide  
> **Master Resolution:** 1920 × 1080 @ 60 FPS  
> **Aesthetic Standard:** Apple Design System · WWDC Studio Presentation · High-Craft Engineering Motion  
> **Standalone Exportable HTML:** [\`docs/video_storyboard.html\`](file:///${outputHtmlPath.replace(/\\\\/g, '/')})

---

${scenes.map((s) => `
## Scene ${s.sceneNum}: ${s.title}
* **Timing:** \`${s.time}\` · ${s.frames}
* **Spoken Voiceover:**
  > *"${s.vo}"*

![${s.title}](video_assets/${s.imageFile})

* **Visual & Cinematography:** ${s.visual}
* **Audio & Foley:** ${s.audio}
* **Source Asset:** [\`${s.imageFile}\`](video_assets/${s.imageFile})

---
`).join('\n')}

## 🚀 30-Second AI Video Generation Prompt (Gemini / Veo / Sora)

\`\`\`markdown
PROMPT: 30-Second Product Launch Commercial — Reprieve (Graph-Native Architecture Safety Engine)

CINEMATOGRAPHY & LIGHTING:
- Style: Apple Design System, WWDC product reveal, high-end developer tool commercial. Clean, restrained, dark-mode studio aesthetic.
- Color Palette: Matte obsidian black (#0c0d12), raised charcoal card surface (#12141c), 1px white bevel rim light (rgba(255,255,255,0.08)), luminous FalkorDB violet (#8b7dff), catastrophe red (#ef4444), passing emerald (#10b981).
- Camera & Lens: Simulated 85mm prime lens with shallow depth-of-field and soft optical bokeh. Mass-spring-damper camera physics with organic deceleration (zero linear robotic pans, zero strobe flashes, zero chaotic cyber-glitches).
- Frame Rate & Resolution: 1920x1080 60 FPS, pin-sharp monospace code typography and high-contrast UI borders.

SCENE SEQUENCE (30 SECONDS TOTAL):

SHOT 1 (00:00 - 00:07) — THE MACRO WAIVER:
Extreme macro close-up on a floating dark graphite code card under soft 3-point studio lighting. An elegant monospace code editor displays: "// FIXME: bypass auth check for load test (expires: +48h)". A cursor blinks with smooth cubic falloff. Above it, a minimal dark status badge transitions from "Review" to "Approved". Subtle camera push-in from 1.0x to 1.04x. The top bevel of the card catches a delicate studio rim reflection.

SHOT 2 (00:07 - 00:15) — THE LIVING GRAPH CANVAS & SCRUBBER:
The camera pulls smoothly out with spatial continuity into an expansive 3D microservice graph canvas (FalkorDB engine). 25 dark nodes with glowing labels (checkout-api, payments-gateway, card-token-vault) float in an obsidian space connected by delicate luminous threads. At the bottom, a sleek frosted-glass timeline slider ("30-Day Temporal Horizon Scrubber") smoothly slides from T+0 to Day +18. Exactly at Day +18, three overlapping exception vectors pulse in vivid crimson (#ef4444), revealing a multi-hop compound failure chain.

SHOT 3 (00:15 - 00:23) — ZERO-LOGIN CLI & GITHUB PR GATE:
Seamless split-focus transition. On the left, a minimal zsh terminal window executes "npx reprieve scan --strict", parsing 1,420 AST nodes with green telemetry readout: "11.8ms AST Latency · Blocked Rule R4". On the right, a pristine dark-mode GitHub Pull Request card appears, showing an automated comment from "reprieve-bot" with an alert banner: "Pull Request Blocked: 1 Compound Failure Invariant Triggered", displaying the shortest proof path table (checkout-api -> payments-gateway -> stripe).

SHOT 4 (00:23 - 00:30) — STEWARD AI & MINIMAL BRAND RESOLUTION:
A realistic mouse cursor glides along a smooth cubic bezier curve, pressing a violet chat button with tactile scale depression (scale: 0.95). A conversational AI drawer ("Steward") streams back a grounded proof path with a green badge: "✓ Groundedness Guard Active (0 Hallucinations)". The camera tracks smoothly back to center, resolving into a symmetrical obsidian brand lockup: Bold white sans-serif wordmark "REPRIEVE", tagline "The Graph-Native Architecture Safety Engine", with a glowing pill: "npx reprieve scan --strict · 0 Login Required". A subtle light sweep glides across the logo bevel as the scene fades to pure obsidian.

AUDIO & FOLEY CUES:
- Music: Warm analog Rhodes electric piano chord pad (C-minor 9th) fading in, deep 40Hz sub-bass foundation, gentle melodic progression.
- Foley: Keychron mechanical switch click at 00:01, tactile slider ratchet click at 00:10, crisp keyboard clatter at 00:16, soft mouse button click at 00:24.
- Voice: Calm, authoritative, confident 130 WPM tech narration.
\`\`\`
`;

  fs.writeFileSync(outputMdPath, mdContent, 'utf-8');
  console.log(`  ✓ Successfully generated Markdown: ${outputMdPath}`);
}

generateSelfContainedStoryboard().catch((e) => {
  console.error(e);
  process.exit(1);
});
