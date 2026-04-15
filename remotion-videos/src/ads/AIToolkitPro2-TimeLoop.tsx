/**
 * AI Toolkit Pro 2: "TIME LOOP" — Groundhog Day ad
 *
 * Concept: Shows viewer stuck in daily repetition. Clock spinning fast
 * with motion blur, date counter cycling, chromatic aberration glitches.
 * BREAKS with a mask reveal → "What if every day just... worked?"
 *
 * Pro techniques used:
 * - Motion-blurred spinning clock
 * - Chromatic aberration cycling day text
 * - Mask reveal (clip-path) on "break"
 * - Parallax layers
 * - Particle ambient
 * - Extreme zoom punch-ins
 * - Screen shake on impact
 * - White flash scene cuts
 *
 * Format: 1080x1080, ~13s, Latvian
 */
import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const YELLOW = "#E8D500";
const BLACK = "#050505";
const WHITE = "#FFFFFF";
const RED = "#FF3344";
const GREEN = "#22C55E";
const CYAN = "#00D4FF";
const MAGENTA = "#FF00C8";

const motionBlur = (v: number, max = 12) => Math.min(Math.abs(v) * 0.3, max);
const EASE_DRAMATIC = Easing.bezier(0.83, 0, 0.17, 1);

// --- Clean SVG line icons (Feather/Lucide style) ---
const Icon: React.FC<{ name: string; size?: number; color?: string }> = ({
  name,
  size = 44,
  color = YELLOW,
}) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "megaphone":
      return (
        <svg {...common}>
          <path d="m3 11 18-5v12L3 14v-3z" />
          <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
        </svg>
      );
    case "image":
      return (
        <svg {...common}>
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
      );
    case "mail":
      return (
        <svg {...common}>
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      );
    case "presentation":
      return (
        <svg {...common}>
          <path d="M2 3h20" />
          <path d="M21 3v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3" />
          <path d="m7 21 5-6 5 6" />
          <path d="M12 15v-5" />
        </svg>
      );
    default:
      return null;
  }
};

