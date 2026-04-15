/**
 * Sharpify Clip 3: Finished Website Showcase
 *
 * Hand pointing at the finished Mr YETI Evakuators website.
 * Overlay: "This is what you get" messaging + social proof + CTA.
 * Format: 1080x1080, matches clip (~12s)
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
const RED = "#FF3B3B";

export const SharpifyClip3Showcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Opening headline
  const headlineSpring = spring({
    frame: frame - 8,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  // Arrow pointing down
  const arrowBounce = Math.sin(frame / 8) * 6;

  // Mid stats
  const statsSpring = spring({
    frame: frame - 130,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  // End CTA
  const ctaFade = interpolate(frame, [250, 270], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const btnSpring = spring({
    frame: frame - 275,
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  const pulse = 1 + Math.sin(frame / 6) * 0.03;

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

      {/* Dark gradient */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.05) 60%, rgba(0,0,0,0.65) 100%)",
        }}
      />

      {/* Opening: "This is what you get" */}
      <Sequence from={0} durationInFrames={130}>
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 30,
            right: 30,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              opacity: headlineSpring,
              transform: `translateY(${(1 - headlineSpring) * -15}px)`,
              fontSize: 50,
              fontWeight: 800,
              color: "white",
              fontFamily: '"Inter", sans-serif',
              textAlign: "center",
              textShadow: "0 4px 20px rgba(0,0,0,0.6)",
              lineHeight: 1.15,
            }}
          >
            Lūk, ko Tu <span style={{ color: YELLOW }}>saņemsi</span>
          </div>

          <div
            style={{
              opacity: headlineSpring,
              transform: `translateY(${arrowBounce}px)`,
              fontSize: 40,
              color: YELLOW,
              textShadow: `0 0 15px ${YELLOW}40`,
            }}
          >
            ↓
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 50,
            left: 30,
            right: 30,
            textAlign: "center",
            opacity: interpolate(frame, [25, 40], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <div
            style={{
              fontSize: 30,
              color: "rgba(255,255,255,0.8)",
              fontFamily: '"Inter", sans-serif',
              textShadow: "0 2px 10px rgba(0,0,0,0.5)",
              fontWeight: 600,
            }}
          >
            Reāla mājaslapa. Reāls klients. Reāls rezultāts.
          </div>
        </div>
      </Sequence>

      {/* Mid: Social proof overlay */}
      <Sequence from={125} durationInFrames={130}>
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 30,
            right: 30,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              opacity: statsSpring,
              display: "flex",
              gap: 30,
            }}
          >
            {[
              { num: "2 300+", label: "uzņēmumi" },
              { num: "1 000+", label: "atsauksmes" },
              { num: "26", label: "valstis" },
            ].map((stat, i) => {
              const s = spring({
                frame: frame - 135 - i * 8,
                fps,
                config: { damping: 200, stiffness: 100 },
              });

              return (
                <div
                  key={i}
                  style={{
                    textAlign: "center",
                    opacity: s,
                    transform: `translateY(${(1 - s) * 10}px)`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 44,
                      fontWeight: 900,
                      color: YELLOW,
                      fontFamily: '"Inter", sans-serif',
                      textShadow: `0 0 15px ${YELLOW}40, 0 2px 8px rgba(0,0,0,0.5)`,
                    }}
                  >
                    {stat.num}
                  </div>
                  <div
                    style={{
                      fontSize: 20,
                      color: "rgba(255,255,255,0.7)",
                      fontFamily: '"Inter", sans-serif',
                      textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 50,
            left: 30,
            right: 30,
            textAlign: "center",
            opacity: interpolate(frame, [145, 160], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <div
            style={{
              fontSize: 30,
              color: "rgba(255,255,255,0.6)",
              fontFamily: '"Inter", sans-serif',
              textShadow: "0 2px 10px rgba(0,0,0,0.5)",
              fontStyle: "italic",
            }}
          >
            Par mums rakstīja Forbes, Dienas Bizness u.c.
          </div>
        </div>
      </Sequence>

      {/* End: CTA overlay */}
      <Sequence from={250}>
        <AbsoluteFill
          style={{
            background: `linear-gradient(180deg, rgba(17,17,17,${0.5 * ctaFade}) 0%, rgba(17,17,17,${0.9 * ctaFade}) 100%)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <Img
            src={staticFile("photos/sharpify/cropped/15.png")}
            style={{
              width: 200,
              height: 200,
              objectFit: "contain",
              opacity: ctaFade,
            }}
          />

          <div
            style={{
              opacity: ctaFade,
              fontSize: 50,
              fontWeight: 800,
              color: "white",
              fontFamily: '"Inter", sans-serif',
              textAlign: "center",
              lineHeight: 1.15,
            }}
          >
            Iegūsti savu par{" "}
            <span style={{ color: YELLOW }}>€59</span>
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

          <div
            style={{
              opacity: interpolate(frame, [285, 295], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              fontSize: 26,
              color: RED,
              fontFamily: '"Inter", sans-serif',
              fontWeight: 600,
              marginTop: 4,
            }}
          >
            ⚡ Tikai 4 vietas palikušas šonedēļ
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
