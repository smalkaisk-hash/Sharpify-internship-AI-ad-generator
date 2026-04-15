/**
 * Sharpify Ad V7: "Two Options" — A/B Choice
 *
 * Shows the viewer two paths: Option A (do nothing, stay invisible)
 * vs Option B (get a website, start growing). Simple, direct,
 * makes the viewer pick a side. No bragging — just honesty.
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

const YELLOW = "#E8D500";
const BLACK = "#0a0a0a";
const RED = "#FF3B3B";
const GREEN = "#22C55E";
const DIM = "rgba(255,255,255,0.4)";

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
        gap: 20,
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
          maxWidth: 800,
        }}
      >
        Tev ir <span style={{ color: YELLOW }}>divas opcijas.</span>
      </div>

      <div
        style={{
          opacity: subSpring,
          fontSize: 32,
          color: DIM,
          fontFamily: '"Inter", sans-serif',
        }}
      >
        Kuru Tu izvēlēsies?
      </div>
    </AbsoluteFill>
  );
};

// --- Scene 2: Option A — do nothing ---
const SceneOptionA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelSpring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 200, stiffness: 100 },
  });

  const items = [
    "Turpini bez mājaslapas",
    "Klienti Tevi neatrod Google",
    "Konkurenti paņem Tavus klientus",
    "Nekas nemainās",
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BLACK,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        padding: 50,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, ${RED}06 0%, transparent 50%)`,
        }}
      />

      <div
        style={{
          opacity: labelSpring,
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 8,
        }}
      >
        <span style={{ fontSize: 48 }}>😴</span>
        <div
          style={{
            fontSize: 48,
            fontWeight: 800,
            color: DIM,
            fontFamily: '"Inter", sans-serif',
          }}
        >
          Opcija A: Nedarīt neko
        </div>
      </div>

      {items.map((item, i) => {
        const s = spring({
          frame: frame - 12 - i * 10,
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
              gap: 14,
              width: "100%",
              maxWidth: 750,
            }}
          >
            <span style={{ fontSize: 32, color: RED, flexShrink: 0 }}>✕</span>
            <span
              style={{
                fontSize: 38,
                fontWeight: 500,
                color: "rgba(255,255,255,0.5)",
                fontFamily: '"Inter", sans-serif',
              }}
            >
              {item}
            </span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// --- Scene 3: Option B — get a website ---
const SceneOptionB: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelSpring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 200, stiffness: 100 },
  });

  const items = [
    "Profesionāla mājaslapa 1-3 dienās",
    "Klienti Tevi atrod un uzticas",
    "Vairāk pieteikumu, vairāk darījumu",
    "Sākot no €59",
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BLACK,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        padding: 50,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, ${YELLOW}08 0%, transparent 50%)`,
        }}
      />

      <div
        style={{
          opacity: labelSpring,
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 8,
        }}
      >
        <span style={{ fontSize: 48 }}>🔥</span>
        <div
          style={{
            fontSize: 48,
            fontWeight: 800,
            color: YELLOW,
            fontFamily: '"Inter", sans-serif',
          }}
        >
          Opcija B: Rīkoties
        </div>
      </div>

      {items.map((item, i) => {
        const s = spring({
          frame: frame - 12 - i * 10,
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
              gap: 14,
              width: "100%",
              maxWidth: 750,
            }}
          >
            <span style={{ fontSize: 32, color: GREEN, flexShrink: 0 }}>✓</span>
            <span
              style={{
                fontSize: 38,
                fontWeight: 600,
                color: "white",
                fontFamily: '"Inter", sans-serif',
              }}
            >
              {item}
            </span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// --- Scene 4: CTA ---
const SceneChoiceCTA: React.FC = () => {
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
          background: `radial-gradient(circle at 50% 40%, ${YELLOW}10 0%, transparent 50%)`,
        }}
      />

      <div style={{ transform: `scale(${bearSpring})` }}>
        <Img
          src={staticFile("photos/sharpify/cropped/7.png")}
          style={{ width: 260, height: 260, objectFit: "contain" }}
        />
      </div>

      <div
        style={{
          opacity: textSpring,
          fontSize: 54,
          fontWeight: 800,
          color: "white",
          fontFamily: '"Inter", sans-serif',
          textAlign: "center",
          lineHeight: 1.15,
        }}
      >
        Es izvēlos <span style={{ color: YELLOW }}>B.</span>
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
          IEGŪSTI MĀJASLAPU →
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const SharpifyV7TrustBlitz: React.FC = () => {
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

        <TransitionSeries.Sequence durationInFrames={90}>
          <SceneOptionA />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        <TransitionSeries.Sequence durationInFrames={90}>
          <SceneOptionB />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        <TransitionSeries.Sequence durationInFrames={80}>
          <SceneChoiceCTA />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
