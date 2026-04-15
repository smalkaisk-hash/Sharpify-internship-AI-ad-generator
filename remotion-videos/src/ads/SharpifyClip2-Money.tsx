/**
 * Sharpify Clip 2: The Money Shot
 *
 * Hand holding €50 bill in front of the finished website.
 * Overlay: price comparison, value proposition.
 * Format: 1080x1080, matches clip (~10s)
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

const YELLOW = "#E8D500";
const BLACK = "#111111";
const RED = "#FF3B3B";
const GREEN = "#22C55E";

export const SharpifyClip2Money: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Top headline
  const headlineSpring = spring({
    frame: frame - 8,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  // Old price
  const oldPriceSpring = spring({
    frame: frame - 60,
    fps,
    config: { damping: 200, stiffness: 100 },
  });

  const slashProgress = interpolate(frame, [70, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // New price slam
  const newPriceSpring = spring({
    frame: frame - 85,
    fps,
    config: { damping: 10, stiffness: 200, mass: 0.7 },
  });

  const shake = frame >= 85 && frame <= 89 ? Math.sin(frame * 30) * 4 : 0;

  // Saving badge
  const badgeSpring = spring({
    frame: frame - 100,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  // End CTA
  const ctaFade = interpolate(frame, [200, 220], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const btnSpring = spring({
    frame: frame - 225,
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  const pulse = 1 + Math.sin(frame / 6) * 0.03;

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

      {/* Dark gradient */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.1) 65%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Opening headline at top */}
      <Sequence from={0} durationInFrames={60}>
        <div
          style={{
            position: "absolute",
            top: 50,
            left: 30,
            right: 30,
            textAlign: "center",
            opacity: headlineSpring,
            transform: `translateY(${(1 - headlineSpring) * -15}px)`,
          }}
        >
          <div
            style={{
              fontSize: 50,
              fontWeight: 800,
              color: "white",
              fontFamily: '"Inter", sans-serif',
              textShadow: "0 4px 20px rgba(0,0,0,0.6)",
              lineHeight: 1.15,
            }}
          >
            Cik maksā
            <br />
            <span style={{ color: YELLOW }}>profesionāla mājaslapa?</span>
          </div>
        </div>
      </Sequence>

      {/* Price reveal — appears mid-video */}
      <Sequence from={55} durationInFrames={160}>
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          {/* Old price with slash */}
          <div style={{ position: "relative", opacity: oldPriceSpring }}>
            <div
              style={{
                fontSize: 72,
                fontWeight: 900,
                color: "rgba(255,255,255,0.3)",
                fontFamily: '"Inter", sans-serif',
                textShadow: "0 2px 10px rgba(0,0,0,0.4)",
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
              transform: `scale(${newPriceSpring}) translateX(${shake}px)`,
              fontSize: 110,
              fontWeight: 900,
              color: YELLOW,
              fontFamily: '"Inter", sans-serif',
              textShadow: `0 0 40px ${YELLOW}40, 0 4px 15px rgba(0,0,0,0.5)`,
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
              fontSize: 28,
              fontWeight: 700,
              fontFamily: '"Inter", sans-serif',
              padding: "10px 30px",
              borderRadius: 50,
              boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
              marginTop: 4,
            }}
          >
            Ietaupi €240
          </div>
        </div>
      </Sequence>

      {/* Bottom text throughout */}
      <Sequence from={100} durationInFrames={120}>
        <div
          style={{
            position: "absolute",
            bottom: 50,
            left: 30,
            right: 30,
            textAlign: "center",
            opacity: interpolate(frame, [100, 115], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <div
            style={{
              fontSize: 32,
              fontWeight: 600,
              color: "rgba(255,255,255,0.8)",
              fontFamily: '"Inter", sans-serif',
              textShadow: "0 2px 10px rgba(0,0,0,0.5)",
            }}
          >
            Vienreizējs maksājums • Bez abonementiem
          </div>
        </div>
      </Sequence>

      {/* End CTA overlay */}
      <Sequence from={200}>
        <AbsoluteFill
          style={{
            background: `linear-gradient(180deg, rgba(17,17,17,${0.6 * ctaFade}) 0%, rgba(17,17,17,${0.9 * ctaFade}) 100%)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              opacity: ctaFade,
              fontSize: 52,
              fontWeight: 800,
              color: "white",
              fontFamily: '"Inter", sans-serif',
              textAlign: "center",
              lineHeight: 1.15,
            }}
          >
            Gatava <span style={{ color: YELLOW }}>1-3 dienās.</span>
          </div>

          <div style={{ transform: `scale(${btnSpring * pulse})`, marginTop: 8 }}>
            <div
              style={{
                backgroundColor: YELLOW,
                color: BLACK,
                fontSize: 44,
                fontWeight: 800,
                fontFamily: '"Inter", sans-serif',
                padding: "24px 64px",
                borderRadius: 60,
                boxShadow: `0 8px 30px ${YELLOW}50`,
              }}
            >
              PASŪTĪT TAGAD →
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
