import { test, expect, type Page } from "@playwright/test";
import { LOAN_PRODUCTS, fitToProduct } from "../../src/lib/loan-products";
import { computeLoan, INTEREST_RATE } from "../../src/lib/demo-auth";

const money = (n: number) => "K" + Math.round(n).toLocaleString("en-US");
const lendable = LOAN_PRODUCTS.filter(p => !p.soon);

async function openWizardFromCard(page: Page, productId: string) {
  await page.goto("/loans");
  await page.waitForLoadState("networkidle");
  const card = page.getByTestId(`service-card-${productId}`);
  await card.scrollIntoViewIfNeeded();
  await card.getByRole("button").last().click();
  await expect(page.getByRole("dialog")).toBeVisible();
}

async function fillStep1(page: Page) {
  await page.getByRole("textbox").nth(0).fill("Joseph");
  await page.getByRole("textbox").nth(1).fill("Banda");
  await page.getByRole("textbox").nth(2).fill("joseph.banda@example.com");
  await page.getByRole("textbox").nth(3).fill("+260 97 000 0000");
}

test.describe("Loan wizard is wired to each service", () => {
  for (const product of lendable) {
    test(`${product.title}: preselects product, rules and fee`, async ({ page }) => {
      await openWizardFromCard(page, product.id);

      // Step 1 already knows the service and its rules before any amounts are typed.
      await expect(page.getByLabel("Service")).toHaveValue(product.id);
      await expect(page.getByText(`${product.title} rules`)).toBeVisible();
      await expect(page.getByRole("dialog").getByText(`${product.serviceFeePct}%`, { exact: true }).first()).toBeVisible();

      await fillStep1(page);
      await page.getByRole("button", { name: "Continue" }).click();

      // Step 2: amount/term inputs carry the product's own limits.
      const amount = page.locator('input[type="number"]').first();
      const term = page.locator('input[type="number"]').nth(1);
      await expect(amount).toHaveAttribute("min", String(product.minAmount));
      await expect(amount).toHaveAttribute("max", String(product.maxAmount));
      await expect(term).toHaveAttribute("min", String(product.minTerm));
      await expect(term).toHaveAttribute("max", String(product.maxTerm));

      // Over-limit input is clamped back into range.
      await amount.fill(String(product.maxAmount * 10));
      await amount.blur();
      await expect(amount).toHaveValue(String(product.maxAmount));
      await term.fill(String(product.maxTerm + 24));
      await term.blur();
      await expect(term).toHaveValue(String(product.maxTerm));

      // Totals: service fee % of principal + flat 2.5% interest.
      const fit = fitToProduct(product, product.maxAmount, product.maxTerm);
      const calc = computeLoan(fit.amount, product.serviceFeePct, fit.term, product.interestRate);
      expect(product.interestRate).toBe(INTEREST_RATE);
      await expect(page.getByText(money(calc.serviceFee)).first()).toBeVisible();
      await expect(page.getByText(money(calc.totalRepayment)).first()).toBeVisible();

      // Eligibility is gated behind identity verification for signed-out visitors.
      const gate = page.getByTestId("kyc-gate");
      await expect(gate).toHaveAttribute("data-verified", "false");
      await expect(page.getByTestId("eligibility-block").getByRole("checkbox")).toBeDisabled();
    });
  }


  test("below-minimum amounts are clamped up to the product minimum", async ({ page }) => {
    const product = lendable[0]!;
    await openWizardFromCard(page, product.id);
    await fillStep1(page);
    await page.getByRole("button", { name: "Continue" }).click();
    const amount = page.locator('input[type="number"]').first();
    await amount.fill("1");
    await amount.blur();
    await expect(amount).toHaveValue(String(product.minAmount));
  });

  test("coming-soon services cannot be applied for", async ({ page }) => {
    await page.goto("/loans");
    const soon = LOAN_PRODUCTS.find(p => p.soon)!;
    await expect(
      page.getByTestId(`service-card-${soon.id}`).getByRole("button", { name: "Coming soon" }),
    ).toBeDisabled();
  });
});
