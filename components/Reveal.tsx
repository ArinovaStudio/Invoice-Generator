"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

const Reveal = ({ children, className = "", delay = 0, y = 40 }: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const pathName = usePathname();
  const paths = ["/"];
  useEffect(() => {
    if(!paths.includes(pathName)) return;
    let cleanup: (() => void) | undefined;
    (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (!ref.current) return;

      const ctx = gsap.context(() => {
        gsap.fromTo(
          ref.current,
          { y, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "expo.out",
            delay,
            scrollTrigger: {
              trigger: ref.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }, ref);

      cleanup = () => ctx.revert();
    })();
    return () => cleanup?.();
  }, [delay, y,pathName]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default Reveal;
