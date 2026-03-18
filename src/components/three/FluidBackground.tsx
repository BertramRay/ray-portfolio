"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, useCallback, useEffect } from "react";
import * as THREE from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";

import vertexShader from "./shaders/fluid.vert";
import fragmentShader from "./shaders/fluid.frag";

// Section mood configs: [speed, turbulence, brightness, focus, mouseReact, contrast]
const SECTION_MOODS: Record<string, number[]> = {
  hero:       [0.6, 0.8, 0.8, 0.3, 1.0, 1.0],   // calm, normal mouse, neutral contrast
  about:      [0.9, 1.0, 1.2, 0.5, 0.8, 0.9],   // warm, slightly soft
  projects:   [1.0, 1.4, 1.5, 0.4, 1.5, 1.4],   // sharp contrast, highly interactive
  skills:     [1.5, 1.6, 1.3, 0.2, 1.2, 1.2],   // fast, punchy
  experience: [0.5, 0.7, 0.9, 0.6, 0.5, 0.7],   // gentle, low mouse, soft
  blog:       [0.3, 0.5, 0.5, 0.8, 0.3, 0.6],   // quiet, minimal mouse, very soft
  contact:    [0.7, 0.9, 1.0, 1.0, 1.0, 1.0],   // warm, moderate
};
const DEFAULT_MOOD = [0.6, 0.8, 0.8, 0.3, 1.0, 1.0];

function FluidMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouseRef = useRef(new THREE.Vector2(0.5, 0.5));
  const targetMouseRef = useRef(new THREE.Vector2(0.5, 0.5));
  const targetMoodRef = useRef(DEFAULT_MOOD);
  const currentMoodRef = useRef([...DEFAULT_MOOD]);
  const reducedMotion = useReducedMotion();
  const { viewport } = useThree();

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
      uLayers: { value: isMobile ? 2 : 4 },
      uSpeed: { value: DEFAULT_MOOD[0] },
      uTurbulence: { value: DEFAULT_MOOD[1] },
      uBrightness: { value: DEFAULT_MOOD[2] },
      uFocus: { value: DEFAULT_MOOD[3] },
      uMouseReact: { value: DEFAULT_MOOD[4] },
      uContrast: { value: DEFAULT_MOOD[5] },
    }),
    [isMobile]
  );

  const handlePointerMove = useCallback((e: MouseEvent) => {
    targetMouseRef.current.set(
      e.clientX / window.innerWidth,
      1.0 - e.clientY / window.innerHeight
    );
  }, []);

  const handleScroll = useCallback(() => {
    const scrollCenter = window.scrollY + window.innerHeight / 2;
    const sectionIds = Object.keys(SECTION_MOODS);

    // Check hero first (before any section elements)
    if (window.scrollY < window.innerHeight * 0.5) {
      targetMoodRef.current = SECTION_MOODS.hero;
      return;
    }

    let closest: string | null = null;
    let closestDist = Infinity;
    for (const id of sectionIds) {
      if (id === "hero") continue;
      const el = document.getElementById(id);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      const center = rect.top + window.scrollY + rect.height / 2;
      const dist = Math.abs(scrollCenter - center);
      if (dist < closestDist) {
        closestDist = dist;
        closest = id;
      }
    }

    targetMoodRef.current = closest ? SECTION_MOODS[closest] : DEFAULT_MOOD;
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handlePointerMove, handleScroll]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.ShaderMaterial;

    if (!reducedMotion) {
      mat.uniforms.uTime.value += delta;
    }

    mouseRef.current.lerp(targetMouseRef.current, 0.05);
    mat.uniforms.uMouse.value.copy(mouseRef.current);
    mat.uniforms.uResolution.value.set(viewport.width * 100, viewport.height * 100);

    // Smooth mood transition (lerp all parameters)
    const target = targetMoodRef.current;
    const current = currentMoodRef.current;
    const lerpRate = 0.025;
    for (let i = 0; i < current.length; i++) {
      current[i] += (target[i] - current[i]) * lerpRate;
    }

    mat.uniforms.uSpeed.value = current[0];
    mat.uniforms.uTurbulence.value = current[1];
    mat.uniforms.uBrightness.value = current[2];
    mat.uniforms.uFocus.value = current[3];
    mat.uniforms.uMouseReact.value = current[4];
    mat.uniforms.uContrast.value = current[5];
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function FluidBackground() {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        dpr={isMobile ? [1, 1] : [1, 1.5]}
        gl={{ antialias: false, alpha: false }}
        camera={{ position: [0, 0, 1] }}
      >
        <FluidMesh />
      </Canvas>
    </div>
  );
}
