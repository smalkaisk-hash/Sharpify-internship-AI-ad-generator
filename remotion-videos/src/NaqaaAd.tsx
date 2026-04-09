import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  Sequence,
} from "remotion";

const BRAND_GOLD = "#C5A44E";
const BRAND_BLUE = "#1DA4D4";
const BRAND_DARK = "#1A1A1A";

// --- Reusable animated components ---

const FadeSlideIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
}> = ({ children, delay = 0, direction = "up", distance = 40 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 18, stiffness: 120, mass: 0.8 },
  });

  const translateMap = {
    up: `translateY(${interpolate(progress, [0, 1], [distance, 0])}px)`,
    down: `translateY(${interpolate(progress, [0, 1], [-distance, 0])}px)`,
    left: `translateX(${interpolate(progress, [0, 1], [distance, 0])}px)`,
    right: `translateX(${interpolate(progress, [0, 1], [-distance, 0])}px)`,
  };

  return (
    <div
      style={{
        opacity: progress,
        transform: translateMap[direction],
      }}
    >
      {children}
    </div>
  );
};

// --- Scene 1: Hook ---
const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgScale = interpolate(frame, [0, 90], [1.05, 1], {
    extrapolateRight: "clamp",
  });

  const shimmer = spring({
    frame: frame - 25,
    fps,
    config: { damping: 20, stiffness: 80 },
  });

  return (
    <AbsoluteFill>
      {/* Blue gradient background */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, #1DA4D4 0%, #0E7FAB 50%, #064B6B 100%)",
          transform: `scale(${bgScale})`,
        }}
      />

      {/* Subtle water ripple overlay */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 30% 60%, rgba(255,255,255,0.08) 0%, transparent 50%)",
        }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 60,
        }}
      >
        <FadeSlideIn delay={5}>
          <div
            style={{
              fontSize: 52,
              fontWeight: 300,
              color: "white",
              textAlign: "center",
              lineHeight: 1.3,
              letterSpacing: "0.02em",
            }}
          >
            Vai Tu zini, ko satur
          </div>
        </FadeSlideIn>

        <FadeSlideIn delay={12}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: "white",
              textAlign: "center",
              lineHeight: 1.3,
              marginTop: 8,
            }}
          >
            Tavs dušas ūdens?
          </div>
        </FadeSlideIn>

        <FadeSlideIn delay={22}>
          <div
            style={{
              width: 80,
              height: 3,
              backgroundColor: BRAND_GOLD,
              marginTop: 30,
              opacity: shimmer,
              boxShadow: `0 0 20px ${BRAND_GOLD}40`,
            }}
          />
        </FadeSlideIn>

        <FadeSlideIn delay={28}>
          <div
            style={{
              fontSize: 32,
              color: "rgba(255,255,255,0.85)",
              textAlign: "center",
              marginTop: 24,
              fontWeight: 300,
              lineHeight: 1.5,
            }}
          >
            Hlors. Rūsa. Piemaisījumi.
          </div>
        </FadeSlideIn>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// --- Scene 2: Product Showcase ---
const SceneProducts: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const productScale = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.9 },
  });

  const glow = interpolate(frame, [0, 60, 90], [0, 0.6, 0.3], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* Clean white-to-blue gradient */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, #FFFFFF 0%, #E8F6FC 40%, #C5E8F5 100%)",
        }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Product image */}
        <div
          style={{
            transform: `scale(${productScale})`,
            filter: `drop-shadow(0 20px 60px rgba(29, 164, 212, ${glow}))`,
          }}
        >
          <Img
            src={staticFile("photos/all-filters.jpg")}
            style={{
              width: 700,
              height: 700,
              objectFit: "cover",
              borderRadius: 20,
            }}
          />
        </div>

        <FadeSlideIn delay={15}>
          <div
            style={{
              fontSize: 42,
              fontWeight: 700,
              color: BRAND_DARK,
              textAlign: "center",
              marginTop: 30,
            }}
          >
            Vitaminizētie dušas filtri
          </div>
        </FadeSlideIn>

        <FadeSlideIn delay={22}>
          <div
            style={{
              fontSize: 28,
              color: BRAND_BLUE,
              fontWeight: 500,
              textAlign: "center",
              marginTop: 10,
            }}
          >
            4 aromāti. 1 misija.
          </div>
        </FadeSlideIn>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// --- Scene 3: Benefits ---
