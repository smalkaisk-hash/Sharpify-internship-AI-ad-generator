/**
 * AI Toolkit Pro 6: "AUTHORITY" — Niks on stage / social proof
 *
 * Uses the real photo of Niks presenting to a packed audience.
 * Cinematic zoom-in on stage, stat counter overlays fly in,
 * reveals the AI Toolkit is "the same system they learned".
 *
 * Format: 1080x1080, ~13s, Latvian
 */
import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  random,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const YELLOW = "#E8D500";
const BLACK = "#050505";
const RED = "#FF3344";
const GREEN = "#22C55E";

const motionBlur = (v: number, max = 12) => Math.min(Math.abs(v) * 0.3, max);
const EASE_DRAMATIC = Easing.bezier(0.83, 0, 0.17, 1);

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

// --- SCENE 1: Audience zoom-in ---
const SceneStage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slow cinematic zoom on the stage photo
  const zoom = interpolate(frame, [0, 100], [1.08, 1.25], {
    extrapolateRight: "clamp",
  });

  // Top tag fades in
  const tagSpring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 200, stiffness: 100 },
  });

  // Main headline kinetic reveal
  const line1 = spring({
    frame: frame - 18,
    fps,
    config: { damping: 14, stiffness: 170, mass: 0.7 },
  });
  const line2 = spring({
    frame: frame - 40,
    fps,
    config: { damping: 14, stiffness: 170, mass: 0.7 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: BLACK }}>
      {/* Stage photo with zoom */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img
          src={staticFile("photos/workshop/workshop-audience.jpg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${zoom})`,
          }}
        />
      </AbsoluteFill>

      {/* Dark gradient overlay for readability */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* Top tag */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: tagSpring,
          transform: `translateY(${(1 - tagSpring) * -15}px)`,
        }}
      >
        <div
          style={{
            display: "inline-block",
            backgroundColor: YELLOW,
            color: BLACK,
            fontSize: 22,
            fontWeight: 900,
            fontFamily: '"Inter", sans-serif',
            padding: "10px 26px",
            borderRadius: 50,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            boxShadow: `0 4px 25px ${YELLOW}60`,
          }}
        >
          LIVE · Rīga
        </div>
      </div>

      {/* Bottom headline */}
      <div
        style={{
          position: "absolute",
          bottom: 90,
          left: 40,
          right: 40,
          textAlign: "center",
        }}
      >
        <div
          style={{
            opacity: line1,
            transform: `scale(${Math.max(0, line1 * 1.4 - 0.4)})`,
            filter: `blur(${motionBlur((1 - line1) * 40, 10)}px)`,
            fontSize: 52,
            fontWeight: 800,
            color: "rgba(255,255,255,0.85)",
            fontFamily: '"Inter", sans-serif',
            letterSpacing: "-0.02em",
            textShadow: "0 4px 20px rgba(0,0,0,0.7)",
            marginBottom: 8,
          }}
        >
          Šogad 2 300+ uzņēmēji
        </div>
        <div
          style={{
            opacity: line2,
            transform: `scale(${Math.max(0, line2 * 1.4 - 0.4)})`,
            filter: `blur(${motionBlur((1 - line2) * 40, 10)}px)`,
            fontSize: 68,
            fontWeight: 900,
            color: YELLOW,
            fontFamily: '"Inter", sans-serif',
            letterSpacing: "-0.02em",
            textShadow: `0 4px 20px rgba(0,0,0,0.7), 0 0 40px ${YELLOW}60`,
            lineHeight: 1,
          }}
        >
          iemācījās šo sistēmu.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// --- SCENE 2: Stats flying in over the stage photo ---
const SceneStats: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Still pan on stage photo
  const zoom = interpolate(frame, [0, 90], [1.25, 1.35], {
    extrapolateRight: "clamp",
  });

  const stats = [
    { num: "2 300+", label: "uzņēmēji", delay: 5 },
    { num: "26", label: "valstis", delay: 22 },
    { num: "€50M+", label: "saģenerēti klientiem", delay: 39 },
    { num: "Forbes 30", label: "Under 30", delay: 56 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: BLACK }}>
      {/* Background image */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img
          src={staticFile("photos/workshop/workshop-audience.jpg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${zoom})`,
            filter: "blur(6px) brightness(0.4)",
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.85) 100%)`,
        }}
      />

      <ParticleField count={25} opacity={0.4} />

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
        {stats.map((stat, i) => {
          const s = spring({
            frame: frame - stat.delay,
            fps,
            config: { damping: 14, stiffness: 180, mass: 0.6 },
          });
          const blur = motionBlur((1 - s) * 40, 12);

          return (
            <div
              key={i}
              style={{
                opacity: s,
                transform: `perspective(1000px) translateX(${
                  (1 - s) * (i % 2 === 0 ? -50 : 50)
                }px) rotateY(${(1 - s) * (i % 2 === 0 ? -10 : 10)}deg)`,
                filter: `blur(${blur}px)`,
                display: "flex",
                alignItems: "baseline",
                gap: 20,
                width: "100%",
                maxWidth: 700,
                backgroundColor: "rgba(255,255,255,0.06)",
                borderRadius: 16,
                padding: "18px 30px",
                border: `1.5px solid ${YELLOW}40`,
                backdropFilter: "blur(10px)",
                boxShadow: `0 0 40px ${YELLOW}15`,
              }}
            >
              <span
                style={{
                  fontSize: 60,
                  fontWeight: 900,
                  color: YELLOW,
                  fontFamily: '"Inter", sans-serif',
                  letterSpacing: "-0.02em",
                  textShadow: `0 0 20px ${YELLOW}60`,
                  minWidth: 220,
                }}
              >
                {stat.num}
              </span>
              <span
                style={{
                  fontSize: 28,
                  color: "rgba(255,255,255,0.75)",
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 600,
                }}
              >
                {stat.label}
              </span>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// --- SCENE 3: Pivot — "tagad Tev arī" ---
const ScenePivot: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const line1 = spring({
    frame: frame - 3,
    fps,
    config: { damping: 200, stiffness: 80 },
  });
  const line2 = spring({
    frame: frame - 20,
    fps,
    config: { damping: 14, stiffness: 180, mass: 0.7 },
  });
  const subSpring = spring({
    frame: frame - 45,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: BLACK }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, ${YELLOW}12 0%, transparent 55%)`,
        }}
      />
      <ParticleField count={35} opacity={0.5} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 18,
          padding: 60,
        }}
      >
        <div
          style={{
            opacity: line1,
            transform: `translateY(${(1 - line1) * 15}px)`,
            fontSize: 36,
            color: "rgba(255,255,255,0.6)",
            fontFamily: '"Inter", sans-serif',
            fontWeight: 600,
            textAlign: "center",
            letterSpacing: "-0.01em",
          }}
        >
          Tagad to pašu sistēmu
        </div>

        <div
          style={{
            opacity: line2,
            transform: `scale(${Math.max(0, line2 * 1.4 - 0.4)})`,
            filter: `blur(${motionBlur((1 - line2) * 40, 12)}px)`,
            fontSize: 92,
            fontWeight: 900,
            color: YELLOW,
            fontFamily: '"Inter", sans-serif',
            textAlign: "center",
            letterSpacing: "-0.03em",
            textShadow: `0 0 50px ${YELLOW}60, 0 0 100px ${YELLOW}30`,
            lineHeight: 1,
          }}
        >
          vari iegūt arī Tu.
        </div>

        <div
          style={{
            opacity: subSpring,
            fontSize: 30,
            color: "rgba(255,255,255,0.65)",
            fontFamily: '"Inter", sans-serif',
            fontWeight: 500,
            textAlign: "center",
            marginTop: 14,
          }}
        >
          Bez workshop biļetes. Bez ceļojuma uz Rīgu.
        </div>
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
  const shakeX = frame >= 30 && frame <= 42 ? Math.sin(frame * 40) * shakeMag : 0;
  const shakeY = frame >= 30 && frame <= 42 ? Math.cos(frame * 38) * shakeMag * 0.7 : 0;

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
          gap: 16,
        }}
      >
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
            PIEVIENOTIES →
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

export const AIToolkitPro6Authority: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BLACK }}>
      <Sequence from={0} durationInFrames={100} layout="none">
        <SceneStage />
      </Sequence>

      <Sequence from={100} durationInFrames={100} layout="none">
        <SceneStats />
      </Sequence>

      <Sequence from={200} durationInFrames={90} layout="none">
        <ScenePivot />
      </Sequence>

      <Sequence from={290} durationInFrames={110} layout="none">
        <ScenePriceSlam />
      </Sequence>
    </AbsoluteFill>
  );
};
