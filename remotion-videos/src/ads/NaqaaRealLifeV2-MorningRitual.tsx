/**
 * Naqaa Beauty — Real Life V2: Morning Ritual
 *
 * Cinematic lifestyle: bathroom sunrise, soft hair-touch moment, CTA.
 * 15s @ 30fps, 9:16 (1080x1920).
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

const FadeWord: React.FC<{
  text: string;
  delay: number;
  style?: React.CSSProperties;
  color?: string;
}> = ({ text, delay, style, color = "white" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({
    frame: frame - delay,
    fps,
    config: { damping: 20, stiffness: 100 },
  });
  return (
    <span
      style={{
        ...style,
        color,
        display: "inline-block",
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [22, 0])}px)`,
        marginRight: "0.3em",
      }}
    >
      {text}
    </span>
  );
};

// --- Scene A: Bathroom sunrise — "Katrs rīts sākas ar tīru ūdeni." (0-240) ---
const SceneMorning: React.FC = () => {
  const frame = useCurrentFrame();

  const outOpacity = interpolate(frame, [220, 240], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const zoom = interpolate(frame, [0, 240], [1.0, 1.08], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: outOpacity }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <OffthreadVideo
          src={staticFile("videos/naqaa-reallife/v2-morning-ritual.mp4")}
          muted
          trimBefore={60}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* Warm golden bloom on top, soft darken bottom */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(255,220,170,0.15) 0%, transparent 25%, transparent 55%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      <AbsoluteFill
        style={{
          padding: "140px 70px 140px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <div
          style={{
            fontFamily: PLAYFAIR,
            fontSize: 74,
            fontWeight: 500,
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
            textShadow: "0 2px 20px rgba(0,0,0,0.6)",
          }}
        >
          <FadeWord text="Katrs" delay={20} />
          <FadeWord text="rīts" delay={35} />
          <FadeWord text="sākas" delay={50} />
          <FadeWord text="ar" delay={65} />
          <br />
          <FadeWord text="tīru" delay={85} color={GOLD} style={{ fontWeight: 800 }} />
          <FadeWord text="ūdeni." delay={100} color={GOLD} style={{ fontWeight: 800 }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// --- Scene B: Hair shine — benefits (230-410, 6s) ---
const SceneBenefits: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const inOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });
  const outOpacity = interpolate(frame, [165, 180], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lineDelay = [20, 55, 90];

  const benefits = [
    { label: "Maigāka āda" },
    { label: "Spožāki mati" },
    { label: "Mazāk kairinājuma" },
  ];

  return (
    <AbsoluteFill style={{ opacity: inOpacity * outOpacity }}>
      <OffthreadVideo
        src={staticFile("videos/naqaa-reallife/v2-hair-shine.mp4")}
        muted
        trimBefore={30}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, transparent 40%, transparent 55%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      <AbsoluteFill
        style={{
          padding: "100px 70px 110px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: INTER,
              fontSize: 22,
              fontWeight: 700,
              color: GOLD,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              opacity: spring({ frame: frame - 4, fps, config: { damping: 18, stiffness: 100 } }),
            }}
          >
            Ikdienas rituāls
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {benefits.map((b, i) => {
            const p = spring({
              frame: frame - lineDelay[i],
              fps,
              config: { damping: 18, stiffness: 120 },
            });
            return (
              <div
                key={b.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  opacity: p,
                  transform: `translateX(${interpolate(p, [0, 1], [-40, 0])}px)`,
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 56,
                    backgroundColor: GOLD,
                    borderRadius: 6,
                    boxShadow: `0 0 20px ${GOLD}80`,
                  }}
                />
                <div
                  style={{
                    fontFamily: PLAYFAIR,
                    fontSize: 54,
                    fontWeight: 600,
                    color: "white",
                    textShadow: "0 2px 14px rgba(0,0,0,0.6)",
                  }}
                >
                  {b.label}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// --- Scene C: CTA (400-450, 1.7s) ---
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const inOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  const btnSpring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 10, stiffness: 160 },
  });

  return (
    <AbsoluteFill style={{ opacity: inOpacity }}>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, #F9F3E6 0%, #F0E6CF 70%, #E5D4A8 100%)",
        }}
      />
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
            fontFamily: INTER,
            fontSize: 22,
            fontWeight: 700,
            color: TEAL,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
          }}
        >
          Naqaa Beauty
        </div>
        <div
          style={{
            fontFamily: PLAYFAIR,
            fontSize: 62,
            fontWeight: 700,
            color: "#1A1A2E",
            textAlign: "center",
            lineHeight: 1.15,
            maxWidth: 900,
          }}
        >
          Tavs <span style={{ color: GOLD, fontStyle: "italic" }}>skaistuma</span> rituāls.
        </div>
        <div
          style={{
            marginTop: 20,
            transform: `scale(${btnSpring})`,
            opacity: btnSpring,
          }}
        >
          <div
            style={{
              backgroundColor: "#1A1A2E",
              color: "white",
              fontFamily: INTER,
              fontSize: 28,
              fontWeight: 800,
              padding: "22px 56px",
              borderRadius: 999,
              letterSpacing: "0.05em",
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            }}
          >
            SĀC ŠODIEN
          </div>
        </div>
        <div
          style={{
            fontFamily: INTER,
            fontSize: 22,
            color: "#666",
            marginTop: 8,
          }}
        >
          naqaa-beauty.com
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const NaqaaRealLifeV2: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Sequence from={0} durationInFrames={240}>
        <SceneMorning />
      </Sequence>
      <Sequence from={230} durationInFrames={180}>
        <SceneBenefits />
      </Sequence>
      <Sequence from={400} durationInFrames={50}>
        <SceneCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
