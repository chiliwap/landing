// https://github.com/driaug/animated-counter/blob/master/src/components/Counter.tsx
// Credit to Driaug for the original implementation

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "motion/react";

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
  const motionValue = useMotionValue(direction === "down" ? value : 0);
  const springValue = useSpring(motionValue, {
    damping: 10,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(direction === "down" ? 0 : value);
    }
  }, [motionValue, isInView]);

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) {
          ref.current.textContent = Intl.NumberFormat("en-US").format(
            Math.round(latest)
          );
        }
      }),
    [springValue]
  );

  return <span className={className} ref={ref} />;
}
