export type Role = "manager" | "client";

export type Account = {
  email: string;
  password: string;
  name: string;
  role: Role;
  phone?: string;
};

export type Application = {
  id: string;
  email: string;
  name: string;
  amount: number;
  term: number;
  serviceFeePct: number;
  serviceFee: number;
  productId: string;
  productTitle: string;
  interestRate: number;
  provider: string;
  msisdn: string;
  purpose: string;
  status: "awaiting_fee" | "under_review" | "approved" | "declined";
  createdAt: string;
};

const USERS_KEY = "lf_users";
const SESSION_KEY = "lf_session";
const APPS_KEY = "lf_applications";

export const DEMO_ACCOUNTS: Account[] = [
  { email: "manager@lendflowafrica.com", password: "Manager@2026", name: "Grace Mwansa", role: "manager" },
  { email: "client@lendflowafrica.com", password: "Client@2026", name: "Joseph Banda", role: "client" },
];

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { const v = localStorage.getItem(key); return v ? (JSON.parse(v) as T) : fallback; }
  catch { return fallback; }
}
function write(key: string, value: unknown) {
  if (typeof window !== "undefined") localStorage.setItem(key, JSON.stringify(value));
}

export function allUsers(): Account[] {
  const stored = read<Account[]>(USERS_KEY, []);
  const merged = [...DEMO_ACCOUNTS];
  for (const u of stored) if (!merged.some(m => m.email === u.email)) merged.push(u);
  return merged;
}

export function signIn(email: string, password: string): Account | null {
  const user = allUsers().find(
    u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password,
  );
  if (!user) return null;
  write(SESSION_KEY, { email: user.email });
  return user;
}

export function signUp(input: { name: string; email: string; password: string; phone: string }):
  { ok: true; user: Account } | { ok: false; error: string } {
  const email = input.email.trim().toLowerCase();
  if (allUsers().some(u => u.email.toLowerCase() === email)) {
    return { ok: false, error: "An account with this email already exists." };
  }
  const user: Account = { ...input, email, role: "client" };
  write(USERS_KEY, [...read<Account[]>(USERS_KEY, []), user]);
  write(SESSION_KEY, { email });
  return { ok: true, user };
}

export function currentUser(): Account | null {
  const s = read<{ email: string } | null>(SESSION_KEY, null);
  if (!s) return null;
  return allUsers().find(u => u.email === s.email) ?? null;
}

export function signOut() {
  if (typeof window !== "undefined") localStorage.removeItem(SESSION_KEY);
}

export function listApplications(): Application[] {
  return read<Application[]>(APPS_KEY, seedApplications());
}

export function saveApplication(app: Application) {
  write(APPS_KEY, [app, ...listApplications()]);
}

export function updateApplication(id: string, patch: Partial<Application>) {
  write(APPS_KEY, listApplications().map(a => (a.id === id ? { ...a, ...patch } : a)));
}

function seedApplications(): Application[] {
  const seed: Application[] = [
    {
      id: "LF-10241", email: "client@lendflowafrica.com", name: "Joseph Banda",
      amount: 8000, term: 6, serviceFeePct: 13, serviceFee: 1040, productId: "business", productTitle: "Business Loan", interestRate: INTEREST_RATE,
      provider: "MTN MoMo", msisdn: "+260 97 555 0142", purpose: "Business stock",
      status: "under_review", createdAt: new Date(Date.now() - 864e5 * 2).toISOString(),
    },
    {
      id: "LF-10238", email: "mary.phiri@example.com", name: "Mary Phiri",
      amount: 15000, term: 12, serviceFeePct: 11, serviceFee: 1650, productId: "agri", productTitle: "Agri Loan", interestRate: INTEREST_RATE,
      provider: "Airtel Money", msisdn: "+260 96 555 0987", purpose: "Farming inputs",
      status: "approved", createdAt: new Date(Date.now() - 864e5 * 9).toISOString(),
    },
    {
      id: "LF-10233", email: "kofi.mensah@example.com", name: "Kofi Mensah",
      amount: 4000, term: 3, serviceFeePct: 11, serviceFee: 440, productId: "education", productTitle: "Education Loan", interestRate: INTEREST_RATE,
      provider: "M-Pesa", msisdn: "+254 71 555 0034", purpose: "School fees",
      status: "awaiting_fee", createdAt: new Date(Date.now() - 864e5 * 12).toISOString(),
    },
  ];
  write(APPS_KEY, seed);
  return seed;
}

export const money = (n: number) =>
  "K" + Math.round(n).toLocaleString("en-US");

/** Flat interest charged on every LendFlow loan. */
export const INTEREST_RATE = 0.025;
export const INTEREST_LABEL = "2.5%";

/** Single source of truth for loan maths: principal, service fee, interest, total. */
export function computeLoan(amount: number, pct: number, term: number, rate: number = INTEREST_RATE) {
  const principal = Math.round(amount);
  const serviceFee = Math.round((principal * pct) / 100);
  const interest = Math.round(principal * rate);
  const totalRepayment = principal + interest;
  return { principal, serviceFee, interest, totalRepayment, monthly: totalRepayment / term };
}
