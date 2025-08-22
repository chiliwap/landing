"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Scene from "./scene";
import { MotionValue } from "framer-motion";

interface ThreeCanvasWrapperProps {
  scrollProgress: MotionValue<number>;
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
  return (
    <div className="w-full h-[400px] rounded-2xl overflow-hidden">
      <Canvas shadows>
        <Suspense fallback={null}>
          <Scene rotationState={rotationState} currentState={currentState} />
        </Suspense>
      </Canvas>
    </div>
  );
}
