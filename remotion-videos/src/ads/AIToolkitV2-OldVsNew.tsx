/**
 * AI Toolkit Ad V2: "Old Way vs New Way" — Terminal Demo
 *
 * Shows the old way (writing prompts from scratch, chaos) vs the new way
 * (one skill command → instant result). Terminal/code aesthetic.
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
import { slide } from "@remotion/transitions/slide";

const YELLOW = "#E8D500";
const BLACK = "#0a0a0a";
const TERMINAL_BG = "#1a1a1a";
const GREEN = "#22C55E";
const RED = "#FF3B3B";

// --- Scene 1: The old way — chaos ---
const SceneOldWay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelSpring = spring({
    frame: frame - 3,
    fps,
    config: { damping: 200, stiffness: 100 },
  });

  // Typing animation for messy prompt
  const typedText = "Hey ChatGPT, can you help me write a marketing post for my business, it should be about...";
  const charsShown = Math.min(typedText.length, Math.floor((frame - 15) / 1.2));
  const typed = typedText.slice(0, Math.max(0, charsShown));

  const cursorBlink = Math.sin(frame / 4) > 0;

  const frustrationSpring = spring({
    frame: frame - 95,
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
        padding: 50,
      }}
    >
      <div
        style={{
          opacity: labelSpring,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 40 }}>😫</span>
        <div
          style={{
            fontSize: 44,
            fontWeight: 800,
            color: RED,
            fontFamily: '"Inter", sans-serif',
          }}
        >
          Vecais veids
        </div>
      </div>

      {/* Fake chat window */}
      <div
        style={{
          width: "90%",
          maxWidth: 820,
          backgroundColor: TERMINAL_BG,
          borderRadius: 16,
          padding: "20px 28px",
          border: "1px solid rgba(255,255,255,0.08)",
          minHeight: 260,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 6,
            marginBottom: 16,
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#ff5555" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#ffbb44" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#55cc55" }} />
        </div>

        <div
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.85)",
            fontFamily: "monospace",
            lineHeight: 1.4,
            whiteSpace: "pre-wrap",
          }}
        >
          {typed}
          {cursorBlink && charsShown < typedText.length && (
            <span style={{ color: YELLOW }}>|</span>
          )}
        </div>
      </div>

      <div
        style={{
          opacity: frustrationSpring,
          fontSize: 32,
          color: RED,
          fontFamily: '"Inter", sans-serif',
          fontWeight: 700,
          textAlign: "center",
        }}
      >
        2 stundas vēlāk... joprojām neder.
      </div>
    </AbsoluteFill>
  );
};

// --- Scene 2: The new way — one command ---
const SceneNewWay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelSpring = spring({
    frame: frame - 3,
    fps,
    config: { damping: 200, stiffness: 100 },
  });

  // Fast typing of the command
  const command = "/marketing-post";
  const charsShown = Math.min(command.length, Math.floor((frame - 15) / 1.5));
  const typed = command.slice(0, Math.max(0, charsShown));

  const cursorBlink = Math.sin(frame / 4) > 0;

  // Output appears after command
  const outputSpring = spring({
    frame: frame - 50,
    fps,
    config: { damping: 200, stiffness: 100 },
  });

  const doneSpring = spring({
    frame: frame - 85,
    fps,
    config: { damping: 12, stiffness: 180 },
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
        padding: 50,
      }}
    >
      <div
        style={{
          opacity: labelSpring,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 40 }}>⚡</span>
        <div
          style={{
            fontSize: 44,
            fontWeight: 800,
            color: YELLOW,
            fontFamily: '"Inter", sans-serif',
          }}
        >
          Jaunais veids
        </div>
      </div>

      {/* Terminal window */}
      <div
        style={{
          width: "90%",
          maxWidth: 820,
          backgroundColor: TERMINAL_BG,
          borderRadius: 16,
          padding: "20px 28px",
          border: `1px solid ${YELLOW}20`,
          minHeight: 260,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 6,
            marginBottom: 16,
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#ff5555" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#ffbb44" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#55cc55" }} />
        </div>

        <div
          style={{
            fontSize: 34,
            fontFamily: "monospace",
            lineHeight: 1.4,
            color: YELLOW,
            fontWeight: 700,
          }}
        >
          {typed}
          {cursorBlink && charsShown < command.length && (
            <span style={{ color: YELLOW }}>|</span>
          )}
        </div>

        {/* Output */}
        <div
          style={{
            opacity: outputSpring,
            marginTop: 20,
            paddingTop: 16,
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              fontSize: 24,
              color: "rgba(255,255,255,0.5)",
              fontFamily: "monospace",
              marginBottom: 6,
            }}
          >
            ✓ Analyzing brand...
          </div>
          <div
            style={{
              fontSize: 24,
              color: "rgba(255,255,255,0.5)",
              fontFamily: "monospace",
              marginBottom: 6,
            }}
          >
            ✓ Writing post...
          </div>
          <div
            style={{
              fontSize: 24,
              color: GREEN,
              fontFamily: "monospace",
              fontWeight: 700,
            }}
          >
            ✓ Done in 8 seconds.
          </div>
        </div>
      </div>

      <div
        style={{
          opacity: doneSpring,
          transform: `scale(${doneSpring})`,
          fontSize: 34,
          color: GREEN,
          fontFamily: '"Inter", sans-serif',
          fontWeight: 700,
          textAlign: "center",
        }}
      >
        8 sekundes. Perfekti. ✨
      </div>
    </AbsoluteFill>
  );
};

