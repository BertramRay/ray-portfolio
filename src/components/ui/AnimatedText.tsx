"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

export default function AnimatedText({
  text,
  className = "",
  delay = 0,
  as: Tag = "span",
}: AnimatedTextProps) {
  const containerRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;

    // On mobile, animate as a whole block instead of per-character
    if (isMobile) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay }
      );
      return;
    }

    const chars = containerRef.current.querySelectorAll(".char");
    if (chars.length === 0) return;

    gsap.fromTo(
      chars,
      { opacity: 0, y: 20, rotateX: -40 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.5,
        stagger: 0.025,
        ease: "power3.out",
        delay,
      }
    );
  }, [delay, reducedMotion, isMobile]);

  if (reducedMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  // Mobile: render as single block, no per-character split
  if (isMobile) {
    return (
      <Tag
        ref={containerRef as React.RefObject<HTMLHeadingElement>}
        className={`${className} opacity-0`}
      >
        {text}
      </Tag>
    );
  }

  return (
    <Tag
      ref={containerRef as React.RefObject<HTMLHeadingElement>}
      className={className}
      style={{ perspective: "600px" }}
    >
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="char inline-block opacity-0"
          style={{ transformOrigin: "center bottom" }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </Tag>
  );
}
