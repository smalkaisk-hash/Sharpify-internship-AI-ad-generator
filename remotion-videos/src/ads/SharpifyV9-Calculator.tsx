/**
 * Sharpify Ad V9: "Lost Revenue Calculator"
 *
 * Makes the viewer calculate how much money they're losing WITHOUT
 * a website. Animated math that hits hard. Then shows the fix is €59.
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

// --- Scene 1: The math ---
const SceneMath: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lines = [
    { text: "Katru dienu ~5 cilvēki meklē Tavu pakalpojumu", delay: 5, color: "white" },
    { text: "Nav mājaslapas → viņi aiziet", delay: 25, color: RED },
    { text: "5 × 30 dienas = 150 zaudēti potenciālie klienti", delay: 45, color: "white" },
    { text: "Pat ja tikai 3% kļūst par klientiem...", delay: 65, color: "rgba(255,255,255,0.6)" },
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
          background: `radial-gradient(circle at 50% 50%, ${RED}05 0%, transparent 50%)`,
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
              transform: `translateY(${(1 - s) * 20}px)`,
              fontSize: 38,
              fontWeight: i === 2 ? 700 : 500,
              color: line.color,
              fontFamily: '"Inter", sans-serif',
              textAlign: "center",
              lineHeight: 1.3,
              maxWidth: 850,
            }}
          >
            {line.text}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// --- Scene 2: The punchline number ---
const SceneLostRevenue: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelSpring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  // Count up to 4-5 lost clients per month
  const numSpring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 12, stiffness: 180, mass: 0.8 },
  });

  const countProgress = interpolate(frame, [15, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // If avg deal is €500, 4.5 clients = €2,250/month lost
  const lostAmount = Math.round(2250 * countProgress);

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
        gap: 16,
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
        Tu zaudē katru mēnesi
      </div>

      <div
        style={{
          transform: `scale(${numSpring})`,
          fontSize: 130,
          fontWeight: 900,
          color: RED,
          fontFamily: '"Inter", sans-serif',
          textShadow: `0 0 40px ${RED}30`,
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        ~€{lostAmount.toLocaleString("lv-LV")}
      </div>

      <div
        style={{
          opacity: subSpring,
          fontSize: 32,
          color: "rgba(255,255,255,0.5)",
          fontFamily: '"Inter", sans-serif',
        }}
      >
        potenciālos ieņēmumos
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
          = ~€27 000 gadā
        </span>
      </div>
    </AbsoluteFill>
  );
};

// --- Scene 3: The fix — €59 vs €27K lost ---
const SceneFixComparison: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftSpring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const vsSpring = spring({
    frame: frame - 20,
    fps,
    config: { damping: 14, stiffness: 200 },
  });

  const rightSpring = spring({
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
      <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
        {/* Cost of doing nothing */}
        <div
          style={{
            opacity: leftSpring,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 26,
              color: "rgba(255,255,255,0.4)",
              fontFamily: '"Inter", sans-serif',
              fontWeight: 500,
              marginBottom: 8,
            }}
          >
            Nedarīt neko
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 900,
              color: RED,
              fontFamily: '"Inter", sans-serif',
            }}
          >
            -€27K
          </div>
          <div
            style={{
              fontSize: 22,
              color: "rgba(255,255,255,0.3)",
              fontFamily: '"Inter", sans-serif',
            }}
          >
            gadā zaudēts
          </div>
        </div>

        {/* VS */}
        <div
          style={{
            transform: `scale(${vsSpring})`,
            fontSize: 40,
            fontWeight: 800,
            color: "rgba(255,255,255,0.2)",
            fontFamily: '"Inter", sans-serif',
          }}
        >
          VS
        </div>

        {/* Cost of website */}
        <div
          style={{
            opacity: rightSpring,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 26,
              color: "rgba(255,255,255,0.4)",
              fontFamily: '"Inter", sans-serif',
              fontWeight: 500,
              marginBottom: 8,
            }}
          >
            Iegūt mājaslapu
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 900,
              color: GREEN,
              fontFamily: '"Inter", sans-serif',
            }}
          >
            €59
          </div>
          <div
            style={{
              fontSize: 22,
              color: "rgba(255,255,255,0.3)",
              fontFamily: '"Inter", sans-serif',
            }}
          >
            vienreizēji
          </div>
        </div>
      </div>

      <div
        style={{
          opacity: interpolate(frame, [40, 50], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          fontSize: 36,
          fontWeight: 700,
          color: "white",
          fontFamily: '"Inter", sans-serif',
          marginTop: 12,
        }}
      >
        Izvēle ir <span style={{ color: YELLOW }}>acīmredzama.</span>
      </div>
    </AbsoluteFill>
  );
};

// --- Scene 4: CTA ---
const SceneCalcCTA: React.FC = () => {
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
          fontSize: 56,
          fontWeight: 800,
          color: "white",
          fontFamily: '"Inter", sans-serif',
          textAlign: "center",
          lineHeight: 1.15,
        }}
      >
        Pārstāj zaudēt naudu.
        <br />
        <span style={{ color: YELLOW }}>Iegūsti mājaslapu.</span>
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
          SĀKT PAR €59 →
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const SharpifyV9Calculator: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BLACK }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={100}>
          <SceneMath />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        <TransitionSeries.Sequence durationInFrames={95}>
          <SceneLostRevenue />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        <TransitionSeries.Sequence durationInFrames={85}>
          <SceneFixComparison />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        <TransitionSeries.Sequence durationInFrames={75}>
          <SceneCalcCTA />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
