import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { BrandConfig, SceneConfig } from "../../types/VideoConfig";
import { BrandBackground } from "../layout/BrandBackground";
import { SafeZone } from "../layout/SafeZone";
import { FadeSlideIn } from "../animations/FadeSlideIn";
import { BrandText } from "../layout/BrandText";

export const SceneCTA: React.FC<{
  scene: SceneConfig;
  brand: BrandConfig;
  format: "9:16" | "1:1" | "4:5";
}> = ({ scene, brand, format }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pulse = 1 + Math.sin(frame / 8) * 0.025;

  const btnSpring = spring({
    frame: frame - 18,
    fps,
    config: { damping: 12, stiffness: 150, mass: 0.8 },
  });

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
            gap: 20,
            flex: 1,
          }}
        >
          {brand.name && (
            <FadeSlideIn delay={0}>
              <BrandText
                brand={brand}
                variant="caption"
                color="rgba(255,255,255,0.6)"
                style={{ letterSpacing: "0.12em", textTransform: "uppercase" }}
              >
                {brand.name}
              </BrandText>
            </FadeSlideIn>
          )}

          <FadeSlideIn delay={6}>
            <BrandText brand={brand} variant="headline" color="white">
              {scene.headline}
            </BrandText>
          </FadeSlideIn>

          {scene.subtext && (
            <FadeSlideIn delay={12}>
              <BrandText
                brand={brand}
                variant="body"
                color={brand.colors.accent}
              >
                {scene.subtext}
              </BrandText>
            </FadeSlideIn>
          )}

          <div
            style={{
              marginTop: 24,
              transform: `scale(${btnSpring * pulse})`,
            }}
          >
            <div
              style={{
                backgroundColor: brand.colors.ctaBg,
                color: brand.colors.ctaText,
                fontSize: 32,
                fontWeight: 700,
                fontFamily: `"${brand.fonts.heading}", sans-serif`,
                padding: "20px 56px",
                borderRadius: 50,
                letterSpacing: "0.04em",
                boxShadow: `0 8px 30px ${brand.colors.ctaBg}50`,
              }}
            >
              {scene.items?.[0] || "UZZINI VAIRĀK"}
            </div>
          </div>

          {brand.website && (
            <FadeSlideIn delay={22}>
              <BrandText
                brand={brand}
                variant="caption"
                color="rgba(255,255,255,0.5)"
              >
                {brand.website.replace(/^https?:\/\/www\./, "")}
              </BrandText>
            </FadeSlideIn>
          )}
        </div>
      </SafeZone>
    </AbsoluteFill>
  );
};
