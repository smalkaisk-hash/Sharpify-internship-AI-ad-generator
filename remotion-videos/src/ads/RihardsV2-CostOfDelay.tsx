/**
 * Rihards Ad V2: "Cost of Delay" — Calculator Shock Video
 *
 * Counter races up showing money lost per day of project delay.
 * Reveals that one week of delay costs more than the staffing service.
 * Pure B2B math — hits decision makers in the wallet.
 * Format: 1080x1080, ~14s, English
 */
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Img,
  staticFile,
} from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";

const ORANGE = "#FF6B00";
const YELLOW = "#FFB800";
const BLACK = "#0a0a0a";
const DARK = "#111111";
const RED = "#FF3B3B";
const GREEN = "#22C55E";

// --- Scene 1: The question ---
const SceneQuestion: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const textSpring = spring({
    frame: frame - 8,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const subSpring = spring({
    frame: frame - 25,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img
          src={staticFile("photos/rihards/01-empty-site.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 60,
          gap: 16,
        }}
      >
        <div
          style={{
            opacity: textSpring,
            transform: `translateY(${(1 - textSpring) * 20}px)`,
            fontSize: 64,
            fontWeight: 800,
            color: "white",
            fontFamily: '"Inter", sans-serif',
            textAlign: "center",
            lineHeight: 1.1,
            textShadow: "0 4px 20px rgba(0,0,0,0.6)",
          }}
        >
          What does a week of
          <br />
          <span style={{ color: RED }}>project delay</span> actually cost?
        </div>

        <div
          style={{
            opacity: subSpring,
            fontSize: 32,
            color: "rgba(255,255,255,0.7)",
            fontFamily: '"Inter", sans-serif',
            textAlign: "center",
            textShadow: "0 2px 10px rgba(0,0,0,0.5)",
            marginTop: 10,
          }}
        >
          Let's do the math.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// --- Scene 2: The math builds up ---
const SceneMath: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lines = [
    { label: "Equipment rental", value: "€1,200/day", delay: 5 },
    { label: "Site overhead", value: "€800/day", delay: 22 },
    { label: "Project manager time", value: "€600/day", delay: 39 },
    { label: "Penalty clauses", value: "€2,500/day", delay: 56 },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: DARK,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        padding: 50,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, ${RED}05 0%, transparent 50%)`,
        }}
      />

      <div
        style={{
          opacity: spring({ frame, fps, config: { damping: 200, stiffness: 100 } }),
          fontSize: 32,
          color: "rgba(255,255,255,0.5)",
          fontFamily: '"Inter", sans-serif',
          fontWeight: 500,
          marginBottom: 14,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        When your project is understaffed...
      </div>

      {lines.map((line, i) => {
        const s = spring({
          frame: frame - line.delay,
          fps,
          config: { damping: 200, stiffness: 120 },
        });

        return (
          <div
            key={i}
            style={{
              opacity: s,
              transform: `translateX(${(1 - s) * 30}px)`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              width: "100%",
              maxWidth: 780,
              backgroundColor: "rgba(255,255,255,0.04)",
              borderRadius: 12,
              padding: "16px 28px",
              border: `1px solid ${RED}20`,
            }}
          >
            <span
              style={{
                fontSize: 32,
                color: "rgba(255,255,255,0.85)",
                fontFamily: '"Inter", sans-serif',
                fontWeight: 600,
              }}
            >
              {line.label}
            </span>
            <span
              style={{
                fontSize: 38,
                fontWeight: 900,
                color: RED,
                fontFamily: '"Inter", sans-serif',
              }}
            >
              -{line.value}
            </span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// --- Scene 3: Total cost of delay ---
const SceneTotal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelSpring = spring({
    frame: frame - 3,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const numSpring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 12, stiffness: 180, mass: 0.8 },
  });

  const countProgress = interpolate(frame, [15, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Daily = 5,100, Weekly = 35,700
  const amount = Math.round(35700 * countProgress);

  const subSpring = spring({
    frame: frame - 60,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BLACK,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, ${RED}10 0%, transparent 50%)`,
        }}
      />

      <div
        style={{
          opacity: labelSpring,
          fontSize: 32,
          color: "rgba(255,255,255,0.5)",
          fontFamily: '"Inter", sans-serif',
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        1 week of delay =
      </div>

      <div
        style={{
          transform: `scale(${numSpring})`,
          fontSize: 180,
          fontWeight: 900,
          color: RED,
          fontFamily: '"Inter", sans-serif',
          textShadow: `0 0 60px ${RED}40`,
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        €{amount.toLocaleString()}
      </div>

      <div
        style={{
          opacity: subSpring,
          fontSize: 34,
          color: "rgba(255,255,255,0.75)",
          fontFamily: '"Inter", sans-serif',
          fontWeight: 600,
          marginTop: 10,
          textAlign: "center",
        }}
      >
        burned — and the site still isn't moving.
      </div>
    </AbsoluteFill>
  );
};

// --- Scene 4: The solution ---
const SceneSolution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const textSpring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const vsSpring = spring({
    frame: frame - 22,
    fps,
    config: { damping: 14, stiffness: 180 },
  });

  const leftSpring = spring({
    frame: frame - 28,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const rightSpring = spring({
    frame: frame - 38,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const btnSpring = spring({
    frame: frame - 55,
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
          background: `radial-gradient(circle at 50% 50%, ${YELLOW}08 0%, transparent 50%)`,
        }}
      />

      <div
        style={{
          opacity: textSpring,
          fontSize: 44,
          fontWeight: 800,
          color: "white",
          fontFamily: '"Inter", sans-serif',
          textAlign: "center",
          lineHeight: 1.15,
        }}
      >
        Or you could just <span style={{ color: YELLOW }}>staff the site</span>.
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 30,
          marginTop: 20,
        }}
      >
        <div
          style={{
            opacity: leftSpring,
            transform: `translateX(${(1 - leftSpring) * -30}px)`,
            textAlign: "center",
            backgroundColor: "rgba(255,59,59,0.08)",
            borderRadius: 16,
            padding: "24px 32px",
            border: `1px solid ${RED}30`,
            minWidth: 260,
          }}
        >
          <div
            style={{
              fontSize: 22,
              color: "rgba(255,255,255,0.5)",
              fontFamily: '"Inter", sans-serif',
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            Week of delay
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 900,
              color: RED,
              fontFamily: '"Inter", sans-serif',
            }}
          >
            €35,700
          </div>
        </div>

        <div
          style={{
            transform: `scale(${vsSpring})`,
            fontSize: 38,
            fontWeight: 800,
            color: "rgba(255,255,255,0.3)",
            fontFamily: '"Inter", sans-serif',
          }}
        >
          VS
        </div>

        <div
          style={{
            opacity: rightSpring,
            transform: `translateX(${(1 - rightSpring) * 30}px)`,
            textAlign: "center",
            backgroundColor: "rgba(255,184,0,0.08)",
            borderRadius: 16,
            padding: "24px 32px",
            border: `1px solid ${YELLOW}30`,
            minWidth: 260,
          }}
        >
          <div
            style={{
              fontSize: 22,
              color: "rgba(255,255,255,0.5)",
              fontFamily: '"Inter", sans-serif',
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            10+ EU workers
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 900,
              color: YELLOW,
              fontFamily: '"Inter", sans-serif',
            }}
          >
            Fraction.
          </div>
        </div>
      </div>

      <div style={{ transform: `scale(${btnSpring * pulse})`, marginTop: 20 }}>
        <div
          style={{
            backgroundColor: YELLOW,
            color: BLACK,
            fontSize: 36,
            fontWeight: 800,
            fontFamily: '"Inter", sans-serif',
            padding: "24px 56px",
            borderRadius: 60,
            boxShadow: `0 8px 40px ${YELLOW}60`,
          }}
        >
          GET THE MATH →
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const RihardsV2CostOfDelay: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BLACK }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={85}>
          <SceneQuestion />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 12 })}
        />

        <TransitionSeries.Sequence durationInFrames={110}>
          <SceneMath />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 12 })}
        />

        <TransitionSeries.Sequence durationInFrames={100}>
          <SceneTotal />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 12 })}
        />

        <TransitionSeries.Sequence durationInFrames={105}>
          <SceneSolution />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
