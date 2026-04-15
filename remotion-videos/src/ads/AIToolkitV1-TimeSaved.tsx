/**
 * AI Toolkit Ad V1: "Time Saved Calculator"
 *
 * Shows the viewer how many hours/week they waste doing things manually
 * that AI could do in seconds. Then reveals the €19 solution.
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
const RED = "#FF3B3B";
const GREEN = "#22C55E";

// --- Scene 1: Tasks flying in ---
const SceneTasks: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tasks = [
    { text: "Rakstīt tekstus sociālajiem tīkliem", time: "2h/ned", delay: 5 },
    { text: "Veidot reklāmu kopiju", time: "3h/ned", delay: 18 },
    { text: "Atbildēt klientu e-pastiem", time: "5h/ned", delay: 31 },
    { text: "Rakstīt prompt-us no nulles", time: "4h/ned", delay: 44 },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BLACK,
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
          background: `radial-gradient(circle at 50% 50%, ${RED}05 0%, transparent 50%)`,
        }}
      />

      <div
        style={{
          opacity: spring({ frame, fps, config: { damping: 200, stiffness: 100 } }),
          fontSize: 38,
          color: "rgba(255,255,255,0.5)",
          fontFamily: '"Inter", sans-serif',
          fontWeight: 500,
          marginBottom: 12,
          textAlign: "center",
        }}
      >
        Cik laika Tu tērē...
      </div>

      {tasks.map((task, i) => {
        const s = spring({
          frame: frame - task.delay,
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
              justifyContent: "space-between",
              gap: 20,
              width: "100%",
              maxWidth: 800,
              backgroundColor: "rgba(255,255,255,0.04)",
              borderRadius: 14,
              padding: "16px 28px",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span
              style={{
                fontSize: 32,
                fontWeight: 600,
                color: "white",
                fontFamily: '"Inter", sans-serif',
              }}
            >
              {task.text}
            </span>
            <span
              style={{
                fontSize: 30,
                fontWeight: 700,
                color: RED,
                fontFamily: '"Inter", sans-serif',
              }}
            >
              {task.time}
            </span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// --- Scene 2: Total time wasted ---
const SceneTotal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelSpring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const numSpring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 12, stiffness: 180, mass: 0.8 },
  });

  const countProgress = interpolate(frame, [15, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const hours = Math.round(14 * countProgress);

  const subSpring = spring({
    frame: frame - 45,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const yearSpring = spring({
    frame: frame - 55,
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.7 },
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
          background: `radial-gradient(circle at 50% 50%, ${RED}08 0%, transparent 50%)`,
        }}
      />

      <div
        style={{
          opacity: labelSpring,
          fontSize: 30,
          color: "rgba(255,255,255,0.4)",
          fontFamily: '"Inter", sans-serif',
          fontWeight: 500,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        Tu zaudē nedēļā
      </div>

      <div
        style={{
          transform: `scale(${numSpring})`,
          fontSize: 160,
          fontWeight: 900,
          color: RED,
          fontFamily: '"Inter", sans-serif',
          textShadow: `0 0 40px ${RED}30`,
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {hours}h
      </div>

      <div
        style={{
          opacity: subSpring,
          fontSize: 34,
          color: "rgba(255,255,255,0.5)",
          fontFamily: '"Inter", sans-serif',
        }}
      >
        uz uzdevumiem, ko AI var izdarīt
      </div>

      <div
        style={{
          transform: `scale(${yearSpring})`,
          marginTop: 16,
          backgroundColor: "rgba(255,68,68,0.15)",
          borderRadius: 16,
          padding: "14px 32px",
          border: `1px solid ${RED}30`,
        }}
      >
        <span
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: RED,
            fontFamily: '"Inter", sans-serif',
          }}
        >
          = ~728h gadā
        </span>
      </div>
    </AbsoluteFill>
  );
};

// --- Scene 3: The solution ---
const SceneSolution: React.FC = () => {
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

  const items = [
    "27 gatavi AI skills",
    "128 slaidu prezentācija",
    "74 min video apmācība",
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
          src={staticFile("photos/sharpify/cropped/8.png")}
          style={{ width: 280, height: 280, objectFit: "contain" }}
        />
      </div>

      <div
        style={{
          opacity: textSpring,
          fontSize: 50,
          fontWeight: 800,
          color: "white",
          fontFamily: '"Inter", sans-serif',
          textAlign: "center",
          lineHeight: 1.15,
        }}
      >
        AI Rīku <span style={{ color: YELLOW }}>Komplekts.</span>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginTop: 4,
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
              <span style={{ fontSize: 28, color: GREEN }}>✓</span>
              <span
                style={{
                  fontSize: 34,
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

// --- Scene 4: Price + CTA ---
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const oldPriceSpring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 200, stiffness: 100 },
  });

  const slashProgress = interpolate(frame, [12, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const newPriceSpring = spring({
    frame: frame - 22,
    fps,
    config: { damping: 12, stiffness: 180, mass: 0.7 },
  });

  const shake = frame >= 22 && frame <= 26 ? Math.sin(frame * 30) * 3 : 0;

  const btnSpring = spring({
    frame: frame - 36,
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
          background: `radial-gradient(circle at 50% 40%, ${YELLOW}10 0%, transparent 50%)`,
        }}
      />

      <div
        style={{
          opacity: oldPriceSpring,
          fontSize: 28,
          color: "rgba(255,255,255,0.4)",
          fontFamily: '"Inter", sans-serif',
          fontWeight: 500,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        Šodien
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ position: "relative", opacity: oldPriceSpring }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 900,
              color: "rgba(255,255,255,0.25)",
              fontFamily: '"Inter", sans-serif',
            }}
          >
            €99
          </div>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "-5%",
              width: `${slashProgress * 110}%`,
              height: 5,
              backgroundColor: RED,
              transform: "rotate(-12deg) translateY(-50%)",
              boxShadow: `0 0 15px ${RED}80`,
              borderRadius: 3,
            }}
          />
        </div>

        <div
          style={{
            transform: `scale(${newPriceSpring}) translateX(${shake}px)`,
            fontSize: 130,
            fontWeight: 900,
            color: YELLOW,
            fontFamily: '"Inter", sans-serif',
            textShadow: `0 0 40px ${YELLOW}40`,
            lineHeight: 1,
          }}
        >
          €19
        </div>
      </div>

      <div
        style={{
          opacity: newPriceSpring,
          fontSize: 32,
          color: GREEN,
          fontFamily: '"Inter", sans-serif',
          fontWeight: 700,
        }}
      >
        Ietaupi 81%
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

export const AIToolkitV1TimeSaved: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BLACK }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={110}>
          <SceneTasks />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        <TransitionSeries.Sequence durationInFrames={95}>
          <SceneTotal />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        <TransitionSeries.Sequence durationInFrames={85}>
          <SceneSolution />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        <TransitionSeries.Sequence durationInFrames={90}>
          <SceneCTA />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
