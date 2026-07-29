import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { animate } from "framer-motion";

export const AnimatedCounter = ({ value, suffix = "", prefix = "", duration = 2.5 }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (inView) {
      const controls = animate(0, value, {
        duration,
        onUpdate: (val) => setCount(Math.floor(val)),
        ease: "easeOut",
      });
      return () => controls.stop();
    }
  }, [inView, value, duration]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};
