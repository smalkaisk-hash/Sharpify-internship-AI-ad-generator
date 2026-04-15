/**
 * AI Toolkit PRO SHOWCASE — Flex ad using all the pro techniques
 *
 * Techniques demonstrated:
 * - Parallax layers (slow bg grid + fast particles)
 * - Kinetic typography with motion blur
 * - Extreme zoom punch-ins (scale from 8x → 1x)
 * - Masked clip-path reveals (expanding circle)
 * - Screen shake on impact
 * - Particle system (ambient dust)
 * - Chromatic aberration (RGB split on impact text)
 * - 3D perspective transforms (rotateX tilt)
 * - Custom cubic-bezier easing
 * - Depth of field blur (motion blur synced to velocity)
 * - White flash cuts between scenes
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

// --- Utility: motion blur based on velocity ---
const motionBlur = (velocity: number, maxBlur = 12) =>
  Math.min(Math.abs(velocity) * 0.3, maxBlur);

// --- Utility: cubic-bezier easings ---
const EASE_DRAMATIC = Easing.bezier(0.83, 0, 0.17, 1);

// --- Particle system: ambient dust ---
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

// --- Chromatic aberration text (RGB split) ---
const ChromaticText: React.FC<{
  children: string;
  splitAmount?: number;
  style?: React.CSSProperties;
}> = ({ children, splitAmount = 0, style = {} }) => {
  return (
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
};

// --- SCENE 1: Kinetic chaos — tasks flying everywhere + STOP slam ---
const SceneChaos: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = [
    { text: "e-pasti", x: 150, y: 180, rotation: -8, size: 52, delay: 2, dir: "up" },
    { text: "prompts", x: 700, y: 220, rotation: 5, size: 46, delay: 8, dir: "down" },
    { text: "Instagram posti", x: 100, y: 420, rotation: -3, size: 58, delay: 14, dir: "left" },
    { text: "reklāmas", x: 680, y: 480, rotation: 7, size: 64, delay: 20, dir: "right" },
    { text: "saturs", x: 300, y: 650, rotation: -5, size: 54, delay: 26, dir: "up" },
    { text: "prezentācijas", x: 540, y: 750, rotation: 4, size: 48, delay: 32, dir: "down" },
    { text: "atbildes", x: 200, y: 880, rotation: -6, size: 50, delay: 38, dir: "left" },
    { text: "tekstu?", x: 720, y: 820, rotation: 8, size: 56, delay: 44, dir: "right" },
  ];

  const stopSpring = spring({
    frame: frame - 65,
    fps,
    config: { damping: 10, stiffness: 200, mass: 0.4 },
  });

  const shakeX = frame >= 65 && frame <= 75 ? Math.sin(frame * 30) * 8 * (1 - (frame - 65) / 10) : 0;
  const shakeY = frame >= 65 && frame <= 75 ? Math.cos(frame * 30) * 6 * (1 - (frame - 65) / 10) : 0;

  const wordsFade = interpolate(frame, [62, 75], [1, 0.08], {
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

      <ParticleField count={50} opacity={0.25} />

      {words.map((w, i) => {
        const progress = spring({
          frame: frame - w.delay,
          fps,
          config: { damping: 12, stiffness: 120, mass: 0.6 },
        });

        const fromX = w.dir === "left" ? -400 : w.dir === "right" ? 400 : 0;
        const fromY = w.dir === "up" ? 300 : w.dir === "down" ? -300 : 0;

        const tx = (1 - progress) * fromX;
        const ty = (1 - progress) * fromY;

        const velocity = Math.abs(fromX + fromY) * (1 - progress);
        const blur = motionBlur(velocity * 0.08, 10);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: w.x,
              top: w.y,
              fontSize: w.size,
              fontWeight: 900,
              color: "rgba(255,255,255,0.5)",
              fontFamily: '"Inter", sans-serif',
              fontStyle: "italic",
              opacity: progress * wordsFade,
              transform: `translate(${tx}px, ${ty}px) rotate(${w.rotation}deg)`,
              filter: `blur(${blur}px)`,
              letterSpacing: "-0.02em",
              userSelect: "none",
            }}
          >
            {w.text}
          </div>
        );
      })}

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
              transform: `scale(${stopSpring})`,
              filter: `blur(${motionBlur((1 - stopSpring) * 100, 18)}px)`,
            }}
          >
            <ChromaticText
              splitAmount={interpolate(stopSpring, [0, 1], [8, 2])}
              style={{
                fontSize: 240,
                fontWeight: 900,
                fontFamily: '"Inter", sans-serif',
                letterSpacing: "-0.06em",
                lineHeight: 1,
              }}
            >
              STOP.
            </ChromaticText>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// --- SCENE 2: Terminal reveal — masked clip-path + kinetic text ---
const SceneTerminalReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const revealProgress = interpolate(frame, [0, 24], [0, 120], {
    extrapolateRight: "clamp",
    easing: EASE_DRAMATIC,
  });

  const command = "/anything";
  const charsShown = Math.min(command.length, Math.max(0, Math.floor((frame - 24) / 2)));
  const typed = command.slice(0, charsShown);
  const cursorBlink = Math.sin(frame / 4) > 0;

  const line1Spring = spring({
    frame: frame - 48,
    fps,
    config: { damping: 14, stiffness: 180, mass: 0.7 },
  });

  const line2Spring = spring({
    frame: frame - 62,
    fps,
    config: { damping: 14, stiffness: 180, mass: 0.7 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: BLACK }}>
      <AbsoluteFill
        style={{
          clipPath: `circle(${revealProgress}% at 50% 50%)`,
        }}
      >
        <AbsoluteFill
          style={{
            background: `radial-gradient(circle at 50% 50%, ${YELLOW}15 0%, ${BLACK} 70%)`,
          }}
        />

        <ParticleField count={30} opacity={0.5} />

        <AbsoluteFill
          style={{
            backgroundImage: `
              linear-gradient(rgba(232,213,0,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(232,213,0,0.08) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 30,
          }}
        >
          <div
            style={{
              fontSize: 160,
              fontWeight: 900,
              fontFamily: "monospace",
              color: YELLOW,
              textShadow: `0 0 60px ${YELLOW}90, 0 0 120px ${YELLOW}60`,
              lineHeight: 1,
              display: "flex",
              alignItems: "baseline",
              gap: 8,
            }}
          >
            <span style={{ color: GREEN, fontSize: 120 }}>&gt;</span>
            {typed}
            {cursorBlink && charsShown < command.length && (
              <span style={{ color: YELLOW }}>▋</span>
            )}
          </div>

          <div
            style={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <div
              style={{
                fontSize: 60,
                fontWeight: 900,
                color: "white",
                fontFamily: '"Inter", sans-serif',
                letterSpacing: "-0.03em",
                opacity: line1Spring,
                transform: `scale(${Math.max(0, line1Spring * 1.5 - 0.5)})`,
                filter: `blur(${motionBlur((1 - line1Spring) * 40, 12)}px)`,
              }}
            >
              Viena komanda.
            </div>
            <div
              style={{
                fontSize: 60,
                fontWeight: 900,
                color: YELLOW,
                fontFamily: '"Inter", sans-serif',
                letterSpacing: "-0.03em",
                opacity: line2Spring,
                transform: `scale(${Math.max(0, line2Spring * 1.5 - 0.5)})`,
                filter: `blur(${motionBlur((1 - line2Spring) * 40, 12)}px)`,
                textShadow: `0 0 40px ${YELLOW}50`,
              }}
            >
              Jebkurš uzdevums.
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// --- SCENE 3: Rapid-fire capabilities — parallax + punch + flash ---
const SceneCapabilities: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const items = [
    { text: "Reklāmas kopija", time: "8 sek", startAt: 0 },
    { text: "Instagram posti", time: "12 sek", startAt: 20 },
    { text: "E-pasti klientiem", time: "5 sek", startAt: 40 },
    { text: "Prezentācijas", time: "30 sek", startAt: 60 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: BLACK }}>
      {/* Parallax layer 1: slow-moving grid */}
      <AbsoluteFill
        style={{
          backgroundImage: `
            linear-gradient(rgba(232,213,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(232,213,0,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          transform: `translateY(${-frame * 0.5}px)`,
        }}
      />

      <ParticleField count={25} opacity={0.35} />

      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${YELLOW}10 0%, transparent 55%)`,
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
        {items.map((item, i) => {
          const itemProgress = spring({
            frame: frame - item.startAt,
            fps,
            config: { damping: 14, stiffness: 160, mass: 0.6 },
          });

          const opacity = itemProgress;
          const scale = 0.3 + itemProgress * 0.7;
          const entranceBlur = motionBlur((1 - itemProgress) * 50, 15);
          const tiltX = interpolate(itemProgress, [0, 1], [15, 0]);

          return (
            <div
              key={i}
              style={{
                opacity,
                transform: `perspective(1000px) scale(${scale}) rotateX(${tiltX}deg)`,
                filter: `blur(${entranceBlur}px)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                maxWidth: 820,
                backgroundColor: "rgba(255,255,255,0.04)",
                borderRadius: 20,
                padding: "24px 40px",
                border: `2px solid ${YELLOW}30`,
                boxShadow: `0 0 60px ${YELLOW}15`,
              }}
            >
              <span
                style={{
                  fontSize: 42,
                  fontWeight: 800,
                  color: "white",
                  fontFamily: '"Inter", sans-serif',
                  letterSpacing: "-0.02em",
                }}
              >
                {item.text}
              </span>
              <span
                style={{
                  fontSize: 54,
                  fontWeight: 900,
                  color: YELLOW,
                  fontFamily: '"Inter", sans-serif',
                  fontVariantNumeric: "tabular-nums",
                  textShadow: `0 0 20px ${YELLOW}60`,
                }}
              >
                {item.time}
              </span>
            </div>
          );
        })}
      </AbsoluteFill>

    </AbsoluteFill>
  );
};

// --- SCENE 4: The price slam — big impact finale ---
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

  const flashOpacity = interpolate(frame, [30, 36], [0.7, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const badgeSpring = spring({
    frame: frame - 48,
    fps,
    config: { damping: 14, stiffness: 150 },
  });

  const btnSpring = spring({
    frame: frame - 60,
    fps,
    config: { damping: 12, stiffness: 150 },
  });
  const btnPulse = 1 + Math.sin(frame / 6) * 0.04;

  const newPriceScale = interpolate(newPriceSpring, [0, 1], [8, 1]);
  const newPriceBlur = motionBlur((newPriceScale - 1) * 20, 24);

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
            transform: `scale(${newPriceScale})`,
            filter: `blur(${newPriceBlur}px)`,
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
            opacity: badgeSpring,
            transform: `scale(${badgeSpring})`,
            backgroundColor: GREEN,
            color: WHITE,
            fontSize: 34,
            fontWeight: 900,
            fontFamily: '"Inter", sans-serif',
            padding: "14px 36px",
            borderRadius: 50,
            letterSpacing: "-0.01em",
            boxShadow: `0 6px 30px ${GREEN}60`,
          }}
        >
          TAUPI 81%
        </div>

        <div
          style={{
            transform: `scale(${btnSpring * btnPulse})`,
            marginTop: 16,
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
          opacity: Math.max(0, flashOpacity),
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

// --- Main composition with hard-cut Sequences ---
export const AIToolkitProShowcase: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BLACK }}>
      <Sequence from={0} durationInFrames={85} layout="none">
        <SceneChaos />
      </Sequence>

      <Sequence from={85} durationInFrames={95} layout="none">
        <SceneTerminalReveal />
      </Sequence>

      <Sequence from={180} durationInFrames={105} layout="none">
        <SceneCapabilities />
      </Sequence>

      <Sequence from={285} durationInFrames={105} layout="none">
        <ScenePriceSlam />
      </Sequence>
    </AbsoluteFill>
  );
};
