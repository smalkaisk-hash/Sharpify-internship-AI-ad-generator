import { AbsoluteFill } from "remotion";

/**
 * Enforces safe margins for social media overlays (profile, captions, UI chrome).
 * For 9:16 Reels: top 150px, bottom 170px, sides 60px.
 * For 1:1 feed: smaller margins (40px all around).
 */
export const SafeZone: React.FC<{
  children: React.ReactNode;
  format?: "9:16" | "1:1" | "4:5";
}> = ({ children, format = "1:1" }) => {
  const padding =
    format === "9:16"
      ? { top: 150, bottom: 170, left: 60, right: 60 }
      : { top: 40, bottom: 40, left: 40, right: 40 };

  return (
    <AbsoluteFill
      style={{
        paddingTop: padding.top,
        paddingBottom: padding.bottom,
        paddingLeft: padding.left,
        paddingRight: padding.right,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
