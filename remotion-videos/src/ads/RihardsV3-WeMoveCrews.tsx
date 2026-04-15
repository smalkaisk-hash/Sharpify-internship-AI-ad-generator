/**
 * Rihards Ad V3: "We Move Crews" — Cinematic Brand Video
 *
 * Empty site → EU map with arrows converging → crew on-site working.
 * Visual storytelling. Strong brand punchline at the end.
 * Format: 1080x1080, ~13s, English
 */
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";

const ORANGE = "#FF6B00";
const YELLOW = "#FFB800";
const BLACK = "#0a0a0a";
const DARK = "#111111";

// --- Scene 1: Empty site — "Your site. Empty." ---
const SceneEmpty: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slow zoom on empty site for dramatic effect
  const zoom = interpolate(frame, [0, 90], [1.0, 1.1], {
    extrapolateRight: "clamp",
  });

  const textSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const subSpring = spring({
    frame: frame - 35,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img
          src={staticFile("photos/rihards/01-empty-site.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${zoom})`,
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
          padding: 60,
          paddingBottom: 100,
          gap: 10,
        }}
      >
        <div
          style={{
            opacity: textSpring,
            transform: `translateY(${(1 - textSpring) * 20}px)`,
            fontSize: 82,
            fontWeight: 900,
            color: "white",
            fontFamily: '"Inter", sans-serif',
            textAlign: "center",
            lineHeight: 1,
            letterSpacing: "-0.02em",
            textShadow: "0 4px 20px rgba(0,0,0,0.7)",
          }}
        >
          Your site.
          <br />
          <span style={{ color: ORANGE }}>Empty.</span>
        </div>

        <div
          style={{
            opacity: subSpring,
            fontSize: 30,
            color: "rgba(255,255,255,0.8)",
            fontFamily: '"Inter", sans-serif',
            fontWeight: 500,
            textAlign: "center",
            textShadow: "0 2px 10px rgba(0,0,0,0.5)",
            marginTop: 10,
          }}
        >
          Deadline closing. Local hiring too slow.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// --- Scene 2: EU map — "We mobilize." ---
const SceneMap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mapOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const textSpring = spring({
    frame: frame - 12,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const bigTextSpring = spring({
    frame: frame - 30,
    fps,
    config: { damping: 14, stiffness: 180 },
  });

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ overflow: "hidden", opacity: mapOpacity }}>
        <Img
          src={staticFile("photos/rihards/04-eu-map-flow.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(5,10,20,0.6) 0%, rgba(5,10,20,0.15) 40%, rgba(5,10,20,0.85) 100%)",
        }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "80px 60px",
        }}
      >
        <div
          style={{
            opacity: textSpring,
            fontSize: 28,
            color: ORANGE,
            fontFamily: '"Inter", sans-serif',
            fontWeight: 800,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            textShadow: "0 2px 10px rgba(0,0,0,0.5)",
          }}
        >
          Across 20+ EU countries
        </div>

        <div
          style={{
            transform: `scale(${bigTextSpring})`,
            fontSize: 88,
            fontWeight: 900,
            color: "white",
            fontFamily: '"Inter", sans-serif',
            textAlign: "center",
            lineHeight: 1,
            textShadow: "0 4px 20px rgba(0,0,0,0.6)",
            letterSpacing: "-0.02em",
          }}
        >
          We <span style={{ color: YELLOW }}>mobilize.</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// --- Scene 3: Crew on site — "Your crew. On-site. Day 7." ---
const SceneCrew: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Subtle zoom
  const zoom = interpolate(frame, [0, 90], [1.05, 1.12], {
    extrapolateRight: "clamp",
  });

  const textSpring = spring({
    frame: frame - 8,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const daySpring = spring({
    frame: frame - 28,
    fps,
    config: { damping: 14, stiffness: 180, mass: 0.7 },
  });

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img
          src={staticFile("photos/rihards/02-crew-in-action.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${zoom})`,
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "70px 60px",
        }}
      >
        <div
          style={{
            opacity: textSpring,
            transform: `translateY(${(1 - textSpring) * -20}px)`,
            fontSize: 68,
            fontWeight: 900,
            color: "white",
            fontFamily: '"Inter", sans-serif',
            textAlign: "center",
            lineHeight: 1,
            letterSpacing: "-0.02em",
            textShadow: "0 4px 20px rgba(0,0,0,0.7)",
          }}
        >
          Your crew.
          <br />
          <span style={{ color: YELLOW }}>On-site.</span>
        </div>

        <div
          style={{
            transform: `scale(${daySpring})`,
            fontSize: 36,
            fontWeight: 900,
            color: "white",
            fontFamily: '"Inter", sans-serif',
            backgroundColor: ORANGE,
            padding: "14px 36px",
            borderRadius: 50,
            letterSpacing: "0.08em",
            boxShadow: `0 8px 30px ${ORANGE}60`,
          }}
        >
          DAY 7.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// --- Scene 4: Brand + CTA ---
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const brandSpring = spring({
    frame: frame - 3,
    fps,
    config: { damping: 14, stiffness: 180, mass: 0.7 },
  });

  const subSpring = spring({
    frame: frame - 22,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const btnSpring = spring({
    frame: frame - 35,
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  const pulse = 1 + Math.sin(frame / 6) * 0.03;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BLACK,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 40%, ${YELLOW}12 0%, transparent 50%)`,
        }}
      />

      <div
        style={{
          transform: `scale(${brandSpring})`,
          fontSize: 100,
          fontWeight: 900,
          color: "white",
          fontFamily: '"Inter", sans-serif',
          textAlign: "center",
          lineHeight: 0.95,
          letterSpacing: "-0.03em",
        }}
      >
        We move crews.
        <br />
        <span style={{ color: YELLOW }}>You move dirt.</span>
      </div>

      <div
        style={{
          opacity: subSpring,
          fontSize: 30,
          color: "rgba(255,255,255,0.6)",
          fontFamily: '"Inter", sans-serif',
          fontWeight: 500,
          textAlign: "center",
          marginTop: 12,
        }}
      >
        Construction · Industrial · Demolition
      </div>

      <div style={{ transform: `scale(${btnSpring * pulse})`, marginTop: 16 }}>
        <div
          style={{
            backgroundColor: YELLOW,
            color: BLACK,
            fontSize: 40,
            fontWeight: 800,
            fontFamily: '"Inter", sans-serif',
            padding: "26px 60px",
            borderRadius: 60,
            boxShadow: `0 8px 40px ${YELLOW}60`,
          }}
        >
          BOOK CONSULTATION →
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const RihardsV3WeMoveCrews: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BLACK }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={95}>
          <SceneEmpty />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 14 })}
        />

        <TransitionSeries.Sequence durationInFrames={90}>
          <SceneMap />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 14 })}
        />

        <TransitionSeries.Sequence durationInFrames={90}>
          <SceneCrew />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 14 })}
        />

        <TransitionSeries.Sequence durationInFrames={90}>
          <SceneCTA />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
