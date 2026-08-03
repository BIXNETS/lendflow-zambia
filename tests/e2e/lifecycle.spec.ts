import { test, expect, type Page, type BrowserContext } from "@playwright/test";
import { LOAN_PRODUCTS, fitToProduct } from "../../src/lib/loan-products";
import { computeLoan } from "../../src/lib/demo-auth";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "../../src/lib/session";

const money = (n: number) => "K" + Math.round(n).toLocaleString("en-US");
const PRODUCT = LOAN_PRODUCTS.find(p => p.id === "personal")!;

const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

function unique() {
  const s = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  return { email: `borrower.${s}@example.com`, password: "Borrower@2026!", phone: "+260 97 000 0000" };
}

async function signUp(page: Page, creds: ReturnType<typeof unique>) {
  await page.goto("/auth");
  await page.getByRole("button", { name: /Create account/i }).first().click();
  await page.getByPlaceholder(/full name/i).fill("Joseph Banda");
  await page.getByPlaceholder(/email/i).fill(creds.email);
  await page.getByPlaceholder(/password/i).fill(creds.password);
  const phone = page.getByPlaceholder(/phone/i);
  if (await phone.count()) await phone.first().fill(creds.phone);
  await page.getByRole("button", { name: /Create account|Sign up/i }).last().click();
  await page.waitForURL("**/dashboard", { timeout: 30_000 });
}

async function signIn(page: Page, email: string, password: string, dest: string) {
  await page.goto("/auth");
  await page.getByPlaceholder(/email/i).fill(email);
  await page.getByPlaceholder(/password/i).fill(password);
  await page.getByRole("button", { name: /^Sign in$/i }).last().click();
  await page.waitForURL(`**${dest}`, { timeout: 30_000 });
}

async function uploadKyc(page: Page) {
  await page.goto("/kyc");
  for (const type of ["id_front", "id_back", "selfie"]) {
    await page.getByTestId(`kyc-upload-${type}`).setInputFiles({ name: `${type}.png`, mimeType: "image/png", buffer: PNG });
    await expect(page.getByTestId(`kyc-doc-${type}`)).toContainText(/pending|approved/i, { timeout: 30_000 });
  }
}

async function adminPage(context: BrowserContext) {
  const page = await context.newPage();
  await signIn(page, ADMIN_EMAIL, ADMIN_PASSWORD, "/manager");
  return page;
}

