"use client";

import { useEffect, useRef } from "react";

/**
 * Horizontal-scroll pinned section. Three "slides" scroll horizontally
 * while the section is pinned, then the page resumes normal vertical scroll.
 */
const slides = [
  {
    n: "◆",
    label: "THE CRAFT",
    title: "Build it big.",
    desc: "Drag in line items, set GST, add your UPI ID. Arinvoice turns each invoice into a checkout.",
  },
  {
    n: "✦",
    label: "THE DELIVERY",
    title: "Send it free.",
    desc: "Email delivery built in. No SMTP, no fees, no nonsense — your client gets it in seconds.",
  },
  {
    n: "●",
    label: "THE PAYDAY",
    title: "Get paid live.",
    desc: "Watch the status flip from Sent → Opened → Paid in real time. The chase is over.",
  },
];

const HorizontalShowcase = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      const ctx = gsap.context(() => {
        const totalScroll = () => track.scrollWidth - window.innerWidth;

        const tween = gsap.to(track, {
          x: () => -totalScroll(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${totalScroll()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        // Slide reveal animations driven by horizontal scroll
        gsap.utils.toArray<HTMLElement>(".h-slide").forEach((el, i) => {
          if (i === 0) return;
          gsap.from(el.querySelectorAll(".h-anim"), {
            y: 50,
            opacity: 0,
            stagger: 0.08,
            ease: "expo.out",
            scrollTrigger: {
              trigger: el,
              containerAnimation: tween,
              start: "left 70%",
            },
          });
        });
      }, sectionRef);

      cleanup = () => ctx.revert();
    })();
    return () => cleanup?.();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden bg-background">
      <div className="absolute top-8 left-8 z-10 text-xs font-mono tracking-widest text-muted-foreground hidden md:block">
        ◆ SCROLL HORIZONTALLY →
      </div>
      <div ref={trackRef} className="flex h-full will-change-transform" style={{ width: "max-content" }}>
        {slides.map((s, i) => (
          <div
            key={s.n}
            className={`h-slide w-screen h-screen flex items-center px-8 md:px-20 ${
              i % 2 === 0 ? "bg-background" : "bg-foreground text-background"
            }`}
          >
            <div className="max-w-4xl">
              <div className="h-anim font-mono text-sm font-bold tracking-widest mb-6 text-primary flex items-center gap-3">
                <span className="text-2xl leading-none">{s.n}</span>
                <span>{s.label}</span>
              </div>
              <h3 className={`h-anim font-display text-[clamp(3.5rem,12vw,11rem)] leading-[0.88] mb-8 ${
                i % 2 === 0 ? "text-foreground" : ""
              }`}>
                {s.title}
              </h3>
              <p className={`h-anim text-lg md:text-2xl max-w-xl leading-relaxed ${
                i % 2 === 0 ? "text-muted-foreground" : "text-background/70"
              }`}>
                {s.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HorizontalShowcase;
