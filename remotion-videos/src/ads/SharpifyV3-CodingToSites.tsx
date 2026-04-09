/**
 * Sharpify Ad V3: "Bear Codes → Websites Appear"
 *
 * The bear with the chalkboard "codes" a website → transition reveals
 * the 4 real portfolio sites one by one dropping in like cards.
 * Vivid purple/yellow/teal gradients throughout. Price slash at end.
 * Format: 1080x1080, ~16s, Latvian
 */
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

const YELLOW = "#E8D500";
const PURPLE = "#7C3AED";
const TEAL = "#06B6D4";
const DARK = "#0F0A1E";
const PINK = "#EC4899";

// --- Scene 1: Bear "coding" with typing animation ---
const SceneBearCoding: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bearSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.9 },
  });

  // Fake code lines appearing
  const codeLines = [
    { text: "<html>", delay: 12, color: PINK },
    { text: '  <div class="hero">', delay: 20, color: TEAL },
    { text: "    Tava mājaslapa", delay: 28, color: YELLOW },
    { text: "  </div>", delay: 36, color: TEAL },
    { text: "  █ building...", delay: 44, color: "#22C55E" },
  ];

  const titleSpring = spring({
    frame: frame - 55,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${DARK} 0%, #1E1145 40%, ${PURPLE}30 100%)`,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
        gap: 30,
      }}
    >
      {/* Animated gradient orbs */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 20% 80%, ${PURPLE}20 0%, transparent 40%), radial-gradient(circle at 80% 20%, ${TEAL}15 0%, transparent 40%)`,
        }}
      />

      {/* Bear (chalkboard pose = teaching/coding) */}
      <div style={{ transform: `scale(${bearSpring})`, flexShrink: 0 }}>
        <Img
          src={staticFile("photos/sharpify/cropped/8.png")}
          style={{ width: 400, height: 400, objectFit: "contain" }}
        />
      </div>

      {/* Code terminal */}
      <div
        style={{
          backgroundColor: "rgba(0,0,0,0.6)",
          borderRadius: 16,
          padding: "20px 24px",
          border: `1px solid ${PURPLE}40`,
          boxShadow: `0 0 40px ${PURPLE}20`,
          minWidth: 460,
        }}
      >
        {/* Terminal header dots */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#FF5F57" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#FEBC2E" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#28C840" }} />
        </div>

        {codeLines.map((line, i) => {
          const s = spring({
            frame: frame - line.delay,
            fps,
            config: { damping: 200, stiffness: 150 },
          });

          return (
            <div
              key={i}
              style={{
                opacity: s,
                transform: `translateX(${(1 - s) * 20}px)`,
                fontSize: 28,
                fontFamily: '"Courier New", monospace',
                color: line.color,
                fontWeight: 600,
                lineHeight: 1.8,
                whiteSpace: "pre",
              }}
            >
              {line.text}
            </div>
          );
        })}
      </div>

      {/* Bottom text */}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          opacity: titleSpring,
          fontSize: 36,
          color: "rgba(255,255,255,0.6)",
          fontFamily: '"Inter", sans-serif',
          fontWeight: 500,
        }}
      >
        Mēs būvējam Tavu mājaslapu...
      </div>
    </AbsoluteFill>
  );
};

// --- Scene 2: Portfolio cards drop in ---
const ScenePortfolioReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sites = [
    { img: "photos/sharpify/portfolio-sportfactory.png", label: "Sporta klubs" },
    { img: "photos/sharpify/portfolio-security.png", label: "Drošības uzņēmums" },
    { img: "photos/sharpify/portfolio-vaditajuskola.png", label: "Apmācību bizness" },
    { img: "photos/sharpify/portfolio-mryeti.png", label: "Evakuatora serviss" },
  ];

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${DARK} 0%, #1A0F30 40%, ${PURPLE}15 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 30,
        gap: 18,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 30%, ${TEAL}10 0%, transparent 50%)`,
        }}
      />

      <div
        style={{
          opacity: titleSpring,
          fontSize: 48,
          fontWeight: 800,
          color: "white",
          fontFamily: '"Inter", sans-serif',
          textAlign: "center",
          marginBottom: 4,
        }}
      >
        Ko Tu <span style={{ color: YELLOW }}>saņemsi</span>:
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          width: "100%",
          maxWidth: 700,
        }}
      >
        {sites.map((site, i) => {
          const cardSpring = spring({
            frame: frame - 8 - i * 12,
            fps,
            config: { damping: 14, stiffness: 120, mass: 0.7 },
          });

          return (
            <div
              key={i}
              style={{
                opacity: cardSpring,
                transform: `translateY(${(1 - cardSpring) * 60}px) scale(${0.85 + cardSpring * 0.15})`,
                borderRadius: 14,
                overflow: "hidden",
                border: `1px solid ${PURPLE}30`,
                boxShadow: `0 8px 30px rgba(0,0,0,0.4)`,
              }}
            >
              <Img
                src={staticFile(site.img)}
                style={{
                  width: "100%",
                  height: 220,
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <div
                style={{
                  backgroundColor: "rgba(0,0,0,0.7)",
                  padding: "8px 12px",
                  fontSize: 24,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.8)",
                  fontFamily: '"Inter", sans-serif',
                  textAlign: "center",
                }}
              >
                {site.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// --- Scene 3: Price slash with vivid gradient ---
const SceneVividPrice: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const oldPriceSpring = spring({
    frame: frame - 3,
    fps,
    config: { damping: 200, stiffness: 100 },
  });

  const slashProgress = interpolate(frame, [15, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const newPriceSpring = spring({
    frame: frame - 28,
    fps,
    config: { damping: 10, stiffness: 200, mass: 0.7 },
  });

  const shake = frame >= 28 && frame <= 32 ? Math.sin(frame * 30) * 5 : 0;

  // Animated gradient hue shift
  const hueShift = frame * 0.8;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${135 + hueShift * 0.3}deg, ${DARK} 0%, #2D1B69 35%, ${PURPLE}40 60%, ${TEAL}20 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
    >
      {/* Animated glow orbs */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${50 + Math.sin(frame / 20) * 10}% ${40 + Math.cos(frame / 15) * 10}%, ${YELLOW}15 0%, transparent 40%), radial-gradient(circle at ${30 + Math.cos(frame / 25) * 15}% ${60 + Math.sin(frame / 18) * 10}%, ${PINK}10 0%, transparent 35%)`,
        }}
      />

      <div
        style={{
          opacity: oldPriceSpring,
          fontSize: 28,
          color: "rgba(255,255,255,0.5)",
          fontFamily: '"Inter", sans-serif',
          fontWeight: 600,
          letterSpacing: "0.1em",
        }}
      >
        PROFESIONĀLA MĀJASLAPA
      </div>

      {/* Old price */}
      <div style={{ position: "relative", opacity: oldPriceSpring }}>
        <div
          style={{
            fontSize: 110,
            fontWeight: 900,
            color: "rgba(255,255,255,0.2)",
            fontFamily: '"Inter", sans-serif',
          }}
        >
          €299
        </div>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "-5%",
            width: `${slashProgress * 110}%`,
            height: 6,
            background: `linear-gradient(90deg, ${PINK}, #FF3B3B)`,
            transform: "rotate(-12deg) translateY(-50%)",
            boxShadow: `0 0 20px ${PINK}80`,
            borderRadius: 3,
          }}
        />
      </div>

      {/* New price */}
      <div
        style={{
          transform: `scale(${newPriceSpring}) translateX(${shake}px)`,
          fontSize: 140,
          fontWeight: 900,
          color: YELLOW,
          fontFamily: '"Inter", sans-serif',
          textShadow: `0 0 50px ${YELLOW}50, 0 0 100px ${YELLOW}20`,
          lineHeight: 1,
        }}
      >
        €59
      </div>

      <div
        style={{
          opacity: interpolate(frame, [35, 45], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          fontSize: 32,
          color: "rgba(255,255,255,0.6)",
          fontFamily: '"Inter", sans-serif',
          marginTop: 4,
        }}
      >
        Vienreizējs maksājums • Gatava 1-3 dienās
      </div>
    </AbsoluteFill>
  );
};

// --- Scene 4: CTA with bear + vivid gradient ---
const SceneVividCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bearSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.9 },
  });

  const textSpring = spring({
    frame: frame - 8,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const btnSpring = spring({
    frame: frame - 20,
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  const pulse = 1 + Math.sin(frame / 5) * 0.03;
  const hueShift = frame * 0.5;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${150 + hueShift * 0.2}deg, ${DARK} 0%, #1E0A3E 30%, ${PURPLE}30 60%, ${TEAL}15 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 60%, ${YELLOW}08 0%, transparent 40%)`,
        }}
      />

      {/* Thumbs up bear */}
      <div style={{ transform: `scale(${bearSpring})` }}>
        <Img
          src={staticFile("photos/sharpify/cropped/15.png")}
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
          lineHeight: 1.2,
          maxWidth: 650,
        }}
      >
        Beidz zaudēt klientus.
        <br />
        <span
          style={{
            background: `linear-gradient(90deg, ${YELLOW}, ${TEAL})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Iegūsti mājaslapu šodien.
        </span>
      </div>

      <div style={{ transform: `scale(${btnSpring * pulse})`, marginTop: 12 }}>
        <div
          style={{
            background: `linear-gradient(135deg, ${YELLOW}, #F59E0B)`,
            color: DARK,
            fontSize: 48,
            fontWeight: 800,
            fontFamily: '"Inter", sans-serif',
            padding: "28px 72px",
            borderRadius: 50,
            boxShadow: `0 8px 30px ${YELLOW}60, 0 0 60px ${YELLOW}20`,
          }}
        >
          PASŪTĪT PAR €59 →
        </div>
      </div>

      <div
        style={{
          opacity: interpolate(frame, [28, 38], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          fontSize: 28,
          color: "#FF4444",
          fontFamily: '"Inter", sans-serif',
          fontWeight: 600,
          marginTop: 6,
        }}
      >
        ⚡ Tikai 4 vietas palikušas šonedēļ
      </div>
    </AbsoluteFill>
  );
};

// --- Main composition ---
export const SharpifyV3CodingToSites: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={95}>
          <SceneBearCoding />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 12 })}
        />

        <TransitionSeries.Sequence durationInFrames={105}>
          <ScenePortfolioReveal />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        <TransitionSeries.Sequence durationInFrames={80}>
          <SceneVividPrice />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        <TransitionSeries.Sequence durationInFrames={80}>
          <SceneVividCTA />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
