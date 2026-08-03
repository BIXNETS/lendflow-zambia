import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Brand } from "@/components/Brand";
import { cn } from "@/lib/utils";
import { useAccount } from "@/lib/session";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/loans", label: "Services" },
  { to: "/about", label: "About Us" },
  { to: "/faqs", label: "FAQs" },
] as const;

export function SiteNav({ onApply }: { onApply?: () => void }) {
  const [open, setOpen] = useState(false);
  const { account } = useAccount();
  const home = account?.role === "manager" ? "/manager" : "/dashboard";

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--color-line)] bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3.5">
        <Link to="/" className="shrink-0"><Brand /></Link>

        <nav className="hidden items-center gap-7 text-sm font-semibold text-[color:var(--color-muted)] lg:flex">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "text-[color:var(--color-leaf-dark)] border-b-2 border-[color:var(--color-leaf)] pb-0.5" }}
              className="transition hover:text-[color:var(--color-navy)]"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to={account ? home : "/auth"}
            className="hidden rounded-lg border border-[color:var(--color-line)] px-4 py-2 text-sm font-bold text-[color:var(--color-navy)] transition hover:bg-[color:var(--color-sky)] sm:block"
          >
            {account ? "My dashboard" : "Login"}
          </Link>

          <ApplyButton onApply={onApply} />
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-[color:var(--color-line)] lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-[color:var(--color-line)] bg-white px-6 py-3 lg:hidden">
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
              className="block py-2.5 text-sm font-semibold text-[color:var(--color-navy)]">
              {l.label}
            </Link>
          ))}
          <Link to={account ? home : "/auth"} onClick={() => setOpen(false)} className="block py-2.5 text-sm font-semibold text-[color:var(--color-navy)]">
            {account ? "My dashboard" : "Login"}
          </Link>
        </nav>
      )}
    </header>
  );
}

export function ApplyButton({ onApply, className }: { onApply?: () => void; className?: string }) {
  const cls = cn(
    "inline-flex items-center justify-center rounded-lg bg-[color:var(--color-leaf-dark)] px-4 py-2 text-sm font-bold text-white transition hover:bg-[color:var(--color-leaf)]",
    className,
  );
  if (onApply) return <button onClick={onApply} className={cls}>Apply Now</button>;
  return <Link to="/" hash="apply" className={cls}>Apply Now</Link>;
}

export function SiteFooter() {
  return (
    <footer className="border-t border-[color:var(--color-line)] bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Brand />
          <p className="mt-4 max-w-sm text-sm text-[color:var(--color-muted)]">
            Micro loans for everyday Africans. Fast, flexible and built to help you achieve more —
            funded straight to your mobile wallet across Zambia, Ghana, Kenya and Nigeria.
          </p>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-[color:var(--color-navy)]">Company</div>
          <ul className="mt-3 space-y-2 text-sm text-[color:var(--color-muted)]">
            {LINKS.slice(1).map((l) => (
              <li key={l.to}><Link to={l.to} className="hover:text-[color:var(--color-leaf-dark)]">{l.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-[color:var(--color-navy)]">Account</div>
          <ul className="mt-3 space-y-2 text-sm text-[color:var(--color-muted)]">
            <li><Link to="/auth" className="hover:text-[color:var(--color-leaf-dark)]">Login</Link></li>
            <li><Link to="/dashboard" className="hover:text-[color:var(--color-leaf-dark)]">My dashboard</Link></li>
            <li><Link to="/admin" className="hover:text-[color:var(--color-leaf-dark)]">Admin settings</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[color:var(--color-line)] px-6 py-5 text-center text-xs text-[color:var(--color-muted)]">
        © {new Date().getFullYear()} LendFlow Africa. Quick Loans. Real Growth.
      </div>
    </footer>
  );
}
