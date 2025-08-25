// https://github.com/driaug/animated-counter/blob/master/src/components/Counter.tsx
// Credit to Driaug for the original implementation

import { useEffect, useRef } from "react";
import { useInView } from "motion/react";

/**
 *
 * @param root0
 * @param root0.value
 */

type Props = {
  value: number;
  direction?: "up" | "down";
  className?: string;
};

export default function Counter({ value, direction = "up", className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const start = direction === "down" ? value : 0;
  const end = direction === "down" ? 0 : value;
  // Use full rootMargin syntax for better mobile browser compatibility
  const isInView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" });
  const rafId = useRef<number | null>(null);

  // Initialize visible text and reset starting point when inputs change
  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = Intl.NumberFormat("en-US").format(start);
    }
  }, [start]);

  // Deterministic time-based interpolation for correct integers
  useEffect(() => {
    if (!isInView) return;
    if (start === end) {
      if (ref.current) {
        ref.current.textContent = Intl.NumberFormat("en-US").format(end);
      }
      return;
    }

    const duration = 1.1; // seconds
    const startTime = performance.now();

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      const elapsed = (now - startTime) / (duration * 1000);
      const t = Math.min(1, Math.max(0, elapsed));
      const eased = easeOutCubic(t);
      const latest = start + (end - start) * eased;

      if (ref.current) {
        // Ensure monotonically within bounds and integer rounding
        const min = Math.min(start, end);
        const max = Math.max(start, end);
        const clamped = Math.max(min, Math.min(max, latest));
        const rounded = Math.round(clamped);
        ref.current.textContent = Intl.NumberFormat("en-US").format(rounded);
      }

      if (t < 1) {
        rafId.current = requestAnimationFrame(tick);
      } else {
        // Snap to exact end
        if (ref.current) {
          ref.current.textContent = Intl.NumberFormat("en-US").format(end);
        }
      }
    };

    rafId.current = requestAnimationFrame(tick);
    return () => {
      if (rafId.current != null) cancelAnimationFrame(rafId.current);
    };
  }, [isInView, start, end]);

  return <span className={className} ref={ref} />;
}