// --- Particles ---
const ParticleField: React.FC<{ count?: number; opacity?: number }> = ({
  count = 40,
  opacity = 0.4,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {new Array(count).fill(0).map((_, i) => {
        const x = random(`px-${i}`) * 1080;
        const yBase = random(`py-${i}`) * 1080;
        const speed = 0.3 + random(`ps-${i}`) * 0.8;
        const size = 1 + random(`pz-${i}`) * 3;
        const y = (yBase - frame * speed * 0.8) % 1080;
        const actualY = y < 0 ? y + 1080 : y;
        const alpha = 0.2 + random(`pa-${i}`) * 0.6;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: actualY,
              width: size,
              height: size,
              borderRadius: "50%",
              backgroundColor: "white",
              opacity: alpha * opacity,
              filter: "blur(1px)",
              boxShadow: `0 0 ${size * 2}px rgba(255,255,255,0.5)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// --- Chromatic text ---
const ChromaticText: React.FC<{
  children: string;
  splitAmount?: number;
  style?: React.CSSProperties;
}> = ({ children, splitAmount = 0, style = {} }) => (
  <div style={{ position: "relative", ...style }}>
    <div
      style={{
        position: "absolute",
        top: 0,
        left: -splitAmount,
        color: CYAN,
        mixBlendMode: "screen",
        ...style,
      }}
    >
      {children}
    </div>
    <div
      style={{
        position: "absolute",
        top: 0,
        left: splitAmount,
        color: MAGENTA,
        mixBlendMode: "screen",
        ...style,
      }}
    >
      {children}
    </div>
    <div style={{ color: "white", position: "relative", ...style }}>
      {children}
    </div>
  </div>
);

// --- SCENE 1: Time loop — clock spinning, dates cycling ---
const SceneTimeLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Clock hand spinning faster and faster then abruptly freezes
  const spinSpeed = interpolate(frame, [0, 55], [4, 18], {
    extrapolateRight: "clamp",
  });
  const freezeFactor = frame > 60 ? 0 : 1;
  const clockRotation = frame * spinSpeed * freezeFactor;

  // Motion blur on clock hand based on spin speed
  const clockBlur = motionBlur(spinSpeed * 2, 16);

  // Days cycling rapidly
  const dayNames = ["Pirmdiena", "Otrdiena", "Trešdiena", "Ceturtdiena", "Piektdiena"];
  const taskList = ["Raksti e-pastu", "Raksti postu", "Raksti reklāmu", "Raksti tekstu", "Raksti...atkal"];

  // Which day showing, cycles every few frames
  const cycleIdx = Math.floor(frame / 6) % dayNames.length;

  // Chromatic aberration intensity increases with loop
  const chromaticSplit = interpolate(frame, [0, 55], [2, 14], {
    extrapolateRight: "clamp",
  });

  // "AGAIN?" slam at end
  const againSpring = spring({
    frame: frame - 65,
    fps,
    config: { damping: 10, stiffness: 200, mass: 0.4 },
  });

  const shakeX =
    frame >= 65 && frame <= 76
      ? Math.sin(frame * 30) * 10 * (1 - (frame - 65) / 11)
      : 0;
  const shakeY =
    frame >= 65 && frame <= 76
      ? Math.cos(frame * 30) * 8 * (1 - (frame - 65) / 11)
      : 0;

  // Fade out everything on slam
  const fadeOnSlam = interpolate(frame, [62, 70], [1, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BLACK,
        transform: `translate(${shakeX}px, ${shakeY}px)`,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, ${RED}08 0%, transparent 60%)`,
        }}
      />

      <ParticleField count={40} opacity={0.3} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          opacity: fadeOnSlam,
        }}
      >
        {/* Day name with chromatic aberration — cycles */}
        <div
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: "rgba(255,255,255,0.5)",
            fontFamily: "monospace",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          <ChromaticText
            splitAmount={chromaticSplit * 0.4}
            style={{
              fontSize: 32,
              fontWeight: 700,
              fontFamily: "monospace",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            {dayNames[cycleIdx]}
          </ChromaticText>
        </div>

        {/* Spinning clock */}
        <div
          style={{
            width: 280,
            height: 280,
            borderRadius: "50%",
            border: `6px solid ${YELLOW}60`,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 60px ${YELLOW}30, inset 0 0 40px ${YELLOW}15`,
          }}
        >
          {/* Hour markers */}
          {[0, 90, 180, 270].map((deg, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 4,
                height: 16,
                backgroundColor: YELLOW,
                top: 12,
                left: "50%",
                transformOrigin: "2px 128px",
                transform: `translateX(-50%) rotate(${deg}deg)`,
              }}
            />
          ))}
          {/* Minute hand with MOTION BLUR */}
          <div
            style={{
              position: "absolute",
              width: 4,
              height: 110,
              background: `linear-gradient(180deg, ${YELLOW}, ${RED})`,
              borderRadius: 4,
              transformOrigin: "bottom center",
              transform: `rotate(${clockRotation}deg)`,
              bottom: "50%",
              boxShadow: `0 0 15px ${YELLOW}`,
              filter: `blur(${clockBlur}px)`,
            }}
          />
          {/* Hour hand */}
          <div
            style={{
              position: "absolute",
              width: 5,
              height: 70,
              backgroundColor: "white",
              borderRadius: 4,
              transformOrigin: "bottom center",
              transform: `rotate(${clockRotation * 0.08}deg)`,
              bottom: "50%",
              filter: `blur(${clockBlur * 0.3}px)`,
            }}
          />
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              backgroundColor: YELLOW,
              boxShadow: `0 0 15px ${YELLOW}`,
              position: "absolute",
            }}
          />
        </div>

        {/* Repetitive task text */}
        <div
          style={{
            fontSize: 44,
            fontWeight: 800,
            color: "rgba(255,255,255,0.85)",
            fontFamily: '"Inter", sans-serif',
            fontStyle: "italic",
            textAlign: "center",
            filter: `blur(${Math.min(chromaticSplit * 0.3, 4)}px)`,
          }}
        >
          {taskList[cycleIdx]}
        </div>
      </AbsoluteFill>

      {/* "ATKAL?" slam */}
      {frame >= 60 && (
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              transform: `scale(${againSpring})`,
              filter: `blur(${motionBlur((1 - againSpring) * 100, 18)}px)`,
            }}
          >
            <ChromaticText
              splitAmount={interpolate(againSpring, [0, 1], [10, 3])}
              style={{
                fontSize: 260,
                fontWeight: 900,
                fontFamily: '"Inter", sans-serif',
                letterSpacing: "-0.06em",
                lineHeight: 1,
              }}
            >
              ATKAL?
            </ChromaticText>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// --- SCENE 2: The break — mask reveal with glowing hope ---
const SceneBreak: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Mask sweep from left to right (not circle — more dramatic)
  const sweep = interpolate(frame, [0, 28], [0, 100], {
    extrapolateRight: "clamp",
    easing: EASE_DRAMATIC,
  });

  // Hope text appears
  const line1Spring = spring({
    frame: frame - 35,
    fps,
    config: { damping: 14, stiffness: 170, mass: 0.7 },
  });

  const line2Spring = spring({
    frame: frame - 55,
    fps,
    config: { damping: 14, stiffness: 170, mass: 0.7 },
  });

  const sparkleSpring = spring({
    frame: frame - 70,
    fps,
    config: { damping: 10, stiffness: 200 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: BLACK }}>
      <AbsoluteFill
        style={{
          clipPath: `polygon(0 0, ${sweep}% 0, ${sweep}% 100%, 0 100%)`,
        }}
      >
        {/* Bright transformation area */}
        <AbsoluteFill
          style={{
            background: `radial-gradient(circle at 50% 50%, ${YELLOW}25 0%, #0a0a05 70%)`,
          }}
        />

        {/* Grid */}
        <AbsoluteFill
          style={{
            backgroundImage: `
              linear-gradient(rgba(232,213,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(232,213,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />

        <ParticleField count={60} opacity={0.8} />

        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
          }}
        >
          {/* Sparkle icon */}
          <div
            style={{
              fontSize: 120,
              transform: `scale(${sparkleSpring})`,
              filter: `drop-shadow(0 0 40px ${YELLOW}90) drop-shadow(0 0 80px ${YELLOW}60)`,
            }}
          >
            ✨
          </div>

          <div
            style={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <div
              style={{
                fontSize: 54,
                fontWeight: 800,
                color: "rgba(255,255,255,0.75)",
                fontFamily: '"Inter", sans-serif',
                letterSpacing: "-0.02em",
                opacity: line1Spring,
                transform: `scale(${Math.max(0, line1Spring * 1.4 - 0.4)})`,
                filter: `blur(${motionBlur((1 - line1Spring) * 40, 10)}px)`,
              }}
            >
              Ko, ja katra diena
            </div>
            <div
              style={{
                fontSize: 80,
                fontWeight: 900,
                color: YELLOW,
                fontFamily: '"Inter", sans-serif',
                letterSpacing: "-0.03em",
                opacity: line2Spring,
                transform: `scale(${Math.max(0, line2Spring * 1.4 - 0.4)})`,
                filter: `blur(${motionBlur((1 - line2Spring) * 40, 10)}px)`,
                textShadow: `0 0 40px ${YELLOW}70, 0 0 80px ${YELLOW}40`,
                lineHeight: 1.05,
              }}
            >
              vienkārši strādātu?
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* Leading edge glow on sweep */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${sweep}%`,
          width: 4,
          background: `linear-gradient(180deg, transparent, ${YELLOW}, transparent)`,
          boxShadow: `0 0 40px ${YELLOW}, 0 0 80px ${YELLOW}80`,
          opacity: sweep > 0 && sweep < 100 ? 1 : 0,
          filter: "blur(2px)",
        }}
      />
    </AbsoluteFill>
  );
};

// --- SCENE 3: Solution — rapid tasks completed ---
const SceneSolution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tasks = [
    { icon: "image", label: "/insta-post", result: "✓ done", startAt: 0 },
    { icon: "megaphone", label: "/ad-copy", result: "✓ done", startAt: 18 },
    { icon: "mail", label: "/email-reply", result: "✓ done", startAt: 36 },
    { icon: "presentation", label: "/pitch-deck", result: "✓ done", startAt: 54 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: BLACK }}>
      {/* Parallax grid slowly moving */}
      <AbsoluteFill
        style={{
          backgroundImage: `
            linear-gradient(rgba(232,213,0,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(232,213,0,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          transform: `translateY(${-frame * 0.6}px)`,
        }}
      />

      <ParticleField count={30} opacity={0.5} />

      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${YELLOW}12 0%, transparent 55%)`,
        }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          padding: 50,
        }}
      >
        {tasks.map((t, i) => {
          const progress = spring({
            frame: frame - t.startAt,
            fps,
            config: { damping: 13, stiffness: 170, mass: 0.6 },
          });

          const opacity = progress;
          const scale = 0.4 + progress * 0.6;
          const blur = motionBlur((1 - progress) * 50, 15);
          const tiltX = interpolate(progress, [0, 1], [12, 0]);

          const resultAppear = spring({
            frame: frame - t.startAt - 10,
            fps,
            config: { damping: 14, stiffness: 200 },
          });

          return (
            <div
              key={i}
              style={{
                opacity,
                transform: `perspective(1000px) scale(${scale}) rotateX(${tiltX}deg)`,
                filter: `blur(${blur}px)`,
                display: "flex",
                alignItems: "center",
                gap: 20,
                width: "100%",
                maxWidth: 820,
                backgroundColor: "rgba(255,255,255,0.04)",
                borderRadius: 20,
                padding: "22px 36px",
                border: `2px solid ${YELLOW}30`,
                boxShadow: `0 0 50px ${YELLOW}15`,
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 12,
                  backgroundColor: `${YELLOW}15`,
                  border: `1.5px solid ${YELLOW}40`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon name={t.icon} size={36} color={YELLOW} />
              </div>
              <span
                style={{
                  fontSize: 44,
                  fontWeight: 800,
                  color: YELLOW,
                  fontFamily: "monospace",
                  flex: 1,
                  letterSpacing: "-0.01em",
                  textShadow: `0 0 15px ${YELLOW}50`,
                }}
              >
                {t.label}
              </span>
              <span
                style={{
                  fontSize: 38,
                  fontWeight: 800,
                  color: GREEN,
                  fontFamily: '"Inter", sans-serif',
                  opacity: resultAppear,
                  transform: `scale(${resultAppear})`,
                  textShadow: `0 0 20px ${GREEN}60`,
                }}
              >
                {t.result}
              </span>
            </div>
          );
        })}
      </AbsoluteFill>

    </AbsoluteFill>
  );
};

// --- SCENE 4: Price slam + CTA ---
const ScenePriceSlam: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const oldPriceSpring = spring({
    frame: frame - 3,
    fps,
    config: { damping: 200, stiffness: 100 },
  });

  const slashProgress = interpolate(frame, [18, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_DRAMATIC,
  });

  const newPriceSpring = spring({
    frame: frame - 30,
    fps,
    config: { damping: 8, stiffness: 220, mass: 0.4 },
  });

  const shakeMag = interpolate(frame, [30, 42], [18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shakeX =
    frame >= 30 && frame <= 42 ? Math.sin(frame * 40) * shakeMag : 0;
  const shakeY =
    frame >= 30 && frame <= 42 ? Math.cos(frame * 38) * shakeMag * 0.7 : 0;

  const flash = interpolate(frame, [30, 36], [0.7, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const btnSpring = spring({
    frame: frame - 58,
    fps,
    config: { damping: 12, stiffness: 150 },
  });
  const btnPulse = 1 + Math.sin(frame / 6) * 0.04;

  const scale = interpolate(newPriceSpring, [0, 1], [8, 1]);
  const blur = motionBlur((scale - 1) * 20, 24);

  const tagSpring = spring({
    frame: frame - 45,
    fps,
    config: { damping: 14, stiffness: 150 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BLACK,
        transform: `translate(${shakeX}px, ${shakeY}px)`,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, ${YELLOW}18 0%, transparent 55%)`,
        }}
      />

      <ParticleField count={40} opacity={0.5} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            opacity: tagSpring,
            transform: `translateY(${(1 - tagSpring) * -10}px)`,
            fontSize: 28,
            color: "rgba(255,255,255,0.5)",
            fontFamily: '"Inter", sans-serif',
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          Beidz atkārtot. Sāc radīt.
        </div>

        <div style={{ position: "relative", opacity: oldPriceSpring }}>
          <div
            style={{
              fontSize: 100,
              fontWeight: 900,
              color: "rgba(255,255,255,0.3)",
              fontFamily: '"Inter", sans-serif',
              lineHeight: 1,
              letterSpacing: "-0.03em",
            }}
          >
            €99
          </div>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "-10%",
              width: `${slashProgress * 120}%`,
              height: 8,
              background: `linear-gradient(90deg, ${RED}, #FF6666, ${RED})`,
              transform: "rotate(-12deg) translateY(-50%)",
              boxShadow: `0 0 30px ${RED}, 0 0 60px ${RED}80`,
              borderRadius: 4,
            }}
          />
        </div>

        <div
          style={{
            transform: `scale(${scale})`,
            filter: `blur(${blur}px)`,
          }}
        >
          <div
            style={{
              fontSize: 260,
              fontWeight: 900,
              color: YELLOW,
              fontFamily: '"Inter", sans-serif',
              textShadow: `0 0 80px ${YELLOW}80, 0 0 160px ${YELLOW}40, 0 8px 0 #000`,
              lineHeight: 1,
              letterSpacing: "-0.06em",
            }}
          >
            €19
          </div>
        </div>

        <div
          style={{
            transform: `scale(${btnSpring * btnPulse})`,
            marginTop: 10,
          }}
        >
          <div
            style={{
              background: `linear-gradient(135deg, ${YELLOW}, #FFD300)`,
              color: BLACK,
              fontSize: 42,
              fontWeight: 900,
              fontFamily: '"Inter", sans-serif',
              padding: "26px 64px",
              borderRadius: 70,
              boxShadow: `0 10px 50px ${YELLOW}80, inset 0 -4px 0 rgba(0,0,0,0.2)`,
              letterSpacing: "-0.01em",
            }}
          >
            IEGŪT TAGAD →
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          backgroundColor: "white",
          opacity: Math.max(0, flash),
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

// --- Main composition ---
export const AIToolkitPro2TimeLoop: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BLACK }}>
      <Sequence from={0} durationInFrames={85} layout="none">
        <SceneTimeLoop />
      </Sequence>

      <Sequence from={85} durationInFrames={95} layout="none">
        <SceneBreak />
      </Sequence>

      <Sequence from={180} durationInFrames={100} layout="none">
        <SceneSolution />
      </Sequence>

      <Sequence from={280} durationInFrames={110} layout="none">
        <ScenePriceSlam />
      </Sequence>
    </AbsoluteFill>
  );
};
