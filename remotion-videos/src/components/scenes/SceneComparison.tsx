import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { BrandConfig, SceneConfig } from "../../types/VideoConfig";
import { BrandBackground } from "../layout/BrandBackground";
import { SafeZone } from "../layout/SafeZone";
import { FadeSlideIn } from "../animations/FadeSlideIn";
import { BrandText } from "../layout/BrandText";

export const SceneComparison: React.FC<{
  scene: SceneConfig;
  brand: BrandConfig;
  format: "9:16" | "1:1" | "4:5";
}> = ({ scene, brand, format }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const dividerProgress = spring({
    frame: frame - 10,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const items = scene.items || [];
  const midpoint = Math.ceil(items.length / 2);
  const beforeItems = items.slice(0, midpoint);
  const afterItems = items.slice(midpoint);

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
              gap: 0,
              width: "100%",
              maxWidth: 800,
              marginTop: 16,
            }}
          >
            {/* Before column */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 12,
                padding: "0 20px",
              }}
            >
              <FadeSlideIn delay={8}>
                <BrandText
                  brand={brand}
                  variant="body"
                  color="rgba(255,255,255,0.4)"
                  style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}
                >
                  {scene.beforeLabel || "Bez"}
                </BrandText>
              </FadeSlideIn>
              {beforeItems.map((item, i) => (
                <FadeSlideIn key={i} delay={14 + i * 8} direction="left">
                  <div
                    style={{
                      fontSize: 28,
                      color: "rgba(255,255,255,0.6)",
                      fontFamily: `"${brand.fonts.body}", sans-serif`,
                      textAlign: "center",
                      padding: "10px 0",
                    }}
                  >
                    {item}
                  </div>
                </FadeSlideIn>
              ))}
            </div>

            {/* Divider */}
            <div
              style={{
                width: 3,
                backgroundColor: brand.colors.accent,
                transform: `scaleY(${dividerProgress})`,
                transformOrigin: "top",
                boxShadow: `0 0 15px ${brand.colors.accent}40`,
              }}
            />

            {/* After column */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 12,
                padding: "0 20px",
              }}
            >
              <FadeSlideIn delay={8}>
                <BrandText
                  brand={brand}
                  variant="body"
                  color={brand.colors.accent}
                  style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}
                >
                  {scene.afterLabel || "Ar"}
                </BrandText>
              </FadeSlideIn>
              {afterItems.map((item, i) => (
                <FadeSlideIn key={i} delay={14 + i * 8} direction="right">
                  <div
                    style={{
                      fontSize: 28,
                      color: "white",
                      fontFamily: `"${brand.fonts.body}", sans-serif`,
                      textAlign: "center",
                      padding: "10px 0",
                      fontWeight: 600,
                    }}
                  >
                    {item}
                  </div>
                </FadeSlideIn>
              ))}
            </div>
          </div>
        </div>
      </SafeZone>
    </AbsoluteFill>
  );
};
