"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import SectionWrapper from "@/components/layout/SectionWrapper";
import { SITE_CONFIG } from "@/lib/constants";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface Node {
  id: string;
  label: string;
  href: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  copyable?: boolean;
  icon: string; // SVG path
}

const GITHUB_ICON = "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z";
const LINKEDIN_ICON = "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";
const EMAIL_ICON = "M2 6a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm2.5 0L12 13l7.5-7H4.5z";

function ContactGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<Node[]>([]);
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

      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const spread = Math.min(rect.width, rect.height) * 0.32;

      if (nodesRef.current.length === 0) {
        const items = [
          { id: "ray", label: "Ray", href: "#", radius: 30, icon: "" },
          { id: "github", label: "GitHub", href: SITE_CONFIG.social.github, radius: 22, icon: GITHUB_ICON },
          { id: "linkedin", label: "LinkedIn", href: SITE_CONFIG.social.linkedin, radius: 22, icon: LINKEDIN_ICON },
          { id: "email", label: "Email", href: `mailto:${SITE_CONFIG.email}`, radius: 22, icon: EMAIL_ICON, copyable: true },
        ];
        nodesRef.current = items.map((item, i) => {
          if (i === 0) return { ...item, x: cx, y: cy, vx: 0, vy: 0 };
          const angle = ((i - 1) / (items.length - 1)) * Math.PI * 2 - Math.PI / 2;
          return {
            ...item,
            x: cx + Math.cos(angle) * spread,
            y: cy + Math.sin(angle) * spread,
            vx: 0,
            vy: 0,
          };
        });
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current!.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };

      let found: string | null = null;
      for (const node of nodesRef.current) {
        const dx = mouseRef.current.x - node.x;
        const dy = mouseRef.current.y - node.y;
        if (Math.sqrt(dx * dx + dy * dy) < node.radius + 12) {
          found = node.id;
          break;
        }
      }
      hoveredRef.current = found;
      setHovered(found);
      canvas.style.cursor = found && found !== "ray" ? "pointer" : "default";
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -999, y: -999 };
      hoveredRef.current = null;
      setHovered(null);
    };

    const handleClick = () => {
      const hov = hoveredRef.current;
      if (!hov || hov === "ray") return;
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
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("click", handleClick);

    // Pre-create icon Path2D objects
    const iconPaths: Record<string, Path2D> = {};
    for (const node of nodesRef.current) {
      if (node.icon) iconPaths[node.id] = new Path2D(node.icon);
    }

    let raf: number;
    const draw = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);

      const nodes = nodesRef.current;
      const center = nodes[0];
      const time = Date.now() * 0.001;

      if (!reducedMotion) {
        for (let i = 1; i < nodes.length; i++) {
          const n = nodes[i];

          // Orbit target
          const angle = ((i - 1) / (nodes.length - 1)) * Math.PI * 2 - Math.PI / 2 + time * 0.15;
          const spread = Math.min(w, h) * 0.32;
          const tx = center.x + Math.cos(angle) * spread;
          const ty = center.y + Math.sin(angle) * spread;

          // Mouse ATTRACTION (pull toward cursor)
          const dx = mouseRef.current.x - n.x;
          const dy = mouseRef.current.y - n.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120 && dist > 0) {
            const force = (120 - dist) / 120 * 0.8;
            n.vx += (dx / dist) * force;
            n.vy += (dy / dist) * force;
          }

          // Spring toward orbit
          n.vx += (tx - n.x) * 0.008;
          n.vy += (ty - n.y) * 0.008;
          n.vx *= 0.92;
          n.vy *= 0.92;
          n.x += n.vx;
          n.y += n.vy;
        }
      }

      // Draw connections
      for (let i = 1; i < nodes.length; i++) {
        const n = nodes[i];
        const isHov = hoveredRef.current === n.id;
        ctx.beginPath();
        ctx.moveTo(center.x, center.y);
        const mx = (center.x + n.x) / 2 + Math.sin(time + i * 2) * 12;
        const my = (center.y + n.y) / 2 + Math.cos(time + i * 2) * 12;
        ctx.quadraticCurveTo(mx, my, n.x, n.y);
        ctx.strokeStyle = isHov ? "rgba(245, 158, 11, 0.6)" : "rgba(245, 158, 11, 0.1)";
        ctx.lineWidth = isHov ? 2 : 0.5;
        ctx.stroke();

        // Animated particles along connection
        if (!reducedMotion) {
          const particleCount = isHov ? 3 : 1;
          for (let p = 0; p < particleCount; p++) {
            const t = ((time * 0.5 + p * 0.33 + i * 0.25) % 1);
            const px = center.x + (n.x - center.x) * t + Math.sin(time * 2 + t * 5) * 5;
            const py = center.y + (n.y - center.y) * t + Math.cos(time * 2 + t * 5) * 5;
            ctx.beginPath();
            ctx.arc(px, py, isHov ? 2 : 1, 0, Math.PI * 2);
            ctx.fillStyle = isHov ? "rgba(245, 158, 11, 0.6)" : "rgba(245, 158, 11, 0.15)";
            ctx.fill();
          }
        }
      }

      // Draw nodes
      for (const node of nodes) {
        const isCenter = node.id === "ray";
        const isHov = hoveredRef.current === node.id;
        const scale = isHov ? 1.15 : 1;
        const r = node.radius * scale;

        // Glow
        if (isHov || isCenter) {
          const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r * 2.5);
          gradient.addColorStop(0, isCenter ? "rgba(245, 158, 11, 0.1)" : "rgba(245, 158, 11, 0.15)");
          gradient.addColorStop(1, "rgba(245, 158, 11, 0)");
          ctx.beginPath();
          ctx.arc(node.x, node.y, r * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Circle bg
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle = isCenter ? "rgba(245, 158, 11, 0.08)" : isHov ? "rgba(245, 158, 11, 0.06)" : "rgba(30, 30, 30, 0.6)";
        ctx.fill();
        ctx.strokeStyle = isHov ? "rgba(245, 158, 11, 0.6)" : isCenter ? "rgba(245, 158, 11, 0.25)" : "rgba(42, 42, 42, 0.8)";
        ctx.lineWidth = isHov ? 1.5 : 1;
        ctx.stroke();

        // Icon or label
        if (isCenter) {
          ctx.fillStyle = "rgba(245, 158, 11, 0.8)";
          ctx.font = "bold 14px var(--font-geist-sans), system-ui";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("R", node.x, node.y);
        } else if (iconPaths[node.id]) {
          // Draw SVG icon scaled into node
          ctx.save();
          const iconSize = r * 0.9;
          ctx.translate(node.x - iconSize / 2, node.y - iconSize / 2);
          ctx.scale(iconSize / 24, iconSize / 24);
          ctx.fillStyle = isHov ? "rgba(245, 158, 11, 0.9)" : "rgba(161, 161, 170, 0.5)";
          ctx.fill(iconPaths[node.id]);
          ctx.restore();
        }

        // Label below on hover
        if (isHov && !isCenter) {
          ctx.fillStyle = "rgba(245, 158, 11, 0.7)";
          ctx.font = "10px var(--font-geist-mono), monospace";
          ctx.textAlign = "center";
          ctx.fillText(node.label, node.x, node.y + r + 14);
        }
      }

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("click", handleClick);
      window.removeEventListener("resize", resize);
    };
  }, [reducedMotion]);

  return (
    <div ref={containerRef} className="relative h-[300px] md:h-[350px] w-full max-w-lg mx-auto">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {hovered && hovered !== "ray" && (
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
    <SectionWrapper id="contact" transition="clip">
      <div className="text-center max-w-2xl mx-auto">
        <span className="eyebrow">Say Hello</span>
        <h2 className="text-3xl md:text-5xl font-bold mt-2 mb-4 leading-tight">
          Let&apos;s{" "}
          <span className="font-serif-display italic text-stroke">Talk</span>
        </h2>
        <p className="text-muted mb-8">
          Always down for AI, data, startups, or wild ideas.
        </p>
        <ContactGraph />
        <p className="mt-6 text-sm font-mono text-muted/30">{SITE_CONFIG.email}</p>
      </div>
    </SectionWrapper>
  );
}
