"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { useProgress } from "@react-three/drei";
import Scene from "./scene";
interface ThreeCanvasWrapperProps {
  rotationState: {
    rotateY: number;
    rotateX: number;
    rotateZ: number;
  };
  currentState: number;
}

export default function ThreeCanvasWrapper({
  rotationState,
  currentState,
}: ThreeCanvasWrapperProps) {
  function CanvasOverlay() {
    const { active } = useProgress();
    if (!active) return null;
    return (
      <div className="absolute inset-0 flex items-center justify-center text-white/70 text-sm pointer-events-none">
        Loading 3D Scene…
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] rounded-2xl overflow-hidden transform-gpu [backface-visibility:hidden] will-change-[transform,opacity]">
      <Canvas
        shadows
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <Scene rotationState={rotationState} currentState={currentState} />
        </Suspense>
      </Canvas>
      <CanvasOverlay />
    </div>
  );
}
