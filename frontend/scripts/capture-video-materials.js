// Reprieve Architecture Safety Engine · Master Video Asset Generator
const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

async function captureAllMaterials() {
  const outputDir = path.resolve(__dirname, '../../docs/video_assets');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('[1/4] Launching headless browser with Retina 2x scale (1920x1080)...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2,
    colorScheme: 'dark',
  });
  const page = await context.newPage();

  // 1. Live Public Marketing Pages
  console.log('[2/4] Capturing live marketing surfaces...');
  const routes = [
    { name: '01_landing_hero.png', url: 'http://localhost:3000/' },
    { name: '02_outage_case_studies.png', url: 'http://localhost:3000/#case-studies' },
    { name: '03_developer_surfaces_bento.png', url: 'http://localhost:3000/#how-it-works' },
  ];

  for (const item of routes) {
    try {
      await page.goto(item.url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(outputDir, item.name) });
      console.log(`     Saved: ${item.name}`);
    } catch (e) {
      await page.goto(item.url, { waitUntil: 'load', timeout: 15000 });
      await page.screenshot({ path: path.join(outputDir, item.name) });
    }
  }

  console.log('[3/4] Generating dedicated high-craft UI surfaces...');

  // Asset 06: Alert Detail with Shortest Proof Path
  const alertDetailHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        background: #06070a;
        color: #f8fafc;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
      }
      .card {
        width: 1200px;
        background: #0c0d12;
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 12px;
        padding: 36px;
        box-shadow: 0 40px 100px rgba(0, 0, 0, 0.9);
      }
      .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; }
      .badge-row { display: flex; gap: 10px; align-items: center; margin-bottom: 12px; }
      .badge-crit { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); padding: 4px 10px; border-radius: 4px; font-weight: 700; font-size: 12px; font-family: monospace; }
      .badge-rule { background: rgba(139, 125, 255, 0.15); color: #c4b5fd; border: 1px solid rgba(139, 125, 255, 0.3); padding: 4px 10px; border-radius: 4px; font-weight: 600; font-size: 12px; font-family: monospace; }
      .title { font-size: 24px; font-weight: 700; letter-spacing: -0.02em; }
      .subtitle { color: #94a3b8; font-size: 14px; margin-top: 6px; }
      
      .proof-section {
        background: #12141c;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 8px;
        padding: 28px;
        margin-bottom: 28px;
      }
      .proof-title { font-size: 13px; text-transform: uppercase; color: #8b7dff; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 20px; }
      .path-visual {
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        padding: 20px 40px;
      }
      .node-box {
        background: #181926;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        padding: 16px 20px;
        text-align: center;
        min-width: 180px;
        z-index: 2;
      }
      .node-danger { border-color: #ef4444; background: rgba(239, 68, 68, 0.1); }
      .node-warn { border-color: #fbbf24; background: rgba(251, 191, 36, 0.1); }
      .node-name { font-family: monospace; font-weight: 700; font-size: 14px; margin-bottom: 4px; }
      .node-meta { font-size: 11px; color: #94a3b8; }
      .arrow { color: #8b7dff; font-size: 20px; font-weight: bold; }
      
      .metrics-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
      .metric-box { background: #12141c; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 20px; }
      .metric-lbl { font-size: 12px; color: #94a3b8; text-transform: uppercase; margin-bottom: 6px; }
      .metric-num { font-size: 22px; font-weight: 800; font-family: monospace; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="header">
        <div>
          <div class="badge-row">
            <span class="badge-crit">CRITICAL SEVERITY</span>
            <span class="badge-rule">RULE R4: SERVICE CONCENTRATION</span>
            <span style="font-size:12px; color:#94a3b8;">ALERT ID: ALT-001</span>
          </div>
          <div class="title">Single Point of Failure on Customer Checkout Path</div>
          <div class="subtitle">Detected by FalkorDB Topological Invariant Engine at 2026-10-15 14:22 UTC</div>
        </div>
        <button style="background:#ef4444; color:#fff; border:none; padding:10px 20px; border-radius:6px; font-weight:700; cursor:pointer;">
          Propose Human Review
        </button>
      </div>
      
      <div class="proof-section">
        <div class="proof-title">Shortest Proof Path (Calculated Deterministically in 2.1ms)</div>
        <div class="path-visual">
          <div class="node-box node-danger">
            <div class="node-name">checkout-api</div>
            <div class="node-meta">Customer Ingress Hop</div>
          </div>
          <span class="arrow">──(calls)──▶</span>
          <div class="node-box node-danger">
            <div class="node-name">payments-gateway</div>
            <div class="node-meta">Active #nosec Waiver</div>
          </div>
          <span class="arrow">──(reads)──▶</span>
          <div class="node-box node-warn">
            <div class="node-name">card-token-vault</div>
            <div class="node-meta">Expires in 48 Hours</div>
          </div>
          <span class="arrow">──(settles)──▶</span>
          <div class="node-box">
            <div class="node-name">stripe-proxy</div>
            <div class="node-meta">External Third-Party</div>
          </div>
        </div>
      </div>
      
      <div class="metrics-row">
        <div class="metric-box">
          <div class="metric-lbl">Avalanche Centrality</div>
          <div class="metric-num" style="color:#f87171;">P = 0.94 (High Blast)</div>
        </div>
        <div class="metric-box">
          <div class="metric-lbl">Compensating Control</div>
          <div class="metric-num" style="color:#fbbf24;">Broken / Desynced</div>
        </div>
        <div class="metric-box">
          <div class="metric-lbl">Grounding Guarantee</div>
          <div class="metric-num" style="color:#34d399;">100% Graph-Backed</div>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
  await page.setContent(alertDetailHtml);
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outputDir, '06_alerts_catalog.png') });
  console.log('     Saved: 06_alerts_catalog.png');

  // Asset 10: Integrations Hub
  const integrationsHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        background: #06070a;
        color: #f8fafc;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
      }
      .card {
        width: 1200px;
        background: #0c0d12;
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 12px;
        padding: 40px;
        box-shadow: 0 40px 100px rgba(0, 0, 0, 0.9);
      }
      .title-row { margin-bottom: 28px; }
      .title { font-size: 26px; font-weight: 700; margin-bottom: 6px; }
      .desc { color: #94a3b8; font-size: 14px; }
      .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
      .tile {
        background: #11131a;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 8px;
        padding: 24px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .tile-top { display: flex; align-items: center; gap: 14px; margin-bottom: 12px; }
      .tile-icon { width: 36px; height: 36px; border-radius: 8px; background: rgba(255, 255, 255, 0.05); display: flex; align-items: center; justify-content: center; font-size: 18px; }
      .tile-name { font-weight: 600; font-size: 16px; }
      .tile-sub { color: #94a3b8; font-size: 13px; line-height: 1.5; margin-bottom: 20px; }
      .status-pill { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: #10b981; }
      .status-dot { width: 6px; height: 6px; border-radius: 50%; background: #10b981; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="title-row">
        <div class="title">Integrations & Connected Tooling</div>
        <div class="desc">Connect Reprieve’s architectural safety engine to CI gates, alert webhooks, and AI agent environments.</div>
      </div>
      <div class="grid">
        <div class="tile">
          <div>
            <div class="tile-top">
              <div class="tile-icon" style="color:#58a6ff;">🐙</div>
              <div class="tile-name">GitHub Actions</div>
            </div>
            <div class="tile-sub">Pre-merge pull request circuit breaker blocking compound topological violations.</div>
          </div>
          <div class="status-pill"><div class="status-dot"></div> Connected (.github/workflows/reprieve.yml)</div>
        </div>
        <div class="tile">
          <div>
            <div class="tile-top">
              <div class="tile-icon" style="color:#8b7dff;">🤖</div>
              <div class="tile-name">Model Context Protocol (MCP)</div>
            </div>
            <div class="tile-sub">14 read-only graph reasoning tools for Cursor, Claude Desktop, and VS Code.</div>
          </div>
          <div class="status-pill"><div class="status-dot"></div> Active (claude_desktop_config.json)</div>
        </div>
        <div class="tile">
          <div>
            <div class="tile-top">
              <div class="tile-icon" style="color:#e01e5a;">💬</div>
              <div class="tile-name">Slack & Discord</div>
            </div>
            <div class="tile-sub">Instant incident dispatch cards with calculated shortest proof paths broadcast to #sre-alerts.</div>
          </div>
          <div class="status-pill"><div class="status-dot"></div> Connected (Webhook Verified)</div>
        </div>
        <div class="tile">
          <div>
            <div class="tile-top">
              <div class="tile-icon" style="color:#f59e0b;">📧</div>
              <div class="tile-name">Maileroo</div>
            </div>
            <div class="tile-sub">Transactional risk bulletins and weekly executive architectural digest summaries.</div>
          </div>
          <div class="status-pill"><div class="status-dot"></div> 3,000 Emails/Mo Active</div>
        </div>
        <div class="tile">
          <div>
            <div class="tile-top">
              <div class="tile-icon" style="color:#ef4444;">🛡️</div>
              <div class="tile-name">Enterprise HMAC Webhooks</div>
            </div>
            <div class="tile-sub">Signed Svix-style payloads for Datadog, PagerDuty, and SOC2 compliance archives.</div>
          </div>
          <div class="status-pill"><div class="status-dot"></div> SHA-256 Signing Active</div>
        </div>
        <div class="tile">
          <div>
            <div class="tile-top">
              <div class="tile-icon" style="color:#a855f7;">⚡</div>
              <div class="tile-name">FalkorDB Cloud</div>
            </div>
            <div class="tile-sub">Ultra-low latency graph engine executing Cypher traversals in under 2.5 milliseconds.</div>
          </div>
          <div class="status-pill"><div class="status-dot"></div> Connected (Cluster Healthy)</div>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
  await page.setContent(integrationsHtml);
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outputDir, '10_integrations_hub.png') });
  console.log('     Saved: 10_integrations_hub.png');

  await browser.close();
  console.log('[4/4] All master video assets 100% complete in docs/video_assets/!');
}

captureAllMaterials().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
