"use client";

import { motion } from "framer-motion";

interface SectionWrapperProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  showDivider?: boolean;
  transition?: "clip" | "scale" | "fade" | "wipe";
}

const transitionVariants = {
  clip: {
    initial: { opacity: 0, y: 60, scale: 0.97 },
    animate: { opacity: 1, y: 0, scale: 1 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.88 },
    animate: { opacity: 1, scale: 1 },
  },
  fade: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
  },
  wipe: {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
  },
};

export default function SectionWrapper({
  id,
  children,
  className = "",
  showDivider = true,
  transition = "fade",
}: SectionWrapperProps) {
  const v = transitionVariants[transition];

  return (
    <>
      {showDivider && (
        <div className="max-w-6xl mx-auto px-6">
          <div className="section-divider" />
        </div>
      )}
      <motion.section
        id={id}
        initial={v.initial}
        whileInView={v.animate}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`py-16 md:py-24 px-6 ${className}`}
      >
        <div className="max-w-6xl mx-auto">{children}</div>
      </motion.section>
    </>
  );
}
