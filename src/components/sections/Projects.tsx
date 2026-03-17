"use client";

import SectionWrapper from "@/components/layout/SectionWrapper";
import ProjectCard from "@/components/ui/ProjectCard";
import { PROJECTS } from "@/lib/constants";

export default function Projects() {
  return (
    <SectionWrapper id="projects" transition="scale">
      <div className="mb-12 md:mb-16">
        <span className="eyebrow">Selected Work</span>
        <h2 className="text-3xl md:text-5xl font-bold mt-2 leading-tight">
          <span className="font-serif-display italic text-stroke">Featured</span>{" "}
          Projects
        </h2>
      </div>
      <div className="space-y-16 md:space-y-20">
        {PROJECTS.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} />
        ))}
      </div>
    </SectionWrapper>
  );
}
