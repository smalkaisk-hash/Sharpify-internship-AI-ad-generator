/**
 * Sharpify Ad V2: "Bear Presenter" — Mascot-driven storytelling
 *
 * The bear appears in different poses across scenes, acting as a presenter/guide.
 * Animated entrance for each pose. Story: problem → solution → proof → CTA.
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

// --- Scene 1: Cool bear (sunglasses) + bold statement ---
const SceneCoolBear: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bearSlide = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 60, mass: 1.2 },
  });

  const textSpring = spring({
    frame: frame - 12,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const subSpring = spring({
    frame: frame - 24,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BLACK,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
        gap: 20,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 30% 60%, ${YELLOW}10 0%, transparent 50%)`,
        }}
      />

      {/* Bear on the left */}
      <div
        style={{
          transform: `translateX(${(1 - bearSlide) * -100}px)`,
          opacity: bearSlide,
          flexShrink: 0,
        }}
      >
        <Img
          src={staticFile("photos/sharpify/cropped/9.png")}
          style={{ width: 440, height: 440, objectFit: "contain" }}
        />
      </div>

      {/* Text on the right */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          maxWidth: 520,
        }}
      >
        <div
          style={{
            opacity: textSpring,
            transform: `translateX(${(1 - textSpring) * 30}px)`,
            fontSize: 58,
            fontWeight: 800,
            color: "white",
            fontFamily: '"Inter", sans-serif',
            lineHeight: 1.15,
          }}
        >
          Tava mājaslapa
          <br />
          <span style={{ color: YELLOW }}>izskatās novecojusi?</span>
        </div>

        <div
          style={{
            opacity: subSpring,
            fontSize: 32,
            color: "rgba(255,255,255,0.5)",
            fontFamily: '"Inter", sans-serif',
          }}
        >
          Klienti to redz. Un aiziet.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// --- Scene 2: Pointing bear + the solution ---
const ScenePointingBear: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bearSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  const cardSpring = spring({
    frame: frame - 12,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const items = [
    { icon: "⚡", text: "Gatava 1-3 dienās" },
    { icon: "📱", text: "Mobilā optimizēta" },
    { icon: "🎯", text: "Individuāls dizains" },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BLACK,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 70% 50%, ${YELLOW}08 0%, transparent 50%)`,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 30,
        }}
      >
        {/* Cards on the left */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
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
                  transform: `translateX(${(1 - s) * -40}px)`,
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  backgroundColor: "rgba(255,255,255,0.06)",
                  borderRadius: 14,
                  padding: "14px 24px",
                  border: `1px solid ${YELLOW}20`,
                }}
              >
                <span style={{ fontSize: 38 }}>{item.icon}</span>
                <span
                  style={{
                    fontSize: 36,
                    fontWeight: 600,
                    color: "white",
                    fontFamily: '"Inter", sans-serif',
                  }}
                >
                  {item.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* Pointing bear on the right */}
        <div
          style={{
            transform: `scale(${bearSpring})`,
            flexShrink: 0,
          }}
        >
          <Img
            src={staticFile("photos/sharpify/cropped/7.png")}
            style={{ width: 400, height: 400, objectFit: "contain" }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// --- Scene 3: Flexing bear + trust stats ---
const SceneFlexBear: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bearSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.9 },
  });

  const stats = [
    { num: "2 300+", label: "uzņēmumi", delay: 10 },
    { num: "26", label: "valstis", delay: 18 },
    { num: "1 000+", label: "atsauksmes", delay: 26 },
  ];

  const featuredSpring = spring({
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
        gap: 16,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 30%, ${YELLOW}10 0%, transparent 50%)`,
        }}
      />

      {/* Flexing bear */}
      <div style={{ transform: `scale(${bearSpring})` }}>
        <Img
          src={staticFile("photos/sharpify/cropped/12.png")}
          style={{ width: 320, height: 320, objectFit: "contain" }}
        />
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 40, marginTop: 4 }}>
        {stats.map((stat, i) => {
          const s = spring({
            frame: frame - stat.delay,
            fps,
            config: { damping: 200, stiffness: 100 },
          });

          const countProgress = interpolate(
            frame,
            [stat.delay, stat.delay + 20],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          const targetNum = parseFloat(stat.num.replace(/[+ ]/g, ""));
          const displayNum =
            Math.round(targetNum * countProgress).toLocaleString("lv-LV");
          const suffix = stat.num.includes("+") ? "+" : "";

          return (
            <div
              key={i}
              style={{
                opacity: s,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 58,
                  fontWeight: 900,
                  color: YELLOW,
                  fontFamily: '"Inter", sans-serif',
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {displayNum}
                {suffix}
              </div>
              <div
                style={{
                  fontSize: 26,
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: '"Inter", sans-serif',
                }}
              >
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Forbes badge */}
      <div
        style={{
          opacity: featuredSpring,
          fontSize: 28,
          color: "rgba(255,255,255,0.35)",
          fontFamily: '"Inter", sans-serif',
          fontWeight: 500,
          marginTop: 8,
          letterSpacing: "0.05em",
        }}
      >
        Par mums rakstīja Forbes, Dienas Bizness u.c.
      </div>
    </AbsoluteFill>
  );
};

// --- Scene 4: Thumbs up bear + CTA ---
const SceneThumbsCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bearSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  const priceSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const btnSpring = spring({
    frame: frame - 22,
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  const pulse = 1 + Math.sin(frame / 6) * 0.03;

  const slashWidth = interpolate(frame, [12, 18], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BLACK,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 40%, ${YELLOW}12 0%, transparent 50%)`,
        }}
      />

      <div style={{ transform: `scale(${bearSpring})` }}>
        <Img
          src={staticFile("photos/sharpify/cropped/10.png")}
          style={{ width: 300, height: 300, objectFit: "contain" }}
        />
      </div>

      <div
        style={{
          opacity: priceSpring,
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div style={{ position: "relative" }}>
          <span
            style={{
              fontSize: 54,
              fontWeight: 700,
              color: "rgba(255,255,255,0.25)",
              fontFamily: '"Inter", sans-serif',
            }}
          >
            €300
          </span>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              width: `${slashWidth}%`,
              height: 6,
              backgroundColor: RED,
              transform: "translateY(-50%) rotate(-10deg)",
              borderRadius: 2,
            }}
          />
        </div>
        <span
          style={{
            fontSize: 90,
            fontWeight: 900,
            color: YELLOW,
            fontFamily: '"Inter", sans-serif',
            textShadow: `0 0 30px ${YELLOW}30`,
          }}
        >
          €59
        </span>
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
            borderRadius: 50,
            boxShadow: `0 8px 30px ${YELLOW}60`,
          }}
        >
          IEGŪSTI MĀJASLAPU →
        </div>
      </div>

      <div
        style={{
          opacity: interpolate(frame, [30, 40], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          fontSize: 26,
          color: "rgba(255,255,255,0.4)",
          fontFamily: '"Inter", sans-serif',
          marginTop: 4,
        }}
      >
        Vienreizējs maksājums • Gatava 1-3 dienās
      </div>
    </AbsoluteFill>
  );
};

// --- Main composition ---
export const SharpifyV2BearPresenter: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BLACK }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={85}>
          <SceneCoolBear />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: 8 })}
        />

        <TransitionSeries.Sequence durationInFrames={85}>
          <ScenePointingBear />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        <TransitionSeries.Sequence durationInFrames={85}>
          <SceneFlexBear />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        <TransitionSeries.Sequence durationInFrames={80}>
          <SceneThumbsCTA />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
