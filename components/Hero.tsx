"use client";

import { useEffect, useRef } from "react";
import SplitText from "./SplitText";
import InvoiceIllustration from "./InvoiceIllustration";

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    (async () => {
      const { default: gsap } = await import("gsap");
      const ctx = gsap.context(() => {
        gsap.from(".hero-eyebrow", { y: 20, opacity: 0, duration: 0.8, ease: "expo.out" });
        gsap.from(".hero-sub", { y: 20, opacity: 0, duration: 0.9, ease: "expo.out", delay: 1.1 });
        gsap.from(".hero-cta > *", { y: 20, opacity: 0, duration: 0.8, stagger: 0.1, ease: "expo.out", delay: 1.3 });
        gsap.from(".hero-stat", { y: 20, opacity: 0, duration: 0.8, stagger: 0.1, ease: "expo.out", delay: 1.5 });

        gsap.to(blobRef.current, {
          y: 80,
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      }, heroRef);

      cleanup = () => ctx.revert();
    })();
    return () => cleanup?.();
  }, []);

  return (
    <section ref={heroRef} className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-warm -z-10" />
      <div className="absolute inset-0 bg-grid -z-10 opacity-40" />
      <div
        ref={blobRef}
        className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl -z-10"
      />

      <div className="sm:px-24 px-4 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        <div>
          <div className="hero-eyebrow inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20 mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-semibold text-accent-foreground tracking-wide uppercase">
              100% Free · No card required
            </span>
          </div>

          <SplitText
            as="h1"
            text="Invoices that pay themselves."
            className="font-display text-[clamp(3rem,8vw,7rem)] text-foreground"
          />
          <SplitText
            as="p"
            text="FREE FOREVER."
            className="font-display text-[clamp(3rem,8vw,6rem)] text-foreground/15 mt-2"
            delay={0.8}
          />

          <p className="hero-sub mt-8 text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
            Generate beautiful invoices, accept instant{" "}
            <span className="text-foreground font-semibold">UPI QR payments</span>, manage clients & companies, and send them by email — all from one professional dashboard. Zero cost. Forever.
          </p>

          <div className="hero-cta mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#cta"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-foreground text-background font-semibold text-base hover:bg-primary transition-colors"
            >
              Create your first invoice
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="group-hover:translate-x-1 transition-transform">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href="#how"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-full border-2 border-border hover:border-primary text-foreground font-semibold text-base transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M10 8l6 4-6 4V8z" fill="currentColor" />
              </svg>
              See how it works
            </a>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-4 max-w-md">
            {[
              { v: "12K+", l: "Invoices sent" },
              { v: "₹4.2Cr", l: "Paid via UPI" },
              { v: "0₹", l: "Forever cost" },
            ].map((s) => (
              <div key={s.l} className="hero-stat">
                <div className="font-display text-3xl text-foreground">{s.v}</div>
                <div className="text-xs text-muted-foreground mt-1 font-medium">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <InvoiceIllustration />
        </div>
      </div>
    </section>
  );
};

export default Hero;
