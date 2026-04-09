/**
 * Naqaa Beauty Ad V3: "Sajūti atšķirību" (Feel the difference)
 *
 * Style: Split-screen transformation. Left = problem (desaturated, cold),
 * Right = solution (warm, glowing). The divider animates across revealing
 * the transformation. Ends with product hero + CTA.
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
} from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";

const GOLD = "#B8960C";
const TEAL = "#0097B2";
const DARK = "#0a0a0a";

// --- Split screen comparison ---
const SceneSplitReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Divider moves from left to center
  const dividerPos = interpolate(frame, [0, 40], [0, 50], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const beforeItems = [
    { text: "Sausa, jutīga āda", delay: 10 },
    { text: "Nedzīvi, blāvi mati", delay: 18 },
    { text: "Hlora smaka", delay: 26 },
  ];

  const afterItems = [
    { text: "Mīksta, mirdzoša āda", delay: 45 },
    { text: "Spīdīgi, veselīgi mati", delay: 53 },
    { text: "Aromterapijas efekts", delay: 61 },
  ];

  const labelBeforeSpring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 200, stiffness: 100 },
  });

  const labelAfterSpring = spring({
    frame: frame - 38,
    fps,
    config: { damping: 200, stiffness: 100 },
  });

  return (
    <AbsoluteFill>
      {/* Before side - cold, dark */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(180deg, #1a1a2e 0%, #0d0d1a 100%)",
          clipPath: `inset(0 ${100 - dividerPos}% 0 0)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "50%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            padding: 40,
          }}
        >
          <div
            style={{
              opacity: labelBeforeSpring,
              fontSize: 20,
              fontWeight: 700,
              color: "rgba(255,255,255,0.3)",
              fontFamily: '"Inter", sans-serif',
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Bez filtra
          </div>

          {beforeItems.map((item, i) => {
            const s = spring({
              frame: frame - item.delay,
              fps,
              config: { damping: 200, stiffness: 100 },
            });
            return (
              <div
                key={i}
                style={{
                  opacity: s,
                  transform: `translateY(${(1 - s) * 15}px)`,
                  fontSize: 30,
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 400,
                  textAlign: "center",
                }}
              >
                {item.text}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* After side - warm, glowing */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${TEAL}15 0%, #0a1a20 100%)`,
          clipPath: `inset(0 0 0 ${dividerPos}%)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "50%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            padding: 40,
          }}
        >
          <div
            style={{
              opacity: labelAfterSpring,
              fontSize: 20,
              fontWeight: 700,
              color: GOLD,
              fontFamily: '"Inter", sans-serif',
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Ar Naqaa
          </div>

          {afterItems.map((item, i) => {
            const s = spring({
              frame: frame - item.delay,
              fps,
              config: { damping: 200, stiffness: 100 },
            });
            return (
              <div
                key={i}
                style={{
                  opacity: s,
                  transform: `translateY(${(1 - s) * 15}px)`,
                  fontSize: 30,
                  color: "white",
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 600,
                  textAlign: "center",
                }}
              >
                {item.text}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* Center divider line */}
      <div
        style={{
          position: "absolute",
          left: `${dividerPos}%`,
          top: "10%",
          bottom: "10%",
          width: 3,
          backgroundColor: GOLD,
          boxShadow: `0 0 20px ${GOLD}60`,
          transform: "translateX(-50%)",
        }}
      />
    </AbsoluteFill>
  );
};

// --- Product hero with all 4 filters ---
const SceneProductHero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const heroScale = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 60, mass: 1.2 },
  });

  const textSpring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const floatY = Math.sin(frame / 13) * 5;
  const glow = 0.3 + Math.sin(frame / 10) * 0.1;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 50%, ${TEAL}12 0%, ${DARK} 70%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          transform: `scale(${heroScale}) translateY(${floatY}px)`,
          filter: `drop-shadow(0 0 60px ${TEAL}${Math.round(glow * 255).toString(16).padStart(2, "0")})`,
        }}
      >
        <Img
          src={staticFile("photos/all-filters.jpg")}
          style={{
            width: 520,
            height: 520,
            objectFit: "cover",
            borderRadius: 20,
          }}
        />
      </div>

      <div
        style={{
          opacity: textSpring,
          textAlign: "center",
          marginTop: 24,
        }}
      >
        <div
          style={{
            fontSize: 40,
            fontWeight: 700,
            color: "white",
            fontFamily: '"Playfair Display", serif',
          }}
        >
          Vitaminizētie dušas filtri
        </div>
        <div
          style={{
            fontSize: 26,
            color: GOLD,
            fontFamily: '"Inter", sans-serif',
            fontWeight: 500,
            marginTop: 6,
          }}
        >
          4 smaržas • No 34,99€
        </div>
      </div>
    </AbsoluteFill>
  );
};

// --- Final CTA with urgency ---
const SceneFinalCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mainSpring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const bonusSpring = spring({
    frame: frame - 18,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const btnSpring = spring({
    frame: frame - 28,
    fps,
    config: { damping: 14, stiffness: 150 },
  });

  const pulse = 1 + Math.sin(frame / 6) * 0.025;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 40%, ${TEAL}18 0%, ${DARK} 65%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
      }}
    >
      <div
        style={{
          opacity: mainSpring,
          transform: `translateY(${(1 - mainSpring) * 20}px)`,
          fontSize: 50,
          fontWeight: 700,
          color: "white",
          fontFamily: '"Playfair Display", serif',
          textAlign: "center",
          lineHeight: 1.2,
        }}
      >
        Sajūti atšķirību
        <br />
        <span style={{ color: GOLD }}>jau pēc pirmās reizes.</span>
      </div>

      <div
        style={{
          opacity: bonusSpring,
          fontSize: 24,
          color: "rgba(255,255,255,0.6)",
          fontFamily: '"Inter", sans-serif',
          textAlign: "center",
          marginTop: 4,
        }}
      >
        Dāvanu kaste bez maksas pirkumiem virs 100€
      </div>

      <div style={{ transform: `scale(${btnSpring * pulse})`, marginTop: 16 }}>
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
            letterSpacing: "0.05em",
          }}
        >
          PASŪTĪT TAGAD
        </div>
      </div>

      <div
        style={{
          opacity: interpolate(frame, [35, 45], [0, 0.35], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          fontSize: 18,
          color: "rgba(255,255,255,0.35)",
          fontFamily: '"Inter", sans-serif',
          marginTop: 8,
        }}
      >
        naqaa-beauty.com
      </div>
    </AbsoluteFill>
  );
};

// --- Main composition ---
export const NaqaaV3BeforeAfter: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={110}>
          <SceneSplitReveal />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-left" })}
          timing={linearTiming({ durationInFrames: 12 })}
        />

        <TransitionSeries.Sequence durationInFrames={100}>
          <SceneProductHero />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        <TransitionSeries.Sequence durationInFrames={85}>
          <SceneFinalCTA />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
