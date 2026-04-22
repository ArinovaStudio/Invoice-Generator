"use client";

import { ElementType, useEffect, useRef } from "react";
import gsap from "gsap";

interface SplitTextProps {
  text: string;
  className?: string;
  as?: ElementType;
  delay?: number;
  stagger?: number;
  trigger?: boolean;
  italic?: boolean;
}

/**
 * SplitText — uses native String.split() to break a string into per-char spans
 * and animates them in with GSAP.
 */
const SplitText = ({
  text,
  className = "",
  as: Tag = "h1",
  delay = 0,
  stagger = 0.035,
  trigger = true,
  italic = false,
}: SplitTextProps) => {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref.current || !trigger) return;
    const chars = ref.current.querySelectorAll<HTMLSpanElement>(".split-char");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        chars,
        { yPercent: 110, opacity: 0, rotate: 6 },
        {
          yPercent: 0,
          opacity: 1,
          rotate: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger,
          delay,
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [text, delay, stagger, trigger]);

  // Use native split() per requirement
  const words = text.split(" ");

  const TagAny = Tag as any;
  return (
    <TagAny ref={ref} className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span
          key={wi}
          className="inline-block overflow-hidden align-bottom"
          style={{ paddingBottom: "0.05em" }}
        >
          {word.split("").map((char, ci) => (
            <span key={ci} className="split-char" aria-hidden>
              {char}
            </span>
          ))}
          {wi < words.length - 1 && (
            <span className="split-char inline-block">&nbsp;</span>
          )}
        </span>
      ))}
    </TagAny>
  );
};

export default SplitText;