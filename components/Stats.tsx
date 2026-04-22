"use client";

import { useEffect, useRef } from "react";
import Reveal from "./Reveal";
import SplitText from "./SplitText";

const stats = [
  { v: 47, suffix: "K+", label: "Invoices sent", sub: "Last 30 days" },
  { v: 12, suffix: "Cr", label: "Payments collected", sub: "₹ via UPI" },
  { v: 98, suffix: "%", label: "Get paid faster", sub: "vs. PDF email" },
  { v: 0, suffix: "₹", label: "Forever free", sub: "No card. No catch." },
];

const Stats = () => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>(".stat-num").forEach((el) => {
          const target = parseFloat(el.dataset.value || "0");
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: 2,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
            onUpdate: () => {
              el.textContent = Math.round(obj.val).toString();
            },
          });
        });

        gsap.from(".stat-card", {
          y: 60,
          opacity: 0,
          duration: 1,
          stagger: 0.12,
          ease: "expo.out",
          scrollTrigger: { trigger: ".stats-grid", start: "top 80%" },
        });

        gsap.utils.toArray<HTMLElement>(".stat-bar").forEach((el) => {
          gsap.fromTo(
            el,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.4,
              ease: "expo.out",
              scrollTrigger: { trigger: el, start: "top 90%" },
            }
          );
        });
      }, ref);
      cleanup = () => ctx.revert();
    })();
    return () => cleanup?.();
  }, []);

  return (
    <section ref={ref} className="py-24 lg:py-40 bg-foreground text-background relative overflow-hidden">
      <div className="container max-w-7xl mx-auto px-6">
        <div className="max-w-4xl mb-20">
          <Reveal>
            <p className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-6">◆ 003 / Numbers</p>
          </Reveal>
          <SplitText
            as="h2"
            text="Big numbers."
            className="font-display text-[clamp(3rem,9vw,8rem)] leading-[0.9]"
          />
          <SplitText
            as="h2"
            text="Bigger results."
            className="font-display text-[clamp(3rem,9vw,8rem)] text-primary leading-[0.9] -mt-2"
            delay={0.3}
          />
        </div>

        <div className="stats-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-background/10">
          {stats.map((s) => (
            <div key={s.label} className="stat-card bg-foreground p-8 lg:p-10 group hover:bg-primary transition-colors duration-500">
              <div className="font-display text-[clamp(4rem,8vw,7rem)] leading-none flex items-baseline gap-1">
                {s.suffix === "₹" && <span className="text-background/60">₹</span>}
                <span className="stat-num" data-value={s.v}>0</span>
                {s.suffix !== "₹" && <span className="text-background/60 text-[0.5em]">{s.suffix}</span>}
              </div>
              <div className="stat-bar h-px bg-primary group-hover:bg-background origin-left mt-6 mb-4" />
              <div className="font-semibold text-lg">{s.label}</div>
              <div className="text-sm text-background/60 mt-1">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
