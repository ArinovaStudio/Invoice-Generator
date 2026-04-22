"use client";

import { useEffect, useRef } from "react";
import Reveal from "./Reveal";
import SplitText from "./SplitText";

const steps = [
  {
    n: "01",
    title: "Add a client",
    desc: "Save once. Reuse forever. Your CRM remembers every detail — name, GST, address, contact.",
  },
  {
    n: "02",
    title: "Build the invoice",
    desc: "Pick a template, add line items, set tax. We auto-generate a UPI QR pinned to the total.",
  },
  {
    n: "03",
    title: "Send & get paid",
    desc: "Email it for free. Client scans the QR. Money lands. You get notified instantly.",
  },
];

const HowItWorks = () => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        // Animate connecting line
        gsap.fromTo(
          ".connector-line",
          { scaleY: 0, transformOrigin: "top center" },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".steps-wrapper",
              start: "top 70%",
              end: "bottom 80%",
              scrub: 1,
            },
          }
        );

        gsap.utils.toArray<HTMLElement>(".step-item").forEach((el, i) => {
          gsap.fromTo(
            el,
            { x: i % 2 === 0 ? -60 : 60, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 1.2,
              ease: "expo.out",
              scrollTrigger: { trigger: el, start: "top 80%" },
            }
          );
        });
      }, ref);
      cleanup = () => ctx.revert();
    })();
    return () => cleanup?.();
  }, []);

  return (
    <section id="how" ref={ref} className="py-24 lg:py-32 bg-secondary/40 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial-warm -z-0" />
      <div className="container max-w-6xl mx-auto px-6 relative">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <Reveal>
            <p className="text-sm font-semibold text-primary uppercase tracking-[0.2em] mb-4">
              ◆ How it works
            </p>
          </Reveal>
          <SplitText
            as="h2"
            text="Three steps."
            className="font-display text-[clamp(2.5rem,6vw,5.5rem)] text-foreground"
          />
          <SplitText
            as="h2"
            text="Zero friction."
            className="font-display text-[clamp(2.5rem,6vw,5.5rem)] text-foreground/15"
            delay={0.3}
          />
        </div>

        <div className="steps-wrapper relative">
          {/* Vertical connector */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2">
            <div className="connector-line h-full w-full bg-gradient-to-b from-primary via-primary to-transparent" />
          </div>

          <div className="space-y-20 md:space-y-32">
            {steps.map((s, i) => (
              <div
                key={s.n}
                className={`step-item grid md:grid-cols-2 gap-8 items-center ${
                  i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className={i % 2 === 1 ? "md:text-right" : ""}>
                  <div className="font-mono text-sm text-primary font-bold mb-3 tracking-widest">
                    STEP / {s.n}
                  </div>
                  <h3 className="font-display text-4xl md:text-5xl text-foreground mb-4">
                    {s.title}
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-md md:inline-block">
                    {s.desc}
                  </p>
                </div>
                <div className="relative">
                  <div className="aspect-square max-w-sm mx-auto bg-background rounded-3xl border border-border shadow-card-soft p-8 grid place-items-center">
                    <span className="font-display text-[10rem] leading-none text-primary">
                      {s.n}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
