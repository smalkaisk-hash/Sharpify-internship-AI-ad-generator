import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import type { BrandConfig } from "../../types/VideoConfig";

type Variant = "gradient" | "radial" | "dark" | "light" | "accent";

export const BrandBackground: React.FC<{
  brand: BrandConfig;
  variant?: Variant;
  animate?: boolean;
  children?: React.ReactNode;
}> = ({ brand, variant = "gradient", animate = true, children }) => {
  const frame = useCurrentFrame();
  const { primary, secondary, accent, background, text } = brand.colors;

  const scale = animate
    ? interpolate(frame, [0, 90], [1.05, 1], { extrapolateRight: "clamp" })
    : 1;

  const backgrounds: Record<Variant, string> = {
    gradient: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
    radial: `radial-gradient(ellipse at 50% 40%, ${primary} 0%, ${darken(primary, 30)} 60%, ${darken(primary, 50)} 100%)`,
    dark: `linear-gradient(180deg, #0a0a0a 0%, ${darken(primary, 60)} 100%)`,
    light: `linear-gradient(180deg, ${background} 0%, ${lighten(primary, 85)} 40%, ${lighten(primary, 70)} 100%)`,
    accent: `linear-gradient(135deg, ${darken(accent, 30)} 0%, ${accent} 50%, ${primary} 100%)`,
  };

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: backgrounds[variant],
          transform: `scale(${scale})`,
        }}
      />
      {/* Subtle light overlay for depth */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 30% 40%, rgba(255,255,255,0.06) 0%, transparent 50%)",
        }}
      />
      {children}
    </AbsoluteFill>
  );
};

// Simple color manipulation helpers
function darken(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, (num >> 16) - Math.round(2.55 * percent));
  const g = Math.max(0, ((num >> 8) & 0x00ff) - Math.round(2.55 * percent));
  const b = Math.max(0, (num & 0x0000ff) - Math.round(2.55 * percent));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function lighten(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, (num >> 16) + Math.round(2.55 * percent));
  const g = Math.min(255, ((num >> 8) & 0x00ff) + Math.round(2.55 * percent));
  const b = Math.min(255, (num & 0x0000ff) + Math.round(2.55 * percent));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
