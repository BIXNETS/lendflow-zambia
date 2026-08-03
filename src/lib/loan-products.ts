import { INTEREST_RATE } from "@/lib/demo-auth";

export type LoanProduct = {
  id: string;
  title: string;
  /** One-off service fee charged up front, as a % of the principal. */
  serviceFeePct: number;
  /** Flat interest charged over the life of the loan. */
  interestRate: number;
  minAmount: number;
  maxAmount: number;
  minTerm: number;
  maxTerm: number;
  /** Eligibility requirements the applicant must confirm for this product. */
  eligibility: string[];
  /** Not yet lending. */
  soon?: boolean;
};

export const LOAN_PRODUCTS: LoanProduct[] = [
  {
    id: "personal",
    title: "Personal Loan",
    serviceFeePct: 12,
    interestRate: INTEREST_RATE,
    minAmount: 500, maxAmount: 250000, minTerm: 3, maxTerm: 24,
    eligibility: ["18+ with a valid national ID", "Proof of regular income", "Active mobile money wallet"],
  },
  {
    id: "business",
    title: "Business Loan",
    serviceFeePct: 13,
    interestRate: INTEREST_RATE,
    minAmount: 500, maxAmount: 1000000, minTerm: 3, maxTerm: 24,
    eligibility: ["Business trading for 6+ months", "Business or trading records", "Active mobile money wallet"],
  },
  {
    id: "agri",
    title: "Agri Loan",
    serviceFeePct: 11,
    interestRate: INTEREST_RATE,
    minAmount: 1000, maxAmount: 300000, minTerm: 4, maxTerm: 12,
    eligibility: ["Land or farming activity proof", "Repayment aligned to your harvest", "Input supplier details"],
  },
  {
    id: "civil-servant",
    title: "Civil Servant Loan",
    serviceFeePct: 10,
    interestRate: INTEREST_RATE,
    minAmount: 1000, maxAmount: 500000, minTerm: 6, maxTerm: 24,
    eligibility: ["Government or public sector payslip", "Employee/payroll number", "Consent to payroll deduction"],
  },
  {
    id: "scheme",
    title: "Scheme Loan",
    serviceFeePct: 10,
    interestRate: INTEREST_RATE,
    minAmount: 1000, maxAmount: 400000, minTerm: 3, maxTerm: 24,
    eligibility: ["Employed by a LendFlow partner organisation", "Employer scheme approval", "Latest payslip"],
  },
  {
    id: "collateral",
    title: "Collateral Backed Loan",
    serviceFeePct: 14,
    interestRate: INTEREST_RATE,
    minAmount: 5000, maxAmount: 2000000, minTerm: 6, maxTerm: 36,
    eligibility: ["Vehicle, property or equipment as security", "Ownership documents in your name", "Asset valuation (we arrange it)"],
  },
  {
    id: "salary-advance",
    title: "Salary Advance",
    serviceFeePct: 15,
    interestRate: INTEREST_RATE,
    minAmount: 300, maxAmount: 20000, minTerm: 1, maxTerm: 3,
    eligibility: ["Formally employed with a payslip", "Advance capped at 50% of net salary", "Repaid on your next payday"],
  },
  {
    id: "education",
    title: "Education Loan",
    serviceFeePct: 11,
    interestRate: INTEREST_RATE,
    minAmount: 500, maxAmount: 150000, minTerm: 3, maxTerm: 12,
    eligibility: ["Invoice or fee statement from the school", "Proof of regular income", "Funds paid to the school directly"],
  },
  {
    id: "bill-credit",
    title: "Bill Credit",
    serviceFeePct: 15,
    interestRate: INTEREST_RATE,
    minAmount: 50, maxAmount: 5000, minTerm: 1, maxTerm: 1,
    eligibility: ["Coming soon"],
    soon: true,
  },
];

export const DEFAULT_PRODUCT_ID = "personal";

export function getProduct(id: string | undefined): LoanProduct {
  return LOAN_PRODUCTS.find(p => p.id === id) ?? LOAN_PRODUCTS[0]!;
}

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** Fit a requested amount/term to a product's lending rules. */
export function fitToProduct(product: LoanProduct, amount: number, term: number) {
  return {
    amount: clamp(Math.round(amount), product.minAmount, product.maxAmount),
    term: clamp(Math.round(term), product.minTerm, product.maxTerm),
    pct: product.serviceFeePct,
  };
}
