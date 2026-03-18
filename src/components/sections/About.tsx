"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import SectionWrapper from "@/components/layout/SectionWrapper";
import TypingTerminal from "@/components/ui/TypingTerminal";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const duration = 1500;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    tick();
  }, [started, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function About() {
  return (
    <SectionWrapper id="about" transition="approach">
      <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-5"
        >
          <div>
            <span className="eyebrow">Who I Am</span>
            <h2 className="text-3xl md:text-5xl font-bold mt-2 leading-tight">
              About{" "}
              <span className="font-serif-display italic text-stroke">Me</span>
            </h2>
          </div>
          <p className="text-muted leading-[1.8]">
            Cofounded{" "}
            <a href="https://aha.inc" target="_blank" rel="noopener noreferrer"
              className="text-accent-amber hover:text-accent-red link-animated transition-colors">
              AhaCreator
            </a>
            . I build the AI pipelines that score millions of creators
            and the eval frameworks that keep the AI honest.
          </p>
          <p className="text-muted leading-[1.8]">
            Obsessed with prompt engineering at scale — if it
            can&apos;t be measured, it can&apos;t be trusted.
            Off-hours: GLSL shaders, crypto viz, and whatever AI
            paper just dropped.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { value: 5, suffix: "M+", label: "Creators" },
              { value: 140, suffix: "+", label: "Countries" },
              { value: 3, suffix: "", label: "Platforms" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-accent-amber/80 font-mono tabular-nums">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-[10px] font-mono text-muted/40 mt-1 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative"
        >
          <TypingTerminal />
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
