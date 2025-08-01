"use client";

import { useMotionValue } from "motion/react";
import { useEffect, useState } from "react";

export default function Gradient() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX - innerWidth / 2) / (innerWidth / 2);
      const y = (clientY - innerHeight / 2) / (innerHeight / 2);

      setMousePosition({ x: clientX, y: clientY });
      mouseX.set(x * 100);
      mouseY.set(y * 100);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);
  return (
    <>
      {/* Animated mesh gradient that follows mouse */}
      <div
        className="-z-10 inset-0 fixed opacity-40 transition-all duration-300"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(251, 146, 60, 0.2) 0%, rgba(239, 68, 68, 0.1) 7%, rgba(0, 0, 0, 0.2) 14%)`,
        }}
      />
    </>
  );
}
