"use client";

import Reveal from "./Reveal";
import SplitText from "./SplitText";

const includes = [
  "Unlimited invoices",
  "Unlimited clients",
  "UPI QR on every invoice",
  "Free email delivery",
  "Pro PDF templates",
  "Client & company dashboard",
  "GST / TDS / multi-currency",
  "Payment notifications",
  "Export everything, anytime",
  "Recurring invoices",
];

const Pricing = () => {
  return (
    <section id="pricing" className="bg-cream text-cream-foreground py-24 sm:py-32 lg:py-40 relative">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Editorial header strip */}
        <div className="flex items-center justify-between gap-6 border-b border-foreground/15 pb-6 mb-16 sm:mb-24">
          <p className="font-mono text-[11px] sm:text-xs font-bold uppercase tracking-[0.3em] text-foreground/60">
            ◆ 008 / Pricing
          </p>
          <p className="font-mono text-[11px] sm:text-xs font-bold uppercase tracking-[0.3em] text-foreground/60 hidden sm:block">
            Forever — No card
          </p>
        </div>

        {/* Headline */}
        <div className="grid grid-cols-12 gap-6 mb-20 sm:mb-32">
          <div className="col-span-12 lg:col-span-9">
            <SplitText
              as="h2"
              text="One price."
              className="font-display text-[clamp(3.5rem,14vw,12rem)] leading-[0.85] text-foreground"
            />
            <SplitText
              as="h2"
              text="Zero rupees."
              className="font-display text-[clamp(3.5rem,14vw,12rem)] text-foreground/30 leading-[0.85]"
            />
          </div>
          <div className="col-span-12 lg:col-span-3 flex lg:items-end">
            <Reveal delay={0.3}>
              <p className="text-base sm:text-lg text-foreground/70 max-w-xs leading-relaxed">
                No tiers. No "Pro" wall. We make money elsewhere — you don't pay a rupee.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Main offering — 12-col editorial layout */}
        <div className="grid grid-cols-12 gap-y-16 lg:gap-x-12">
          {/* Price block */}
          <div className="col-span-12 lg:col-span-5 border-t border-foreground/15 pt-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-foreground/50 mb-8">
              The plan
            </p>

            <div className="flex items-start gap-4 mb-10">
              <span className="font-display text-[clamp(7rem,22vw,18rem)] leading-[0.8] tracking-[-0.06em] text-foreground">
                ₹0
              </span>
              <span className="font-mono text-xs uppercase tracking-widest text-foreground/50 mt-6">
                / forever
              </span>
            </div>

            <div className="space-y-1 mb-12">
              <p className="font-display text-2xl sm:text-3xl text-foreground leading-tight">
                Everything. Unlimited.
              </p>
              <p className="font-display text-2xl sm:text-3xl text-foreground/40 italic leading-tight">
                No asterisks.
              </p>
            </div>

            <a
              href="#cta"
              className="group inline-flex items-center gap-4 bg-foreground text-background px-8 py-5 font-mono text-sm font-bold uppercase tracking-[0.2em] hover:bg-primary transition-colors"
            >
              Start free
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className="transition-transform group-hover:translate-x-1"
              >
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-foreground/40">
              No credit card · Setup in 60 seconds
            </p>
          </div>

          {/* Includes list */}
          <div className="col-span-12 lg:col-span-7 lg:col-start-7 border-t border-foreground/15 pt-10">
            <div className="flex items-baseline justify-between mb-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-foreground/50">
                Everything included
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-foreground/40">
                {String(includes.length).padStart(2, "0")} items
              </p>
            </div>

            <ul className="divide-y divide-foreground/10">
              {includes.map((item, i) => (
                <li
                  key={item}
                  className="flex items-center justify-between py-4 sm:py-5 group"
                >
                  <div className="flex items-center gap-5 sm:gap-8">
                    <span className="font-mono text-[11px] text-foreground/40 w-6">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-xl sm:text-2xl text-foreground tracking-tight">
                      {item}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/40 group-hover:text-primary transition-colors">
                    Included
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer line */}
        <div className="mt-24 sm:mt-32 border-t border-foreground/15 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-foreground/50">
            Arinvoice — Free invoicing, forever.
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-foreground/40">
            est. 2026 · By Arinova Studio
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
