"use client";

import { useEffect, useRef } from "react";
import Reveal from "./Reveal";
import SplitText from "./SplitText";

const integrations = [
  { name: "UPI", desc: "GPay, PhonePe, Paytm — every QR works", icon: "◆" },
  { name: "Gmail", desc: "Send invoices from your own address", icon: "✉" },
  { name: "WhatsApp", desc: "One-tap share to any client", icon: "✦" },
  { name: "Razorpay", desc: "Cards, netbanking, wallets", icon: "●" },
  // { name: "Stripe", desc: "International payments, multi-currency", icon: "◇" },
  // { name: "Tally", desc: "Export ledger entries in one click", icon: "▲" },
  // { name: "Zapier", desc: "Connect to 5,000+ apps", icon: "⬢" },
  // { name: "Slack", desc: "Payment alerts in your channel", icon: "◉" },
];

const Integrations = () => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        gsap.from(".int-card", {
          y: 80,
          opacity: 0,
          rotateX: -30,
          duration: 1,
          stagger: { each: 0.06, from: "start" },
          ease: "expo.out",
          scrollTrigger: { trigger: ".int-grid", start: "top 80%" },
        });

        // Mouse parallax on cards
        gsap.utils.toArray<HTMLElement>(".int-card").forEach((card) => {
          const onMove = (e: MouseEvent) => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            gsap.to(card, { rotateY: x * 14, rotateX: -y * 14, duration: 0.5, ease: "power2.out", transformPerspective: 800 });
            gsap.to(card.querySelector(".int-icon"), { x: x * 18, y: y * 18, duration: 0.5, ease: "power2.out" });
          };
          const onLeave = () => {
            gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: "power2.out" });
            gsap.to(card.querySelector(".int-icon"), { x: 0, y: 0, duration: 0.6, ease: "power2.out" });
          };
          card.addEventListener("mousemove", onMove);
          card.addEventListener("mouseleave", onLeave);
        });
      }, ref);
      cleanup = () => ctx.revert();
    })();
    return () => cleanup?.();
  }, []);

  return (
    <section ref={ref} className="py-24 lg:py-40 bg-background relative">
      <div className="container max-w-7xl mx-auto px-6">
        <div className="max-w-4xl mb-16">
          <Reveal>
            <p className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-6">◆ 004 / Stack</p>
          </Reveal>
          <SplitText
            as="h2"
            text="Plays nice"
            className="font-display text-[clamp(3rem,9vw,8rem)] text-foreground leading-[0.9]"
          />
          <SplitText
            as="h2"
            text="with everything."
            className="font-display text-[clamp(3rem,9vw,8rem)] text-foreground/15 leading-[0.9] -mt-2"
            delay={0.3}
          />
          <Reveal delay={0.4}>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mt-8">
              Connect Arinvoice to the tools you already use. No middleware, no monthly fees.
            </p>
          </Reveal>
        </div>

        <div className="int-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-4 lg:gap-10" style={{ perspective: "1200px" }}>
          {integrations.map((i) => (
            <div
              key={i.name}
              className="int-card group relative bg-secondary/40 hover:bg-foreground hover:text-background border border-border rounded-2xl p-6 lg:p-8 cursor-pointer transition-colors duration-500 will-change-transform"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="int-icon font-display text-5xl lg:text-6xl text-primary mb-6 group-hover:scale-110 transition-transform">
                {i.icon}
              </div>
              <div className="font-display text-2xl lg:text-3xl mb-2">{i.name}</div>
              <div className="text-sm text-muted-foreground group-hover:text-background/60 transition-colors">{i.desc}</div>
              <div className="absolute top-4 right-4 text-[10px] font-mono text-muted-foreground group-hover:text-background/40">
                0{integrations.indexOf(i) + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Integrations;
