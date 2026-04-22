"use client";

import { useEffect, useRef } from "react";
import Reveal from "./Reveal";
import SplitText from "./SplitText";

const rows = [
  { f: "Price", a: "₹0 forever", z: "₹749/mo", q: "₹999/mo", w: "₹599/mo" },
  { f: "Unlimited invoices", a: true, z: false, q: false, w: false },
  { f: "UPI QR on every invoice", a: true, z: false, q: false, w: false },
  { f: "Free email delivery", a: true, z: "Limited", q: "Paid add-on", w: false },
  { f: "Client & company CRM", a: true, z: true, q: true, w: "Basic" },
  { f: "GST / CGST / SGST / IGST", a: true, z: true, q: true, w: false },
  { f: "Real-time payment alerts", a: true, z: false, q: "Paid", w: false },
  { f: "PDF templates", a: "12 premium", z: "4", q: "6", w: "3" },
  { f: "Card required to start", a: false, z: true, q: true, w: true },
];

const Cell = ({ v, accent = false }: { v: boolean | string; accent?: boolean }) => {
  if (v === true)
    return (
      <div className={`grid place-items-center w-7 h-7 rounded-full mx-auto ${accent ? "bg-primary text-primary-foreground" : "bg-foreground/10 text-foreground"}`}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  if (v === false)
    return (
      <div className="grid place-items-center w-7 h-7 rounded-full mx-auto bg-muted text-muted-foreground/60">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
    );
  return (
    <span className={`text-sm font-semibold ${accent ? "text-primary" : "text-muted-foreground"}`}>{v}</span>
  );
};

const Comparison = () => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        // Stagger reveal of each row
        gsap.from(".cmp-row", {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.07,
          ease: "expo.out",
          scrollTrigger: { trigger: ".cmp-table", start: "top 80%" },
        });

        // Pop the Arinvoice column header
        gsap.from(".cmp-hero-col", {
          scaleY: 0,
          transformOrigin: "top center",
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: ".cmp-table", start: "top 80%" },
        });

        // Highlight sweep over the Arinvoice column cells
        gsap.fromTo(
          ".cmp-a-cell",
          { backgroundColor: "hsl(var(--primary) / 0)" },
          {
            backgroundColor: "hsl(var(--primary) / 0.08)",
            duration: 0.5,
            stagger: 0.07,
            ease: "power2.out",
            scrollTrigger: { trigger: ".cmp-table", start: "top 70%" },
          }
        );

        // Pop each check/cross icon
        gsap.from(".cmp-row .cmp-icon", {
          scale: 0,
          opacity: 0,
          duration: 0.5,
          stagger: { each: 0.03, from: "random" },
          ease: "back.out(2)",
          scrollTrigger: { trigger: ".cmp-table", start: "top 75%" },
        });
      }, ref);
      cleanup = () => ctx.revert();
    })();
    return () => cleanup?.();
  }, []);

  return (
    <section id="compare" ref={ref} className="py-24 lg:py-40 bg-secondary/40 relative">
      <div className="container max-w-7xl mx-auto px-6">
        <div className="max-w-4xl mb-16">
          <Reveal>
            <p className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-6">◆ 002 / Compare</p>
          </Reveal>
          <SplitText
            as="h2"
            text="Arinvoice vs."
            className="font-display text-[clamp(3rem,9vw,8rem)] text-foreground"
          />
          <SplitText
            as="h2"
            text="The rest."
            className="font-display text-[clamp(3rem,9vw,8rem)] text-foreground/15 -mt-4"
            delay={0.3}
          />
        </div>

        <Reveal>
          <div className="cmp-table rounded-3xl bg-background border border-border overflow-hidden shadow-card-soft">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-6 font-semibold text-sm text-muted-foreground uppercase tracking-wider">Feature</th>
                    <th className="cmp-hero-col p-6 text-center bg-foreground text-background">
                      <div className="font-display text-xl">Arinvoice</div>
                      <div className="text-[10px] font-mono mt-1 text-primary">RECOMMENDED</div>
                    </th>
                    <th className="p-6 text-center font-display text-lg text-foreground">Zoho</th>
                    <th className="p-6 text-center font-display text-lg text-foreground">QuickBooks</th>
                    <th className="p-6 text-center font-display text-lg text-foreground">FreshBooks</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={r.f} className={`cmp-row border-b border-border last:border-0 ${i % 2 === 0 ? "bg-secondary/20" : ""}`}>
                      <td className="p-5 font-semibold text-sm text-foreground">{r.f}</td>
                      <td className="cmp-a-cell p-5 text-center">
                        <span className="cmp-icon inline-block"><Cell v={r.a} accent /></span>
                      </td>
                      <td className="p-5 text-center"><span className="cmp-icon inline-block"><Cell v={r.z} /></span></td>
                      <td className="p-5 text-center"><span className="cmp-icon inline-block"><Cell v={r.q} /></span></td>
                      <td className="p-5 text-center"><span className="cmp-icon inline-block"><Cell v={r.w} /></span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Comparison;
