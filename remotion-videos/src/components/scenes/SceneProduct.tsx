import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { BrandConfig, SceneConfig } from "../../types/VideoConfig";
import { BrandBackground } from "../layout/BrandBackground";
import { SafeZone } from "../layout/SafeZone";
import { FadeSlideIn } from "../animations/FadeSlideIn";
import { BrandText } from "../layout/BrandText";

export const SceneProduct: React.FC<{
  scene: SceneConfig;
  brand: BrandConfig;
  format: "9:16" | "1:1" | "4:5";
}> = ({ scene, brand, format }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryScale = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 100, mass: 1 },
  });

  const floatY = Math.sin(frame / 15) * 6;

  const glow = interpolate(frame, [0, 60, 90], [0, 0.5, 0.3], {
    extrapolateRight: "clamp",
  });

  const imgSize = format === "9:16" ? 500 : 420;

  return (
    <AbsoluteFill>
      <BrandBackground brand={brand} variant="light" />
      <SafeZone format={format}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            flex: 1,
          }}
        >
          {scene.imagePath && (
            <div
              style={{
                transform: `scale(${entryScale}) translateY(${floatY}px)`,
                filter: `drop-shadow(0 20px 50px rgba(0,0,0,${glow * 0.3}))`,
              }}
            >
              <Img
                src={staticFile(scene.imagePath)}
                style={{
                  width: imgSize,
                  height: imgSize,
                  objectFit: "cover",
                  borderRadius: 16,
                }}
              />
            </div>
          )}

          {scene.productName && (
            <FadeSlideIn delay={15}>
              <BrandText brand={brand} variant="subheadline">
                {scene.productName}
              </BrandText>
            </FadeSlideIn>
          )}

          {scene.headline && (
            <FadeSlideIn delay={20}>
              <BrandText brand={brand} variant="body" color={brand.colors.primary}>
                {scene.headline}
              </BrandText>
            </FadeSlideIn>
          )}

          {scene.price && (
            <FadeSlideIn delay={30}>
              <BrandText
                brand={brand}
                variant="headline"
                color={brand.colors.primary}
              >
                {scene.price}
              </BrandText>
            </FadeSlideIn>
          )}
        </div>
      </SafeZone>
    </AbsoluteFill>
  );
};
