"use client";

import { useRef, useEffect, useState } from "react";
import SectionWrapper from "@/components/layout/SectionWrapper";
import { SITE_CONFIG } from "@/lib/constants";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface OrbitNode {
  id: string;
  label: string;
  href: string;
  orbitRadius: number;
  speed: number; // radians per second
  angle: number;
  size: number;
  icon: string;
  copyable?: boolean;
}

const GITHUB_ICON = "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z";
const LINKEDIN_ICON = "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";
const EMAIL_ICON = "M2 6a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm2.5 0L12 13l7.5-7H4.5z";

function PlanetaryOrbit() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<OrbitNode[]>([]);
  const mouseRef = useRef({ x: -999, y: -999 });
  const hoveredRef = useRef<string | null>(null);
  const reducedMotion = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio, 2);

    const resize = () => {
      const rect = containerRef.current!.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const base = Math.min(rect.width, rect.height);
      nodesRef.current = [
        { id: "github", label: "GitHub", href: SITE_CONFIG.social.github, orbitRadius: base * 0.16, speed: 0.4, angle: 0, size: 20, icon: GITHUB_ICON },
        { id: "linkedin", label: "LinkedIn", href: SITE_CONFIG.social.linkedin, orbitRadius: base * 0.27, speed: -0.25, angle: Math.PI * 0.7, size: 18, icon: LINKEDIN_ICON },
        { id: "email", label: "Email", href: `mailto:${SITE_CONFIG.email}`, orbitRadius: base * 0.38, speed: 0.15, angle: Math.PI * 1.4, size: 18, icon: EMAIL_ICON, copyable: true },
      ];
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current!.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      const cx = rect.width / 2, cy = rect.height / 2;
      let found: string | null = null;
      for (const node of nodesRef.current) {
        const nx = cx + Math.cos(node.angle) * node.orbitRadius;
        const ny = cy + Math.sin(node.angle) * node.orbitRadius;
        if (Math.hypot(mouseRef.current.x - nx, mouseRef.current.y - ny) < node.size + 10) {
          found = node.id;
          break;
        }
      }
      hoveredRef.current = found;
      setHovered(found);
      canvas.style.cursor = found ? "pointer" : "default";
    };

    const handleClick = () => {
      const hov = hoveredRef.current;
      if (!hov) return;
      const node = nodesRef.current.find((n) => n.id === hov);
      if (!node) return;
      if (node.copyable) {
        navigator.clipboard.writeText(SITE_CONFIG.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        window.open(node.href, "_blank");
      }
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", () => { mouseRef.current = { x: -999, y: -999 }; hoveredRef.current = null; setHovered(null); });
    canvas.addEventListener("click", handleClick);

    const iconPaths: Record<string, Path2D> = {};
    for (const node of nodesRef.current) {
      if (node.icon) iconPaths[node.id] = new Path2D(node.icon);
    }

    let raf: number;
    const draw = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const w = rect.width, h = rect.height;
      const cx = w / 2, cy = h / 2;
      ctx.clearRect(0, 0, w, h);

      const time = Date.now() * 0.001;

      // Draw orbit rings
      for (const node of nodesRef.current) {
        const isHov = hoveredRef.current === node.id;
        ctx.beginPath();
        ctx.arc(cx, cy, node.orbitRadius, 0, Math.PI * 2);
        ctx.strokeStyle = isHov ? "rgba(245, 158, 11, 0.15)" : "rgba(42, 42, 42, 0.4)";
        ctx.lineWidth = isHov ? 1 : 0.5;
        ctx.setLineDash(isHov ? [] : [4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Center "sun"
      const sunGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 24);
      sunGrad.addColorStop(0, "rgba(245, 158, 11, 0.15)");
      sunGrad.addColorStop(1, "rgba(245, 158, 11, 0)");
      ctx.beginPath();
      ctx.arc(cx, cy, 24, 0, Math.PI * 2);
      ctx.fillStyle = sunGrad;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(245, 158, 11, 0.12)";
      ctx.fill();
      ctx.strokeStyle = "rgba(245, 158, 11, 0.3)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = "rgba(245, 158, 11, 0.8)";
      ctx.font = "bold 10px var(--font-geist-sans), system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("R", cx, cy);

      // Draw nodes on orbits
      for (const node of nodesRef.current) {
        if (!reducedMotion) node.angle += node.speed * 0.016;
        const nx = cx + Math.cos(node.angle) * node.orbitRadius;
        const ny = cy + Math.sin(node.angle) * node.orbitRadius;
        const isHov = hoveredRef.current === node.id;
        const r = node.size * (isHov ? 1.25 : 1);

        // Trail
        if (!reducedMotion) {
          for (let t = 1; t <= 5; t++) {
            const ta = node.angle - node.speed * 0.016 * t * 3;
            const tx = cx + Math.cos(ta) * node.orbitRadius;
            const ty = cy + Math.sin(ta) * node.orbitRadius;
            ctx.beginPath();
            ctx.arc(tx, ty, 1.5 * (1 - t / 6), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(245, 158, 11, ${0.08 * (1 - t / 6)})`;
            ctx.fill();
          }
        }

        // Glow
        if (isHov) {
          const glow = ctx.createRadialGradient(nx, ny, 0, nx, ny, r * 3);
          glow.addColorStop(0, "rgba(245, 158, 11, 0.15)");
          glow.addColorStop(1, "rgba(245, 158, 11, 0)");
          ctx.beginPath();
          ctx.arc(nx, ny, r * 3, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
        }

        // Node circle
        ctx.beginPath();
        ctx.arc(nx, ny, r, 0, Math.PI * 2);
        ctx.fillStyle = isHov ? "rgba(245, 158, 11, 0.1)" : "rgba(22, 22, 22, 0.8)";
        ctx.fill();
        ctx.strokeStyle = isHov ? "rgba(245, 158, 11, 0.5)" : "rgba(42, 42, 42, 0.8)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Icon
        if (iconPaths[node.id]) {
          ctx.save();
          const iconSize = r * 0.85;
          ctx.translate(nx - iconSize / 2, ny - iconSize / 2);
          ctx.scale(iconSize / 24, iconSize / 24);
          ctx.fillStyle = isHov ? "rgba(245, 158, 11, 0.9)" : "rgba(161, 161, 170, 0.45)";
          ctx.fill(iconPaths[node.id]);
          ctx.restore();
        }

        // Label on hover
        if (isHov) {
          ctx.fillStyle = "rgba(245, 158, 11, 0.7)";
          ctx.font = "10px var(--font-geist-mono), monospace";
          ctx.textAlign = "center";
          ctx.fillText(node.label, nx, ny + r + 16);
        }
      }

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleClick);
      window.removeEventListener("resize", resize);
    };
  }, [reducedMotion]);

  return (
    <div ref={containerRef} className="relative h-[320px] md:h-[380px] w-full max-w-lg mx-auto">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {hovered && (
        <div className="absolute bottom-2 left-0 right-0 text-center">
          <span className="text-xs font-mono text-muted/40">
            {hovered === "email" ? (copied ? "Copied!" : "Click to copy email") : `Open ${hovered}`}
          </span>
        </div>
      )}
    </div>
  );
}

export default function Contact() {
  return (
    <SectionWrapper id="contact" transition="approach">
      <div className="text-center max-w-2xl mx-auto">
        <span className="eyebrow">Say Hello</span>
        <h2 className="text-3xl md:text-5xl font-bold mt-2 mb-4 leading-tight">
          Let&apos;s{" "}
          <span className="font-serif-display italic text-stroke">Talk</span>
        </h2>
        <p className="text-muted mb-8">
          Always down for AI, data, startups, or wild ideas.
        </p>
        <PlanetaryOrbit />
        <p className="mt-6 text-sm font-mono text-muted/30">{SITE_CONFIG.email}</p>
      </div>
    </SectionWrapper>
  );
}
