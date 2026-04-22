"use client";

import { useEffect, useRef } from "react";
import Reveal from "./Reveal";
import SplitText from "./SplitText";

const items = [
  {
    q: "Switched from Zoho. Saved ₹9,000 a year and my clients pay 3x faster with the UPI QR. No-brainer.",
    n: "Aarav Mehta",
    r: "Founder, Pixel Forge",
    c: "hsl(16 100% 50%)",
  },
  {
    q: "The dashboard is gorgeous. I send 40+ invoices a month and the CRM keeps everything organised.",
    n: "Riya Kapoor",
    r: "Freelance Designer",
    c: "hsl(40 90% 55%)",
  },
  {
    q: "Real-time payment alerts changed how I run my agency. I literally see ‘paid’ before the client emails me.",
    n: "Karan Iyer",
    r: "MD, Northwind Studio",
    c: "hsl(190 80% 45%)",
  },
  {
    q: "GST sorted, PDF looks premium, free forever. I keep waiting for the catch — there isn't one.",
    n: "Sneha Rao",
    r: "CA, SR Associates",
    c: "hsl(280 60% 55%)",
  },
  {
    q: "The bento dashboard feels like a Linear-grade app. Hard to believe this is free.",
    n: "Devansh Shah",
    r: "Indie hacker",
    c: "hsl(140 50% 45%)",
  },
];

const Testimonials = () => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>(".tcard").forEach((el, i) => {
          gsap.fromTo(
            el,
            { y: 60, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: "expo.out",
              delay: (i % 3) * 0.1,
              scrollTrigger: { trigger: el, start: "top 88%" },
            }
          );
        });
      }, ref);
      cleanup = () => ctx.revert();
    })();
    return () => cleanup?.();
  }, []);

  return (
    <section id="love" ref={ref} className="py-24 lg:py-40 bg-background relative">
      <div className="container max-w-7xl mx-auto px-6">
        <div className="max-w-4xl mb-16">
          <Reveal>
            <p className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-6">◆ 008 / Loved</p>
          </Reveal>
          <SplitText
            as="h2"
            text="Real teams."
            className="font-display text-[clamp(3rem,9vw,8rem)] text-foreground"
          />
          <SplitText
            as="h2"
            text="Real receipts."
            className="font-display text-[clamp(3rem,9vw,8rem)] text-foreground/15 -mt-4"
            delay={0.3}
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((t, i) => (
            <div
              key={i}
              className={`tcard p-8 rounded-3xl border border-border bg-card hover:border-primary/40 transition-colors ${
                i === 0 ? "lg:col-span-2 bg-foreground text-background border-foreground" : ""
              }`}
            >
              <svg viewBox="0 0 24 24" className="w-8 h-8 mb-6" fill={i === 0 ? "hsl(16 100% 50%)" : "hsl(var(--primary))"}>
                <path d="M7 7h4v4H7c0 2 1 3 3 3v2c-3 0-5-2-5-5V7zm9 0h4v4h-4c0 2 1 3 3 3v2c-3 0-5-2-5-5V7z" />
              </svg>
              <p className={`font-display text-xl md:text-2xl leading-snug mb-8 ${i === 0 ? "" : "text-foreground"}`}>
                "{t.q}"
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-full grid place-items-center font-display text-base text-background"
                  style={{ background: t.c }}
                >
                  {t.n[0]}
                </div>
                <div>
                  <div className={`font-semibold text-sm ${i === 0 ? "" : "text-foreground"}`}>{t.n}</div>
                  <div className={`text-xs ${i === 0 ? "text-background/60" : "text-muted-foreground"}`}>{t.r}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
