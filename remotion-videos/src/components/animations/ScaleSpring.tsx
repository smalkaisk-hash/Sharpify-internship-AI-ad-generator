import { spring, useCurrentFrame, useVideoConfig } from "remotion";

export const ScaleSpring: React.FC<{
  children: React.ReactNode;
  delay?: number;
  from?: number;
  to?: number;
}> = ({ children, delay = 0, from = 0.7, to = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200, stiffness: 120, mass: 1 },
  });

  const scale = from + (to - from) * progress;

  return (
    <div style={{ opacity: progress, transform: `scale(${scale})` }}>
      {children}
    </div>
  );
};
