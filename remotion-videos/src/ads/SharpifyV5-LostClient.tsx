/**
 * Sharpify Ad V5: "Lost Client" — Pain Point Story
 *
 * Mini dramatic story: A potential client searches for your business,
 * finds an ugly/no website, and goes to the competitor. Dark, punchy,
 * text-driven storytelling with typing effects and dramatic reveals.
 * Format: 1080x1080, ~15s, Latvian
 */
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  Img,
  staticFile,
} from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";

const YELLOW = "#E8D500";
const BLACK = "#0a0a0a";
const RED = "#FF3B3B";
const GREY = "#888888";
const DIM = "rgba(255,255,255,0.4)";

// --- Scene 1: Google search simulation ---
const SceneGoogleSearch: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const searchText = "santehniķis rīgā";
  const charsShown = Math.min(
    searchText.length,
    Math.floor(frame / 2.5)
  );
  const displayText = searchText.slice(0, charsShown);

  const cursorBlink = Math.sin(frame / 4) > 0;

  const resultSpring = spring({
    frame: frame - 50,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const noSiteSpring = spring({
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
        padding: 50,
      }}
    >
      {/* Fake search bar */}
      <div
        style={{
          width: "85%",
          backgroundColor: "rgba(255,255,255,0.08)",
          borderRadius: 40,
          padding: "20px 36px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          border: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <span style={{ fontSize: 32, color: DIM }}>🔍</span>
        <span
          style={{
            fontSize: 36,
            color: "white",
            fontFamily: '"Inter", sans-serif',
            fontWeight: 500,
          }}
        >
          {displayText}
          {cursorBlink && (
            <span style={{ color: YELLOW, fontWeight: 300 }}>|</span>
          )}
        </span>
      </div>

      {/* Search result */}
      <div
        style={{
          opacity: resultSpring,
          transform: `translateY(${(1 - resultSpring) * 15}px)`,
          width: "85%",
          backgroundColor: "rgba(255,255,255,0.05)",
          borderRadius: 20,
          padding: "24px 32px",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: "#7BA4DB",
            fontFamily: '"Inter", sans-serif',
            fontWeight: 600,
          }}
        >
          Jānis Santehnika SIA
        </div>
        <div
          style={{
            fontSize: 22,
            color: DIM,
            fontFamily: '"Inter", sans-serif',
            marginTop: 6,
          }}
        >
          Nav mājaslapas pieejamas
        </div>
      </div>

      {/* Verdict */}
      <div
        style={{
          opacity: noSiteSpring,
          transform: `scale(${noSiteSpring})`,
          fontSize: 52,
          fontWeight: 800,
          color: RED,
          fontFamily: '"Inter", sans-serif',
          textAlign: "center",
        }}
      >
        Klients aizgāja pie konkurenta.
      </div>
    </AbsoluteFill>
  );
};

// --- Scene 2: The stats of what you're losing ---
const SceneLosing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lines = [
    { text: "63% klientu pārbauda mājaslapu pirms pirkuma", delay: 5 },
    { text: "Nav lapas = nav uzticamības", delay: 22 },
    { text: "Lēta lapa = lēts pakalpojums viņu acīs", delay: 39 },
  ];

  const punchSpring = spring({
    frame: frame - 62,
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
        gap: 28,
        padding: 60,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, ${RED}06 0%, transparent 50%)`,
        }}
      />

      {lines.map((line, i) => {
        const s = spring({
          frame: frame - line.delay,
          fps,
          config: { damping: 200, stiffness: 100 },
        });

        return (
          <div
            key={i}
            style={{
              opacity: s,
              transform: `translateX(${(1 - s) * 40}px)`,
              display: "flex",
              alignItems: "center",
              gap: 16,
              width: "100%",
              maxWidth: 800,
            }}
          >
            <div style={{ fontSize: 32, color: RED, flexShrink: 0 }}>✕</div>
            <div
              style={{
                fontSize: 40,
                fontWeight: 600,
                color: "white",
                fontFamily: '"Inter", sans-serif',
                lineHeight: 1.2,
              }}
            >
              {line.text}
            </div>
          </div>
        );
      })}

      <div
        style={{
          opacity: punchSpring,
          transform: `translateY(${(1 - punchSpring) * 15}px)`,
          fontSize: 34,
          color: DIM,
          fontFamily: '"Inter", sans-serif',
          fontStyle: "italic",
          textAlign: "center",
          marginTop: 8,
        }}
      >
        Cik klientu Tu zaudēji šomēnes?
      </div>
    </AbsoluteFill>
  );
};

// --- Scene 3: The fix ---
const SceneFix: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bearSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  const textSpring = spring({
    frame: frame - 12,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const items = [
    "Profesionāla mājaslapa 1-3 dienās",
    "Sākot no €59",
    "2 300+ uzņēmumi jau uzticas mums",
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
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 35%, ${YELLOW}10 0%, transparent 50%)`,
        }}
      />

      <div style={{ transform: `scale(${bearSpring})` }}>
        <Img
          src={staticFile("photos/sharpify/cropped/10.png")}
          style={{ width: 280, height: 280, objectFit: "contain" }}
        />
      </div>

      <div
        style={{
          opacity: textSpring,
          fontSize: 48,
          fontWeight: 800,
          color: "white",
          fontFamily: '"Inter", sans-serif',
          textAlign: "center",
        }}
      >
        Mēs to <span style={{ color: YELLOW }}>salabosim.</span>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          marginTop: 8,
        }}
      >
        {items.map((item, i) => {
          const s = spring({
            frame: frame - 20 - i * 10,
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
                gap: 12,
              }}
            >
              <span style={{ fontSize: 30, color: "#22C55E" }}>✓</span>
              <span
                style={{
                  fontSize: 36,
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
      </div>
    </AbsoluteFill>
  );
};

// --- Scene 4: CTA ---
const ScenePainCTA: React.FC = () => {
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
        gap: 20,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 40%, ${YELLOW}10 0%, transparent 50%)`,
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
        Beidz zaudēt klientus.
        <br />
        <span style={{ color: YELLOW }}>Sāc šodien.</span>
      </div>

      <div style={{ transform: `scale(${btnSpring * pulse})`, marginTop: 8 }}>
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

export const SharpifyV5LostClient: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BLACK }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={105}>
          <SceneGoogleSearch />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        <TransitionSeries.Sequence durationInFrames={100}>
          <SceneLosing />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        <TransitionSeries.Sequence durationInFrames={90}>
          <SceneFix />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        <TransitionSeries.Sequence durationInFrames={80}>
          <ScenePainCTA />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
