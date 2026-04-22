"use client";

import { useEffect, useRef } from "react";

const InvoiceIllustration = () => {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    (async () => {
      const { default: gsap } = await import("gsap");
      if (!wrapRef.current) return;

      const ctx = gsap.context(() => {
        // Entrance
        gsap.from(".pi-card", {
          y: 80,
          opacity: 0,
          rotate: (i) => [-6, 4, -3][i] || 0,
          duration: 1.2,
          stagger: 0.15,
          ease: "expo.out",
          delay: 0.3,
        });
        gsap.from(".pi-line", {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.8,
          stagger: 0.05,
          ease: "power3.out",
          delay: 1,
        });
        gsap.from(".pi-pop", {
          scale: 0,
          opacity: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "back.out(2)",
          delay: 1.2,
        });
        gsap.from(".pi-tick", {
          strokeDashoffset: 60,
          duration: 0.6,
          ease: "power2.out",
          delay: 1.7,
        });

        // Floating idle
        gsap.to(".pi-float-a", { y: -14, duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 2 });
        gsap.to(".pi-float-b", { y: -10, duration: 5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 2.2 });
        gsap.to(".pi-float-c", { y: -8, duration: 6, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 2.4 });

        // Mouse parallax
        const wrap = wrapRef.current!;
        const onMove = (e: MouseEvent) => {
          const r = wrap.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          gsap.to(".pi-float-a", { x: x * 22, rotate: x * 2, duration: 0.8, ease: "power2.out", overwrite: "auto" });
          gsap.to(".pi-float-b", { x: x * -16, rotate: x * -2, duration: 0.8, ease: "power2.out", overwrite: "auto" });
          gsap.to(".pi-float-c", { x: x * 14, rotate: x * 1.5, duration: 0.8, ease: "power2.out", overwrite: "auto" });
          gsap.to(".pi-orbit", { x: x * 30, y: y * 30, duration: 1, ease: "power2.out", overwrite: "auto" });
        };
        wrap.addEventListener("mousemove", onMove);
        return () => wrap.removeEventListener("mousemove", onMove);
      }, wrapRef);

      cleanup = () => ctx.revert();
    })();
    return () => cleanup?.();
  }, []);

  return (
    <div ref={wrapRef} className="relative w-full max-w-[640px] mx-auto aspect-square">
      {/* Background ornaments */}
      <div className="pi-orbit absolute inset-0 -z-10">
        <div className="absolute top-[8%] left-[6%] w-40 h-40 rounded-full border border-primary/30" />
        <div className="absolute top-[14%] left-[12%] w-28 h-28 rounded-full border border-primary/20" />
        <div className="absolute bottom-[10%] right-[8%] w-56 h-56 rounded-full bg-primary/5 blur-2xl" />
      </div>

      {/* BIG number in background */}
      <div className="pi-pop absolute top-[2%] right-[2%] font-display text-[clamp(8rem,18vw,14rem)] leading-none text-foreground/[0.04] select-none pointer-events-none">
        ₹
      </div>

      {/* Status pill — top */}
      <div className="pi-card pi-float-a absolute top-[4%] left-[4%] bg-foreground text-background rounded-2xl px-5 py-3 shadow-card-soft flex items-center gap-3 will-change-transform">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
        </span>
        <span className="font-mono text-[11px] tracking-widest uppercase">Live · Paid</span>
      </div>

      {/* Main invoice card */}
      <div className="pi-card pi-float-b absolute top-[14%] left-1/2 -translate-x-1/2 w-[78%] bg-background rounded-3xl border border-border shadow-card-soft overflow-hidden will-change-transform">
        {/* Header */}
        <div className="bg-foreground text-background px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary grid place-items-center font-display text-sm">A</div>
            <span className="font-display text-base">Arinvoice</span>
          </div>
          <span className="font-mono text-[10px] tracking-widest text-background/60">INV-0042</span>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Amount due</span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-primary">Apr 19</span>
          </div>
          <div className="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-none text-foreground tracking-tight">
            ₹24,500
          </div>

          <div className="pi-line h-px bg-border my-5 origin-left" />

          {/* Line items */}
          <div className="space-y-2.5">
            {[
              { l: "Brand identity sprint", v: "₹18,000" },
              { l: "UI design — 4 screens", v: "₹6,000" },
              { l: "GST (18%)", v: "₹500" },
            ].map((row, i) => (
              <div key={i} className="pi-line flex items-center justify-between text-sm origin-left">
                <span className="text-muted-foreground">{row.l}</span>
                <span className="font-semibold text-foreground tabular-nums">{row.v}</span>
              </div>
            ))}
          </div>

          {/* QR row */}
          <div className="pi-line mt-6 pt-5 border-t border-border flex items-center gap-4 origin-left">
            <div className="pi-pop w-16 h-16 rounded-xl bg-foreground p-2 grid grid-cols-4 grid-rows-4 gap-[2px] flex-shrink-0">
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-[1px] ${[0, 1, 4, 3, 6, 9, 10, 12, 15, 14].includes(i) ? "bg-background" : "bg-foreground"}`}
                />
              ))}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-display text-lg text-foreground leading-tight">Scan to pay</div>
              <div className="text-[11px] text-muted-foreground font-mono uppercase tracking-wider mt-1">
                UPI · GPay · PhonePe
              </div>
            </div>
            <div className="pi-pop w-9 h-9 rounded-full bg-primary grid place-items-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  className="pi-tick"
                  d="M5 13l4 4L19 7"
                  stroke="hsl(var(--primary-foreground))"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="60"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom payment notification card */}
      <div className="pi-card pi-float-c absolute bottom-[4%] right-[2%] w-[64%] bg-foreground text-background rounded-2xl p-5 shadow-card-soft will-change-transform">
        <div className="flex items-start gap-3">
          <div className="pi-pop w-10 h-10 rounded-xl bg-primary grid place-items-center flex-shrink-0 font-display text-lg text-primary-foreground">
            ₹
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-mono uppercase tracking-widest text-primary mb-1">Payment received</div>
            <div className="font-display text-2xl leading-none">+ ₹24,500</div>
            <div className="text-[11px] text-background/60 mt-1.5 truncate">via UPI · 2 sec ago</div>
          </div>
        </div>
        {/* Mini chart */}
        <div className="mt-4 flex items-end gap-1 h-8">
          {[40, 65, 50, 80, 60, 95, 75, 100].map((h, i) => (
            <div
              key={i}
              className="pi-pop flex-1 bg-primary rounded-sm origin-bottom"
              style={{ height: `${h}%`, opacity: 0.4 + (i / 8) * 0.6 }}
            />
          ))}
        </div>
      </div>

      {/* Floating ₹ badges */}
      <div className="pi-pop pi-float-a absolute top-[28%] -left-2 w-12 h-12 rounded-full bg-primary text-primary-foreground grid place-items-center font-display text-xl shadow-glow">
        ₹
      </div>
      <div className="pi-pop pi-float-c absolute top-[60%] -right-3 w-10 h-10 rounded-full bg-foreground text-background grid place-items-center font-display text-base">
        ✦
      </div>
    </div>
  );
};

export default InvoiceIllustration;
