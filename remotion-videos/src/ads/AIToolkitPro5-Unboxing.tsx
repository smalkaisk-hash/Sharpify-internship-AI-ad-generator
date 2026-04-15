/**
 * AI Toolkit Pro 5: "KAS IR KOMPLEKTĀ" — Cinematic mockup reveal
 *
 * Uses the real Sharpify product mockup (shows all the digital products —
 * AI Darbnīca, AI Revolūcija, Digitālo Dubultnieku, AI Satura Studija, etc).
 * Camera starts zoomed in close on one product, slowly pulls back to reveal
 * the full ensemble. Value stack slides in. Price slam.
 *
 * Format: 1080x1080, ~14s, Latvian
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

// --- Ambient particles ---
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
              backgroundColor: YELLOW,
              opacity: alpha * opacity,
              filter: "blur(1px)",
              boxShadow: `0 0 ${size * 2}px ${YELLOW}80`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// --- SCENE 1: Cinematic reveal — zoom out from mockup ---
const SceneReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Camera pulls back from 3.5x zoom to 1.0x over ~2.5s
  const zoom = interpolate(frame, [0, 75], [3.5, 1.08], {
    extrapolateRight: "clamp",
    easing: EASE_DRAMATIC,
  });

  // Subtle pan from left-of-center to center
  const panX = interpolate(frame, [0, 75], [-100, 0], {
    extrapolateRight: "clamp",
    easing: EASE_DRAMATIC,
  });

  // Motion blur scales with zoom velocity (high at start, low at end)
  const zoomVelocity = Math.max(
    0,
    interpolate(frame, [0, 30, 75], [8, 3, 0])
  );
  const camBlur = zoomVelocity * 0.8;

  // Tag appears at the end
  const tagSpring = spring({
    frame: frame - 70,
    fps,
    config: { damping: 14, stiffness: 150 },
  });

  // Glow intensifies as camera pulls back
  const glowProgress = interpolate(frame, [30, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: BLACK }}>
      {/* Glow behind mockup */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, ${YELLOW}${Math.round(
            glowProgress * 30
          ).toString(16).padStart(2, "0")} 0%, transparent 55%)`,
        }}
      />

      {/* Mockup image with zoom + pan + motion blur */}
      <AbsoluteFill
        style={{
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            transform: `translateX(${panX}px) scale(${zoom})`,
            filter: `blur(${camBlur}px)`,
            transformOrigin: "center center",
          }}
        >
          <Img
            src={staticFile("photos/workshop/mockup.png")}
            style={{
              width: 1080,
              height: "auto",
              display: "block",
            }}
          />
        </div>
      </AbsoluteFill>

      <ParticleField count={25} opacity={0.35} />

      {/* Top tag */}
      {frame >= 68 && (
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
              fontSize: 26,
              fontWeight: 900,
              fontFamily: '"Inter", sans-serif',
              padding: "12px 32px",
              borderRadius: 50,
              letterSpacing: "0.15em",
              boxShadow: `0 4px 25px ${YELLOW}80`,
            }}
          >
            AI RĪKU KOMPLEKTS
          </div>
        </div>
      )}

      {/* Bottom label */}
      {frame >= 75 && (
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: interpolate(frame, [75, 88], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <div
            style={{
              fontSize: 56,
              fontWeight: 900,
              color: "white",
              fontFamily: '"Inter", sans-serif',
              letterSpacing: "-0.02em",
              textShadow: `0 4px 20px rgba(0,0,0,0.8), 0 0 40px ${YELLOW}30`,
            }}
          >
            Viss ko Tu iegūsi.
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// --- SCENE 2: Value stack — what's included ---
const SceneValueStack: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const items = [
    { label: "128 slaidu prezentācija", value: "€49", delay: 0 },
    { label: "27 AI skills", value: "€99", delay: 14 },
    { label: "10 workflows", value: "€49", delay: 28 },
    { label: "74 min video apmācība", value: "€79", delay: 42 },
    { label: "CLAUDE.md šablons", value: "€29", delay: 56 },
  ];

  const totalSpring = spring({
    frame: frame - 72,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const strikeProgress = interpolate(frame, [85, 98], [0, 1], {
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
        padding: 50,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, ${YELLOW}06 0%, transparent 55%)`,
        }}
      />

      <div
        style={{
          fontSize: 26,
          color: "rgba(255,255,255,0.5)",
          fontFamily: '"Inter", sans-serif',
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: 14,
        }}
      >
        Kopējā vērtība
      </div>

      {items.map((item, i) => {
        const s = spring({
          frame: frame - item.delay,
          fps,
          config: { damping: 14, stiffness: 170, mass: 0.6 },
        });
        const blur = motionBlur((1 - s) * 40, 10);

        return (
          <div
            key={i}
            style={{
              opacity: s,
              transform: `translateX(${(1 - s) * 30}px)`,
              filter: `blur(${blur}px)`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              width: "100%",
              maxWidth: 720,
              borderBottom: "1px dashed rgba(255,255,255,0.15)",
              paddingBottom: 8,
            }}
          >
            <span
              style={{
                fontSize: 30,
                color: "rgba(255,255,255,0.8)",
                fontFamily: '"Inter", sans-serif',
              }}
            >
              {item.label}
            </span>
            <span
              style={{
                fontSize: 34,
                fontWeight: 800,
                color: "white",
                fontFamily: '"Inter", sans-serif',
              }}
            >
              {item.value}
            </span>
          </div>
        );
      })}

      <div
        style={{
          opacity: totalSpring,
          transform: `translateY(${(1 - totalSpring) * 15}px)`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          width: "100%",
          maxWidth: 720,
          marginTop: 16,
          position: "relative",
        }}
      >
        <span
          style={{
            fontSize: 38,
            fontWeight: 900,
            color: "rgba(255,255,255,0.6)",
            fontFamily: '"Inter", sans-serif',
            letterSpacing: "-0.02em",
          }}
        >
          Kopā
        </span>
        <div style={{ position: "relative" }}>
          <span
            style={{
              fontSize: 58,
              fontWeight: 900,
              color: "rgba(255,255,255,0.5)",
              fontFamily: '"Inter", sans-serif',
              letterSpacing: "-0.02em",
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
              backgroundColor: RED,
              transform: "rotate(-8deg) translateY(-50%)",
              boxShadow: `0 0 12px ${RED}80`,
              borderRadius: 2,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// --- SCENE 3: Price slam + CTA ---
const ScenePriceSlam: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const priceSpring = spring({
    frame,
    fps,
    config: { damping: 8, stiffness: 220, mass: 0.4 },
  });

  const shakeMag = interpolate(frame, [0, 14], [18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shakeX = frame <= 14 ? Math.sin(frame * 40) * shakeMag : 0;
  const shakeY = frame <= 14 ? Math.cos(frame * 38) * shakeMag * 0.7 : 0;

  const flash = interpolate(frame, [0, 8], [0.8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const tagSpring = spring({
    frame: frame - 20,
    fps,
    config: { damping: 14, stiffness: 150 },
  });

  const btnSpring = spring({
    frame: frame - 32,
    fps,
    config: { damping: 12, stiffness: 150 },
  });
  const btnPulse = 1 + Math.sin(frame / 6) * 0.04;

  const scale = interpolate(priceSpring, [0, 1], [8, 1]);
  const blur = motionBlur((scale - 1) * 20, 24);

  const urgency = interpolate(frame, [42, 50], [0, 1], {
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
          background: `radial-gradient(circle at 50% 50%, ${YELLOW}20 0%, transparent 55%)`,
        }}
      />
      <ParticleField count={50} opacity={0.6} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
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
              fontSize: 280,
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
            opacity: tagSpring,
            transform: `scale(${tagSpring})`,
            backgroundColor: GREEN,
            color: "white",
            fontSize: 34,
            fontWeight: 900,
            fontFamily: '"Inter", sans-serif',
            padding: "14px 36px",
            borderRadius: 50,
            letterSpacing: "-0.01em",
            boxShadow: `0 6px 30px ${GREEN}60`,
          }}
        >
          TAUPI 94%
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
            NOPIRKT KOMPLEKTU →
          </div>
        </div>

        <div
          style={{
            opacity: urgency,
            fontSize: 24,
            color: "rgba(255,255,255,0.5)",
            fontFamily: '"Inter", sans-serif',
            marginTop: 4,
          }}
        >
          7 dienu naudas atgriešanas garantija
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

export const AIToolkitPro5Unboxing: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BLACK }}>
      <Sequence from={0} durationInFrames={150} layout="none">
        <SceneReveal />
      </Sequence>

      <Sequence from={150} durationInFrames={130} layout="none">
        <SceneValueStack />
      </Sequence>

      <Sequence from={280} durationInFrames={110} layout="none">
        <ScenePriceSlam />
      </Sequence>
    </AbsoluteFill>
  );
};
