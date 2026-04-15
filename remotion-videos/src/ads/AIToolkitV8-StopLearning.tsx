/**
 * AI Toolkit Ad V8: "Beidz mācīties AI. Sāc to lietot."
 *
 * Hot take / paradox. Provocative opening that flips the script.
 * Shows YouTube tutorials, books, courses being crossed out.
 * Replaces with: ready-to-use skills. Stop being a student, start being a user.
 * Format: 1080x1080, ~13s, Latvian
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
import { slide } from "@remotion/transitions/slide";

const YELLOW = "#E8D500";
const BLACK = "#0a0a0a";
const RED = "#FF3B3B";
const GREEN = "#22C55E";

// --- Scene 1: The provocative hook ---
const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // First line slams in, then second line follows
  const line1Spring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 14, stiffness: 180, mass: 0.7 },
  });

  const line2Spring = spring({
    frame: frame - 35,
    fps,
    config: { damping: 14, stiffness: 180, mass: 0.7 },
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
      <div
        style={{
          opacity: line1Spring,
          transform: `scale(${line1Spring})`,
          fontSize: 84,
          fontWeight: 900,
          color: RED,
          fontFamily: '"Inter", sans-serif',
          textAlign: "center",
          lineHeight: 1,
          textShadow: `0 0 30px ${RED}30`,
        }}
      >
        Beidz mācīties AI.
      </div>

      <div
        style={{
          opacity: line2Spring,
          transform: `scale(${line2Spring})`,
          fontSize: 72,
          fontWeight: 800,
          color: YELLOW,
          fontFamily: '"Inter", sans-serif',
          textAlign: "center",
          lineHeight: 1.1,
          marginTop: 12,
          textShadow: `0 0 30px ${YELLOW}30`,
        }}
      >
        Sāc to lietot.
      </div>
    </AbsoluteFill>
  );
};

// --- Scene 2: The trap — what people are doing wrong ---
const SceneTrap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerSpring = spring({
    frame: frame - 3,
    fps,
    config: { damping: 200, stiffness: 100 },
  });

  const items = [
    { emoji: "📺", text: "47 stundas YouTube tutorials" },
    { emoji: "📚", text: "12 ChatGPT prompt e-grāmatas" },
    { emoji: "🎓", text: "3 \"AI mastery\" kursi" },
    { emoji: "🤔", text: "Joprojām neviens projekts pabeigts" },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BLACK,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
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
          opacity: headerSpring,
          fontSize: 36,
          fontWeight: 700,
          color: "rgba(255,255,255,0.5)",
          fontFamily: '"Inter", sans-serif',
          textAlign: "center",
          marginBottom: 12,
        }}
      >
        Atpazīsti?
      </div>

      {items.map((item, i) => {
        const s = spring({
          frame: frame - 12 - i * 12,
          fps,
          config: { damping: 200, stiffness: 120 },
        });

        // Strike through after appearing (only first 3)
        const strikeProgress = i < 3
          ? interpolate(frame, [12 + i * 12 + 25, 12 + i * 12 + 35], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          : 0;

        return (
          <div
            key={i}
            style={{
              opacity: s,
              transform: `translateX(${(1 - s) * 40}px)`,
              display: "flex",
              alignItems: "center",
              gap: 18,
              width: "100%",
              maxWidth: 800,
              backgroundColor: "rgba(255,255,255,0.04)",
              borderRadius: 14,
              padding: "16px 26px",
              border: i === 3 ? `1px solid ${RED}40` : "1px solid rgba(255,255,255,0.08)",
              position: "relative",
            }}
          >
            <span style={{ fontSize: 44 }}>{item.emoji}</span>
            <span
              style={{
                fontSize: 32,
                fontWeight: 600,
                color: i === 3 ? RED : "rgba(255,255,255,0.7)",
                fontFamily: '"Inter", sans-serif',
                textDecoration: strikeProgress > 0.5 ? "line-through" : "none",
                textDecorationColor: `${RED}80`,
                flex: 1,
              }}
            >
              {item.text}
            </span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// --- Scene 3: The flip — just use ready skills ---
const SceneFlip: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerSpring = spring({
    frame: frame - 3,
    fps,
    config: { damping: 14, stiffness: 180 },
  });

  const items = [
    { num: "1.", text: "Instalē 27 gatavus AI skills" },
    { num: "2.", text: "Ievadi komandu" },
    { num: "3.", text: "Iegūsti rezultātu uzreiz" },
  ];

  const punchSpring = spring({
    frame: frame - 70,
    fps,
    config: { damping: 14, stiffness: 180, mass: 0.7 },
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
          opacity: headerSpring,
          transform: `scale(${headerSpring})`,
          fontSize: 50,
          fontWeight: 800,
          color: "white",
          fontFamily: '"Inter", sans-serif',
          textAlign: "center",
          lineHeight: 1.15,
          marginBottom: 8,
        }}
      >
        Vai vienkārši...
      </div>

      {items.map((item, i) => {
        const s = spring({
          frame: frame - 18 - i * 14,
          fps,
          config: { damping: 200, stiffness: 120 },
        });

        return (
          <div
            key={i}
            style={{
              opacity: s,
              transform: `translateX(${(1 - s) * -40}px)`,
              display: "flex",
              alignItems: "center",
              gap: 16,
              width: "100%",
              maxWidth: 720,
            }}
          >
            <span
              style={{
                fontSize: 44,
                fontWeight: 900,
                color: YELLOW,
                fontFamily: '"Inter", sans-serif',
                minWidth: 50,
              }}
            >
              {item.num}
            </span>
            <span
              style={{
                fontSize: 36,
                fontWeight: 700,
                color: "white",
                fontFamily: '"Inter", sans-serif',
              }}
            >
              {item.text}
            </span>
          </div>
        );
      })}

      <div
        style={{
          opacity: punchSpring,
          transform: `scale(${punchSpring})`,
          fontSize: 32,
          color: GREEN,
          fontFamily: '"Inter", sans-serif',
          fontWeight: 700,
          marginTop: 16,
          textAlign: "center",
        }}
      >
        Bez teorijas. Bez stundām YouTube.
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
    frame: frame - 22,
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
        gap: 12,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 40%, ${YELLOW}12 0%, transparent 50%)`,
        }}
      />

      <div style={{ transform: `scale(${bearSpring})` }}>
        <Img
          src={staticFile("photos/sharpify/cropped/7.png")}
          style={{ width: 280, height: 280, objectFit: "contain" }}
        />
      </div>

      <div
        style={{
          opacity: textSpring,
          fontSize: 56,
          fontWeight: 800,
          color: "white",
          fontFamily: '"Inter", sans-serif',
          textAlign: "center",
          lineHeight: 1.15,
        }}
      >
        Sāc lietot AI <span style={{ color: YELLOW }}>šodien.</span>
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
          IEGŪT KOMPLEKTU →
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const AIToolkitV8StopLearning: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BLACK }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={90}>
          <SceneHook />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        <TransitionSeries.Sequence durationInFrames={120}>
          <SceneTrap />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        <TransitionSeries.Sequence durationInFrames={100}>
          <SceneFlip />
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
