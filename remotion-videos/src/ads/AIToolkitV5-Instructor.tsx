/**
 * AI Toolkit Ad V5: "Who's Teaching You?" — Instructor Authority
 *
 * Shows that Niks Jansons is the one behind the toolkit, with credentials
 * flying in. Establishes authority without feeling braggy — it's about
 * who's teaching, not about them as a company.
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
        gap: 18,
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
        Pirms Tu pērc
        <br />
        <span style={{ color: YELLOW }}>AI kursu internetā...</span>
      </div>

      <div
        style={{
          opacity: subSpring,
          fontSize: 34,
          color: "rgba(255,255,255,0.5)",
          fontFamily: '"Inter", sans-serif',
          textAlign: "center",
        }}
      >
        Pajautā: kas Tevi māca?
      </div>
    </AbsoluteFill>
  );
};

// --- Scene 2: Random "gurus" vs the real one ---
const SceneGurus: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const gurus = [
    { emoji: "🤵", label: "\"AI guru\" no YouTube", result: "Pārdod kursus, nevis lieto AI" },
    { emoji: "📱", label: "TikTok influencers", result: "Reklamē to, ko viņam samaksā" },
    { emoji: "🎓", label: "Universitātes lektors", result: "Teorija, nevis prakse" },
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
      <div
        style={{
          opacity: spring({ frame, fps, config: { damping: 200, stiffness: 100 } }),
          fontSize: 32,
          color: "rgba(255,255,255,0.4)",
          fontFamily: '"Inter", sans-serif',
          fontWeight: 500,
          marginBottom: 4,
        }}
      >
        Vairums "AI ekspertu" ir:
      </div>

      {gurus.map((guru, i) => {
        const s = spring({
          frame: frame - 10 - i * 14,
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
              gap: 18,
              width: "100%",
              maxWidth: 750,
              backgroundColor: "rgba(255,255,255,0.04)",
              borderRadius: 14,
              padding: "16px 24px",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span style={{ fontSize: 40 }}>{guru.emoji}</span>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.8)",
                  fontFamily: '"Inter", sans-serif',
                }}
              >
                {guru.label}
              </div>
              <div
                style={{
                  fontSize: 22,
                  color: "rgba(255,255,255,0.4)",
                  fontFamily: '"Inter", sans-serif',
                  fontStyle: "italic",
                }}
              >
                {guru.result}
              </div>
            </div>
            <span style={{ fontSize: 30, color: "#FF3B3B" }}>✕</span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// --- Scene 3: The real deal ---
const SceneNiks: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bearSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  const nameSpring = spring({
    frame: frame - 12,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const creds = [
    "2 300+ apkalpoti uzņēmumi",
    "€50M+ saģenerēti klientiem",
    "Forbes 30 Under 30",
    "1.3M+ pieteikumi ar AI",
  ];

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

      <div
        style={{
          opacity: spring({ frame: frame - 2, fps, config: { damping: 200, stiffness: 100 } }),
          fontSize: 26,
          color: YELLOW,
          fontFamily: '"Inter", sans-serif',
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        Tavs instruktors
      </div>

      <div style={{ transform: `scale(${bearSpring})` }}>
        <Img
          src={staticFile("photos/sharpify/cropped/7.png")}
          style={{ width: 260, height: 260, objectFit: "contain" }}
        />
      </div>

      <div
        style={{
          opacity: nameSpring,
          fontSize: 52,
          fontWeight: 800,
          color: "white",
          fontFamily: '"Inter", sans-serif',
          textAlign: "center",
        }}
      >
        Niks Jansons
      </div>

      <div
        style={{
          opacity: nameSpring,
          fontSize: 24,
          color: "rgba(255,255,255,0.5)",
          fontFamily: '"Inter", sans-serif',
          marginTop: -4,
        }}
      >
        Uzņēmējs · AI eksperts · Spīkeris
      </div>

      {/* Credentials */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginTop: 10,
          alignItems: "flex-start",
        }}
      >
        {creds.map((cred, i) => {
          const s = spring({
            frame: frame - 25 - i * 8,
            fps,
            config: { damping: 200, stiffness: 120 },
          });

          return (
            <div
              key={i}
              style={{
                opacity: s,
                transform: `translateX(${(1 - s) * 20}px)`,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ fontSize: 24, color: GREEN }}>✓</span>
              <span
                style={{
                  fontSize: 28,
                  color: "white",
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 600,
                }}
              >
                {cred}
              </span>
            </div>
          );
        })}
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
          fontSize: 54,
          fontWeight: 800,
          color: "white",
          fontFamily: '"Inter", sans-serif',
          textAlign: "center",
          lineHeight: 1.15,
        }}
      >
        Mācies no tā,
        <br />
        <span style={{ color: YELLOW }}>kas patiešām lieto AI.</span>
      </div>

      <div
        style={{
          opacity: textSpring,
          fontSize: 32,
          color: "rgba(255,255,255,0.5)",
          fontFamily: '"Inter", sans-serif',
        }}
      >
        No €99 tikai €19
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

export const AIToolkitV5Instructor: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BLACK }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={80}>
          <SceneQuestion />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        <TransitionSeries.Sequence durationInFrames={100}>
          <SceneGurus />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        <TransitionSeries.Sequence durationInFrames={115}>
          <SceneNiks />
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
