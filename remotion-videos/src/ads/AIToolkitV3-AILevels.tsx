/**
 * AI Toolkit Ad V3: "5 AI Levels — Where are you?"
 *
 * Based on the website's "Kurā līmenī esi Tu?" section. Shows 5 levels
 * of AI usage, asks viewer where they're at, then shows the toolkit
 * jumps them to level 5. Gamified, progression aesthetic.
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
const GREEN = "#22C55E";
const BLUE = "#4A9EFF";

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
    frame: frame - 22,
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
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 40%, ${BLUE}08 0%, transparent 50%)`,
        }}
      />

      <div
        style={{
          opacity: textSpring,
          transform: `translateY(${(1 - textSpring) * 20}px)`,
          fontSize: 64,
          fontWeight: 800,
          color: "white",
          fontFamily: '"Inter", sans-serif',
          textAlign: "center",
          lineHeight: 1.15,
        }}
      >
        Kurā AI līmenī
        <br />
        <span style={{ color: YELLOW }}>esi Tu?</span>
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
        Ir 5 līmeņi. Lielākā daļa ir 1. vai 2.
      </div>
    </AbsoluteFill>
  );
};

// --- Scene 2: The 5 levels ---
const SceneLevels: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const levels = [
    { num: "1", title: "ChatGPT hobijs", desc: "Dažreiz lūdz padomus", color: "rgba(255,255,255,0.3)" },
    { num: "2", title: "Kopē prompt-us", desc: "Meklē internetā", color: "rgba(255,255,255,0.4)" },
    { num: "3", title: "Pamata rīki", desc: "Pāris ChatGPT custom GPT", color: "rgba(255,255,255,0.6)" },
    { num: "4", title: "Claude Code", desc: "Sāk izmantot skills", color: BLUE },
    { num: "5", title: "AI sistēma", desc: "Autonomi aģenti, viss sakārtots", color: YELLOW },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BLACK,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        padding: 40,
      }}
    >
      {levels.map((level, i) => {
        const s = spring({
          frame: frame - i * 12,
          fps,
          config: { damping: 200, stiffness: 100 },
        });

        const isTop = i === 4;

        return (
          <div
            key={i}
            style={{
              opacity: s,
              transform: `translateX(${(1 - s) * 50}px)`,
              display: "flex",
              alignItems: "center",
              gap: 18,
              width: "100%",
              maxWidth: 780,
              backgroundColor: isTop ? "rgba(232,213,0,0.08)" : "rgba(255,255,255,0.03)",
              borderRadius: 14,
              padding: "14px 24px",
              border: `1px solid ${isTop ? YELLOW + "40" : "rgba(255,255,255,0.08)"}`,
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                backgroundColor: isTop ? YELLOW : "rgba(255,255,255,0.08)",
                color: isTop ? BLACK : level.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                fontWeight: 900,
                fontFamily: '"Inter", sans-serif',
                flexShrink: 0,
              }}
            >
              {level.num}
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 30,
                  fontWeight: 700,
                  color: isTop ? "white" : level.color,
                  fontFamily: '"Inter", sans-serif',
                }}
              >
                {level.title}
              </div>
              <div
                style={{
                  fontSize: 22,
                  color: isTop ? YELLOW : "rgba(255,255,255,0.4)",
                  fontFamily: '"Inter", sans-serif',
                }}
              >
                {level.desc}
              </div>
            </div>

            {isTop && (
              <div
                style={{
                  fontSize: 30,
                  color: YELLOW,
                }}
              >
                🎯
              </div>
            )}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// --- Scene 3: The jump ---
const SceneJump: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Arrow fills from left (level 1) to right (level 5)
  const arrowProgress = spring({
    frame: frame - 15,
    fps,
    config: { damping: 200, stiffness: 50 },
  });

  const textSpring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const resultSpring = spring({
    frame: frame - 50,
    fps,
    config: { damping: 14, stiffness: 180 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BLACK,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
        padding: 50,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, ${YELLOW}10 0%, transparent 50%)`,
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
        AI Rīku Komplekts
        <br />
        <span style={{ color: YELLOW }}>pārvieto Tevi uz 5. līmeni.</span>
      </div>

      {/* Level progression bar */}
      <div
        style={{
          width: "90%",
          maxWidth: 720,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {[1, 2, 3, 4, 5].map((n, i) => {
          const filled = arrowProgress > i / 5;
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: 60,
                borderRadius: 12,
                backgroundColor: filled ? YELLOW : "rgba(255,255,255,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                fontWeight: 900,
                color: filled ? BLACK : "rgba(255,255,255,0.3)",
                fontFamily: '"Inter", sans-serif',
                transition: "all 0.3s",
                boxShadow: filled ? `0 0 20px ${YELLOW}40` : "none",
              }}
            >
              {n}
            </div>
          );
        })}
      </div>

      <div
        style={{
          transform: `scale(${resultSpring})`,
          fontSize: 40,
          fontWeight: 800,
          color: GREEN,
          fontFamily: '"Inter", sans-serif',
          textAlign: "center",
        }}
      >
        Bez mācībām. Bez stundām YouTube.
      </div>
    </AbsoluteFill>
  );
};

// --- Scene 4: CTA ---
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bearSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  const textSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const btnSpring = spring({
    frame: frame - 20,
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  const pulse = 1 + Math.sin(frame / 6) * 0.03;

  const bearBob = Math.sin(frame / 10) * 4;

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
          background: `radial-gradient(circle at 50% 40%, ${YELLOW}12 0%, transparent 50%)`,
        }}
      />

      <div
        style={{
          transform: `scale(${bearSpring}) translateY(${bearBob}px)`,
        }}
      >
        <Img
          src={staticFile("photos/sharpify/cropped/12.png")}
          style={{ width: 260, height: 260, objectFit: "contain" }}
        />
      </div>

      <div
        style={{
          opacity: textSpring,
          fontSize: 52,
          fontWeight: 800,
          color: "white",
          fontFamily: '"Inter", sans-serif',
          textAlign: "center",
          lineHeight: 1.15,
        }}
      >
        No <span style={{ color: "rgba(255,255,255,0.4)" }}>€99</span> tikai{" "}
        <span style={{ color: YELLOW }}>€19</span>
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
          SĀKT TAGAD →
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const AIToolkitV3AILevels: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BLACK }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={75}>
          <SceneQuestion />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        <TransitionSeries.Sequence durationInFrames={120}>
          <SceneLevels />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        <TransitionSeries.Sequence durationInFrames={100}>
          <SceneJump />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        <TransitionSeries.Sequence durationInFrames={85}>
          <SceneCTA />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
