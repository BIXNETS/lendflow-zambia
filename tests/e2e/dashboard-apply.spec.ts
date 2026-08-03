import { test, expect, type Page } from "@playwright/test";

function unique() {
  const s = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  return { email: `dash.${s}@example.com`, password: "Borrower@2026!", phone: "+260 97 000 0000" };
}

async function signUp(page: Page, creds: ReturnType<typeof unique>) {
  await page.goto("/auth");
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: "New client" }).click();
  await page.getByPlaceholder("Joseph Banda").fill("Joseph Banda");
  await page.getByPlaceholder("+260 97 000 0000").fill(creds.phone);
  await page.getByPlaceholder("you@example.com").fill(creds.email);
  await page.getByPlaceholder("••••••••").fill(creds.password);
  await page.locator('button[type="submit"]').click();
  await page.waitForURL("**/dashboard", { timeout: 30_000 });
}

test.describe("Dashboard apply-for-a-loan", () => {
  test("opens the wizard in place, shows fee/payment details, and closes back to the dashboard", async ({ page }) => {
    await signUp(page, unique());
    await expect(page.getByTestId("loans-card")).toBeVisible({ timeout: 30_000 });

    // 1. Clicking apply keeps us on /dashboard and opens the modal in place.
    await page.getByTestId("apply-loan").click();
    const dialog = page.getByRole("dialog", { name: "Loan application" });
    await expect(dialog).toBeVisible();
    expect(new URL(page.url()).pathname).toBe("/dashboard");
    await expect(page.getByTestId("loans-card")).toBeAttached();

    // 2. Service fee + payment details are visible inside the wizard.
    await expect(dialog.getByLabel("Service")).toBeVisible();
    await expect(dialog).toContainText(/service fee/i);
    await dialog.getByRole("button", { name: /continue|next/i }).first().click();
    await expect(dialog).toContainText(/service fee/i);

    // 3. Refresh with the wizard open: still on the dashboard, wizard restored.
    await page.reload();
    await expect(page.getByRole("dialog", { name: "Loan application" })).toBeVisible({ timeout: 30_000 });
    expect(new URL(page.url()).pathname).toBe("/dashboard");

    // 4. Browser back closes the wizard without leaving the dashboard.
    await page.goBack();
    await expect(page.getByRole("dialog", { name: "Loan application" })).toHaveCount(0);
    expect(new URL(page.url()).pathname).toBe("/dashboard");

    // 5. Explicit close button returns to refreshed dashboard data, never the homepage.
    await page.getByTestId("apply-loan").click();
    await expect(page.getByRole("dialog", { name: "Loan application" })).toBeVisible();
    await page.getByRole("button", { name: "Close" }).click();
    await expect(page.getByRole("dialog", { name: "Loan application" })).toHaveCount(0);
    expect(new URL(page.url()).pathname).toBe("/dashboard");
    await expect(page.getByTestId("loans-card")).toBeVisible();
    await expect(page.getByTestId("transactions-card")).toBeVisible();
  });
});
