/**
 * Rihards Ad V1: "The 7 Days" — Timeline/Process Video
 *
 * Shows the full mobilization timeline from Day 1 to Day 7.
 * Makes the service concrete: call on Monday, crew on site by next Monday.
 * Format: 1080x1080, ~15s, English
 */
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

const ORANGE = "#FF6B00";
const YELLOW = "#FFB800";
const BLACK = "#0a0a0a";
const DARK = "#111111";
const GREEN = "#22C55E";

// --- Scene 1: Hook — "Your project starts Monday." ---
const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const line1Spring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const line2Spring = spring({
    frame: frame - 22,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const pulseSpring = spring({
    frame: frame - 40,
    fps,
    config: { damping: 14, stiffness: 180, mass: 0.7 },
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
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.9) 100%)",
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
            opacity: line1Spring,
            transform: `translateY(${(1 - line1Spring) * 20}px)`,
            fontSize: 62,
            fontWeight: 800,
            color: "white",
            fontFamily: '"Inter", sans-serif',
            textAlign: "center",
            lineHeight: 1.1,
            textShadow: "0 4px 20px rgba(0,0,0,0.6)",
          }}
        >
          Your project starts
          <br />
          <span style={{ color: ORANGE }}>next Monday.</span>
        </div>

        <div
          style={{
            opacity: line2Spring,
            fontSize: 34,
            color: "rgba(255,255,255,0.85)",
            fontFamily: '"Inter", sans-serif',
            textAlign: "center",
            textShadow: "0 2px 10px rgba(0,0,0,0.5)",
            fontWeight: 500,
          }}
        >
          You need 10+ workers. On-site. Ready.
        </div>

        <div
          style={{
            opacity: pulseSpring,
            transform: `scale(${pulseSpring})`,
            fontSize: 30,
            color: YELLOW,
            fontFamily: '"Inter", sans-serif',
            fontWeight: 700,
            marginTop: 16,
            textAlign: "center",
            textShadow: "0 2px 10px rgba(0,0,0,0.5)",
          }}
        >
          Here's how we make that happen →
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// --- Scene 2: Day-by-day timeline ---
const SceneTimeline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const days = [
    { day: "DAY 1", title: "You call. We scope.", desc: "Location, roles, headcount — 30 min call", delay: 0 },
    { day: "DAY 2-3", title: "Sourcing.", desc: "EU candidates screened for your needs", delay: 22 },
    { day: "DAY 4-5", title: "Selection.", desc: "You approve the crew. We handle compliance.", delay: 44 },
    { day: "DAY 6", title: "Arrival.", desc: "Logistics, transport, documentation — done.", delay: 66 },
    { day: "DAY 7", title: "Crew on-site.", desc: "Ready to work. Hard hats on.", delay: 88, highlight: true },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: DARK,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
        gap: 12,
      }}
    >
      <div
        style={{
          opacity: spring({ frame, fps, config: { damping: 200, stiffness: 100 } }),
          fontSize: 28,
          color: ORANGE,
          fontFamily: '"Inter", sans-serif',
          fontWeight: 800,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          marginBottom: 12,
        }}
      >
        From Call to Crew — 7 Days
      </div>

      {days.map((d, i) => {
        const s = spring({
          frame: frame - d.delay,
          fps,
          config: { damping: 200, stiffness: 120 },
        });

        return (
          <div
            key={i}
            style={{
              opacity: s,
              transform: `translateX(${(1 - s) * 40}px)`,
              display: "flex",
              alignItems: "center",
              gap: 20,
              width: "100%",
              maxWidth: 820,
              backgroundColor: d.highlight ? "rgba(255,184,0,0.08)" : "rgba(255,255,255,0.04)",
              borderRadius: 12,
              padding: "14px 24px",
              border: d.highlight ? `1px solid ${YELLOW}50` : "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div
              style={{
                minWidth: 110,
                fontSize: 22,
                fontWeight: 900,
                color: d.highlight ? YELLOW : ORANGE,
                fontFamily: "monospace",
                letterSpacing: "0.05em",
              }}
            >
              {d.day}
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: "white",
                  fontFamily: '"Inter", sans-serif',
                  lineHeight: 1.2,
                }}
              >
                {d.title}
              </div>
              <div
                style={{
                  fontSize: 20,
                  color: "rgba(255,255,255,0.6)",
                  fontFamily: '"Inter", sans-serif',
                  marginTop: 2,
                }}
              >
                {d.desc}
              </div>
            </div>

            {d.highlight && (
              <div style={{ fontSize: 32 }}>
                ✅
              </div>
            )}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// --- Scene 3: CTA ---
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const textSpring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const btnSpring = spring({
    frame: frame - 18,
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  const pulse = 1 + Math.sin(frame / 6) * 0.03;

  const subSpring = spring({
    frame: frame - 30,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img
          src={staticFile("photos/rihards/02-crew-in-action.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.92) 100%)",
        }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          padding: 60,
        }}
      >
        <div
          style={{
            opacity: textSpring,
            fontSize: 56,
            fontWeight: 800,
            color: "white",
            fontFamily: '"Inter", sans-serif',
            textAlign: "center",
            lineHeight: 1.15,
            textShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        >
          Start today.
          <br />
          <span style={{ color: YELLOW }}>Crew on-site in 7.</span>
        </div>

        <div style={{ transform: `scale(${btnSpring * pulse})`, marginTop: 16 }}>
          <div
            style={{
              backgroundColor: YELLOW,
              color: BLACK,
              fontSize: 40,
              fontWeight: 800,
              fontFamily: '"Inter", sans-serif',
              padding: "26px 64px",
              borderRadius: 60,
              boxShadow: `0 8px 40px ${YELLOW}60`,
            }}
          >
            BOOK FREE CONSULTATION →
          </div>
        </div>

        <div
          style={{
            opacity: subSpring,
            fontSize: 22,
            color: "rgba(255,255,255,0.65)",
            fontFamily: '"Inter", sans-serif',
            marginTop: 8,
            textShadow: "0 2px 8px rgba(0,0,0,0.5)",
          }}
        >
          No risk · No commitment · EU citizens only
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const RihardsV17Days: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BLACK }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={95}>
          <SceneHook />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 12 })}
        />

        <TransitionSeries.Sequence durationInFrames={170}>
          <SceneTimeline />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 12 })}
        />

        <TransitionSeries.Sequence durationInFrames={90}>
          <SceneCTA />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