// --- Scene 3: What's in the toolkit ---
const SceneToolkit: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerSpring = spring({
    frame: frame - 3,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const items = [
    { num: "27", label: "AI skills", delay: 10 },
    { num: "10", label: "workflows", delay: 20 },
    { num: "128", label: "slaidi", delay: 30 },
    { num: "74 min", label: "video apmācība", delay: 40 },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BLACK,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        padding: 40,
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
          fontSize: 48,
          fontWeight: 800,
          color: "white",
          fontFamily: '"Inter", sans-serif',
          textAlign: "center",
          lineHeight: 1.15,
        }}
      >
        AI Rīku Komplekts
        <br />
        <span style={{ color: YELLOW }}>satur visu.</span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 18,
          width: "100%",
          maxWidth: 720,
        }}
      >
        {items.map((item, i) => {
          const s = spring({
            frame: frame - item.delay,
            fps,
            config: { damping: 200, stiffness: 120 },
          });

          return (
            <div
              key={i}
              style={{
                opacity: s,
                transform: `scale(${0.85 + s * 0.15})`,
                backgroundColor: "rgba(255,255,255,0.04)",
                borderRadius: 16,
                padding: "20px 24px",
                border: "1px solid rgba(255,255,255,0.08)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 52,
                  fontWeight: 900,
                  color: YELLOW,
                  fontFamily: '"Inter", sans-serif',
                }}
              >
                {item.num}
              </div>
              <div
                style={{
                  fontSize: 24,
                  color: "rgba(255,255,255,0.6)",
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 500,
                }}
              >
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// --- Scene 4: Price + CTA ---
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const priceSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 180, mass: 0.7 },
  });

  const textSpring = spring({
    frame: frame - 12,
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
        gap: 14,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 40%, ${YELLOW}12 0%, transparent 50%)`,
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            position: "relative",
            opacity: priceSpring,
          }}
        >
          <span
            style={{
              fontSize: 52,
              fontWeight: 700,
              color: "rgba(255,255,255,0.25)",
              fontFamily: '"Inter", sans-serif',
            }}
          >
            €99
          </span>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "-5%",
              width: `${interpolate(frame, [8, 18], [0, 110], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}%`,
              height: 4,
              backgroundColor: RED,
              transform: "rotate(-12deg) translateY(-50%)",
              borderRadius: 2,
            }}
          />
        </div>

        <span
          style={{
            transform: `scale(${priceSpring})`,
            fontSize: 130,
            fontWeight: 900,
            color: YELLOW,
            fontFamily: '"Inter", sans-serif',
            textShadow: `0 0 40px ${YELLOW}40`,
            lineHeight: 1,
          }}
        >
          €19
        </span>
      </div>

      <div
        style={{
          opacity: textSpring,
          fontSize: 40,
          fontWeight: 700,
          color: "white",
          fontFamily: '"Inter", sans-serif',
          textAlign: "center",
        }}
      >
        Mūžīga piekļuve. Bez abonementa.
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

export const AIToolkitV2OldVsNew: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BLACK }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={130}>
          <SceneOldWay />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        <TransitionSeries.Sequence durationInFrames={115}>
          <SceneNewWay />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        <TransitionSeries.Sequence durationInFrames={85}>
          <SceneToolkit />
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
