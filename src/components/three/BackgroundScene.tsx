"use client";

import dynamic from "next/dynamic";
import { useWebGLSupport } from "@/hooks/useWebGLSupport";
import WebGLFallback from "./WebGLFallback";

const FluidBackground = dynamic(() => import("./FluidBackground"), {
  ssr: false,
  loading: () => <WebGLFallback />,
});

export default function BackgroundScene() {
  const webglSupported = useWebGLSupport();

  if (!webglSupported) {
    return <WebGLFallback />;
  }

  return <FluidBackground />;
}
