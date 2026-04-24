/**
 * Naqaa Beauty — Real Life V3: 4 Aromāti, 1 Misija
 *
 * Hero aromatic shower → 4 scent reveal cards → CTA.
 * 15s @ 30fps, 9:16 (1080x1920).
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
  Sequence,
} from "remotion";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: PLAYFAIR } = loadPlayfair();
const { fontFamily: INTER } = loadInter();

const GOLD = "#B8960C";
const TEAL = "#0097B2";

type Scent = {
  name: string;
  tagline: string;
  image: string;
  bgFrom: string;
  bgTo: string;
  accent: string;
};

const SCENTS: Scent[] = [
  {
    name: "Mango Rain",
    tagline: "Tropu spirgtums",
    image: "photos/mango-box.jpg",
    bgFrom: "#FFE4B5",
    bgTo: "#F28C28",
    accent: "#D55B17",
  },
  {
    name: "Precious Rose",
    tagline: "Romantisks rituāls",
    image: "photos/precious-rose.jpg",
    bgFrom: "#FDE6EA",
    bgTo: "#E8A0B4",
    accent: "#B6477A",
  },
  {
    name: "Lavander Meadows",
    tagline: "Miers un aromterapija",
    image: "photos/lavender-box.jpg",
    bgFrom: "#EDE7F6",
    bgTo: "#9B7FCC",
    accent: "#6B4FB8",
  },
  {
    name: "Amberwood",
    tagline: "Silta koksne, SPA sajūta",
    image: "photos/amberwood.jpg",
    bgFrom: "#F7E1C2",
    bgTo: "#C08A52",
    accent: "#7A4B1E",
  },
];

// --- Scene A: aromatic hero (0-120, 4s) ---
const SceneHero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const outOpacity = interpolate(frame, [105, 120], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const zoom = interpolate(frame, [0, 120], [1.0, 1.1], {
    extrapolateRight: "clamp",
  });

  const titleSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 18, stiffness: 100 },
  });
  const subSpring = spring({
    frame: frame - 35,
    fps,
    config: { damping: 18, stiffness: 110 },
  });

  return (
    <AbsoluteFill style={{ opacity: outOpacity }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <OffthreadVideo
          src={staticFile("videos/naqaa-reallife/v3-aromatic.mp4")}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.65) 0%, transparent 35%, transparent 60%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          padding: "140px 60px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 14,
        }}
      >
        <div
          style={{
            opacity: titleSpring,
            transform: `translateY(${interpolate(titleSpring, [0, 1], [30, 0])}px)`,
            fontFamily: PLAYFAIR,
            fontSize: 110,
            fontWeight: 800,
            color: "white",
            textAlign: "center",
            lineHeight: 1,
            letterSpacing: "-0.02em",
            textShadow: "0 4px 24px rgba(0,0,0,0.7)",
          }}
        >
          4 aromāti.
        </div>
        <div
          style={{
            opacity: subSpring,
            transform: `translateY(${interpolate(subSpring, [0, 1], [30, 0])}px)`,
            fontFamily: PLAYFAIR,
            fontSize: 88,
            fontWeight: 500,
            fontStyle: "italic",
            color: GOLD,
            textAlign: "center",
            lineHeight: 1,
            textShadow: "0 4px 22px rgba(0,0,0,0.7)",
          }}
        >
          1 misija.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// --- Scent card (one per scent), 60 frames = 2s each ---
const ScentCard: React.FC<{ scent: Scent }> = ({ scent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const CARD_LEN = 60;

  const inOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateRight: "clamp",
  });
  const outOpacity = interpolate(frame, [CARD_LEN - 8, CARD_LEN], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const imgSpring = spring({
    frame: frame - 4,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.9 },
  });
  const textSpring = spring({
    frame: frame - 14,
    fps,
    config: { damping: 18, stiffness: 120 },
  });

  const floatY = Math.sin((frame - 4) / 14) * 6;

  return (
    <AbsoluteFill style={{ opacity: inOpacity * outOpacity }}>
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${scent.bgFrom} 0%, ${scent.bgTo} 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 60,
          gap: 28,
        }}
      >
        {/* product image */}
        <div
          style={{
            transform: `scale(${imgSpring}) translateY(${floatY}px)`,
            filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.25))",
            borderRadius: 24,
            overflow: "hidden",
          }}
        >
          <Img
            src={staticFile(scent.image)}
            style={{
              width: 620,
              height: 620,
              objectFit: "cover",
            }}
          />
        </div>

        {/* name + tagline */}
        <div
          style={{
            textAlign: "center",
            opacity: textSpring,
            transform: `translateY(${interpolate(textSpring, [0, 1], [20, 0])}px)`,
          }}
        >
          <div
            style={{
              fontFamily: PLAYFAIR,
              fontSize: 74,
              fontWeight: 800,
              color: scent.accent,
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
            }}
          >
            {scent.name}
          </div>
          <div
            style={{
              fontFamily: INTER,
              fontSize: 26,
              fontWeight: 500,
              color: "rgba(0,0,0,0.65)",
              marginTop: 10,
              letterSpacing: "0.02em",
            }}
          >
            {scent.tagline}
          </div>
        </div>

        {/* counter dots */}
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          {SCENTS.map((s) => (
            <div
              key={s.name}
              style={{
                width: s.name === scent.name ? 32 : 10,
                height: 10,
                borderRadius: 5,
                backgroundColor:
                  s.name === scent.name ? scent.accent : "rgba(0,0,0,0.2)",
                transition: "width 200ms",
              }}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// --- Scene C: CTA (380-450, 2.3s) ---
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
            "radial-gradient(ellipse at 50% 50%, #0cb3cf 0%, #0097B2 50%, #00485a 100%)",
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
        <div
          style={{
            fontFamily: PLAYFAIR,
            fontSize: 72,
            fontWeight: 700,
            color: "white",
            textAlign: "center",
            lineHeight: 1.15,
            maxWidth: 900,
          }}
        >
          Atrodi savu
          <br />
          <span style={{ color: GOLD, fontStyle: "italic" }}>Naqaa aromātu.</span>
        </div>
        <div
          style={{
            marginTop: 24,
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
              padding: "22px 60px",
              borderRadius: 999,
              letterSpacing: "0.06em",
              boxShadow: `0 10px 40px ${GOLD}80`,
            }}
          >
            IZVĒLIES SAVU
          </div>
        </div>
        <div
          style={{
            fontFamily: INTER,
            fontSize: 22,
            color: "rgba(255,255,255,0.7)",
            marginTop: 8,
          }}
        >
          naqaa-beauty.com
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const NaqaaRealLifeV3: React.FC = () => {
  const CARD = 60;
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Sequence from={0} durationInFrames={120}>
        <SceneHero />
      </Sequence>
      {SCENTS.map((s, i) => (
        <Sequence
          key={s.name}
          from={120 + i * CARD}
          durationInFrames={CARD + 4}
        >
          <ScentCard scent={s} />
        </Sequence>
      ))}
      <Sequence from={360} durationInFrames={90}>
        <SceneCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
