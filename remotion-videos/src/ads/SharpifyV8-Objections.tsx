/**
 * Sharpify Ad V8: "Objection Killer" — FAQ Smash
 *
 * Shows common objections people have ("It's too expensive", "I don't need one",
 * "It takes too long") and smashes each one with a quick answer.
 * Conversational, relatable, removes buying friction.
 * Format: 1080x1080, ~14s, Latvian
 */
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Img,
  staticFile,
} from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

const YELLOW = "#E8D500";
const BLACK = "#0a0a0a";
const RED = "#FF3B3B";
const GREEN = "#22C55E";

// --- Single objection + answer scene (reusable) ---
const ObjectionScene: React.FC<{
  objection: string;
  answer: string;
  emoji: string;
}> = ({ objection, answer, emoji }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const objSpring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  // Objection gets "crossed out"
  const strikeProgress = interpolate(frame, [30, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const answerSpring = spring({
    frame: frame - 42,
    fps,
    config: { damping: 14, stiffness: 180, mass: 0.7 },
  });

  const shake = frame >= 42 && frame <= 46 ? Math.sin(frame * 25) * 3 : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BLACK,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
        padding: 60,
      }}
    >
      {/* The objection — gets struck through */}
      <div style={{ position: "relative" }}>
        <div
          style={{
            opacity: objSpring,
            transform: `translateY(${(1 - objSpring) * 15}px)`,
            fontSize: 46,
            fontWeight: 600,
            color: interpolate(strikeProgress, [0, 1], [1, 0.3])
              ? `rgba(255,255,255,${interpolate(strikeProgress, [0, 1], [0.8, 0.3])})`
              : "white",
            fontFamily: '"Inter", sans-serif',
            textAlign: "center",
            lineHeight: 1.2,
            maxWidth: 750,
            fontStyle: "italic",
          }}
        >
          "{objection}"
        </div>
        {/* Strike line */}
        {strikeProgress > 0 && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "5%",
              width: `${strikeProgress * 90}%`,
              height: 4,
              backgroundColor: RED,
              transform: "translateY(-50%)",
              boxShadow: `0 0 12px ${RED}60`,
              borderRadius: 2,
            }}
          />
        )}
      </div>

      {/* The answer — slams in */}
      <div
        style={{
          opacity: answerSpring,
          transform: `scale(${answerSpring}) translateX(${shake}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 60 }}>{emoji}</span>
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: YELLOW,
            fontFamily: '"Inter", sans-serif',
            textAlign: "center",
            lineHeight: 1.15,
            maxWidth: 750,
          }}
        >
          {answer}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// --- CTA ---
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bearSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  const textSpring = spring({
    frame: frame - 8,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const btnSpring = spring({
    frame: frame - 18,
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  const pulse = 1 + Math.sin(frame / 6) * 0.03;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BLACK,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 40%, ${YELLOW}10 0%, transparent 50%)`,
        }}
      />

      <div style={{ transform: `scale(${bearSpring})` }}>
        <Img
          src={staticFile("photos/sharpify/cropped/11.png")}
          style={{ width: 260, height: 260, objectFit: "contain" }}
        />
      </div>

      <div
        style={{
          opacity: textSpring,
          fontSize: 50,
          fontWeight: 800,
          color: "white",
          fontFamily: '"Inter", sans-serif',
          textAlign: "center",
          lineHeight: 1.15,
        }}
      >
        Vairs nav attaisnojumu.
        <br />
        <span style={{ color: YELLOW }}>Sāc šodien.</span>
      </div>

      <div style={{ transform: `scale(${btnSpring * pulse})`, marginTop: 12 }}>
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
          PASŪTĪT PAR €59 →
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const SharpifyV8Objections: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BLACK }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={85}>
          <ObjectionScene
            objection="Man nav laika nodarboties ar mājaslapu"
            answer="Mēs izdarām visu. Tev vajag tikai 10 minūtes."
            emoji="⏱️"
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: 8 })}
        />

        <TransitionSeries.Sequence durationInFrames={85}>
          <ObjectionScene
            objection="Tas noteikti ir dārgi"
            answer="€59. Lētāk par vienu vakariņu restorānā."
            emoji="💰"
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: 8 })}
        />

        <TransitionSeries.Sequence durationInFrames={85}>
          <ObjectionScene
            objection="Man pagaidām pietiek ar Instagram"
            answer="63% klientu meklē Tevi Google. Nav lapas = nav darījuma."
            emoji="🔍"
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        <TransitionSeries.Sequence durationInFrames={80}>
          <SceneCTA />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
