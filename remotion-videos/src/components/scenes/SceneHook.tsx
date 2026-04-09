import { AbsoluteFill } from "remotion";
import type { BrandConfig, SceneConfig } from "../../types/VideoConfig";
import { BrandBackground } from "../layout/BrandBackground";
import { SafeZone } from "../layout/SafeZone";
import { FadeSlideIn } from "../animations/FadeSlideIn";
import { BrandText } from "../layout/BrandText";

export const SceneHook: React.FC<{
  scene: SceneConfig;
  brand: BrandConfig;
  format: "9:16" | "1:1" | "4:5";
}> = ({ scene, brand, format }) => {
  return (
    <AbsoluteFill>
      <BrandBackground brand={brand} variant="radial" />
      <SafeZone format={format}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            flex: 1,
          }}
        >
          <FadeSlideIn delay={5}>
            <BrandText brand={brand} variant="headline" color="white">
              {scene.headline}
            </BrandText>
          </FadeSlideIn>

          {scene.subtext && (
            <FadeSlideIn delay={18}>
              <div
                style={{
                  width: 80,
                  height: 3,
                  backgroundColor: brand.colors.accent,
                  marginTop: 16,
                  marginBottom: 16,
                  boxShadow: `0 0 20px ${brand.colors.accent}40`,
                }}
              />
            </FadeSlideIn>
          )}

          {scene.subtext && (
            <FadeSlideIn delay={24}>
              <BrandText
                brand={brand}
                variant="body"
                color="rgba(255,255,255,0.85)"
              >
                {scene.subtext}
              </BrandText>
            </FadeSlideIn>
          )}
        </div>
      </SafeZone>
    </AbsoluteFill>
  );
};
