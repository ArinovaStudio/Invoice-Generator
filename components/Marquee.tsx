"use client";

import Reveal from "./Reveal";

const logos = [
  "ACME CORP",
  "NORTHWIND",
  "PIXEL FORGE",
  "STELLAR LABS",
  "MONSOON & CO",
  "BLUEPRINT",
  "OAKWOOD",
  "VERTEX",
];

const Marquee = () => {
  return (
    <Reveal className="py-16 border-y border-border bg-background">
      <div className="container max-w-6xl mx-auto px-6">
        <p className="text-center text-xs uppercase tracking-[0.3em] text-muted-foreground font-semibold mb-10">
          Loved by 12,000+ freelancers, agencies & SMBs
        </p>
        <div className="relative overflow-hidden">
          <div className="flex gap-16 animate-marquee w-max">
            {[...logos, ...logos].map((logo, i) => (
              <span
                key={i}
                className="font-display text-3xl md:text-4xl text-muted-foreground/40 hover:text-primary transition-colors whitespace-nowrap"
              >
                {logo}
              </span>
            ))}
          </div>
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent" />
        </div>
      </div>
    </Reveal>
  );
};

export default Marquee;
