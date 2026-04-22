"use client";

import { useEffect, useRef } from "react";
import SplitText from "./SplitText";

const CTA = () => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        gsap.to(".cta-orb", {
          y: -60,
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }, ref);
      cleanup = () => ctx.revert();
    })();
    return () => cleanup?.();
  }, []);

  return (
    <section id="cta" ref={ref} className="py-24 lg:py-40 relative overflow-hidden">
      <div className="cta-orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/15 blur-3xl -z-10" />
      <div className="absolute inset-0 bg-grid opacity-30 -z-10" />

      <div className="container max-w-5xl mx-auto px-6 text-center">
        <SplitText
          as="h2"
          text="Stop chasing."
          className="font-display text-[clamp(3rem,10vw,9rem)] text-foreground text-center"
        />
        <SplitText
          as="h2"
          text="Start collecting."
          className="font-display text-[clamp(3rem,10vw,9rem)] text-primary text-center sm:-mt-4"
          delay={0.3}
        />

        <p className="mt-10 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Join 12,000+ businesses already getting paid faster with Arinvoice.
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <a
            href="#"
            className="group inline-flex items-center gap-3 px-10 py-5 rounded-full bg-foreground text-background font-bold sm:text-lg text-sm hover:bg-primary transition-colors"
          >
            Create your first invoice — free
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="group-hover:translate-x-1 transition-transform">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          No credit card · 30-second signup · Cancel never (it's free)
        </p>
      </div>
    </section>
  );
};

export default CTA;
