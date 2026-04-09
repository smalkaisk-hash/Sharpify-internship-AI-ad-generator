/**
 * Sharpify Ad V1: "€300 → €59" Price Slash
 *
 * Style: Bold, high-energy. The bear mascot introduces, then the price
 * gets dramatically slashed with a red line. Fast-paced, urgency-driven.
 * Format: 1080x1080, ~15s, Latvian
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
const BLACK = "#111111";
const RED = "#FF3B3B";
const GREEN = "#22C55E";
const WHITE = "#FFFFFF";

// --- Scene 1: Bear mascot + hook question ---
const SceneBearHook: React.FC = () => {
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

  const subSpring = spring({
    frame: frame - 22,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const bearBob = Math.sin(frame / 10) * 4;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BLACK,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
      }}
    >
      {/* Yellow accent glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 70%, ${YELLOW}12 0%, transparent 50%)`,
        }}
      />

      <div
        style={{
          transform: `scale(${bearSpring}) translateY(${bearBob}px)`,
          marginBottom: -10,
        }}
      >
        <Img
          src={staticFile("photos/sharpify/cropped/7.png")}
          style={{ width: 420, height: 420, objectFit: "contain" }}
        />
      </div>

      <div
        style={{
          opacity: textSpring,
          transform: `translateY(${(1 - textSpring) * 20}px)`,
          fontSize: 60,
          fontWeight: 800,
          color: WHITE,
          fontFamily: '"Inter", sans-serif',
          textAlign: "center",
          lineHeight: 1.15,
          maxWidth: 900,
        }}
      >
        Tev vajag mājaslapu,
        <br />
        <span style={{ color: YELLOW }}>kas patiešām piesaista klientus?</span>
      </div>

      <div
        style={{
          opacity: subSpring,
          fontSize: 34,
          color: "rgba(255,255,255,0.5)",
          fontFamily: '"Inter", sans-serif',
          marginTop: 16,
        }}
      >
        Profesionāla. Ātra. Par saprātīgu cenu. 👇
      </div>
    </AbsoluteFill>
  );
};

// --- Scene 2: Price slash animation ---
const ScenePriceSlash: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const oldPriceSpring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 200, stiffness: 100 },
  });

  // Slash line draws across at frame 25
  const slashProgress = interpolate(frame, [20, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const newPriceSpring = spring({
    frame: frame - 32,
    fps,
    config: { damping: 10, stiffness: 200, mass: 0.7 },
  });

  const shake =
    frame >= 32 && frame <= 36 ? Math.sin(frame * 30) * 4 : 0;

  const savingSpring = spring({
    frame: frame - 45,
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
          background: `radial-gradient(circle at 50% 50%, ${YELLOW}08 0%, transparent 60%)`,
        }}
      />

      <div
        style={{
          fontSize: 32,
          color: "rgba(255,255,255,0.4)",
          fontFamily: '"Inter", sans-serif',
          fontWeight: 500,
          letterSpacing: "0.1em",
          opacity: oldPriceSpring,
        }}
      >
        PROFESIONĀLA MĀJASLAPA
      </div>

      {/* Old price with slash */}
      <div style={{ position: "relative", opacity: oldPriceSpring }}>
        <div
          style={{
            fontSize: 120,
            fontWeight: 900,
            color: "rgba(255,255,255,0.25)",
            fontFamily: '"Inter", sans-serif',
          }}
        >
          €299
        </div>
        {/* Red slash line */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "-5%",
            width: `${slashProgress * 110}%`,
            height: 6,
            backgroundColor: RED,
            transform: "rotate(-12deg) translateY(-50%)",
            boxShadow: `0 0 20px ${RED}80`,
            borderRadius: 3,
          }}
        />
      </div>

      {/* New price - slams in */}
      <div
        style={{
          transform: `scale(${newPriceSpring}) translateX(${shake}px)`,
          fontSize: 150,
          fontWeight: 900,
          color: YELLOW,
          fontFamily: '"Inter", sans-serif',
          textShadow: `0 0 50px ${YELLOW}40`,
          lineHeight: 1,
        }}
      >
        €59
      </div>

      {/* Saving badge */}
      <div
        style={{
          opacity: savingSpring,
          transform: `scale(${savingSpring})`,
          backgroundColor: GREEN,
          color: WHITE,
          fontSize: 30,
          fontWeight: 700,
          fontFamily: '"Inter", sans-serif',
          padding: "14px 36px",
          borderRadius: 50,
          marginTop: 4,
        }}
      >
        Ietaupi €240
      </div>
    </AbsoluteFill>
  );
};

