"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SITE_CONFIG } from "@/lib/constants";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { motion, AnimatePresence } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const ROTATING_WORDS = [
  { text: "think", color: "text-accent-amber" },
  { text: "scale", color: "text-accent-red" },
  { text: "ship", color: "text-accent-amber" },
  { text: "learn", color: "text-foreground/60" },
];

function RotatingWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % ROTATING_WORDS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-block relative w-[4.5ch] text-left">
      <AnimatePresence mode="wait">
        <motion.span
          key={ROTATING_WORDS[index].text}
          initial={{ y: 30, opacity: 0, rotateX: -40 }}
          animate={{ y: 0, opacity: 1, rotateX: 0 }}
          exit={{ y: -30, opacity: 0, rotateX: 40 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={`inline-block ${ROTATING_WORDS[index].color}`}
          style={{ perspective: "400px" }}
        >
          {ROTATING_WORDS[index].text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const reducedMotion = useReducedMotion();

  // Magnetic scatter effect on name hover
  const handleNameMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (reducedMotion || !nameRef.current) return;
      const chars = nameRef.current.querySelectorAll(".hero-char");
      const rect = nameRef.current.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      chars.forEach((char) => {
        const charRect = (char as HTMLElement).getBoundingClientRect();
        const cx = charRect.left + charRect.width / 2 - rect.left;
        const cy = charRect.top + charRect.height / 2 - rect.top;
        const dx = cx - mx;
        const dy = cy - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 150;

        if (dist < maxDist) {
          const force = (1 - dist / maxDist) * 12;
          const angle = Math.atan2(dy, dx);
          gsap.to(char, {
            x: Math.cos(angle) * force,
            y: Math.sin(angle) * force,
            duration: 0.3,
            ease: "power2.out",
          });
        } else {
          gsap.to(char, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" });
        }
      });
    },
    [reducedMotion]
  );

  const handleNameMouseLeave = useCallback(() => {
    if (!nameRef.current) return;
    const chars = nameRef.current.querySelectorAll(".hero-char");
    chars.forEach((char) => {
      gsap.to(char, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
    });
  }, []);

  useEffect(() => {
    if (reducedMotion || !contentRef.current || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (nameRef.current) {
        const chars = nameRef.current.querySelectorAll(".hero-char");
        gsap.fromTo(
          chars,
          { opacity: 0, y: 60, rotateX: -60 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: "power4.out",
            delay: 0.2,
          }
        );
      }

      gsap.to(contentRef.current, {
        y: -150,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });
    });

    return () => ctx.revert();
  }, [reducedMotion]);

  const nameChars = SITE_CONFIG.name.split("");

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] flex items-center justify-center overflow-hidden"
    >
      <div ref={contentRef} className="text-center z-10 px-6 max-w-5xl mx-auto">
        {/* Giant name — magnetic scatter on hover */}
        <h1
          ref={nameRef}
          className="text-display leading-none select-none cursor-default"
          style={{ perspective: "800px" }}
          onMouseMove={handleNameMouseMove}
          onMouseLeave={handleNameMouseLeave}
        >
          {nameChars.map((char, i) => (
            <span
              key={i}
              className={`hero-char inline-block ${
                reducedMotion ? "" : "opacity-0"
              } ${
                i % 2 === 0
                  ? "text-stroke text-6xl sm:text-7xl md:text-[10rem] lg:text-[12rem]"
                  : "text-6xl sm:text-7xl md:text-[10rem] lg:text-[12rem] text-accent-amber"
              }`}
              style={{ transformOrigin: "center bottom" }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>

        {/* Title */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="font-serif-display italic text-2xl sm:text-3xl md:text-4xl text-foreground/70 mt-4 md:mt-6 tracking-tight"
        >
          {SITE_CONFIG.title}
        </motion.p>

        {/* Tagline with rotating word */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.2 }}
          className="text-sm md:text-base font-mono text-muted/40 mt-3 md:mt-5 max-w-lg mx-auto tracking-wide leading-relaxed"
        >
          I build things that <RotatingWord />
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="mt-8 md:mt-12 flex items-center justify-center gap-4"
        >
          <a
            href="#projects"
            className="group px-6 py-3 rounded-full bg-accent-amber/10 border border-accent-amber/30 text-accent-amber text-sm font-mono hover:bg-accent-amber/20 hover:border-accent-amber/50 transition-all active:scale-95"
          >
            View Work
            <span className="inline-block ml-1 group-hover:translate-x-1 transition-transform duration-300">
              →
            </span>
          </a>
          <a
            href="#contact"
            className="px-6 py-3 rounded-full border border-border text-muted text-sm font-mono hover:border-border-hover hover:text-foreground transition-all active:scale-95"
          >
            Say Hello
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="mt-14 md:mt-24"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-px h-8 mx-auto bg-gradient-to-b from-transparent to-muted/20" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
