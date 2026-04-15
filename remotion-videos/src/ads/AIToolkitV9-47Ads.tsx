/**
 * AI Toolkit Ad V9: "47 reklāmas 1 stundā"
 *
 * Specific outcome curiosity hook. Counter races up showing how many
 * ads/posts/emails get generated. Specific number creates intrigue.
 * "How is that possible?" → answer = AI Rīku Komplekts.
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
  Sequence,
} from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";

const YELLOW = "#E8D500";
const BLACK = "#0a0a0a";
const GREEN = "#22C55E";

// --- Scene 1: Hook with counter racing up ---
const SceneCounter: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Number races up from 0 to 47
  const counterProgress = interpolate(frame, [10, 65], [0, 47], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const num = Math.floor(counterProgress);

  // Slight pulse on the number
  const pulse = 1 + Math.sin(frame / 4) * 0.02;

  // Label appears first
  const labelSpring = spring({
    frame: frame - 3,
    fps,
    config: { damping: 200, stiffness: 100 },
  });

  // Below text appears after counter settles
  const subSpring = spring({
    frame: frame - 70,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  // Confused emoji at the end
  const emojiSpring = spring({
    frame: frame - 85,
    fps,
    config: { damping: 12, stiffness: 200 },
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
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, ${YELLOW}10 0%, transparent 50%)`,
        }}
      />

      <div
        style={{
          opacity: labelSpring,
          fontSize: 30,
          color: "rgba(255,255,255,0.5)",
          fontFamily: '"Inter", sans-serif',
          fontWeight: 500,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        Vakar es uztaisīju
      </div>

      <div
        style={{
          transform: `scale(${pulse})`,
          fontSize: 240,
          fontWeight: 900,
          color: YELLOW,
          fontFamily: '"Inter", sans-serif',
          textShadow: `0 0 60px ${YELLOW}40`,
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {num}
      </div>

      <div
        style={{
          opacity: labelSpring,
          fontSize: 50,
          fontWeight: 800,
          color: "white",
          fontFamily: '"Inter", sans-serif',
        }}
      >
        Meta reklāmu kopijas
      </div>

      <div
        style={{
          opacity: subSpring,
          fontSize: 30,
          color: "rgba(255,255,255,0.6)",
          fontFamily: '"Inter", sans-serif',
          fontWeight: 600,
          marginTop: 12,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        ...vienā stundā.
        <span
          style={{
            opacity: emojiSpring,
            transform: `scale(${emojiSpring}) rotate(${(1 - emojiSpring) * 30}deg)`,
            fontSize: 40,
            display: "inline-block",
          }}
        >
          🤯
        </span>
      </div>
    </AbsoluteFill>
  );
};

// --- Scene 2: The math breakdown ---
const SceneBreakdown: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerSpring = spring({
    frame: frame - 3,
    fps,
    config: { damping: 200, stiffness: 100 },
  });

  const lines = [
    { label: "Manuāli", time: "47 stundas", color: "#FF3B3B", delay: 12 },
    { label: "Ar ChatGPT", time: "12 stundas", color: "rgba(255,255,255,0.5)", delay: 26 },
    { label: "Ar AI Rīku Komplektu", time: "1 stunda", color: YELLOW, delay: 40, big: true },
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
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, ${YELLOW}06 0%, transparent 50%)`,
        }}
      />

      <div
        style={{
          opacity: headerSpring,
          fontSize: 38,
          fontWeight: 700,
          color: "white",
          fontFamily: '"Inter", sans-serif',
          textAlign: "center",
          marginBottom: 12,
        }}
      >
        Cik ilgi tas parasti aizņem?
      </div>

      {lines.map((line, i) => {
        const s = spring({
          frame: frame - line.delay,
          fps,
          config: { damping: 14, stiffness: 180, mass: 0.7 },
        });

        return (
          <div
            key={i}
            style={{
              opacity: s,
              transform: `scale(${0.85 + s * 0.15}) translateX(${(1 - s) * 30}px)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              maxWidth: 800,
              backgroundColor: line.big ? "rgba(232,213,0,0.1)" : "rgba(255,255,255,0.04)",
              borderRadius: 16,
              padding: line.big ? "22px 32px" : "16px 28px",
              border: line.big ? `1px solid ${YELLOW}40` : "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span
              style={{
                fontSize: line.big ? 40 : 32,
                fontWeight: line.big ? 800 : 600,
                color: line.big ? "white" : "rgba(255,255,255,0.7)",
                fontFamily: '"Inter", sans-serif',
              }}
            >
              {line.label}
            </span>
            <span
              style={{
                fontSize: line.big ? 56 : 38,
                fontWeight: 900,
                color: line.color,
                fontFamily: '"Inter", sans-serif',
                textShadow: line.big ? `0 0 20px ${YELLOW}30` : "none",
              }}
            >
              {line.time}
            </span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// --- Scene 3: The reveal — the secret ---
const SceneReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerSpring = spring({
    frame: frame - 3,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const items = [
    { icon: "⚡", text: "27 gatavi AI skills" },
    { icon: "🔄", text: "10 automatizēti workflows" },
    { icon: "📋", text: "Gatavi prompt-i, kas tikai strādā" },
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
          background: `radial-gradient(circle at 50% 40%, ${YELLOW}10 0%, transparent 50%)`,
        }}
      />

      <div
        style={{
          opacity: headerSpring,
          fontSize: 44,
          fontWeight: 800,
          color: "white",
          fontFamily: '"Inter", sans-serif',
          textAlign: "center",
          lineHeight: 1.15,
          marginBottom: 8,
        }}
      >
        Mans noslēpums?
      </div>

      <div
        style={{
          opacity: headerSpring,
          fontSize: 36,
          fontWeight: 700,
          color: YELLOW,
          fontFamily: '"Inter", sans-serif',
          textAlign: "center",
        }}
      >
        AI Rīku Komplekts.
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          marginTop: 12,
        }}
      >
        {items.map((item, i) => {
          const s = spring({
            frame: frame - 18 - i * 12,
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
                gap: 16,
                width: "100%",
                maxWidth: 720,
                backgroundColor: "rgba(255,255,255,0.04)",
                borderRadius: 14,
                padding: "14px 26px",
                border: `1px solid ${YELLOW}20`,
              }}
            >
              <span style={{ fontSize: 38 }}>{item.icon}</span>
              <span
                style={{
                  fontSize: 32,
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

  const priceSpring = spring({
    frame: frame - 14,
    fps,
    config: { damping: 12, stiffness: 180, mass: 0.7 },
  });

  const btnSpring = spring({
    frame: frame - 24,
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
          background: `radial-gradient(circle at 50% 40%, ${YELLOW}12 0%, transparent 50%)`,
        }}
      />

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
        Tava produktivitāte
        <br />
        <span style={{ color: YELLOW }}>×47.</span>
      </div>

      <div
        style={{
          transform: `scale(${priceSpring})`,
          fontSize: 90,
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

      <div style={{ transform: `scale(${btnSpring * pulse})`, marginTop: 14 }}>
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

export const AIToolkitV947Ads: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BLACK }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={120}>
          <SceneCounter />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        <TransitionSeries.Sequence durationInFrames={110}>
          <SceneBreakdown />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        <TransitionSeries.Sequence durationInFrames={95}>
          <SceneReveal />
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
