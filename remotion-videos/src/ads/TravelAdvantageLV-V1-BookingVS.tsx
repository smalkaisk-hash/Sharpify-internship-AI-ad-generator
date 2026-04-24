/**
 * Travel Advantage (LV) — "Booking rāda vienu cenu. Mēs redzam citu."
 *
 * Client: Ineta K — Lifestyle Ambassador for Travel Advantage™ (MWR Life)
 * Target: Latvian travelers who pay full price on Booking, want wholesale access
 * Offer: members-only travel platform with up to 70% off + cashback + 4 guests free
 * CTA: book a 45-min free consultation with Ineta
 *
 * Format: 1080×1920 9:16 Reels, 15s @ 30fps (450 frames)
 * 4-scene: HOOK (price VS) → BENEFITS → PROOF → CTA
 */
import {
  AbsoluteFill,
  Easing,
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

const GREEN = "#10B981"; // emerald-500 (brand primary)
const DEEP_GREEN = "#064E3B"; // emerald-900
const SOFT_GREEN = "#D1FAE5"; // emerald-100
const CREAM = "#FAF8F3";
const GOLD = "#C5A94E";
const BLUE = "#2563EB"; // Booking-like blue for the "old price" card
const DARK = "#0A0F14";

// ═══ Scene 1 — HOOK: Booking vs Travel Advantage price compare (0-90, 3s) ═══
const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const outOpacity = interpolate(frame, [78, 90], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const zoom = interpolate(frame, [0, 90], [1.0, 1.06], {
    extrapolateRight: "clamp",
  });

  const line1 = spring({ frame: frame - 6, fps, config: { damping: 16, stiffness: 130 } });
  const line2 = spring({ frame: frame - 18, fps, config: { damping: 16, stiffness: 130 } });
  const turn = spring({ frame: frame - 38, fps, config: { damping: 18, stiffness: 120 } });
  const slam = spring({
    frame: frame - 50,
    fps,
    config: { damping: 9, stiffness: 200, mass: 1.1 },
  });
  const footnote = spring({
    frame: frame - 68,
    fps,
    config: { damping: 18, stiffness: 140 },
  });

  const slamPulse = 1 + Math.sin(frame / 8) * 0.025;

  return (
    <AbsoluteFill style={{ opacity: outOpacity }}>
      {/* Sunset beach silhouette — wistful, distinct from Scene 2 aerial */}
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <OffthreadVideo
          src={staticFile("videos/traveladvantage/hook-sunset-beach.mp4")}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* Softer warm overlay — preserves sunset palette while ensuring readability */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(8,20,40,0.35) 0%, rgba(20,10,30,0.15) 25%, rgba(10,20,35,0.55) 70%, rgba(5,15,30,0.88) 100%)",
        }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "0 60px",
          gap: 4,
        }}
      >
        {/* Setup line 1 */}
        <div
          style={{
            fontFamily: PLAYFAIR,
            fontSize: 108,
            fontWeight: 600,
            color: "white",
            lineHeight: 1.02,
            letterSpacing: "-0.01em",
            opacity: line1,
            transform: `translateX(${interpolate(line1, [0, 1], [-50, 0])}px)`,
            textShadow: "0 6px 28px rgba(0,0,0,0.85), 0 2px 8px rgba(0,0,0,0.8)",
          }}
        >
          Budžets šogad
        </div>

        {/* Setup line 2 — with red accent on "nē" */}
        <div
          style={{
            fontFamily: PLAYFAIR,
            fontSize: 108,
            fontWeight: 600,
            color: "white",
            lineHeight: 1.02,
            letterSpacing: "-0.01em",
            opacity: line2,
            transform: `translateX(${interpolate(line2, [0, 1], [-50, 0])}px)`,
            textShadow: "0 6px 28px rgba(0,0,0,0.85), 0 2px 8px rgba(0,0,0,0.8)",
          }}
        >
          saka{" "}
          <span
            style={{
              color: "#ff6b4a",
              fontWeight: 800,
              fontStyle: "italic",
              textDecoration: "underline",
              textDecorationColor: "#ff6b4a",
              textDecorationThickness: "6px",
              textUnderlineOffset: "10px",
            }}
          >
            nē
          </span>{" "}
          ceļojumam?
        </div>

        {/* Turn */}
        <div
          style={{
            fontFamily: PLAYFAIR,
            fontSize: 74,
            fontWeight: 500,
            fontStyle: "italic",
            color: SOFT_GREEN,
            lineHeight: 1,
            letterSpacing: "0.01em",
            marginTop: 54,
            opacity: turn,
            transform: `translateX(${interpolate(turn, [0, 1], [-30, 0])}px)`,
            textShadow: "0 4px 18px rgba(0,0,0,0.75)",
          }}
        >
          Mēs sakām —
        </div>

        {/* Slam */}
        <div
          style={{
            fontFamily: PLAYFAIR,
            fontSize: 360,
            fontWeight: 800,
            color: GOLD,
            lineHeight: 0.9,
            letterSpacing: "-0.03em",
            marginTop: 4,
            opacity: slam,
            transform: `scale(${slam * slamPulse})`,
            transformOrigin: "left center",
            textShadow:
              "0 10px 40px rgba(0,0,0,0.85), 0 0 100px rgba(197,169,78,0.45)",
          }}
        >
          JĀ.
        </div>

        {/* Footnote */}
        <div
          style={{
            fontFamily: INTER,
            fontSize: 30,
            fontWeight: 700,
            color: "rgba(255,255,255,0.9)",
            letterSpacing: "0.04em",
            marginTop: 20,
            opacity: footnote,
            transform: `translateY(${interpolate(footnote, [0, 1], [12, 0])}px)`,
            textShadow: "0 2px 10px rgba(0,0,0,0.8)",
          }}
        >
          ceļojumi par <span style={{ color: GOLD, fontWeight: 900 }}>−70%</span> lētāk
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══ Scene 2 — BENEFITS on tropical bg (80-240, 5.3s) ═══
const SceneBenefits: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const inOpacity = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const outOpacity = interpolate(frame, [148, 160], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const zoom = interpolate(frame, [0, 160], [1.0, 1.08], { extrapolateRight: "clamp" });

  const headlineSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, stiffness: 130 },
  });
  const subSpring = spring({ frame: frame - 28, fps, config: { damping: 18, stiffness: 120 } });

  const chipSpring = (i: number) =>
    spring({
      frame: frame - (44 + i * 14),
      fps,
      config: { damping: 16, stiffness: 140 },
    });

  const benefits = [
    { icon: "✈️", text: "Atlaides līdz 70%" },
    { icon: "💰", text: "Cashback katrā rezervācijā" },
    { icon: "🎯", text: "Lojalitātes punkti" },
    { icon: "👨‍👩‍👧‍👦", text: "4 draugi bez papildu maksas" },
  ];

  return (
    <AbsoluteFill style={{ opacity: inOpacity * outOpacity }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <OffthreadVideo
          src={staticFile("videos/traveladvantage/hero-tropical.mp4")}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* Dark green gradient overlay */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(6,78,59,0.65) 0%, rgba(6,78,59,0.35) 40%, rgba(6,78,59,0.85) 100%)",
        }}
      />

      <AbsoluteFill
        style={{
          padding: "120px 50px 120px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Headline */}
        <div>
          <div
            style={{
              fontFamily: INTER,
              fontSize: 28,
              fontWeight: 900,
              color: GOLD,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              marginBottom: 18,
              opacity: spring({ frame, fps, config: { damping: 18, stiffness: 100 } }),
              textShadow: "0 2px 10px rgba(0,0,0,0.7)",
            }}
          >
            Dalībnieku cenas
          </div>
          <div
            style={{
              fontFamily: PLAYFAIR,
              fontSize: 116,
              fontWeight: 800,
              color: "white",
              lineHeight: 0.95,
              letterSpacing: "-0.015em",
              opacity: headlineSpring,
              transform: `translateY(${interpolate(headlineSpring, [0, 1], [30, 0])}px)`,
              textShadow: "0 6px 28px rgba(0,0,0,0.75), 0 2px 8px rgba(0,0,0,0.5)",
            }}
          >
            Līdz −70%
            <br />
            <span style={{ fontStyle: "italic", color: GOLD }}>lētāk.</span>
          </div>
          <div
            style={{
              fontFamily: INTER,
              fontSize: 34,
              fontWeight: 600,
              color: "rgba(255,255,255,0.92)",
              lineHeight: 1.25,
              marginTop: 22,
              opacity: subSpring,
              textShadow: "0 2px 12px rgba(0,0,0,0.65)",
            }}
          >
            Tāda pati viesnīca. Cita piekļuve.
          </div>
        </div>

        {/* Benefit chips */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {benefits.map((b, i) => {
            const p = chipSpring(i);
            return (
              <div
                key={b.text}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  padding: "22px 28px",
                  borderRadius: 20,
                  backgroundColor: "rgba(255,255,255,0.16)",
                  backdropFilter: "blur(16px)",
                  border: `1px solid rgba(255,255,255,0.22)`,
                  opacity: p,
                  transform: `translateX(${interpolate(p, [0, 1], [-30, 0])}px)`,
                }}
              >
                <div style={{ fontSize: 50 }}>{b.icon}</div>
                <div
                  style={{
                    fontFamily: INTER,
                    fontSize: 36,
                    fontWeight: 800,
                    color: "white",
                    textShadow: "0 2px 10px rgba(0,0,0,0.55)",
                  }}
                >
                  {b.text}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══ Scene 3 — PROOF: stats + trust signals (NO logo, no screenshot) (230-360, 4.3s) ═══
const SceneProof: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const inOpacity = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const outOpacity = interpolate(frame, [115, 130], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const titleSpring = spring({ frame, fps, config: { damping: 18, stiffness: 120 } });
  const sub = spring({ frame: frame - 14, fps, config: { damping: 18, stiffness: 120 } });

  const stats = [
    { num: "13+", label: "gadi pieredzes", sub: "starptautisks uzņēmums" },
    { num: "1.25M", label: "biedri Eiropā", sub: "aktīvi ceļotāji" },
    { num: "4.6★", label: "Trustpilot", sub: "reāli klientu atzinumi" },
  ];

  return (
    <AbsoluteFill style={{ opacity: inOpacity * outOpacity }}>
      <AbsoluteFill style={{ backgroundColor: CREAM }} />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 35%, rgba(16,185,129,0.18) 0%, transparent 60%)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 95%, rgba(6,78,59,0.12) 0%, transparent 50%)",
        }}
      />

      <AbsoluteFill
        style={{
          padding: "70px 44px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 30,
        }}
      >
        {/* Title block */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: INTER,
              fontSize: 34,
              fontWeight: 900,
              color: GREEN,
              letterSpacing: "0.3em",
              marginBottom: 18,
              opacity: titleSpring,
              transform: `translateY(${interpolate(titleSpring, [0, 1], [-16, 0])}px)`,
            }}
          >
            ĪSTS. PIERĀDĀMS.
          </div>
          <div
            style={{
              fontFamily: PLAYFAIR,
              fontSize: 140,
              fontWeight: 800,
              color: DARK,
              lineHeight: 0.92,
              letterSpacing: "-0.02em",
              opacity: titleSpring,
            }}
          >
            Platforma, kas
            <br />
            <span style={{ color: DEEP_GREEN, fontStyle: "italic" }}>strādā.</span>
          </div>
          <div
            style={{
              fontFamily: INTER,
              fontSize: 38,
              fontWeight: 600,
              color: "#555",
              marginTop: 26,
              opacity: sub,
              lineHeight: 1.25,
            }}
          >
            Tūkstošiem klientu Eiropā. 13+ gadu pieredze.
          </div>
        </div>

        {/* Stats stack */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {stats.map((s, i) => {
            const p = spring({
              frame: frame - (22 + i * 16),
              fps,
              config: { damping: 14, stiffness: 130 },
            });
            return (
              <div
                key={s.label}
                style={{
                  backgroundColor: "white",
                  borderRadius: 28,
                  padding: "40px 44px",
                  display: "flex",
                  alignItems: "center",
                  gap: 28,
                  boxShadow: "0 20px 50px rgba(6,78,59,0.16)",
                  border: `2px solid rgba(16,185,129,0.25)`,
                  opacity: p,
                  transform: `translateX(${interpolate(p, [0, 1], [40, 0])}px) scale(${p})`,
                }}
              >
                <div
                  style={{
                    fontFamily: PLAYFAIR,
                    fontSize: 150,
                    fontWeight: 800,
                    color: DEEP_GREEN,
                    lineHeight: 0.95,
                    letterSpacing: "-0.03em",
                    minWidth: 340,
                    textAlign: "left",
                  }}
                >
                  {s.num}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: INTER,
                      fontSize: 46,
                      fontWeight: 800,
                      color: DARK,
                      letterSpacing: "-0.01em",
                      lineHeight: 1.05,
                    }}
                  >
                    {s.label}
                  </div>
                  <div
                    style={{
                      fontFamily: INTER,
                      fontSize: 26,
                      fontWeight: 500,
                      color: "#666",
                      marginTop: 8,
                      lineHeight: 1.2,
                    }}
                  >
                    {s.sub}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══ Scene 4 — CTA (350-450, 3.3s) ═══
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const inOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const zoom = interpolate(frame, [0, 100], [1.0, 1.05], { extrapolateRight: "clamp" });

  const eyebrow = spring({ frame, fps, config: { damping: 18, stiffness: 120 } });
  const headline = spring({ frame: frame - 10, fps, config: { damping: 14, stiffness: 130 } });
  const btnSpring = spring({ frame: frame - 28, fps, config: { damping: 10, stiffness: 180 } });
  const btnPulse = 1 + Math.sin(frame / 7) * 0.03;
  const agentSpring = spring({ frame: frame - 40, fps, config: { damping: 18, stiffness: 140 } });

  return (
    <AbsoluteFill style={{ opacity: inOpacity }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <OffthreadVideo
          src={staticFile("videos/traveladvantage/hero-tropical.mp4")}
          muted
          trimBefore={120}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* Deep green gradient overlay */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(6,78,59,0.85) 0%, rgba(6,78,59,0.6) 40%, rgba(6,78,59,0.95) 100%)",
        }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 50px",
          gap: 20,
        }}
      >
        <div
          style={{
            fontFamily: INTER,
            fontSize: 28,
            fontWeight: 900,
            color: GOLD,
            letterSpacing: "0.28em",
            opacity: eyebrow,
            transform: `scale(${eyebrow})`,
            textShadow: "0 2px 10px rgba(0,0,0,0.6)",
          }}
        >
          BEZ MAKSAS · BEZ SAISTĪBĀM
        </div>

        <div
          style={{
            fontFamily: PLAYFAIR,
            fontSize: 104,
            fontWeight: 800,
            color: "white",
            textAlign: "center",
            lineHeight: 1.02,
            letterSpacing: "-0.015em",
            opacity: headline,
            transform: `translateY(${interpolate(headline, [0, 1], [30, 0])}px)`,
            textShadow: "0 6px 28px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.45)",
          }}
        >
          45 min bezmaksas
          <br />
          <span style={{ color: GOLD, fontStyle: "italic" }}>konsultācija.</span>
        </div>

        <div
          style={{
            fontFamily: INTER,
            fontSize: 34,
            fontWeight: 600,
            color: "rgba(255,255,255,0.92)",
            textAlign: "center",
            maxWidth: 900,
            lineHeight: 1.25,
            textShadow: "0 2px 12px rgba(0,0,0,0.5)",
          }}
        >
          Par ceļojumu, platformu vai abiem.
        </div>

        <div style={{ marginTop: 30, transform: `scale(${btnSpring * btnPulse})` }}>
          <div
            style={{
              background: `linear-gradient(180deg, ${GREEN} 0%, ${DEEP_GREEN} 100%)`,
              color: "white",
              fontFamily: INTER,
              fontSize: 104,
              fontWeight: 900,
              padding: "50px 100px",
              borderRadius: 999,
              letterSpacing: "0.04em",
              boxShadow: `0 22px 60px rgba(16,185,129,0.55), 0 0 0 6px rgba(255,255,255,0.18) inset`,
              textTransform: "uppercase",
            }}
          >
            PIESAKIES →
          </div>
        </div>

        {/* Agent badge */}
        <div
          style={{
            marginTop: 30,
            display: "flex",
            alignItems: "center",
            gap: 18,
            opacity: agentSpring,
            transform: `translateY(${interpolate(agentSpring, [0, 1], [16, 0])}px)`,
            backgroundColor: "rgba(255,255,255,0.14)",
            backdropFilter: "blur(12px)",
            padding: "16px 28px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.22)",
          }}
        >
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 27,
              background: `linear-gradient(135deg, ${GOLD} 0%, #8A7030 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: PLAYFAIR,
              fontSize: 26,
              fontWeight: 800,
              color: "white",
            }}
          >
            I.K.
          </div>
          <div>
            <div
              style={{
                fontFamily: INTER,
                fontSize: 22,
                fontWeight: 800,
                color: "white",
                lineHeight: 1.1,
              }}
            >
              Ineta Krupenkina
            </div>
            <div
              style={{
                fontFamily: INTER,
                fontSize: 16,
                fontWeight: 700,
                color: SOFT_GREEN,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginTop: 3,
              }}
            >
              Lifestyle Ambassador · Latvija
            </div>
          </div>
        </div>

        <div
          style={{
            fontFamily: INTER,
            fontSize: 28,
            fontWeight: 800,
            color: "rgba(255,255,255,0.92)",
            letterSpacing: "0.04em",
            marginTop: 20,
            textShadow: "0 2px 10px rgba(0,0,0,0.5)",
          }}
        >
          free.traveladvantage.com/inetaK
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const TravelAdvantageLV: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: CREAM }}>
      <Sequence from={0} durationInFrames={90}>
        <SceneHook />
      </Sequence>
      <Sequence from={80} durationInFrames={160}>
        <SceneBenefits />
      </Sequence>
      <Sequence from={230} durationInFrames={130}>
        <SceneProof />
      </Sequence>
      <Sequence from={350} durationInFrames={100}>
        <SceneCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
