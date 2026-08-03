import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Handshake, Sparkles, ShieldCheck, Users } from "lucide-react";
import { SiteNav, SiteFooter, ApplyButton } from "@/components/SiteNav";
import { Wizard } from "@/components/Wizard";
import shopOwner from "@/assets/shop-owner.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About LendFlow Africa — Our Mission and Values" },
      { name: "description", content: "LendFlow Africa provides fair, transparent micro loans to entrepreneurs, students and families across Zambia, Ghana, Kenya and Nigeria." },
      { property: "og:title", content: "About LendFlow Africa" },
      { property: "og:description", content: "Fair, transparent micro lending built for everyday Africans." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

const VALUES = [
  { icon: <Handshake />, title: "Trust", body: "Clear terms, no hidden fees, ever." },
  { icon: <Sparkles />, title: "Growth", body: "Capital that helps you build something lasting." },
  { icon: <ShieldCheck />, title: "Integrity", body: "Responsible lending and safe data handling." },
  { icon: <Users />, title: "Community", body: "Local teams who understand local realities." },
];

function About() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen">
      <SiteNav onApply={() => setOpen(true)} />

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 md:grid-cols-2">
        <div>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">About LendFlow Africa</h1>
          <p className="mt-4 text-[color:var(--color-muted)]">
            We started LendFlow Africa because too many hard-working people are locked out of
            fair credit. Banks ask for paperwork they don't have; lenders charge rates they
            can't afford. We built a simpler path: apply from your phone, pay a one-time
            service fee instead of interest, and get funded to your mobile wallet.
          </p>
          <p className="mt-4 text-[color:var(--color-muted)]">
            Today we serve borrowers in Zambia, Ghana, Kenya and Nigeria — with country settings,
            limits and payment methods tuned for each market.
          </p>
          <ApplyButton onApply={() => setOpen(true)} className="mt-6" />
        </div>
        <img src={shopOwner} alt="Shop owner standing in her store" loading="lazy" width={1024} height={1024}
          className="h-[26rem] w-full rounded-3xl object-cover" />
      </section>

      <section className="border-t border-[color:var(--color-line)] bg-[color:var(--color-mint)]/50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-3xl font-black tracking-tight">Our Values</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div key={v.title} className="card p-6">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-[color:var(--color-leaf-dark)] text-white [&_svg]:h-6 [&_svg]:w-6">
                  {v.icon}
                </div>
                <h3 className="mt-4 text-lg font-bold">{v.title}</h3>
                <p className="mt-1.5 text-sm text-[color:var(--color-muted)]">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
      {open && <Wizard onClose={() => setOpen(false)} loan={{ amount: 15000, term: 12, pct: 12, commitment: 1800, monthly: 1250 }} />}
    </div>
  );
}
