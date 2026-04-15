/**
 * Sharpify Clip 1: Website Being Built
 *
 * The screen recording of building a website with text overlays.
 * Story: Hook text → video plays → CTA overlay at the end
 * Format: 1080x1080, matches clip duration (~7s usable)
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
  Img,
} from "remotion";

const YELLOW = "#E8D500";
const BLACK = "#111111";

export const SharpifyClip1Building: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slow zoom on the video
  const videoScale = interpolate(frame, [0, 300], [1.02, 1.12], {
    extrapolateRight: "clamp",
  });

  // Top badge
  const badgeSpring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 200, stiffness: 100 },
  });

  // Main headline
  const headlineSpring = spring({
    frame: frame - 12,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  // Subtitle
  const subSpring = spring({
    frame: frame - 25,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  // Mid-video text (appears after initial text)
  const midTextSpring = spring({
    frame: frame - 120,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  // End CTA
  const ctaFade = interpolate(frame, [220, 240], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const btnSpring = spring({
    frame: frame - 250,
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  const pulse = 1 + Math.sin(frame / 6) * 0.03;

  // Price at end
  const priceSpring = spring({
    frame: frame - 240,
    fps,
    config: { damping: 12, stiffness: 180, mass: 0.7 },
  });

  return (
    <AbsoluteFill>
      {/* Video background - full duration */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <OffthreadVideo
          src={staticFile("videos/sharpify/clip1-building.mp4")}
          startFrom={30}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${videoScale})`,
          }}
        />
      </AbsoluteFill>

      {/* Persistent dark gradient for text readability */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.05) 55%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      {/* Top: Sharpify badge */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: badgeSpring,
          transform: `translateY(${(1 - badgeSpring) * -15}px)`,
        }}
      >
        <div
          style={{
            backgroundColor: YELLOW,
            color: BLACK,
            fontSize: 24,
            fontWeight: 800,
            fontFamily: '"Inter", sans-serif',
            padding: "8px 28px",
            borderRadius: 50,
            boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
          }}
        >
          SHARPIFY
        </div>
      </div>

      {/* Opening headline */}
      <Sequence from={0} durationInFrames={120}>
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 40,
            right: 40,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              opacity: headlineSpring,
              transform: `translateY(${(1 - headlineSpring) * 20}px)`,
              fontSize: 52,
              fontWeight: 800,
              color: "white",
              fontFamily: '"Inter", sans-serif',
              textAlign: "center",
              lineHeight: 1.15,
              textShadow: "0 4px 20px rgba(0,0,0,0.6)",
            }}
          >
            Šādi mēs būvējam
            <br />
            <span style={{ color: YELLOW }}>Tavu mājaslapu</span>
          </div>

          <div
            style={{
              opacity: subSpring,
              fontSize: 28,
              color: "rgba(255,255,255,0.7)",
              fontFamily: '"Inter", sans-serif',
              textShadow: "0 2px 10px rgba(0,0,0,0.5)",
              textAlign: "center",
            }}
          >
            No idejas līdz gatavai lapai 1-3 dienās
          </div>
        </div>
      </Sequence>

      {/* Mid-video: process highlight */}
      <Sequence from={120} durationInFrames={100}>
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 40,
            right: 40,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              opacity: midTextSpring,
              transform: `translateY(${(1 - midTextSpring) * 20}px)`,
              fontSize: 46,
              fontWeight: 800,
              color: "white",
              fontFamily: '"Inter", sans-serif',
              textAlign: "center",
              lineHeight: 1.15,
              textShadow: "0 4px 20px rgba(0,0,0,0.6)",
            }}
          >
            Dizains. Saturs. Mobilais.
            <br />
            <span style={{ color: YELLOW }}>Mēs izdarām visu.</span>
          </div>
        </div>
      </Sequence>

      {/* End: Price + CTA overlay */}
      <Sequence from={220}>
        <AbsoluteFill
          style={{
            background: `linear-gradient(180deg, rgba(0,0,0,${0.5 * ctaFade}) 0%, rgba(0,0,0,${0.85 * ctaFade}) 100%)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              transform: `scale(${priceSpring})`,
              fontSize: 100,
              fontWeight: 900,
              color: YELLOW,
              fontFamily: '"Inter", sans-serif',
              textShadow: `0 0 40px ${YELLOW}40`,
              lineHeight: 1,
            }}
          >
            €59
          </div>

          <div
            style={{
              opacity: ctaFade,
              fontSize: 36,
              fontWeight: 600,
              color: "rgba(255,255,255,0.7)",
              fontFamily: '"Inter", sans-serif',
            }}
          >
            Vienreizējs maksājums
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
              IEGŪSTI MĀJASLAPU →
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