test.describe("Full lending lifecycle", () => {
  test("apply → verify → approve → disburse → repay, with ledger and notifications", async ({ browser }) => {
    const borrowerCtx = await browser.newContext();
    const adminCtx = await browser.newContext();
    const borrower = await borrowerCtx.newPage();
    const creds = unique();

    // 1. Borrower signs up and uploads identity documents.
    await signUp(borrower, creds);
    await uploadKyc(borrower);

    // 2. Manager verifies each document; borrower KYC flips to approved.
    const admin = await adminPage(adminCtx);
    await admin.getByTestId("tab-kyc").click();
    for (let i = 0; i < 3; i++) {
      const btn = admin.getByTestId("approve-doc").first();
      await expect(btn).toBeVisible({ timeout: 20_000 });
      await btn.click();
      await admin.waitForTimeout(500);
    }
    await borrower.goto("/kyc");
    await expect(borrower.getByTestId("kyc-status")).toContainText(/approved/i, { timeout: 30_000 });

    // 3. Borrower applies for a personal loan.
    const fit = fitToProduct(PRODUCT, 5000, PRODUCT.minTerm);
    const calc = computeLoan(fit.amount, PRODUCT.serviceFeePct, fit.term, PRODUCT.interestRate);

    await borrower.goto("/loans");
    const card = borrower.getByTestId(`service-card-${PRODUCT.id}`);
    await card.scrollIntoViewIfNeeded();
    await card.getByRole("button").last().click();
    await expect(borrower.getByRole("dialog")).toBeVisible();
    await borrower.getByRole("button", { name: "Continue" }).click();

    const amount = borrower.locator('input[type="number"]').first();
    await amount.fill(String(fit.amount));
    await amount.blur();
    const term = borrower.locator('input[type="number"]').nth(1);
    await term.fill(String(fit.term));
    await term.blur();

    await expect(borrower.getByTestId("kyc-gate")).toHaveAttribute("data-verified", "true");
    await borrower.getByTestId("eligibility-block").getByRole("checkbox").check();
    await borrower.getByRole("button", { name: "Continue" }).click();

    await borrower.getByRole("button", { name: "MTN MoMo" }).click();
    await borrower.getByRole("textbox").last().fill("+260 96 000 0000");
    await borrower.getByRole("checkbox").last().check();
    await borrower.getByRole("button", { name: "Continue" }).click();

    await expect(borrower.getByTestId("review-fee")).toContainText(`${PRODUCT.serviceFeePct}%`);
    await expect(borrower.getByTestId("review-interest")).toContainText("2.5%");
    await borrower.getByRole("button", { name: /Pay service fee & submit/ }).click();
    await expect(borrower.getByText("+254757860014")).toBeVisible({ timeout: 30_000 });

    // Service-fee transaction is recorded on the borrower ledger.
    await borrower.goto("/dashboard");
    await expect(borrower.getByTestId("application-row").first()).toBeVisible({ timeout: 30_000 });
    await expect(borrower.getByTestId("transactions-card")).toContainText("service fee");
    await expect(borrower.getByTestId("transactions-card")).toContainText(money(calc.serviceFee));

    // 4. Manager approves the application → pending loan + borrower notification.
    await admin.reload();
    await admin.getByTestId("tab-applications").click();
    const appRow = admin.getByTestId("admin-application").first();
    await expect(appRow.getByTestId("app-kyc")).toContainText("approved");
    await appRow.getByTestId("decision-notes").fill("Approved after verification.");
    await appRow.getByTestId("approve-application").click();
    await expect(admin.getByTestId("admin-application").first()).toHaveAttribute("data-status", "approved", { timeout: 30_000 });

    await borrower.goto("/dashboard");
    await expect(borrower.getByTestId("notifications-card")).toContainText(/approved/i, { timeout: 30_000 });
    await expect(borrower.getByTestId("loan-row").first()).toHaveAttribute("data-status", "pending");

    // 5. Manager disburses via mobile money.
    await admin.getByTestId("tab-loans").click();
    await admin.getByTestId("disburse-loan").first().click();
    await expect(admin.getByTestId("admin-loan").first()).toHaveAttribute("data-status", "active", { timeout: 30_000 });

    await borrower.goto("/dashboard");
    await expect(borrower.getByTestId("loan-row").first()).toHaveAttribute("data-status", "active");
    await expect(borrower.getByTestId("transactions-card")).toContainText("disbursement");
    await expect(borrower.getByTestId("notifications-card")).toContainText(/disburs/i);

    // 6. Borrower makes one repayment; balance and ledger reconcile.
    const before = Number((await borrower.getByTestId("loan-balance").first().innerText()).replace(/[^\d]/g, ""));
    await borrower.getByTestId("repay-button").first().click();
    await expect(borrower.getByTestId("transaction-row").filter({ hasText: "repayment" }).first())
      .toBeVisible({ timeout: 30_000 });
    const after = Number((await borrower.getByTestId("loan-balance").first().innerText()).replace(/[^\d]/g, ""));
    expect(after).toBeLessThan(before);
    await expect(borrower.getByTestId("loan-paid").first()).not.toContainText("K0");

    // 7. Admin ledger reflects all three movements and repayment notification.
    await admin.reload();
    await admin.getByTestId("tab-ledger").click();
    for (const type of ["commitment", "disbursement", "repayment"]) {
      await expect(admin.locator(`[data-testid="ledger-row"][data-type="${type}"]`).first())
        .toBeVisible({ timeout: 30_000 });
    }
    await expect(admin.getByTestId("admin-notifications")).toContainText(/repayment/i);

    await borrowerCtx.close();
    await adminCtx.close();
  });
});
