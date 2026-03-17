"use client";

import { motion } from "framer-motion";
import type { Experience } from "@/lib/constants";

interface TimelineItemProps {
  experience: Experience;
  index: number;
}

export default function TimelineItem({
  experience,
  index,
}: TimelineItemProps) {
  const isLeft = index % 2 === 0;

  return (
    <div className="relative flex items-start md:items-center justify-center">
      {/* Dot on the timeline */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.2, type: "spring", stiffness: 300 }}
        className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-4 border-background z-10 hidden md:block"
      >
        <div className="w-full h-full rounded-full bg-accent-amber" />
        <div className="absolute inset-0 rounded-full bg-accent-amber/30 animate-ping" />
      </motion.div>

      {/* Card — full width on mobile, alternating on desktop */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`w-full md:w-[45%] ${
          isLeft ? "md:mr-auto md:pr-12" : "md:ml-auto md:pl-12"
        }`}
      >
        <div className="card-interactive bg-card-bg border border-border rounded-xl p-6 hover:border-accent-amber/25 hover:bg-card-bg-hover">
          {/* Period badge */}
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent-amber/5 border border-accent-amber/20 mb-4">
            <span className="text-xs font-mono text-accent-amber">
              {experience.period}
            </span>
          </div>

          <h3 className="text-lg font-semibold text-foreground mb-1">
            {experience.title}
          </h3>
          <p className="text-sm font-mono text-muted/80 mb-4">
            {experience.companyUrl ? (
              <a
                href={experience.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent-amber transition-colors link-animated"
              >
                {experience.company}
              </a>
            ) : (
              experience.company
            )}
          </p>
          <p className="text-muted text-sm leading-relaxed mb-4">
            {experience.description}
          </p>
          <ul className="space-y-2">
            {experience.highlights.map((h, i) => (
              <li
                key={i}
                className="text-sm text-muted/80 flex items-start gap-2.5"
              >
                <span className="text-accent-amber mt-0.5 shrink-0 text-xs">
                  ▸
                </span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