// --- Scene 3: What you get (rapid list) ---
const SceneWhatYouGet: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const items = [
    "Moderna, profesionāla mājaslapa",
    "Gatava 1-3 darba dienu laikā",
    "Optimizēta mobilajam",
    "Būvēta, lai iegūtu klientus",
  ];

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 100 },
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
      <div
        style={{
          opacity: titleSpring,
          fontSize: 52,
          fontWeight: 800,
          color: YELLOW,
          fontFamily: '"Inter", sans-serif',
          marginBottom: 12,
        }}
      >
        Ko Tu saņemsi:
      </div>

      {items.map((item, i) => {
        const s = spring({
          frame: frame - 8 - i * 10,
          fps,
          config: { damping: 200, stiffness: 120 },
        });

        return (
          <div
            key={i}
            style={{
              opacity: s,
              transform: `translateX(${(1 - s) * 50}px)`,
              display: "flex",
              alignItems: "center",
              gap: 14,
              width: "100%",
              maxWidth: 650,
            }}
          >
            <div
              style={{
                fontSize: 38,
                color: GREEN,
                flexShrink: 0,
              }}
            >
              ✓
            </div>
            <div
              style={{
                fontSize: 44,
                fontWeight: 600,
                color: WHITE,
                fontFamily: '"Inter", sans-serif',
              }}
            >
              {item}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// --- Scene 4: Social proof + CTA ---
const SceneSocialCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const statsSpring = spring({
    frame: frame - 3,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const ctaSpring = spring({
    frame: frame - 20,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const btnSpring = spring({
    frame: frame - 30,
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  const pulse = 1 + Math.sin(frame / 6) * 0.03;

  const urgencySpring = spring({
    frame: frame - 40,
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
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 40%, ${YELLOW}10 0%, transparent 55%)`,
        }}
      />

      {/* Trust stats */}
      <div
        style={{
          opacity: statsSpring,
          display: "flex",
          gap: 30,
          marginBottom: 8,
        }}
      >
        {[
          { num: "2 300+", label: "uzņēmumi" },
          { num: "1 000+", label: "atsauksmes" },
        ].map((stat, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 64,
                fontWeight: 800,
                color: YELLOW,
                fontFamily: '"Inter", sans-serif',
              }}
            >
              {stat.num}
            </div>
            <div
              style={{
                fontSize: 30,
                color: "rgba(255,255,255,0.5)",
                fontFamily: '"Inter", sans-serif',
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          opacity: ctaSpring,
          fontSize: 68,
          fontWeight: 800,
          color: WHITE,
          fontFamily: '"Inter", sans-serif',
          textAlign: "center",
          lineHeight: 1.15,
        }}
      >
        Iegūsti savu mājaslapu
        <br />
        <span style={{ color: YELLOW }}>par €59</span>
      </div>

      <div style={{ transform: `scale(${btnSpring * pulse})`, marginTop: 8 }}>
        <div
          style={{
            backgroundColor: YELLOW,
            color: BLACK,
            fontSize: 58,
            fontWeight: 800,
            fontFamily: '"Inter", sans-serif',
            padding: "32px 80px",
            borderRadius: 60,
            boxShadow: `0 10px 40px ${YELLOW}60`,
          }}
        >
          PASŪTĪT TAGAD →
        </div>
      </div>

      <div
        style={{
          opacity: urgencySpring,
          fontSize: 34,
          color: RED,
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
export const SharpifyV1PriceSlash: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BLACK }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={90}>
          <SceneBearHook />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        <TransitionSeries.Sequence durationInFrames={90}>
          <ScenePriceSlash />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: 8 })}
        />

        <TransitionSeries.Sequence durationInFrames={80}>
          <SceneWhatYouGet />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        <TransitionSeries.Sequence durationInFrames={85}>
          <SceneSocialCTA />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
