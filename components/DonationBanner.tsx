"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

const amounts = [
  { value: "₹99", label: "Coffee" },
  { value: "₹299", label: "Lunch", popular: true },
  { value: "₹999", label: "Sponsor" },
];

const DonationBanner = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const jarRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState(1);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        // Idle float on the jar
        gsap.to(".db-jar-img", {
          y: -14,
          duration: 3.2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });

        // Floating coins drift
        gsap.utils.toArray<HTMLElement>(".db-coin").forEach((c, i) => {
          gsap.to(c, {
            y: -8 - (i % 3) * 4,
            x: (i % 2 ? 1 : -1) * 6,
            rotation: (i % 2 ? 1 : -1) * 12,
            duration: 2.6 + i * 0.3,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: i * 0.2,
          });
        });

        // Marquee numbers ticker
        gsap.to(".db-tick", {
          xPercent: -50,
          duration: 22,
          ease: "none",
          repeat: -1,
        });
      }, cardRef);

      cleanup = () => ctx.revert();
    })();
    return () => cleanup?.();
  }, []);

  // Mouse parallax on the jar
  useEffect(() => {
    const card = cardRef.current;
    const jar = jarRef.current;
    if (!card || !jar) return;

    const handleMove = (e: MouseEvent) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      jar.style.transform = `translate3d(${x * 18}px, ${y * 18}px, 0) rotate(${x * 4}deg)`;
    };
    const handleLeave = () => {
      jar.style.transform = "translate3d(0,0,0) rotate(0deg)";
    };
    card.addEventListener("mousemove", handleMove);
    card.addEventListener("mouseleave", handleLeave);
    return () => {
      card.removeEventListener("mousemove", handleMove);
      card.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <section className="py-20 sm:py-24 lg:py-32 relative overflow-hidden">
      <div className="max-w-screen">
        <Reveal>
          <div
            ref={cardRef}
            className="relative bg-foreground text-background overflow-hidden border border-foreground"
          >
            {/* Editorial corner labels */}
            <div className="absolute top-5 left-6 sm:top-8 sm:left-10 z-30 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] sm:text-xs font-mono tracking-[0.3em] text-background/60 uppercase">
                ◆ 010 / Support
              </span>
            </div>
            <div className="hidden sm:block absolute top-8 right-10 z-30 text-[10px] font-mono tracking-[0.3em] text-background/40 uppercase">
              Optional · Pay what feels right
            </div>

            {/* Background marquee tickers */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden pointer-events-none select-none opacity-[0.04]">
              <div className="db-tick flex whitespace-nowrap font-display text-[16vw] sm:text-[12vw] leading-none">
                {Array.from({ length: 2 }).map((_, i) => (
                  <span key={i} className="pr-12">
                    THANK YOU · ₹0 FOREVER · BUILT WITH LOVE ·
                  </span>
                ))}
              </div>
            </div>

            {/* Subtle radial glow */}
            <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-primary/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-primary/10 blur-3xl pointer-events-none" />

            <div className="relative grid lg:grid-cols-[1.15fr,1fr] gap-10 lg:gap-12 px-6 sm:px-10 lg:px-16 pt-20 sm:pt-24 pb-10 sm:pb-14">
              {/* LEFT — Editorial copy */}
              <div className="relative z-10">
                <h3 className="font-display text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.92] tracking-tight">
                  If we saved <br />
                  you time, <br />
                  <span className="text-primary">buy us coffee.</span>
                </h3>

                <div className="mt-8 sm:mt-10 max-w-md text-background/70 text-base sm:text-lg leading-relaxed">
                  Arinvoice will always be free — no paywalls, no hidden tiers.
                  We run on the kindness of people who think free tools deserve a
                  fighting chance.
                </div>

                {/* Stats strip */}
                <div className="mt-8 sm:mt-12 grid grid-cols-3 gap-4 sm:gap-8 max-w-md border-t border-background/10 pt-6">
                  <div>
                    <div className="font-display text-2xl sm:text-3xl text-background">100%</div>
                    <div className="text-[10px] sm:text-xs text-background/50 uppercase tracking-widest mt-1">
                      To servers
                    </div>
                  </div>
                  <div>
                    <div className="font-display text-2xl sm:text-3xl text-background">0</div>
                    <div className="text-[10px] sm:text-xs text-background/50 uppercase tracking-widest mt-1">
                      Investors
                    </div>
                  </div>
                  <div>
                    <div className="font-display text-2xl sm:text-3xl text-primary">∞</div>
                    <div className="text-[10px] sm:text-xs text-background/50 uppercase tracking-widest mt-1">
                      Free forever
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT — Jar + amount picker */}
              <div className="relative z-10 flex flex-col">
                {/* Jar visual */}
                <div className="relative h-56 sm:h-72 lg:h-80 mb-6 sm:mb-8">
                  {/* Pedestal ring */}
                  <div className="absolute left-1/2 bottom-2 -translate-x-1/2 w-56 sm:w-72 h-56 sm:h-72 rounded-full border border-background/10" />
                  <div className="absolute left-1/2 bottom-6 -translate-x-1/2 w-40 sm:w-52 h-40 sm:h-52 rounded-full border border-primary/20" />
                  {/* Glow puddle */}
                  <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-48 sm:w-64 h-12 rounded-[50%] bg-primary/30 blur-2xl" />

                  {/* Floating sparkle coins */}
                  <span className="db-coin absolute top-4 left-4 sm:left-8 w-2 h-2 rounded-full bg-primary" />
                  <span className="db-coin absolute top-12 right-6 sm:right-10 w-1.5 h-1.5 rounded-full bg-primary/70" />
                  <span className="db-coin absolute top-20 left-10 sm:left-16 w-1 h-1 rounded-full bg-background/50" />
                  <span className="db-coin absolute bottom-20 right-4 w-2 h-2 rounded-full bg-primary/80" />
                  <span className="db-coin absolute bottom-32 left-2 w-1 h-1 rounded-full bg-background/40" />

                  {/* The jar PNG */}
                  <div
                    ref={jarRef}
                    className="absolute inset-0 transition-transform duration-300 ease-out will-change-transform"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <img
                      src="/donation-jar.png"
                      alt="Tip jar with rupee coins"
                      width={768}
                      height={768}
                      loading="lazy"
                      className="db-jar-img w-full h-full object-contain"
                      style={{
                        filter:
                          "drop-shadow(0 30px 40px hsl(16 100% 50% / 0.35)) drop-shadow(0 10px 20px rgba(0,0,0,0.3))",
                      }}
                    />
                  </div>
                </div>

                {/* Amount picker */}
                <div>
                  <div className="text-[10px] sm:text-xs font-mono tracking-[0.3em] text-background/40 uppercase mb-3">
                    Choose an amount
                  </div>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {amounts.map((a, i) => {
                      const active = selected === i;
                      return (
                        <button
                          key={a.value}
                          onClick={() => setSelected(i)}
                          className={`group relative rounded-2xl border px-3 py-4 sm:py-5 text-left transition-all duration-300 ${
                            active
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-background/15 bg-background/[0.03] hover:border-background/40 hover:bg-background/[0.06] text-background"
                          }`}
                        >
                          {a.popular && (
                            <span
                              className={`absolute -top-2 right-3 text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-full uppercase ${
                                active
                                  ? "bg-background text-foreground"
                                  : "bg-primary text-primary-foreground"
                              }`}
                            >
                              Popular
                            </span>
                          )}
                          <div className="font-display text-2xl sm:text-3xl leading-none">
                            {a.value}
                          </div>
                          <div
                            className={`text-[10px] sm:text-xs font-mono uppercase tracking-widest mt-2 ${
                              active ? "text-primary-foreground/70" : "text-background/50"
                            }`}
                          >
                            {a.label}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* CTA */}
                  <button className="group mt-4 sm:mt-5 w-full inline-flex items-center justify-between gap-3 px-6 py-4 sm:py-5 rounded-2xl bg-primary text-primary-foreground font-bold text-base sm:text-lg hover:bg-primary/90 transition-colors">
                    <span>Send {amounts[selected].value} via UPI</span>
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary-foreground text-primary group-hover:translate-x-1 transition-transform">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M5 12h14M13 6l6 6-6 6"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>

                  <p className="mt-3 text-[11px] sm:text-xs text-background/40 leading-relaxed">
                    Secure UPI · No account needed · Instant receipt
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom strip */}
            <div className="relative z-10 border-t border-background/10 px-6 sm:px-10 lg:px-16 py-4 flex flex-wrap items-center justify-between gap-3 text-[10px] sm:text-xs font-mono tracking-widest text-background/40 uppercase">
              <span>★ ★ ★ ★ ★ &nbsp; Loved by 12,000+ businesses</span>
              <span className="hidden sm:inline">Every rupee goes to keeping this free</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default DonationBanner;
