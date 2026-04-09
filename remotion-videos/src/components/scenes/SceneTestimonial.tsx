import { AbsoluteFill } from "remotion";
import type { BrandConfig, SceneConfig } from "../../types/VideoConfig";
import { BrandBackground } from "../layout/BrandBackground";
import { SafeZone } from "../layout/SafeZone";
import { FadeSlideIn } from "../animations/FadeSlideIn";
import { ScaleSpring } from "../animations/ScaleSpring";
import { BrandText } from "../layout/BrandText";

export const SceneTestimonial: React.FC<{
  scene: SceneConfig;
  brand: BrandConfig;
  format: "9:16" | "1:1" | "4:5";
}> = ({ scene, brand, format }) => {
  return (
    <AbsoluteFill>
      <BrandBackground brand={brand} variant="dark" />
      <SafeZone format={format}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
            flex: 1,
          }}
        >
          <ScaleSpring delay={0}>
            <div
              style={{
                fontSize: 80,
                color: brand.colors.accent,
                fontFamily: "Georgia, serif",
                lineHeight: 1,
              }}
            >
              &ldquo;
            </div>
          </ScaleSpring>

          <FadeSlideIn delay={8}>
            <BrandText
              brand={brand}
              variant="subheadline"
              color="white"
              style={{ fontStyle: "italic", maxWidth: 700 }}
            >
              {scene.headline}
            </BrandText>
          </FadeSlideIn>

          {scene.subtext && (
            <FadeSlideIn delay={20}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 2,
                    backgroundColor: brand.colors.accent,
                  }}
                />
                <BrandText
                  brand={brand}
                  variant="body"
                  color="rgba(255,255,255,0.6)"
                >
                  {scene.subtext}
                </BrandText>
              </div>
            </FadeSlideIn>
          )}

          {scene.rating && (
            <FadeSlideIn delay={28}>
              <div style={{ display: "flex", gap: 6 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: 32,
                      color:
                        i < Math.round(scene.rating!)
                          ? brand.colors.accent
                          : "rgba(255,255,255,0.2)",
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
            </FadeSlideIn>
          )}
        </div>
      </SafeZone>
    </AbsoluteFill>
  );
};
