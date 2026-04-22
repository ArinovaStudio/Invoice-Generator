"use client";

import { useEffect, useRef } from "react";
import Reveal from "./Reveal";
import SplitText from "./SplitText";

const Features = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>(".bento-tile").forEach((el, i) => {
          gsap.fromTo(
            el,
            { y: 80, opacity: 0, rotateX: -8 },
            {
              y: 0,
              opacity: 1,
              rotateX: 0,
              duration: 1.1,
              ease: "expo.out",
              delay: (i % 3) * 0.08,
              scrollTrigger: { trigger: el, start: "top 88%" },
            }
          );

          // 3D tilt on mouse move
          const onMove = (e: MouseEvent) => {
            const r = el.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            gsap.to(el, {
              rotateY: x * 8,
              rotateX: -y * 8,
              transformPerspective: 1000,
              transformOrigin: "center",
              duration: 0.6,
              ease: "power3.out",
            });
            const inner = el.querySelector<HTMLElement>(".bento-3d");
            if (inner) {
              gsap.to(inner, { x: x * 18, y: y * 18, duration: 0.7, ease: "power3.out" });
            }
          };
          const onLeave = () => {
            gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.9, ease: "expo.out" });
            const inner = el.querySelector<HTMLElement>(".bento-3d");
            if (inner) gsap.to(inner, { x: 0, y: 0, duration: 0.9, ease: "expo.out" });
          };
          el.addEventListener("mousemove", onMove);
          el.addEventListener("mouseleave", onLeave);
        });
      }, sectionRef);
      cleanup = () => ctx.revert();
    })();
    return () => cleanup?.();
  }, []);

  return (
    <section id="features" ref={sectionRef} className="py-20 sm:py-24 lg:py-40 relative bg-background">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mb-12 sm:mb-20">
          <Reveal>
            <p className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-4 sm:mb-6">
              ◆ 006 / Features
            </p>
          </Reveal>
          <SplitText
            as="h2"
            text="Big tools."
            className="font-display text-[clamp(3rem,12vw,9rem)] text-foreground"
          />
          <SplitText
            as="h2"
            text="Zero noise."
            className="font-display text-[clamp(3rem,12vw,9rem)] text-foreground/15 -mt-2 sm:-mt-4"
            delay={0.3}
          />
        </div>

        {/* BENTO GRID */}
        <div className="grid grid-cols-12 auto-rows-auto md:auto-rows-[180px] gap-3 sm:gap-4 md:gap-5">
          {/* TILE 1 — UPI QR (large) */}
          <div className="bento-tile group col-span-12 md:col-span-7 md:row-span-2 relative overflow-hidden rounded-3xl bg-foreground text-background p-6 sm:p-8 md:p-10 cursor-pointer min-h-[380px] md:min-h-0">
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 text-[10px] font-mono tracking-widest text-background/40">/ 01</div>
            <div className="bento-3d absolute -bottom-8 -right-8 sm:-bottom-10 sm:-right-10 w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] md:w-[340px] md:h-[340px] will-change-transform pointer-events-none">
              {/* 3D-style QR + phone */}
              <svg viewBox="0 0 320 320" className="w-full h-full drop-shadow-2xl">
                <defs>
                  <linearGradient id="qrFace" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="hsl(0 0% 100%)" />
                    <stop offset="100%" stopColor="hsl(30 30% 92%)" />
                  </linearGradient>
                </defs>
                <g transform="translate(40 40) rotate(-12 140 140)">
                  {/* shadow stack for 3D depth */}
                  <rect x="6" y="10" width="220" height="220" rx="28" fill="hsl(16 100% 50%)" opacity="0.6" />
                  <rect x="3" y="5" width="220" height="220" rx="28" fill="hsl(16 100% 50%)" opacity="0.85" />
                  <rect x="0" y="0" width="220" height="220" rx="28" fill="url(#qrFace)" />
                  {/* QR pattern */}
                  <g fill="hsl(16 25% 8%)">
                    <rect x="20" y="20" width="44" height="44" rx="8" />
                    <rect x="156" y="20" width="44" height="44" rx="8" />
                    <rect x="20" y="156" width="44" height="44" rx="8" />
                    <rect x="32" y="32" width="20" height="20" rx="3" fill="url(#qrFace)" />
                    <rect x="168" y="32" width="20" height="20" rx="3" fill="url(#qrFace)" />
                    <rect x="32" y="168" width="20" height="20" rx="3" fill="url(#qrFace)" />
                    <rect x="80" y="20" width="14" height="14" />
                    <rect x="100" y="40" width="14" height="14" />
                    <rect x="120" y="20" width="14" height="14" />
                    <rect x="80" y="80" width="14" height="14" />
                    <rect x="100" y="100" width="14" height="14" />
                    <rect x="140" y="100" width="14" height="14" />
                    <rect x="80" y="140" width="14" height="14" />
                    <rect x="120" y="160" width="14" height="14" />
                    <rect x="160" y="120" width="14" height="14" />
                    <rect x="180" y="160" width="14" height="14" />
                    <rect x="100" y="180" width="14" height="14" />
                    <rect x="140" y="180" width="14" height="14" />
                  </g>
                  {/* center logo */}
                  <circle cx="110" cy="110" r="18" fill="hsl(16 100% 50%)" />
                  <text x="110" y="117" textAnchor="middle" fill="white" fontWeight="800" fontSize="18">₹</text>
                </g>
              </svg>
            </div>
            <div className="relative z-10 max-w-md">
              <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-primary mb-3 sm:mb-4">UPI · INSTANT</div>
              <h3 className="font-display text-4xl sm:text-5xl md:text-7xl leading-[0.9] mb-4 sm:mb-6">
                Scan.<br />
                <span className="text-primary">Paid.</span>
              </h3>
              <p className="text-background/60 text-sm sm:text-base max-w-[60%] sm:max-w-xs leading-relaxed">
                Every invoice ships with a dynamic UPI QR locked to the total. Money lands in your bank — not ours.
              </p>
            </div>
          </div>

          {/* TILE 2 — Stat */}
          <div className="bento-tile col-span-12 md:col-span-5 md:row-span-1 relative overflow-hidden rounded-3xl bg-primary text-primary-foreground p-6 sm:p-8 cursor-pointer min-h-[180px] md:min-h-0">
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 text-[10px] font-mono tracking-widest text-primary-foreground/40">/ 02</div>
            <div className="bento-3d">
              <div className="font-display text-[clamp(3.5rem,12vw,6rem)] leading-[0.85]">12K+</div>
              <p className="text-primary-foreground/80 mt-2 text-sm font-medium">Businesses paid faster with Arinvoice this month</p>
            </div>
          </div>

          {/* TILE 3 — CRM */}
          <div className="bento-tile col-span-12 md:col-span-5 md:row-span-2 relative overflow-hidden rounded-3xl bg-card border border-border p-6 sm:p-8 cursor-pointer min-h-[420px] md:min-h-0">
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 text-[10px] font-mono tracking-widest text-muted-foreground">/ 03</div>
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-primary mb-3 sm:mb-4">CRM</div>
            <h3 className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground leading-[0.9] mb-3 sm:mb-4">
              Every client.<br />Remembered.
            </h3>
            <p className="text-muted-foreground text-sm mb-5 sm:mb-6 max-w-xs">A premium dashboard for clients, companies, GST & addresses.</p>
            <div className="bento-3d space-y-2.5 sm:space-y-3">
              {[
                { n: "Acme Corp", t: "₹84,500 · Paid", c: "hsl(16 100% 50%)" },
                { n: "Northwind", t: "₹12,200 · Pending", c: "hsl(40 90% 55%)" },
                { n: "Pixel Forge", t: "₹240 · Paid", c: "hsl(16 100% 50%)" },
              ].map((c) => (
                <div key={c.n} className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-background border border-border">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full grid place-items-center font-display text-sm text-background flex-shrink-0" style={{ background: c.c }}>
                    {c.n[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-foreground truncate">{c.n}</div>
                    <div className="text-xs text-muted-foreground truncate">{c.t}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TILE 4 — Email */}
          <div className="bento-tile col-span-12 sm:col-span-6 md:col-span-4 md:row-span-1 relative overflow-hidden rounded-3xl bg-accent p-6 sm:p-8 cursor-pointer min-h-[140px] md:min-h-0">
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 text-[10px] font-mono tracking-widest text-accent-foreground/50">/ 04</div>
            <div className="bento-3d flex items-center gap-4 h-full">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary grid place-items-center shadow-lg flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7" fill="none">
                  <rect x="3" y="5" width="18" height="14" rx="3" stroke="white" strokeWidth="2" />
                  <path d="M3 7l9 7 9-7" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="font-display text-xl sm:text-2xl text-foreground leading-tight">Free email delivery</div>
                <div className="text-xs text-muted-foreground mt-1">No SMTP. No fees.</div>
              </div>
            </div>
          </div>

          {/* TILE 5 — Templates 3D stack */}
          <div className="bento-tile col-span-6 sm:col-span-6 md:col-span-3 md:row-span-1 relative overflow-hidden rounded-3xl bg-card border border-border p-6 cursor-pointer min-h-[160px] md:min-h-0">
            <div className="absolute top-4 right-4 text-[10px] font-mono tracking-widest text-muted-foreground">/ 05</div>
            <div className="bento-3d relative h-full min-h-[120px] flex items-end">
              <div className="absolute bottom-2 right-1 w-16 h-20 sm:w-20 sm:h-24 rounded-lg bg-foreground rotate-12 shadow-xl" />
              <div className="absolute bottom-4 right-4 w-16 h-20 sm:w-20 sm:h-24 rounded-lg bg-primary -rotate-6 shadow-xl" />
              <div className="absolute bottom-6 right-7 w-16 h-20 sm:w-20 sm:h-24 rounded-lg bg-accent border border-primary/30 rotate-3 shadow-xl" />
              <div className="relative z-10">
                <div className="font-display text-xl sm:text-2xl text-foreground leading-tight">PDF<br />Templates</div>
              </div>
            </div>
          </div>

          {/* TILE 6 — Tax */}
          <div className="bento-tile col-span-6 sm:col-span-6 md:col-span-4 md:row-span-1 relative overflow-hidden rounded-3xl bg-foreground text-background p-6 sm:p-8 cursor-pointer min-h-[160px] md:min-h-0">
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 text-[10px] font-mono tracking-widest text-background/40">/ 06</div>
            <div className="bento-3d">
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
                {["GST", "CGST", "SGST", "IGST", "TDS"].map((t) => (
                  <span key={t} className="px-2 sm:px-2.5 py-1 rounded-full bg-primary/20 border border-primary/40 text-primary text-[9px] sm:text-[10px] font-bold">
                    {t}
                  </span>
                ))}
              </div>
              <div className="font-display text-2xl sm:text-3xl leading-tight">Tax-ready,<br />out of the box.</div>
            </div>
          </div>

          {/* TILE 7 — Realtime */}
          <div className="bento-tile col-span-12 md:col-span-8 md:row-span-1 relative overflow-hidden rounded-3xl bg-card border border-border p-6 sm:p-8 cursor-pointer min-h-[200px] md:min-h-0">
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 text-[10px] font-mono tracking-widest text-muted-foreground">/ 07</div>
            <div className="bento-3d flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6 h-full">
              <div>
                <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-primary mb-2 sm:mb-3">Real-time</div>
                <h3 className="font-display text-2xl sm:text-3xl md:text-4xl text-foreground leading-tight">
                  Know the moment <span className="text-primary">they pay.</span>
                </h3>
              </div>
              <div className="flex flex-col gap-2 md:min-w-[200px]">
                {[
                  { l: "Opened", v: "2s ago" },
                  { l: "Scanned QR", v: "just now" },
                  { l: "Paid ₹24,500", v: "live", live: true },
                ].map((n) => (
                  <div key={n.l} className="flex items-center justify-between p-2.5 rounded-lg bg-background border border-border">
                    <span className="text-xs font-semibold text-foreground">{n.l}</span>
                    <span className={`text-[10px] font-mono ${n.live ? "text-primary" : "text-muted-foreground"}`}>
                      {n.live && <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mr-1 animate-pulse" />}
                      {n.v}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
