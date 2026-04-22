"use client";

import { useEffect, useRef } from "react";

const cases = [
  {
    tag: "FREELANCERS",
    title: "Designers, devs, writers.",
    desc: "Send a slick invoice in 30 seconds. Get paid via UPI before the call ends.",
    stat: "₹0",
    statLabel: "Per invoice. Forever.",
    color: "bg-primary text-primary-foreground",
  },
  {
    tag: "AGENCIES",
    title: "Studios that ship.",
    desc: "Manage 50+ retainers, recurring billing, and team roles — without spreadsheet hell.",
    stat: "12hr",
    statLabel: "Saved per week",
    color: "bg-foreground text-background",
  },
  {
    tag: "STARTUPS",
    title: "Built for the chaos.",
    desc: "GST-ready, investor-friendly exports, and a CRM that grows with your client list.",
    stat: "3x",
    statLabel: "Faster collections",
    color: "bg-secondary text-foreground",
  },
  {
    tag: "ECOMMERCE",
    title: "Sellers & D2C brands.",
    desc: "Auto-generate invoices for every order. Sync with Shopify, WooCommerce, and Tally.",
    stat: "100%",
    statLabel: "Tax-compliant",
    color: "bg-background text-foreground border-l border-border",
  },
];

const UseCasesHorizontal = () => {
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
        const getDistance = () => Math.max(0, track.scrollWidth - section.clientWidth);

        const tween = gsap.to(track, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getDistance() + section.offsetHeight}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            // anticipatePin: 1,
            // pinSpacing: true,
            fastScrollEnd: true,
            pinType: "fixed",
          },
        });

        gsap.utils.toArray<HTMLElement>(".uc-card").forEach((el, i) => {
          gsap.from(el.querySelectorAll(".uc-anim"), {
            y: 60,
            opacity: 0,
            stagger: 0.1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: el,
              containerAnimation: tween,
              start: "left 75%",
            },
          });

          gsap.from(el.querySelector(".uc-stat"), {
            scale: 0.4,
            opacity: 0,
            duration: 1,
            ease: "back.out(1.6)",
            scrollTrigger: {
              trigger: el,
              containerAnimation: tween,
              start: "left 60%",
            },
          });
        });

        // Progress indicator
        gsap.to(".uc-progress-bar", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getDistance()}`,
            scrub: true,
          },
        });
      }, sectionRef);

      const onResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", onResize);
      // Refresh once after layout settles (fonts/images)
      const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 300);

      cleanup = () => {
        window.removeEventListener("resize", onResize);
        window.clearTimeout(refreshTimer);
        ctx.revert();
      };
    })();
    return () => cleanup?.();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen min-h-[700px] overflow-hidden bg-background">
      {/* Header overlay */}
      <div className="absolute top-0 inset-x-0 z-20 px-4 sm:px-6 md:px-12 pt-6 sm:pt-10 pointer-events-none">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0 mt-8">
            <p className="text-[10px] sm:text-xs font-bold text-primary uppercase tracking-[0.3em] mb-2 sm:mb-3">◆ 005 / Use cases</p>
            <h2 className="font-display text-[clamp(1.75rem,5vw,4rem)] leading-[0.9] text-foreground">
              Built for <span className="text-foreground/30">everyone.</span>
            </h2>
          </div>
          <div className="hidden md:block text-xs font-mono tracking-widest text-muted-foreground flex-shrink-0">
            DRAG / SCROLL →
          </div>
        </div>
        <div className="mt-4 sm:mt-4 h-px bg-border w-full overflow-hidden">
          <div className="uc-progress-bar h-full bg-primary origin-left" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>

      <div ref={trackRef} className="flex h-full will-change-transform pt-32 sm:pt-40 pb-8 sm:pb-12 mt-10" style={{ width: "max-content" }}>
        {cases.map((c, i) => (
          <div
            key={c.tag}
            className={`uc-card w-screen md:w-[80vw] lg:w-[70vw] h-full flex items-center px-6 sm:px-8 md:px-16 ${c.color}`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 lg:gap-20 items-center w-full">
              <div>
                <div className="uc-anim flex items-center gap-3 sm:gap-4 mb-5 sm:mb-8">
                  <span className="font-mono text-xs sm:text-sm font-bold tracking-widest opacity-60">
                    {String(i + 1).padStart(2, "0")} / {String(cases.length).padStart(2, "0")}
                  </span>
                  <div className="h-px flex-1 bg-current opacity-20" />
                  <span className="font-mono text-xs sm:text-sm font-bold tracking-widest">{c.tag}</span>
                </div>
                <h3 className="uc-anim font-display text-[clamp(2.25rem,8vw,7rem)] leading-[0.88] mb-4 sm:mb-8">
                  {c.title}
                </h3>
                <p className="uc-anim text-base sm:text-lg md:text-xl max-w-lg opacity-80 leading-relaxed">
                  {c.desc}
                </p>
                <div className="uc-anim mt-6 sm:mt-10 inline-flex items-center gap-3 text-sm font-semibold border-b border-current pb-1">
                  Read story
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              <div className="uc-stat flex flex-col items-start md:items-end">
                <div className="font-display text-[clamp(4.5rem,18vw,16rem)] leading-[0.85]">
                  {c.stat}
                </div>
                <div className="text-xs sm:text-sm font-mono uppercase tracking-widest opacity-60 mt-2">
                  {c.statLabel}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default UseCasesHorizontal;
