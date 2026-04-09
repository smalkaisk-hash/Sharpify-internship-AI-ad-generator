import { AbsoluteFill } from "remotion";
import type { BrandConfig, SceneConfig } from "../../types/VideoConfig";
import { BrandBackground } from "../layout/BrandBackground";
import { SafeZone } from "../layout/SafeZone";
import { FadeSlideIn } from "../animations/FadeSlideIn";
import { BrandText } from "../layout/BrandText";

export const SceneBenefits: React.FC<{
  scene: SceneConfig;
  brand: BrandConfig;
  format: "9:16" | "1:1" | "4:5";
}> = ({ scene, brand, format }) => {
  const items = scene.items || [];

  return (
    <AbsoluteFill>
      <BrandBackground brand={brand} variant="accent" />
      <SafeZone format={format}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            flex: 1,
            width: "100%",
          }}
        >
          <FadeSlideIn delay={0}>
            <BrandText brand={brand} variant="subheadline" color="white">
              {scene.headline}
            </BrandText>
          </FadeSlideIn>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              marginTop: 20,
              width: "100%",
              maxWidth: 700,
            }}
          >
            {items.map((item, i) => (
              <FadeSlideIn key={i} delay={10 + i * 10} direction="left">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    backgroundColor: "rgba(255,255,255,0.12)",
                    backdropFilter: "blur(10px)",
                    borderRadius: 14,
                    padding: "16px 28px",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: brand.colors.accent,
                      flexShrink: 0,
                      boxShadow: `0 0 12px ${brand.colors.accent}`,
                    }}
                  />
                  <BrandText brand={brand} variant="body" color="white" align="left">
                    {item}
                  </BrandText>
                </div>
              </FadeSlideIn>
            ))}
          </div>
        </div>
      </SafeZone>
    </AbsoluteFill>
  );
};
