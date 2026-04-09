import React from "react";
import { FadeSlideIn } from "./FadeSlideIn";

export const StaggeredList: React.FC<{
  items: React.ReactNode[];
  staggerFrames?: number;
  direction?: "up" | "left" | "right";
  baseDelay?: number;
}> = ({ items, staggerFrames = 10, direction = "left", baseDelay = 0 }) => {
  return (
    <>
      {items.map((item, i) => (
        <FadeSlideIn
          key={i}
          delay={baseDelay + i * staggerFrames}
          direction={direction}
        >
          {item}
        </FadeSlideIn>
      ))}
    </>
  );
};
