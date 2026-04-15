/**
 * AI Toolkit Ad V7: "Šī reklāma ir uztaisīta ar AI"
 *
 * Self-aware meta ad. Confesses upfront that this ad was made by AI,
 * then turns the camera on the viewer: your next ad/email/website can be too.
 * Terminal aesthetic, fake "generation" progress bar, intriguing reveal.
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
const TERMINAL_BG = "#1a1a1a";
const GREEN = "#22C55E";

// --- Scene 1: The confession ---
const SceneConfession: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Letters typed out
  const text = "Šī reklāma ir uztaisīta ar AI.";
  const charsShown = Math.min(text.length, Math.floor(frame / 1.8));
  const typed = text.slice(0, charsShown);
  const cursorBlink = Math.sin(frame / 4) > 0;

  const subSpring = spring({
    frame: frame - 65,
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
        gap: 24,
      }}
    >
      <div
        style={{
          fontSize: 60,
          fontWeight: 800,
          color: "white",
          fontFamily: '"Inter", sans-serif',
          textAlign: "center",
          lineHeight: 1.2,
          maxWidth: 850,
          padding: "0 50px",
        }}
      >
        {typed}
        {cursorBlink && charsShown < text.length && (
          <span style={{ color: YELLOW }}>|</span>
        )}
      </div>

      <div
        style={{
          opacity: subSpring,
          fontSize: 30,
          color: "rgba(255,255,255,0.5)",
          fontFamily: '"Inter", sans-serif',
          textAlign: "center",
        }}
      >
        Pat šis virsraksts. Pat šī mūzika. Viss.
      </div>
    </AbsoluteFill>
  );
};

// --- Scene 2: The terminal — generation in progress ---
const SceneGeneration: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelSpring = spring({
    frame: frame - 3,
    fps,
    config: { damping: 200, stiffness: 100 },
  });

  // Type the command
  const command = "/create-meta-ad";
  const cmdChars = Math.min(command.length, Math.floor((frame - 12) / 1.5));
  const cmdTyped = command.slice(0, Math.max(0, cmdChars));
  const cursorBlink = Math.sin(frame / 4) > 0;

  // Progress bar appears after command
  const progress = interpolate(frame, [40, 90], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Steps appear progressively
  const steps = [
    { text: "✓ Analyzing brand voice...", at: 45 },
    { text: "✓ Writing copy in Latvian...", at: 55 },
    { text: "✓ Designing scenes...", at: 65 },
    { text: "✓ Rendering video...", at: 75 },
    { text: "✓ Done.", at: 88, color: GREEN },
  ];

  const statSpring = spring({
    frame: frame - 95,
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
        gap: 20,
        padding: 40,
      }}
    >
      {/* Terminal window */}
      <div
        style={{
          opacity: labelSpring,
          width: "92%",
          maxWidth: 880,
          backgroundColor: TERMINAL_BG,
          borderRadius: 16,
          padding: "22px 30px",
          border: `1px solid ${YELLOW}25`,
          minHeight: 380,
        }}
      >
        {/* Window dots */}
        <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#ff5555" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#ffbb44" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#55cc55" }} />
        </div>

        {/* Prompt + command */}
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "baseline",
            marginBottom: 16,
          }}
        >
          <span
            style={{
              fontSize: 28,
              color: GREEN,
              fontFamily: "monospace",
              fontWeight: 700,
            }}
          >
            $
          </span>
          <span
            style={{
              fontSize: 32,
              color: YELLOW,
              fontFamily: "monospace",
              fontWeight: 700,
            }}
          >
            {cmdTyped}
            {cursorBlink && cmdChars < command.length && (
              <span style={{ color: YELLOW }}>|</span>
            )}
          </span>
        </div>

        {/* Output steps */}
        {steps.map((step, i) => {
          const visible = frame >= step.at;
          if (!visible) return null;
          return (
            <div
              key={i}
              style={{
                fontSize: 24,
                color: step.color || "rgba(255,255,255,0.7)",
                fontFamily: "monospace",
                marginBottom: 6,
                fontWeight: step.color ? 700 : 400,
              }}
            >
              {step.text}
            </div>
          );
        })}

        {/* Progress bar */}
        {frame >= 40 && (
          <div
            style={{
              marginTop: 16,
              height: 8,
              backgroundColor: "rgba(255,255,255,0.08)",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                backgroundColor: YELLOW,
                boxShadow: `0 0 10px ${YELLOW}80`,
              }}
            />
          </div>
        )}
      </div>

      {/* Stats below */}
      <div
        style={{
          opacity: statSpring,
          transform: `scale(${statSpring})`,
          display: "flex",
          gap: 30,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 36,
              fontWeight: 900,
              color: YELLOW,
              fontFamily: '"Inter", sans-serif',
            }}
          >
            12 sek
          </div>
          <div
            style={{
              fontSize: 18,
              color: "rgba(255,255,255,0.5)",
              fontFamily: '"Inter", sans-serif',
            }}
          >
            ģenerēšanas laiks
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 36,
              fontWeight: 900,
              color: YELLOW,
              fontFamily: '"Inter", sans-serif',
            }}
          >
            €0,03
          </div>
          <div
            style={{
              fontSize: 18,
              color: "rgba(255,255,255,0.5)",
              fontFamily: '"Inter", sans-serif',
            }}
          >
            izmaksas
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// --- Scene 3: Turn the camera on the viewer ---
const SceneCameraTurn: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerSpring = spring({
    frame: frame - 3,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const items = [
    "Tava nākamā Instagram reklāma",
    "Tavi nākamie e-pasti klientiem",
    "Tava nākamā prezentācija",
    "Viss saturs Tavam biznesam",
  ];

  const concludeSpring = spring({
    frame: frame - 70,
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
          opacity: headerSpring,
          fontSize: 46,
          fontWeight: 800,
          color: "white",
          fontFamily: '"Inter", sans-serif',
          textAlign: "center",
          lineHeight: 1.15,
          marginBottom: 6,
        }}
      >
        Var arī <span style={{ color: YELLOW }}>Tavējais.</span>
      </div>

      {items.map((item, i) => {
        const s = spring({
          frame: frame - 14 - i * 10,
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
              alignItems: "center",
              gap: 14,
              width: "100%",
              maxWidth: 720,
            }}
          >
            <span style={{ fontSize: 26, color: GREEN, flexShrink: 0 }}>✓</span>
            <span
              style={{
                fontSize: 32,
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

      <div
        style={{
          opacity: concludeSpring,
          fontSize: 30,
          color: "rgba(255,255,255,0.6)",
          fontFamily: '"Inter", sans-serif',
          textAlign: "center",
          marginTop: 12,
          fontStyle: "italic",
        }}
      >
        Tā pati sistēma. Tādi paši rezultāti.
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
    frame: frame - 18,
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
          fontSize: 60,
          fontWeight: 800,
          color: "white",
          fontFamily: '"Inter", sans-serif',
          textAlign: "center",
          lineHeight: 1.15,
        }}
      >
        Iegūsti to pašu sistēmu.
        <br />
        <span style={{ color: YELLOW }}>€19.</span>
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
          IEGŪT TAGAD →
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const AIToolkitV7MadeByAI: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BLACK }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={100}>
          <SceneConfession />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        <TransitionSeries.Sequence durationInFrames={130}>
          <SceneGeneration />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        <TransitionSeries.Sequence durationInFrames={105}>
          <SceneCameraTurn />
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
