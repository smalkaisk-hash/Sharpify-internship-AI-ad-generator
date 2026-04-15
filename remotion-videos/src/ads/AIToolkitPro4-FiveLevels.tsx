/**
 * AI Toolkit Pro 4: "5 LĪMEŅI" — Infographic deep-dive
 *
 * Uses the actual "5 AI levels" infographic from Sharpify. Starts wide with
 * the full chart, camera zooms/pans through each level (1→4 with "NOT YOU"
 * cross-outs), lands on Level 5 as the destination. Then CTA.
 *
 * Pro techniques: extreme camera push-ins on infographic crops, motion blur,
 * chromatic aberration, screen shake, particle dust, masked clip reveals.
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
const CYAN = "#00D4FF";
const MAGENTA = "#FF00C8";

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

// --- Chromatic aberration text ---
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

// --- SCENE 1: Question hook ---
const SceneQuestion: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const line1 = spring({
    frame: frame - 5,
    fps,
    config: { damping: 200, stiffness: 80 },
  });
  const line2 = spring({
    frame: frame - 22,
    fps,
    config: { damping: 14, stiffness: 180, mass: 0.7 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: BLACK }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, ${YELLOW}10 0%, transparent 60%)`,
        }}
      />
      <ParticleField count={40} opacity={0.4} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          padding: 60,
        }}
      >
        <div
          style={{
            opacity: line1,
            fontSize: 28,
            color: YELLOW,
            fontFamily: '"Inter", sans-serif',
            fontWeight: 800,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          AI EKOSISTĒMA
        </div>

        <div
          style={{
            opacity: line2,
            transform: `scale(${Math.max(0, line2 * 1.4 - 0.4)})`,
            filter: `blur(${motionBlur((1 - line2) * 40, 10)}px)`,
            fontSize: 86,
            fontWeight: 900,
            color: "white",
            fontFamily: '"Inter", sans-serif',
            textAlign: "center",
            lineHeight: 1.02,
            letterSpacing: "-0.03em",
          }}
        >
          5 līmeņi.
          <br />
          <span style={{ color: YELLOW, textShadow: `0 0 40px ${YELLOW}60` }}>
            Kurā Tu esi?
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// --- SCENE 2: Camera pan through levels with cross-outs ---
// The infographic is 1080 wide. We'll zoom in and pan across it.
const SceneLevels: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Camera pans through each of 5 level positions on the infographic
  // Image is at 1920x1080-ish. We'll scale it to fit the canvas width at the right zoom.
  // We'll zoom in to 2.5x and pan across horizontally.

  // Pan positions (approx x-center of each level column in the original image)
  // Image has 5 columns roughly evenly spaced. We pan to each.
  const panPositions = [
    { x: 0.12, time: 0 },    // Level 1
    { x: 0.30, time: 18 },   // Level 2
    { x: 0.50, time: 36 },   // Level 3
    { x: 0.70, time: 54 },   // Level 4
    { x: 0.88, time: 75 },   // Level 5 (destination)
  ];

  // Compute current pan position via interpolation
  const times = panPositions.map((p) => p.time);
  const xs = panPositions.map((p) => p.x);
  const currentPanX = interpolate(frame, times, xs, {
    extrapolateRight: "clamp",
    easing: EASE_DRAMATIC,
  });

  // Zoom — extreme on levels 1-4, less zoomed on final 5 to show glow
  const zoom = interpolate(
    frame,
    [0, 75, 95],
    [2.6, 2.6, 1.9],
    { extrapolateRight: "clamp", easing: EASE_DRAMATIC }
  );

  // Motion blur during pan (based on rate of change)
  // Simple heuristic: more blur at middle of transitions
  const panVelocity =
    Math.abs(
      interpolate(frame, [0, 18, 36, 54, 75], [0, 1, 1, 1, 0]) *
        (frame % 18 < 6 ? 1 : 0.2)
    );
  const camBlur = panVelocity * 6;

  // Image natural size (after fit-to-width at scale=1: width = 1080)
  // We multiply by zoom and translate to keep target x in center
  const imgScale = zoom;
  // Translation: when panX = 0.5, translate = 0. When 0.0, translate = +half. When 1.0, translate = -half.
  const translateX = (0.5 - currentPanX) * 1080 * imgScale;
  // Center vertically on the cards row (roughly middle of image)
  const translateY = 0;

  // Cross-out animation for levels 1-4 as they come into focus
  const crossOutTimes = [6, 24, 42, 60];
  const renderCrossOut = (idx: number) => {
    const activeAt = crossOutTimes[idx];
    if (frame < activeAt) return 0;
    return interpolate(frame, [activeAt, activeAt + 8], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_DRAMATIC,
    });
  };

  // Show "NEVIENS NAV TEV" label during levels 1-4 panning (frame 0-70)
  const notYouLabelOpacity = interpolate(frame, [0, 8, 70, 76], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Level 5 reveal effects
  const level5Reveal = spring({
    frame: frame - 80,
    fps,
    config: { damping: 12, stiffness: 180, mass: 0.6 },
  });

  const shakeMag = interpolate(frame, [80, 95], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shakeX = frame >= 80 && frame <= 95 ? Math.sin(frame * 40) * shakeMag : 0;
  const shakeY = frame >= 80 && frame <= 95 ? Math.cos(frame * 38) * shakeMag * 0.7 : 0;

  // "Level 5 — DAILY" label
  const targetLabelSpring = spring({
    frame: frame - 92,
    fps,
    config: { damping: 14, stiffness: 170 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BLACK,
        transform: `translate(${shakeX}px, ${shakeY}px)`,
      }}
    >
      {/* Background glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, ${YELLOW}08 0%, transparent 60%)`,
        }}
      />

      {/* The zoomed/panned infographic */}
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
            transform: `scale(${imgScale}) translate(${translateX / imgScale}px, ${translateY}px)`,
            filter: `blur(${camBlur}px)`,
            transformOrigin: "center center",
          }}
        >
          <Img
            src={staticFile("photos/workshop/ai-5-limeni.png")}
            style={{
              width: 1080,
              height: "auto",
              display: "block",
            }}
          />
        </div>
      </AbsoluteFill>

      {/* Red cross-out overlays for levels 1-4 */}
      {[0, 1, 2, 3].map((idx) => {
        const progress = renderCrossOut(idx);
        if (progress === 0) return null;
        // We draw a red X over the center of screen (since camera is panned to that level)
        return (
          <AbsoluteFill
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                position: "relative",
                width: 320,
                height: 320,
                opacity: progress,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: `${progress * 120}%`,
                  height: 10,
                  backgroundColor: RED,
                  transform: "translate(-50%, -50%) rotate(25deg)",
                  boxShadow: `0 0 20px ${RED}, 0 0 40px ${RED}80`,
                  borderRadius: 4,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: `${progress * 120}%`,
                  height: 10,
                  backgroundColor: RED,
                  transform: "translate(-50%, -50%) rotate(-25deg)",
                  boxShadow: `0 0 20px ${RED}, 0 0 40px ${RED}80`,
                  borderRadius: 4,
                }}
              />
            </div>
          </AbsoluteFill>
        );
      })}

      {/* "Tas nav Tu" label at top */}
      {notYouLabelOpacity > 0.05 && (
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: notYouLabelOpacity,
          }}
        >
          <ChromaticText
            splitAmount={4}
            style={{
              fontSize: 52,
              fontWeight: 900,
              fontFamily: '"Inter", sans-serif',
              letterSpacing: "-0.02em",
              textShadow: `0 4px 20px rgba(0,0,0,0.7)`,
            }}
          >
            TAS NAV TU.
          </ChromaticText>
        </div>
      )}

      {/* Level 5 glow ring + label when we land */}
      {frame >= 80 && (
        <>
          {/* Big glow ring */}
          <AbsoluteFill
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                width: 500,
                height: 360,
                border: `4px solid ${YELLOW}`,
                borderRadius: 20,
                boxShadow: `0 0 60px ${YELLOW}, 0 0 120px ${YELLOW}80, inset 0 0 40px ${YELLOW}40`,
                opacity: level5Reveal,
                transform: `scale(${level5Reveal * 0.3 + 0.7})`,
              }}
            />
          </AbsoluteFill>

          {/* Label */}
          <div
            style={{
              position: "absolute",
              bottom: 80,
              left: 0,
              right: 0,
              textAlign: "center",
              opacity: targetLabelSpring,
              transform: `translateY(${(1 - targetLabelSpring) * 20}px)`,
            }}
          >
            <div
              style={{
                fontSize: 60,
                fontWeight: 900,
                color: YELLOW,
                fontFamily: '"Inter", sans-serif',
                letterSpacing: "-0.02em",
                textShadow: `0 0 40px ${YELLOW}, 0 4px 20px rgba(0,0,0,0.7)`,
              }}
            >
              ŠEIT Tev jābūt.
            </div>
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};

