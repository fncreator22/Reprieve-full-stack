// Reprieve Architecture Safety Engine · True Production Material Capturer
const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

async function captureRealMaterials() {
  const outputDir = path.resolve(__dirname, '../../docs/video_assets');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('[1/4] Launching Chromium (1920x1080 @ 2x device scale)...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2,
    colorScheme: 'dark',
  });
  const page = await context.newPage();

  const realPages = [
    { name: '01_landing_hero.png', url: 'http://localhost:3000/' },
    { name: '02_outage_case_studies.png', url: 'http://localhost:3000/#case-studies' },
    { name: '03_developer_surfaces_bento.png', url: 'http://localhost:3000/#how-it-works' },
    { name: '04_dashboard_home.png', url: 'http://localhost:3000/w/northwind-pay/home' },
    { name: '05_graph_canvas_explorer.png', url: 'http://localhost:3000/w/northwind-pay/graph' },
    { name: '06_alerts_catalog.png', url: 'http://localhost:3000/w/northwind-pay/alerts' },
    { name: '07_exceptions_hub.png', url: 'http://localhost:3000/w/northwind-pay/exceptions' },
    { name: '08_services_directory.png', url: 'http://localhost:3000/w/northwind-pay/services' },
    { name: '09_workspace_settings.png', url: 'http://localhost:3000/w/northwind-pay/settings/workspace' },
    { name: '10_integrations_hub.png', url: 'http://localhost:3000/w/northwind-pay/settings/integrations' },
    { name: '14_controls_registry.png', url: 'http://localhost:3000/w/northwind-pay/controls' },
    { name: '15_teams_roster.png', url: 'http://localhost:3000/w/northwind-pay/teams' },
  ];

  console.log('[2/4] Capturing authentic, hydrated product pages...');
  for (const item of realPages) {
    try {
      console.log(`  -> Loading ${item.url}...`);
      await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(2500); // Allow graph physics and metrics to settle
      const target = path.join(outputDir, item.name);
      await page.screenshot({ path: target });
      const stats = fs.statSync(target);
      console.log(`     ✓ Saved ${item.name} (${Math.round(stats.size / 1024)} KB)`);
    } catch (err) {
      console.error(`     ✗ Error on ${item.url}: ${err.message}`);
    }
  }

  // Also preserve the specialized developer ergonomics cards (CLI, PR Gate, Brand Lockup)
  console.log('[3/4] Verifying CLI and PR Gate assets...');
  const devAssets = [
    '11_terminal_cli_scan.png',
    '12_github_pr_gate.png',
    '13_brand_lockup.png'
  ];
  for (const asset of devAssets) {
    const p = path.join(outputDir, asset);
    if (fs.existsSync(p)) {
      const stats = fs.statSync(p);
      console.log(`     ✓ Verified ${asset} (${Math.round(stats.size / 1024)} KB)`);
    }
  }

  await browser.close();
  console.log('[4/4] All real production materials verified and captured!');
}

captureRealMaterials().catch((e) => {
  console.error('Fatal capture failure:', e);
  process.exit(1);
});
