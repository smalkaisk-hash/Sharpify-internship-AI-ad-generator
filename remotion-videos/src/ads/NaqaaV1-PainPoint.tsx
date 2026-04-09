/**
 * Naqaa Beauty Ad V1: "Tava āda jūt visu" (Your skin feels everything)
 *
 * Style: Dark, cinematic, text-heavy opener that punches with the problem
 * then reveals the product as the hero. High contrast, dramatic.
 * Format: 1080x1080 feed ad, 15 seconds
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

const GOLD = "#B8960C";
const TEAL = "#0097B2";
const DARK = "#0a0a0a";

// --- Kinetic text scene: words slam in one by one ---
const SceneKineticHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = [
    { text: "HLORS.", delay: 5, color: "#ff4444" },
    { text: "RŪSA.", delay: 18, color: "#ff8844" },
    { text: "SMAGIE", delay: 31, color: "#ffaa44" },
    { text: "METĀLI.", delay: 38, color: "#ffaa44" },
  ];

  const questionOpacity = spring({
    frame: frame - 55,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: DARK,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
    >
      {/* Subtle grain overlay */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(0,150,178,0.06) 0%, transparent 70%)",
        }}
      />

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "12px 20px",
          maxWidth: 800,
          padding: 40,
        }}
      >
        {words.map((w, i) => {
          const s = spring({
            frame: frame - w.delay,
            fps,
            config: { damping: 15, stiffness: 300, mass: 0.6 },
          });

          const shake =
            frame > w.delay && frame < w.delay + 4
              ? Math.sin(frame * 40) * 3
              : 0;

          return (
            <span
              key={i}
              style={{
                fontSize: 88,
                fontWeight: 900,
                fontFamily: '"Playfair Display", serif',
                color: w.color,
                opacity: s,
                transform: `scale(${0.3 + s * 0.7}) translateX(${shake}px)`,
                letterSpacing: "0.02em",
                textShadow: `0 0 40px ${w.color}40`,
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>

      <div
        style={{
          opacity: questionOpacity,
          fontSize: 36,
          color: "rgba(255,255,255,0.5)",
          fontFamily: '"Inter", sans-serif',
          fontWeight: 300,
          marginTop: 10,
        }}
      >
        Tas viss ir Tavā dušas ūdenī.
      </div>
    </AbsoluteFill>
  );
};

// --- Product reveal with glow ---
const SceneProductReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const revealScale = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 60, mass: 1.2 },
  });

  const glowPulse = 0.4 + Math.sin(frame / 10) * 0.15;
  const floatY = Math.sin(frame / 12) * 5;

  const textOpacity = spring({
    frame: frame - 20,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 60%, ${TEAL}15 0%, ${DARK} 70%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          transform: `scale(${revealScale}) translateY(${floatY}px)`,
          filter: `drop-shadow(0 0 80px ${TEAL}${Math.round(glowPulse * 255).toString(16).padStart(2, "0")})`,
        }}
      >
        <Img
          src={staticFile("photos/naqaa-beauty/product-lineup-all-4.jpg")}
          style={{
            width: 550,
            height: 550,
            objectFit: "cover",
            borderRadius: 20,
          }}
        />
      </div>

      <div
        style={{
          opacity: textOpacity,
          marginTop: 30,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 44,
            fontWeight: 700,
            color: "white",
            fontFamily: '"Playfair Display", serif',
          }}
        >
          Risinājums ir vienkāršs.
        </div>
        <div
          style={{
            fontSize: 28,
            color: GOLD,
            fontFamily: '"Inter", sans-serif',
            fontWeight: 500,
            marginTop: 8,
          }}
        >
          Vitaminizētie dušas filtri
        </div>
      </div>
    </AbsoluteFill>
  );
};

// --- Rapid benefit flash ---
const SceneBenefitFlash: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const benefits = [
    "Attīra ūdeni no hlora",
    "Vitaminizē ar C un E",
    "4 aromātu izvēle",
    "Maigāka āda no 1. dienas",
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: DARK,
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
          background: `linear-gradient(180deg, ${TEAL}08 0%, ${DARK} 50%, ${GOLD}08 100%)`,
        }}
      />

      {benefits.map((b, i) => {
        const enter = spring({
          frame: frame - i * 12,
          fps,
          config: { damping: 200, stiffness: 120 },
        });

        return (
          <div
            key={i}
            style={{
              opacity: enter,
              transform: `translateX(${(1 - enter) * 60}px)`,
              display: "flex",
              alignItems: "center",
              gap: 16,
              width: "100%",
              maxWidth: 650,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: GOLD,
                flexShrink: 0,
                boxShadow: `0 0 16px ${GOLD}80`,
              }}
            />
            <div
              style={{
                fontSize: 38,
                fontWeight: 600,
                color: "white",
                fontFamily: '"Inter", sans-serif',
              }}
            >
              {b}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// --- Price + CTA ---
const SceneCTADramatic: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const taglineSpring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const priceSpring = spring({
    frame: frame - 18,
    fps,
    config: { damping: 12, stiffness: 200 },
  });

  const btnPulse = 1 + Math.sin(frame / 6) * 0.03;

  const btnSpring = spring({
    frame: frame - 28,
    fps,
    config: { damping: 14, stiffness: 150 },
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 40%, ${TEAL}20 0%, ${DARK} 60%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
      }}
    >
      <div
        style={{
          opacity: taglineSpring,
          transform: `translateY(${(1 - taglineSpring) * 20}px)`,
          fontSize: 52,
          fontWeight: 700,
          color: "white",
          fontFamily: '"Playfair Display", serif',
          textAlign: "center",
          lineHeight: 1.2,
          maxWidth: 700,
        }}
      >
        Dāvā savai ādai
        <br />
        <span style={{ color: GOLD }}>dabisku mirdzumu.</span>
      </div>

      <div
        style={{
          transform: `scale(${priceSpring})`,
          fontSize: 64,
          fontWeight: 800,
          color: "white",
          fontFamily: '"Inter", sans-serif',
          marginTop: 12,
        }}
      >
        No{" "}
        <span style={{ color: GOLD, fontSize: 72 }}>24,99€</span>
      </div>

      <div
        style={{
          marginTop: 20,
          transform: `scale(${btnSpring * btnPulse})`,
        }}
      >
        <div
          style={{
            backgroundColor: GOLD,
            color: "white",
            fontSize: 30,
            fontWeight: 700,
            fontFamily: '"Inter", sans-serif',
            padding: "18px 52px",
            borderRadius: 50,
            boxShadow: `0 6px 30px ${GOLD}60`,
            letterSpacing: "0.06em",
          }}
        >
          IEPIRKTIES TAGAD
        </div>
      </div>

      <div
        style={{
          opacity: interpolate(frame, [35, 45], [0, 0.4], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          fontSize: 20,
          color: "rgba(255,255,255,0.4)",
          fontFamily: '"Inter", sans-serif',
          marginTop: 10,
        }}
      >
        naqaa-beauty.com
      </div>
    </AbsoluteFill>
  );
};

// --- Main composition ---
export const NaqaaV1PainPoint: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={90}>
          <SceneKineticHook />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        <TransitionSeries.Sequence durationInFrames={90}>
          <SceneProductReveal />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        <TransitionSeries.Sequence durationInFrames={90}>
          <SceneBenefitFlash />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 12 })}
        />

        <TransitionSeries.Sequence durationInFrames={85}>
          <SceneCTADramatic />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
