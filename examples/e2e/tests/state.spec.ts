import { test, expect } from "@playwright/test";

test("State should work", async ({ page }) => {
  await page.goto("http://localhost:8080");

  const btn = page.getByText("Click me", { exact: true });
  const result = page.getByText("Clicks:");

  await expect(result).toBeVisible();

  await expect(result).toHaveText("Clicks: 0");

  await btn.click();
  await expect(result).toHaveText("Clicks: 1");

  await btn.click();
  await expect(result).toHaveText("Clicks: 2");
});