const SceneBenefits: React.FC = () => {
  const frame = useCurrentFrame();

  const benefits = [
    { icon: "💧", text: "Attīra no hlora un rūsas" },
    { icon: "✨", text: "Vitaminizē ūdeni" },
    { icon: "🌿", text: "Aromterapijas efekts" },
    { icon: "💆", text: "Maigāka āda un mati" },
  ];

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(135deg, #064B6B 0%, #0E7FAB 50%, #1DA4D4 100%)",
        }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 60,
          gap: 20,
        }}
      >
        <FadeSlideIn delay={0}>
          <div
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: BRAND_GOLD,
              textAlign: "center",
              marginBottom: 20,
              letterSpacing: "0.05em",
            }}
          >
            NAQAA BEAUTY
          </div>
        </FadeSlideIn>

        {benefits.map((b, i) => (
          <FadeSlideIn key={i} delay={8 + i * 10} direction="left">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                backgroundColor: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                borderRadius: 16,
                padding: "18px 36px",
                width: 600,
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <span style={{ fontSize: 36 }}>{b.icon}</span>
              <span
                style={{
                  fontSize: 30,
                  color: "white",
                  fontWeight: 500,
                }}
              >
                {b.text}
              </span>
            </div>
          </FadeSlideIn>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// --- Scene 4: Single product highlight ---
const SceneHighlight: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const floatY = Math.sin(frame / 15) * 8;

  const priceScale = spring({
    frame: frame - 30,
    fps,
    config: { damping: 10, stiffness: 200 },
  });

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, #F8FDFF 0%, #E0F3FA 100%)",
        }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FadeSlideIn delay={0}>
          <div
            style={{
              transform: `translateY(${floatY}px)`,
              filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.15))",
            }}
          >
            <Img
              src={staticFile("photos/mango-box.jpg")}
              style={{
                width: 500,
                height: 500,
                objectFit: "cover",
                borderRadius: 16,
              }}
            />
          </div>
        </FadeSlideIn>

        <FadeSlideIn delay={10}>
          <div
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: BRAND_DARK,
              textAlign: "center",
              marginTop: 24,
            }}
          >
            Mango Rain
          </div>
        </FadeSlideIn>

        <FadeSlideIn delay={16}>
          <div
            style={{
              fontSize: 24,
              color: "#666",
              textAlign: "center",
              marginTop: 6,
            }}
          >
            Vitamin Shower Filter
          </div>
        </FadeSlideIn>

        <div
          style={{
            transform: `scale(${priceScale})`,
            marginTop: 20,
          }}
        >
          <div
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: BRAND_BLUE,
              textAlign: "center",
            }}
          >
            €34.99
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// --- Scene 5: CTA ---
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pulse = 1 + Math.sin(frame / 8) * 0.03;

  const btnSpring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 10, stiffness: 150 },
  });

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, #1DA4D4 0%, #0A6E96 60%, #053D55 100%)",
        }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
        }}
      >
        <FadeSlideIn delay={0}>
          <div
            style={{
              fontSize: 30,
              color: "rgba(255,255,255,0.7)",
              fontWeight: 400,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Naqaa Beauty
          </div>
        </FadeSlideIn>

        <FadeSlideIn delay={6}>
          <div
            style={{
              fontSize: 52,
              fontWeight: 700,
              color: "white",
              textAlign: "center",
              lineHeight: 1.3,
              maxWidth: 700,
            }}
          >
            Dāvā savai ādai
            <br />
            <span style={{ color: BRAND_GOLD }}>dabisku mirdzumu!</span>
          </div>
        </FadeSlideIn>

        <div
          style={{
            marginTop: 30,
            transform: `scale(${btnSpring * pulse})`,
          }}
        >
          <div
            style={{
              backgroundColor: BRAND_GOLD,
              color: "white",
              fontSize: 32,
              fontWeight: 700,
              padding: "20px 60px",
              borderRadius: 50,
              letterSpacing: "0.05em",
              boxShadow: `0 8px 30px ${BRAND_GOLD}60`,
            }}
          >
            IEPIRKTIES TAGAD
          </div>
        </div>

        <FadeSlideIn delay={20}>
          <div
            style={{
              fontSize: 22,
              color: "rgba(255,255,255,0.6)",
              marginTop: 16,
            }}
          >
            naqaa-beauty.com
          </div>
        </FadeSlideIn>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// --- Main Composition ---
export const NaqaaAdVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {/* Scene 1: Hook question (0-3s) */}
      <Sequence from={0} durationInFrames={90}>
        <SceneHook />
      </Sequence>

      {/* Scene 2: Product showcase (3-6s) */}
      <Sequence from={90} durationInFrames={90}>
        <SceneProducts />
      </Sequence>

      {/* Scene 3: Benefits (6-9.5s) */}
      <Sequence from={180} durationInFrames={105}>
        <SceneBenefits />
      </Sequence>

      {/* Scene 4: Single product highlight (9.5-12.5s) */}
      <Sequence from={285} durationInFrames={90}>
        <SceneHighlight />
      </Sequence>

      {/* Scene 5: CTA (12.5-15s) */}
      <Sequence from={375} durationInFrames={75}>
        <SceneCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
