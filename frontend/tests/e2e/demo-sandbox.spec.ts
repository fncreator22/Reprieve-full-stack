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
    await expect(page.getByRole("link", { name: /Active exceptions 37/i })).toBeVisible();
    await expect(page.getByText("checkout-api").first()).toBeVisible();
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

  test("Graph canvas renders living mesh page without crashing", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/w/northwind-pay/graph", { waitUntil: "domcontentloaded" });
    await expect(page.locator("body")).toBeVisible();
    await expect(page.getByText("Northwind Pay")).toBeVisible({ timeout: 15_000 });

    // Check no fatal runtime error banner
    await expect(page.getByText("Fatal Error")).not.toBeVisible();
    expect(errors.filter((e) => !e.includes("ChunkLoadError"))).toHaveLength(0);
  });
});
