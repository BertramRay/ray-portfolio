"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionWrapper from "@/components/layout/SectionWrapper";
import TimelineItem from "@/components/ui/TimelineItem";
import { EXPERIENCES } from "@/lib/constants";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const trailRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !trailRef.current || !timelineRef.current || !pathRef.current || !glowRef.current)
      return;

    const trail = trailRef.current;
    const path = pathRef.current;
    const glow = glowRef.current;
    const length = trail.getTotalLength();

    trail.style.strokeDasharray = `${length}`;
    trail.style.strokeDashoffset = `${length}`;

    const ctx = gsap.context(() => {
      // Draw the trail
      gsap.to(trail, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 0.5,
        },
      });

      // Move glow dot along path by animating a proxy
      const proxy = { progress: 0 };
      gsap.to(proxy, {
        progress: 1,
        ease: "none",
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 0.5,
          onUpdate: () => {
            const totalLen = path.getTotalLength();
            const point = path.getPointAtLength(proxy.progress * totalLen);
            glow.setAttribute("cx", String(point.x));
            glow.setAttribute("cy", String(point.y));
          },
        },
      });
    });

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <SectionWrapper id="experience" transition="approach">
      <div className="mb-12 md:mb-16">
        <span className="eyebrow">Career Path</span>
        <h2 className="text-3xl md:text-5xl font-bold mt-2 leading-tight">
          <span className="font-serif-display italic text-stroke">Experience</span>
        </h2>
      </div>

      <div ref={timelineRef} className="relative">
        {/* SVG curved timeline (desktop) */}
        <svg
          className="absolute left-1/2 -translate-x-1/2 top-0 h-full hidden md:block"
          width="80"
          viewBox="0 -10 80 500"
          preserveAspectRatio="none"
          style={{ overflow: "visible" }}
        >
          {/* Background track */}
          <path
            d="M 40,0 C 80,80 0,160 40,240 C 80,320 0,400 40,480"
            fill="none"
            stroke="var(--border)"
            strokeWidth="1"
          />
          {/* Animated fill trail */}
          <path
            ref={trailRef}
            d="M 40,0 C 80,80 0,160 40,240 C 80,320 0,400 40,480"
            fill="none"
            stroke="var(--accent-amber)"
            strokeWidth="1.5"
            strokeOpacity="0.5"
          />
          {/* Hidden reference path */}
          <path
            ref={pathRef}
            d="M 40,0 C 80,80 0,160 40,240 C 80,320 0,400 40,480"
            fill="none"
            stroke="none"
          />
          {/* Traveling glow dot */}
          <circle
            ref={glowRef}
            cx="40"
            cy="0"
            r="4"
            fill="var(--accent-amber)"
            opacity="0.8"
            filter="url(#glow)"
          />
          {/* Glow filter */}
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>

        <div className="space-y-8 md:space-y-12">
          {EXPERIENCES.map((exp, i) => (
            <TimelineItem
              key={exp.company + exp.period}
              experience={exp}
              index={i}
            />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
