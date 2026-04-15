/**
 * Sharpify Ad V4: Real Footage Composite
 *
 * Uses actual filmed clips with animated text overlays, price graphics,
 * and bear mascot. Story: building → price reveal → finished result → CTA.
 * Format: 1080x1080, ~20s, Latvian
 */
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

const YELLOW = "#E8D500";
const BLACK = "#111111";
const RED = "#FF3B3B";
const GREEN = "#22C55E";

// --- Scene 1: Building the website (clip1) with overlay text ---
const SceneBuilding: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tagSpring = spring({
    frame: frame - 8,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const subSpring = spring({
    frame: frame - 22,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  // Subtle zoom on the video
  const videoScale = interpolate(frame, [0, 180], [1.05, 1.15], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* Video background */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <OffthreadVideo
          src={staticFile("videos/sharpify/clip1-building.mp4")}
          startFrom={60}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${videoScale})`,
          }}
        />
      </AbsoluteFill>

      {/* Dark gradient overlay for text readability */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* Top tag */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: tagSpring,
          transform: `translateY(${(1 - tagSpring) * -20}px)`,
        }}
      >
        <div
          style={{
            backgroundColor: YELLOW,
            color: BLACK,
            fontSize: 28,
            fontWeight: 800,
            fontFamily: '"Inter", sans-serif',
            padding: "10px 30px",
            borderRadius: 50,
          }}
        >
          SHARPIFY
        </div>
      </div>

      {/* Bottom text */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            opacity: tagSpring,
            transform: `translateY(${(1 - tagSpring) * 20}px)`,
            fontSize: 56,
            fontWeight: 800,
            color: "white",
            fontFamily: '"Inter", sans-serif',
            textAlign: "center",
            lineHeight: 1.15,
            textShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        >
          Mēs būvējam Tavu
          <br />
          <span style={{ color: YELLOW }}>mājaslapu.</span>
        </div>

        <div
          style={{
            opacity: subSpring,
            fontSize: 30,
            color: "rgba(255,255,255,0.7)",
            fontFamily: '"Inter", sans-serif',
            textShadow: "0 2px 10px rgba(0,0,0,0.5)",
          }}
        >
          Profesionāla. Moderna. Individuāla.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// --- Scene 2: Money shot (clip2) with price overlay ---
const SceneMoneyReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const priceSpring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 12, stiffness: 180, mass: 0.7 },
  });

  const shake =
    frame >= 15 && frame <= 19 ? Math.sin(frame * 30) * 3 : 0;

  const badgeSpring = spring({
    frame: frame - 30,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const oldPriceSpring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 200, stiffness: 100 },
  });

  const slashProgress = interpolate(frame, [8, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* Video background */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <OffthreadVideo
          src={staticFile("videos/sharpify/clip2-money.mp4")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </AbsoluteFill>

      {/* Dark overlay */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      {/* Price overlay at top */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        {/* Old price with slash */}
        <div style={{ position: "relative", opacity: oldPriceSpring }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 900,
              color: "rgba(255,255,255,0.35)",
              fontFamily: '"Inter", sans-serif',
              textShadow: "0 2px 10px rgba(0,0,0,0.5)",
            }}
          >
            €299
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

        {/* New price */}
        <div
          style={{
            transform: `scale(${priceSpring}) translateX(${shake}px)`,
            fontSize: 120,
            fontWeight: 900,
            color: YELLOW,
            fontFamily: '"Inter", sans-serif',
            textShadow: `0 0 40px ${YELLOW}40, 0 4px 20px rgba(0,0,0,0.5)`,
            lineHeight: 1,
          }}
        >
          €59
        </div>

        {/* Saving badge */}
        <div
          style={{
            opacity: badgeSpring,
            transform: `scale(${badgeSpring})`,
            backgroundColor: GREEN,
            color: "white",
            fontSize: 26,
            fontWeight: 700,
            fontFamily: '"Inter", sans-serif',
            padding: "10px 28px",
            borderRadius: 50,
            boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
          }}
        >
          Ietaupi €240
        </div>
      </div>

      {/* Bottom text */}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: badgeSpring,
          fontSize: 32,
          fontWeight: 600,
          color: "rgba(255,255,255,0.8)",
          fontFamily: '"Inter", sans-serif',
          textShadow: "0 2px 10px rgba(0,0,0,0.5)",
        }}
      >
        Vienreizējs maksājums. Bez slēptām izmaksām.
      </div>
    </AbsoluteFill>
  );
};

// --- Scene 3: Showcase finished website (clip3) with overlay ---
const SceneShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const textSpring = spring({
    frame: frame - 8,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const statsSpring = spring({
    frame: frame - 25,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  return (
    <AbsoluteFill>
      {/* Video background */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <OffthreadVideo
          src={staticFile("videos/sharpify/clip3-showcase.mp4")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </AbsoluteFill>

      {/* Gradient overlay */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      {/* Top text */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            opacity: textSpring,
            transform: `translateY(${(1 - textSpring) * -15}px)`,
            fontSize: 50,
            fontWeight: 800,
            color: "white",
            fontFamily: '"Inter", sans-serif',
            textAlign: "center",
            textShadow: "0 4px 20px rgba(0,0,0,0.6)",
            lineHeight: 1.15,
          }}
        >
          Rezultāts?
          <br />
          <span style={{ color: YELLOW }}>Profesionāla mājaslapa.</span>
        </div>
      </div>

      {/* Bottom stats */}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 40,
          opacity: statsSpring,
        }}
      >
        {[
          { num: "1-3", label: "dienas" },
          { num: "2 300+", label: "uzņēmumi" },
        ].map((stat, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 48,
                fontWeight: 900,
                color: YELLOW,
                fontFamily: '"Inter", sans-serif',
                textShadow: `0 0 20px ${YELLOW}40, 0 2px 10px rgba(0,0,0,0.5)`,
              }}
            >
              {stat.num}
            </div>
            <div
              style={{
                fontSize: 24,
                color: "rgba(255,255,255,0.7)",
                fontFamily: '"Inter", sans-serif',
                textShadow: "0 2px 8px rgba(0,0,0,0.5)",
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// --- Scene 4: CTA with bear mascot over dark bg ---
const SceneFinalCTA: React.FC = () => {
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

  const btnSpring = spring({
    frame: frame - 22,
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  const pulse = 1 + Math.sin(frame / 6) * 0.03;

  const bearBob = Math.sin(frame / 10) * 4;

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
          background: `radial-gradient(circle at 50% 40%, ${YELLOW}12 0%, transparent 50%)`,
        }}
      />

      <div
        style={{
          transform: `scale(${bearSpring}) translateY(${bearBob}px)`,
        }}
      >
        <Img
          src={staticFile("photos/sharpify/cropped/10.png")}
          style={{ width: 300, height: 300, objectFit: "contain" }}
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
        Gatavs sākt?
        <br />
        <span style={{ color: YELLOW }}>Iegūsti mājaslapu par €59</span>
      </div>

      <div style={{ transform: `scale(${btnSpring * pulse})`, marginTop: 16 }}>
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

      <div
        style={{
          opacity: interpolate(frame, [30, 40], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          fontSize: 28,
          color: RED,
          fontFamily: '"Inter", sans-serif',
          fontWeight: 600,
          marginTop: 8,
        }}
      >
        ⚡ Tikai 4 vietas palikušas šonedēļ
      </div>
    </AbsoluteFill>
  );
};

// --- Main composition ---
export const SharpifyV4RealFootage: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BLACK }}>
      <TransitionSeries>
        {/* Clip 1: Building the website */}
        <TransitionSeries.Sequence durationInFrames={150}>
          <SceneBuilding />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 12 })}
        />

        {/* Clip 2: Money shot + price */}
        <TransitionSeries.Sequence durationInFrames={120}>
          <SceneMoneyReveal />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        {/* Clip 3: Finished website showcase */}
        <TransitionSeries.Sequence durationInFrames={120}>
          <SceneShowcase />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 12 })}
        />

        {/* CTA with bear */}
        <TransitionSeries.Sequence durationInFrames={90}>
          <SceneFinalCTA />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
