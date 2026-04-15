/**
 * AI Toolkit Ad V6: "Day in the Life" — Before/After Transformation
 *
 * Two parallel days shown side-by-side: 9AM, 12PM, 3PM, 6PM.
 * Left column = old way (stressed, behind). Right column = with AI toolkit.
 * Visual storytelling with timeline. Shows the transformation tangibly.
 * Format: 1080x1080, ~14s, Latvian
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

const YELLOW = "#E8D500";
const BLACK = "#0a0a0a";
const RED = "#FF3B3B";
const GREEN = "#22C55E";

// --- Scene 1: Title ---
const SceneTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const textSpring = spring({
    frame: frame - 8,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const subSpring = spring({
    frame: frame - 20,
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
        gap: 16,
      }}
    >
      <div
        style={{
          opacity: textSpring,
          transform: `translateY(${(1 - textSpring) * 20}px)`,
          fontSize: 60,
          fontWeight: 800,
          color: "white",
          fontFamily: '"Inter", sans-serif',
          textAlign: "center",
          lineHeight: 1.15,
        }}
      >
        Divas dienas.
        <br />
        <span style={{ color: YELLOW }}>Viens uzņēmējs.</span>
      </div>

      <div
        style={{
          opacity: subSpring,
          fontSize: 32,
          color: "rgba(255,255,255,0.5)",
          fontFamily: '"Inter", sans-serif',
          textAlign: "center",
        }}
      >
        Ko maina AI Rīku Komplekts?
      </div>
    </AbsoluteFill>
  );
};

// --- Scene 2: Transformation stats (big readable cards) ---
const SceneTimeline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cards = [
    {
      icon: "📝",
      task: "Instagram posti",
      before: "2 stundas",
      after: "8 sekundes",
      delay: 0,
    },
    {
      icon: "💼",
      task: "Reklāmu kopijas",
      before: "1.5 stundas",
      after: "30 sekundes",
      delay: 26,
    },
    {
      icon: "📧",
      task: "Klientu e-pasti",
      before: "30 minūtes",
      after: "10 sekundes",
      delay: 52,
    },
  ];

  const headerSpring = spring({
    frame: frame - 3,
    fps,
    config: { damping: 200, stiffness: 100 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BLACK,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
        padding: 40,
      }}
    >
      <div
        style={{
          opacity: headerSpring,
          fontSize: 40,
          fontWeight: 800,
          color: "white",
          fontFamily: '"Inter", sans-serif',
          textAlign: "center",
          marginBottom: 8,
        }}
      >
        Viens un tas pats darbs.
        <br />
        <span style={{ color: YELLOW }}>Cits ātrums.</span>
      </div>

      {cards.map((card, i) => {
        const s = spring({
          frame: frame - card.delay,
          fps,
          config: { damping: 200, stiffness: 120 },
        });

        return (
          <div
            key={i}
            style={{
              opacity: s,
              transform: `translateX(${(1 - s) * 60}px)`,
              display: "flex",
              alignItems: "center",
              gap: 18,
              width: "100%",
              maxWidth: 840,
              backgroundColor: "rgba(255,255,255,0.04)",
              borderRadius: 18,
              padding: "20px 28px",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {/* Icon */}
            <div
              style={{
                fontSize: 56,
                flexShrink: 0,
              }}
            >
              {card.icon}
            </div>

            {/* Task name */}
            <div
              style={{
                flex: 1,
                fontSize: 32,
                fontWeight: 700,
                color: "white",
                fontFamily: '"Inter", sans-serif',
              }}
            >
              {card.task}
            </div>

            {/* Before */}
            <div
              style={{
                textAlign: "right",
                paddingRight: 16,
              }}
            >
              <div
                style={{
                  fontSize: 16,
                  color: "rgba(255,255,255,0.35)",
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                BEZ
              </div>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  color: RED,
                  fontFamily: '"Inter", sans-serif',
                  textDecoration: "line-through",
                  textDecorationColor: `${RED}80`,
                }}
              >
                {card.before}
              </div>
            </div>

            {/* Arrow */}
            <div
              style={{
                fontSize: 36,
                color: YELLOW,
                flexShrink: 0,
              }}
            >
              →
            </div>

            {/* After */}
            <div style={{ textAlign: "left", paddingLeft: 16 }}>
              <div
                style={{
                  fontSize: 16,
                  color: YELLOW,
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                AR AI
              </div>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  color: GREEN,
                  fontFamily: '"Inter", sans-serif',
                }}
              >
                {card.after}
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// --- Scene 3: The result ---
const SceneResult: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const numSpring = spring({
    frame: frame - 8,
    fps,
    config: { damping: 12, stiffness: 180, mass: 0.8 },
  });

  const countProgress = interpolate(frame, [8, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const hours = (4.5 * countProgress).toFixed(1);

  const textSpring = spring({
    frame: frame - 38,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const labelSpring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 200, stiffness: 100 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BLACK,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, ${GREEN}08 0%, transparent 50%)`,
        }}
      />

      <div
        style={{
          opacity: labelSpring,
          fontSize: 30,
          color: "rgba(255,255,255,0.4)",
          fontFamily: '"Inter", sans-serif',
          fontWeight: 500,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        Ietaupīts laiks
      </div>

      <div
        style={{
          transform: `scale(${numSpring})`,
          fontSize: 150,
          fontWeight: 900,
          color: GREEN,
          fontFamily: '"Inter", sans-serif',
          textShadow: `0 0 40px ${GREEN}30`,
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {hours}h
      </div>

      <div
        style={{
          opacity: textSpring,
          fontSize: 36,
          color: "rgba(255,255,255,0.6)",
          fontFamily: '"Inter", sans-serif',
          fontWeight: 600,
        }}
      >
        katru dienu. Bez stresa.
      </div>
    </AbsoluteFill>
  );
};

// --- Scene 4: CTA ---
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const textSpring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const btnSpring = spring({
    frame: frame - 16,
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
        gap: 16,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 40%, ${YELLOW}12 0%, transparent 50%)`,
        }}
      />

      <div
        style={{
          opacity: textSpring,
          fontSize: 58,
          fontWeight: 800,
          color: "white",
          fontFamily: '"Inter", sans-serif',
          textAlign: "center",
          lineHeight: 1.15,
        }}
      >
        Kāda būs Tava
        <br />
        <span style={{ color: YELLOW }}>rītdiena?</span>
      </div>

      <div style={{ transform: `scale(${btnSpring * pulse})`, marginTop: 12 }}>
        <div
          style={{
            backgroundColor: YELLOW,
            color: BLACK,
            fontSize: 48,
            fontWeight: 800,
            fontFamily: '"Inter", sans-serif',
            padding: "28px 72px",
            borderRadius: 60,
            boxShadow: `0 8px 40px ${YELLOW}60`,
          }}
        >
          SĀKT PAR €19 →
        </div>
      </div>

      <div
        style={{
          opacity: interpolate(frame, [30, 42], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          fontSize: 24,
          color: "rgba(255,255,255,0.4)",
          fontFamily: '"Inter", sans-serif',
          marginTop: 4,
        }}
      >
        7 dienu naudas atgriešanas garantija
      </div>
    </AbsoluteFill>
  );
};

export const AIToolkitV6DayInLife: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BLACK }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={75}>
          <SceneTitle />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        <TransitionSeries.Sequence durationInFrames={140}>
          <SceneTimeline />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        <TransitionSeries.Sequence durationInFrames={85}>
          <SceneResult />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        <TransitionSeries.Sequence durationInFrames={80}>
          <SceneCTA />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
