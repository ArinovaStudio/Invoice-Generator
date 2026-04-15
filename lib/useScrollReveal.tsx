"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "./gsapConfig";

export const useScrollReveal = () => {
  const sectionRef = useRef(null);
  const wordsRef = useRef([]);

  useEffect(() => {
    gsap.to(wordsRef.current, {
      color: "black",
      stagger: 0.05,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom center",
        scrub: true,
      },
    });
  }, []);
  return { wordsRef, sectionRef };
};
