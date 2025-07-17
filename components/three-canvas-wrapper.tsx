"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Scene from "./scene";

export default function ThreeCanvasWrapper() {
  return (
    <div className="w-full h-[400px] rounded-2xl overflow-hidden">
      <Canvas shadows>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
