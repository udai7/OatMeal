"use client";

import { motion, useInView, Variants } from "framer-motion";
import { ElementType, ReactNode, useRef } from "react";

interface TimelineContentProps {
  children: ReactNode;
  animationNum: number;
  timelineRef: React.RefObject<HTMLDivElement>;
  as?: ElementType;
  className?: string;
  customVariants?: Variants;
}

export function TimelineContent({
  children,
  animationNum,
  timelineRef,
  as: Component = "div",
  className,
  customVariants,
}: TimelineContentProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const defaultVariants = {
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
      },
    }),
    hidden: {
      opacity: 0,
      y: 50,
    },
  };

  const variants = customVariants || defaultVariants;

  return (
    <motion.div
      ref={ref}
      as={Component}
      custom={animationNum}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
