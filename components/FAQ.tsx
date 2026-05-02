"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import SplitText from "./SplitText";

const faqs = [
  {
    q: "Can I create an invoice without login or signup?",
    a: "Yes, you can create invoices instantly without signing up. Just enter your details, generate the invoice, and download or share it.",
  },
  {
    q: "Is this invoice generator mobile-friendly?",
    a: "Yes, Arinvoice works smoothly on mobile, tablet, and desktop. You can create and send invoices from anywhere.",
  },
  {
    q: "Can I customize my invoice design?",
    a: "Yes, you can customize fields like business details, items, taxes, and notes. Future updates may include advanced branding options.",
  },
  {
    q: "What types of businesses can use this invoice generator?",
    a: "Freelancers, agencies, startups, and small businesses in India can use Arinvoice to create professional invoices.",
  },
  {
    q: "Can I add multiple items and taxes in an invoice?",
    a: "Yes, you can add multiple line items, apply different tax rates, and calculate totals automatically.",
  },
  {
    q: "Does Arinvoice support multi-currency invoices?",
    a: "Yes, you can create invoices in different currencies based on your client requirements.",
  },
  {
    q: "How do I send invoices to clients?",
    a: "You can download the invoice as a PDF or share it directly via email or messaging apps.",
  },
  {
    q: "Is this better than using Excel or Word for invoices?",
    a: "Yes, Arinvoice automates calculations, generates professional PDFs, and reduces manual errors compared to Excel or Word.",
  },
  {
    q: "Can I use this invoice generator for international clients?",
    a: "Yes, you can create invoices for international clients with custom currency and details.",
  },
  {
    q: "Will my invoices look professional?",
    a: "Yes, invoices are designed with a clean and professional layout suitable for clients and businesses.",
  },
  {
    q: "Can I reuse or duplicate invoices?",
    a: "Currently, you can recreate invoices easily. Future updates may include duplication and history features.",
  },
  {
    q: "Is Arinvoice suitable for small businesses in India?",
    a: "Yes, it is designed specifically for small businesses, freelancers, and startups in India.",
  },
  {
    q: "Does it calculate totals automatically?",
    a: "Yes, totals, taxes, and final amounts are calculated automatically to save time and reduce errors.",
  },
  {
    q: "Do I need technical knowledge to use this tool?",
    a: "No, Arinvoice is simple and beginner-friendly. Anyone can create invoices in seconds.",
  },
  {
    q: "Is my data stored or saved permanently?",
    a: "No, we minimize data storage. Your invoice data is processed securely and not stored unnecessarily.",
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
