/**
 * AI Toolkit Ad V4: "What's Inside" — Unboxing Reveal
 *
 * Digital "unboxing" — shows each component of the toolkit popping in
 * with icons, sizes, descriptions. Satisfying, tactile, value stacking.
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
const GREEN = "#22C55E";

// --- Scene 1: The box opens ---
const SceneBoxOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const boxSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  const textSpring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const glowPulse = 0.5 + Math.sin(frame / 8) * 0.3;

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
          background: `radial-gradient(circle at 50% 50%, ${YELLOW}${Math.round(glowPulse * 24).toString(16).padStart(2, "0")} 0%, transparent 50%)`,
        }}
      />

      {/* Box emoji */}
      <div
        style={{
          transform: `scale(${boxSpring})`,
          fontSize: 200,
          filter: `drop-shadow(0 0 40px ${YELLOW}60)`,
        }}
      >
        📦
      </div>

      <div
        style={{
          opacity: textSpring,
          transform: `translateY(${(1 - textSpring) * 20}px)`,
          fontSize: 58,
          fontWeight: 800,
          color: "white",
          fontFamily: '"Inter", sans-serif',
          textAlign: "center",
          lineHeight: 1.15,
        }}
      >
        Kas ir iekšā?
      </div>

      <div
        style={{
          opacity: textSpring,
          fontSize: 30,
          color: "rgba(255,255,255,0.5)",
          fontFamily: '"Inter", sans-serif',
        }}
      >
        Atverām AI Rīku Komplektu.
      </div>
    </AbsoluteFill>
  );
};

// --- Scene 2: Items reveal one by one ---
const SceneItems: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const items = [
    { icon: "🎯", title: "128 slaidu prezentācija", desc: "Pilna AI sistēma — no pamatiem līdz ekspertam", delay: 0 },
    { icon: "⚙️", title: "27 AI skills", desc: "Mārketings • Pārdošana • Saturs • Automatizācija", delay: 22 },
    { icon: "🔄", title: "10 workflows", desc: "Automatizēti ķēdes uzdevumi", delay: 44 },
    { icon: "🎥", title: "74 min video apmācība", desc: "Soli pa solim — no nulles līdz gatavai sistēmai", delay: 66 },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BLACK,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        padding: 40,
      }}
    >
      {items.map((item, i) => {
        const s = spring({
          frame: frame - item.delay,
          fps,
          config: { damping: 14, stiffness: 150, mass: 0.7 },
        });

        return (
          <div
            key={i}
            style={{
              opacity: s,
              transform: `scale(${0.8 + s * 0.2}) translateX(${(1 - s) * -40}px)`,
              display: "flex",
              alignItems: "center",
              gap: 20,
              width: "100%",
              maxWidth: 780,
              backgroundColor: "rgba(255,255,255,0.04)",
              borderRadius: 16,
              padding: "18px 28px",
              border: `1px solid ${YELLOW}20`,
            }}
          >
            <div
              style={{
                fontSize: 56,
                flexShrink: 0,
                filter: `drop-shadow(0 0 15px ${YELLOW}30)`,
              }}
            >
              {item.icon}
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  color: "white",
                  fontFamily: '"Inter", sans-serif',
                  lineHeight: 1.2,
                }}
              >
                {item.title}
              </div>
              <div
                style={{
                  fontSize: 22,
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: '"Inter", sans-serif',
                  marginTop: 4,
                }}
              >
                {item.desc}
              </div>
            </div>

            <div
              style={{
                fontSize: 30,
                color: GREEN,
                opacity: interpolate(frame - item.delay, [10, 20], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                flexShrink: 0,
              }}
            >
              ✓
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// --- Scene 3: Value stack ---
const SceneValueStack: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const items = [
    { label: "128 slaidu prezentācija", value: "€49", delay: 0 },
    { label: "27 AI skills", value: "€99", delay: 12 },
    { label: "10 workflows", value: "€49", delay: 24 },
    { label: "Video apmācība", value: "€79", delay: 36 },
    { label: "CLAUDE.md šablons", value: "€29", delay: 48 },
  ];

  const totalSpring = spring({
    frame: frame - 65,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const strikeProgress = interpolate(frame, [80, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const newPriceSpring = spring({
    frame: frame - 97,
    fps,
    config: { damping: 12, stiffness: 180, mass: 0.7 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BLACK,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: 50,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, ${YELLOW}06 0%, transparent 50%)`,
        }}
      />

      <div
        style={{
          fontSize: 26,
          color: "rgba(255,255,255,0.4)",
          fontFamily: '"Inter", sans-serif',
          fontWeight: 500,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: 10,
        }}
      >
        Kopējā vērtība
      </div>

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
              transform: `translateX(${(1 - s) * 30}px)`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              width: "100%",
              maxWidth: 650,
              borderBottom: "1px dashed rgba(255,255,255,0.12)",
              paddingBottom: 6,
            }}
          >
            <span
              style={{
                fontSize: 28,
                color: "rgba(255,255,255,0.7)",
                fontFamily: '"Inter", sans-serif',
              }}
            >
              {item.label}
            </span>
            <span
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: "white",
                fontFamily: '"Inter", sans-serif',
              }}
            >
              {item.value}
            </span>
          </div>
        );
      })}

      {/* Total */}
      <div
        style={{
          opacity: totalSpring,
          transform: `translateY(${(1 - totalSpring) * 15}px)`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          width: "100%",
          maxWidth: 650,
          marginTop: 12,
          position: "relative",
        }}
      >
        <span
          style={{
            fontSize: 34,
            fontWeight: 800,
            color: "rgba(255,255,255,0.5)",
            fontFamily: '"Inter", sans-serif',
          }}
        >
          Kopā
        </span>
        <div style={{ position: "relative" }}>
          <span
            style={{
              fontSize: 52,
              fontWeight: 900,
              color: "rgba(255,255,255,0.4)",
              fontFamily: '"Inter", sans-serif',
            }}
          >
            €305
          </span>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "-10%",
              width: `${strikeProgress * 120}%`,
              height: 5,
              backgroundColor: "#FF3B3B",
              transform: "rotate(-8deg) translateY(-50%)",
              boxShadow: "0 0 12px #FF3B3B80",
              borderRadius: 2,
            }}
          />
        </div>
      </div>

      {/* New price */}
      <div
        style={{
          transform: `scale(${newPriceSpring})`,
          fontSize: 100,
          fontWeight: 900,
          color: YELLOW,
          fontFamily: '"Inter", sans-serif',
          textShadow: `0 0 40px ${YELLOW}40`,
          lineHeight: 1,
          marginTop: 8,
        }}
      >
        €19
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
        Viss par{" "}
        <span style={{ color: YELLOW }}>€19</span>.
        <br />
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 34 }}>
          Taupi 94%.
        </span>
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
          NOPIRKT KOMPLEKTU →
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const AIToolkitV4Unboxing: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BLACK }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={70}>
          <SceneBoxOpen />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        <TransitionSeries.Sequence durationInFrames={130}>
          <SceneItems />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        <TransitionSeries.Sequence durationInFrames={125}>
          <SceneValueStack />
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
