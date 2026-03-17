"use client";

export default function WebGLFallback() {
  return (
    <div className="fixed inset-0 -z-10 bg-background">
      <div
        className="absolute inset-0 animate-pulse"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, rgba(245, 158, 11, 0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(239, 68, 68, 0.06) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(245, 158, 11, 0.04) 0%, transparent 40%)",
          animationDuration: "8s",
        }}
      />
    </div>
  );
}
