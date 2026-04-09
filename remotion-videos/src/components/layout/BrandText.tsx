import type { BrandConfig } from "../../types/VideoConfig";

type TextVariant = "headline" | "subheadline" | "body" | "caption" | "cta";

const VARIANT_STYLES: Record<TextVariant, React.CSSProperties> = {
  headline: { fontSize: 64, fontWeight: 700, lineHeight: 1.2 },
  subheadline: { fontSize: 42, fontWeight: 600, lineHeight: 1.3 },
  body: { fontSize: 32, fontWeight: 400, lineHeight: 1.5 },
  caption: { fontSize: 24, fontWeight: 400, lineHeight: 1.4 },
  cta: { fontSize: 34, fontWeight: 700, lineHeight: 1, letterSpacing: "0.05em" },
};

export const BrandText: React.FC<{
  brand: BrandConfig;
  variant?: TextVariant;
  color?: string;
  align?: "center" | "left" | "right";
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ brand, variant = "body", color, align = "center", children, style }) => {
  const isHeading = variant === "headline" || variant === "subheadline";
  const fontFamily = isHeading ? brand.fonts.heading : brand.fonts.body;
  const textColor = color || brand.colors.text;

  return (
    <div
      style={{
        fontFamily: `"${fontFamily}", sans-serif`,
        color: textColor,
        textAlign: align,
        ...VARIANT_STYLES[variant],
        ...style,
      }}
    >
      {children}
    </div>
  );
};
