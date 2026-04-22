"use client";

import { useEffect, useRef } from "react";

const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable on touch devices
    if (typeof window === "undefined") return;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    let cleanup: (() => void) | undefined;
    (async () => {
      const { default: gsap } = await import("gsap");

      const dot = dotRef.current;
      const ring = ringRef.current;
      if (!dot || !ring) return;

      gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });

      const xTo = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3" });
      const yTo = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3" });
      const dxTo = gsap.quickTo(dot, "x", { duration: 0.15, ease: "power3" });
      const dyTo = gsap.quickTo(dot, "y", { duration: 0.15, ease: "power3" });

      const onMove = (e: MouseEvent) => {
        gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
        xTo(e.clientX);
        yTo(e.clientY);
        dxTo(e.clientX);
        dyTo(e.clientY);
      };

      const onLeave = () => gsap.to([dot, ring], { opacity: 0, duration: 0.3 });

      const onOver = (e: MouseEvent) => {
        const t = e.target as HTMLElement;
        if (t.closest("a, button, [role=button], input, textarea, .cursor-pointer")) {
          gsap.to(dot, { scale: 2, backgroundColor: "#000000", mixBlendMode: "differnece", duration: 0.3 });
        } else {
          gsap.to(dot, { scale: 1, backgroundColor: "hsl(16 100% 50%)", duration: 0.3 });
        }
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseover", onOver);
      document.body.addEventListener("mouseleave", onLeave);

      cleanup = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseover", onOver);
        document.body.removeEventListener("mouseleave", onLeave);
      };
    })();
    return () => cleanup?.();
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-9 h-9 rounded-full border-2 border-black pointer-events-none z-[9999] hidden md:block"
        // style={{ mixBlendMode: "difference" }}
      />
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-primary pointer-events-none z-[9999] hidden md:block"
      />
    </>
  );
};

export default CustomCursor;
