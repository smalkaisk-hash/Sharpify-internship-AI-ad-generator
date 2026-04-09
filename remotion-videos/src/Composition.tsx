import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const MyComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const scale = interpolate(frame, [0, 30], [0.8, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="bg-black flex items-center justify-center">
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
        }}
        className="text-white text-6xl font-bold text-center"
      >
        Hello from Remotion!
      </div>
    </AbsoluteFill>
  );
};
