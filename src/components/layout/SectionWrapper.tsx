"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface SectionWrapperProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  showDivider?: boolean;
  transition?: "approach" | "rise" | "expand" | "fade";
}

// "approach" — z-axis: starts small + transparent, scales up as you scroll toward it
function ApproachSection({ id, children, className }: { id: string; children: React.ReactNode; className: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.25"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0, 0.5, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [80, 0]);

  return (
    <motion.section
      ref={ref}
      id={id}
      style={{ scale, opacity, y }}
      className={`py-16 md:py-24 px-6 will-change-transform ${className}`}
    >
      <div className="max-w-6xl mx-auto">{children}</div>
    </motion.section>
  );
}

// "rise" — parallax rise from below
function RiseSection({ id, children, className }: { id: string; children: React.ReactNode; className: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.3"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [120, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0, 0.4, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.96, 1]);

  return (
    <motion.section
      ref={ref}
      id={id}
      style={{ y, opacity, scale }}
      className={`py-16 md:py-24 px-6 will-change-transform ${className}`}
    >
      <div className="max-w-6xl mx-auto">{children}</div>
    </motion.section>
  );
}

// "expand" — expands from center
function ExpandSection({ id, children, className }: { id: string; children: React.ReactNode; className: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.35"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.75, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 1], [0, 0.3, 1]);

  return (
    <motion.section
      ref={ref}
      id={id}
      style={{ scale, opacity, transformOrigin: "center center" }}
      className={`py-16 md:py-24 px-6 will-change-transform ${className}`}
    >
      <div className="max-w-6xl mx-auto">{children}</div>
    </motion.section>
  );
}

export default function SectionWrapper({
  id,
  children,
  className = "",
  showDivider = true,
  transition = "approach",
}: SectionWrapperProps) {
  const Section =
    transition === "approach" ? ApproachSection :
    transition === "rise" ? RiseSection :
    transition === "expand" ? ExpandSection :
    null;

  return (
    <>
      {showDivider && (
        <div className="max-w-6xl mx-auto px-6">
          <div className="section-divider" />
        </div>
      )}
      {Section ? (
        <Section id={id} className={className}>{children}</Section>
      ) : (
        <motion.section
          id={id}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={`py-16 md:py-24 px-6 ${className}`}
        >
          <div className="max-w-6xl mx-auto">{children}</div>
        </motion.section>
      )}
    </>
  );
}