// --- SCENE 3: The bridge — how the toolkit gets you to Level 5 ---
const SceneBridge: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineSpring = spring({
    frame: frame - 3,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const barFillProgress = spring({
    frame: frame - 18,
    fps,
    config: { damping: 200, stiffness: 60 },
  });

  const textSpring = spring({
    frame: frame - 50,
    fps,
    config: { damping: 14, stiffness: 170 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: BLACK }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, ${YELLOW}10 0%, transparent 60%)`,
        }}
      />
      <ParticleField count={30} opacity={0.4} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 36,
          padding: 60,
        }}
      >
        <div
          style={{
            opacity: headlineSpring,
            transform: `translateY(${(1 - headlineSpring) * 15}px)`,
            fontSize: 54,
            fontWeight: 900,
            color: "white",
            fontFamily: '"Inter", sans-serif',
            textAlign: "center",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}
        >
          AI Rīku Komplekts
          <br />
          <span
            style={{
              color: YELLOW,
              textShadow: `0 0 40px ${YELLOW}60`,
            }}
          >
            pārvieto Tevi uz 5. līmeni.
          </span>
        </div>

        {/* Level progression bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            width: "90%",
            maxWidth: 820,
          }}
        >
          {[1, 2, 3, 4, 5].map((n, i) => {
            const filled = barFillProgress > i / 5;
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 70,
                  borderRadius: 14,
                  backgroundColor: filled ? YELLOW : "rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 36,
                  fontWeight: 900,
                  color: filled ? BLACK : "rgba(255,255,255,0.3)",
                  fontFamily: '"Inter", sans-serif',
                  boxShadow: filled ? `0 0 30px ${YELLOW}80` : "none",
                }}
              >
                {n}
              </div>
            );
          })}
        </div>

        <div
          style={{
            opacity: textSpring,
            transform: `scale(${textSpring})`,
            fontSize: 36,
            fontWeight: 800,
            color: GREEN,
            fontFamily: '"Inter", sans-serif',
            textAlign: "center",
          }}
        >
          Bez mācībām. Bez stundām YouTube.
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
            PĀRIET UZ 5. LĪMENI →
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

export const AIToolkitPro4FiveLevels: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BLACK }}>
      <Sequence from={0} durationInFrames={70} layout="none">
        <SceneQuestion />
      </Sequence>

      <Sequence from={70} durationInFrames={120} layout="none">
        <SceneLevels />
      </Sequence>

      <Sequence from={190} durationInFrames={100} layout="none">
        <SceneBridge />
      </Sequence>

      <Sequence from={290} durationInFrames={110} layout="none">
        <ScenePriceSlam />
      </Sequence>
    </AbsoluteFill>
  );
};
