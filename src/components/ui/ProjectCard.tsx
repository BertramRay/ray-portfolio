"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { Project } from "@/lib/constants";
import TiltCard from "./TiltCard";

interface ProjectCardProps {
  project: Project;
  index: number;
}

const PAINTINGS = [
  { src: "/paintings/caravaggio.jpg", caption: "Caravaggio, 1600" },
  { src: "/paintings/vermeer.jpg", caption: "Vermeer, 1662" },
  { src: "/paintings/davinci.jpg", caption: "da Vinci, c. 1490" },
  { src: "/paintings/raphael.jpg", caption: "Raphael, 1504" },
];

function ProjectVisual({ index }: { index: number }) {
  const painting = PAINTINGS[index % PAINTINGS.length];

  return (
    <div className="w-full rounded-xl overflow-hidden relative">
      <div className="relative aspect-[4/3] bg-card-bg">
        <Image
          src={painting.src}
          alt={painting.caption}
          fill
          className="object-cover scale-110 transition-all duration-700 group-hover:scale-[1.15] saturate-[0.6] group-hover:saturate-[0.8]"
          sizes="(max-width: 768px) 100vw, 40vw"
        />
        {/* Subtle amber tint */}
        <div className="absolute inset-0 bg-accent-amber/[0.04] mix-blend-color" />
        {/* Soft bottom fade for text separation */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
        {/* Caption */}
        <span className="absolute bottom-2 right-3 text-[8px] font-mono text-white/20 tracking-wider">
          {painting.caption}
        </span>
      </div>
    </div>
  );
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -60 : 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group"
    >
      <div
        className={`flex flex-col ${
          isEven ? "md:flex-row" : "md:flex-row-reverse"
        } gap-6 md:gap-8 items-center`}
      >
        <TiltCard className="w-full md:w-2/5">
          <ProjectVisual index={index} />
        </TiltCard>

        <div className="w-full md:w-3/5 space-y-4">
          <div>
            {project.highlight && (
              <span className="eyebrow">{project.highlight}</span>
            )}
            <h3 className="text-xl md:text-2xl font-semibold text-foreground group-hover:text-accent-amber transition-colors duration-300 mt-1">
              {project.title}
            </h3>
          </div>
          <p className="text-muted leading-[1.75] text-sm md:text-base">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs font-mono rounded-full border border-border text-muted/60 bg-card-bg/50 group-hover:border-border-hover transition-colors duration-300"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex gap-4 pt-2">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="link-animated text-sm font-mono text-accent-amber hover:text-accent-red transition-colors duration-300 active:scale-95"
              >
                Visit Site →
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="link-animated text-sm font-mono text-muted/50 hover:text-accent-amber transition-colors duration-300 active:scale-95"
              >
                Source →
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
