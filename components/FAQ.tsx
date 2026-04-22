"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import SplitText from "./SplitText";

const faqs = [
  {
    q: "Is it really free? What's the catch?",
    a: "Yes, truly free. No credit card, no trials, no per-invoice fees. We're building an ecosystem and Arinvoice is our gift to it — always.",
  },
  {
    q: "How does the UPI QR payment work?",
    a: "Add your UPI ID once. Every invoice auto-generates a dynamic QR locked to that invoice's amount. Clients scan from any UPI app — GPay, PhonePe, Paytm — and the money lands in your bank.",
  },
  {
    q: "Can I send invoices over email for free?",
    a: "Absolutely. We deliver invoices straight from Arinvoice to your client's inbox with your branding. No SMTP setup. No fees.",
  },
  {
    q: "Does Arinvoice support GST and TDS?",
    a: "Yes — CGST, SGST, IGST, TDS, multi-currency, custom tax rates. Designed in India, usable globally.",
  },
  {
    q: "Where is my data stored?",
    a: "Encrypted at rest in secure cloud infrastructure. You own it. Export anything, anytime, in CSV or PDF.",
  },
];

const FAQ = () => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 lg:py-32 bg-secondary/40">
      <div className="container max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <Reveal>
            <p className="text-sm font-semibold text-primary uppercase tracking-[0.2em] mb-4">
              ◆ Questions
            </p>
          </Reveal>
          <SplitText
            as="h2"
            text="The honest answers."
            className="font-display text-[clamp(2.5rem,6vw,5rem)] text-foreground text-center"
          />
        </div>

        <div className="space-y-4">
          {faqs.map((f, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div
                className={`rounded-2xl border bg-background transition-all duration-300 ${
                  open === i ? "border-primary shadow-card-soft" : "border-border"
                }`}
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full text-left p-6 md:p-8 flex items-center justify-between gap-6"
                >
                  <span className="font-display text-xl md:text-2xl text-foreground">
                    {f.q}
                  </span>
                  <span
                    className={`flex-shrink-0 w-10 h-10 rounded-full grid place-items-center transition-all duration-300 ${
                      open === i
                        ? "bg-primary text-primary-foreground rotate-45"
                        : "bg-secondary text-foreground"
                    }`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-500 ease-out ${
                    open === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 md:px-8 pb-8 text-muted-foreground text-lg leading-relaxed">
                      {f.a}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
