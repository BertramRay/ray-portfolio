"use client";

import { useState, useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const LINES = [
  { text: "export const ray = {", delay: 0 },
  { text: '  role: "cofounder & ai eng",', delay: 0 },
  { text: '  company: "AhaCreator",', delay: 0 },
  { text: "  obsessions: [", delay: 0 },
  { text: '    "prompt engineering",', delay: 0 },
  { text: '    "data pipelines",', delay: 0 },
  { text: '    "creative code",', delay: 0 },
  { text: '    "shipping fast",', delay: 0 },
  { text: "  ],", delay: 0 },
  { text: '  motto: "if it can\'t be measured,"', delay: 0 },
  { text: '         "it can\'t be trusted",', delay: 0 },
  { text: "}", delay: 0 },
];

function colorize(text: string) {
  return text
    .replace(
      /(export const|return|await)/g,
      '<span class="text-accent-amber/50">$1</span>'
    )
    .replace(
      /("(?:[^"\\]|\\.)*")/g,
      '<span class="text-accent-red/60">$1</span>'
    )
    .replace(
      /(\{|\}|\[|\]|,|;)/g,
      '<span class="text-muted/25">$1</span>'
    )
    .replace(
      /(ray|role|company|obsessions|motto)/g,
      '<span class="text-foreground/50">$1</span>'
    );
}

export default function TypingTerminal() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [inView, setInView] = useState(false);

  // Intersection observer to start typing when visible
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.3 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || reducedMotion) {
      setVisibleLines(LINES.length);
      setCharIndex(999);
      return;
    }

    if (visibleLines >= LINES.length) return;

    const currentLine = LINES[visibleLines].text;
    if (charIndex < currentLine.length) {
      const timer = setTimeout(() => setCharIndex((c) => c + 1), 25 + Math.random() * 30);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setVisibleLines((l) => l + 1);
        setCharIndex(0);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [inView, visibleLines, charIndex, reducedMotion]);

  return (
    <div ref={containerRef} className="aspect-square max-w-sm mx-auto rounded-2xl bg-card-bg border border-border overflow-hidden relative group">
      {/* Title bar */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-border/30 flex items-center px-4 gap-2 z-10">
        <div className="w-2.5 h-2.5 rounded-full bg-accent-red/40" />
        <div className="w-2.5 h-2.5 rounded-full bg-accent-amber/40" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
        <span className="ml-3 text-[10px] font-mono text-muted/30">
          ray.config.ts
        </span>
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-accent-amber/5 via-transparent to-accent-red/5 group-hover:from-accent-amber/10 group-hover:to-accent-red/10 transition-all duration-700" />

      {/* Code content */}
      <div className="absolute inset-0 pt-12 px-5 pb-6 overflow-hidden">
        <div className="space-y-1 font-mono text-[11px] leading-[1.7]">
          {LINES.map((line, i) => {
            if (i > visibleLines) return null;
            const isCurrentLine = i === visibleLines;
            const displayText = isCurrentLine
              ? line.text.slice(0, charIndex)
              : line.text;

            return (
              <div key={i} className="flex">
                <span className="text-muted/15 w-6 shrink-0 text-right mr-3 select-none">
                  {i + 1}
                </span>
                <span
                  dangerouslySetInnerHTML={{ __html: colorize(displayText) }}
                />
                {isCurrentLine && charIndex < line.text.length && (
                  <span className="text-accent-amber animate-pulse">▌</span>
                )}
              </div>
            );
          })}
          {visibleLines >= LINES.length && (
            <div className="flex mt-1">
              <span className="text-muted/15 w-6 shrink-0 text-right mr-3 select-none">
                {LINES.length + 1}
              </span>
              <span className="text-accent-amber/40 animate-pulse">▌</span>
            </div>
          )}
        </div>
      </div>

      {/* Corner accents */}
      <div className="absolute top-12 left-3 w-4 h-4 border-l border-t border-accent-amber/10 group-hover:border-accent-amber/20 transition-colors duration-500" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-r border-b border-accent-amber/10 group-hover:border-accent-amber/20 transition-colors duration-500" />
    </div>
  );
}
