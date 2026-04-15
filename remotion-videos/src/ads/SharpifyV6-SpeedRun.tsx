/**
 * Sharpify Ad V6: "Speed Run" — How fast we work
 *
 * Countdown/timer aesthetic. Shows the 3-step process flying by.
 * "While you drink your coffee" energy. Fast cuts, ticking clock.
 * Format: 1080x1080, ~12s, Latvian
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
const TEAL = "#00D4AA";

// --- Scene 1: The clock hook ---
const SceneClockHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spinning clock hand
  const rotation = frame * 6; // 6 degrees per frame = fast spin

  const textSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const subSpring = spring({
    frame: frame - 25,
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
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 40%, ${TEAL}08 0%, transparent 50%)`,
        }}
      />

      {/* Clock face */}
      <div
        style={{
          width: 200,
          height: 200,
          borderRadius: "50%",
          border: `4px solid ${YELLOW}40`,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Clock hand */}
        <div
          style={{
            position: "absolute",
            width: 4,
            height: 70,
            backgroundColor: YELLOW,
            borderRadius: 4,
            transformOrigin: "bottom center",
            transform: `rotate(${rotation}deg)`,
            bottom: "50%",
            boxShadow: `0 0 10px ${YELLOW}60`,
          }}
        />
        {/* Center dot */}
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: YELLOW,
            position: "absolute",
          }}
        />
      </div>

      <div
        style={{
          opacity: textSpring,
          transform: `translateY(${(1 - textSpring) * 15}px)`,
          fontSize: 56,
          fontWeight: 800,
          color: "white",
          fontFamily: '"Inter", sans-serif',
          textAlign: "center",
          lineHeight: 1.15,
        }}
      >
        Cik ātri Tu vari iegūt
        <br />
        <span style={{ color: YELLOW }}>profesionālu mājaslapu?</span>
      </div>

      <div
        style={{
          opacity: subSpring,
          fontSize: 32,
          color: "rgba(255,255,255,0.5)",
          fontFamily: '"Inter", sans-serif',
        }}
      >
        Ātrāk nekā Tu domā. ⚡
      </div>
    </AbsoluteFill>
  );
};

// --- Scene 2: 3-step process, rapid fire ---
const SceneSteps: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const steps = [
    { num: "1", title: "Pasūti un atbildi uz 5 jautājumiem", time: "5 min", icon: "📝" },
    { num: "2", title: "Mēs uzbūvējam visu no A līdz Z", time: "1-3 dienas", icon: "⚡" },
    { num: "3", title: "Apstiprini — mājaslapa ir gatava!", time: "2 min", icon: "✅" },
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
        padding: 50,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, ${TEAL}06 0%, transparent 50%)`,
        }}
      />

      {steps.map((step, i) => {
        const s = spring({
          frame: frame - i * 18,
          fps,
          config: { damping: 200, stiffness: 100 },
        });

        return (
          <div
            key={i}
            style={{
              opacity: s,
              transform: `translateY(${(1 - s) * 30}px)`,
              display: "flex",
              alignItems: "center",
              gap: 20,
              width: "90%",
              maxWidth: 800,
              backgroundColor: "rgba(255,255,255,0.05)",
              borderRadius: 20,
              padding: "20px 28px",
              border: `1px solid ${i === 1 ? YELLOW + "30" : "rgba(255,255,255,0.08)"}`,
            }}
          >
            {/* Step number */}
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                backgroundColor: i === 1 ? YELLOW : "rgba(255,255,255,0.1)",
                color: i === 1 ? BLACK : "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                fontWeight: 800,
                fontFamily: '"Inter", sans-serif',
                flexShrink: 0,
              }}
            >
              {step.num}
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: "white",
                  fontFamily: '"Inter", sans-serif',
                  lineHeight: 1.2,
                }}
              >
                {step.title}
              </div>
              <div
                style={{
                  fontSize: 24,
                  color: TEAL,
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 600,
                  marginTop: 4,
                }}
              >
                {step.icon} {step.time}
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// --- Scene 3: Total time reveal ---
const SceneTotalTime: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const numSpring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 12, stiffness: 180, mass: 0.8 },
  });

  const textSpring = spring({
    frame: frame - 18,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const subSpring = spring({
    frame: frame - 30,
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
        gap: 12,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, ${YELLOW}0A 0%, transparent 50%)`,
        }}
      />

      <div
        style={{
          fontSize: 28,
          color: "rgba(255,255,255,0.4)",
          fontFamily: '"Inter", sans-serif',
          fontWeight: 500,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          opacity: textSpring,
        }}
      >
        Tavs ieguldījums
      </div>

      <div
        style={{
          transform: `scale(${numSpring})`,
          fontSize: 140,
          fontWeight: 900,
          color: YELLOW,
          fontFamily: '"Inter", sans-serif',
          textShadow: `0 0 60px ${YELLOW}30`,
          lineHeight: 1,
        }}
      >
        10 min
      </div>

      <div
        style={{
          opacity: textSpring,
          fontSize: 44,
          fontWeight: 700,
          color: "white",
          fontFamily: '"Inter", sans-serif',
          textAlign: "center",
        }}
      >
        Tava laika. Mēs izdarām pārējo.
      </div>

      <div
        style={{
          opacity: subSpring,
          fontSize: 30,
          color: "rgba(255,255,255,0.5)",
          fontFamily: '"Inter", sans-serif',
          textAlign: "center",
          marginTop: 8,
        }}
      >
        Sākot no €59 • Gatava 1-3 dienās
      </div>
    </AbsoluteFill>
  );
};

// --- Scene 4: CTA ---
const SceneSpeedCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bearSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  const btnSpring = spring({
    frame: frame - 14,
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  const pulse = 1 + Math.sin(frame / 6) * 0.03;

  const textSpring = spring({
    frame: frame - 8,
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
        gap: 12,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 40%, ${YELLOW}10 0%, transparent 50%)`,
        }}
      />

      <div style={{ transform: `scale(${bearSpring})` }}>
        <Img
          src={staticFile("photos/sharpify/cropped/9.png")}
          style={{ width: 240, height: 240, objectFit: "contain" }}
        />
      </div>

      <div
        style={{
          opacity: textSpring,
          fontSize: 52,
          fontWeight: 800,
          color: "white",
          fontFamily: '"Inter", sans-serif',
          textAlign: "center",
          lineHeight: 1.15,
        }}
      >
        Ko Tu gaidi?
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
          PASŪTĪT TAGAD →
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const SharpifyV6SpeedRun: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BLACK }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={90}>
          <SceneClockHook />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: 8 })}
        />

        <TransitionSeries.Sequence durationInFrames={100}>
          <SceneSteps />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        <TransitionSeries.Sequence durationInFrames={80}>
          <SceneTotalTime />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        <TransitionSeries.Sequence durationInFrames={75}>
          <SceneSpeedCTA />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
