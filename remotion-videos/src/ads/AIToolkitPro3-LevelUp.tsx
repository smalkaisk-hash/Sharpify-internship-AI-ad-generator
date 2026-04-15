/**
 * AI Toolkit Pro 3: "LEVEL UP" — Gaming aesthetic transformation
 *
 * Concept: "LEVEL 1" glitchy/pixelated basic user → "LEVEL UP!" command →
 * transforms into high-tech/saturated/glowing "LEVEL MAX". Shows new
 * "abilities unlocked" as gaming-style cards.
 *
 * Pro techniques:
 * - Pixelated glitch aesthetic on Level 1
 * - Heavy chromatic aberration
 * - Mask reveal on LEVEL UP flash
 * - 3D perspective on ability cards
 * - Particle burst on level up
 * - Extreme zoom punch-ins
 * - Screen shake
 * - White flash cuts
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
const PURPLE = "#A855F7";

const motionBlur = (v: number, max = 12) => Math.min(Math.abs(v) * 0.3, max);
const EASE_DRAMATIC = Easing.bezier(0.83, 0, 0.17, 1);

// --- Clean SVG line icons ---
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
    case "zap":
      return (
        <svg {...common}>
          <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
        </svg>
      );
    case "target":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      );
    case "message":
      return (
        <svg {...common}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    default:
      return null;
  }
};

// --- Particles ---
const ParticleField: React.FC<{
  count?: number;
  opacity?: number;
  color?: string;
}> = ({ count = 40, opacity = 0.4, color = "white" }) => {
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
              backgroundColor: color,
              opacity: alpha * opacity,
              filter: "blur(1px)",
              boxShadow: `0 0 ${size * 2}px ${color}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// --- Particle BURST (radial explosion) ---
const ParticleBurst: React.FC<{
  startFrame: number;
  count?: number;
  color?: string;
}> = ({ startFrame, count = 80, color = YELLOW }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [startFrame, startFrame + 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (progress === 0) return null;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {new Array(count).fill(0).map((_, i) => {
        const angle = (i / count) * Math.PI * 2 + random(`ang-${i}`) * 0.3;
        const dist = (200 + random(`d-${i}`) * 400) * progress;
        const x = 540 + Math.cos(angle) * dist;
        const y = 540 + Math.sin(angle) * dist;
        const size = 3 + random(`s-${i}`) * 6;
        const fadeOut = 1 - progress;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              backgroundColor: color,
              opacity: fadeOut * 0.9,
              boxShadow: `0 0 ${size * 3}px ${color}, 0 0 ${size * 6}px ${color}80`,
              filter: `blur(${fadeOut * 0.5}px)`,
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

// --- SCENE 1: LEVEL 1 — dim, glitchy, pixelated ---
const SceneLevel1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Pulsing glitch intensity
  const glitchPulse = Math.sin(frame / 3) * 0.5 + 0.5;
  const splitAmount = 6 + glitchPulse * 8;

  const titleSpring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 200, stiffness: 100 },
  });

  // HP/MP bars style stats (depleted)
  const stats = [
    { label: "PRODUKTIVITĀTE", value: 12, delay: 18 },
    { label: "LAIKS", value: 8, delay: 30 },
    { label: "ENERĢIJA", value: 20, delay: 42 },
  ];

  // Small glitch jitter on everything
  const jitterX = Math.sin(frame / 1.5) * 1.5;
  const jitterY = Math.cos(frame / 1.2) * 1.5;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        filter: "saturate(0.3)",
        transform: `translate(${jitterX}px, ${jitterY}px)`,
      }}
    >
      {/* Scanlines effect */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(transparent 50%, rgba(0,0,0,0.15) 50%)",
          backgroundSize: "100% 4px",
          pointerEvents: "none",
          opacity: 0.7,
        }}
      />

      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, ${RED}15 0%, transparent 60%)`,
        }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 30,
          padding: 50,
        }}
      >
        {/* LEVEL 1 label */}
        <div
          style={{
            opacity: titleSpring,
            fontSize: 24,
            fontWeight: 900,
            color: "rgba(255,255,255,0.5)",
            fontFamily: "monospace",
            letterSpacing: "0.3em",
          }}
        >
          ┌─────────────────┐
        </div>
        <div
          style={{
            opacity: titleSpring,
            marginTop: -30,
          }}
        >
          <ChromaticText
            splitAmount={splitAmount}
            style={{
              fontSize: 120,
              fontWeight: 900,
              fontFamily: "monospace",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            LEVEL 1
          </ChromaticText>
        </div>
        <div
          style={{
            opacity: titleSpring,
            marginTop: -12,
            fontSize: 24,
            fontWeight: 900,
            color: "rgba(255,255,255,0.5)",
            fontFamily: "monospace",
            letterSpacing: "0.3em",
          }}
        >
          └─────────────────┘
        </div>

        <div
          style={{
            opacity: titleSpring,
            fontSize: 28,
            color: "rgba(255,255,255,0.65)",
            fontFamily: "monospace",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginTop: 10,
          }}
        >
          [PAMATA CHATGPT LIETOTĀJS]
        </div>

        {/* Stats bars */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, width: 600, marginTop: 20 }}>
          {stats.map((stat, i) => {
            const s = spring({
              frame: frame - stat.delay,
              fps,
              config: { damping: 200, stiffness: 120 },
            });
            const fill = interpolate(frame, [stat.delay + 5, stat.delay + 20], [0, stat.value], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div
                key={i}
                style={{
                  opacity: s,
                  transform: `translateX(${(1 - s) * -20}px)`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 18,
                    color: "rgba(255,255,255,0.5)",
                    fontFamily: "monospace",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    marginBottom: 6,
                  }}
                >
                  <span>{stat.label}</span>
                  <span>{Math.round(fill)}/100</span>
                </div>
                <div
                  style={{
                    height: 18,
                    backgroundColor: "rgba(255,255,255,0.08)",
                    borderRadius: 3,
                    border: "1px solid rgba(255,255,255,0.15)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${fill}%`,
                      height: "100%",
                      background: `linear-gradient(90deg, ${RED}, #FF6666)`,
                      boxShadow: `0 0 10px ${RED}`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// --- SCENE 2: LEVEL UP! — flash + particle burst + transformation ---
