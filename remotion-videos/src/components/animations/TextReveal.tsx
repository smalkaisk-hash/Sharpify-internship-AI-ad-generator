import { spring, useCurrentFrame, useVideoConfig } from "remotion";

export const TextReveal: React.FC<{
  text: string;
  delay?: number;
  staggerMs?: number;
  style?: React.CSSProperties;
}> = ({ text, delay = 0, staggerMs = 2, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");

  return (
    <span style={{ display: "inline-flex", flexWrap: "wrap", gap: "0.25em", ...style }}>
      {words.map((word, i) => {
        const progress = spring({
          frame: frame - delay - i * staggerMs,
          fps,
          config: { damping: 200, stiffness: 100 },
        });

        return (
          <span
            key={i}
            style={{
              opacity: progress,
              transform: `translateY(${(1 - progress) * 15}px)`,
              display: "inline-block",
            }}
          >
            {word}
          </span>
        );
      })}
    </span>
  );
};
