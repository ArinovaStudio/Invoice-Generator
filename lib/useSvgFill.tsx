"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "./gsapConfig";
export default function useSvgFill() {
const pathRef = useRef(null);

// function you can call anytime
const updateProgress = (progress: number) => {
  gsap.to(pathRef.current, {
    fill: "#2563eb", // blue
    duration: 0.3,
    overwrite: true,
    ease: "none",
    progress: progress, // 👈 THIS is the key
  });
};
  return { updateProgress, pathRef };
}