const SceneLevelUp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Big slam text
  const slamSpring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 9, stiffness: 200, mass: 0.4 },
  });

  const scale = interpolate(slamSpring, [0, 1], [10, 1]);
  const blur = motionBlur((scale - 1) * 15, 25);

  const shakeMag = interpolate(frame, [8, 25], [22, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shakeX = frame >= 8 && frame <= 25 ? Math.sin(frame * 40) * shakeMag : 0;
  const shakeY = frame >= 8 && frame <= 25 ? Math.cos(frame * 38) * shakeMag : 0;

  // Big white flash
  const flash = interpolate(frame, [6, 14, 30], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Secondary text
  const subSpring = spring({
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
          background: `radial-gradient(circle at 50% 50%, ${YELLOW}30 0%, transparent 60%)`,
        }}
      />

      <ParticleBurst startFrame={8} count={100} color={YELLOW} />
      <ParticleField count={40} opacity={0.6} color={YELLOW} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
        }}
      >
        <div
          style={{
            transform: `scale(${scale})`,
            filter: `blur(${blur}px)`,
          }}
        >
          <div
            style={{
              fontSize: 180,
              fontWeight: 900,
              color: YELLOW,
              fontFamily: "monospace",
              textShadow: `0 0 60px ${YELLOW}, 0 0 120px ${YELLOW}80, 0 6px 0 #000`,
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}
          >
            LEVEL UP!
          </div>
        </div>

        <div
          style={{
            opacity: subSpring,
            transform: `translateY(${(1 - subSpring) * 20}px)`,
            fontSize: 42,
            fontWeight: 800,
            color: "white",
            fontFamily: '"Inter", sans-serif',
            textAlign: "center",
            letterSpacing: "-0.02em",
            textShadow: `0 0 20px ${YELLOW}40`,
          }}
        >
          +27 AI SKILLS ATBLOĶĒTI
        </div>
      </AbsoluteFill>

      {/* White flash on impact */}
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

// --- SCENE 3: Abilities unlocked — gaming card reveals ---
const SceneAbilities: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const abilities = [
    { icon: "zap", name: "/marketing-post", desc: "+8 sek izpildes laiks", delay: 0 },
    { icon: "target", name: "/ad-copy", desc: "+12 sek izpildes laiks", delay: 22 },
    { icon: "message", name: "/email-reply", desc: "+5 sek izpildes laiks", delay: 44 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: BLACK }}>
      {/* Parallax grid */}
      <AbsoluteFill
        style={{
          backgroundImage: `
            linear-gradient(rgba(232,213,0,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(232,213,0,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          transform: `translateY(${-frame * 0.7}px)`,
        }}
      />

      <ParticleField count={30} opacity={0.45} color={YELLOW} />

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
          gap: 18,
          padding: 50,
        }}
      >
        {abilities.map((a, i) => {
          const progress = spring({
            frame: frame - a.delay,
            fps,
            config: { damping: 13, stiffness: 170, mass: 0.6 },
          });

          const opacity = progress;
          const scale = 0.4 + progress * 0.6;
          const blur = motionBlur((1 - progress) * 50, 18);
          const tiltY = interpolate(progress, [0, 1], [25, 0]);

          return (
            <div
              key={i}
              style={{
                opacity,
                transform: `perspective(1200px) scale(${scale}) rotateY(${tiltY}deg)`,
                filter: `blur(${blur}px)`,
                display: "flex",
                alignItems: "center",
                gap: 24,
                width: "100%",
                maxWidth: 820,
                background: `linear-gradient(135deg, rgba(232,213,0,0.08), rgba(168,85,247,0.08))`,
                borderRadius: 20,
                padding: "26px 36px",
                border: `2px solid ${YELLOW}50`,
                boxShadow: `0 0 60px ${YELLOW}25, inset 0 0 20px ${YELLOW}10`,
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 900,
                  color: GREEN,
                  fontFamily: "monospace",
                  letterSpacing: "0.1em",
                  marginBottom: 4,
                  flexShrink: 0,
                  minWidth: 130,
                }}
              >
                SKILL UNLOCKED
              </div>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 14,
                  background: `linear-gradient(135deg, ${YELLOW}20, ${PURPLE}20)`,
                  border: `1.5px solid ${YELLOW}50`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon name={a.icon} size={40} color={YELLOW} />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 40,
                    fontWeight: 900,
                    color: YELLOW,
                    fontFamily: "monospace",
                    letterSpacing: "-0.01em",
                    textShadow: `0 0 15px ${YELLOW}60`,
                  }}
                >
                  {a.name}
                </div>
                <div
                  style={{
                    fontSize: 22,
                    color: "rgba(255,255,255,0.7)",
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 600,
                    marginTop: 4,
                  }}
                >
                  {a.desc}
                </div>
              </div>
            </div>
          );
        })}
      </AbsoluteFill>

    </AbsoluteFill>
  );
};

// --- SCENE 4: LEVEL MAX — price slam + CTA ---
const SceneLevelMax: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tagSpring = spring({
    frame: frame - 3,
    fps,
    config: { damping: 14, stiffness: 150 },
  });

  const oldPriceSpring = spring({
    frame: frame - 12,
    fps,
    config: { damping: 200, stiffness: 100 },
  });

  const slashProgress = interpolate(frame, [24, 32], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_DRAMATIC,
  });

  const newPriceSpring = spring({
    frame: frame - 36,
    fps,
    config: { damping: 8, stiffness: 220, mass: 0.4 },
  });

  const shakeMag = interpolate(frame, [36, 48], [18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shakeX =
    frame >= 36 && frame <= 48 ? Math.sin(frame * 40) * shakeMag : 0;
  const shakeY =
    frame >= 36 && frame <= 48 ? Math.cos(frame * 38) * shakeMag * 0.7 : 0;

  const flash = interpolate(frame, [36, 42], [0.7, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const btnSpring = spring({
    frame: frame - 62,
    fps,
    config: { damping: 12, stiffness: 150 },
  });
  const btnPulse = 1 + Math.sin(frame / 6) * 0.04;

  const scale = interpolate(newPriceSpring, [0, 1], [8, 1]);
  const blur = motionBlur((scale - 1) * 20, 24);

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

      <ParticleField count={40} opacity={0.5} color={YELLOW} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
        }}
      >
        {/* LEVEL MAX tag */}
        <div
          style={{
            opacity: tagSpring,
            transform: `scale(${tagSpring})`,
            fontSize: 26,
            fontWeight: 900,
            color: GREEN,
            fontFamily: "monospace",
            letterSpacing: "0.2em",
            padding: "10px 24px",
            border: `2px solid ${GREEN}80`,
            borderRadius: 4,
            background: `${GREEN}15`,
            textShadow: `0 0 15px ${GREEN}80`,
            boxShadow: `0 0 20px ${GREEN}40`,
          }}
        >
          ✓ LEVEL MAX
        </div>

        <div style={{ position: "relative", opacity: oldPriceSpring, marginTop: 12 }}>
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
            marginTop: 14,
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
            PĀRIET UZ LEVEL MAX →
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
export const AIToolkitPro3LevelUp: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BLACK }}>
      <Sequence from={0} durationInFrames={80} layout="none">
        <SceneLevel1 />
      </Sequence>

      <Sequence from={80} durationInFrames={80} layout="none">
        <SceneLevelUp />
      </Sequence>

      <Sequence from={160} durationInFrames={110} layout="none">
        <SceneAbilities />
      </Sequence>

      <Sequence from={270} durationInFrames={110} layout="none">
        <SceneLevelMax />
      </Sequence>
    </AbsoluteFill>
  );
};
