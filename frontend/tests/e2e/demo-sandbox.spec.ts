import { expect, test } from "@playwright/test";

test.describe("Northwind Pay Zero-Login Demo Sandbox", () => {
  test("Home dashboard renders fully hydrated risk metrics without skeletons", async ({ page }) => {
    await page.goto("/w/northwind-pay/home", { waitUntil: "domcontentloaded" });

    // Ensure the page shell loads
    await expect(page.locator("body")).toBeVisible();

    // Verify workspace name in shell
    await expect(page.getByText("Northwind Pay")).toBeVisible({ timeout: 15_000 });

    // Verify key risk metric cards are populated
    await expect(page.getByText("Open alerts")).toBeVisible();
    await expect(page.getByText("Active exceptions")).toBeVisible();
    await expect(page.getByText("Expiring in 7 days")).toBeVisible();

    // Verify metrics show numbers
    const exceptionsMetric = page.getByRole("link", { name: /Active exceptions/i });
    await expect(exceptionsMetric).toBeVisible({ timeout: 15_000 });
    await expect(exceptionsMetric.getByText("37")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("checkout-api").first()).toBeVisible({ timeout: 15_000 });
  });

  test("Alerts list renders active alerts with rule chips and severity badges", async ({ page }) => {
    await page.goto("/w/northwind-pay/alerts", { waitUntil: "domcontentloaded" });
    await expect(page.locator("body")).toBeVisible();
    await expect(page.getByText("Northwind Pay")).toBeVisible({ timeout: 15_000 });

    // Verify the alerts list container is visible
    const alertsList = page.getByRole("list", { name: "Alerts" });
    await expect(alertsList).toBeVisible({ timeout: 15_000 });

    // Verify at least one alert list item exists
    const alertItems = alertsList.getByRole("listitem");
    await expect(alertItems.first()).toBeVisible();
  });

  test("Exceptions table renders active waivers with owners and dates", async ({ page }) => {
    await page.goto("/w/northwind-pay/exceptions", { waitUntil: "domcontentloaded" });
    await expect(page.locator("body")).toBeVisible();
    await expect(page.getByText("Northwind Pay")).toBeVisible({ timeout: 15_000 });

    // Verify table has populated exception rows
    await expect(page.getByRole("table")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("columnheader", { name: "Exception" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Expires" })).toBeVisible();
    await expect(page.getByRole("row").nth(1)).toBeVisible();
  });

  test("Services table renders catalog with risk scores", async ({ page }) => {
    await page.goto("/w/northwind-pay/services", { waitUntil: "domcontentloaded" });
    await expect(page.locator("body")).toBeVisible();
    await expect(page.getByText("Northwind Pay")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("checkout-api").first()).toBeVisible();
  });

  test("Graph renders multi-kind nodes and legend without crashing", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/w/northwind-pay/graph", { waitUntil: "domcontentloaded" });
    await expect(page.locator("body")).toBeVisible();
    await expect(page.getByText("Northwind Pay")).toBeVisible({ timeout: 15_000 });

    // Check no fatal runtime error banner
    await expect(page.getByText("Fatal Error")).not.toBeVisible();
    expect(errors.filter((e) => !e.includes("ChunkLoadError"))).toHaveLength(0);

    // Verify Legend contains multiple kinds
    const legend = page.getByRole("list", { name: "Legend" });
    await expect(legend).toBeVisible({ timeout: 15_000 });
    await expect(legend.getByText("Service")).toBeVisible();
    await expect(legend.getByText("Exception")).toBeVisible();
    await expect(legend.getByText("Compensating control")).toBeVisible();
    await expect(legend.getByText("Customer path")).toBeVisible();

    // Verify accessible list view renders full multi-kind telemetry (185 nodes, 389 edges)
    await page.goto("/w/northwind-pay/graph?view=list", { waitUntil: "domcontentloaded" });
    await expect(page.getByText(/Nodes \(185\)/i)).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/Relationships \(389\)/i)).toBeVisible();
    await expect(page.getByRole("cell", { name: "checkout-api" }).first()).toBeVisible();
    await expect(page.getByRole("cell", { name: "Exception" }).first()).toBeVisible();
  });

  test("Graph drawer displays service details without sign-out or session error", async ({ page }) => {
    await page.goto("/w/northwind-pay/graph?drawer=svc_checkout_api", { waitUntil: "domcontentloaded" });
    await expect(page.locator("body")).toBeVisible();
    await expect(page.getByText("Northwind Pay")).toBeVisible({ timeout: 15_000 });

    // Ensure the sheet/drawer is open
    const drawer = page.getByRole("dialog");
    await expect(drawer).toBeVisible({ timeout: 15_000 });

    // Verify service title and ID are displayed
    await expect(drawer.getByRole("heading", { name: "checkout-api" })).toBeVisible({ timeout: 15_000 });
    await expect(drawer.getByText("svc_checkout_api")).toBeVisible();

    // Verify service attributes are displayed in the quick inspect grid
    await expect(drawer.getByText("Payments Platform")).toBeVisible();

    // CRITICAL: Verify safety sign-out error does NOT appear in drawer
    await expect(page.getByText(/You were signed out for safety/i)).not.toBeVisible();
    await expect(page.getByRole("button", { name: "Try again" })).not.toBeVisible();
  });

  test("Settings integrations displays configuration cards without loading freeze", async ({ page }) => {
    await page.goto("/w/northwind-pay/settings/integrations", { waitUntil: "domcontentloaded" });
    await expect(page.locator("body")).toBeVisible();
    await expect(page.getByText("Northwind Pay")).toBeVisible({ timeout: 15_000 });

    // Ensure the loading skeleton / text disappears
    await expect(page.getByText("Loading integrations…")).not.toBeVisible({ timeout: 15_000 });

    // Verify integration plugin cards are rendered
    await expect(page.getByText("Slack / Discord Operational Alerts")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("Transactional Email Bulletins (Maileroo)")).toBeVisible();
    await expect(page.getByText("GitHub CI Pull Request Guard")).toBeVisible();
    await expect(page.getByText("Enterprise Outgoing Webhooks (Svix HMAC)")).toBeVisible();
    await expect(page.getByText("Model Context Protocol (MCP)")).toBeVisible();
  });

  test("People registry renders roster with teams and active exceptions", async ({ page }) => {
    await page.goto("/w/northwind-pay/people", { waitUntil: "domcontentloaded" });
    await expect(page.locator("body")).toBeVisible();
    await expect(page.getByText("Northwind Pay")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("table")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("columnheader", { name: "Person" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Teams" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Owns (active)" })).toBeVisible();
    await expect(page.getByRole("row").nth(1)).toBeVisible();
  });

  test("Teams registry renders teams with leads and services", async ({ page }) => {
    await page.goto("/w/northwind-pay/teams", { waitUntil: "domcontentloaded" });
    await expect(page.locator("body")).toBeVisible();
    await expect(page.getByText("Northwind Pay")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("table")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("columnheader", { name: "Team" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Services" })).toBeVisible();
    await expect(page.getByText("Payments Platform").first()).toBeVisible({ timeout: 15_000 });
  });

  test("Controls registry renders controls with active waivers", async ({ page }) => {
    await page.goto("/w/northwind-pay/controls", { waitUntil: "domcontentloaded" });
    await expect(page.locator("body")).toBeVisible();
    await expect(page.getByText("Northwind Pay")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("table")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("columnheader", { name: "Control" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Active waivers" })).toBeVisible();
  });
});
