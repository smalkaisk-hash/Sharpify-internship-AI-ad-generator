import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from "remotion";
import type { BrandConfig, SceneConfig } from "../../types/VideoConfig";
import { BrandBackground } from "../layout/BrandBackground";
import { SafeZone } from "../layout/SafeZone";
import { FadeSlideIn } from "../animations/FadeSlideIn";
import { BrandText } from "../layout/BrandText";

export const SceneStats: React.FC<{
  scene: SceneConfig;
  brand: BrandConfig;
  format: "9:16" | "1:1" | "4:5";
}> = ({ scene, brand, format }) => {
  const frame = useCurrentFrame();
  const items = scene.items || [];

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
          <FadeSlideIn delay={0}>
            <BrandText brand={brand} variant="subheadline" color="white">
              {scene.headline}
            </BrandText>
          </FadeSlideIn>

          <div
            style={{
              display: "flex",
              gap: 40,
              marginTop: 20,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {items.map((item, i) => {
              // Parse "2300+ apmierināti klienti" → number + label
              const match = item.match(/^([\d,.]+\+?)\s+(.+)$/);
              const numStr = match?.[1] || item;
              const label = match?.[2] || "";
              const targetNum = parseFloat(numStr.replace(/[+,]/g, ""));

              const countProgress = interpolate(
                frame,
                [10 + i * 12, 40 + i * 12],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );
              const displayNum = Math.round(targetNum * countProgress);
              const suffix = numStr.includes("+") ? "+" : "";

              return (
                <FadeSlideIn key={i} delay={8 + i * 12} direction="up">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 8,
                      minWidth: 180,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 56,
                        fontWeight: 800,
                        color: brand.colors.accent,
                        fontFamily: `"${brand.fonts.heading}", sans-serif`,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {displayNum.toLocaleString()}
                      {suffix}
                    </div>
                    <BrandText
                      brand={brand}
                      variant="caption"
                      color="rgba(255,255,255,0.6)"
                    >
                      {label}
                    </BrandText>
                  </div>
                </FadeSlideIn>
              );
            })}
          </div>
        </div>
      </SafeZone>
    </AbsoluteFill>
  );
};
