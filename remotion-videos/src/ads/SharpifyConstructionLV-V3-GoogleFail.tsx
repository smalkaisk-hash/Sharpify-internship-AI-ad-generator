/**
 * Sharpify — Construction Free Website Offer (LV)
 *
 * Target: Latvian construction companies with €500,000+ yearly revenue
 * Offer: free website build (they pay only standard hosting)
 * CTA:   book a 15-min Zoom call with Nik
 *
 * Format: 1080×1920 9:16 Reels, 15s @ 30fps (450 frames)
 * 4-scene: HOOK → OFFER → PROOF → CTA
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
import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: BEBAS } = loadBebas();
const { fontFamily: ANTON } = loadAnton();
const { fontFamily: INTER } = loadInter();

const YELLOW = "#E8D500";
const BLACK = "#0a0a0a";
const RED = "#FF3344";
const GREEN = "#22C55E";

const HazardStripe: React.FC<{ position: "top" | "bottom"; height?: number }> = ({
  position,
  height = 28,
}) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      [position]: 0,
      height,
      background: `repeating-linear-gradient(135deg, ${YELLOW} 0 22px, ${BLACK} 22px 44px)`,
      zIndex: 5,
    }}
  />
);

// ═══ Scene 1 — HOOK (0-90, 3s) ═══
// V3 HOOK — "Google tevi neatrod" — competitors fill search results, stamp says TEVIS TUR NAV
const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const outOpacity = interpolate(frame, [78, 90], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const searchIn = spring({ frame: frame - 2, fps, config: { damping: 18, stiffness: 120 } });
  const stamp = spring({
    frame: frame - 58,
    fps,
    config: { damping: 9, stiffness: 180, mass: 1.1 },
  });

  const results = [
    {
      title: "Kvalitatīvi pamati Rīgā 24/7",
      url: "pamatu-meistari.lv",
      snippet: "20+ gadu pieredze. Pamatu un mūrniecības darbi.",
    },
    {
      title: "SIA Pro-Būve | Jumti un fasādes",
      url: "pro-buve.lv",
      snippet: "Profesionāls serviss Pierīgā. Zvaniet!",
    },
    {
      title: "Latvijas Būvnieku katalogs",
      url: "buvnieki-lv.lv",
      snippet: "500+ sertificētu būvnieku vienkopus.",
    },
    {
      title: "Celtnieks.lv — atrodi labāko",
      url: "celtnieks.lv",
      snippet: "Meklē un salīdzini būvniekus Latvijā.",
    },
  ];

  return (
    <AbsoluteFill style={{ opacity: outOpacity }}>
      <AbsoluteFill style={{ backgroundColor: "#f4f4f7" }} />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(0,0,0,0.06) 100%)",
        }}
      />

      <HazardStripe position="top" />
      <HazardStripe position="bottom" />

      {/* Search bar */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 40,
          right: 40,
          opacity: searchIn,
          transform: `translateY(${interpolate(searchIn, [0, 1], [-20, 0])}px)`,
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: 38,
            padding: "22px 30px",
            display: "flex",
            alignItems: "center",
            gap: 18,
            boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
            border: "1px solid #e4e4e7",
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <div
            style={{
              fontFamily: INTER,
              fontSize: 36,
              fontWeight: 700,
              color: "#0a0a0a",
            }}
          >
            būvnieki rīga
          </div>
        </div>
      </div>

      {/* Results stack */}
      <AbsoluteFill
        style={{
          padding: "230px 40px 180px",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        {results.map((r, i) => {
          const p = spring({
            frame: frame - (14 + i * 9),
            fps,
            config: { damping: 16, stiffness: 140 },
          });
          const dim = frame > 56 ? 0.28 : 1;
          return (
            <div
              key={r.url}
              style={{
                backgroundColor: "white",
                borderRadius: 16,
                padding: "24px 26px",
                boxShadow: "0 3px 12px rgba(0,0,0,0.06)",
                opacity: p * dim,
                transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px)`,
                filter: frame > 56 ? "grayscale(0.8)" : "none",
              }}
            >
              <div
                style={{
                  fontFamily: INTER,
                  fontSize: 19,
                  fontWeight: 600,
                  color: "#1a73e8",
                  marginBottom: 6,
                }}
              >
                {r.url}
              </div>
              <div
                style={{
                  fontFamily: INTER,
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#0a0a0a",
                  lineHeight: 1.2,
                  marginBottom: 8,
                }}
              >
                {r.title}
              </div>
              <div
                style={{
                  fontFamily: INTER,
                  fontSize: 19,
                  color: "#555",
                  lineHeight: 1.4,
                }}
              >
                {r.snippet}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>

      {/* Red stamp slam */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: stamp,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            transform: `scale(${stamp}) rotate(-6deg)`,
            fontFamily: BEBAS,
            fontSize: 170,
            color: "white",
            backgroundColor: RED,
            padding: "26px 56px",
            border: `10px solid ${BLACK}`,
            boxShadow: `14px 14px 0 ${BLACK}`,
            letterSpacing: "0.04em",
            lineHeight: 1,
          }}
        >
          TEVIS TUR NAV.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══ Scene 2 — OFFER (80-240, 5.3s) ═══
const SceneOffer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wipeIn = interpolate(frame, [0, 14], [0, 100], {
    extrapolateRight: "clamp",
  });
  const outOpacity = interpolate(frame, [148, 160], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const eyebrow = spring({ frame: frame - 14, fps, config: { damping: 18, stiffness: 120 } });
  const titleSpring = spring({
    frame: frame - 22,
    fps,
    config: { damping: 12, stiffness: 160 },
  });
  const ribbonSpring = spring({
    frame: frame - 38,
    fps,
    config: { damping: 14, stiffness: 140 },
  });
  const bigZeroSpring = spring({
    frame: frame - 55,
    fps,
    config: { damping: 9, stiffness: 180, mass: 1.3 },
  });
  const stampSpring = spring({
    frame: frame - 85,
    fps,
    config: { damping: 8, stiffness: 160 },
  });

  const zeroPulse = 1 + Math.sin(frame / 7) * 0.02;

  return (
    <AbsoluteFill style={{ opacity: outOpacity }}>
      {/* Wipe: yellow slides in from left */}
      <AbsoluteFill
        style={{
          backgroundColor: YELLOW,
          clipPath: `inset(0 ${100 - wipeIn}% 0 0)`,
        }}
      />
      {/* Radial accent */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(255,235,0,0.3) 0%, transparent 60%)",
          clipPath: `inset(0 ${100 - wipeIn}% 0 0)`,
        }}
      />
      {/* Diagonal construction texture */}
      <AbsoluteFill
        style={{
          opacity: 0.06,
          backgroundImage: `repeating-linear-gradient(135deg, ${BLACK} 0 2px, transparent 2px 40px)`,
          clipPath: `inset(0 ${100 - wipeIn}% 0 0)`,
        }}
      />

      <HazardStripe position="top" />
      <HazardStripe position="bottom" />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 60px",
          gap: 8,
        }}
      >
        {/* Gift ribbon / eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            opacity: eyebrow,
            transform: `scale(${eyebrow})`,
          }}
        >
          <GiftIcon />
          <div
            style={{
              fontFamily: INTER,
              fontSize: 28,
              fontWeight: 900,
              color: YELLOW,
              backgroundColor: BLACK,
              letterSpacing: "0.28em",
              padding: "12px 26px",
            }}
          >
            DĀVANA TEV
          </div>
          <GiftIcon mirror />
        </div>

        {/* MĀJASLAPA title */}
        <div
          style={{
            fontFamily: BEBAS,
            fontSize: 150,
            color: BLACK,
            lineHeight: 0.9,
            letterSpacing: "0.005em",
            opacity: titleSpring,
            transform: `translateY(${interpolate(titleSpring, [0, 1], [40, 0])}px)`,
            marginTop: 14,
          }}
        >
          MĀJASLAPA
        </div>

        {/* Ribbon banner under title */}
        <div
          style={{
            opacity: ribbonSpring,
            transform: `translateY(${interpolate(ribbonSpring, [0, 1], [20, 0])}px) rotate(-2deg)`,
            marginTop: -4,
          }}
        >
          <div
            style={{
              position: "relative",
              fontFamily: ANTON,
              fontSize: 42,
              color: "white",
              backgroundColor: GREEN,
              padding: "12px 36px",
              letterSpacing: "0.12em",
              border: `4px solid ${BLACK}`,
              boxShadow: `6px 6px 0 ${BLACK}`,
            }}
          >
            JA TEV IR €500K+ GADĀ
          </div>
        </div>

        {/* Massive €0 */}
        <div
          style={{
            fontFamily: BEBAS,
            fontSize: 440,
            color: BLACK,
            lineHeight: 0.85,
            letterSpacing: "-0.04em",
            opacity: bigZeroSpring,
            transform: `scale(${bigZeroSpring * zeroPulse})`,
            textShadow: `12px 12px 0 rgba(0,0,0,0.15)`,
            marginTop: 10,
            position: "relative",
          }}
        >
          €0
        </div>

        {/* BEZMAKSAS stamp */}
        <div
          style={{
            opacity: stampSpring,
            transform: `scale(${stampSpring}) rotate(-5deg)`,
          }}
        >
          <div
            style={{
              fontFamily: ANTON,
              fontSize: 60,
              color: "white",
              backgroundColor: BLACK,
              padding: "12px 36px",
              letterSpacing: "0.08em",
              border: `4px solid ${YELLOW}`,
              boxShadow: `10px 10px 0 rgba(0,0,0,0.3)`,
            }}
          >
            100% BEZMAKSAS
          </div>
        </div>

        {/* Disclosure fine print */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 60,
            right: 60,
            fontFamily: INTER,
            fontSize: 20,
            fontWeight: 700,
            color: "rgba(10,10,10,0.75)",
            textAlign: "center",
            letterSpacing: "0.02em",
            opacity: interpolate(frame, [105, 118], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          * Tu maksā tikai standarta hostingu — viss pārējais dāvanā.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Small gift-box SVG icon for the OFFER eyebrow
const GiftIcon: React.FC<{ mirror?: boolean }> = ({ mirror }) => (
  <svg
    width="52"
    height="52"
    viewBox="0 0 24 24"
    style={{ transform: mirror ? "scaleX(-1)" : "none" }}
  >
    <rect x="3" y="8" width="18" height="4" fill={BLACK} />
    <rect x="4" y="12" width="16" height="9" fill={BLACK} />
    <rect x="11" y="8" width="2" height="13" fill={YELLOW} />
    <path
      d="M7 8 C 7 5, 11 5, 12 8 C 13 5, 17 5, 17 8"
      stroke={BLACK}
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

// ─── ScrollingPhone: a single phone that scrolls through a real site screenshot ───
// Image path is a full-page puppeteer capture at mobile viewport width.
const SCREENSHOT_PATH = "photos/construction-lv/mryeti-full.png";
// Intrinsic size of the screenshot file (from puppeteer at DPR=2): 852 × 14884
const SCREENSHOT_W = 852;
const SCREENSHOT_H = 14884;

const ScrollingPhone: React.FC<{
  localFrame: number;
  screenInnerWidth: number;
  screenInnerHeight: number;
}> = ({ localFrame, screenInnerWidth, screenInnerHeight }) => {
  // Image rendered at this CSS width; height scales proportionally
  const imgHeight = screenInnerWidth * (SCREENSHOT_H / SCREENSHOT_W);
  const scrollableDistance = Math.max(0, imgHeight - screenInnerHeight);

  // Ease the scroll: brief pause on the hero, then scroll smoothly to near the bottom
  const scrollY = interpolate(
    localFrame,
    [10, 25, 115],
    [0, -120, -scrollableDistance],
    {
      easing: Easing.bezier(0.35, 0, 0.25, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <div
      style={{
        width: screenInnerWidth,
        height: screenInnerHeight,
        overflow: "hidden",
        position: "relative",
        backgroundColor: "#0a0a0a",
      }}
    >
      <Img
        src={staticFile(SCREENSHOT_PATH)}
        style={{
          width: screenInnerWidth,
          height: imgHeight,
          display: "block",
          transform: `translateY(${scrollY}px)`,
        }}
      />
    </div>
  );
};

type ClientSite = {
  domain: string;
  brand: string;
  niche: string;
};

const CLIENT_SITE: ClientSite = {
  domain: "mryeti.lv",
  brand: "Mr YETI Evakuatori",
  niche: "Evakuācija · Visa Latvija",
};


// ═══ Scene 3 — PROOF / real client website scrolling (230-360, 4.3s) ═══
const SceneProof: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const inOpacity = interpolate(frame, [0, 14], [0, 1], {
    extrapolateRight: "clamp",
  });
  const outOpacity = interpolate(frame, [115, 130], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const titleSpring = spring({ frame, fps, config: { damping: 18, stiffness: 120 } });
  const phoneSpring = spring({
    frame: frame - 6,
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  const badgeSpring = spring({
    frame: frame - 20,
    fps,
    config: { damping: 18, stiffness: 140 },
  });

  // Phone frame dimensions
  const PHONE_W = 620;
  const PHONE_H = 1260;
  const PHONE_PAD = 14;
  const BROWSER_BAR_H = 58;
  // Inner screen (below browser chrome) — this is where we scroll the site
  const SCREEN_W = PHONE_W - PHONE_PAD * 2;
  const SCREEN_H = PHONE_H - PHONE_PAD * 2 - BROWSER_BAR_H;

  return (
    <AbsoluteFill style={{ opacity: inOpacity * outOpacity }}>
      {/* Industrial BG */}
      <AbsoluteFill style={{ backgroundColor: BLACK }} />
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 55%, rgba(232,213,0,0.1) 0%, transparent 60%)",
        }}
      />
      <HazardStripe position="top" />
      <HazardStripe position="bottom" />

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: titleSpring,
          transform: `translateY(${interpolate(titleSpring, [0, 1], [-20, 0])}px)`,
          zIndex: 2,
        }}
      >
        <div
          style={{
            fontFamily: INTER,
            fontSize: 20,
            fontWeight: 800,
            color: YELLOW,
            letterSpacing: "0.28em",
            marginBottom: 8,
          }}
        >
          ŠĀDAS MĀJASLAPAS
        </div>
        <div
          style={{
            fontFamily: BEBAS,
            fontSize: 82,
            color: "white",
            lineHeight: 0.95,
            letterSpacing: "0.005em",
          }}
        >
          MĒS TEV UZBŪVĒSIM.
        </div>
      </div>

      {/* Phone centered — scrolling the real Mr YETI site */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 40,
        }}
      >
        <div
          style={{
            width: PHONE_W,
            height: PHONE_H,
            borderRadius: 64,
            backgroundColor: "#1a1a1a",
            padding: PHONE_PAD,
            boxShadow:
              "0 30px 90px rgba(0,0,0,0.65), 0 0 0 2px rgba(255,255,255,0.08) inset",
            position: "relative",
            transform: `scale(${Math.min(phoneSpring, 1)}) translateY(${interpolate(
              phoneSpring,
              [0, 1],
              [40, 0],
            )}px)`,
            opacity: phoneSpring,
          }}
        >
          {/* Screen */}
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 52,
              backgroundColor: "white",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Notch */}
            <div
              style={{
                position: "absolute",
                top: 24,
                left: "50%",
                transform: "translateX(-50%)",
                width: 160,
                height: 32,
                backgroundColor: "#0a0a0a",
                borderRadius: 22,
                zIndex: 10,
              }}
            />

            {/* Browser chrome */}
            <div
              style={{
                height: BROWSER_BAR_H,
                backgroundColor: "#f4f4f5",
                borderBottom: "1px solid #e4e4e7",
                display: "flex",
                alignItems: "center",
                padding: "0 18px",
                gap: 8,
                flexShrink: 0,
              }}
            >
              <div style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: "#ddd" }} />
              <div style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: "#ddd" }} />
              <div style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: "#ddd" }} />
              <div
                style={{
                  flex: 1,
                  height: 30,
                  marginLeft: 10,
                  backgroundColor: "white",
                  borderRadius: 15,
                  fontFamily: INTER,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#444",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 14,
                  gap: 8,
                }}
              >
                <svg width="12" height="13" viewBox="0 0 24 24" fill="#999">
                  <path d="M12 1a5 5 0 0 0-5 5v3H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-2V6a5 5 0 0 0-5-5zm3 8H9V6a3 3 0 1 1 6 0v3z" />
                </svg>
                {CLIENT_SITE.domain}
              </div>
            </div>

            {/* Scrolling website screenshot */}
            <ScrollingPhone
              localFrame={frame - 6}
              screenInnerWidth={SCREEN_W}
              screenInnerHeight={SCREEN_H}
            />
          </div>
        </div>
      </AbsoluteFill>

      {/* Client badge (bottom) */}
      <div
        style={{
          position: "absolute",
          bottom: 70,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          zIndex: 3,
          opacity: badgeSpring,
          transform: `translateY(${interpolate(badgeSpring, [0, 1], [20, 0])}px) scale(${badgeSpring})`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            backgroundColor: YELLOW,
            border: `3px solid ${BLACK}`,
            padding: "10px 22px",
            boxShadow: `6px 6px 0 ${BLACK}`,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: GREEN,
              boxShadow: `0 0 12px ${GREEN}`,
            }}
          />
          <div
            style={{
              fontFamily: INTER,
              fontSize: 15,
              fontWeight: 900,
              color: BLACK,
              letterSpacing: "0.2em",
            }}
          >
            ĪSTS SHARPIFY KLIENTS
          </div>
          <div
            style={{
              width: 1,
              height: 20,
              backgroundColor: "rgba(10,10,10,0.4)",
            }}
          />
          <div
            style={{
              fontFamily: BEBAS,
              fontSize: 22,
              color: BLACK,
              letterSpacing: "0.03em",
            }}
          >
            {CLIENT_SITE.domain}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══ Scene 4 — CTA (350-450, 3.3s) — scaled up ═══
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const inOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });

  const eyebrow = spring({ frame, fps, config: { damping: 18, stiffness: 120 } });
  const headline = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, stiffness: 130 },
  });
  const btnSpring = spring({
    frame: frame - 28,
    fps,
    config: { damping: 10, stiffness: 180 },
  });
  const btnPulse = 1 + Math.sin(frame / 6) * 0.035;

  return (
    <AbsoluteFill style={{ opacity: inOpacity }}>
      <AbsoluteFill style={{ backgroundColor: YELLOW }} />
      <AbsoluteFill
        style={{
          opacity: 0.06,
          backgroundImage: `repeating-linear-gradient(45deg, ${BLACK} 0 2px, transparent 2px 50px)`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(255,235,0,0.3) 0%, transparent 65%)",
        }}
      />
      <HazardStripe position="top" />
      <HazardStripe position="bottom" />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 50px",
          gap: 22,
        }}
      >
        <div
          style={{
            fontFamily: INTER,
            fontSize: 24,
            fontWeight: 900,
            color: YELLOW,
            backgroundColor: BLACK,
            letterSpacing: "0.22em",
            padding: "12px 22px",
            opacity: eyebrow,
            transform: `scale(${eyebrow})`,
          }}
        >
          BŪVNIECĪBAS UZŅĒMUMA ĪPAŠNIEK?
        </div>

        <div
          style={{
            fontFamily: BEBAS,
            fontSize: 170,
            color: BLACK,
            lineHeight: 0.88,
            textAlign: "center",
            letterSpacing: "0.005em",
            opacity: headline,
            transform: `translateY(${interpolate(headline, [0, 1], [36, 0])}px)`,
          }}
        >
          REZERVĒ ZVANU
          <br />
          AR NIKU.
        </div>

        <div
          style={{
            fontFamily: INTER,
            fontSize: 26,
            fontWeight: 700,
            color: "rgba(10,10,10,0.85)",
            textAlign: "center",
            maxWidth: 850,
            lineHeight: 1.3,
            opacity: headline,
          }}
        >
          15-min Zoom saruna.
          <br />
          Nik uzbūvē mājaslapu — bez maksas.
        </div>

        <div
          style={{
            marginTop: 24,
            transform: `scale(${btnSpring * btnPulse})`,
          }}
        >
          <div
            style={{
              backgroundColor: BLACK,
              color: YELLOW,
              fontFamily: BEBAS,
              fontSize: 118,
              padding: "44px 130px",
              letterSpacing: "0.08em",
              border: `8px solid ${BLACK}`,
              boxShadow: `20px 20px 0 rgba(0,0,0,0.9)`,
            }}
          >
            REZERVĒT TAGAD →
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const SharpifyConstructionLVv3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BLACK }}>
      <Sequence from={0} durationInFrames={90}>
        <SceneHook />
      </Sequence>
      <Sequence from={80} durationInFrames={160}>
        <SceneOffer />
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
