"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionWrapper from "@/components/layout/SectionWrapper";
import { SKILL_CATEGORIES } from "@/lib/constants";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

const ROW_1 = [
  "Python", "TypeScript", "MongoDB", "FastAPI", "Next.js",
  "Prompt Engineering", "LLM Integration", "React", "Redis", "Docker",
];
const ROW_2 = [
  "PostgreSQL", "Node.js", "AWS S3", "AI SDK", "Data Pipeline",
  "RAG Systems", "Go", "GLSL", "Tailwind CSS", "Three.js",
];
const ROW_3 = [
  "Vercel", "Railway", "Multi-modal AI", "SQL", "JavaScript",
  "FFmpeg", "S3", "Scrapy", "GSAP", "WebGL",
];

function MarqueeRow({
  items,
  reverse = false,
  speed = "normal",
}: {
  items: string[];
  reverse?: boolean;
  speed?: "slow" | "normal" | "fast";
}) {
  const doubled = [...items, ...items];
  const animClass = reverse ? "animate-marquee-reverse" : "animate-marquee";
  const duration = speed === "slow" ? "40s" : speed === "fast" ? "25s" : "30s";

  return (
    <div className="overflow-hidden relative group">
      <div
        className={`flex gap-6 md:gap-10 whitespace-nowrap ${animClass}`}
        style={{ animationDuration: duration }}
      >
        {doubled.map((skill, i) => (
          <span
            key={`${skill}-${i}`}
            className={`inline-block text-2xl md:text-4xl font-serif-display italic transition-colors duration-300 select-none cursor-default ${
              i % 2 === 0
                ? "text-accent-amber/50 hover:text-accent-amber"
                : "text-stroke hover:text-foreground/50"
            }`}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

// Canvas-based thread convergence
function ThreadCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const reducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (reducedMotion || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Thread source points — scattered across top edge
    const THREAD_COUNT = 40;
    const threads: { sx: number; sy: number; color: string; speed: number; width: number }[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const rect = containerRef.current!.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);

      // Regenerate thread positions
      threads.length = 0;
      for (let i = 0; i < THREAD_COUNT; i++) {
        threads.push({
          sx: Math.random() * rect.width,
          sy: Math.random() * 60,
          color:
            i % 3 === 0
              ? "rgba(245, 158, 11, VAR)"  // amber
              : i % 3 === 1
              ? "rgba(255, 107, 107, VAR)"  // red
              : "rgba(161, 161, 170, VAR)",  // muted
          speed: 0.7 + Math.random() * 0.6,
          width: 0.5 + Math.random() * 1,
        });
      }
    };
    resize();
    window.addEventListener("resize", resize);

    // ScrollTrigger to drive progress
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 80%",
      end: "bottom 30%",
      scrub: 0.3,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        setIsVisible(self.progress > 0.01);
      },
    });

    // Animation loop
    let raf: number;
    const draw = () => {
      if (!ctx || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const p = progressRef.current;

      ctx.clearRect(0, 0, w, h);

      // Target point — above the text
      const tx = w / 2;
      const ty = h * 0.7;

      threads.forEach((t) => {
        const tp = Math.min(1, p * t.speed * 1.5);
        if (tp <= 0) return;

        const alpha = tp * 0.35;
        const color = t.color.replace("VAR", String(alpha));

        // Current endpoint along the path
        const cx = t.sx + (tx - t.sx) * tp;
        const cy = t.sy + (ty - t.sy) * tp;

        // Bezier control point for organic curve
        const cpx = t.sx + (tx - t.sx) * 0.3 + Math.sin(t.sx * 0.01) * 60;
        const cpy = t.sy + (ty - t.sy) * 0.5;

        ctx.beginPath();
        ctx.moveTo(t.sx, t.sy);
        ctx.quadraticCurveTo(cpx, cpy, cx, cy);
        ctx.strokeStyle = color;
        ctx.lineWidth = t.width * tp;
        ctx.stroke();

        // Glow dot at current tip
        if (tp > 0.1 && tp < 0.95) {
          ctx.beginPath();
          ctx.arc(cx, cy, 1.5 * tp, 0, Math.PI * 2);
          ctx.fillStyle = color.replace(String(alpha), String(alpha * 2));
          ctx.fill();
        }
      });

      // Glow at convergence point
      if (p > 0.4) {
        const glowAlpha = (p - 0.4) * 1.2;
        const gradient = ctx.createRadialGradient(tx, ty, 0, tx, ty, 40);
        gradient.addColorStop(0, `rgba(245, 158, 11, ${glowAlpha * 0.3})`);
        gradient.addColorStop(1, "rgba(245, 158, 11, 0)");
        ctx.beginPath();
        ctx.arc(tx, ty, 40, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      trigger.kill();
      window.removeEventListener("resize", resize);
    };
  }, [reducedMotion]);

  return (
    <div ref={containerRef} className="relative h-[60vh] md:h-[70vh]">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      {/* Claude Code text — below convergence point */}
      <motion.div
        className="absolute left-0 right-0 flex flex-col items-center"
        style={{ top: "78%", transform: "translateY(-50%)" }}
        initial={false}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <p className="font-serif-display italic text-base md:text-lg text-accent-amber/50 mb-1">
            now I stand with
          </p>
          <h3 className="text-4xl md:text-6xl font-bold tracking-tight">
            <span className="text-stroke font-serif-display italic">Claude</span>{" "}
            <span className="text-accent-amber">Code</span>
          </h3>
        </div>
      </motion.div>
    </div>
  );
}

export default function Skills() {
  return (
    <SectionWrapper id="skills" transition="rise">
      <div className="mb-12 md:mb-16">
        <span className="eyebrow">Technologies</span>
        <h2 className="text-3xl md:text-5xl font-bold mt-2 leading-tight">
          Tech{" "}
          <span className="font-serif-display italic text-stroke">Stack</span>
        </h2>
        <p className="text-muted/40 mt-3 text-sm max-w-md">
          Daily drivers and occasional weapons.
        </p>
      </div>

      {/* Marquee rows */}
      <div className="space-y-6 md:space-y-8 -mx-6 md:-mx-12">
        <MarqueeRow items={ROW_1} />
        <MarqueeRow items={ROW_2} reverse speed="slow" />
        <MarqueeRow items={ROW_3} speed="fast" />
      </div>

      {/* Thread convergence to Claude Code */}
      <ThreadCanvas />

      {/* Category breakdown */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        {SKILL_CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="space-y-3"
          >
            <h3 className="text-xs font-mono text-accent-amber/40 tracking-wider uppercase">
              {cat.name}
            </h3>
            <ul className="space-y-1.5">
              {cat.skills.map((s) => (
                <li key={s.name} className="text-sm text-muted/60 flex items-center gap-2">
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      s.level === "Primary"
                        ? "bg-accent-amber/60"
                        : s.level === "Proficient"
                        ? "bg-accent-red/40"
                        : "bg-muted/20"
                    }`}
                  />
                  <span className={s.level === "Primary" ? "text-foreground/70" : ""}>
                    {s.name}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
