/**
 * Naqaa Beauty Ad V2: "4 aromāti. Viena misija."
 *
 * Style: Bright, clean, product-forward. Each scent gets its own moment
 * with color-coded accents. Premium e-commerce feel.
 * Format: 1080x1080 feed ad, 15 seconds
 */
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";

const GOLD = "#B8960C";

interface ProductSlide {
  name: string;
  image: string;
  accentColor: string;
  tagline: string;
}

const products: ProductSlide[] = [
  {
    name: "Precious Rose",
    image: "photos/naqaa-beauty/product-precious-rose-with-box.jpg",
    accentColor: "#E91E7B",
    tagline: "Rožu aromāts maigai ādai",
  },
  {
    name: "Lavender Meadows",
    image: "photos/naqaa-beauty/product-lavender-meadows-with-box.jpg",
    accentColor: "#9B59B6",
    tagline: "Lavandas miers katrā dušā",
  },
  {
    name: "Mango Rain",
    image: "photos/naqaa-beauty/product-mango-rain-with-box.jpg",
    accentColor: "#F5A623",
    tagline: "Tropu svaigums un enerģija",
  },
  {
    name: "Amberwood",
    image: "photos/naqaa-beauty/product-amberwood-with-box.jpg",
    accentColor: "#2D8B4E",
    tagline: "Meža dzintara dziļums",
  },
];

// --- Opening title ---
const SceneTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame: frame - 8,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const countSpring = spring({
    frame: frame - 22,
    fps,
    config: { damping: 200, stiffness: 60 },
  });

  const lineWidth = interpolate(frame, [5, 35], [0, 120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #FAFAF8 0%, #F0EDE6 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
      }}
    >
      <div
        style={{
          opacity: titleSpring,
          transform: `translateY(${(1 - titleSpring) * 25}px)`,
          fontSize: 22,
          fontWeight: 500,
          color: GOLD,
          fontFamily: '"Inter", sans-serif',
          letterSpacing: "0.2em",
          textTransform: "uppercase",
        }}
      >
        Naqaa Beauty
      </div>

      <div
        style={{
          width: lineWidth,
          height: 2,
          backgroundColor: GOLD,
          margin: "8px 0",
        }}
      />

      <div
        style={{
          opacity: countSpring,
          transform: `scale(${0.9 + countSpring * 0.1})`,
          fontSize: 72,
          fontWeight: 700,
          color: "#1A1A2E",
          fontFamily: '"Playfair Display", serif',
          textAlign: "center",
          lineHeight: 1.1,
        }}
      >
        4 aromāti.
        <br />
        <span style={{ color: GOLD }}>Viena misija.</span>
      </div>

      <div
        style={{
          opacity: interpolate(frame, [35, 50], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          fontSize: 28,
          color: "#666",
          fontFamily: '"Inter", sans-serif',
          fontWeight: 300,
          marginTop: 8,
        }}
      >
        Tīrāks ūdens. Skaistāka āda.
      </div>
    </AbsoluteFill>
  );
};

// --- Individual product slide ---
const SceneProductSlide: React.FC<{ product: ProductSlide }> = ({
  product,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const imgSpring = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 80, mass: 1 },
  });

  const textSpring = spring({
    frame: frame - 12,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const floatY = Math.sin(frame / 14) * 4;

  const accentLineWidth = interpolate(frame, [8, 28], [0, 60], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #FAFAF8 0%, #F0EDE6 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Subtle accent glow behind product */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 45%, ${product.accentColor}12 0%, transparent 50%)`,
        }}
      />

      <div
        style={{
          transform: `scale(${imgSpring}) translateY(${floatY}px)`,
          filter: `drop-shadow(0 20px 40px rgba(0,0,0,0.12))`,
        }}
      >
        <Img
          src={staticFile(product.image)}
          style={{
            width: 440,
            height: 440,
            objectFit: "cover",
            borderRadius: 16,
          }}
        />
      </div>

      <div
        style={{
          opacity: textSpring,
          transform: `translateY(${(1 - textSpring) * 15}px)`,
          textAlign: "center",
          marginTop: 24,
        }}
      >
        <div
          style={{
            fontSize: 42,
            fontWeight: 700,
            color: "#1A1A2E",
            fontFamily: '"Playfair Display", serif',
          }}
        >
          {product.name}
        </div>
        <div
          style={{
            width: accentLineWidth,
            height: 3,
            backgroundColor: product.accentColor,
            margin: "10px auto",
            borderRadius: 2,
          }}
        />
        <div
          style={{
            fontSize: 26,
            color: "#666",
            fontFamily: '"Inter", sans-serif',
            fontWeight: 400,
          }}
        >
          {product.tagline}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// --- Closing CTA ---
const SceneCTAClean: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineSpring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const priceSpring = spring({
    frame: frame - 16,
    fps,
    config: { damping: 200, stiffness: 100 },
  });

  const btnSpring = spring({
    frame: frame - 24,
    fps,
    config: { damping: 14, stiffness: 150 },
  });

  const pulse = 1 + Math.sin(frame / 7) * 0.02;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #FAFAF8 0%, #F0EDE6 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
      }}
    >
      <div
        style={{
          opacity: headlineSpring,
          fontSize: 50,
          fontWeight: 700,
          color: "#1A1A2E",
          fontFamily: '"Playfair Display", serif',
          textAlign: "center",
          lineHeight: 1.2,
          maxWidth: 650,
        }}
      >
        Izvēlies savu
        <br />
        <span style={{ color: GOLD }}>aromātu</span>
      </div>

      <div
        style={{
          opacity: priceSpring,
          transform: `scale(${priceSpring})`,
          fontSize: 40,
          fontWeight: 700,
          color: "#1A1A2E",
          fontFamily: '"Inter", sans-serif',
        }}
      >
        34,99€
      </div>

      <div style={{ transform: `scale(${btnSpring * pulse})`, marginTop: 8 }}>
        <div
          style={{
            backgroundColor: GOLD,
            color: "white",
            fontSize: 28,
            fontWeight: 700,
            fontFamily: '"Inter", sans-serif',
            padding: "16px 48px",
            borderRadius: 50,
            boxShadow: `0 6px 24px ${GOLD}40`,
            letterSpacing: "0.04em",
          }}
        >
          APSKATĪT VISUS
        </div>
      </div>

      <div
        style={{
          opacity: interpolate(frame, [30, 40], [0, 0.3], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          fontSize: 18,
          color: "#999",
          fontFamily: '"Inter", sans-serif',
          marginTop: 6,
        }}
      >
        naqaa-beauty.com
      </div>
    </AbsoluteFill>
  );
};

// --- Main composition ---
export const NaqaaV2ProductCarousel: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#FAFAF8" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={70}>
          <SceneTitle />
        </TransitionSeries.Sequence>

        {products.map((product, i) => (
          <>
            <TransitionSeries.Transition
              key={`t-${i}`}
              presentation={slide({ direction: "from-right" })}
              timing={linearTiming({ durationInFrames: 8 })}
            />
            <TransitionSeries.Sequence key={`s-${i}`} durationInFrames={60}>
              <SceneProductSlide product={product} />
            </TransitionSeries.Sequence>
          </>
        ))}

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        <TransitionSeries.Sequence durationInFrames={75}>
          <SceneCTAClean />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
