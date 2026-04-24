/**
 * Naqaa Beauty — Real Life V1: Problem → Solution
 *
 * Live-action Pexels footage. 15s @ 30fps, 9:16 (1080x1920).
 * Hook on dirty-water close-up → product truth → woman under clean shower → CTA.
 */
import {
  AbsoluteFill,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: PLAYFAIR } = loadPlayfair();
const { fontFamily: INTER } = loadInter();

const GOLD = "#B8960C";
const TEAL = "#0097B2";
const WARN = "#ff6b4a";

const FadeIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  dy?: number;
  style?: React.CSSProperties;
}> = ({ children, delay = 0, dy = 30, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({
    frame: frame - delay,
    fps,
    config: { damping: 20, stiffness: 120, mass: 0.8 },
  });
  return (
    <div
      style={{
        ...style,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [dy, 0])}px)`,
      }}
    >
      {children}
    </div>
  );
};

const KenBurns: React.FC<{
  src: string;
  from?: number;
  to?: number;
  trimBefore?: number;
  duration: number;
}> = ({ src, from = 1.0, to = 1.1, trimBefore = 0, duration }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, duration], [from, to], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ transform: `scale(${scale})` }}>
      <OffthreadVideo
        src={staticFile(src)}
        muted
        trimBefore={trimBefore}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </AbsoluteFill>
  );
};

// --- Scene A: Dirty water + question (0 – 165 frames, 5.5s) ---
const SceneDirty: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const outOpacity = interpolate(frame, [150, 165], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const chipStagger = (i: number) =>
    spring({
      frame: frame - (70 + i * 15),
      fps,
      config: { damping: 14, stiffness: 140 },
    });

  return (
    <AbsoluteFill style={{ opacity: outOpacity }}>
      <KenBurns
        src="videos/naqaa-reallife/v1-dirty-water.mp4"
        from={1.0}
        to={1.12}
        duration={165}
      />

      {/* top + bottom vignette */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.75) 0%, transparent 30%, transparent 60%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      <AbsoluteFill
        style={{
          padding: "100px 60px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Top hook */}
        <div>
          <FadeIn delay={8}>
            <div
              style={{
                fontFamily: PLAYFAIR,
                fontSize: 68,
                fontWeight: 500,
                color: "white",
                lineHeight: 1.15,
                letterSpacing: "-0.01em",
                textShadow: "0 2px 20px rgba(0,0,0,0.6)",
              }}
            >
              Vai tu zini,
            </div>
          </FadeIn>
          <FadeIn delay={22}>
            <div
              style={{
                fontFamily: PLAYFAIR,
                fontSize: 72,
                fontWeight: 700,
                color: "white",
                lineHeight: 1.15,
                letterSpacing: "-0.01em",
                textShadow: "0 2px 20px rgba(0,0,0,0.6)",
                marginTop: 6,
              }}
            >
              kas ir tavā
            </div>
          </FadeIn>
          <FadeIn delay={36}>
            <div
              style={{
                fontFamily: PLAYFAIR,
                fontSize: 86,
                fontWeight: 800,
                color: GOLD,
                lineHeight: 1.15,
                letterSpacing: "-0.01em",
                textShadow: "0 2px 20px rgba(0,0,0,0.7)",
                marginTop: 6,
              }}
            >
              dušas ūdenī?
            </div>
          </FadeIn>
        </div>

        {/* Problem chips */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {["HLORS", "RŪSA", "PIEMAISĪJUMI"].map((w, i) => (
            <div
              key={w}
              style={{
                fontFamily: INTER,
                fontSize: 26,
                fontWeight: 800,
                color: "white",
                backgroundColor: `${WARN}dd`,
                padding: "14px 26px",
                borderRadius: 999,
                letterSpacing: "0.08em",
                opacity: chipStagger(i),
                transform: `scale(${chipStagger(i)})`,
                boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              }}
            >
              {w}
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// --- Scene B: Clean shower + solution (155 – 405, 8.3s) ---
const SceneClean: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const inOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });
  const outOpacity = interpolate(frame, [235, 250], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const tagSpring = spring({
    frame: frame - 130,
    fps,
    config: { damping: 14, stiffness: 110 },
  });

  return (
    <AbsoluteFill style={{ opacity: inOpacity * outOpacity }}>
      <KenBurns
        src="videos/naqaa-reallife/v1-clean-shower.mp4"
        from={1.05}
        to={1.0}
        trimBefore={60}
        duration={250}
      />

      {/* Warm light overlay + bottom gradient */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(255,230,190,0.12) 0%, transparent 35%, transparent 55%, rgba(0,0,0,0.75) 100%)",
        }}
      />

      <AbsoluteFill
        style={{
          padding: "120px 60px 100px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <FadeIn delay={15}>
            <div
              style={{
                fontFamily: INTER,
                fontSize: 22,
                fontWeight: 700,
                color: GOLD,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                textShadow: "0 2px 10px rgba(0,0,0,0.6)",
              }}
            >
              Risinājums
            </div>
          </FadeIn>
          <FadeIn delay={30}>
            <div
              style={{
                fontFamily: PLAYFAIR,
                fontSize: 78,
                fontWeight: 600,
                color: "white",
                lineHeight: 1.1,
                marginTop: 14,
                textShadow: "0 2px 18px rgba(0,0,0,0.55)",
              }}
            >
              Tīrs ūdens.
            </div>
          </FadeIn>
          <FadeIn delay={50}>
            <div
              style={{
                fontFamily: PLAYFAIR,
                fontSize: 82,
                fontWeight: 700,
                color: GOLD,
                lineHeight: 1.1,
                textShadow: "0 2px 18px rgba(0,0,0,0.55)",
              }}
            >
              Mirdzoša āda.
            </div>
          </FadeIn>
        </div>

        {/* Product pill */}
        <div
          style={{
            opacity: tagSpring,
            transform: `translateY(${interpolate(tagSpring, [0, 1], [30, 0])}px)`,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 14,
              backgroundColor: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(10px)",
              padding: "18px 28px",
              borderRadius: 999,
              boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: TEAL,
              }}
            />
            <div
              style={{
                fontFamily: INTER,
                fontSize: 26,
                fontWeight: 700,
                color: "#1A1A2E",
                letterSpacing: "0.02em",
              }}
            >
              NAQAA · Vitamīnu dušas filtrs
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// --- Scene C: CTA (395 – 450, 1.8s) ---
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const inOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  const pulse = 1 + Math.sin(frame / 6) * 0.03;
  const btnSpring = spring({
    frame: frame - 8,
    fps,
    config: { damping: 10, stiffness: 160 },
  });

  return (
    <AbsoluteFill style={{ opacity: inOpacity }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, #0cb3cf 0%, #0097B2 45%, #004a5a 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          padding: 60,
        }}
      >
        <FadeIn delay={2}>
          <div
            style={{
              fontFamily: INTER,
              fontSize: 22,
              fontWeight: 600,
              color: "rgba(255,255,255,0.75)",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
            }}
          >
            Naqaa Beauty
          </div>
        </FadeIn>
        <FadeIn delay={8}>
          <div
            style={{
              fontFamily: PLAYFAIR,
              fontSize: 64,
              fontWeight: 700,
              color: "white",
              textAlign: "center",
              lineHeight: 1.15,
              maxWidth: 900,
            }}
          >
            Dāvā savai ādai
            <br />
            <span style={{ color: GOLD }}>dabisku mirdzumu.</span>
          </div>
        </FadeIn>
        <div
          style={{
            marginTop: 30,
            transform: `scale(${btnSpring * pulse})`,
          }}
        >
          <div
            style={{
              backgroundColor: GOLD,
              color: "white",
              fontFamily: INTER,
              fontSize: 30,
              fontWeight: 800,
              padding: "22px 64px",
              borderRadius: 999,
              letterSpacing: "0.06em",
              boxShadow: `0 10px 40px ${GOLD}80`,
            }}
          >
            IEPIRKTIES TAGAD
          </div>
        </div>
        <FadeIn delay={16}>
          <div
            style={{
              fontFamily: INTER,
              fontSize: 22,
              color: "rgba(255,255,255,0.7)",
              marginTop: 12,
            }}
          >
            naqaa-beauty.com
          </div>
        </FadeIn>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const NaqaaRealLifeV1: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Sequence from={0} durationInFrames={165}>
        <SceneDirty />
      </Sequence>
      <Sequence from={155} durationInFrames={250}>
        <SceneClean />
      </Sequence>
      <Sequence from={395} durationInFrames={55}>
        <SceneCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
