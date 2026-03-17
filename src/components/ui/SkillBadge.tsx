"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SkillBadgeProps {
  name: string;
  level: "Primary" | "Proficient" | "Familiar";
  index: number;
}

const levelStyles = {
  Primary:
    "border-accent-amber/40 text-accent-amber bg-accent-amber/5 hover:bg-accent-amber/10 hover:border-accent-amber/60 hover:shadow-[0_0_20px_rgba(245,158,11,0.12)]",
  Proficient:
    "border-accent-red/30 text-accent-red bg-accent-red/5 hover:bg-accent-red/10 hover:border-accent-red/50 hover:shadow-[0_0_20px_rgba(255,107,107,0.08)]",
  Familiar:
    "border-border text-muted bg-card-bg/30 hover:bg-card-bg hover:border-border-hover hover:text-foreground/80",
};

export default function SkillBadge({ name, level, index }: SkillBadgeProps) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-mono transition-all duration-300 cursor-default select-none",
        levelStyles[level]
      )}
    >
      {name}
    </motion.span>
  );
}
