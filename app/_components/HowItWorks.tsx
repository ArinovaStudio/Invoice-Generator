"use client";
import React, { useEffect, useRef, useState } from "react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import Image from "next/image";
import { motion } from "framer-motion";
const steps = [
  {
    title: "Step 1",
    description:
      "Select the color theme and invoice format (Standard, Spreadsheet, or Compact) and upload your business logo.",
  },
  {
    title: "Step 2",
    description:
      "Enter your business details including name, address, and contact information.",
  },
  {
    title: "Step 3",
    description:
      "Add products or services, quantities, pricing, and applicable taxes.",
  },
  {
    title: "Step 4",
    description:
      "Review the invoice and send it to your customer or download it as a PDF.",
  },
];

export default function HowItWorks() {
  const { wordsRef, sectionRef } = useScrollReveal();
  const [activeIndex, setActiveIndex] = useState(0);
  const n = steps.length;
  const [cycle, setCycle] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        if (prev === n - 1) {
          setCycle((c) => c + 1); // 👈 trigger reset
          return 0;
        }
        return prev + 1;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);
  const text = `An invoice is a statement delivered to a buyer to tell them what they owe for a good or service. It contains all the necessary information relating to a purchase, such as the seller's and buyer's information, products purchased and their prices, the payment due date, and other relevant information. Maintaining invoices helps businesses stay transparent with their customers about their pricing and payment expectations. It not only helps them track income but also comes in handy when filing taxes.`;
  return (
    <div className="max-w-5xl py-14 mx-auto ">
      <div ref={sectionRef} className="space-y-4">
        <h1 className="text-3xl font-semibold">What is an invoice?</h1>
        <p className="text-2xl leading-relaxed">
          {text.split(" ").map((word, i) => (
            <span
              key={i}
              ref={(el) => ((wordsRef as any).current[i] = el) as any}
              className="text-foreground/30 mr-2 inline-block"
            >
              {word}
            </span>
          ))}
        </p>
      </div>
      <div className="grid md:grid-cols-2 mt-30">
        <div className="grid pr-8 gap-5">
          <h2 className="text-4xl font-thin">
            How to create an invoice using an invoice generator
          </h2>
          <p>
            Creating professional invoices with a free invoice generator is now
            easy. Follow these steps to create an invoice that aligns with your
            brand identity.
          </p>
          <div className="w-full relative h-[500px]">
            <Image src={"/steps.png"} alt={"Loading..."} fill />
          </div>
        </div>
        <div className="h-full h-[500px] flex flex-col justify-center">
          {steps.map((step, idx) => {
            return (
              <div
                key={idx}
                className={`relative flex-1 flex-col px-5 border-l ${
                  idx < n - 1 && "border-b"
                } flex items-start gap-5 justify-center`}
              >
                {idx === 0 && (
                  <span
                    className={`absolute h-3 w-3 rounded-full bg-[#0075ff] top-[-6px] left-[-5px]`}
                  />
                )}
                <span
                  className={`text-md font-medium ${
                    idx === activeIndex
                      ? `bg-[#0075ff]! text-white`
                      : "bg-gray-200"
                  } px-8 py-3 rounded-full`}
                >
                  {step.title}
                </span>
                {idx === activeIndex && <p>{step.description}</p>}
                <span
                  className={`absolute h-3 w-3 z-11 rounded-full ${
                    idx <= activeIndex ? `bg-[#0075ff]` : "bg-gray-200"
                  } bottom-[-6px] left-[-5px]`}
                />
                {idx <= activeIndex && (
                  <motion.span
                    key={`${idx}-${cycle}`} // 👈 resets when loop restarts
                    className="absolute top-0 left-0 w-[2px] h-full bg-[#0075ff] origin-top"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{
                      duration: idx === activeIndex ? 3 : 0,
                      ease: "linear",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
